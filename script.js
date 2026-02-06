import { buildWifiPayload, validateWifiInputs } from './lib/wifi-qr.js';

const form = document.getElementById('wifi-form');
const ssidInput = document.getElementById('ssid');
const passwordInput = document.getElementById('password');
const authSelect = document.getElementById('auth');
const hiddenCheckbox = document.getElementById('hidden');
const sizeInput = document.getElementById('size');
const sizeValue = document.getElementById('size-value');
const errorSelect = document.getElementById('error');
const formatSelect = document.getElementById('format');
const qrCodeContainer = document.getElementById('qrcode');
const downloadLink = document.getElementById('download-link');
const statusEl = document.getElementById('status');
const copyButton = document.getElementById('copy');
const resetButton = document.getElementById('reset');
const togglePassword = document.getElementById('toggle-password');

const state = {
    payload: '',
    objectUrl: null
};

function setStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.dataset.state = isError ? 'error' : 'info';
}

function revokeObjectUrl() {
    if (state.objectUrl) {
        URL.revokeObjectURL(state.objectUrl);
        state.objectUrl = null;
    }
}

function clearPreview() {
    qrCodeContainer.innerHTML = '';
    revokeObjectUrl();
    downloadLink.style.display = 'none';
    downloadLink.removeAttribute('href');
    downloadLink.removeAttribute('download');
}

function updateSizeLabel() {
    sizeValue.textContent = `${sizeInput.value} px`;
}

function updatePasswordState() {
    const authType = authSelect.value;
    const requiresPassword = authType !== 'nopass';
    passwordInput.disabled = !requiresPassword;
    passwordInput.required = requiresPassword;
    if (!requiresPassword) {
        passwordInput.value = '';
    }
}

async function renderPng(payload, size, errorLevel) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        QRCode.toCanvas(
            canvas,
            payload,
            { width: size, height: size, errorCorrectionLevel: errorLevel, margin: 1 },
            (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                qrCodeContainer.appendChild(canvas);
                resolve(canvas.toDataURL('image/png'));
            }
        );
    });
}

async function renderSvg(payload, size, errorLevel) {
    return new Promise((resolve, reject) => {
        QRCode.toString(
            payload,
            { type: 'svg', width: size, errorCorrectionLevel: errorLevel, margin: 1 },
            (error, svgString) => {
                if (error) {
                    reject(error);
                    return;
                }
                qrCodeContainer.innerHTML = svgString;
                const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(svgBlob);
                resolve(url);
            }
        );
    });
}

async function copyPayload() {
    if (!state.payload) {
        setStatus('Generate a QR code first to copy the payload.', true);
        return;
    }

    try {
        await navigator.clipboard.writeText(state.payload);
        setStatus('Payload copied to clipboard.');
    } catch (error) {
        const fallback = document.createElement('textarea');
        fallback.value = state.payload;
        fallback.setAttribute('readonly', '');
        fallback.style.position = 'absolute';
        fallback.style.left = '-9999px';
        document.body.appendChild(fallback);
        fallback.select();
        document.execCommand('copy');
        fallback.remove();
        setStatus('Payload copied to clipboard.');
    }
}

function resetForm() {
    form.reset();
    updateSizeLabel();
    updatePasswordState();
    togglePassword.textContent = 'Show';
    passwordInput.type = 'password';
    state.payload = '';
    clearPreview();
    setStatus('Enter your Wi-Fi details to generate a QR code.');
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (typeof QRCode === 'undefined') {
        setStatus('QR code library failed to load. Check your connection.', true);
        return;
    }

    const ssid = ssidInput.value.trim();
    const password = passwordInput.value;
    const authType = authSelect.value;
    const hidden = hiddenCheckbox.checked;

    const validation = validateWifiInputs({ ssid, password, authType });
    if (!validation.ok) {
        setStatus(validation.message, true);
        return;
    }

    const payload = buildWifiPayload({ ssid, password, authType, hidden });
    state.payload = payload;
    clearPreview();

    const size = Number(sizeInput.value);
    const errorLevel = errorSelect.value;
    const format = formatSelect.value;

    try {
        const url = format === 'svg'
            ? await renderSvg(payload, size, errorLevel)
            : await renderPng(payload, size, errorLevel);

        if (format === 'svg') {
            revokeObjectUrl();
            state.objectUrl = url;
            downloadLink.href = url;
        } else {
            downloadLink.href = url;
        }

        downloadLink.download = `wifi-qr.${format}`;
        downloadLink.style.display = 'inline-flex';
        setStatus('QR code ready. Scan or download the file.');
    } catch (error) {
        console.error('Error generating QR code:', error);
        setStatus('Unable to generate QR code. Try again.', true);
    }
});

sizeInput.addEventListener('input', updateSizeLabel);
authSelect.addEventListener('change', updatePasswordState);
copyButton.addEventListener('click', copyPayload);
resetButton.addEventListener('click', resetForm);

togglePassword.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    togglePassword.textContent = isHidden ? 'Hide' : 'Show';
});

updateSizeLabel();
updatePasswordState();