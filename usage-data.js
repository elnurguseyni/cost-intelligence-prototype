/* Illustrative contract and inventory data, independent of the EUR allocation demo. */
const UsageData = (() => {
  const samples = [
    ['ACDC1234', 'Customer Portal', 220], ['BFGH5678', 'Mobile Banking', 180],
    ['KLMN9012', 'Payments Platform', 150], ['PQRS3456', 'Corp Services', 120],
    ['WXYZ7890', 'Risk Analytics', 95], ['EFGH2468', 'Trading Platform', 90],
    ['IJKL1122', 'HR Systems', 75], ['MNOP3344', 'Finance Data Hub', 60],
    ['QRST5566', 'Identity & Access', 55], ['UVWX7788', 'Messaging Platform', 50]
  ];
  const specs = [
    ['VMware', 410, 180, 6400], ['Microsoft', 380, 170, 5200],
    ['Red Hat', 210, 110, 3100], ['Commvault', 160, 95, 2400],
    ['Windows', 120, 160, 4200], ['Others', 120, 80, 1600],
    ['Illumio', 75, 133, 1860], ['NetApp', 60, 60, 1200],
    ['Cisco', 55, 75, 1500], ['Oracle', 50, 45, 900]
  ];
  const technologies = specs.map(([name, millions, count, total], index) => {
    const leading = samples.map(([id, label, units]) => ({
      id, name: label, installations: name === 'Illumio' ? units : Math.round(total * units / 1860)
    }));
    const remainder = total - leading.reduce((sum, row) => sum + row.installations, 0);
    const tailCount = count - leading.length;
    const inventory = leading.concat(Array.from({length: tailCount}, (_, i) => ({
      id: `SPI${String(i + 1001).padStart(4, '0')}`,
      name: `Example service ${String(i + 11).padStart(3, '0')}`,
      installations: Math.floor(remainder / tailCount) + (i < remainder % tailCount ? 1 : 0)
    }))).map((row, i) => ({...row, environment: i % 3 === 0 ? 'Production & non-production' : i % 3 === 1 ? 'Production' : 'Non-production'}));
    return {name, spend: millions * 1e6, contract: name === 'Illumio' ? '2024 – 2027' : `${2023 + index % 3} – ${2026 + index % 3}`,
      source: 'MDB (illustrative)', updated: '2026-09-20', inventory};
  });
  const totalUnits = technology => technology.inventory.reduce((sum, row) => sum + row.installations, 0);
  const share = (technology, row) => row.installations / totalUnits(technology) * 100;
  const filterRows = (technology, search, environment) => technology.inventory
    .filter(row => `${row.id} ${row.name}`.toLowerCase().includes(search.trim().toLowerCase()))
    .filter(row => environment === 'all' || row.environment === environment)
    .sort((a, b) => b.installations - a.installations || a.id.localeCompare(b.id));
  return {technologies, totalUnits, share, filterRows};
})();
if (typeof module !== 'undefined') module.exports = UsageData;
