var regedit = require('regedit')

var installPath = process.execPath

var keysToCreate = [
  'HKCU\\Software\\Classes\\mSearch',
  'HKCU\\Software\\Classes\\mSearch\\Application',
  'HKCU\\Software\\Classes\\mSearch\\DefaulIcon',
  'HKCU\\Software\\Classes\\mSearch\\shell\\open\\command',
  'HKCU\\Software\\Clients\\StartMenuInternet\\mSearch\\Capabilities\\FileAssociations',
  'HKCU\\Software\\Clients\\StartMenuInternet\\mSearch\\Capabilities\\StartMenu',
  'HKCU\\Software\\Clients\\StartMenuInternet\\mSearch\\Capabilities\\URLAssociations',
  'HKCU\\Software\\Clients\\StartMenuInternet\\mSearch\\DefaultIcon',
  'HKCU\\Software\\Clients\\StartMenuInternet\\mSearch\\InstallInfo',
  'HKCU\\Software\\Clients\\StartMenuInternet\\mSearch\\shell\\open\\command'
]

var registryConfig = {
  'HKCU\\Software\\RegisteredApplications': {
    mSearch: {
      value: 'Software\\Clients\\StartMenuInternet\\mSearch\\Capabilities',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Classes\\mSearch': {
    default: {
      value: 'mSearch Browser Document',
      type: 'REG_DEFAULT'
    }
  },
  'HKCU\\Software\\Classes\\mSearch\\Application': {
    ApplicationIcon: {
      value: installPath + ',0',
      type: 'REG_SZ'
    },
    ApplicationName: {
      value: 'mSearch',
      type: 'REG_SZ'
    },
    AppUserModelId: {
      value: 'mSearch',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Classes\\mSearch\\DefaulIcon': {
    ApplicationIcon: {
      value: installPath + ',0',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Classes\\mSearch\\shell\\open\\command': {
    default: {
      value: '"' + installPath + '" "%1"',
      type: 'REG_DEFAULT'
    }
  },
  'HKCU\\Software\\Classes\\.htm\\OpenWithProgIds': {
    mSearch: {
      value: 'Empty',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Classes\\.html\\OpenWithProgIds': {
    mSearch: {
      value: 'Empty',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Clients\\StartMenuInternet\\mSearch\\Capabilities\\FileAssociations': {
    '.htm': {
      value: 'mSearch',
      type: 'REG_SZ'
    },
    '.html': {
      value: 'mSearch',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Clients\\StartMenuInternet\\mSearch\\Capabilities\\StartMenu': {
    StartMenuInternet: {
      value: 'mSearch',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Clients\\StartMenuInternet\\mSearch\\Capabilities\\URLAssociations': {
    http: {
      value: 'mSearch',
      type: 'REG_SZ'
    },
    https: {
      value: 'mSearch',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Clients\\StartMenuInternet\\mSearch\\DefaultIcon': {
    default: {
      value: installPath + ',0',
      type: 'REG_DEFAULT'
    }
  },
  'HKCU\\Software\\Clients\\StartMenuInternet\\mSearch\\InstallInfo': {
    IconsVisible: {
      value: 1,
      type: 'REG_DWORD'
    }
  },
  'HKCU\\Software\\Clients\\StartMenuInternet\\mSearch\\shell\\open\\command': {
    default: {
      value: installPath,
      type: 'REG_DEFAULT'
    }
  }
}

var registryInstaller = {
  install: function () {
    return new Promise(function (resolve, reject) {
      regedit.createKey(keysToCreate, function (err) {
        regedit.putValue(registryConfig, function (err) {
          if (err) {
            reject()
          } else {
            resolve()
          }
        })
      })
    })
  },
  uninstall: function () {
    return new Promise(function (resolve, reject) {
      regedit.deleteKey(keysToCreate, function (err) {
        if (err) {
          reject()
        } else {
          resolve()
        }
      })
    })
  }
}

module.exports = registryInstaller
