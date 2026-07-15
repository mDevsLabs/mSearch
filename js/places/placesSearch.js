/* global spacesRegex historyInMemoryCache calculateHistoryScore oneDayInMS */

/* depends on placesWorker.js */

function searchFormatTitle (text) {
  return text.toLowerCase().replace(spacesRegex, ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function searchFormatURL (text) {
  return text.toLowerCase().split('?')[0].replace('http://', '').replace('https://', '').replace('www.', '').replace(spacesRegex, ' ')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function getSearchTextCache (item) {
  const title = searchFormatTitle(item.title)
  const url = searchFormatURL(item.url)
  let entireText = url

  if (item.url !== item.title) {
    entireText += ' ' + title
  }

  if (item.tags) {
    entireText += ' ' + item.tags.join(' ')
  }

  return {
    title,
    url,
    entireText
  }
}

function searchPlaces (searchText, callback, options) {
  function processSearchItem (item) {
    if (limitToBookmarks && !item.isBookmarked) {
      return
    }
    const itext = item.searchTextCache.entireText

    const tindex = itext.indexOf(st)

    if (tindex === 0) {
      item.boost = itemStartBoost
      matches.push(item)
    } else if (tindex !== -1) {
      item.boost = exactMatchBoost
      matches.push(item)
    } else {
      if (substringSearchEnabled) {
        let substringMatch = true

        for (let i = 0; i < swl; i++) {
          if (itext.indexOf(searchWords[i]) === -1) {
            substringMatch = false
            break
          }
        }

        if (substringMatch) {
          item.boost = 0.125 * swl + (0.02 * stl)
          matches.push(item)
          return
        }
      }

      if ((item.visitCount > 2 && item.lastVisit > oneWeekAgo) || item.lastVisit > oneDayAgo) {
        const score = Math.max(quickScore.quickScore(item.searchTextCache.url.substring(0, 100), st), quickScore.quickScore(item.searchTextCache.title.substring(0, 50), st))
        if (score > 0.3) {
          item.boost = score * 0.33
          matches.push(item)
        }
      }
    }
  }

  const oneDayAgo = Date.now() - oneDayInMS
  const oneWeekAgo = Date.now() - oneDayInMS * 7

  const matches = []
  const st = searchFormatURL(searchText)
  const stl = searchText.length
  const searchWords = st.split(' ')
  const swl = searchWords.length
  let substringSearchEnabled = false
  const itemStartBoost = Math.min(2.5 * stl, 10)
  const exactMatchBoost = 0.4 + (0.075 * stl)
  const limitToBookmarks = options && options.searchBookmarks
  const resultsLimit = (options && options.limit) || 100

  if (searchText.indexOf(' ') !== -1) {
    substringSearchEnabled = true
  }

  for (let i = 0; i < historyInMemoryCache.length; i++) {
    if (matches.length > resultsLimit * 2) {
      break
    }
    processSearchItem(historyInMemoryCache[i])
  }

  matches.sort(function (a, b) {
    return calculateHistoryScore(b) - calculateHistoryScore(a)
  })

  matches.forEach(function (match) {
    match.boost = 0
  })

  callback(matches.slice(0, resultsLimit))
}
