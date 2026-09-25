(() => {
  const {technologies, totalUnits, share, filterRows} = UsageData;
  const app = document.querySelector('#usage-app');
  const state = {technology: 'Illumio', page: 'overview', spi: null, search: '', environment: 'all'};
  const number = value => value.toLocaleString('en-US');
  const money = value => `DKK ${number(value / 1e6)}M`;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
  const current = () => technologies.find(item => item.name === state.technology);
  const metrics = technology => `<aside class="usage-summary"><p class="eyebrow">Centralized contract</p><h2>${technology.name}</h2><dl>
    <div><dt>Annual contract spend</dt><dd>${money(technology.spend)}</dd></div>
    <div><dt>SPIs using this technology</dt><dd>${number(technology.inventory.length)}</dd></div>
    <div><dt>Total installations <span title="Illustrative inventory units, such as agents, workloads or policies. Units differ by technology.">ⓘ</span></dt><dd>${number(totalUnits(technology))}</dd></div>
    <div><dt>Contract period</dt><dd>${technology.contract}</dd></div></dl>
    ${state.page === 'overview' ? '<button data-action="list">Explore SPI usage →</button>' : ''}</aside>`;
  function overview() {
    const technology = current();
    const topTen = [...technologies].sort((a,b) => b.spend - a.spend).slice(0,10);
    return `<div class="usage-heading"><div><p class="eyebrow">Contract & inventory intelligence</p><h1>Technology overview</h1><p>See what we spend and where technology is used.</p></div><span class="usage-badge">Annual spend · DKK</span></div>
      <div class="overview-layout"><section class="card technology-picker"><h2>Technology</h2><button data-tech="all" aria-pressed="${!technology}">All technologies</button>${technologies.map(item => `<button data-tech="${item.name}" aria-pressed="${item === technology}">${item.name}</button>`).join('')}</section>
      <section class="card spend-chart"><div class="title"><h2>Contract spend by technology</h2><span>Top 10</span></div><p class="muted">Select a technology to see its contract and usage.</p>${topTen.map(item => `<button class="spend-row" data-tech="${item.name}" aria-pressed="${item === technology}"><span>${item.name}</span><span class="track"><span class="bar" style="width:${item.spend / topTen[0].spend * 100}%"></span></span><span class="money">${number(item.spend / 1e6)}M</span></button>`).join('')}</section>
      ${technology ? metrics(technology) : `<aside class="usage-summary"><h2>All technologies</h2><dl><div><dt>Total annual contract spend</dt><dd>${money(technologies.reduce((sum, item) => sum + item.spend, 0))}</dd></div><div><dt>Technology categories</dt><dd>${technologies.length}</dd></div></dl><p>Select a technology to explore its SPIs and installations.</p></aside>`}</div>
      ${technology ? `<section class="takeaways"><h2>Key takeaways — ${technology.name}</h2><ul><li>${technology.name} is used by ${number(technology.inventory.length)} SPIs with ${number(totalUnits(technology))} installations.</li><li>Annual spend is ${money(technology.spend)} under a centralized contract.</li><li>The 10 largest SPIs account for ${(filterRows(technology, '', 'all').slice(0, 10).reduce((sum, row) => sum + row.installations, 0) / totalUnits(technology) * 100).toFixed(1)}% of installations.</li></ul><p>Use the inventory to inform renewal, renegotiation and decommissioning discussions.</p></section>` : ''}`;
  }
  function list() {
    const technology = current();
    return `<button class="back-button" data-action="overview">← Back to overview</button><div class="usage-heading"><div><p class="eyebrow">Technology usage / ${technology.name}</p><h1>SPIs using ${technology.name}</h1><p>Installation share is based on the full technology inventory.</p></div></div><div class="list-layout">${metrics(technology)}<section class="card inventory-card"><div class="inventory-tools"><label>Search SPI<input id="usage-search" type="search" placeholder="SPI ID or name…" value="${escape(state.search)}"></label><label>Environment<select id="usage-environment"><option value="all">All environments</option>${['Production', 'Non-production', 'Production & non-production'].map(environment => `<option ${state.environment === environment ? 'selected' : ''}>${escape(environment)}</option>`).join('')}</select></label></div><p id="usage-result-count" class="muted" aria-live="polite"></p><div class="table-scroll"><table class="inventory-table"><thead><tr><th scope="col">SPI ID</th><th scope="col">SPI name</th><th scope="col">Installations</th><th scope="col">% of total</th></tr></thead><tbody id="usage-rows"></tbody></table></div><p class="muted">Select an SPI ID to view inventory details. Generated example services complete the illustrative inventory.</p></section></div>`;
  }
  function updateRows() {
    const technology = current();
    const rows = filterRows(technology, state.search, state.environment);
    document.querySelector('#usage-result-count').textContent = `${rows.length} of ${technology.inventory.length} SPIs`;
    document.querySelector('#usage-rows').innerHTML = rows.length ? rows.map(row => `<tr><td><button class="spi-link" data-spi="${row.id}">${row.id}</button></td><td>${escape(row.name)}</td><td>${number(row.installations)}</td><td>${share(technology, row).toFixed(1)}%</td></tr>`).join('') : '<tr><td colspan="4" class="empty-state">No SPIs match these filters. Try another name or environment.</td></tr>';
  }
  function detail() {
    const technology = current(), row = technology.inventory.find(item => item.id === state.spi);
    return `<button class="back-button" data-action="list">← Back to SPIs list</button><div class="usage-heading"><div><p class="eyebrow">${technology.name} / SPI detail</p><h1>${row.id} — ${escape(row.name)}</h1></div></div><section class="card spi-detail"><h2>${technology.name} usage</h2><div class="usage-numbers"><div><span>Installations (units)</span><strong>${number(row.installations)}</strong></div><div><span>Share of technology total</span><strong>${share(technology, row).toFixed(1)}%</strong></div></div><dl><div><dt>Data source</dt><dd>${technology.source} · last updated ${technology.updated}</dd></div><div><dt>Environment</dt><dd>${escape(row.environment)}</dd></div><div><dt>Notes</dt><dd>Covering workloads in ${row.environment.toLowerCase()} environments. This is illustrative inventory data; installation share does not represent an assigned share of contract spend.</dd></div></dl></section>`;
  }
  function render(focusHeading = false) {
    app.innerHTML = (state.page === 'overview' ? overview() : state.page === 'list' ? list() : detail()) + '<p class="prototype-note">Prototype data only. Contract figures are in DKK; the separate cost allocation demo uses EUR. No live MDB connection.</p>';
    if (state.page === 'list') {
      updateRows();
      document.querySelector('#usage-search').addEventListener('input', event => {state.search = event.target.value; updateRows();});
      document.querySelector('#usage-environment').addEventListener('change', event => {state.environment = event.target.value; updateRows();});
    }
    if (focusHeading) {const heading = app.querySelector('h1'); heading.tabIndex = -1; heading.focus();}
  }
  app.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.tech) {state.technology = button.dataset.tech; state.search = ''; state.environment = 'all'; render();}
    if (button.dataset.action) {state.page = button.dataset.action; render(true);}
    if (button.dataset.spi) {state.spi = button.dataset.spi; state.page = 'detail'; render(true);}
  });
  for (const name of ['usage', 'cost']) document.querySelector(`#${name}-tab`).addEventListener('click', () => {
    for (const view of ['usage', 'cost']) {
      document.querySelector(`#${view}-app`).hidden = view !== name;
      document.querySelector(`#${view}-tab`).setAttribute('aria-pressed', String(view === name));
    }
  });
  render();
})();
