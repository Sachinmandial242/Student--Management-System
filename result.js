function checkResult() {
  let name = document.getElementById("studentName").value.trim().toLowerCase();
  let email = document.getElementById("studentEmail").value.trim().toLowerCase();
  let resultBox = document.getElementById("resultBox");

  let students = JSON.parse(localStorage.getItem("students")) || [];

  let student = students.find(function(s) {
    return (
      s.name.toLowerCase() === name &&
      s.email.toLowerCase() === email
    );
  });

  if (student) {
    resultBox.innerHTML = `
      <h2>Result Found</h2>
      <p><b>Name:</b> ${student.name}</p>
      <p><b>Roll No:</b> ${student.roll}</p>
      <p><b>Course:</b> ${student.course}</p>
      <p><b>Email:</b> ${student.email}</p>
      <p><b>Total:</b> ${student.total}</p>
      <p><b>Percentage:</b> ${student.percentage.toFixed(2)}%</p>
      <p><b>Grade:</b> ${student.grade}</p>
      <p><b>Result:</b> ${student.result}</p>
    `;
  } else {
    resultBox.innerHTML = `<p style="color:red;">No record found</p>`;
  }
}
