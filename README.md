# Twenty-SOC

A modern Security Operations Center (SOC) dashboard built with React, MUI, D3, and Apollo GraphQL.

## Preview

![Dashboard Screenshot](src/assets/preview.png)

> To see a live demo, run the app locally with `npm start` and open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Interactive dashboard with stat blocks, charts, and maps
- Data table with quick actions and filtering
- Responsive layout and modern UI
- Unit tests for utilities and components

## Getting Started

### Frontend Setup

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm start
```

Run frontend tests:

```bash
npm test
```

### Backend Setup (FastAPI)

1. Install Python dependencies:

```bash
pip install -r backend/requirements.txt
```

2. Run the FastAPI backend:

```bash
uvicorn backend.main:app --reload
```

3. Run backend tests:

```bash
pytest backend/test_main.py
```

#### API Endpoints

- `GET /events` - List events
- `POST /events` - Add a new event
- `GET /events/count` - Get total event count

The backend uses SQLite (`events.db`) for local development. The database file is excluded from git.

---

## WIP / Next Steps

- Integrate frontend with backend API: Update frontend code to fetch event data from FastAPI endpoints instead of using static mock files.
- Convert camelized keys in mock data files to camelCase to match backend API responses.
- Add more attributes to the model

> Note: The backend returns keys in camelCase format. Ensure frontend expects and processes camelCase keys for event objects.

## Project Structure

```
src/
  components/      # React components (Dashboard, DataTable, etc.)
  assets/          # Static assets and mock data
  utils.ts         # Utility functions
  theme/           # Theme configuration
  __tests__/       # Test files (or alongside components)
```

## Technologies

- React
- Material-UI (MUI)
- D3.js
- Apollo Client (GraphQL)
- Jest + React Testing Library

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
