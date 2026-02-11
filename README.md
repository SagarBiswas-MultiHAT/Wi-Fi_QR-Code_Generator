# Wi-Fi QR Code Generator

<div align="right">

[![CI](https://github.com/SagarBiswas-MultiHAT/WiFi-QR-Generator/actions/workflows/python-ci.yml/badge.svg)](https://github.com/SagarBiswas-MultiHAT/WiFi-QR-Generator/actions/workflows/python-ci.yml)
[![Live Demo](https://img.shields.io/badge/demo-GitHub%20Pages-blue)](https://sagarbiswas-multihat.github.io/WiFi-QR-Generator/)
[![License](https://img.shields.io/github/license/SagarBiswas-MultiHAT/WiFi-QR-Generator)](https://github.com/SagarBiswas-MultiHAT/WiFi-QR-Generator/blob/main/LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/SagarBiswas-MultiHAT/WiFi-QR-Generator)](https://github.com/SagarBiswas-MultiHAT/WiFi-QR-Generator)
[![Issues](https://img.shields.io/github/issues/SagarBiswas-MultiHAT/WiFi-QR-Generator)](https://github.com/SagarBiswas-MultiHAT/WiFi-QR-Generator/issues)
[![Pages](https://img.shields.io/github/deployments/SagarBiswas-MultiHAT/WiFi-QR-Generator/github-pages?label=GitHub%20Pages)](https://github.com/SagarBiswas-MultiHAT/WiFi-QR-Generator/deployments)
[![Vanilla JS](https://img.shields.io/badge/tech-vanilla%20js-yellowgreen)](https://github.com/SagarBiswas-MultiHAT/WiFi-QR-Generator)

</div>

Create professional Wi-Fi QR codes in seconds. This app runs entirely in the browser, supports WPA/WPA2, WEP, and open networks, and lets you export PNG or SVG with adjustable size and error correction.

![](https://imgur.com/yQKomWE.png)
![](https://imgur.com/uHBIp6g.png)

##### Live: https://sagarbiswas-multihat.github.io/WiFi-QR-Generator/

## Why this project

If you share Wi-Fi often, typing passwords is slow and error-prone. This tool generates the standardized QR payload so phones can connect instantly. No accounts, no backend, and no data leaves your device.

## Features

- WPA/WPA2, WEP, and open network support.
- Hidden SSID option.
- Adjustable QR size and error correction.
- Export PNG or SVG.
- Copy the raw Wi-Fi payload for advanced use.
- No storage, no tracking, no backend.
- Clean, responsive UI that works on mobile and desktop.

## Quick start

1. Open [index.html](index.html) in a modern browser.
2. Enter your SSID and password.
3. Choose security type, size, and format.
4. Click "Generate QR code".
5. Scan or download the QR code.

## How it works

The generator builds a standard Wi-Fi QR payload like this:

```
WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:true;;
```

- `T` is the auth type (`WPA`, `WEP`, or `nopass`).
- `S` is the SSID.
- `P` is the password (omitted for open networks).
- `H:true` is used when the SSID is hidden.

Reserved characters in SSID or password (`\`, `;`, `,`, `:`, `"`) are escaped before encoding.

## Settings guide

- **Security type**
	- WPA/WPA2: password length 8-63 characters.
	- WEP: 5 or 13 ASCII characters, or 10 or 26 hex characters.
	- No password: no password required.
- **Hidden network**: include `H:true` in the payload.
- **QR size**: visual size in pixels.
- **Error correction**: more correction increases reliability but makes the QR denser.
- **Format**: PNG for raster images, SVG for crisp scaling in print.

## Project structure

```
.
├── index.html
├── style.css
├── script.js
├── lib
│   └── wifi-qr.js
├── tests
│   └── wifi-string.test.js
├── .github
│   └── workflows
│       └── python-ci.yml
└── LICENSE
```

## Development

No build step is required. Open [index.html](index.html) in your browser.

If you want to run tests locally:

```
npm test
```

## CI

GitHub Actions runs the tests on every push and pull request to `main` using the workflow in [.github/workflows/python-ci.yml](.github/workflows/python-ci.yml).

## Offline use

The QR library is loaded from a CDN by default. To run fully offline:

1. Download `qrcode.min.js` from https://github.com/soldair/node-qrcode
2. Save it next to [index.html](index.html).
3. Replace the CDN script tag with a local reference.

## Privacy and security

- All data stays in your browser.
- Nothing is stored or transmitted.
- Close the tab to clear everything.

## Troubleshooting

- **"QR code library failed to load"**: Check your connection or switch to the offline setup above.
- **WPA password rejected**: Must be 8-63 characters.
- **WEP password rejected**: Use 5/13 ASCII or 10/26 hex characters.

## Compatibility

Works in current versions of Chrome, Edge, Firefox, and Safari.

## Contributing

Issues and pull requests are welcome. Please include clear reproduction steps and screenshots for UI bugs.

## License

MIT. See [LICENSE](LICENSE).
