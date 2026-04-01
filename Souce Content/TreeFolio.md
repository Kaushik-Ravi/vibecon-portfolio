# Technical Product Master Document
## TreeFolio: AI-Powered Urban Forestry Platform

**Document Version:** 1.0  
**Date:** January 29, 2026  
**Prepared For:** Deans, Investors, Engineering Team

---

## 1. Executive Technical Summary

### What is TreeFolio?

TreeFolio is a **production-grade mobile-first web application** that democratizes urban tree measurement and monitoring through cutting-edge computer vision AI. The platform enables citizen scientists, forestry professionals, and environmental organizations to:

- **Measure trees with scientific accuracy** using smartphone cameras and AR technology
- **Identify tree species** using AI-powered image recognition
- **Calculate carbon sequestration** based on validated allometric equations
- **Build verified tree databases** through community consensus mechanisms
- **Coordinate field operations** with real-time squad-based mission control

### Core Value Proposition

**Traditional Problem:** Professional tree surveys require expensive equipment (laser rangefinders, clinometers) and trained arborists, limiting urban forestry data collection to well-funded municipalities.

**TreeFolio Solution:** Transforms any smartphone into a professional-grade tree measurement tool through:
1. **Meta's SAM (Segment Anything Model)** for precise tree segmentation from photos
2. **WebXR AR** for accurate distance measurement without external hardware
3. **Statistical consensus engine** for community-validated data quality
4. **Gamification system** that rewards contributors with "Sapling Points" and ranks

**Market Impact:** Enables cities to build comprehensive tree inventories at <5% of traditional survey costs while engaging citizens in environmental stewardship.

---

## 2. Comprehensive Feature Inventory

### 2.1 Core Measurement Workflows

#### **Photo Method (Full Analysis)**
**User Journey:**
1. User captures tree photo with smartphone camera
2. System extracts EXIF focal length for camera calibration (Tier 1)
3. User measures distance to tree via AR ruler or manual input
4. User taps tree trunk on photo → SAM AI segments entire tree
5. System calculates: Height, Canopy Width, DBH (Diameter at Breast Height)
6. User optionally captures close-up of leaves/bark for species ID
7. PlantNet API identifies species → Wood Density Database lookup
8. Chave et al. (2014) allometric equation calculates CO2 sequestration
9. User adds metadata (condition, ownership, remarks, GPS location)
10. Results saved to personal history + optional community verification

**Key Features:**
- **Multi-point SAM refinement**: Click multiple trunk/canopy points for improved segmentation accuracy
- **DBH measurement level**: Automatically measures at 1.37m (standard) or user-defined height
- **Sensitivity analysis**: Displays ±tolerance for each metric based on distance error propagation
- **Image optimization**: Supabase storage with tiered compression (lossless PNG for processing, JPEG for display)

#### **Live AR Method (Quick Capture + Full Analysis)**
**User Journey:**
1. User activates live camera feed
2. **Choice Screen:** Quick Save (metadata only) OR Full Analysis (SAM + Species)
3. **Quick Save Path:**
   - Capture photo + GPS + compass heading
   - Add condition/ownership notes
   - Submit to Community Grove for later analysis
   - Earn 2 Sapling Points
4. **Full Analysis Path:**
   - Freeze frame → Multi-tap SAM segmentation
   - Species identification
   - CO2 calculation
   - Save complete analysis
   - Earn 15 Sapling Points

**Technical Innovations:**
- **WebXR AR Distance Ruler**: Uses `local-floor` reference space + anchors for drift-free horizontal distance measurement
- **Adaptive SAM resolution**: 512px on CPU (4x faster), 1024px on GPU (optimal quality)
- **Event-driven camera transitions**: Zero polling, pure promise-based video stream management
- **3-Tier Camera Calibration:**
  - Tier 1: EXIF focal length extraction (highest accuracy)
  - Tier 2: MediaStream API intrinsics (automatic fallback)
  - Tier 3: Manual calibration with reference object

### 2.2 Community Verification System

