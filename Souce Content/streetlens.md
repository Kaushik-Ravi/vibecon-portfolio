# StreetLens VLM: Exhibition Master Document

> **Comprehensive Product Documentation for Exhibitions, Partnerships & Stakeholder Communication**
> 
> **Version:** 2.1.0 | **Last Updated:** February 2026 | **Status:** Production-Ready

---

## 🎯 Executive Summary

**StreetLens VLM** is an AI-powered urban infrastructure auditing platform that transforms how cities analyze and improve their street infrastructure. Using cutting-edge Vision Language Models (Google Gemini 2.0 Flash) combined with Google Street View imagery, StreetLens automatically detects, classifies, and grades urban infrastructure elements—delivering actionable insights that would traditionally require weeks of manual fieldwork.

### What Makes StreetLens Unique?

- **🤖 AI-First Approach**: Powered by Google's latest Gemini 2.5 Flash Vision Language Model
- **🌍 Zero Field Work Required**: Analyzes streets remotely using existing Google Street View imagery
- **📊 Comprehensive Analysis**: Detects 14+ infrastructure elements in a single scan
- **⚡ Lightning Fast**: Complete street audit in 2-3 minutes vs. days of manual inspection
- **💰 Cost-Effective**: Reduces infrastructure audit costs by up to 90%
- **🎯 Actionable Insights**: Provides quantitative scoring and prioritized recommendations

###  Who Is This For?

**Primary Audience:**
- 🏛️ **Municipal Authorities** - City planners, urban development officers
- 🏗️ **Urban Planners** - Infrastructure consultants, project managers
- 👥 **Civic Organizations** - NGOs, community groups, advocacy organizations
- 💼 **Real Estate Developers** - Site evaluation, neighborhood analysis
- 🎓 **Researchers** - Urban studies, transportation, civic tech

**Secondary Audience:**
- Students (age 13-24) interested in AI, civic tech, and urban planning
- Tech enthusiasts exploring practical AI applications
- Philanthropists supporting smart city initiatives

---

## 🌟 The Problem We Solve

### Traditional Infrastructure Auditing: Expensive, Slow, and Incomplete

Traditional street infrastructure assessment involves:

1. **Manual field surveys** requiring trained personnel
2. **Weeks or months** to cover even small areas
3. **High costs** (₹500-2000 per kilometer for basic audits)
4. **Inconsistent data** due to human subjectivity
5. **Safety risks** for field workers in high-traffic areas
6. **Weather dependency** and limited repeat monitoring

### StreetLens Solution: Smart, Scalable, and Scientific

StreetLens eliminates these barriers by:

- ✅ **Automated AI analysis** - No field personnel required
- ✅ **Minutes, not months** - Instant results for any street worldwide
- ✅ **90% cost reduction** - Leverage existing Google Street View data
- ✅ **Objective, consistent** - AI provides standardized assessments
- ✅ **Safe and accessible** - All analysis done remotely
- ✅ **Time-series tracking** - Monitor changes over multiple years

---

## 🔍 Core Capabilities & Features

### 1. Comprehensive Infrastructure Detection (14+ Elements)

StreetLens uses advanced computer vision to detect and analyze:

#### **🚧 Road Infrastructure**
- **Potholes** - Surface damage and defects
- **Road Surface Quality** - Good, fair, or poor condition assessment
- **Lane markings** visibility

#### **💡 Lighting & Safety**
- **Street Lights** - Count and location of public lighting
- **Signage Classification** (4 types):
  - 🚦 Road Signs (traffic signals, stop signs)
  - 🏷️ Street Name Signs
  - ⚠️ Safety Signs (warnings, hazards)
  - 📋 Other Signs (commercial, advertisements)

#### **🚶 Pedestrian Infrastructure**
- **Footpaths/Sidewalks** - Presence and coverage percentage
- **Footpath Encroachment** - Vehicles or vendors blocking pathways
- **Pedestrian accessibility** assessment

#### **🌆 Environmental & Urban Quality**
- **Overhead Wires** - Density assessment (low/medium/high)
- **Garbage Blackspots** - Litter accumulation severity
- **Open Drains** - Visibility and safety hazards
- **Vegetation** - Tree cover and greenery density
- **Lighting Quality** - Blackspot detection for poorly lit areas

#### **🏘️ Context Intelligence**
- **Street Type Classification** - Residential, Commercial, or Industrial
- **Vehicles Parked** - Count and parking behavior analysis
- **Houses Visible** - Contextual density information
- **Dustbins** - Waste management infrastructure

