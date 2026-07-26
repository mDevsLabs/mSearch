## 2024-05-24 - Pre-calculating concatenated search text in placesSearch

**Learning:** In `js/places/placesSearch.js`, `processSearchItem` is called for every item in the history database on every keystroke during a search. It concatenates `item.searchTextCache.url`, `item.searchTextCache.title`, and `item.tags` into a single string `itext` on the fly. This string concatenation creates unnecessary object allocations and slows down search significantly.
**Action:** By pre-calculating this concatenated string and storing it in `searchTextCache.entireText` when the history cache is built, we can avoid concatenating strings inside the tight search loop, improving search performance.

## 2024-05-18 - Array deduplication with indexOf is O(N^2)
**Learning:** Using `array.filter((t, i) => array.indexOf(t) === i)` to deduplicate arrays creates an O(N^2) operation because `indexOf` scans the array from the beginning for every single element. In cases where strings/tokens are being processed, this can cause significant slowdowns.
**Action:** Always use `[...new Set(array)]` (or `Array.from(new Set(array))`) when deduplicating elements to achieve O(N) performance. Also, double-check that functions generating already-unique items aren't being redundantly deduplicated by their callers.
