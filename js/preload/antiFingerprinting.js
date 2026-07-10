const electron = require('electron')
const ipc = electron.ipcRenderer

// Récupérer le réglage de l'anti-fingerprinting via IPC synchrone
let isAntiFingerprintingEnabled = false
try {
  isAntiFingerprintingEnabled = ipc.sendSync('get-setting', 'antiFingerprinting')
} catch (e) {
  console.error("Impossible de récupérer le paramètre d'anti-fingerprinting", e)
}

if (isAntiFingerprintingEnabled) {
  const scriptCode = `
    (function() {
      // 1. Falsification des infos matérielles et système (Navigator)
      try {
        Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 4 });
        Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 });
      } catch(e) {}

      // 2. Protection contre le Canvas Fingerprinting (Léger bruitage / noise)
      try {
        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function(type, encoderOptions) {
          const ctx = this.getContext('2d');
          if (ctx) {
            try {
              const imgData = ctx.getImageData(0, 0, 1, 1);
              if (imgData && imgData.data) {
                imgData.data[0] = (imgData.data[0] + 1) % 256; // Légère variation de la composante rouge
                ctx.putImageData(imgData, 0, 0);
              }
            } catch(e) {}
          }
          return originalToDataURL.apply(this, arguments);
        };

        const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
        CanvasRenderingContext2D.prototype.getImageData = function(sx, sy, sw, sh) {
          const imgData = originalGetImageData.apply(this, arguments);
          if (imgData && imgData.data && imgData.data.length > 4) {
            imgData.data[0] = (imgData.data[0] + 1) % 256; // Altérer le premier pixel pour fausser le hash de l'image
          }
          return imgData;
        };
      } catch(e) {}

      // 3. Falsification de l'empreinte WebGL (GPU / Vendor)
      try {
        const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter) {
          // Spoof du GPU et vendor de WebGL pour retourner des valeurs courantes génériques
          // UNMASKED_VENDOR_WEBGL = 0x9245, UNMASKED_RENDERER_WEBGL = 0x9246
          if (parameter === 0x9245) {
            return 'Intel Open Source Technology Center';
          }
          if (parameter === 0x9246) {
            return 'Mesa DRI Intel(R) HD Graphics 620 (Kaby Lake GT2)';
          }
          return originalGetParameter.apply(this, arguments);
        };
      } catch(e) {}
    })();
  `

  setTimeout(function () {
    try {
      electron.webFrame.executeJavaScript(scriptCode)
    } catch (e) {
      console.error("Échec de l'injection du script anti-fingerprinting", e)
    }
  }, 0)
}