### 2. Advanced AI Technology Stack

#### **Gemini 2.5 Flash Vision Language Model**
- Multi-modal understanding (text + vision)
- Contextual reasoning for Indian urban infrastructure
- Confidence scoring for each detection
- Bounding box generation with 8 color-coded categories

#### **Smart Deduplication with DBSCAN Clustering**
- Prevents counting the same object from multiple angles
- GPS-based spatial clustering (15m radius)
- Ensures accurate counts even with 4-directional capture

#### **Adaptive Sampling Algorithm**
- Dynamic image capture based on street length
- Optimized heading calculation for street-aligned views
- Reduces API costs by 50% vs. naive approaches

### 3. Comprehensive Scoring System

**100-Point Street Quality Score** with weighted components:

| Component | Weight | Criteria |
|-----------|--------|----------|
| 🚧 **Pothole Score** | 25 pts | Fewer potholes = higher score |
| 🚶 **Footpath Score** | 20 pts | More footpath coverage = better |
 | 💡 **Lighting Score** | 15 pts | Adequate street light density |
| 🧹 **Cleanliness Score** | 15 pts | Absence of garbage blackspots |
| 🛡️ **Safety Score** | 15 pts  | Good signage + no blackspots |
| 🏗️ **Infrastructure** | 10 pts | Dustbins + minimal wire clutter |

**Score Interpretation:**
- 🟢 **70-100**: Excellent street quality
- 🟡 **50-69**: Moderate quality (needs attention)
- 🔴 **0-49**: Poor quality (urgent improvements required)

### 4. Interactive Web Interface

- **🗺️ Map-Based Selection**: Click two points to define street segment
- **📊 Real-Time Dashboard**: Live progress tracking during analysis
- **🖼️ Image Gallery**: Original vs. AI-annotated comparison sliders
- **📈 Visual Analytics**: Score gauges, breakdown charts, and trend indicators
- **💾 Export Options**: JSON data, annotated images, and comprehensive reports

### 5. Production-Ready Backend API

#### **FastAPI-Based Architecture**
- ⚡ High-performance async endpoints
- 🔐 JWT authentication with Redis-based rate limiting
- 📦 MongoDB Atlas for persistent data storage
- 🔄 Celery background processing for long-running tasks
- 📊 Sentry error tracking and monitoring

#### **Deployed on Heroku**
- 🌍 Live at: `https://streetlens-vlm-api-ecca9f6afa3b.herokuapp.com`
- 📚 Auto-generated API docs: `/docs` (Swagger)
- ✅ Health check endpoint: `/api/health`

#### **Key API Endpoints**
```
POST /api/v1/auth/register   - Create user account
POST /api/v1/auth/login      - Get JWT access token
POST /api/v1/analysis/analyze - Run street audit
POST /api/v1/analysis/streets - Get analyzable street segments
```

### 6. Geospatial Intelligence (OSMnx Integration)

- **Street Network Extraction** - Uses OpenStreetMap data via OSMnx
- **Segment-Based Analysis** - Analyze specific OSM way IDs
- **Accurate Length Calculation** - Haversine distance for street segments
- **Network Graph Analysis** - NetworkX for route optimization

---

## 🎨 Technical Architecture

### System Components

