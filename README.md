# 🎓 Student Management System

A simple and user-friendly **Student Management System** built using **HTML, CSS, JavaScript, and Firebase**.

This project allows an admin to manage student data and students to check their results online.

---

## 🚀 Features

### 👨‍💼 Admin Portal
- Admin signup and login system
- Add student details:
  - Name
  - Father Name
  - Mother Name
  - Gmail
  - Roll Number
  - 5 Subject Marks
- Edit student data
- Delete student data
- Student data is stored using **Firebase**
- Automatic:
  - Total calculation
  - Percentage calculation
  - Grade generation
  - Pass/Fail result

---

### 👨‍🎓 Student Portal
- Student can check result using:
  - Roll Number
  - Gmail
- Result opens in **new tab**
- Clean **marksheet design**
- Shows:
  - Personal details
  - Subject marks
  - Total
  - Percentage
  - Grade
  - Pass/Fail

---

## 🛠️ Technologies Used

- HTML
- CSS
- JavaScript
- Firebase
- Firebase Firestore / Realtime Database
- Firebase Authentication

---

## 🔐 Admin Signup & Login

This system allows creation of new admin accounts.

### 📝 Admin Signup
- Go to **Admin Signup page**
- Enter:
  - Name
  - Email
  - Username
  - Password
- Click on **Create Account**
- Admin account will be saved using **Firebase Authentication / Firebase Database**

### 🔑 Admin Login
- Go to **Admin Login page**
- Enter your created:
  - Username
  - Password
- Click **Login**
- After successful login, admin will be redirected to the Admin Dashboard

---

## 🔥 Firebase Integration

This project uses **Firebase** for storing and managing data online.

Firebase is used for:

- Storing student details
- Updating student records
- Deleting student records
- Storing admin account details
- Fetching student results using Roll Number and Gmail

Because Firebase is used, the data is stored online and can be accessed from different devices.

---

## 📊 Result Calculation

The system automatically calculates:

- Total Marks
- Percentage
- Grade
- Pass/Fail Status

---

## 📌 How to Use

### Admin Side
1. Open the Admin Signup page.
2. Create a new admin account.
3. Login using admin username and password.
4. Add student details and marks.
5. Edit or delete student records when needed.

### Student Side
1. Open the Student Result page.
2. Enter Roll Number and Gmail.
3. Click on Check Result.
4. Result will open in a new tab.

---

## 📁 Project Structure

```text
Student-Management-System/
│
├── index.html
├── admin-signup.html
├── admin-login.html
├── admin-dashboard.html
├── student-result.html
├── result.html
│
├── style.css
├── script.js
├── firebase.js
│
└── README.md