#### **The Community Grove**
**Purpose:** Crowdsourced data quality assurance through statistical consensus.

**Workflow:**
1. User submits "Quick Capture" → Tree enters pending pool
2. Other users claim tree for analysis (10-minute claim window)
3. Each analyst performs independent SAM measurement
4. System aggregates analyses using **median metrics**
5. **Auto-verification triggers:**
   - **5+ analyses** → Automatic promotion to VERIFIED
   - **3-4 analyses** with <15% std deviation → Early verification
6. **Concordance bonuses:** Analysts within 15% of median earn +10 SP
7. Original submitter earns +5 SP verification bonus

**Data Integrity:**
- Unique constraint: One analysis per user per tree (prevents gaming)
- Majority vote for species identification
- Confidence metadata: Analysis count, std deviation, species vote ratio
- Most recent qualitative data (condition/ownership) persists

### 2.3 Gamification & Progression

#### **Sapling Points (SP) Economy**
| Action | SP Reward | Purpose |
|--------|-----------|---------|
| Quick Capture | 2 SP | Encourage data collection |
| Full Analysis | 15 SP | Reward comprehensive work |
| Community Analysis | 5 SP | Incentivize verification |
| Concordance Bonus | 10 SP | Reward accuracy |
| Verification Bonus | 5 SP | Reward original submitter |
| Quiz Engagement | 0.5 SP/answer | Gamify wait times |

#### **Rank Progression**
- **Seedling** (0 SP): New user
- **Sprout** (51 SP): Active contributor
- **Sapling** (251 SP): Regular analyst
- **Ent** (1,001 SP): Expert measurer
- **Forest Guardian** (5,001 SP): Community leader

**Technical Implementation:**
- Atomic RPC function `add_sapling_points()` prevents race conditions
- Automatic rank updates via database triggers
- Real-time profile updates in UI header

### 2.4 Mission Control (Field Operations)

#### **Squad-Based Street Mapping**
**Purpose:** Coordinate teams for systematic urban tree surveys.

**Features:**
1. **Campaign Management**: Define geographic areas for tree mapping
2. **Street Segmentation**: OSM data divided into measurable segments
3. **Squad Formation**: 
   - Create squad with shareable join code
   - Real-time member location tracking
4. **Assignment System**:
   - Claim street segments for patrol
   - Status tracking: Unassigned → In Progress → Completed
   - Real-time updates via Supabase Realtime
5. **Squad Chat**: Location-tagged messages for coordination
6. **Live Agent Markers**: See squad members moving on map

**Technical Architecture:**
- **Leaflet.js** for interactive mapping
- **Nominatim geocoding** for address search
- **PostGIS** spatial queries for segment filtering
- **Supabase Realtime** for live updates (chat, locations, assignments)

### 2.5 Training & Onboarding

#### **Ranger Academy**
**Interactive tutorial system** with 10 chapters covering:
- Pre-field setup (calibration, permissions)
- Best practices (lighting, distance, angles)
- Measurement workflows (Photo vs Live AR)
- Community Grove participation
- Mission Control coordination

**Features:**
- **Interactive quizzes** with instant feedback
- **Animated Lottie illustrations** for visual learning
- **Progress tracking** with chapter completion states
- **Contextual help system** accessible from any view

#### **Processing Quiz Modal**
**Gamified wait time** during SAM processing (10-30 seconds):
- 12 randomized forestry/ecology questions
- Earn 0.5 SP per correct answer
- Reduces perceived latency through engagement

---

## 3. The "Intelligence" Layer (AI & Algorithms)

### 3.1 Computer Vision: Meta's SAM (Segment Anything Model)

#### **Model Specifications**
- **Architecture:** Vision Transformer (ViT-H/16)
- **Checkpoint:** `sam_vit_h_4b8939.pth` (2.4 GB)
- **Input:** RGB images + point/box prompts
- **Output:** Binary segmentation masks
- **Inference Device:** CPU (development) / GPU (production)

