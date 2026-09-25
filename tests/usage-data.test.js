const test = require('node:test');
const assert = require('node:assert/strict');
const {technologies, totalUnits, share, filterRows} = require('../usage-data.js');
const illumio = technologies.find(technology => technology.name === 'Illumio');

test('Illumio inventory reconciles with the reference figures', () => {
  assert.equal(illumio.spend, 75000000);
  assert.equal(illumio.inventory.length, 133);
  assert.equal(totalUnits(illumio), 1860);
  const portal = illumio.inventory.find(row => row.id === 'ACDC1234');
  assert.equal(portal.installations, 220);
  assert.equal(share(illumio, portal).toFixed(1), '11.8');
});

test('search and environment filters preserve full-inventory share', () => {
  assert.equal(filterRows(illumio, ' acdc1234 ', 'all').length, 1);
  const matches = filterRows(illumio, 'CUSTOMER PORTAL', 'all');
  assert.equal(matches[0].id, 'ACDC1234');
  assert.equal(share(illumio, matches[0]).toFixed(1), '11.8');
  assert.equal(filterRows(illumio, 'missing', 'all').length, 0);
  assert.equal(filterRows(illumio, 'Customer', 'Production').length, 0);
  const production = filterRows(illumio, '', 'Production');
  assert(production.length > 0);
  assert(production.every(row => row.environment === 'Production'));
});

test('every technology has distinct SPI IDs, positive units, and complete shares', () => {
  for (const technology of technologies) {
    const rows = filterRows(technology, '', 'all');
    assert.equal(new Set(rows.map(row => row.id)).size, rows.length);
    assert(rows.every(row => Number.isInteger(row.installations) && row.installations > 0));
    assert(rows.every((row, index) => !index || rows[index - 1].installations >= row.installations));
    assert(Math.abs(rows.reduce((sum, row) => sum + share(technology, row), 0) - 100) < 1e-9);
  }
});
