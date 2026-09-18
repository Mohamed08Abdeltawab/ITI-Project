# CarePoint — Doctor Appointment & Clinic Management Platform

[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Material UI](https://img.shields.io/badge/MUI-v9-007FFF?style=flat-square&logo=mui&logoColor=white)](https://mui.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-v5-4338CA?style=flat-square)](https://github.com/pmndrs/zustand)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=flat-square&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

**CarePoint** is a modern, responsive healthcare web application designed to connect patients with verified medical specialists, simplify doctor appointment scheduling, and deliver a full-featured clinical management experience.

Developed by **[Mohamed Abdeltawab](https://github.com/Mohamed08Abdeltawab)** as an **ITI (Information Technology Institute)** project.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Live Demo & Mock Backend](#-live-demo--mock-backend)
- [Tech Stack](#-tech-stack)
- [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
- [Data Models & API Endpoints](#-data-models--api-endpoints)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
- [Available Scripts](#-available-scripts)
- [Design System & Theming](#-design-system--theming)
- [Author & Acknowledgments](#-author--acknowledgments)

---

## 🌟 Overview

CarePoint streamlines the healthcare journey for patients:
- **Discover Doctors:** Explore certified doctors across cardiology, dermatology, pediatrics, neurology, and more.
- **Instant Booking:** Schedule in-person clinic visits or online video consultations with real-time slot selection.
- **Appointment Management:** Review, reschedule, or cancel bookings with live updates.
- **Patient Profile:** Manage medical and emergency contacts, insurance information, and favorited doctors.
- **Modern Experience:** Polished interface with dark/light mode, fluid typography, and micro-interactions.

---

## ✨ Key Features

### 1. 🔍 Doctor Directory & Smart Discovery
- **Search & Query:** Search doctors by name, medical specialty, or biography.
- **Specialty Filtering:** Quick-filter by specialties such as *Cardiology, Dermatology, Pediatrics, Orthopedics, Neurology*, and more.
- **Sorting Options:** Sort results by *Top Rated*, *Experience (Years)*, or *Name*.
- **Pagination:** Clean, client-side pagination displaying 6 specialists per page.
- **Favorites & Bookmarks:** Favorite doctors with persistent status synced across sessions and visible on the Profile page.

### 2. 👨‍⚕️ Detailed Doctor Profiles
- Comprehensive doctor cards with avatar, medical credentials, rating, reviews count, and years of experience.
- Working schedules, available days, and consultation time slots.
- Direct-action CTA linking directly to pre-filled appointment booking.

### 3. 📅 Interactive Appointment Booking
- Powered by **React Hook Form** for responsive, validated inputs.
- Auto-selection of doctor via URL parameters (`/book/:doctorId`) or dynamic dropdown selection.
- Date picker ensuring bookings cannot be made in the past.
- Real-time time slot selector (e.g., `09:00 AM`, `11:30 AM`, `02:00 PM`, `04:30 PM`).
- Consultation type toggle: **In-Person Clinic Visit** vs. **Online Video Consultation**.
- Live booking summary card showing selected doctor, date, time slot, and patient contact details.

### 4. 📋 Full CRUD Appointment Management
- **Read (All & Filtered):** Tabbed views to filter appointments by **Upcoming / Pending**, **Completed**, **Cancelled**, or **All**.
- **Real-Time Badge Counter:** Navbar displays a live count of active upcoming/pending appointments using Zustand state.
- **Update / Reschedule:** Modal dialog allowing instant date and time slot changes with direct API synchronization (`PATCH`).
- **Cancellation & Cleanup:**
  - Cancel any upcoming appointment with status change.
  - **Clear All Cancelled Appointments** button performing bulk asynchronous deletion across the mock server.
- Skeleton loaders and informative empty states when no appointments exist.

### 5. 👤 Patient Profile & Health Dashboard
- Editable profile information: Full Name, Email, Phone, Blood Group, Emergency Contact, and Insurance Policy Number.
- Favorite Specialists Hub: Instant access to bookmarked doctors.
- Direct dark/light mode switch inside user preferences.

### 6. 🌓 Dual Theming Engine (Light & Dark Mode)
- Built with **Zustand + `persist` middleware** storing mode in `localStorage` (`carepoint-theme-storage`).
- Zero Flash-Of-Unstyled-Content (FOUC) inline script in `index.html`.
- Unified theme system coordinating **Material UI Palette** (`teal-500` / `teal-600` accents) and **Tailwind CSS** utility classes.

---

## 🌐 Live Demo & Mock Backend

- **Remote Mock API:** [My JSON Server (clinic-api)](https://my-json-server.typicode.com/Mohamed08Abdeltawab/clinic-api)
- **Local JSON Server:** Bundled with `db.json` on port `5000` via `npm run server`.

---

## 🛠 Tech Stack

| Category | Technologies / Libraries |
| :--- | :--- |
| **Core Framework** | [React 19](https://react.dev/) with [Vite 8](https://vitejs.dev/) |
| **Component Library** | [Material UI v9 (@mui/material)](https://mui.com/) & [@mui/icons-material](https://mui.com/material-ui/material-icons/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & [Emotion](https://emotion.sh/) |
| **Routing** | [React Router v7 / v8](https://reactrouter.com/) (`createBrowserRouter`, `RouterProvider`) |
| **State Management** | [Zustand v5](https://github.com/pmndrs/zustand) with `persist` middleware |
| **Form Handling** | [React Hook Form](https://react-hook-form.com/) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Mock Database** | [json-server](https://github.com/typicode/json-server) |
| **Code Quality** | ESLint 10 + Babel React Compiler |

---

## 📂 Project Architecture & Directory Structure

```text
ITI Project_Mohamed Abdeltawab/
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Reusable presentation components
│   │   ├── DoctorCard.jsx  # Doctor listing card with favorite & booking actions
│   │   └── Navbar.jsx      # Header navigation, mobile drawer & theme toggle
│   ├── layouts/
│   │   └── RootLayout.jsx  # Main application layout with header, outlet & footer
│   ├── pages/
│   │   ├── AppointmentsPage.jsx    # Appointment list, status filters, reschedule & cancel modals
│   │   ├── BookAppointmentPage.jsx# Multi-field booking form with live summary preview
│   │   ├── DoctorDetailsPage.jsx  # Doctor profile, clinic hours & slots
│   │   ├── DoctorsPage.jsx        # Searchable, filterable doctor catalog with pagination
│   │   ├── NotFoundPage.jsx       # 404 error page with safe redirection
│   │   └── ProfilePage.jsx        # Patient bio, medical profile & saved doctors
│   ├── routes/
│   │   └── router.jsx      # React Router configuration & route declarations
│   ├── services/
│   │   └── api.js          # Centralized Axios client & CRUD service endpoints
│   ├── stores/
│   │   ├── useAppointmentsStore.js# Zustand store for appointments CRUD & counts
│   │   ├── useAppStore.js         # Unified export store
│   │   └── useThemeStore.js       # Zustand store for light/dark theme persistence
│   ├── App.jsx             # Root component injecting MUI ThemeProvider & Router
│   ├── index.css           # Tailwind CSS imports & custom CSS variables
│   └── main.jsx            # Application entry point
├── db.json                 # Mock database containing doctors and appointments
├── index.html              # HTML shell with theme initialization & Google Fonts
├── package.json            # Project dependencies and npm scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite build configuration with React plugin
```

---

## 🗄 Data Models & API Endpoints

### Data Schema

#### Doctor Object
```json
{
  "id": "1",
  "name": "Dr. Sarah Jenkins",
  "specialty": "Cardiology",
  "avatar": "https://images.unsplash.com/...",
  "rating": 4.9,
  "reviewsCount": 124,
  "experience": "12 yrs exp",
  "bio": "Specialized in invasive and non-invasive cardiovascular diseases...",
  "workingSchedule": "Mon - Thu (09:00 - 18:00)",
  "workingDays": ["Mon", "Tue", "Wed", "Thu"],
  "slots": ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"]
}
```

#### Appointment Object
```json
{
  "id": "1726500000000",
  "doctorId": "1",
  "doctorName": "Dr. Sarah Jenkins",
  "patientName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1 (555) 019-2834",
  "date": "2026-09-25",
  "timeSlot": "11:30 AM",
  "type": "In-Person",
  "notes": "Annual heart checkup and ECG consultation.",
  "status": "Upcoming",
  "createdAt": "2026-09-18T12:00:00.000Z"
}
```

### REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/doctors` | Retrieve list of all doctors |
| `GET` | `/doctors/:id` | Retrieve single doctor details |
| `GET` | `/appointments` | Retrieve all appointments |
| `GET` | `/appointments/:id` | Retrieve single appointment |
| `POST` | `/appointments` | Create and schedule a new appointment |
| `PATCH` | `/appointments/:id` | Update appointment details (e.g., reschedule date/time, cancel) |
| `DELETE` | `/appointments/:id` | Remove an appointment |

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (version **18.x** or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mohamed08Abdeltawab/ITI-Project.git
   cd "ITI Project_Mohamed Abdeltawab"
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

### Running the Project

For full functionality (including local CRUD operations), run both the mock API server and the Vite dev server:

1. **Start the Mock API Server (in one terminal):**
   ```bash
   npm run server
   ```
   *Runs `json-server` on `http://localhost:5000` using `db.json`.*

2. **Start the Vite Frontend Development Server (in another terminal):**
   ```bash
   npm run dev
   ```
   *Vite will start the client, typically at `http://localhost:5173`.*

3. **Open the application:**
   Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

> [!NOTE]
> The app is pre-configured with a remote mock server fallback (`https://my-json-server.typicode.com/Mohamed08Abdeltawab/clinic-api`) in `src/services/api.js`. You can switch between the local JSON server (`http://localhost:5000`) and the remote API as needed.

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs the Vite development server with Hot Module Replacement (HMR). |
| `npm run server` | Starts local `json-server` at `http://localhost:5000` watching `db.json`. |
| `npm run build` | Compiles and builds the production bundle into the `dist/` directory. |
| `npm run preview` | Locally previews the production build output. |
| `npm run lint` | Runs ESLint to check for code quality and syntax issues. |

---

## 🎨 Design System & Theming

- **Typography:** Uses Google Font **Plus Jakarta Sans** for modern legibility.
- **Color Palette:**
  - Primary: `#0d9488` (Teal 600) in Light Mode / `#14b8a6` (Teal 500) in Dark Mode
  - Background: `#f8fafc` (Slate 50) in Light Mode / `#0b1120` (Dark Navy) in Dark Mode
  - Cards & Paper: `#ffffff` in Light Mode / `#1e293b` (Slate 800) in Dark Mode
- **Customized MUI Overrides:** Pre-configured borderRadius (16px - 20px), flat button shadows, outlined inputs, and smooth transitions.

---

## 👨‍💻 Author & Acknowledgments

- **Author:** Mohamed Abdeltawab
- **GitHub:** [@Mohamed08Abdeltawab](https://github.com/Mohamed08Abdeltawab)
- **Institution:** Information Technology Institute (ITI)
- **Project:** React.js Graduation / Track Project

---

*Made with ❤️ for better patient care and clinical workflows.*
