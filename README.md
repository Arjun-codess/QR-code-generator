# QR-code-generator

# QR Code Generator

A modern, responsive QR code generator that creates QR codes for any URL input. Built with HTML, CSS, and JavaScript.

## Features

- **Clean, Modern Interface**: Beautiful gradient design with responsive layout
- **URL Validation**: Automatic URL validation and normalization
- **Instant Generation**: Real-time QR code generation using the QRCode.js library
- **Download Functionality**: Download generated QR codes as PNG images
- **Mobile Responsive**: Works perfectly on desktop and mobile devices
- **Error Handling**: User-friendly error messages and loading states

## How to Use

1. Open `index.html` in your web browser
2. Enter any valid URL in the input field (e.g., `https://google.com` or just `google.com`)
3. Click "Generate QR Code" or press Enter
4. Your QR code will appear in the display area
5. Click "Download QR Code" to save the image to your device

## Files Structure

```
QR generator/
├── index.html      # Main HTML structure
├── style.css       # Styling and responsive design
├── script.js       # JavaScript functionality
└── README.md       # Project documentation
```

## Technical Details

- **QR Code Library**: Uses QRCode.js (v1.5.3) from CDN for QR code generation
- **Canvas-based**: QR codes are generated on HTML5 canvas for high quality
- **URL Normalization**: Automatically adds `https://` protocol if missing
- **Responsive Design**: Mobile-first CSS with breakpoints for different screen sizes

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Features Included

- Input validation with visual feedback
- Loading states during QR code generation
- Success/error message system
- Automatic protocol detection and addition
- High-quality PNG download (256x256 pixels)
- Keyboard shortcuts (Enter to generate)

## Example URLs to Try

- `https://github.com`
- `google.com`
- `youtube.com`
- `stackoverflow.com`

The generator will automatically handle URLs with or without the `https://` protocol.