```
┌────────────────────────────────────────────────────────┐
│                   Web Interface                         │
│  (React/Next.js - Interactive Map + Dashboard)         │
└─────────────────┬──────────────────────────────────────┘
                  │ HTTPS/REST API
┌─────────────────▼──────────────────────────────────────┐
│             FastAPI Backend (Python 3.10)              │
│  - JWT Auth  - Rate Limiting  - Async Processing      │
└─────┬──────────┬──────────────┬─────────────┬─────────┘
      │          │              │             │
      ▼          ▼              ▼             ▼
┌─────────┐ ┌─────────┐  ┌───────────┐ ┌──────────┐
│ MongoDB │ │  Redis  │  │  Gemini   │ │  Google  │
│  Atlas  │ │  Cache  │  │  2.5 AI   │ │   Maps   │
│  (DB)   │ │ (Queue) │  │   (VLM)   │ │   API    │
└─────────┘ └─────────┘  └───────────┘ └──────────┘
      │          │              │             │
      └──────────┴──────────────┴─────────────┘
                Analysis Pipeline
      ┌──────────────────────────────────┐
      │  1. Fetch Street View images     │
      │  2. Call Gemini Vision API       │
      │  3. Deduplicate with DBSCAN      │
      │  4. Calculate quality score      │
      │  5. Validate with OSM data       │
      │  6. Save results to MongoDB      │
      └──────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | HTML, CSS, JavaScript | Interactive UI with map interface |
| **Backend** | FastAPI (Python 3.10) | High-performance async API |
| **AI Model** | Google Gemini 2.5 Flash | Visual analysis & grading |
| **Database** | MongoDB Atlas (Motor) | Async data persistence |
| **Cache/Queue** | Redis (Heroku Data) | Rate limiting, caching, Celery broker |
| **Background** | Celery | Long-running analysis tasks |
| **Maps** | Google Maps Static API | Street View imagery |
| **Geospatial** | OSMnx / NetworkX | Road network extraction |
| **Monitoring** | Sentry | Real-time error tracking |

### Data Flow

1. **User selects street** on interactive map (2 clicks)
2. **System calculates route** and determines optimal sampling points
3. **Fetches Street View images** from Google Maps API (2-10 locations, 2 headings each)
4. **Gemini AI analyzes each image**:
   - Detects 14+ infrastructure elements
   - Generates bounding boxes with confidence scores
   - Returns structured JSON response
5. **DBSCAN deduplication** clusters detections to prevent multi-angle duplicates
6. **Quality score calculation** using weighted 6-component formula
7. **OSM validation** cross-references detected infrastructure with OpenStreetMap data
8. **Results saved to MongoDB** with full audit trail
9. **Dashboard displays** annotated images, scores, and actionable recommendations

---

## 💼 Use Cases & Applications

### 🏛️ Municipal Authorities

#### **Use Case: Citywide Infrastructure Assessment**
**Challenge**: Manually surveying 1000+ kilometers of city roads is prohibitively expensive and time-consuming.

**StreetLens Solution**:
- Audit entire city in **days instead of months**
- **Prioritize maintenance** based on objective quality scores
- **Track improvements** over time with historical comparisons
- **Allocate budgets** to streets with lowest scores first

**Impact Metrics**:
- 90% cost reduction vs. traditional surveys
- 100x faster data collection
- Objective prioritization for ₹10 crore+ annual budgets

---

### 🏗️ Urban Planners & Consultants

#### **Use Case: Neighborhood Walkability Assessment**
**Challenge**: Determining which areas need pedestrian infrastructure improvements requires extensive fieldwork.

**StreetLens Solution**:
- **Footpath coverage maps** showing gaps in pedestrian infrastructure
- **Encroachment analysis** identifying illegally occupied walkways
- **Safety hotspot detection** for poorly lit areas
- **Before/after comparisons** to validate intervention effectiveness

**Impact Metrics**:
- Identify 100+ streets needing footpath improvements in 1 day
- Generate data-driven proposals for civic funding
- Measure ROI of completed projects with hard data

---

### 👥 Civic Organizations & NGOs

#### **Use Case: Evidence-Based Advocacy**
**Challenge**: Fighting for infrastructure improvements requires hard data, not anecdotal complaints.

**StreetLens Solution**:
- **Automated documentation** of 100+ infrastructure violations
- **Visual proof** with annotated Street View images
- **Comparative analysis** showing wealthy vs. underserved areas
- **Shareable reports** for media, RTI requests, and public campaigns

**Impact Metrics**:
- Build air-tight cases with 1000+ data points in hours
- Win civic battles with objective, AI-verified evidence
- Scale advocacy from 1 street to entire districts

---

### 💼 Real Estate & Property Development

#### **Use Case: Neighborhood Quality Scoring**
**Challenge**: Buyers want objective data on street infrastructure quality, not just property specs.

**StreetLens Solution**:
- **StreetScore™** for every neighborhood (0-100 scale)
- **Infrastructure amenity maps** showing lights, dustbins, signage
- **Safety ratings** based on lighting and blackspot analysis
- **Investment opportunity identification** (low scores = improvement potential)

**Impact Metrics**:
- Differentiate properties with transparent infrastructure data
- Identify  up-and-coming neighborhoods before prices rise
- Reduce site visit costs by pre-filtering based on street quality

---

### 🎓 Academic Research & Smart City Innovation

#### **Use Case: Urban Studies & Transportation Research**
**Challenge**: Researchers need large-scale datasets to study urban development patterns.

**StreetLens Solution**:
- **Open data generation** for hundreds of streets
- **Time-series analysis** tracking infrastructure evolution
- **Cross-city benchmarking** comparing Indian cities to global standards
- **Machine learning datasets** for training better urban AI models

**Impact Metrics**:
- Publish research with 10,000+ validated data points
- Build predictive models for infrastructure degradation
- Train next-gen urban planners with real-world data

---

## 🚀 How StreetLens Works: User Journey

### **Step 1: Select Street Segment (30 seconds)**
1. Open StreetLens web interface
2. Search for your city or location
3. Click **Start Point** on the map (blue marker appears)
4. Click **End Point** to define the segment (red marker + route line)
5. Click **"Analyze Street"** button

### **Step 2: AI Analysis in Progress (2-3 minutes)**
**What's happening behind the scenes:**
- ✅ Calculating optimal sampling points along the route
- ✅ Fetching 4-20 Street View images from Google Maps
- ✅ Gemini AI analyzing each image (detecting 14+ elements)
- ✅ Running DBSCAN deduplication on detections
- ✅ Cross-referencing with OpenStreetMap data
- ✅ Calculating comprehensive quality score

**User sees:**
- Real-time progress bar ("Capturing images... 6/12")
- Estimated time remaining
- Current analysis step description

### **Step 3: Results Dashboard (Immediate)**

#### **A. Score Hero Section**
- **Giant animated score** counting from 0 → final (e.g., 87/100)
- **Color-coded gauge**: Green (excellent), Yellow (moderate), Red (poor)
- **Breakdown chart** showing contribution of each component
- **Grade label**: ★★★★☆ Excellent / ★★★☆☆ Moderate / ★★☆☆☆ Poor

#### **B. Quantitative Findings**
```
📊 Detections Summary:
- 🕳️ Potholes: 3
- 💡 Street Lights: 8
- 🚗 Vehicles Parked: 12 (5 on footpath ⚠️)
- 🗑️ Dustbins: 2
- 🚦 Signage: 6 total (4 road signs, 1 street name, 1 safety)
```

#### **C. Qualitative Observations**
```
✅ Footpath present (83% coverage)
⚠️ Overhead wires detected (medium density)
✅ No garbage blackspots
✅ Good lighting (no blackspots)
```

#### **D. Image Gallery**
- **Before/After comparison sliders** (original ↔ AI-annotated)
- **Color-coded bounding boxes** for each detection type
- **Click to zoom** fullscreen view with pan/zoom
- **Filter by detection type** (show only potholes, lights, etc.)

#### **E. Map Visualization**
- **Green circle markers** showing analyzed locations
- **Route polyline** highlighting the audited segment
- **GPS coordinates** and heading for each capture point

### **Step 4: Export & Action (Optional)**
- **Download JSON** with full structured data
- **Save annotated images** (original + bounding boxes + audit metadata)
- **Generate PDF report** (coming soon)
- **Share via link** with colleagues/stakeholders

---

## 🌍 Impact & Benefits

### **For Cities**
- 💰 **Save ₹10-50 lakhs** on annual infrastructure surveys
- ⚡ **10x faster** decision-making with instant data
- 📊 **Data-driven budgeting** - allocate funds where needed most
- 🎯 **Track interventions** - measure if repairs actually worked

### **For Citizens**
- 🗣️ **Empower advocacy** with hard evidence
- 🚶 **Safer streets** through improved lighting/footpath monitoring
- 🌳 **Better quality of life** in data-informed neighborhoods
- 👀 **Transparency** - see exactly what's wrong (and what's improving)

### **For the Environment**
- 🚴 **Promote walkability** by identifying footpath gaps
- 🌱 **Measure green cover** with vegetation density analysis
- 🔌 **Reduce visual pollution** by mapping overhead wire clutter
- ♻️ **Waste management** tracking via dustbin and garbage detection

### **For Innovation**
- 🤖 **AI for social good** - democratizing expensive urban data
- 📡 **Open data potential** - public datasets for researchers
- 🌐 **Global scalability** - works anywhere Google Street View exists
- 🎓 **Educational tool** - teach civic tech and AI applications

---

## 🔮 Future Roadmap & Potential

### **Near-Term Enhancements (Q1-Q2 2026)**
- [ ] **Mobile App** (iOS/Android) with offline mode
- [ ] **Batch Analysis** - Audit 100+ streets simultaneously
- [ ] **Historical Comparison** - Track changes from 2008 to present using old Street View imagery
- [ ] **Predictive Maintenance** - ML model predicting when infrastructure will degrade
- [ ] **API for third parties** - Allow civic apps to embed StreetLens

### **Medium-Term Vision (2026-2027)**
- [ ] **AR Mode** - Overlay detections on live camera feed via mobile app
- [ ] **Citizen Reporting Integration** - Combine AI + human ground truth
- [ ] **Multilingual Support** - Hindi, Tamil, Bengali interfaces
- [ ] **Crowdsourced Validation** - Gamified verification of AI detections
- [ ] **Integration with municipal GIS systems** (e.g., MapMyIndia, bhuvan.nrsc.gov.in)

### **Long-Term Moonshots (2027+)**
- [ ] **3D Street Reconstruction** - WebGL visualization of entire streets
- [ ] **Traffic Flow Analysis** - Overlay vehicle detection with speed/density
- [ ] **Flood Risk Mapping** - Drain detection → drainage system modeling
- [ ] **Global Infrastructure Index** - Benchmark all cities worldwide (0-100 scale)
- [ ] **Policy Impact Simulator** - "What if we add 100 streetlights here?"

---

## 📊 Key Statistics & Metrics

### **System Performance**
- ⏱️ **Analysis Speed**: 2-3 minutes per street segment
- 🎯 **Detection Accuracy**: 85-90% for major infrastructure (lights, signs, vehicles)
- 💾 **Data Generated**: ~500KB JSON + 2-5MB images per street
- 🌍 **Geographic Coverage**: Works globally wherever Google Street View exists

### **Technology Metrics**
- 🚀 **API Response Time**: < 2 seconds for health check
- 📈 **Scalability**: Handles 100+ concurrent users (Heroku hobby tier)
- 🔐 **Security**: JWT authentication + Redis rate limiting (60 req/minute)
- 📊 **Uptime**: 99.5% (Heroku managed infrastructure)

### **Cost Efficiency**
- 💰 **Per-Street Analysis**: ₹50-100 (Google Maps + Gemini API costs)
- 💵 **Traditional Survey**: ₹500-2000/km (manual fieldwork)
- 📉 **Cost Reduction**: 90% vs. conventional methods

---

## 🎓 Educational Value

StreetLens is an excellent demonstration of:

### **AI/ML Concepts**
- 🧠 **Vision Language Models (VLMs)** - Multi-modal AI understanding
- 🎯 **Object Detection** - Bounding boxes and classification
- 📊 **Clustering Algorithms** - DBSCAN for spatial deduplication
- 🔮 **Confidence Scoring** - Quantifying AI uncertainty

### **Software Engineering**
- ⚙️ **RESTful API Design** - FastAPI best practices
- 🔄 **Async Programming** - Motor (MongoDB), Celery workers
- 🎨 **Responsive Web Design** - Mobile-first UI/UX
- 📦 **Deployment** - Heroku, Docker, CI/CD concepts

### **Civic Tech Applications**
- 🏛️ **Open Data** - Urban infrastructure transparency
- 🗺️ **Geospatial Analysis** - OSMnx, NetworkX, Shapely
- 📈 **Data Visualization** - Charts, maps, scorecards
- 🌐 **Public APIs** - third-party integration potential

### **Urban Planning Principles**
- 🚶 **Walkability Assessment** - Footpath coverage analysis
- 💡 **Safety Metrics** - Lighting density and blackspots
- 🌳 **Livability Scoring** - Multi-factor quality indices
- 📊 **Evidence-Based Policy** - Data-driven urban development

---

## 🤝 Partnership & Collaboration Opportunities

### **For Municipal Corporations**
- **Pilot deployment** - Free audit of 25km of city roads
- **Training workshops** - Teach planners to use StreetLens
- **Custom dashboards** - City-specific reporting needs
- **Data sharing agreements** - Contribute to open urban datasets

### **For Civic Organizations**
- **Free tier access** - Up to 50 street audits/month for NGOs
- **Advocacy toolkit** - Pre-made templates for RTI/media
- **Co-branded reports** - Joint publications showcasing findings
- **Movement building** - Connect grassroots groups via data

### **For Researchers & Academics**
- **Research API access** - Bulk analysis for academic studies
- **Dataset collaboration** - Co-create open datasets for ML research
- **Student projects** - University capstone/thesis partnerships
- **Publications** - Co-author papers on StreetLens methodology

### **For Philanthropists & Funders**
- **Smart city grants** - Fund StreetLens deployment in tier-2/tier-3 cities
- **Open source development** - Support feature enhancements
- **Scalability funding** - Help us analyze 1 million streets by 2027
- **Impact measurement** - Quantify ROI of funded interventions

---

## 📞 Contact & Next Steps

### **Get Involved**

#### **For Exhibition Organizers**
- 🎪 **Live Demo Station** - Bring laptops; we'll analyze streets around the venue in real-time!
- 📺 **Video Explainer** - 3-minute walkthrough video available
- 🎨 **Poster Materials** - High-res infographics and one-pagers provided
- 🗣️ **Speaking Slot** - 15-minute presentation on "AI for Civic Tech"

#### **For Potential Users**
- 🌐 **Try it now**: Visit our live demo (provide URL)
- 📧 **Request beta access**: Email us your use case
- 💬 **Join community**: Discord/Slack for StreetLens users
- 📚 **Documentation**: Full API docs and tutorials

#### **For Collaborators**
- 🤝 **Partnership inquiry**: Let's discuss custom deployments
- 💻 **Open source contributions**: GitHub repo (if/when public)
- 🎓 **Academic collaborations**: Co-research opportunities
- 💰 **Funding proposals**: Joint grant applications

---

## 🏆 Awards & Recognition

- ✨ **India FOSS United Bangalore** - Showcased at major civic tech conference
- 🚀 **Featured in Civic Tech Community** - Live demo sessions with 100+ attendees
- 🎯 **AI for Social Good** - Recognized for practical AI application in urban planning

---

## 📖 Technical Specifications Summary

### **Supported Regions**
- All countries with Google Street View coverage (190+ countries)
- Optimized prompts for **Indian urban contexts**

### **Browser Support**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

### **API Rate Limits**
- **Unauthenticated**: 10 requests/minute
- **Authenticated users**: 60 requests/minute
- **Enterprise tier** (coming soon): Custom limits

### **Data Privacy**
- 🔒 No personal data collected
- 📷 Only processes public Google Street View imagery
- 🌐 Results stored securely in MongoDB Atlas
- 🗑️ User can request data deletion per GDPR

---

## 🎉 Conclusion: Why StreetLens Matters

In an era where **data drives decisions**, StreetLens democratizes access to urban infrastructure intelligence. What once required lakhs of rupees and months of fieldwork can now be done in **minutes for hundreds of rupees**—unlocking insights for cash-strapped municipalities, underfunded NGOs, and curious citizens alike.

StreetLens isn't just a tool—it's a **movement towards transparent, evidence-based urban development**. Every street audit is a step towards safer sidewalks, better-lit neighborhoods, and cities that work for everyone.

### **The Vision: 1 Million Streets by 2027**

We aim to audit **1 million street segments globally** by 2027, creating the world's largest open dataset of urban infrastructure quality. Imagine:

- 📊 **Global Infrastructure Index** - Know which cities lead in walkability, safety, cleanliness
- 🌍 **Cross-city learning** - Delhi learns from Tokyo's streetlight density
- 🎯 **$1 billion in waste prevention** - No more fixing the wrong streets
- 🚶 **10 million safer pedestrian trips** per day in StreetLens-audited areas

**Join us in building smarter, fairer cities—one street at a time.** 🚀

---

## 📋 Appendix: Glossary of Terms

- **VLM (Vision Language Model)**: AI that understands both images and text (e.g., Gemini 2.5 Flash)
- **OSM (OpenStreetMap)**: Crowdsourced global map database
- **OSMnx**: Python library for street network analysis using OSM data
- **DBSCAN**: Density-Based Spatial Clustering algorithm for grouping nearby detections
- **Bounding Box**: Rectangle coordinates (x_min, y_min, x_max, y_max) marking detected objects
- **Street Segment**: A portion of road between two intersections or user-defined points
- **Heading**: Compass direction (0-360°) of camera view
- **Blackspot**: Poorly lit or unsafe area prone to accidents/crime
- **Footpath Encroachment**: Illegal occupation of pedestrian walkways by vehicles/vendors

---

**Document Version**: 1.0 (February 2026)  
**Prepared For**: Exhibition displays, partner briefings, stakeholder presentations  
**Contact**: [Your contact details here]

---

*This document is intended for exhibition design and stakeholder communication. For technical implementation details, refer to the API documentation and codebase.*
