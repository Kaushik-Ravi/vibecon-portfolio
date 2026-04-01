# Pune Tree Dashboard - Comprehensive Technical Documentation

**Version:** 1.0  
**Document Created:** February 9, 2026  
**Prepared for:** Engineers, Technical Stakeholders, and Academicians

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Overview & Vision](#2-project-overview--vision)
3. [Architecture & Technology Stack](#3-architecture--technology-stack)
4. [Data Infrastructure](#4-data-infrastructure)
5. [The Green Cover Monitor - Deep Dive](#5-the-green-cover-monitor---deep-dive)
6. [API Reference](#6-api-reference)
7. [Frontend Components](#7-frontend-components)
8. [Performance Optimizations](#8-performance-optimizations)
9. [Deployment & Infrastructure](#9-deployment--infrastructure)
10. [Impact & Use Cases](#10-impact--use-cases)
11. [Future Roadmap](#11-future-roadmap)
12. [Technical Appendices](#12-technical-appendices)

---

## 1. Executive Summary

The **Pune Tree Dashboard** is a production-grade urban forestry intelligence platform that transforms Pune's tree census data into actionable environmental insights. Built with modern web technologies, it visualizes **1,789,337 individually cataloged trees** across **77 administrative wards**, combining ground-truth census data with multi-temporal satellite imagery analysis spanning from 2019 to 2025.

### Core Capabilities

| Feature | Description |
|---------|-------------|
| **Tree Census Visualization** | Interactive map with 1.79M geolocated trees, filterable by species, ward, height, canopy, and more |
| **Green Cover Monitor** | Satellite-based tracking of vegetation changes using Google Dynamic World (10m resolution) |
| **Ward-Level Analytics** | Composite Green Score (0-100) for each of 77 wards with historical trends |
| **3D Rendering** | Real-time 3D tree visualization with MapLibre GL and Three.js integration |
| **Shadow Simulation** | Physics-based shadow casting from trees based on sun position (experimental) |
| **Planting Advisor** | Temperature prediction model showing cooling effects of tree species |
| **Advanced Filtering** | Multi-criteria filtering with real-time map updates |

### Key Statistics

- **Total Trees:** 1,789,337
- **Wards Covered:** 77
- **Unique Species:** 397+
- **Total CO₂ Sequestered:** 288,772 tons (lifetime)
- **Annual CO₂ Absorption:** ~11,000 tons/year
- **Satellite Data Years:** 2019, 2020, 2021, 2022, 2023, 2024, 2025 (7 years)
- **Satellite Resolution:** 10 meters (Google Dynamic World)

---

## 2. Project Overview & Vision

### 2.1 Problem Statement

Urban areas face increasing challenges from:
- **Urban Heat Island Effect:** Concrete and asphalt absorb and radiate heat
- **Loss of Green Cover:** Rapid urbanization replacing vegetation with built-up areas
- **Data Silos:** Tree census data exists but isn't accessible or actionable
- **Monitoring Gaps:** No systematic tracking of vegetation changes over time

### 2.2 Solution

The Pune Tree Dashboard addresses these challenges by:

1. **Democratizing Data Access:** Making the complete tree census publicly accessible via an intuitive web interface
2. **Enabling Multi-Temporal Analysis:** Combining ground-truth census with 7 years of satellite imagery
3. **Providing Actionable Metrics:** Ward-level Green Scores and trend analysis for targeted interventions
4. **Supporting Evidence-Based Planning:** Quantitative data for urban planners and policymakers


---

## 3. Architecture & Technology Stack

### 3.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND (React + TypeScript)                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐   │
│  │   MapView       │  │    Sidebar      │  │   State Management          │   │
│  │   (MapLibre)    │  │    (Tabs)       │  │   (Zustand + LocalStorage)  │   │
│  └────────┬────────┘  └────────┬────────┘  └─────────────────────────────┘   │
│           │                    │                                              │
│  ┌────────▼────────────────────▼────────────────────────────────────────┐    │
│  │                    VISUALIZATION LAYERS                               │    │
│  │  • PMTiles (1.79M trees)     • Ward Boundaries (GeoJSON)             │    │
│  │  • Raster Overlays (COG)     • Three.js (3D/Shadows)                 │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                        ┌─────────────▼─────────────┐
                        │     Vercel Edge Network    │
                        │    (CDN + Serverless)      │
                        └─────────────┬─────────────┘
                                      │
┌─────────────────────────────────────▼─────────────────────────────────────┐
│                          BACKEND (Express.js)                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐    │
│  │  REST API       │  │  Connection     │  │   CDN Caching Headers   │    │
│  │  Endpoints      │  │  Pool + Retry   │  │   (s-maxage, stale-    │    │
│  │                 │  │                 │  │   while-revalidate)     │    │
│  └────────┬────────┘  └────────┬────────┘  └─────────────────────────┘    │
└───────────┼────────────────────┼──────────────────────────────────────────┘
            │                    │
            │     ┌──────────────▼──────────────┐
            │     │    PgBouncer Connection      │
            │     │    Pooler (Port 25061)       │
            │     └──────────────┬──────────────┘
            │                    │
            └────────────────────▼────────────────────────────────────────┐
                        ┌────────────────────────────────────────────────┐│
                        │         PostgreSQL 17 + PostGIS                ││
                        │         (DigitalOcean BLR1 Region)             ││
                        │  ┌────────────┐  ┌────────────────────────┐    ││
                        │  │   trees    │  │  land_cover_stats      │    ││
                        │  │  (1.79M)   │  │  land_cover_change     │    ││
                        │  │            │  │  ward_polygons         │    ││
                        │  └────────────┘  └────────────────────────┘    ││
                        └────────────────────────────────────────────────┘│
┌─────────────────────────────────────────────────────────────────────────┘
│                        STATIC ASSETS
│  ┌────────────────────────────────────────────────────────────────────┐
│  │              Cloudflare R2 Object Storage                          │
│  │  • pune-trees-complete.pmtiles (Vector Tiles)                     │
│  │  • Raster COGs (Tree Probability, NDVI, Land Cover, Change Maps)  │
│  └────────────────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────────────
```

### 3.2 Technology Stack

#### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI Component Framework |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Vite** | 5.x | Build Tool & Dev Server |
| **MapLibre GL** | 5.6.1 | WebGL-based Map Rendering |
| **Three.js** | 0.170.0 | 3D Graphics & Shadow System |
| **Zustand** | 4.x | Lightweight State Management |
| **TailwindCSS** | 3.x | Utility-first CSS |
| **Lucide React** | - | Icon Library |
| **GeoTIFF.js** | - | Raster Data Reading (COG) |

#### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Express.js** | 4.x | REST API Server |
| **pg (node-postgres)** | 8.x | PostgreSQL Client |
| **ioredis** | 5.3.2 | Optional Redis Caching |
| **SunCalc** | - | Astronomical Calculations |
| **cors** | - | Cross-Origin Requests |

#### Database
| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | 17 | Relational Database |
| **PostGIS** | 3.x | Spatial Extensions |
| **PgBouncer** | - | Connection Pooling |

#### Infrastructure
| Service | Purpose |
|---------|---------|
| **Vercel** | Serverless Hosting + CDN |
| **DigitalOcean** | Managed PostgreSQL (BLR1 Region) |
| **Cloudflare R2** | Object Storage (PMTiles, COGs) |
| **Google Earth Engine** | Satellite Data Processing |

### 3.3 Data Flow

```
                    ┌──────────────────────────────────────────┐
                    │       GOOGLE EARTH ENGINE (GEE)          │
                    │  • Dynamic World V1 (10m resolution)     │
                    │  • Sentinel-2 Imagery                    │
                    │  • Multi-year composites (2019-2025)     │
                    └───────────────┬──────────────────────────┘
                                    │ Export CSVs + COG Rasters
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                         DATA PROCESSING PIPELINE                          │
│  ┌────────────────────┐  ┌────────────────────┐  ┌──────────────────────┐ │
│  │ gee-multi-year-    │  │ import-land-cover  │  │ import-ward-polygons │ │
│  │ analysis.js (GEE)  │→→│ .cjs (Node.js)     │→→│ .sql (PostgreSQL)    │ │
│  └────────────────────┘  └────────────────────┘  └──────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────────┐
                    │         DATABASE TABLES           │
                    │  • land_cover_stats (525 rows)   │
                    │  • land_cover_change (525 rows)  │
                    │  • ward_polygons (76 rows)       │
                    │  • trees (1,789,337 rows)        │
                    └───────────────┬───────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────────┐
                    │          REST API SERVER          │
                    │  /api/green-cover/bundle          │
                    │  /api/land-cover/timeline         │
                    │  /api/ward-boundaries             │
                    └───────────────┬───────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────────┐
                    │      FRONTEND APPLICATION         │
                    │  GreenCoverStore (Zustand)        │
                    │  GreenCoverMonitor.tsx            │
                    │  WardBoundaryLayer.tsx            │
                    └───────────────────────────────────┘
```

---

## 4. Data Infrastructure

### 4.1 Database Schema

#### 4.1.1 Trees Table (Primary Census Data)

```sql
CREATE TABLE public.trees (
    id SERIAL PRIMARY KEY,
    geom GEOMETRY(Point, 4326),      -- PostGIS point geometry
    common_name VARCHAR(255),         -- Tree species common name
    botanical_name VARCHAR(255),      -- Scientific name
    ward VARCHAR(50),                 -- Ward number (as text: "1", "2.0")
    height_m NUMERIC,                 -- Height in meters
    canopy_dia_m NUMERIC,             -- Canopy diameter in meters
    girth_cm NUMERIC,                 -- Trunk girth (DBH) in centimeters
    "CO2_sequestered_kg" NUMERIC,     -- CO2 sequestered (kg)
    economic_i VARCHAR(100),          -- Economic importance category
    flowering VARCHAR(100),           -- Flowering status
    distance_to_road_m NUMERIC        -- Distance to nearest road (meters)
);

-- Performance indexes
CREATE INDEX idx_trees_geom ON public.trees USING GIST (geom);
CREATE INDEX idx_trees_common_name ON public.trees(common_name);
CREATE INDEX idx_trees_ward ON public.trees(ward);
CREATE INDEX idx_trees_economic_i ON public.trees(economic_i);
CREATE INDEX idx_trees_distance ON public.trees(distance_to_road_m);
```

**Statistics:**
- Total Records: 1,789,337
- Unique Species: 397+
- Unique Wards: 77

#### 4.1.2 Land Cover Statistics Table (Satellite Data)

```sql
CREATE TABLE land_cover_stats (
    id SERIAL PRIMARY KEY,
    ward_number INTEGER NOT NULL,
    year INTEGER NOT NULL,
    total_area_m2 NUMERIC,          -- Ward total area
    trees_area_m2 NUMERIC,          -- Tree cover area
    built_area_m2 NUMERIC,          -- Built-up area
    grass_area_m2 NUMERIC,          -- Grass/lawn area
    bare_area_m2 NUMERIC,           -- Bare ground area
    water_area_m2 NUMERIC,          -- Water body area
    crops_area_m2 NUMERIC,          -- Agricultural area
    trees_pct NUMERIC,              -- Tree cover percentage
    built_pct NUMERIC,              -- Built-up percentage
    grass_pct NUMERIC,              -- Grass percentage
    bare_pct NUMERIC,               -- Bare ground percentage
    import_date TIMESTAMP,
    UNIQUE(ward_number, year)
);

CREATE INDEX idx_land_cover_stats_ward ON land_cover_stats(ward_number);
CREATE INDEX idx_land_cover_stats_year ON land_cover_stats(year);
```

**Statistics:**
- Total Records: 525 (75 wards × 7 years)
- Years Covered: 2019, 2020, 2021, 2022, 2023, 2024, 2025

#### 4.1.3 Land Cover Change Table (Year-over-Year Analysis)

```sql
CREATE TABLE land_cover_change (
    id SERIAL PRIMARY KEY,
    ward_number INTEGER NOT NULL,
    from_year INTEGER NOT NULL,
    to_year INTEGER NOT NULL,
    period VARCHAR(50),              -- e.g., "2019-2020"
    trees_lost_m2 NUMERIC,           -- Area that was trees, now something else
    trees_gained_m2 NUMERIC,         -- Area that wasn't trees, now is trees
    net_tree_change_m2 NUMERIC,      -- trees_gained - trees_lost
    built_gained_m2 NUMERIC,         -- New built-up area
    trees_to_built_m2 NUMERIC,       -- Trees converted directly to built-up
    import_date TIMESTAMP,
    UNIQUE(ward_number, from_year, to_year)
);

CREATE INDEX idx_land_cover_change_ward ON land_cover_change(ward_number);
```

#### 4.1.4 Ward Polygons Table (Administrative Boundaries)

```sql
CREATE TABLE ward_polygons (
    id SERIAL PRIMARY KEY,
    ward_number INTEGER UNIQUE,
    ward_office VARCHAR(255),
    prabhag_name VARCHAR(255),
    zone VARCHAR(100),
    tree_count INTEGER,
    geometry GEOMETRY(MultiPolygon, 4326)
);

CREATE INDEX idx_ward_polygons_geom ON ward_polygons USING GIST (geometry);
```

### 4.2 Raster Data (Cloud Optimized GeoTIFFs)

Stored on Cloudflare R2 for global CDN delivery:

| Layer | File | Resolution | Description |
|-------|------|------------|-------------|
| Tree Probability 2025 | `pune_tree_probability_2025.tif` | 10m | Current tree cover likelihood (0-100%) |
| Tree Probability 2019 | `pune_tree_probability_2019.tif` | 10m | Historical tree cover likelihood |
| Tree Change | `pune_tree_change_2019_2025_pct.tif` | 10m | Percentage change (-50% to +50%) |
| NDVI 2025 | `pune_ndvi_2025.tif` | 10m | Vegetation index (-0.2 to 0.8) |
| Land Cover 2025 | `pune_landcover_2025.tif` | 10m | 9-class classification |

**Land Cover Classification (Dynamic World V1):**

| Class ID | Class Name | Color |
|----------|------------|-------|
| 0 | Water | #419bdf |
| 1 | Trees | #397d49 |
| 2 | Grass | #88b053 |
| 3 | Flooded Vegetation | #7a87c6 |
| 4 | Crops | #e49635 |
| 5 | Shrub/Scrub | #dfc35a |
| 6 | Built Area | #c4281b |
| 7 | Bare Ground | #a59b8f |
| 8 | Snow/Ice | #b39fe1 |

### 4.3 Vector Tiles (PMTiles)

The tree census data is served as vector tiles using the PMTiles format:

```
pune-trees-complete.pmtiles
├── Zoom levels: 0-22
├── Contains: 1,789,337 tree points
├── Attributes per feature:
│   ├── Tree_ID
│   ├── Common_Name
│   ├── Height_m
│   ├── Canopy_Diameter_m
│   ├── Girth_cm
│   ├── CO2_Sequestration_kg_yr
│   ├── ward
│   ├── is_street_tree (boolean)
│   └── economic_i
└── Size: ~50MB (compressed)
```

---

## 5. The Green Cover Monitor - Deep Dive

### 5.1 Overview

The **Green Cover Monitor** is the centerpiece feature for environmental analysis, providing a comprehensive dashboard for tracking Pune's vegetation health from 2019 to 2025. It combines satellite-derived metrics with ground-truth census data to produce actionable insights.

### 5.2 Feature Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        GREEN COVER MONITOR TAB                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SECTION 1: CITY GREEN SCORE (Always Visible)                       │   │
│  │  • Composite score (0-100) with ring visualization                  │   │
│  │  • Tree cover % and Built-up % summary                              │   │
│  │  • 2019-2025 trend sparkline                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SECTION 2: INSIGHTS & TIMELINE (Collapsible)                       │   │
│  │  • Key insights (net change, critical wards, construction)          │   │
│  │  • Interactive timeline slider (2019-2025)                          │   │
│  │  • Year-specific statistics                                         │   │
│  │  • Playback animation                                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SECTION 3: WARD ANALYSIS LEADERBOARD (Collapsible)                 │   │
│  │  • Sortable table (Score, Trees%, Built%, Change)                   │   │
│  │  • Expandable rows with ward details                                │   │
│  │  • Map layer controls (boundaries, hotspots)                        │   │
│  │  • Quick filters (Critical, Losing, Gaining)                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SECTION 4: DETAILED LAND ANALYSIS (Collapsible)                    │   │
│  │  • Satellite raster layer controls                                  │   │
│  │  • Tree Probability (2019, 2025)                                    │   │
│  │  • Tree Change heatmap                                              │   │
│  │  • NDVI visualization                                               │   │
│  │  • Land Cover classification                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Ward Green Score Algorithm

The **Ward Green Score** is a composite metric (0-100) that combines multiple factors:

```typescript
function calculateGreenScore(
  treesPct: number,      // Current tree cover percentage
  builtPct: number,      // Current built-up percentage
  netChangePct: number,  // Net change since 2019 (% of ward area)
  treeDensity: number    // Census trees per hectare
): number {
  // Factor 1: Tree Cover (40% weight)
  // Normalize to 0-100 (assuming 25% is excellent for urban areas)
  const treeScore = Math.min(100, (treesPct / 25) * 100);
  
  // Factor 2: Built-up (30% weight) - INVERTED (lower is better)
  // Assumes 90% built-up as maximum
  const builtScore = Math.max(0, 100 - (builtPct / 90) * 100);
  
  // Factor 3: Change Trend (20% weight)
  // Centers at 50, adjusts ±5 points per 1% change
  const changeScore = 50 + (netChangePct * 5);
  const normalizedChange = Math.max(0, Math.min(100, changeScore));
  
  // Factor 4: Census Tree Density (10% weight)
  // Assumes 300 trees/ha as excellent density
  const densityScore = Math.min(100, (treeDensity / 300) * 100);
  
  // Weighted combination
  const score = (
    treeScore * 0.40 +
    builtScore * 0.30 +
    normalizedChange * 0.20 +
    densityScore * 0.10
  );
  
  return Math.round(Math.max(0, Math.min(100, score)));
}
```

**Score Interpretation:**

| Score Range | Status | Color | Emoji |
|-------------|--------|-------|-------|
| 70-100 | Good | #22c55e (Green) | 🌳 |
| 50-69 | Moderate | #eab308 (Yellow) | 🌿 |
| 30-49 | At Risk | #f97316 (Orange) | ⚠️ |
| 0-29 | Critical | #ef4444 (Red) | 🚨 |

### 5.4 Data Sources & Methodology

#### 5.4.1 Satellite Data Source

**Google Dynamic World V1** is used for land cover classification:

- **Sensor:** Sentinel-2
- **Resolution:** 10 meters per pixel
- **Classification:** Near real-time land cover predictions
- **Accuracy:** ~74% overall accuracy for 9-class classification
- **Update Frequency:** Every 2-5 days (cloud-permitting)

#### 5.4.2 Processing Pipeline (Google Earth Engine)

```javascript
// Excerpt from gee-multi-year-analysis.js
function getDWMode(year) {
  var startDate = year + '-01-01';
  var endDate = year + '-12-31';
  
  var dwCollection = ee.ImageCollection('GOOGLE/DYNAMICWORLD/V1')
    .filterBounds(PUNE_BOUNDS)
    .filterDate(startDate, endDate);
  
  // Mode composite = most common classification per pixel
  return dwCollection.select('label').mode();
}

function calculateWardStats(feature, landCover) {
  var geometry = feature.geometry();
  var pixelArea = ee.Image.pixelArea();
  
  // Calculate area for each land cover class
  var treesArea = pixelArea.updateMask(landCover.eq(1))
    .reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: geometry,
      scale: 10,
      maxPixels: 1e13
    }).get('area');
  
  // ... similar for other classes
  
  return {
    ward_number: wardNumber,
    trees_area_m2: treesArea,
    trees_pct: (treesArea / totalArea) * 100,
    // ...
  };
}
```

#### 5.4.3 Change Detection Formula

For each ward, tree cover change is calculated as:

```
Net Tree Change (ha) = (Trees_2025 - Trees_2019) / 10000

Change Percentage = (Net Tree Change / Ward Area) × 100

Trees Lost = Pixels that were "Trees" in 2019 but not in 2025
Trees Gained = Pixels that weren't "Trees" in 2019 but are in 2025
Trees to Built = Pixels that went from "Trees" to "Built Area"
```

### 5.5 State Management (GreenCoverStore)

The Green Cover Monitor uses Zustand with localStorage persistence:

```typescript
// src/store/GreenCoverStore.tsx
interface GreenCoverState {
  // Data
  timelineData: TimelineData | null;
  wardData: WardLandCover[];
  comparisonData: WardComparison[];
  wardStats: WardStats[];
  
  // Map interaction
  selectedWardNumber: number | null;
  flyToWardTrigger: number;
  
  // Loading states
  isLoading: boolean;
  isBackgroundRefreshing: boolean;
  isInitialized: boolean;
  error: string | null;
  lastFetchTime: number | null;
  
  // Actions
  fetchAllData: () => Promise<void>;
  fetchFresh: () => Promise<void>;
  refreshInBackground: () => Promise<void>;
  flyToWard: (wardNumber: number) => void;
}
```

**Caching Strategy:**

| Condition | Behavior |
|-----------|----------|
| Fresh data (<5 min old) | Use cached data immediately |
| Stale data (5-30 min old) | Show cached data, refresh in background |
| Very stale data (>30 min old) | Show loading state, fetch fresh |
| First visit | Show loading state, fetch from API |

### 5.6 API Endpoint: `/api/green-cover/bundle`

The bundle endpoint returns ALL Green Cover Monitor data in a single request, eliminating multiple round trips:

```javascript
// Response structure
{
  timeline: {
    source: 'database',
    years: [
      {
        year: 2019,
        ward_count: "75",
        avg_trees_pct: "12.34",
        avg_built_pct: "45.67",
        total_trees_area_ha: "1234.56",
        total_built_area_ha: "5678.90"
      },
      // ... 2020-2025
    ],
    year_over_year_changes: [
      {
        from_year: 2019,
        to_year: 2020,
        period: "2019-2020",
        net_tree_change_ha: "-12.34"
      },
      // ... other year pairs
    ],
    overall_2019_2025: {
      total_trees_lost_ha: "567.89",
      total_trees_gained_ha: "234.56",
      net_tree_change_ha: "-333.33",
      total_built_gained_ha: "789.01"
    }
  },
  wards: {
    source: 'database',
    data: [
      {
        ward_number: 1,
        year: 2025,
        trees_pct: "15.67",
        built_pct: "52.34",
        total_area_m2: "4567890"
      },
      // ... 525 records (75 wards × 7 years)
    ]
  },
  comparison: {
    source: 'database',
    data: [
      {
        ward_number: 1,
        from_year: 2019,
        to_year: 2025,
        net_tree_change_m2: "-123456",
        built_gained_m2: "234567"
      },
      // ... 75 records (2019-2025 comparison per ward)
    ]
  },
  wardStats: {
    data: [
      {
        ward_number: 1,
        tree_count: 23456,
        species_count: 87,
        avg_canopy_m: 4.56,
        total_canopy_area_ha: 34.56
      },
      // ... 77 wards
    ]
  },
  _meta: {
    query_time_ms: 234,
    timestamp: "2026-02-09T12:34:56.789Z"
  }
}
```

### 5.7 UI Components

#### 5.7.1 Score Ring Visualization

```tsx
const ScoreRing: React.FC<{
  score: number;
  size?: 'sm' | 'md' | 'lg';
}> = ({ score, size = 'md' }) => {
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  
  return (
    <svg className="transform -rotate-90">
      {/* Background circle */}
      <circle fill="none" stroke="#e5e7eb" />
      {/* Progress arc */}
      <circle
        fill="none"
        stroke={getScoreColor(score)}
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
      />
      {/* Center text */}
      <text>{score}</text>
    </svg>
  );
};
```

#### 5.7.2 Ward Leaderboard

The leaderboard is a sortable, filterable table with expandable rows:

- **Columns:** Rank, Ward, Score (ring), Trees%, Built%, Change
- **Sorting:** Click column headers to sort ascending/descending
- **Filters:** All, Critical (<30), At Risk (30-50), Moderate (50-70), Good (>70), Gaining (+2%), Losing (-2%)
- **Expandable Rows:** Click a ward to reveal:
  - Census tree count and species count
  - Net tree change in hectares
  - Built-up change in hectares
  - Map layer controls (Ward Boundaries, Land Cover, Fly to Ward)

#### 5.7.3 Timeline Slider

```tsx
const TimelineSlider: React.FC<{
  years: number[];
  selectedYear: number;
  onChange: (year: number) => void;
  playing: boolean;
  onPlayToggle: () => void;
}> = ({ years, selectedYear, onChange, playing, onPlayToggle }) => {
  // Animation: cycles through years every 1.5 seconds
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % years.length;
      onChange(years[nextIndex]);
    }, 1500);
    return () => clearInterval(interval);
  }, [playing, selectedYear]);
  
  return (
    <div>
      <input type="range" min={0} max={years.length - 1} />
      <button onClick={onPlayToggle}>
        {playing ? '⏸ Pause' : '▶ Play'}
      </button>
    </div>
  );
};
```

### 5.8 Map Integration

The Green Cover Monitor integrates with the map through several layers:

#### 5.8.1 Ward Boundary Layer

```tsx
// WardBoundaryLayer.tsx
const WardBoundaryLayer: React.FC<{
  visible: boolean;
  colorBy: 'green_score' | 'trees_pct' | 'change';
  year: number;
  onWardClick: (wardNumber: number) => void;
}> = ({ visible, colorBy, year, onWardClick }) => {
  // Choropleth coloring based on selected metric
  const fillColor = useMemo(() => {
    switch (colorBy) {
      case 'green_score':
        return colorByGreenScore(wardScores);
      case 'trees_pct':
        return colorByTreePercentage(wardData);
      case 'change':
        return colorByChange(comparisonData);
    }
  }, [colorBy, wardScores, wardData, comparisonData]);
  
  return (
    <Source type="geojson" data={wardBoundaries}>
      <Layer
        type="fill"
        paint={{ 'fill-color': fillColor, 'fill-opacity': 0.6 }}
      />
      <Layer
        type="line"
        paint={{ 'line-color': '#333', 'line-width': 1.5 }}
      />
    </Source>
  );
};
```

#### 5.8.2 Raster Overlay Layer

For detailed satellite analysis at 10m resolution:

```tsx
// RasterOverlay.tsx
const RasterOverlay: React.FC<{
  config: {
    visible: boolean;
    layer: 'tree_probability_2025' | 'tree_change' | 'ndvi' | 'landcover';
    opacity: number;
  };
}> = ({ config }) => {
  // Load Cloud Optimized GeoTIFF via HTTP range requests
  const [imageData, setImageData] = useState<ImageData | null>(null);
  
  useEffect(() => {
    const loadRaster = async () => {
      const tiff = await GeoTIFF.fromUrl(LAYER_CONFIGS[config.layer].url);
      const image = await tiff.getImage();
      const data = await image.readRasters();
      // Apply color scale and create canvas
      const canvas = applyColorScale(data, config.layer);
      setImageData(canvas.toDataURL());
    };
    loadRaster();
  }, [config.layer]);
  
  return (
    <Source type="image" url={imageData} coordinates={PUNE_BOUNDS}>
      <Layer type="raster" paint={{ 'raster-opacity': config.opacity }} />
    </Source>
  );
};
```

---

## 6. API Reference

### 6.1 Core Endpoints

| Endpoint | Method | Description | Cache |
|----------|--------|-------------|-------|
| `/api/health` | GET | Database health check | None |
| `/api/warm-up` | GET | Connection pool warm-up | None |
| `/api/city-stats` | GET | Total trees, CO₂ summary | 30min |
| `/api/ward-data` | GET | Trees and CO₂ per ward | 30min |
| `/api/filter-metadata` | GET | Filter dropdown options | 1hr |

### 6.2 Green Cover Endpoints

| Endpoint | Method | Description | Cache |
|----------|--------|-------------|-------|
| `/api/green-cover/bundle` | GET | All green cover data (bundled) | 1hr |
| `/api/land-cover/timeline` | GET | Yearly statistics 2019-2025 | 1hr |
| `/api/land-cover/wards` | GET | Per-ward land cover data | 1hr |
| `/api/land-cover/comparison` | GET | Year-over-year change | 1hr |
| `/api/ward-boundaries` | GET | Ward polygons (GeoJSON) | 1hr |
| `/api/ward-stats` | GET | Census statistics by ward | 30min |

### 6.3 Tree Data Endpoints

| Endpoint | Method | Description | Cache |
|----------|--------|-------------|-------|
| `/api/trees/:id` | GET | Single tree details | 5min |
| `/api/trees-in-bounds` | POST | Trees within bounding box (GeoJSON) | None |
| `/api/tree-archetypes` | GET | Species cooling data | 24hr |
| `/api/filtered-stats` | POST | Stats with filter criteria | None |

### 6.4 Response Examples

#### `/api/land-cover/timeline`

```json
{
  "source": "database",
  "years": [
    {
      "year": 2019,
      "ward_count": "75",
      "avg_trees_pct": "13.45",
      "avg_built_pct": "48.23",
      "total_trees_area_ha": "4567.89",
      "total_built_area_ha": "16234.56"
    }
    // ... more years
  ],
  "year_over_year_changes": [
    {
      "from_year": 2019,
      "to_year": 2020,
      "period": "2019-2020",
      "net_tree_change_ha": "-23.45"
    }
  ],
  "overall_2019_2025": {
    "total_trees_lost_ha": "345.67",
    "total_trees_gained_ha": "123.45",
    "net_tree_change_ha": "-222.22",
    "total_built_gained_ha": "567.89"
  }
}
```

---

## 7. Frontend Components

### 7.1 Component Hierarchy

```
App.tsx
├── ProgressiveLoadingOverlay.tsx   # Initial load animation
├── Header.tsx                       # Top navigation bar
├── TourGuide.tsx                    # Interactive onboarding
├── Sidebar.tsx                      # Tabbed sidebar panel
│   ├── CityOverview.tsx            # Tab 0: City statistics
│   ├── TreeDetails.tsx             # Tab 1: Selected tree info
│   ├── GreenCoverMonitor.tsx       # Tab 2: Satellite analysis ★
│   ├── PlantingAdvisor.tsx         # Tab 3: Temperature predictions
│   ├── MapLayers.tsx               # Tab 4: Layer controls
│   └── LightAndShadowControl.tsx   # Tab 5: Sun position
└── MapView.tsx                      # Main map container
    ├── ThreeDTreesLayer.tsx        # 3D tree rendering
    ├── WardBoundaryLayer.tsx       # Ward polygons
    ├── RasterOverlay.tsx           # Satellite imagery
    ├── DeforestationHotspotsLayer  # Change hotspots
    ├── DrawControl.tsx             # Drawing tools
    └── RealisticShadowsLayer.tsx   # Shadow rendering
```

### 7.2 State Management Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ZUSTAND STORES                               │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐  │
│  │   TreeStore     │  │   FilterStore   │  │ GreenCover     │  │
│  │                 │  │                 │  │ Store          │  │
│  │ • cityStats     │  │ • filters       │  │ • timelineData │  │
│  │ • wardCO2Data   │  │ • metadata      │  │ • wardData     │  │
│  │ • archetypes    │  │ • hasLoaded     │  │ • comparison   │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬───────┘  │
│           │                    │                     │          │
│           │    ┌───────────────▼───────────────┐    │          │
│           │    │      LayerLoadingStore        │    │          │
│           │    │                               │    │          │
│           │    │  • isLoading('ward_overlay')  │    │          │
│           │    │  • isLoading('raster_ndvi')   │    │          │
│           │    │  • setLoading(layer, bool)    │    │          │
│           │    └───────────────────────────────┘    │          │
│           │                                         │          │
└───────────┼─────────────────────────────────────────┼──────────┘
            │                                         │
            ▼                                         ▼
     ┌──────────────┐                         ┌──────────────┐
     │ localStorage │                         │ localStorage │
     │ (cached)     │                         │ (cached)     │
     └──────────────┘                         └──────────────┘
```

---

## 8. Performance Optimizations

### 8.1 CDN Caching Strategy

All API endpoints use Vercel's edge caching with the `Cache-Control` header:

```javascript
// Example: /api/filter-metadata
res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
```

| Directive | Value | Meaning |
|-----------|-------|---------|
| `s-maxage` | 3600 | Cache on CDN for 1 hour |
| `stale-while-revalidate` | 86400 | Serve stale up to 24 hours while refreshing |

**Cache TTLs by Endpoint:**

| Endpoint | s-maxage | stale-while-revalidate |
|----------|----------|------------------------|
| `/api/city-stats` | 30 min | 24 hr |
| `/api/ward-data` | 30 min | 24 hr |
| `/api/filter-metadata` | 1 hr | 24 hr |
| `/api/green-cover/bundle` | 1 hr | 24 hr |
| `/api/tree-archetypes` | 24 hr | 1 week |
| `/api/trees/:id` | 5 min | 1 hr |

### 8.2 Connection Pooling

PgBouncer + serverless-optimized pool settings:

```javascript
const pool = new Pool({
  max: 3,                          // Low per instance, PgBouncer handles scaling
  min: 0,                          // No idle connections in serverless
  idleTimeoutMillis: 10000,        // Close idle after 10s
  connectionTimeoutMillis: 15000,  // Allow time for cold starts
  allowExitOnIdle: true,           // Let serverless function exit
});
```

### 8.3 Query Retry Logic

Essential for handling serverless cold starts and transient connection issues:

```javascript
async function queryWithRetry(queryText, params = [], retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await pool.query(queryText, params);
    } catch (err) {
      const isConnectionError = 
        err.message.includes('timeout') ||
        err.message.includes('connection') ||
        err.code === 'ECONNREFUSED';

      if (isConnectionError && attempt < retries) {
        await new Promise(r => setTimeout(r, delay * attempt)); // Exponential backoff
        continue;
      }
      throw err;
    }
  }
}
```

### 8.4 Warm-Up Cron Job

Vercel cron configuration to prevent cold starts:

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/warm-up",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

This pings the database every 5 minutes, keeping connections warm.

### 8.5 Bundle Endpoint

Instead of 4 separate API calls, the Green Cover Monitor uses a single bundle endpoint:

**Before (4 requests):**
- `/api/land-cover/timeline` (~150ms)
- `/api/land-cover/wards` (~200ms)
- `/api/land-cover/comparison` (~100ms)
- `/api/ward-stats` (~150ms)
- **Total: ~600ms** (sequential) or **~200ms** (parallel but 4 cold starts)

**After (1 request):**
- `/api/green-cover/bundle` (~150ms)
- **Total: ~150ms** (single connection, parallel queries internally)

### 8.6 Client-Side Caching

Zustand stores with localStorage persistence:

```typescript
// Stale-while-revalidate pattern
fetchAllData: async () => {
  const isFresh = lastFetchTime && (Date.now() - lastFetchTime < 5 * 60 * 1000);
  const isStale = lastFetchTime && (Date.now() - lastFetchTime >= 5 * 60 * 1000);
  
  if (hasData && isFresh) {
    return; // Use cached data
  }
  
  if (hasData && isStale) {
    // Show cached data immediately, refresh in background
    refreshInBackground();
    return;
  }
  
  // No data or very stale - fetch fresh
  await fetchFresh();
}
```

---

## 9. Deployment & Infrastructure

### 9.1 Vercel Configuration

```json
// vercel.json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/server.js" }
  ],
  "functions": {
    "api/server.js": {
      "memory": 1024,
      "maxDuration": 60
    }
  },
  "crons": [
    { "path": "/api/warm-up", "schedule": "*/5 * * * *" }
  ]
}
```

### 9.2 Environment Variables

| Variable | Description |
|----------|-------------|
| `DB_HOST` | PgBouncer hostname |
| `DB_PORT` | 25061 (PgBouncer port) |
| `DB_USER` | doadmin |
| `DB_PASSWORD` | Database password |
| `DB_DATABASE` | defaultdb |
| `DB_CA_CERT` | Base64-encoded CA certificate |
| `REDIS_URL` | (Optional) Redis connection URL |
| `VERCEL` | Set to "1" in production |

### 9.3 Database Hosting (DigitalOcean)

| Property | Value |
|----------|-------|
| **Provider** | DigitalOcean Managed Database |
| **Region** | BLR1 (Bangalore, India) |
| **Version** | PostgreSQL 17 |
| **Pool Mode** | Transaction |
| **Pool Size** | 10 connections |

### 9.4 Static Asset Hosting (Cloudflare R2)

| Asset | Size | URL Pattern |
|-------|------|-------------|
| PMTiles | ~50MB | `https://pub-xxx.r2.dev/pune-trees-complete.pmtiles` |
| Raster COGs | ~5-20MB each | `https://pub-xxx.r2.dev/rasters/*.tif` |

---


---

## 12. Technical Appendices

### 12.1 File Structure

```
pune-tree-dashboard/
├── api/
│   ├── server.js              # Express API server (1500+ lines)
│   └── package.json           # Backend dependencies
├── data/
│   ├── pune_ward_landcover_*.csv  # GEE exports (7 files)
│   ├── pune_ward_change_*.csv     # Change detection (7 files)
│   ├── pune-wards.geojson         # Ward boundaries
│   └── import-ward-polygons.sql   # Database import script
├── scripts/
│   ├── gee-multi-year-analysis.js # Google Earth Engine script
│   ├── import-land-cover.cjs      # CSV to PostgreSQL import
│   └── gee-raster-tiles-export.js # COG export script
├── src/
│   ├── App.tsx                    # Main application component
│   ├── components/
│   │   ├── map/
│   │   │   ├── MapView.tsx        # Map container
│   │   │   ├── WardBoundaryLayer.tsx
│   │   │   ├── RasterOverlay.tsx
│   │   │   └── ThreeDTreesLayer.tsx
│   │   └── sidebar/
│   │       └── tabs/
│   │           └── GreenCoverMonitor.tsx  # Main feature (1766 lines)
│   └── store/
│       ├── GreenCoverStore.tsx    # State management
│       ├── FilterStore.tsx
│       └── TreeStore.tsx
├── public/
│   └── rasters/                   # Local development rasters
├── vercel.json                    # Deployment configuration
└── package.json                   # Frontend dependencies
```

### 12.2 Key Dependencies

**Frontend (package.json):**
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "maplibre-gl": "^5.6.1",
    "three": "^0.170.0",
    "react-map-gl": "^7.1.7",
    "zustand": "^4.5.2",
    "geotiff": "^2.1.3",
    "suncalc": "^1.9.0",
    "axios": "^1.7.7",
    "lucide-react": "^0.469.0"
  }
}
```

**Backend (api/package.json):**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "cors": "^2.8.5",
    "suncalc": "^1.9.0"
  },
  "optionalDependencies": {
    "ioredis": "^5.3.2"
  }
}
```

### 12.3 Database Indexes

```sql
-- Trees table (critical for performance)
CREATE INDEX idx_trees_geom ON public.trees USING GIST (geom);
CREATE INDEX idx_trees_common_name ON public.trees(common_name);
CREATE INDEX idx_trees_ward ON public.trees(ward);
CREATE INDEX idx_trees_economic_i ON public.trees(economic_i);
CREATE INDEX idx_trees_distance ON public.trees(distance_to_road_m);

-- Land cover tables
CREATE INDEX idx_land_cover_stats_ward ON land_cover_stats(ward_number);
CREATE INDEX idx_land_cover_stats_year ON land_cover_stats(year);
CREATE INDEX idx_land_cover_change_ward ON land_cover_change(ward_number);

-- Ward polygons
CREATE INDEX idx_ward_polygons_geom ON ward_polygons USING GIST (geometry);
```

### 12.4 Color Palettes

**Green Score:**
```css
Critical (0-29):  #ef4444 (Red)
At Risk (30-49):  #f97316 (Orange)
Moderate (50-69): #eab308 (Yellow)
Good (70-100):    #22c55e (Green)
```

**Tree Probability (0-100%):**
```css
0%:   #f7fcf5 (Very Light Green)
20%:  #c7e9c0 (Light Green)
40%:  #74c476 (Medium Green)
60%:  #31a354 (Green)
80%:  #006d2c (Dark Green)
100%: #00441b (Very Dark Green)
```

**Tree Change (-50% to +50%):**
```css
-50%: #67001f (Dark Red - Severe Loss)
-20%: #d6604d (Red)
0%:   #f7f7f7 (White - No Change)
+20%: #4393c3 (Blue)
+50%: #053061 (Dark Blue - High Gain)
```

### 12.5 Contact & Attribution

**Project Repository:** [github.com/Kaushik-Ravi/pune-tree-dashboard-sample](https://github.com/Kaushik-Ravi/pune-tree-dashboard-sample)

**Data Sources:**
- Tree Census: Pune Municipal Corporation (PMC) Survey 2019
- Satellite Imagery: Google Dynamic World V1 (Sentinel-2)
- Ward Boundaries: PMC Electoral Wards

**Technical Documentation Prepared by:** GitHub Copilot (Claude Opus 4.5)  
**Date:** February 9, 2026

---

*This document is intended for engineers, technical stakeholders, and academicians. For end-user documentation, please refer to the in-app tour guide or user manual.*
