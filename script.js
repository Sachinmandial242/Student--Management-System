import { db, auth } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// ---------------- SUBJECT NAMES ----------------
const subject1Name = "Maths";
const subject2Name = "English";
const subject3Name = "Computer";
const subject4Name = "Science";
const subject5Name = "Hindi";

// ---------------- ADMIN SIGNUP ----------------
window.adminSignup = async function () {
  const nameEl = document.getElementById("signupName");
  const emailEl = document.getElementById("signupEmail");
  const passwordEl = document.getElementById("signupPassword");
  const confirmPasswordEl = document.getElementById("signupConfirmPassword");

  if (!emailEl || !passwordEl || !confirmPasswordEl) {
    alert("Signup form not found");
    return;
  }

  const name = nameEl ? nameEl.value.trim() : "";
  const email = emailEl.value.trim();
  const password = passwordEl.value.trim();
  const confirmPassword = confirmPasswordEl.value.trim();

  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Admin account created successfully");
    window.location.href = "admin-login.html";
  } catch (error) {
    alert(error.message);
  }
};

// ---------------- ADMIN LOGIN ----------------
window.adminLogin = async function () {
  const emailEl = document.getElementById("adminEmail");
  const passwordEl = document.getElementById("adminPassword");

  if (!emailEl || !passwordEl) {
    alert("Login form not found");
    return;
  }

  const email = emailEl.value.trim();
  const password = passwordEl.value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful");
    window.location.href = "admin.html";
  } catch (error) {
    alert("Login failed: " + error.message);
  }
};

// ---------------- ADMIN LOGOUT ----------------
window.logoutAdmin = async function () {
  try {
    await signOut(auth);
    window.location.href = "admin-login.html";
  } catch (error) {
    alert("Logout failed: " + error.message);
  }
};

// ---------------- CHECK ADMIN LOGIN ----------------
window.checkAdminLogin = function () {
  onAuthStateChanged(auth, (user) => {
    const isAdminPage = window.location.pathname.includes("admin.html");

    if (isAdminPage && !user) {
      alert("Please login first");
      window.location.href = "admin-login.html";
    }

    if (isAdminPage && user) {
      displayStudents();
    }
  });
};

// ---------------- GRADE / RESULT ----------------
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

// ---------------- SAVE / UPDATE STUDENT ----------------
const studentForm = document.getElementById("studentForm");

if (studentForm) {
  studentForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const editId = document.getElementById("editId").value.trim();

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

    if (
      !name ||
      !fatherName ||
      !motherName ||
      !gmail ||
      !rollNo ||
      isNaN(sub1) ||
      isNaN(sub2) ||
      isNaN(sub3) ||
      isNaN(sub4) ||
      isNaN(sub5)
    ) {
      alert("Please fill all fields properly");
      return;
    }

    const total = sub1 + sub2 + sub3 + sub4 + sub5;
    const percentage = (total / 500) * 100;
    const result = getResultStatus(sub1, sub2, sub3, sub4, sub5);
    const grade = getGrade(percentage, result);

    const studentData = {
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

    try {
      if (editId) {
        await updateDoc(doc(db, "students", editId), studentData);
        alert("Student updated successfully");
      } else {
        const duplicateQuery = query(
          collection(db, "students"),
          where("rollNo", "==", rollNo),
          where("gmail", "==", gmail)
        );

        const duplicateSnapshot = await getDocs(duplicateQuery);

        if (!duplicateSnapshot.empty) {
          alert("Student with same Roll No and Gmail already exists");
          return;
        }

        await addDoc(collection(db, "students"), studentData);
        alert("Student added successfully");
      }

      studentForm.reset();
      document.getElementById("editId").value = "";
      displayStudents();
    } catch (error) {
      alert("Error: " + error.message);
    }
  });
}

// ---------------- DISPLAY STUDENTS ----------------
window.displayStudents = async function () {
  const tableBody = document.getElementById("studentTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "students"));

    snapshot.forEach((docSnap) => {
      const student = docSnap.data();
      const id = docSnap.id;

      tableBody.innerHTML += `
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
            <button class="action-btn edit-btn" onclick="editStudent('${id}')">Edit</button>
            <button class="action-btn delete-btn" onclick="deleteStudent('${id}')">Delete</button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    alert("Failed to load students: " + error.message);
  }
};

// ---------------- EDIT STUDENT ----------------
window.editStudent = async function (id) {
  try {
    const docRef = doc(db, "students", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      alert("Student not found");
      return;
    }

    const student = docSnap.data();

    document.getElementById("editId").value = id;
    document.getElementById("name").value = student.name || "";
    document.getElementById("fatherName").value = student.fatherName || "";
    document.getElementById("motherName").value = student.motherName || "";
    document.getElementById("gmail").value = student.gmail || "";
    document.getElementById("rollNo").value = student.rollNo || "";
    document.getElementById("sub1").value = student.sub1 ?? "";
    document.getElementById("sub2").value = student.sub2 ?? "";
    document.getElementById("sub3").value = student.sub3 ?? "";
    document.getElementById("sub4").value = student.sub4 ?? "";
    document.getElementById("sub5").value = student.sub5 ?? "";

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    alert("Edit failed: " + error.message);
  }
};

// ---------------- DELETE STUDENT ----------------
window.deleteStudent = async function (id) {
  const ok = confirm("Are you sure you want to delete this student?");
  if (!ok) return;

  try {
    await deleteDoc(doc(db, "students", id));
    alert("Student deleted successfully");
    displayStudents();
  } catch (error) {
    alert("Delete failed: " + error.message);
  }
};

// ---------------- STUDENT RESULT SEARCH ----------------
window.searchResult = async function () {
  const rollNoEl = document.getElementById("studentRollNo");
  const gmailEl = document.getElementById("studentGmail");

  if (!rollNoEl || !gmailEl) {
    alert("Student search form not found");
    return;
  }

  const rollNo = rollNoEl.value.trim();
  const gmail = gmailEl.value.trim();

  if (!rollNo || !gmail) {
    alert("Please enter Roll No and Gmail");
    return;
  }

  try {
    const q = query(
      collection(db, "students"),
      where("rollNo", "==", rollNo),
      where("gmail", "==", gmail)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("Result not found");
      return;
    }

    querySnapshot.forEach((docSnap) => {
      const student = docSnap.data();
      const newTab = window.open("", "_blank");

      if (!newTab) {
        alert("Popup blocked. Please allow popups.");
        return;
      }

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
              max-width: 750px;
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
            .btn-row {
              text-align: center;
              margin-top: 20px;
            }
            button {
              padding: 10px 16px;
              border: none;
              background: #2563eb;
              color: white;
              border-radius: 8px;
              cursor: pointer;
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
              <tr><td>${subject1Name}</td><td>${student.sub1}</td></tr>
              <tr><td>${subject2Name}</td><td>${student.sub2}</td></tr>
              <tr><td>${subject3Name}</td><td>${student.sub3}</td></tr>
              <tr><td>${subject4Name}</td><td>${student.sub4}</td></tr>
              <tr><td>${subject5Name}</td><td>${student.sub5}</td></tr>
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

            <div class="btn-row">
              <button onclick="window.print()">Print Result</button>
            </div>
          </div>
        </body>
        </html>
      `);

      newTab.document.close();
    });
  } catch (error) {
    alert("Search failed: " + error.message);
  }
};
