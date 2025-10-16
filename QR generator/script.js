class QRCodeGenerator {
    constructor() {
        this.urlInput = document.getElementById('urlInput');
        this.generateBtn = document.getElementById('generateBtn');
        this.qrContainer = document.getElementById('qrContainer');
        this.downloadSection = document.getElementById('downloadSection');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        this.currentQRCode = null;
        this.currentURL = '';
        this.currentQRApiUrl = null;
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        // Generate button click
        this.generateBtn.addEventListener('click', () => this.generateQRCode());
        
        // Enter key press in input
        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.generateQRCode();
            }
        });
        
        // Input validation
        this.urlInput.addEventListener('input', () => this.validateInput());
        
        // Download button click
        this.downloadBtn.addEventListener('click', () => this.downloadQRCode());
    }
    
    validateInput() {
        const url = this.urlInput.value.trim();
        const isValid = this.isValidURL(url);
        
        if (url && !isValid) {
            this.urlInput.style.borderColor = '#e74c3c';
        } else {
            this.urlInput.style.borderColor = '#e1e5e9';
        }
        
        return isValid;
    }
    
    isValidURL(string) {
        if (!string) return false;
        
        // URL validation
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        const ipPattern = /^(https?:\/\/)?((\d{1,3}\.){3}\d{1,3})(:\d+)?(\/.*)?$/;
        
        return urlPattern.test(string) || ipPattern.test(string) || string.includes('localhost');
    }
    
    normalizeURL(url) {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return 'https://' + url;
    }
    
    generateQRCode() {
        const url = this.urlInput.value.trim();
        
        if (!url) {
            this.showMessage('Please enter a URL', 'error');
            return;
        }
        
        if (!this.isValidURL(url)) {
            this.showMessage('Please enter a valid URL', 'error');
            return;
        }
        
        const normalizedURL = this.normalizeURL(url);
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Clear previous QR code
            this.clearQRCode();
            
            // Generate QR code using simple image approach
            this.generateQRCodeImage(normalizedURL);
            
        } catch (error) {
            console.error('Error generating QR code:', error);
            this.showMessage('Error generating QR code. Please try again.', 'error');
            this.setLoadingState(false);
        }
    }
    
    generateQRCodeImage(url) {
        const size = 256;
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&format=png`;
        
        // Create image element for display
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Try to enable CORS
        
        img.onload = () => {
            try {
                // Create canvas and draw the image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = size;
                canvas.height = size;
                
                // Draw image to canvas
                ctx.drawImage(img, 0, 0);
                
                // Store the API URL for direct download as fallback
                this.currentQRApiUrl = qrApiUrl;
                
                // Display QR code
                this.displayQRCode(canvas, url);
                this.showMessage('QR code generated successfully!', 'success');
            } catch (error) {
                console.error('Error processing QR code:', error);
                // Fallback: display image directly
                this.displayQRCodeImage(img, url, qrApiUrl);
                this.showMessage('QR code generated successfully!', 'success');
            } finally {
                this.setLoadingState(false);
            }
        };
        
        img.onerror = () => {
            console.error('Failed to load QR code image');
            this.showMessage('Failed to generate QR code. Please check your internet connection.', 'error');
            this.setLoadingState(false);
        };
        
        img.src = qrApiUrl;
    }
    
    displayQRCodeImage(img, url, apiUrl) {
        // Clear container
        this.qrContainer.innerHTML = '';
        
        // Add QR code image
        img.id = 'qrcode';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        this.qrContainer.appendChild(img);
        this.qrContainer.classList.add('has-qr');
        
        // Store current QR code data
        this.currentQRCode = null; // Canvas not available
        this.currentQRApiUrl = apiUrl;
        this.currentURL = url;
        
        // Show download section
        this.downloadSection.style.display = 'block';
        
        // Add URL display
        const urlDisplay = document.createElement('p');
        urlDisplay.style.marginTop = '15px';
        urlDisplay.style.fontSize = '0.9rem';
        urlDisplay.style.color = '#666';
        urlDisplay.style.wordBreak = 'break-all';
        urlDisplay.textContent = `URL: ${url}`;
        this.qrContainer.appendChild(urlDisplay);
    }
    
    displayQRCode(canvas, url) {
        // Clear container
        this.qrContainer.innerHTML = '';
        
        // Add QR code
        canvas.id = 'qrcode';
        this.qrContainer.appendChild(canvas);
        this.qrContainer.classList.add('has-qr');
        
        // Store current QR code data
        this.currentQRCode = canvas;
        this.currentURL = url;
        
        // Show download section
        this.downloadSection.style.display = 'block';
        
        // Add URL display
        const urlDisplay = document.createElement('p');
        urlDisplay.style.marginTop = '15px';
        urlDisplay.style.fontSize = '0.9rem';
        urlDisplay.style.color = '#666';
        urlDisplay.style.wordBreak = 'break-all';
        urlDisplay.textContent = `URL: ${url}`;
        this.qrContainer.appendChild(urlDisplay);
    }
    
    clearQRCode() {
        this.qrContainer.innerHTML = `
            <div class="placeholder">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                    <path d="m5 5 2 2"/>
                    <path d="m5 17 2 2"/>
                    <path d="m17 5 2 2"/>
                    <path d="m15 15 1 1"/>
                    <path d="m17 17 1 1"/>
                </svg>
                <p>Your QR code will appear here</p>
            </div>
        `;
        this.qrContainer.classList.remove('has-qr');
        this.downloadSection.style.display = 'none';
        this.currentQRCode = null;
        this.currentURL = '';
        this.currentQRApiUrl = null;
    }
    
    setLoadingState(loading) {
        if (loading) {
            this.generateBtn.disabled = true;
            this.generateBtn.innerHTML = '<span class="loading"></span>Generating...';
        } else {
            this.generateBtn.disabled = false;
            this.generateBtn.innerHTML = 'Generate QR Code';
        }
    }
    
    downloadQRCode() {
        if (!this.currentQRCode && !this.currentQRApiUrl) {
            this.showMessage('No QR code to download', 'error');
            return;
        }
        
        try {
            const link = document.createElement('a');
            link.download = `qrcode-${Date.now()}.png`;
            
            
            if (this.currentQRCode) {
                try {
                    link.href = this.currentQRCode.toDataURL('image/png');
                } catch (canvasError) {
                    console.log('Canvas download failed, using direct URL');
                    // Fallback to direct URL download
                    link.href = this.currentQRApiUrl;
                    link.target = '_blank'; // Open in new tab as fallback
                }
            } else {
                // Direct URL download
                link.href = this.currentQRApiUrl;
                link.target = '_blank'; // Open in new tab as fallback
            }
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showMessage('QR code download initiated!', 'success');
        } catch (error) {
            console.error('Error downloading QR code:', error);
            // Final fallback: open in new window
            if (this.currentQRApiUrl) {
                window.open(this.currentQRApiUrl, '_blank');
                this.showMessage('QR code opened in new tab. Right-click to save.', 'success');
            } else {
                this.showMessage('Error downloading QR code', 'error');
            }
        }
    }
    
    showMessage(text, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.error-message, .success-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const message = document.createElement('div');
        message.className = type === 'error' ? 'error-message' : 'success-message';
        message.textContent = text;
        
        // Insert after input section
        const inputSection = document.querySelector('.input-section');
        inputSection.appendChild(message);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }
}

// Initialize the QR code generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new QRCodeGenerator();
});

// Add some example URLs for testing
document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    
    // Add placeholder examples
    const examples = [
        'https://github.com',
        'https://google.com',
        'https://stackoverflow.com',
        'https://youtube.com'
    ];
    
    let exampleIndex = 0;
    
    urlInput.addEventListener('focus', () => {
        if (!urlInput.value) {
            urlInput.placeholder = examples[exampleIndex % examples.length];
            exampleIndex++;
        }
    });
});
