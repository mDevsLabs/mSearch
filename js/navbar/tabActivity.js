/* fades out tabs that are inactive */

var tabBar = require('navbar/tabBar.js')

var tabs = window.tabs
var tasks = window.tasks

var tabActivity = {
  minFadeAge: 330000,
  refresh: function () {
    requestAnimationFrame(function () {
      var tabSet = tabs.get()
      var selected = tabs.getSelected()
      var time = Date.now()

      tabSet.forEach(function (tab) {
        var tabEl = tabBar.getTab(tab.id)
        if (selected === tab.id) {
          tabEl.classList.remove('fade')
        } else if (time - tab.lastActivity > tabActivity.minFadeAge) {
          tabEl.classList.add('fade')
        } else {
          tabEl.classList.remove('fade')
        }
      })
    })
  },
  initialize: function () {
    setInterval(tabActivity.refresh, 7500)

    tasks.on('tab-selected', this.refresh)
  }
}

module.exports = tabActivity
