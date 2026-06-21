var settings = require('util/settings/settings.js')

function initialize () {
  var toggleButton = document.getElementById('mai-toggle-button')
  
  // Ecoute sur le paramètre mAI
  settings.listen('enableMaiSidebar', function (value) {
    if (value === true) {
      toggleButton.style.display = 'inline-block'
    } else {
      toggleButton.style.display = 'none'
      document.body.classList.remove('mai-sidebar-open')
    }
  })

  // Logique du bouton toggle
  toggleButton.addEventListener('click', function () {
    if (document.body.classList.contains('mai-sidebar-open')) {
      document.body.classList.remove('mai-sidebar-open')
    } else {
      document.body.classList.add('mai-sidebar-open')
    }
  })
}

module.exports = {
  initialize
}
