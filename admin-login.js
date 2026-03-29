function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let message = document.getElementById("message");

    if (username === "admin" && password === "1234") {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "admin.html";
    } else {
        message.innerText = "Wrong username or password";
        message.style.color = "red";
    }
}
function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "admin-login.html";
}