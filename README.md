# Technology Cost Intelligence prototype

Open `index.html` in a browser, or run `python3 -m http.server 8765` and visit http://localhost:8765.
No build step or external dependencies are required.

## Views

- **Technology usage**: select a technology in the sidebar or spend chart, then choose **Explore SPI usage**. Search by SPI ID/name, filter by environment, and select an SPI ID for its usage details. Back navigation preserves list filters.
- **Cost allocation & scenarios**: the existing EUR allocation demo, including technology/SPI filters and retain/replatform/sunset scenarios.

The usage view uses illustrative DKK contract data from the reference sketch. Illumio has 133 SPIs and 1,860 installations, including the ten named examples. Remaining records and other technology inventories are generated demo data. MDB metadata is illustrative; there is no live integration. Installation share is a percentage of the full technology inventory, even when filtered, and does not allocate contract spend. The EUR and DKK demos are separate datasets, not currency conversions.

## Validation

Run `node --test tests/usage-data.test.js` to verify reference totals, filtering, percentages, and inventory consistency.
