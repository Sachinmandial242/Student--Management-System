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

const subject1Name = "Maths";
const subject2Name = "English";
const subject3Name = "Computer";
const subject4Name = "Science";
const subject5Name = "Hindi";

function getEl(id) {
  return document.getElementById(id);
}

function getAdminStudentsCollection() {
  const user = auth.currentUser;
  if (!user) {
    alert("Please login first");
    return null;
  }
  return collection(db, "admins", user.uid, "students");
}

function getAdminStudentDoc(id) {
  const user = auth.currentUser;
  if (!user) {
    alert("Please login first");
    return null;
  }
  return doc(db, "admins", user.uid, "students", id);
}

// ---------------- ADMIN SIGNUP ----------------
window.adminSignup = async function () {
  const name = getEl("signupName").value.trim();
  const email = getEl("signupEmail").value.trim();
  const password = getEl("signupPassword").value.trim();
  const confirmPassword = getEl("signupConfirmPassword").value.trim();

  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  if (password.length < 6) {
    alert("Password should be at least 6 characters");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Admin account created successfully");
    window.location.href = "admin-login.html";
  } catch (error) {
    alert("Signup failed: " + error.message);
  }
};

// ---------------- ADMIN LOGIN ----------------
window.adminLogin = async function () {
  const email = getEl("adminEmail").value.trim();
  const password = getEl("adminPassword").value.trim();

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
    alert("Logged out successfully");
    window.location.href = "admin-login.html";
  } catch (error) {
    alert("Logout failed: " + error.message);
  }
};

// ---------------- CHECK ADMIN LOGIN ----------------
window.checkAdminLogin = function () {
  onAuthStateChanged(auth, (user) => {
    if (window.location.pathname.includes("admin.html")) {
      if (!user) {
        alert("Please login first");
        window.location.href = "admin-login.html";
      } else {
        displayStudents();
      }
    }
  });
};

// ---------------- RESULT LOGIC ----------------
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
const studentForm = getEl("studentForm");

if (studentForm) {
  studentForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const editIdEl = getEl("editId");

    const name = getEl("name").value.trim();
    const fatherName = getEl("fatherName").value.trim();
    const motherName = getEl("motherName").value.trim();
    const gmail = getEl("gmail").value.trim();
    const rollNo = getEl("rollNo").value.trim();

    const sub1 = Number(getEl("sub1").value);
    const sub2 = Number(getEl("sub2").value);
    const sub3 = Number(getEl("sub3").value);
    const sub4 = Number(getEl("sub4").value);
    const sub5 = Number(getEl("sub5").value);

    if (!name || !fatherName || !motherName || !gmail || !rollNo) {
      alert("Please fill all fields");
      return;
    }

    if (
      isNaN(sub1) || isNaN(sub2) || isNaN(sub3) || isNaN(sub4) || isNaN(sub5) ||
      sub1 < 0 || sub1 > 100 ||
      sub2 < 0 || sub2 > 100 ||
      sub3 < 0 || sub3 > 100 ||
      sub4 < 0 || sub4 > 100 ||
      sub5 < 0 || sub5 > 100
    ) {
      alert("Marks should be between 0 and 100");
      return;
    }

    const total = sub1 + sub2 + sub3 + sub4 + sub5;
    const percentage = (total / 500) * 100;
    const result = getResultStatus(sub1, sub2, sub3, sub4, sub5);
    const grade = getGrade(percentage, result);

    const user = auth.currentUser;

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
      grade,
      adminUid: user.uid
    };

    try {
      const editId = editIdEl.value.trim();

      if (editId) {
        const studentDocRef = getAdminStudentDoc(editId);
        if (!studentDocRef) return;

        await updateDoc(studentDocRef, studentData);
        alert("Student updated successfully");
      } else {
        const studentsCollectionRef = getAdminStudentsCollection();
        if (!studentsCollectionRef) return;

        const duplicateQuery = query(
          studentsCollectionRef,
          where("rollNo", "==", rollNo),
          where("gmail", "==", gmail)
        );

        const duplicateSnapshot = await getDocs(duplicateQuery);

        if (!duplicateSnapshot.empty) {
          alert("Student with same Roll No and Gmail already exists");
          return;
        }

        // Admin-wise private data
        await addDoc(studentsCollectionRef, studentData);

        // Common result-search data
        await addDoc(collection(db, "students"), studentData);

        alert("Student added successfully");
      }

      studentForm.reset();
      editIdEl.value = "";
      displayStudents();
    } catch (error) {
      alert("Error: " + error.message);
    }
  });
}

// ---------------- DISPLAY STUDENTS ----------------
window.displayStudents = async function () {
  const tableBody = getEl("studentTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  try {
    const studentsCollectionRef = getAdminStudentsCollection();
    if (!studentsCollectionRef) return;

    const snapshot = await getDocs(studentsCollectionRef);

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
    const docRef = getAdminStudentDoc(id);
    if (!docRef) return;

    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      alert("Student not found");
      return;
    }

    const student = docSnap.data();

    getEl("editId").value = id;
    getEl("name").value = student.name || "";
    getEl("fatherName").value = student.fatherName || "";
    getEl("motherName").value = student.motherName || "";
    getEl("gmail").value = student.gmail || "";
    getEl("rollNo").value = student.rollNo || "";
    getEl("sub1").value = student.sub1 ?? "";
    getEl("sub2").value = student.sub2 ?? "";
    getEl("sub3").value = student.sub3 ?? "";
    getEl("sub4").value = student.sub4 ?? "";
    getEl("sub5").value = student.sub5 ?? "";

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
    const studentDocRef = getAdminStudentDoc(id);
    if (!studentDocRef) return;

    await deleteDoc(studentDocRef);
    alert("Student deleted successfully");
    displayStudents();
  } catch (error) {
    alert("Delete failed: " + error.message);
  }
};

// ---------------- STUDENT RESULT SEARCH ----------------
window.searchResult = async function () {
  const rollNo = getEl("studentRollNo").value.trim();
  const gmail = getEl("studentGmail").value.trim();

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
              color: #2563eb;
            }
            .info, .summary {
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

document.addEventListener("DOMContentLoaded", () => {
  checkAdminLogin();
});
