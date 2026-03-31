// ---------------- ADMIN SIGNUP ----------------
import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
function adminSignup() {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const username = document.getElementById("signupUsername").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const confirmPassword = document.getElementById("signupConfirmPassword").value.trim();

  if (!name || !email || !username || !password || !confirmPassword) {
    alert("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Password and Confirm Password do not match");
    return;
  }

  let admins = JSON.parse(localStorage.getItem("admins")) || [];

  const alreadyExists = admins.some(
    (admin) => admin.username === username || admin.email === email
  );

  if (alreadyExists) {
    alert("Admin with same username or email already exists");
    return;
  }

  const newAdmin = {
    name,
    email,
    username,
    password
  };

  admins.push(newAdmin);
  localStorage.setItem("admins", JSON.stringify(admins));

  alert("Admin account created successfully");
  window.location.href = "admin-login.html";
}

// ---------------- ADMIN LOGIN ----------------
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
function adminLogin() {
  const username = document.getElementById("adminUsername").value.trim();
  const password = document.getElementById("adminPassword").value.trim();

  let admins = JSON.parse(localStorage.getItem("admins")) || [];

  const matchedAdmin = admins.find(
    (admin) => admin.username === username && admin.password === password
  );

  if (matchedAdmin) {
    localStorage.setItem("isAdminLoggedIn", "true");
    localStorage.setItem("loggedInAdmin", JSON.stringify(matchedAdmin));
    window.location.href = "admin.html";
  } else {
    alert("Invalid admin username or password");
  }
}

function checkAdminLogin() {
  const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
  if (isLoggedIn !== "true") {
    alert("Please login first");
    window.location.href = "admin-login.html";
  }
}

function logoutAdmin() {
  localStorage.removeItem("isAdminLoggedIn");
  localStorage.removeItem("loggedInAdmin");
  window.location.href = "admin-login.html";
}

// ---------------- GRADE + RESULT FUNCTIONS ----------------
function getResultStatus(sub1, sub2, sub3, sub4, sub5) {
  if (sub1 < 33 || sub2 < 33 || sub3 < 33 || sub4 < 33 || sub5 < 33) {
    return "Fail";
  }
  return "Pass";
}

function getGrade(percentage, result) {
  if (result === "Fail") return "F";
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  if (percentage >= 33) return "E";
  return "F";
}

// ---------------- STUDENT FORM ----------------
const studentForm = document.getElementById("studentForm");

if (studentForm) {
  studentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const fatherName = document.getElementById("fatherName").value.trim();
    const motherName = document.getElementById("motherName").value.trim();
    const gmail = document.getElementById("gmail").value.trim();
    const rollNo = document.getElementById("rollNo").value.trim();

    const sub1 = Number(document.getElementById("sub1").value);
    const sub2 = Number(document.getElementById("sub2").value);
    const sub3 = Number(document.getElementById("sub3").value);
    const sub4 = Number(document.getElementById("sub4").value);
    const sub5 = Number(document.getElementById("sub5").value);

    const editIndex = document.getElementById("editIndex").value;

    const total = sub1 + sub2 + sub3 + sub4 + sub5;
    const percentage = (total / 500) * 100;
    const result = getResultStatus(sub1, sub2, sub3, sub4, sub5);
    const grade = getGrade(percentage, result);

    const student = {
      name,
      fatherName,
      motherName,
      gmail,
      rollNo,
      sub1,
      sub2,
      sub3,
      sub4,
      sub5,
      total,
      percentage: percentage.toFixed(2),
      result,
      grade
    };

    let students = JSON.parse(localStorage.getItem("students")) || [];

    if (editIndex === "") {
      const alreadyExists = students.some(
        (s) => s.rollNo === rollNo || s.gmail === gmail
      );

      if (alreadyExists) {
        alert("Student with same Roll No or Gmail already exists");
        return;
      }

      students.push(student);
    } else {
      students[editIndex] = student;
    }

    localStorage.setItem("students", JSON.stringify(students));
    alert("Student data saved successfully");

    studentForm.reset();
    document.getElementById("editIndex").value = "";
    displayStudents();
  });
}

