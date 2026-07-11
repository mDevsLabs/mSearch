## 2026-06-28 - DOM XSS in nodeIntegration: true context leads to RCE
**Vulnerability:** Output from an external CLI tool was injected directly into the DOM using `innerHTML` (`dragBox.innerHTML = ... + message + ...`).
**Learning:** In Electron applications where a view has `nodeIntegration: true`, a standard DOM Cross-Site Scripting (XSS) vulnerability can be trivially escalated to Remote Code Execution (RCE).
**Prevention:** Always use `.textContent` or `DOMPurify` when displaying dynamic content (especially external outputs, error messages, etc.) in a view with Node integration enabled.
