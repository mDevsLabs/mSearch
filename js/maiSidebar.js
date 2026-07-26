var settings = require('util/settings/settings.js')

function initialize() {
  var toggleButton = document.getElementById('mai-toggle-button')

  // Ecoute sur le paramètre mAI
  settings.listen('enableMaiSidebar', function (value) {
    if (value === true) {
      toggleButton.style.display = 'inline-block'
    } else {
      mnotesTextarea.value = ''
      mnotesTextarea.disabled = true
      mnotesTextarea.placeholder = "Notes indisponibles sur les pages internes."
      mnotesStatus.textContent = ""
    }
  }

  function saveNote() {
    var key = getDomainKey(currentUrl)
    if (key) {
      localStorage.setItem(key, mnotesTextarea.value)
      mnotesStatus.textContent = "Enregistrement en cours..."
      setTimeout(function() {
        mnotesStatus.textContent = "Modifications enregistrées localement"
      }, 300)
    }
  }

  // Gestion des clics sur les onglets de la barre latérale
  tabAi.addEventListener('click', function() {
    tabAi.classList.add('active')
    tabNotes.classList.remove('active')
    iframeContainer.style.display = 'block'
    mnotesContainer.style.display = 'none'
    hideError()
    hideLoading()
    if (iframe && (iframe.src === '' || iframe.src === 'about:blank')) {
      loadMaiIframe()
    }
  })

  tabNotes.addEventListener('click', function() {
    tabNotes.classList.add('active')
    tabAi.classList.remove('active')
    iframeContainer.style.display = 'none'
    mnotesContainer.style.display = 'flex'
    loading.classList.remove('visible')
    error.classList.remove('visible')
    loadNote()
  })

  mnotesTextarea.addEventListener('input', saveNote)

  // Écoute de la navigation pour synchroniser les notes
  tasks.on('tab-selected', function(tabId) {
    if (document.body.classList.contains('mai-sidebar-open') && tabNotes.classList.contains('active')) {
      loadNote()
    }
  })

  tasks.on('tab-updated', function(tabId, key, value) {
    if (key === 'url' && tabId === tasks.getSelected().tabs.getSelected()) {
      if (document.body.classList.contains('mai-sidebar-open') && tabNotes.classList.contains('active')) {
        loadNote()
      }
    }
  })

  function toggleDropdown() {
    dropdown.classList.toggle('open')
  }

  function closeSidebar() {
    document.body.classList.remove('mai-sidebar-open')
    settings.set('enableMaiSidebar', false)
    dropdown.classList.remove('open')
  }

  function reloadSidebar() {
    retryCount = 0
    if (tabAi.classList.contains('active') && iframe) {
      iframe.src = maiUrl
    } else if (tabNotes.classList.contains('active')) {
      loadNote()
    }
    dropdown.classList.remove('open')
  }

  function openSettings() {
    window.location.href = 'msearch://app/pages/settings/index.html'
    dropdown.classList.remove('open')
  }

  function attachDropdownListeners() {
    var dropdownItems = dropdown.querySelectorAll('[data-action]')
    dropdownItems.forEach(function(item) {
      item.addEventListener('click', function() {
        var action = this.dataset.action
        if (action === 'close-sidebar') {
          closeSidebar()
        } else if (action === 'reload') {
          reloadSidebar()
        } else if (action === 'settings') {
          openSettings()
        }
      })
    })
  }

  function handleOutsideClick(e) {
    if (dropdown.classList.contains('open') && !dropdown.contains(e.target) && !menuButton.contains(e.target)) {
      dropdown.classList.remove('open')
    }
  }

  toggleButton.addEventListener('click', function() {
    if (document.body.classList.contains('mai-sidebar-open')) {
      document.body.classList.remove('mai-sidebar-open')
    } else {
      document.body.classList.add('mai-sidebar-open')
      if (tabAi.classList.contains('active')) {
        setTimeout(loadMaiIframe, 100)
      } else if (tabNotes.classList.contains('active')) {
        loadNote()
      }
    }
  })

  closeButton.addEventListener('click', function(e) {
    e.stopPropagation()
    closeSidebar()
  })

  menuButton.addEventListener('click', function(e) {
    e.stopPropagation()
    toggleDropdown()
  })

  errorButton.addEventListener('click', function() {
    retryCount = 0
    loadMaiIframe()
  })

  settings.listen('enableMaiSidebar', function(value) {
    if (value === true) {
      toggleButton.style.display = 'inline-block'
    } else {
      toggleButton.style.display = 'none'
      document.body.classList.remove('mai-sidebar-open')
      dropdown.classList.remove('open')
    }
  })

  document.addEventListener('click', handleOutsideClick)
  attachDropdownListeners()
}

module.exports = {
  initialize
}