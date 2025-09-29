# Smart Greywater & Wetland Management System - Dashboards

This project provides a set of dashboards tailored for different stakeholders: **Households, Communities, Admin Authorities, Researchers, and Wetland Conservation Teams.**  
Each dashboard is designed to provide real-time insights, anomaly detection, and actionable workflows powered by IoT monitoring and AI-driven predictions.

---

## 1. Household Dashboard
**Purpose:** Empower households to monitor their water systems in real-time and take immediate action on anomalies.  

### Key Features:
- **Real-time Anomaly Alerts**
  - Auto-detection for DO, Turbidity, TDS, ORP.
  - Alert sounds with per-sensor/global throttling to prevent notification floods.
  - Alerts close on click and log events automatically.
  
- **Notifications Integration**
  - Each closed alert generates a notification.
  - Options: “Report Issue” and “Mark as Read”.
  - Auto-mark as read after submitting reports.

- **Report Issue Workflow**
  - Prefilled form fields based on alert context:
    - Issue Type → Inferred from sensor.
    - Urgency → Inferred from severity.
    - Details → From anomaly message.
  - Location support:
    - Favorites by sensor, free-text, or “Use my location”.
  - Submissions include anomaly context + origin ID.

- **System Control Panel**
  - Interactive diagram of Pump, Filter, Chlorination, and Aeration units.
  - Toggle controls with live status indicators.
  - Real-time anomaly event log.

- **Insights & Status**
  - AI-generated insight cards with manual refresh.
  - Usage history charts.
  - Tank level monitoring.

---

## 2. Community Dashboard
**Purpose:** Enable neighborhoods and communities to coordinate pollution tracking and collective water management.  

### Key Features:
- **Community Reporting**
  - Create/manage pollution reports with images, videos, and metadata.
- **Oversight**
  - Track status of all reports (submitted, in-progress, resolved).
- **Wetland Monitoring**
  - View aggregate wetland health trends and environmental data.
  - AI surfacing of long-term risks (e.g., algal bloom likelihood, DO depletion).

---

## 3. Admin Dashboard
**Purpose:** Provide authorities and operators with control over maintenance, pipelines, and large-scale coordination.  

### Key Features:
- **Maintenance Operations**
  - Manage maintenance requests (create, assign, schedule, complete).
- **Coordination**
  - Oversee household and community-level pipelines.
  - Track actions taken, pending issues, and escalations.

---

## 4. Researcher Dashboard
**Purpose:** Enable scientists and researchers to study long-term patterns and build predictive models.  

### Key Features:
- **Analysis Workspace**
  - Interactive tools for anomaly pattern exploration.
  - Access to predictions, historical water quality trends, and correlations.
  - Export datasets for external modeling and research.

---

## 5. Wetland Health Dashboard (Extension of Community/Admin)
**Purpose:** Provide a holistic view of wetland ecosystems and conservation impact.  

### Key Features:
- **Environmental Trends**
  - Real-time and long-term water quality metrics.
  - Biodiversity and ecosystem health indicators.
- **Risk Forecasting**
  - AI-driven early warnings (algal bloom risk, oxygen depletion).
- **Citizen Engagement**
  - Crowdsourced pollution reporting integrated with ecosystem data.

---

## Tech Stack
- **Frontend:** React.js (with Tailwind, shadcn/ui for UI components).  
- **Backend:** Node.js / Python Flask.  
- **Database:** Firebase / MongoDB / PostgreSQL.  
- **IoT Integration:** ESP32, Raspberry Pi, LoRaWAN.  
- **AI Models:** Isolation Forest, LSTM for anomaly prediction.  
- **Cloud Hosting:** AWS / GCP / Azure.  
- **Visualization:** Grafana / Custom React charts.  

---

## Roadmap
- ✅ Phase 1: Household anomaly detection + Dashboard.  
- ✅ Phase 2: Community reporting + Wetland monitoring.  
- 🚧 Phase 3: Full Admin & Researcher dashboards with AI prediction integration.  
- 🚀 Future: Large-scale deployment across Kerala with multi-tier dashboards.  

---

## License
This project is developed as part of **Smart India Hackathon (SIH)** and is intended for scalable adoption by communities, local governments, and research organizations.
