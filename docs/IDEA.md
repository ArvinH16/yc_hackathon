# Hackathon

## Competitive Intelligence Platform for Beam Bell

### **Concept Summary**
An AI-powered competitive intelligence add-on for Beam Bell that automatically gathers, analyzes, and visualizes competitor data within a 50-mile radius. The system uses web scraping and voice agents to collect pricing, services, and AI adoption data from competitors, while identifying sales opportunities for Beam Bell.

### **Technology Stack**
- **Web Scraping**: Automated data collection from competitor websites
- **Voice AI**: PyCat for calling competitors and gathering/verifying information
- **AI Detection**: Identifies whether competitors use AI receptionists or humans
- **Testing Platform**: Cobalt (or similar) for stress-testing competitor AI agents
- **LLM**: Gemini for analysis and recommendations
- **Visualization**: Google Maps-based dashboard with analytics

### **User Journey**

**As a Salon Owner (Beam Bell Customer):**

1. **Purchase Add-on**
   - Subscribe to "Competitive Intelligence" feature in Beam Bell dashboard
   - Input your business location and service categories

2. **Automatic Data Collection**
   - System identifies all hair salons within 50-mile radius using Google Maps API
   - Scraper visits competitor websites, extracts pricing and services
   - Voice agents call each competitor to verify pricing and gather additional data
   - System detects whether competitors use AI or human receptionists

3. **Dashboard Access**
   - **Map View**: Visual representation of all competitors with color-coded markers
     - Green: Lower pricing than yours
     - Red: Higher pricing
     - Blue: Using AI receptionist
     - Gray: Using human receptionist
   - **Analytics Dashboard**: 
     - Average pricing in your area for each service
     - Services competitors offer that you don't
     - Pricing recommendations to optimize revenue
     - Revenue projection simulations

4. **Actionable Insights**
   - "Competitors charge 15% more for hair extensions - you could increase prices by $20 and boost revenue by 12%"
   - "3 nearby salons offer keratin treatments, which you don't - projected additional $5K/month revenue"
   - AI generates custom product descriptions and suggested pricing based on your existing offerings

5. **Weekly Refresh**
   - Data automatically updates weekly to track pricing changes over time
   - Trend analysis shows market movements

**As Beam Bell (The Platform):**

1. **Sales Intelligence Layer**
   - When voice agent calls competitors, it identifies:
     - **Human answers**: Mark as potential Beam Bell customer → automated outreach
     - **AI answers**: Test the AI agent for vulnerabilities using Cobalt
   
2. **Automated Outreach**
   - To humans: "We noticed you're still using manual reception. Here's how Beam Bell can save you 20 hours/week..."
   - To AI competitors: "We tested your current AI receptionist and found these critical issues: [list]. Here's why Beam Bell outperforms..."

### **Vision: What & Why**

**What**: A dual-purpose platform that provides competitive intelligence to existing customers while simultaneously generating qualified leads for Beam Bell's core product.

**Why**:
- **For Salon Owners**: 
  - Make data-driven pricing decisions
  - Discover untapped revenue opportunities
  - Stay competitive without manual research
  - Practical AI application with immediate ROI

- **For Beam Bell**:
  - Create an additional revenue stream (subscription add-on)
  - Generate qualified sales leads automatically
  - Differentiate from competitors with unique value-add
  - Build comprehensive industry database for future products

**Market Innovation**: Combines traditional competitive analysis with AI-powered voice verification and real-time market intelligence, creating a self-sustaining sales engine disguised as a customer tool.

---

## 🆕 Detailed Dashboard Architecture (Recording 7ea33f1c Insights)

### **Two-Dashboard System Overview**
The platform requires TWO distinct dashboards serving different user personas with different needs:

#### **Dashboard 1: Customer-Facing (Mike/Salon Owner)**
This is the primary product value for the salon owner customer.

##### **1. Map View** 🗺️
Visual radar-style representation centered on the customer's salon location.

**Core Elements:**
- **Salon Positioning**: Customer's salon in center, competitors displayed around as map markers
- **Interactive Markers**: Click any competitor to view detailed findings page
- **Color Coding Strategy**: ⚠️ NOT based on pricing, but on **competitive positioning**
  - Colors represent: "How easy is it to edge them out?"
  - Visual indication of competitive advantage opportunities
  