// ---------------- DISPLAY STUDENTS ----------------
function displayStudents() {
  const tableBody = document.getElementById("studentTableBody");
  if (!tableBody) return;

  const students = JSON.parse(localStorage.getItem("students")) || [];
  tableBody.innerHTML = "";

  students.forEach((student, index) => {
    const row = `
      <tr>
        <td>${student.name}</td>
        <td>${student.fatherName || "-"}</td>
        <td>${student.motherName || "-"}</td>
        <td>${student.gmail}</td>
        <td>${student.rollNo}</td>
        <td>${student.sub1}</td>
        <td>${student.sub2}</td>
        <td>${student.sub3}</td>
        <td>${student.sub4}</td>
        <td>${student.sub5}</td>
        <td>${student.total}</td>
        <td>${student.percentage}%</td>
        <td>${student.grade}</td>
        <td>${student.result}</td>
        <td>
          <button class="action-btn edit-btn" onclick="editStudent(${index})">Edit</button>
          <button class="action-btn delete-btn" onclick="deleteStudent(${index})">Delete</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// ---------------- EDIT STUDENT ----------------
function editStudent(index) {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  const student = students[index];

  document.getElementById("name").value = student.name;
  document.getElementById("fatherName").value = student.fatherName || "";
  document.getElementById("motherName").value = student.motherName || "";
  document.getElementById("gmail").value = student.gmail;
  document.getElementById("rollNo").value = student.rollNo;
  document.getElementById("sub1").value = student.sub1;
  document.getElementById("sub2").value = student.sub2;
  document.getElementById("sub3").value = student.sub3;
  document.getElementById("sub4").value = student.sub4;
  document.getElementById("sub5").value = student.sub5;
  document.getElementById("editIndex").value = index;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------------- DELETE STUDENT ----------------
function deleteStudent(index) {
  let students = JSON.parse(localStorage.getItem("students")) || [];

  if (confirm("Are you sure you want to delete this student?")) {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
  }
}

// ---------------- STUDENT RESULT SEARCH ----------------
function searchResult() {
  const rollNo = document.getElementById("studentRollNo").value.trim();
  const gmail = document.getElementById("studentGmail").value.trim();

  const students = JSON.parse(localStorage.getItem("students")) || [];

  const student = students.find(
    (s) => s.rollNo === rollNo && s.gmail === gmail
  );

  if (student) {
    const newTab = window.open("", "_blank");

    newTab.document.write(`
      <html>
      <head>
        <title>Student Result</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f4f7fb;
            padding: 20px;
          }
          .result-container {
            max-width: 700px;
            margin: auto;
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          h1 {
            text-align: center;
            margin-bottom: 20px;
            color: #2563eb;
          }
          .info {
            margin-bottom: 10px;
            font-size: 16px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: center;
          }
          th {
            background: #2563eb;
            color: white;
          }
          .summary {
            margin-top: 15px;
            font-size: 16px;
          }
          .pass {
            color: green;
            font-weight: bold;
          }
          .fail {
            color: red;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="result-container">
          <h1>Student Result</h1>

          <div class="info"><b>Name:</b> ${student.name}</div>
          <div class="info"><b>Father Name:</b> ${student.fatherName || "-"}</div>
          <div class="info"><b>Mother Name:</b> ${student.motherName || "-"}</div>
          <div class="info"><b>Roll No:</b> ${student.rollNo}</div>
          <div class="info"><b>Gmail:</b> ${student.gmail}</div>

          <table>
            <tr>
              <th>Subject</th>
              <th>Marks</th>
            </tr>
            <tr><td>Subject 1</td><td>${student.sub1}</td></tr>
            <tr><td>Subject 2</td><td>${student.sub2}</td></tr>
            <tr><td>Subject 3</td><td>${student.sub3}</td></tr>
            <tr><td>Subject 4</td><td>${student.sub4}</td></tr>
            <tr><td>Subject 5</td><td>${student.sub5}</td></tr>
          </table>

          <div class="summary"><b>Total:</b> ${student.total} / 500</div>
          <div class="summary"><b>Percentage:</b> ${student.percentage}%</div>
          <div class="summary"><b>Grade:</b> ${student.grade}</div>
          <div class="summary">
            <b>Result:</b>
            <span class="${student.result === "Pass" ? "pass" : "fail"}">
              ${student.result}
            </span>
          </div>
        </div>
      </body>
      </html>
    `);
  } else {
    alert("Result not found");
  }
}
