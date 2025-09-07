# 🚚 FleetLink - Logistics Vehicle Booking System

FleetLink is a **full-stack logistics vehicle booking system** built with the **MERN stack (MongoDB, Express.js, React, Node.js)**.  
It allows B2B clients to **add vehicles, search availability, and book vehicles** based on capacity, route, and time.  

---

## 📘 Scenario
Your company is building FleetLink, a platform to manage and book logistics vehicles for B2B clients.  
The backend manages vehicle fleet availability, bookings, and validations.  
The frontend provides an interface for adding vehicles, searching, and booking.  

![FleetLink Screenshot](https://github.com/saiyamdubey/Knovator_Fleetlink/blob/main/frontend/public/image2.png?raw=true)

---

## 🎯 Features
- Add new vehicles to the fleet  
- Search for available vehicles based on:
  - Capacity required
  - Route (from & to pincodes)
  - Start time  
- Book vehicles if available (conflict prevention logic included)  
- Estimated ride duration calculation based on pincodes  
- Basic UI with interactive elements (React + Tailwind)  

---
![FleetLink Screenshot](https://github.com/saiyamdubey/Knovator_Fleetlink/blob/main/frontend/public/image.png?raw=true)


## 📦 Tech Stack
- **Frontend**: React.js, Tailwind CSS, React Router  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Testing**: Jest (backend unit testing)  
- **Containerization**: Docker, Docker Compose  

---

## 🔧 API Endpoints

![FleetLink Screenshot](https://github.com/saiyamdubey/Knovator_Fleetlink/blob/main/frontend/public/image3.png?raw=true)


### 🚗 Vehicle APIs
- `POST /api/vehicles` → Add a new vehicle  
  - Request: `{ "name": "...", "capacityKg": ..., "tyres": ... }`  
- `GET /api/vehicles/available` → Search available vehicles  
  - Params: `capacityRequired`, `fromPincode`, `toPincode`, `startTime`

### 📑 Booking APIs
- `POST /api/bookings` → Book a vehicle  
- (Bonus) `DELETE /api/bookings/:id` → Cancel booking  

---

## 🧮 Core Logic
- **Ride Duration Calculation**:  
  ```js
  estimatedRideDurationHours = Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24