**Competitor Detail Page (per salon clicked):**
- **Service Names**: List of services offered
- **Availability**: Current availability status
- **Competitive Edge Analysis**: 
  - "What is our edge?" (advantages over this competitor)
  - "What can we learn from them?" (opportunities to improve)
- **Actionable Insights**: LLM-generated recommendations based on collected data

##### **2. Analytics Dashboard** 📊
Comprehensive analysis of ALL businesses called in the area.

**Key Features:**
- **Pricing Intelligence Per Area Per Service**:
  - Geographic pricing breakdown
  - Service-by-service comparison
  - Intelligent service name normalization (e.g., "Balayage" = "Hand-painted highlights")
  
- **Product Recommendations**: ⭐ **MOST IMPORTANT FEATURE**
  - LLM-powered analysis of all collected data
  - Strategic recommendations: "What can we do to edge out other businesses?"
  - Data-driven insights for competitive positioning

##### **3. Monitoring Dashboard** 📈
Recurring trend analysis over time.

**Time-Series Analytics:**
- Pricing trends in the area per service
- Market movement tracking
- Competitive landscape evolution
- Historical data visualization

**Purpose**: Track how market dynamics change on a recurring basis to inform long-term strategy.

---

#### **Dashboard 2: Internal Beam Bell CRM** 🏢
Simple, focused dashboard for Beam Bell's internal sales and operations team.

**Core Purpose**: Track which businesses use AI vs. human receptionists to identify sales opportunities.

**Key Features:**
1. **Business Directory**:
   - List of all salons/businesses in database
   - Toggle/indicator: AI Agent vs. Human receptionist
   - Contact information (email)
   - Outreach status tracking

2. **AI Agent Analysis** (when AI detected):
   - **Transcription Access**: Pull conversation transcripts from Kova API
   - **Agent Issue Analysis**: Identify problems/weaknesses in competitor AI
   - **Sales Intelligence**: Use findings to inform outreach strategy

3. **CRM Functions**:
   - Email sent status tracking
   - Lead qualification scoring
   - Follow-up scheduling
   - Conversion tracking

**Technical Integration:**
- Create agent with Kova (voice AI platform)
- Send transcription requests via API
- Store and analyze conversation data
- Generate sales insights

**Simplicity Focus**: Keep this dashboard minimal - just enough functionality to:
- Identify AI vs. Human
- Track outreach efforts
- Analyze competitor AI weaknesses
- Observe overall market trends

---

### **Data Flow Architecture**

```
Voice Agent Calls Competitors
         ↓
    Data Collection
    - Services offered
    - Availability
    - AI vs. Human detection
    - Pricing information
         ↓
    ┌─────────────────┴─────────────────┐
    ↓                                   ↓
Customer Dashboard              Beam Bell CRM
(Mike's View)                   (Internal View)
    ↓                                   ↓
- Map View                      - Business List
- Analytics                     - AI Detection
- Monitoring                    - Transcriptions
- Recommendations               - Outreach Tracking
```

---

### **Design Principles from Discussion**

1. **Dual Purpose**: Every data collection serves both customer value AND Beam Bell sales
2. **Simplicity First**: Both dashboards should be clean and focused on core needs
3. **Intelligent Normalization**: Service names vary - use AI to group similar services
4. **Color-Coded Intelligence**: Visual indicators should represent actionable insights, not raw data
5. **LLM-Powered Recommendations**: The "brain" of the system - turns data into strategy
6. **CRM Integration**: Beam Bell dashboard is essentially a lightweight CRM for sales ops
7. **Transparency for Customers**: Mike sees all the competitive intelligence he needs
8. **Privacy for Operations**: Beam Bell's sales intelligence layer stays internal

---

### **Key Differentiators**

- **Not just data collection**: Every competitor analyzed = potential lead generated
- **Not just dashboards**: Actionable, LLM-powered strategic recommendations
- **Not just monitoring**: Color-coded competitive positioning for quick decisions
- **Not just transcription**: Deep analysis of competitor AI agent weaknesses