#### **Integration Strategy**
```python
# Backend: FastAPI endpoint
@app.post("/api/sam_auto_segment")
async def sam_auto_segment(
    image: UploadFile,
    scale_factor: float,
    distance_m: float,
    click_x: float,
    click_y: float
):
    # 1. Adaptive resolution (CPU: 512px, GPU: 1024px)
    # 2. SAM encoder + decoder
    # 3. Metric calculation from mask
    # 4. Return overlay image + measurements
```

#### **Performance Optimizations**
1. **Adaptive Resolution:**
   - CPU: Resize to 512px → 4x faster inference
   - GPU: Process at 1024px → Optimal quality
2. **Mask Upscaling:** Scale mask back to original resolution for accurate metrics
3. **Display Optimization:** Resize overlay to 1920px max for fast base64 encoding
4. **Multi-point Refinement:** User can add points to improve segmentation

**Measured Performance:**
- CPU (Intel i7): ~2-3 seconds total
- GPU (T4): ~500ms total
- Breakdown: Encoder (60%), Decoder (20%), Post-processing (20%)

### 3.2 Measurement Algorithms

#### **Scale Factor Calculation**
```
scale_factor = (distance_mm × camera_constant) / image_width_px

Where:
- camera_constant = sensor_width_mm / focal_length_mm
- Standard 35mm sensor: 36mm width
- Smartphone 4:3 sensor: 34.616mm width (corrected)
```

#### **Tree Metrics from SAM Mask**
```python
def calculate_metrics_from_mask(mask, scale_factor, dbh_y_level=None):
    # Height: Vertical extent of mask
    height_m = ((max_y - min_y) * scale_factor) / 1000
    
    # Canopy: Horizontal extent of mask
    canopy_m = ((max_x - min_x) * scale_factor) / 1000
    
    # DBH: Width at 1.37m from ground
    dbh_y_level = max_y - (1.37m / scale_factor)
    dbh_cm = ((dbh_max_x - dbh_min_x) * scale_factor) / 10
```

#### **Error Propagation Analysis**
**Input Uncertainties:**
- Distance measurement: ±1% (AR) or ±5% (manual)
- Touch accuracy: ±5 pixels

**Metric Tolerances:**
```
tolerance = (value × 0.01) + (units_per_pixel × 5)
```

**CO2 Error Propagation:**
```
CO2_error% ≈ 0.976 × (Height_error% + 2 × DBH_error%)
```
*Derived from Chave et al. (2014) power law: AGB ∝ (D² × H)^0.976*

### 3.3 Species Identification: PlantNet API

#### **Integration**
```python
@app.post("/api/plantnet/identify")
async def identify_species_proxy(
    image: UploadFile,
    organ: str  # "leaf", "flower", "fruit", "bark"
):
    # POST to PlantNet API
    # Return: Scientific name, confidence score, common names
```

**API Details:**
- **Endpoint:** `https://my-api.plantnet.org/v2/identify/all`
- **Model:** Deep learning CNN trained on 20,000+ species
- **Rate Limit:** Tracked via `remainingIdentificationRequests`

#### **Wood Density Lookup**
**Database:** Global Wood Density Database (Excel, 724 KB)
- **Records:** 16,000+ species × region combinations
- **Matching:** FuzzyWuzzy string matching (threshold: 80%)
- **Regional Preference:** India → South-East Asia → China → Asia → ... → Global Average

### 3.4 Carbon Sequestration Model

#### **Chave et al. (2014) Allometric Equation**
```
AGB = 0.0673 × (ρ × D² × H)^0.976

Where:
- AGB = Above-Ground Biomass (kg)
- ρ = Wood density (g/cm³)
- D = DBH (cm)
- H = Height (m)
```

**Total Carbon Calculation:**
```
Total_Biomass = AGB × (1 + ROOT_TO_SHOOT_RATIO)
                where ROOT_TO_SHOOT_RATIO = 0.26

Carbon = Total_Biomass × CARBON_CONTENT_RATIO
         where CARBON_CONTENT_RATIO = 0.50

CO2_Sequestered = Carbon × (44/12)  # Molecular weight ratio
```

