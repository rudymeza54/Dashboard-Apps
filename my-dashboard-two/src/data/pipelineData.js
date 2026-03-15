/*
Pipeline Dashboard Data
This file stores all data used by the dashboard.
Keeping data separate from UI makes the app easier to scale.
*/


/* ===============================
KPI CARD DATA
=============================== */

export const kpiData = [
  {
    id: "ingested",
    label: "Ingested",
    value: "42.1K",
    delta: "▲ 9.2%",
    sparkline: {
      areaPoints: "6,35 30,25 52,16 72,8 84,5 84,42 6,42",
      linePoints: "6,35 30,25 52,16 72,8 84,5",
      dotX: 84,
      dotY: 5
    }
  },

  {
    id: "validated",
    label: "Validated",
    value: "41.8K",
    delta: "99.3% pass",
    sparkline: {
      areaPoints: "6,35 28,27 50,19 70,10 84,5 84,42 6,42",
      linePoints: "6,35 28,27 50,19 70,10 84,5",
      dotX: 84,
      dotY: 5
    }
  },

  {
    id: "auto_decided",
    label: "Auto-Decided",
    value: "39.8K",
    delta: "94.7% rate",
    sparkline: {
      areaPoints: "6,35 26,28 46,21 66,12 84,5 84,42 6,42",
      linePoints: "6,35 26,28 46,21 66,12 84,5",
      dotX: 84,
      dotY: 5
    }
  },

  {
    id: "manual_review",
    label: "Manual Review",
    value: "2,043",
    delta: "▼ 31%",
    sparkline: {
      areaPoints: "6,6 26,18 46,30 66,39 84,40 84,42 6,42",
      linePoints: "6,6 26,18 46,30 66,39 84,40",
      dotX: 84,
      dotY: 40
    }
  }
];


/* ===============================
FUNNEL STAGE DATA
=============================== */

export const funnelData = [
  {
    id: "ingested",
    label: "Ingested",
    width: "100%",
    value: "42,100",
    pct: "100%"
  },

  {
    id: "validated",
    label: "Validated",
    width: "99.3%",
    value: "41,800",
    pct: "99.3%"
  },

  {
    id: "rules_applied",
    label: "Rules Applied",
    width: "97.9%",
    value: "41,200",
    pct: "97.9%"
  },

  {
    id: "auto_decided",
    label: "Auto-Decided",
    width: "94.7%",
    value: "39,841",
    pct: "94.7%"
  },

  {
    id: "approved",
    label: "Approved",
    width: "88.9%",
    value: "37,413",
    pct: "88.9%"
  }
];