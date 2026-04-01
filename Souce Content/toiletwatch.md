# 🚽 Toilet Watch: Comprehensive Product & Technical Overview

## 1. Vision & Background

### Why was this made?
The "Toilet Watch" initiative was conceived in partnership with **Jack Sim** (founder of the World Toilet Organization). Recent reports (like the 2024 SMU Toilet Cleanliness Index) showed that Singapore's public toilets, especially in coffeeshops and hawker centres, remain a critical sanitation challenge. With official data often siloed or proprietary, there was a pressing need for an independent, open-source, citizen-driven platform to monitor public hygiene, hold agencies accountable, and ultimately improve societal well-being.

### Who is the audience?
- **Citizens (The Reporters):** Everyday people in Singapore who encounter dirty toilets and need a frictionless, zero-install way to report them via WhatsApp.
- **Regulatory Agencies (NEA, SFA, Town Councils):** The bodies responsible for enforcement and maintenance, who need actionable, verified data without logging into yet another complex, slow government system.
- **The Public & Policymakers:** Anyone who can view the live public map to identify trends or use the 6-month aggregate reports to pressure underperforming sectors (all the way up to the Prime Minister’s Office).

### What is the impact?
By decentralizing the reporting process and weaponizing transparency (via a live public map and strict SLA escalations), this product forces accountability. It shifts the burden from manual inspection to crowd-sourced intelligence, drastically reducing response times for biohazards and failing infrastructure in public restrooms.

---

## 2. Core Value Proposition & Pipeline

### How does this help?
It completely removes the friction of civic reporting. Instead of downloading a government app or filling out a clunky web form, citizens just send a picture to a WhatsApp number. The AI does the heavy lifting of categorizing the issue, scoring the severity, and formatting the report. Automatically routed emails with "One-Click Actions" allow agencies to resolve issues directly from their inbox without signing in.

### The End-to-End Pipeline
1. **Citizen Initiation:** A user sends "Hi" or a photo to the Toilet Watch WhatsApp bot.
2. **Context Gathering:** The bot guides the user to send a photo, a WhatsApp Location pin, and a subjective user rating (1 to 4).
3. **AI Assessment & Enrichment:** 
   - **Google Gemini 2.0 Flash** analyzes the photo, outputting a 1-10 hygiene score, a severity level (Excellent to Critical), detected issues (e.g., `wet_floor`, `no_soap`), and priority.
   - **Google Places API** takes the GPS coordinates and finds the exact commercial venue (e.g., a specific coffeeshop) and classifies the responsible agency (NEA vs SFA).
4. **Data Persistence:** The complete report is saved securely to a Supabase PostgreSQL database.
5. **Immediate Notification:** A rich HTML email is dispatched to the relevant agency. This email contains the photo, AI summary, exact venue details, and **One-Click Action Buttons** (Resolve, Snooze 3 Days, Snooze 7 Days).
6. **Resolution & Feedback Loop:** 
   - If the agency clicks "Resolve", the database is updated, and a Supabase Webhook instantly triggers a WhatsApp message back to the citizen thanking them.
   - If ignored, after 7 days, an automated SLA escalation engine sends a high-priority warning to the agency.

---

## 3. Existing Feature Set

### 📱 WhatsApp Chatbot (WAHA)
- Built on WAHA (WhatsApp Web HTTP API) specifically using the `NOWEB` engine.
- Maintains user session state sequentially (Photo → Location → Rating).
- Deduplicates messages actively in-memory to prevent WAHA's known double-webhook bugs.
- Returns an immediate, visually appealing AI-generated summary back to the user upon completion.

### 🧠 AI Vision Engine
- Powered by Google's `gemini-2.0-flash`.
- Strictly constrained via a systemic prompt to return a standardized JSON schema.
- Detects specific hygienic infractions like overflowing bins, mildew, broken fixtures, evidence of cockroaches, etc.
- Gracefully falls back to a default "Fair" assessment if API limits or errors hit to ensure no data is lost.

### 📍 Venue Enrichment (Google Places)
- Automatically reverse-geocodes WhatsApp GPS pins within a tight 100m radius.
- Extracts venue name, address, place type, international phone number, and website.
- Automatically categorizes the venue's regulatory body (e.g. food courts map to the `NEA`; cafes map to `SFA`).

### 📧 One-Click Agency Action Emails
- Agencies receive fully formatted, color-coded HTML emails.
- Includes HMAC-SHA256 cryptographically signed action links mapped to specific report IDs.
- Agencies can hit "Mark as Resolved" or "Snooze" directly from their email client. The backend validates the signature, preventing tampering and bypassing the need for a login portal.

### 🗺️ Live Public Dashboard
- An interactive map built with Leaflet.js, deployed directly to Vercel.
- Fetches live unstructured data directly from Supabase, skipping outdated views.
- **Features:** Hardware-accelerated light/dark mode CSS toggle, interactive venue entity cards, full-screen photo lightboxes, cluster mapping, real-time live connection status polling, and robust mobile-responsive scaling.

### ⏱️ Automated SLA Escalation
- A bespoke `APScheduler` job running natively within the FastAPI backend (removing the need for external tools like n8n).
- Sweeps the database every 6 hours.
- Identifies "Open" reports older than 7 days (that aren't currently "Snoozed") and fires high-alert escalation emails, bumping the internal SLA level.

---

## 4. Technical Architecture

**Strict Free-Tier Optimization:** The stack was explicitly chosen and engineered to run robustly at practically zero cost for the pilot and prototyping phase.

- **Ingestion:** `devlikeapro/waha:noweb` running locally via Docker Desktop, exposed to the cloud securely via **Ngrok**.
- **Backend Infrastructure:** **FastAPI** (Python 3.11) hosted stably on **Render** (Free Tier). Kept continuously awake via an UptimeRobot ping hitting a dedicated `/ping` route.
- **Database & Object Storage:** **Supabase**. Uses strictly typed PostgreSQL with PostGIS extensions for geospatial indexing (`location geography(Point, 4326)`). Employs Database Webhooks (`on_report_resolved`) to asynchronously trigger citizen callbacks. Storage bucket handles the raw blob image uploads.
- **AI & Remote Compute:** **Google AI Studio** (Gemini) and **Google Maps Platform** (Places API New).
- **Communications:** **Resend** API for transactional HTML email delivery.
- **Frontend / Dashboard:** Vanilla HTML/JS/CSS hosted globally on **Vercel** edge networks.

---

## 5. Future Roadmap

1. **Intelligent Agency Auto-Assignment:** Automatically mapping the `agency_id` foreign key based on the `"NEA"` or `"SFA"` code returned by the new Google Places lookup, allowing the SLA engine to route specifically.
2. **Verified SMTP / Domain Routing:** Verifying a custom domain with Resend to break out of the free-tier sandbox, allowing the system to email actual `gov.sg` addresses dynamically based on jurisdiction.
3. **Dedicated Agency Web Portal:** A secondary frontend for power-users at government agencies to securely log in, view tabular queues of their assigned reports, and perform batch resolutions.
4. **L2 Escalation (14 days):** Second-tier automatic escalation routing to senior government officials or the PMO if a town council ignores the initial 7-day SLA warning.
5. **Citizen CSAT Feedback:** After the resolution WhatsApp is sent, prompting the citizen to optionally rate the actual quality of the agency's cleanup (1-5 stars) to track long-term agency effectiveness.
6. **Session GPS Timeouts:** Implementing Jack Sim's suggested 2.5-minute lock/timeout to ensure users capture photos and tag locations simultaneously, preventing them from walking away and assigning the wrong GPS coordinates arbitrarily.