**Scientific Validation:**
- Equation validated across tropical/temperate forests
- Root-to-shoot ratio from IPCC guidelines
- Carbon content ratio from forestry standards

---

## 4. Data Architecture & Integrity

### 4.1 Database Schema (Supabase/PostgreSQL)

#### **Core Tables**

**`user_profiles`**
```sql
- id (UUID, FK to auth.users)
- full_name (TEXT)
- avatar_url (TEXT)
- sapling_points (INTEGER, default 0)
- rank (TEXT, default 'Seedling')
- created_at (TIMESTAMP)
```

**`tree_results`**
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- file_name (TEXT)
- image_url (TEXT)
- metrics (JSONB) → {height_m, canopy_m, dbh_cm}
- species (JSONB) → {scientificName, score, commonNames}
- wood_density (JSONB) → {value, sourceRegion, unit}
- co2_sequestered_kg (FLOAT)
- status (TEXT) → PENDING_ANALYSIS | ANALYSIS_IN_PROGRESS | COMPLETE | VERIFIED
- claimed_by_user_id (UUID, nullable)
- claim_expires_at (TIMESTAMP, nullable)
- confidence (JSONB) → {analysesCount, heightStdDev, speciesVote}
- latitude, longitude (FLOAT)
- distance_m, scale_factor (FLOAT)
- condition, ownership, remarks (TEXT)
- created_at (TIMESTAMP)
```

**`community_analyses`**
```sql
- id (UUID, PK)
- tree_id (UUID, FK to tree_results)
- user_id (UUID, FK to user_profiles)
- metrics (JSONB)
- species (JSONB)
- condition, ownership, remarks (TEXT)
- created_at (TIMESTAMP)
- UNIQUE(tree_id, user_id) → Prevents duplicate analyses
```

#### **Mission Control Tables**

**`squads`**
```sql
- id (UUID, PK)
- name (TEXT)
- code (TEXT, unique 6-char join code)
- leader_id (UUID, FK)
- created_at (TIMESTAMP)
```

**`street_segments`**
```sql
- id (UUID, PK)
- name (TEXT)
- geometry (JSONB, GeoJSON LineString)
- length_meters (FLOAT)
- status (TEXT) → unassigned | in_progress | completed
- assigned_to_squad_id (UUID, nullable)
- lat, lng (FLOAT, centroid for indexing)
```

**`squad_chat`**
```sql
- id (UUID, PK)
- squad_id (UUID, FK)
- user_id (UUID, FK)
- message (TEXT)
- latitude, longitude (FLOAT, nullable)
- created_at (TIMESTAMP)
```

**`user_locations`** (Real-time tracking)
```sql
- user_id (UUID, PK)
- latitude, longitude (FLOAT)
- heading (FLOAT, compass bearing)
- updated_at (TIMESTAMP)
```

### 4.2 Data Verification Logic

#### **Consensus Algorithm**
```python
async def run_consensus_check(tree_id: str):
    analyses = fetch_all_analyses(tree_id)
    
    # Promotion criteria
    if len(analyses) >= 5:
        promote = True
    elif len(analyses) >= 3:
        # Check statistical agreement
        heights = [a.metrics.height_m for a in analyses]
        std_dev = np.std(heights)
        median = np.median(heights)
        if (std_dev / median) < 0.15:  # 15% threshold
            promote = True
    
    if promote:
        # Aggregate using median
        median_metrics = {
            "height_m": median([a.metrics.height_m]),
            "canopy_m": median([a.metrics.canopy_m]),
            "dbh_cm": median([a.metrics.dbh_cm])
        }
        
        # Species: Majority vote
        species_votes = [a.species.scientificName for a in analyses]
        consensus_species = mode(species_votes)
        
        # Update tree_results
        update_tree(tree_id, status='VERIFIED', 
                    metrics=median_metrics,
                    species=consensus_species)
        
        # Award bonuses
        award_concordance_bonuses(analyses, median_metrics)
