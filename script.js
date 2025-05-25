document.getElementById('wifi-form').addEventListener('submit', function (event) {
    event.preventDefault(); // use preventDefault to stop reload/refresh after form submission

    const ssid = document.getElementById('ssid').value;
    const password = document.getElementById('password').value;
    const qrCodeContainer = document.getElementById('qrcode');
    const downloadLink = document.getElementById('download-link');

    // Clear previous QR code
    qrCodeContainer.innerHTML = '';

    // Generate Wi-Fi QR code string
    const wifiString = `WIFI:T:WPA;S:${ssid};P:${password};;`;

    // Generate QR code using QRCode.toCanvas
    const canvas = document.createElement('canvas');
    QRCode.toCanvas(canvas, wifiString, { width: 256, height: 256 }, function (error) {
        // toCanvas used to generate QR code and append it to the canvas
        // wifiString 
        if (error) {
            console.error('Error generating QR code:', error);
            return;
        }

        // Append the canvas to the container
        qrCodeContainer.appendChild(canvas);

        const msgStr = document.getElementById('msgStr');
        msgStr.innerHTML = "📸Point your phone's camera at the QR-Code to connect the Wi-Fi; <br></br> ";

        // Create a downloadable image
        const qrImage = canvas.toDataURL('image/png');
        downloadLink.href = qrImage;
        downloadLink.download = 'wifi-qrcode.png';
        downloadLink.style.display = 'block';
        downloadLink.textContent = 'Download QR Code';
    });
});