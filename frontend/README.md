# Job Application Tracker

A clean, responsive full-stack web application designed to help job seekers track their job applications through various stages of the hiring process. This project is optimized for speed, code clarity, and seamless local portability by utilizing a relational SQLite database and a responsive React frontend equipped with automatic light/dark theme tracking.

---

## Tech Stack Used

| Layer | Technology | Key Selection Reasons |
| :--- | :--- | :--- |
| **Frontend** | **React (Vite)** + **TypeScript** | High-performance build setup, strong type safety, dynamic client UI states. |
| **Styling** | **Tailwind CSS v4** | Rapid, semantic, responsive layout management supporting immediate light/dark variants. |
| **Backend** | **Node.js** + **Express** + **TypeScript** | Structured routing architectures, clean validation layers, high readability. |
| **Database** | **SQLite** (`sqlite3` / `sqlite`) | Relational SQL-compliant database that operates entirely as a local file. **Eliminates the need for external Docker containers or local daemon installation during review.** |

---

## Features Implemented

* **Application List Page:** Clean dashboard showing Company, Title, Job Type, Status, and Date.
* **Add & Edit Forms:** Fully validated dual-purpose form modal overlay.
* **Delete Application:** Native browser window confirmation guard step before removal.
* **Filter by Status:** Instant dropdown filtering for Applied, Interviewing, Offer, or Rejected rows.
* **Search Integration (Bonus):** Live keyword query search matching company names and job titles.
* **Dark Mode Toggle (Bonus UX):** Full application theme switching with persistence via `localStorage`.
* **Cursor Follower Effect (Bonus Fun):** A lightweight custom interaction companion following the cursor path without intercepting pointer selections.

---

## Prerequisites

Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v16.x or later)
* npm (comes pre-bundled with Node)

---

## Setup & Installation Steps

### 1. Clone & Navigate to Project
Open your terminal and step into the root directory structure:
```bash
cd job-tracker