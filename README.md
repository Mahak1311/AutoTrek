# 🧭 AutoTrek  
### An Autonomous Travel Planning Agent

AutoTrek is an **autonomous, agent-based travel planner** that creates a complete trip itinerary within user-defined constraints such as **budget, number of days, preferences, and destination**.

Unlike traditional travel planners, AutoTrek does not require step-by-step user control.  
The agent **plans, validates, and re-plans automatically** to achieve the user’s goal.

## 🔗 Live Demo

🎥 **Demo Video:**  
https://drive.google.com/file/d/1t-8KUkc7Jzxqr7DfqwO03yMxFOUcJEFV/view?usp=drivesdk

🌐 **Live App:**  
https://auto-trek.netlify.app/

---

## ✨ Features

### 🤖 Autonomous Itinerary Planning
- Generates a full day-wise travel itinerary from a single input
- Automatically checks budget and time constraints
- Re-plans the itinerary without user intervention if constraints are violated

### 💸 Budget-Aware Decision Making
- Calculates total trip cost in real time
- Visual budget indicator (safe / tight / exceeded)
- Automatically removes or replaces activities when over budget

### ⭐ Priority-Based Logic
- Activities can be marked as:
  - Must-have
  - Nice-to-have
  - Optional
- During re-planning, the agent autonomously removes lower-priority activities first

### 🧠 Agent Reasoning & Transparency
- Displays a step-by-step **Agent Decision Log**
- Explains why activities were removed, replaced, or shifted
- Makes autonomous behavior observable and understandable

### 🗺️ Optional Map View
- Toggle between **Itinerary View** and **Map View**
- Map is shown only when required
- Displays activity locations using a realistic map-style layout
- Automatically centers and zooms to relevant locations for each day

### 🌍 Currency Conversion (Prototype)
- Converts user budget into destination currency
- Displays costs in both home and local currency
- Uses approximate static exchange rates suitable for prototyping

### 📤 Export & Sharing
- Export final itinerary as text or PDF
- Easy sharing for collaboration or reference

---

## 🧠 What Makes AutoTrek Autonomous?

AutoTrek operates using a **closed-loop decision cycle**:

1. **Plan** – Generate an initial itinerary  
2. **Validate** – Check budget and time constraints  
3. **Re-plan** – Automatically adjust activities if constraints fail  
4. **Explain** – Provide transparent reasoning for decisions  

The user provides the goal once.  
All decision-making happens autonomously.

---

## 🛠️ Tech Stack

- **Frontend:** Web-based UI
- **Agent Logic:** Rule-based planning and validation
- **Maps:** Prototype-friendly map visualization (no live API dependency)
- **Development Tooling:** GitHub Copilot (AI-assisted development)

> No machine learning model training or datasets are used.  
> The focus is on **agentic decision-making**, not prediction.

---

## 🚀 How It Works

1. User enters:
   - Budget
   - Number of days
   - Destination city
   - Activity preferences
2. The agent generates a complete itinerary
3. Budget and constraints are validated automatically
4. If needed, the agent re-plans and explains its decisions
5. The user can view the itinerary or switch to Map View
6. The final plan can be exported or shared

---

## 🎯 Use Cases

- Budget-conscious travel planning
- Autonomous agent demonstrations
- Hackathons and academic projects
- Smart itinerary prototyping

---

## 🧪 Project Scope

This project is a **functional prototype** built for an **Agentic Hackathon**.

The focus is on:
- Autonomous decision-making
- Constraint handling
- Transparency
- Clean user experience

All costs, distances, and exchange rates are intentionally approximate.

---

## 📌 Tagline

**AutoTrek — Plan once. The agent handles the rest.**
