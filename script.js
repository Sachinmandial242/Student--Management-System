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

// ---------------- HELPER ----------------
function getEl(id) {
  return document.getElementById(id);
}

// ---------------- ADMIN SIGNUP ----------------
window.adminSignup = async function () {
  const nameEl = getEl("signupName");
  const emailEl = getEl("signupEmail");
  const passwordEl = getEl("signupPassword");
  const confirmPasswordEl = getEl("signupConfirmPassword");

  if (!nameEl || !emailEl || !passwordEl || !confirmPasswordEl) {
    alert("Signup form not found");
    return;
  }

  const name = nameEl.value.trim();
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

  if (password.length < 6) {
    alert("Password should be at least 6 characters");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Admin account created successfully");
    window.location.href = "admin-login.html";
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      alert("This email is already registered. Please login instead.");
    } else if (error.code === "auth/invalid-email") {
      alert("Please enter a valid email address.");
    } else if (error.code === "auth/weak-password") {
      alert("Password should be at least 6 characters.");
    } else {
      alert("Signup failed: " + error.message);
    }
  }
};

// ---------------- ADMIN LOGIN ----------------
window.adminLogin = async function () {
  const emailEl = getEl("adminEmail");
  const passwordEl = getEl("adminPassword");

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
    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/user-not-found"
    ) {
      alert("Wrong email or password.");
    } else if (error.code === "auth/invalid-email") {
      alert("Please enter a valid email address.");
    } else {
      alert("Login failed: " + error.message);
    }
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
    const currentPage = window.location.pathname;

    if (currentPage.includes("admin.html")) {
      if (!user) {
        alert("Please login first");
        window.location.href = "admin-login.html";
      } else {
        displayStudents();
      }
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

// ---------------- SAVE / UPDATE STUDENT ----------------
const studentForm = getEl("studentForm");

if (studentForm) {
  studentForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const editIdEl = getEl("editId");
    const nameEl = getEl("name");
    const fatherNameEl = getEl("fatherName");
    const motherNameEl = getEl("motherName");
    const gmailEl = getEl("gmail");
    const rollNoEl = getEl("rollNo");
    const sub1El = getEl("sub1");
    const sub2El = getEl("sub2");
    const sub3El = getEl("sub3");
    const sub4El = getEl("sub4");
    const sub5El = getEl("sub5");

    if (
      !editIdEl ||
      !nameEl ||
      !fatherNameEl ||
      !motherNameEl ||
      !gmailEl ||
      !rollNoEl ||
      !sub1El ||
      !sub2El ||
      !sub3El ||
      !sub4El ||
      !sub5El
    ) {
      alert("student form not found properly");
      return;
    }

    const editId = editIdEl.value.trim();
    const name = nameEl.value.trim();
    const fatherName = fatherNameEl.value.trim();
    const motherName = motherNameEl.value.trim();
    const gmail = gmailEl.value.trim();
    const rollNo = rollNoEl.value.trim();

    const sub1 = Number(sub1El.value);
    const sub2 = Number(sub2El.value);
    const sub3 = Number(sub3El.value);
    const sub4 = Number(sub4El.value);
    const sub5 = Number(sub5El.value);

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

    if (
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
    await deleteDoc(doc(db, "students", id));
    alert("Student deleted successfully");
    displayStudents();
  } catch (error) {
    alert("Delete failed: " + error.message);
  }
};

// ---------------- STUDENT RESULT SEARCH ----------------
window.searchResult = async function () {
  const rollNoEl = getEl("studentRollNo");
  const gmailEl = getEl("studentGmail");

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

// ---------------- RUN PAGE CHECKS ----------------
document.addEventListener("DOMContentLoaded", () => {
  checkAdminLogin();
});
