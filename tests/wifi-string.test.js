import assert from 'node:assert/strict';
import test from 'node:test';

import { buildWifiPayload, escapeWifiValue, validateWifiInputs } from '../lib/wifi-qr.js';

test('escapeWifiValue escapes QR reserved characters', () => {
    assert.equal(escapeWifiValue('Cafe;Net'), 'Cafe\\;Net');
    assert.equal(escapeWifiValue('Comma,Net'), 'Comma\\,Net');
    assert.equal(escapeWifiValue('Colon:Net'), 'Colon\\:Net');
    assert.equal(escapeWifiValue('Quote"Net'), 'Quote\\"Net');
});

test('buildWifiPayload includes WPA fields', () => {
    const payload = buildWifiPayload({
        ssid: 'HomeWifi',
        password: 'supersecret',
        authType: 'WPA',
        hidden: false
    });

    assert.equal(payload, 'WIFI:T:WPA;S:HomeWifi;P:supersecret;;');
});

test('buildWifiPayload handles hidden networks', () => {
    const payload = buildWifiPayload({
        ssid: 'HiddenNet',
        password: '12345678',
        authType: 'WPA',
        hidden: true
    });

    assert.equal(payload, 'WIFI:T:WPA;S:HiddenNet;P:12345678;H:true;;');
});

test('buildWifiPayload supports open networks', () => {
    const payload = buildWifiPayload({
        ssid: 'Guest',
        password: '',
        authType: 'nopass',
        hidden: false
    });

    assert.equal(payload, 'WIFI:T:nopass;S:Guest;;');
});

test('validateWifiInputs enforces WPA length', () => {
    const result = validateWifiInputs({ ssid: 'Office', password: 'short', authType: 'WPA' });
    assert.equal(result.ok, false);
});

test('validateWifiInputs allows nopass without password', () => {
    const result = validateWifiInputs({ ssid: 'Lobby', password: '', authType: 'nopass' });
    assert.equal(result.ok, true);
});
