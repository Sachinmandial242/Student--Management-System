let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = -1;

function saveToLocalStorage() {
    localStorage.setItem("students", JSON.stringify(students));
}

function getGrade(percentage) {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 40) return "D";
    return "Fail";
}

function updateStats() {
    document.getElementById("totalStudents").innerText =
        "Total Students: " + students.length;

    let passed = students.filter(student => student.percentage >= 40).length;
    let failed = students.filter(student => student.percentage < 40).length;

    document.getElementById("passedStudents").innerText =
        "Passed Students: " + passed;

    document.getElementById("failedStudents").innerText =
        "Failed Students: " + failed;
}

function displayStudents(data = students) {
    let tableBody = document.getElementById("studentTableBody");
    tableBody.innerHTML = "";

    data.forEach((student, index) => {
        let realIndex = students.findIndex(s =>
            s.roll === student.roll &&
            s.name === student.name &&
            s.email === student.email
        );

        let row = tableBody.insertRow();

        row.insertCell(0).innerText = student.name;
        row.insertCell(1).innerText = student.roll;
        row.insertCell(2).innerText = student.course;
        row.insertCell(3).innerText = student.email;
        row.insertCell(4).innerText = student.sub1;
        row.insertCell(5).innerText = student.sub2;
        row.insertCell(6).innerText = student.sub3;
        row.insertCell(7).innerText = student.total;
        row.insertCell(8).innerText = student.percentage.toFixed(2) + "%";
        row.insertCell(9).innerText = student.grade;
        row.insertCell(10).innerText = student.result;
        row.insertCell(11).innerHTML = `
      <button onclick="editStudent(${realIndex})">Edit</button>
      <button onclick="deleteStudent(${realIndex})">Delete</button>
    `;
    });

    updateStats();
}

function addStudent() {
    let name = document.getElementById("name").value.trim();
    let roll = document.getElementById("roll").value.trim();
    let course = document.getElementById("course").value.trim();
    let email = document.getElementById("email").value.trim();
    let sub1 = document.getElementById("sub1").value.trim();
    let sub2 = document.getElementById("sub2").value.trim();
    let sub3 = document.getElementById("sub3").value.trim();
    let students = JSON.parse(localStorage.getItem("students")) || [];

let studentData = {
  name: name,
  roll: roll,
  course: course,
  email: email,
  sub1: sub1,
  sub2: sub2,
  sub3: sub3,
  total: sub1 + sub2 + sub3,
  percentage: ((sub1 + sub2 + sub3) / 300) * 100,
  grade: "A", // temporarily
  result: ((sub1 + sub2 + sub3) / 300) * 100 >= 40 ? "Pass" : "Fail"
};

students.push(studentData);

localStorage.setItem("students", JSON.stringify(students));

    if (!name || !roll || !course || !email || !sub1 || !sub2 || !sub3) {
        alert("Please fill all fields");
        return;
    }

    sub1 = Number(sub1);
    sub2 = Number(sub2);
    sub3 = Number(sub3);

    if (
        sub1 < 0 || sub1 > 100 ||
        sub2 < 0 || sub2 > 100 ||
        sub3 < 0 || sub3 > 100
    ) {
        alert("Marks should be between 0 and 100");
        return;
    }

    let duplicate = students.some(function (student, index) {
        return student.roll === roll && index !== editIndex;
    });

    if (duplicate) {
        alert("Roll number already exists");
        return;
    }

    let total = sub1 + sub2 + sub3;
    let percentage = (total / 300) * 100;
    let grade = getGrade(percentage);
    let result = percentage >= 40 ? "Pass" : "Fail";

    let studentData = {
        name: name,
        roll: roll,
        course: course,
        email: email,
        sub1: sub1,
        sub2: sub2,
        sub3: sub3,
        total: total,
        percentage: percentage,
        grade: grade,
        result: result
    };

    if (editIndex === -1) {
        students.push(studentData);
    } else {
        students[editIndex] = studentData;
        editIndex = -1;
    }

    saveToLocalStorage();
    displayStudents();
    clearInputs();
}

function editStudent(index) {
    let student = students[index];

    document.getElementById("name").value = student.name;
    document.getElementById("roll").value = student.roll;
    document.getElementById("course").value = student.course;
    document.getElementById("email").value = student.email;
    document.getElementById("sub1").value = student.sub1;
    document.getElementById("sub2").value = student.sub2;
    document.getElementById("sub3").value = student.sub3;

    editIndex = index;
}

function deleteStudent(index) {
    students.splice(index, 1);
    saveToLocalStorage();
    displayStudents();
}

function clearAll() {
    students = [];
    editIndex = -1;
    saveToLocalStorage();
    displayStudents();
}

function clearInputs() {
    document.getElementById("name").value = "";
    document.getElementById("roll").value = "";
    document.getElementById("course").value = "";
    document.getElementById("email").value = "";
    document.getElementById("sub1").value = "";
    document.getElementById("sub2").value = "";
    document.getElementById("sub3").value = "";
}

function searchStudent() {
    let searchValue = document.getElementById("search").value.toLowerCase();

    let filteredStudents = students.filter(function (student) {
        return student.name.toLowerCase().includes(searchValue);
    });

    displayStudents(filteredStudents);
}

function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
}

displayStudents();
