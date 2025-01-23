# Generic Datagrid Setup

This guide explains how to set up and run the Generic Datagrid application, including both the backend and frontend components.

---

## Backend Setup

### 1. Clone the Repository
   ```bash
   git clone
 ```
### 2. Navigate to the Backend Directory
 ```bash
cd generic-datagrid-backend
 ```
### 3. Build and Start the Backend using Docker
 ```bash
docker-compose up --build
 ```
### 4. Populate the Database
 ```bash
curl -X POST http://localhost:5000/api/upload
 ```
---
## Frontend Setup

### 1. Navigate to the Frontend Directory
   ```bash
   git clone
 ```
### 2. Install Dependencies
   ```bash
   npm install 
 ```
### or
   ```bash
   npm install --force
 ```
### 3. Start the Application
   ```bash
  npm start
 ```
### 4. Access the Frontend
   ```bash
Open your browser and go to:

http://localhost:3000
 ```
