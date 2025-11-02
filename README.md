# CS5610-Project2-Tong-Rongjia
# Huskyhub

## Author
Cai Tong

Email: cai.to@northeastern.edu

Rongjia Sun

Email: sun.rongj@northeastern.edu

## public server
### TODO

## Class Link
[CS5610WebDev Online]

https://northeastern.instructure.com/courses/226004

[project3]

https://northeastern.instructure.com/courses/226004/assignments/2902288?module_item_id=12618850

## Project Objective

Build a web application designed for Northeastern University students to create and join spontaneous campus-related events—such as "Run to Costco," "Study in Snell at 7 PM," "Looking for 3 players for badminton," or "Chess night tonight." This platform helps students make new friends, reduce campus isolation, find study partners, and engage in spontaneous social life outside of class.

## Features

### NEU-Specific Features

  Default Event Categories:

  - 📚 Study Sessions - Library meetups, study groups, exam prep
  - 🏃 Sports & Fitness - Pickup games, gym buddies, runs
  - 🛒 Grocery Runs - Costco trips, Target runs, car sharing
  - 🍕 Food & Dining - Restaurant trips, cooking together, food tours
  - 🎮 Gaming & Entertainment - Board games, video games, movie nights
  - 🎨 Hobbies & Interests - Photography walks, art projects, music
  - 🗣️ Language Exchange - Practice conversations, cultural exchange
  - 🚀 Other - Anything else!

### Event Management (Full CRUD)

### Comment System (Full CRUD)

### Join/Leave Functionality

  Join event (if not full)
  
  Leave event (free up spot)
  
  Real-time participant count updates via polling
  
  Visual indicators (badges) for full events
  
  Waitlist feature (future enhancement)

### Live Updates

  Auto-refresh every 10-15 seconds using polling
  
  Update participant counts
  
  Load new comments
  
  Highlight new content since last refresh
  
  Visual loading indicators

### Data Population

  Script to generate 1000+ realistic campus events
  
  Examples:
    
    "Pickup basketball at Marino - 5PM today"
    
    "Study for CSYE 6200 midterm - Snell 3rd floor"
    
    "Costco run this Saturday - need 3 people"
  
    
  
  
  Distributed across all categories
  
  Various dates (past, current, future)
  


## Screenshot
### Sign Up


### login


## Technology Requirements

### Core Technologies
Frontend: React.js with Hooks, CSS3

Backend: Node.js + Express (ES Modules only)

Database: MongoDB (No Mongoose - native MongoDB driver)

Deployment: AWS EC2 / Heroku / Render

Authentication: Session-based with NEU email validation

No prohibited libraries: No Axios, Mongoose, or CORS middleware

### Development Tools
### TODO

### Browser Support

- Modern browsers supporting ES6+ features
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile-responsive design for all screen sizes


## Instructions to Build and Run

### Prerequisites
- Node.js (v18+ recommended)
- npm (comes with Node.js)
- MongoDB (local or cloud instance)
- Optional: Git for cloning the repository

### Setup
### TODO



### AI Usage
### 1. **ChatGPT**
**Model:** GPT-5
**Responsibility:**  
- Designed backend architecture using Node + Express + MongoDB  
- Helped implement authentication, CRUD endpoints, and data schema design  
- Wrote frontend JavaScript modules for form handling and API requests  
- Drafted and improved documentation (README, design doc, mockups)  
- Assisted in debugging deployment and HTTPS mixed content issues  

### 2. **Claude (Anthropic Claude 3.5 Sonnet)**
**Model:** Sonnet 4.5
**Responsibility:**  
- Refined UI/UX logic for the login and workout pages  
- Suggested improvements to HTML structure and Bootstrap integration  
- Reviewed code organization for maintainability and readability  

### 3. **Grok**
**Model:** Grok4 Fast
**Responsibility:**  
- Contributed to the AI planning logic for generating 4-week personalized fitness plans  
- Assisted with integrating OpenAI API responses into the frontend workflow  


