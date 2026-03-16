# Pipeline Dashboard

A medical pipeline analytics dashboard tracking KPIs, outcomes, trends, and funnel metrics.

**Live:** [medicalappreact.netlify.app](https://medicalappreact.netlify.app)

---

## Tech Stack

- **Frontend:** React 18, Vite — deployed on Netlify
- **Backend:** Python, Flask, Pandas — deployed on Render

## Local Setup

```bash
# Frontend
cd my-dashboard-two
npm install
npm run dev

# Backend
cd my-dashboard-two/backend
pip install -r requirements.txt
python app.py
```

## Environment Variables

```env
VITE_API_BASE=https://pipeline-dashboard-api.onrender.com
```

## API

| Endpoint | Description |
|----------|-------------|
| `/api/kpis` | Key metrics |
| `/api/outcomes` | Stage conversion rates |
| `/api/trend` | Time-series data |
| `/api/funnel` | Funnel breakdown |

---

**Author:** [Rudy Meza](https://github.com/rudymeza54)