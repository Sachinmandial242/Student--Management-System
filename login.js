function login() {
    let username = document.getElementById("loginUsername").value.trim();
    let password = document.getElementById("loginPassword").value.trim();
    let message = document.getElementById("loginMessage");

    let savedUsername = localStorage.getItem("username");
    let savedPassword = localStorage.getItem("password");

    if (username === "" || password === "") {
        message.innerText = "Please fill all fields";
        message.style.color = "red";
        return;
    }

    if (username === savedUsername && password === savedPassword) {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "index.html";
    } else {
        message.innerText = "Invalid username or password";
        message.style.color = "red";
    }
}