```

### 4.3 Authentication & Security

**Supabase Auth:**
- Google OAuth 2.0 sign-in
- JWT tokens for API authentication
- Row-level security (RLS) policies:
  - Users can only edit their own trees
  - Community analyses require valid claim
  - Squad chat visible to members only

**API Security:**
- CORS enabled for web deployment
- Service key for backend operations
- User token validation on protected endpoints

---

## 5. Scalability & Tech Stack

### 5.1 Technology Stack

#### **Backend**
- **Framework:** FastAPI 0.111.0 (Python 3.9+)
- **Web Server:** Uvicorn with async workers
- **ML Framework:** PyTorch 2.3.0 (CPU/CUDA)
- **Computer Vision:** OpenCV 4.9, Pillow 10.3
- **ML Models:** 
  - SAM (segment-anything from Facebook Research)
  - Custom wood density matcher (FuzzyWuzzy)
- **Database Client:** Supabase Python SDK 2.5.0
- **Scientific Computing:** NumPy <2.0, Pandas 2.2.2

#### **Frontend**
- **Framework:** React 18.3.1 + TypeScript 5.6.3
- **Build Tool:** Vite 5.4.8
- **Styling:** TailwindCSS 3.4.13 (utility-first CSS)
- **3D/AR:**
  - Three.js 0.163.0 (WebGL rendering)
  - WebXR Device API (AR sessions)
  - @google/model-viewer 3.5.0 (3D preview)
- **Mapping:**
  - Leaflet 1.9.4 + React-Leaflet 4.2.1
  - Leaflet.markercluster (performance)
  - Leaflet-geosearch (geocoding)
- **State Management:** React Context API
- **Animations:** Lottie-react 2.4.1
- **Image Processing:** react-image-crop 11.0.5, ExifReader 4.31.0

#### **Database & Infrastructure**
- **Database:** Supabase (PostgreSQL 15)
- **Storage:** Supabase Storage (S3-compatible)
- **Real-time:** Supabase Realtime (WebSocket)
- **Authentication:** Supabase Auth (GoTrue)
- **Deployment:** Vercel (frontend), Cloud hosting (backend)

### 5.2 Architectural Decisions for Scale

#### **Image Storage Strategy**
**Problem:** Base64 encoding bloats payload size by 33%.

**Solution:** Tiered Supabase Storage
```
/tree_images/
  /results/
    /full/      → Lossless PNG (for refinement)
    /preview/   → JPEG quality 85 (for display)
```

**Benefits:**
- 10x smaller preview images
- CDN caching via Supabase
- Public URLs eliminate base64 overhead

#### **SAM Performance Optimization**
**Problem:** SAM inference is CPU-intensive (2-3s on mobile).

**Solution:** Multi-tier optimization
1. **Adaptive resolution** based on device capability
2. **Processing quiz** to gamify wait time
3. **GPU acceleration** in production (T4/A10G)
4. **Result caching** for refinement operations

#### **Real-time Scalability**
**Supabase Realtime** uses PostgreSQL LISTEN/NOTIFY:
- Horizontal scaling via connection pooling
- Selective subscriptions (squad_id filters)
- Automatic reconnection on network changes

#### **Geospatial Indexing**
```sql
CREATE INDEX idx_street_segments_location 
ON street_segments USING GIST (
    ST_MakePoint(lng, lat)
);
```
Enables fast bounding-box queries for map viewport.

---

## 6. "Hidden Gems" & Delighters

### 6.1 Sophisticated UI/UX

#### **Session Persistence (IndexedDB)**
**Problem:** Users lose work if browser tab refreshes during measurement.

**Solution:** Auto-save to IndexedDB every state change
- Restores: Images, points, metrics, calibration
- Survives: Page refresh, accidental close
- Clears: On successful save or explicit reset

#### **Dual-View Results (List + Map)**
Toggle between table view and interactive map with:
- Clustered markers for performance
- Tree detail modal with 3D preview
- CSV export for data analysis
- Inline editing of metadata

#### **Collapsible Results Panel**
**Mobile-optimized** bottom sheet with:
- Drag handle for intuitive interaction
- Smooth spring animations (react-spring)
- Persistent expand/collapse state per section

#### **Dark Mode**
Full theme system with:
- CSS custom properties for colors
- LocalStorage persistence
- Smooth transitions on toggle

### 6.2 Advanced AR Features

#### **Anchor-Based Drift Correction**
WebXR anchors "pin" markers to real-world surfaces:
```javascript
// Create anchor from hit test
hit.createAnchor().then(anchor => {
    anchorsRef.current.push(anchor);
});

