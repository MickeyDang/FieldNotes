const { isEqual } = require('lodash');

interface SearchParameters {
  keywords?: string[];
  coordinates?: number[];
  timeRange?: number[];
}

export type Cache = {
  cachedSearch?: SearchParameters;
  cachedResult?: object;
}

const LRUCache = {} as Cache;

module.exports.getCachedResult = () => {
  console.log('Search matches. Getting cached result.');
  return LRUCache.cachedResult ?? { reports: [], relationships: [] };
};

module.exports.cacheSearch = (search: SearchParameters) => {
  console.log('Caching search.');
  LRUCache.cachedSearch = search;
};

module.exports.cacheResult = (result: object) => {
  console.log('Caching result.');
  LRUCache.cachedResult = result;
};

module.exports.isCached = (search: SearchParameters) => {
  if (LRUCache.cachedSearch) {
    const { cachedSearch } = LRUCache;
    return isEqual(search.keywords, cachedSearch.keywords)
      && isEqual(search.coordinates, cachedSearch.coordinates)
      && isEqual(search.timeRange, cachedSearch.timeRange);
  }
  console.log('Search does not match.');
  return false;
};
