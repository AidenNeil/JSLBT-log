# JSLBT Log Form

A Progressive Web App (PWA) for tracking employee sign-in and sign-out times, with late time calculation and comments functionality.

## Features

- 📱 Mobile-friendly Progressive Web App
- ⏰ Automatic time tracking
- 📊 Late time calculation
- 💬 Comments support
- 📈 Monthly data organization
- 🔄 Sign-in/Sign-out functionality
- 📱 Installable on mobile devices
- 🌐 Works offline

## Setup Instructions

### For Users

1. Visit the app URL in your browser
2. On mobile devices:
   - iOS: Tap the Share button and select "Add to Home Screen"
   - Android: Tap the menu and select "Install App"

### For Developers

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/jslbt-log.git
   ```

2. Open the project folder:
   ```bash
   cd jslbt-log
   ```

3. Start a local server:
   ```bash
   python -m http.server 8000
   ```

4. Visit `http://localhost:8000` in your browser

## Google Apps Script Setup

1. Create a new Google Apps Script project
2. Copy the contents of `Code.gs` into the script editor
3. Deploy as a web app:
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Copy the deployment URL
5. Update the `scriptURL` in `index.html` with your deployment URL

## Project Structure

```
jslbt-log/
├── index.html          # Main application file
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── Code.gs            # Google Apps Script code
└── icons/             # App icons and splash screens
    ├── icon-192x192.png
    ├── icon-512x512.png
    └── splash.png
```

## Features in Detail

### Sign In/Out
- Automatic time recording
- Status tracking (on-time/late)
- Comments support

### Late Time Calculation
- Calculates late time based on 8:15 AM deadline
- Tracks total late time per month
- Displays late time in hours and minutes

### Data Storage
- Monthly sheet organization
- Automatic sheet creation
- Data persistence in Google Sheets

## Browser Support

- Chrome (recommended)
- Safari
- Firefox
- Edge

## Mobile Support

- iOS 11.3+
- Android 5.0+

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details. 