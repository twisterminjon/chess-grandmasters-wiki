# Chess Grandmasters Wiki

React application to explore Chess.com Grandmasters with real-time data fetching and interactive profiles.

## Tech Stack

- **Node 21.7.2**
- **React 18** with TypeScript
- **React Router** for navigation
- **TanStack React Query** for data fetching and caching
- **Chess.com Public API** for data
- **Modern CSS** with CSS Grid and Flexbox

## Docker

You can also run the application using Docker:

1. Build the image:
```bash
docker build -t chess-grandmasters-wiki .
```

2. Run the container:
```bash
docker run -p 5173:5173 chess-grandmasters-wiki
```

The application will be available at `http://localhost:5173`

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

