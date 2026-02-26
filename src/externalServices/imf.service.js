// externalServices/imf.service.js
import axios from "axios";

const IMF_BASE_URL = "https://www.imf.org/external/datamapper/api/v1";

/*
Fetch full indicator catalog (smallish JSON)
Returns array of indicators or throws.
s*/
 async function fetchIMFIndicatorsCatalog() {
  const url = `${IMF_BASE_URL}/indicators`;
  const res = await axios.get(url, { timeout: 15000 });
  // res.data should be an array or object containing indicator entries
  return res.data;
}

/**
 * Find best-matching indicators from the catalog for a set of keywords.
 * - catalog: whatever fetchIMFIndicatorsCatalog() returned
 * - keywords: ['policy','interest','rate'] etc.
 * Returns an array of candidate indicators sorted by simple score.
 */
 function findIndicatorsByKeywords(catalog, keywords = []) {
  if (!catalog || !Array.isArray(catalog)) return [];

  const kw = keywords.map(k => k.toLowerCase());

  // Score simple text-match on label + description
  const scored = catalog.map(ind => {
    const label = (ind.label || "").toString().toLowerCase();
    const desc = (ind.description || "").toString().toLowerCase();
    let score = 0;
    for (const k of kw) {
      if (label.includes(k)) score += 3;
      if (desc.includes(k)) score += 1;
    }
    return { indicator: ind, score };
  });

  // Return sorted positive-scored items
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.indicator);
}

/**
 * Fetch indicator values for a given IMF indicator code and ISO3 country.
 * Returns the raw API response JSON.
 */
async function fetchIMFIndicatorValues(indicatorCode, iso3) {
  const url = `${IMF_BASE_URL}/${indicatorCode}/${iso3}`;
  const res = await axios.get(url, { timeout: 15000 });
  return res.data;
}

export {fetchIMFIndicatorsCatalog,findIndicatorsByKeywords,fetchIMFIndicatorValues}