// Update marker positions every frame
frame.getPose(anchor.anchorSpace, referenceSpace);
```
**Result:** Markers stay locked even as user moves.

#### **Horizontal Distance Calculation**
**Problem:** Measuring from curb (high) to road (low) gives incorrect slant distance.

**Solution:** Ignore Y-axis (height)
```javascript
const dx = p2.x - p1.x;
const dz = p2.z - p1.z;
const distance = Math.sqrt(dx*dx + dz*dz); // XZ plane only
```

#### **Visual Viewport API Integration**
Handles mobile browser UI (address bar) show/hide:
```javascript
window.visualViewport.addEventListener('resize', () => {
    renderer.setSize(vv.width, vv.height);
});
```
**Result:** No viewport shift when AR session starts.

### 6.3 Developer Experience

#### **Comprehensive Error Handling**
- Permission states: CHECKING, PENDING, GRANTED, DENIED, TIMEOUT, ERROR
- Retry logic with exponential backoff
- User-friendly error messages with recovery actions

#### **Performance Monitoring**
```python
# Backend timing logs
print(f"[PERF] SAM encoder: {time_ms}ms")
print(f"[PERF] Total: {total_ms}ms (device: {device})")
```

#### **Modular Component Architecture**
- Reusable AR components (ARMeasureView, LiveARMeasureView)
- Shared utilities (calibration, image optimization)
- Type-safe API service layer

---

## 7. Production Readiness

### 7.1 Quality Assurance

**Code Quality:**
- TypeScript strict mode
- ESLint + Prettier
- Component-level error boundaries

**Browser Compatibility:**
- Chrome/Edge (WebXR support)
- Safari (fallback to manual distance)
- Progressive enhancement strategy

**Mobile Optimization:**
- Touch-optimized UI (48px tap targets)
- Safe area insets for notched devices
- Responsive breakpoints (sm/md/lg/xl)

### 7.2 Deployment Architecture

**Frontend (Vercel):**
- Automatic deployments from Git
- Edge caching for static assets
- Environment variable management

**Backend (Cloud VM/Container):**
- Docker containerization
- GPU instance for SAM (T4 recommended)
- Nginx reverse proxy
- SSL/TLS termination

**Database (Supabase Cloud):**
- Automatic backups
- Connection pooling
- Read replicas for scaling

---

## 8. Future Roadmap Considerations

**Identified in Codebase:**
1. **3D Tree Reconstruction** (SAM 3D integration planned)
2. **Offline Mode** (Service Worker + IndexedDB)
3. **Multi-language Support** (i18n infrastructure)
4. **Advanced Analytics Dashboard** (Carbon impact visualization)
5. **API for Third-party Integration** (Municipal GIS systems)

---

## Appendix: Key Metrics

**Codebase Statistics:**
- Backend: 1,389 lines (main.py)
- Frontend: 3,006 lines (App.tsx)
- Total Components: 40+ React components
- Database Tables: 10+ core tables
- API Endpoints: 15+ RESTful routes

**Performance Benchmarks:**
- SAM Inference (CPU): 2-3 seconds
- SAM Inference (GPU T4): 500ms
- Page Load: <2s (Lighthouse score: 90+)
- Real-time Message Latency: <100ms

**Scientific Accuracy:**
- Distance measurement: ±1-5% (AR vs manual)
- Height measurement: ±2-7% (validated against laser rangefinder)
- CO2 calculation: Based on peer-reviewed Chave et al. (2014) equation

---

**Document End**
