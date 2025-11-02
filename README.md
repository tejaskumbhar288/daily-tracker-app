# Daily Tracker - 8 Week Learning Journey

A beautiful and functional daily tracker to log your learning hours, track progress, and maintain a learning diary.

## Features

### Dashboard
- Real-time stats: today's hours, weekly totals, and progress
- 7-day activity bar chart
- Category distribution pie chart
- Progress tracking against goals (3 hrs/day, 21 hrs/week)
- Category breakdowns for DSA, AI Learning, and Trading

### Time Logger
- Built-in timer with start/pause/stop functionality
- Manual time entry option
- Status tracking (Completed, Partial, Skipped)
- Notes field for learnings and insights
- Date selector for logging past activities
- View and manage all daily activities

### Learning Diary
- Rich text journal entries
- Optional titles and tags
- Search functionality across all entries
- Edit and delete capabilities
- Chronological view with timestamps

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Recharts** - Data visualizations
- **Lucide React** - Icons
- **date-fns** - Date formatting
- **localStorage** - Data persistence (no backend needed)

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16.x or higher recommended)
- **npm** (comes with Node.js)

To check if you have Node.js installed:
```bash
node --version
npm --version
```

If you don't have Node.js, download it from: https://nodejs.org/

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd "C:\Users\tejas\OneDrive\Desktop\Daily Tracker\daily-tracker-app"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

   This will install all required packages listed in `package.json`:
   - react
   - react-dom
   - recharts
   - lucide-react
   - date-fns
   - tailwindcss
   - And other dependencies

## Running the Application

### Development Mode

To start the development server:

```bash
npm run dev
```

The application will be available at: **http://localhost:5173/**

The dev server features:
- Hot Module Replacement (HMR) - changes reflect instantly
- Fast refresh
- Error overlay

### Build for Production

To create an optimized production build:

```bash
npm run build
```

This creates a `dist` folder with optimized files.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
daily-tracker-app/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx      # Main dashboard with stats and charts
│   │   ├── TimeLogger.jsx     # Time tracking and logging
│   │   └── Diary.jsx          # Learning diary/journal
│   ├── utils/
│   │   └── storage.js         # localStorage utilities
│   ├── App.jsx                # Main app component with navigation
│   ├── App.css                # Global styles
│   ├── index.css              # Tailwind CSS imports
│   └── main.jsx               # App entry point
├── public/                     # Static assets
├── index.html                  # HTML template
├── package.json                # Project dependencies
├── tailwind.config.js          # Tailwind configuration
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## How to Use

### 1. Dashboard
- View your daily and weekly progress
- See visual breakdowns of your activities
- Track progress against your 3hr/day goal

### 2. Time Logger
- **Using Timer:**
  1. Select activity type (DSA, AI Learning, or Trading)
  2. Choose status (Completed, Partial, Skipped)
  3. Click "Start" to begin timer
  4. Click "Pause" to pause, "Stop & Save" to log the time
  5. Optionally add notes about what you learned

- **Manual Entry:**
  1. Enter hours directly (e.g., 1.5 for 1 hour 30 minutes)
  2. Add notes if desired
  3. Click "Add" to save

### 3. Learning Diary
- Click "New Entry" to create a journal entry
- Add title, content, and tags
- Search through past entries
- Edit or delete entries as needed

## Data Storage

All data is stored locally in your browser's localStorage:
- No internet connection required
- Data persists between sessions
- Private and secure (stored only on your device)

**Note:** Clearing browser data will delete your tracked activities. Consider exporting important data periodically.

## Keyboard Shortcuts

- Navigate between views using the top navigation bar
- Use Tab to move between form fields
- Enter to submit forms (where applicable)

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Troubleshooting

### Port 5173 already in use
If you see this error, either:
1. Close other Vite apps running on port 5173, or
2. Vite will automatically try the next available port

### Blank screen
1. Check browser console for errors (F12)
2. Clear browser cache and localStorage
3. Restart the dev server

### Dependencies not installing
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again

## Future Enhancements (Planned)

- Export weekly reports (PDF/Markdown)
- Streak tracking
- Browser notifications/reminders
- Cloud sync (Firebase/Supabase)
- Dark mode
- Calendar heatmap view
- Custom goals and targets
- Data backup/restore

## License

Personal project for learning and productivity tracking.

## Author

Tejas - Building towards goals one day at a time!

**Journey Duration:** November 2, 2025 - December 31, 2025 (8 weeks)

**Daily Commitment:** 3 hours (weekdays), 6-7 hours (weekends)

---

Happy tracking! Keep building, keep learning!
