function signup() {
    let username = document.getElementById("signupUsername").value.trim();
    let password = document.getElementById("signupPassword").value.trim();
    let confirmPassword = document.getElementById("confirmPassword").value.trim();
    let message = document.getElementById("signupMessage");

    if (username === "" || password === "" || confirmPassword === "") {
        message.innerText = "Please fill all fields";
        message.style.color = "red";
        return;
    }

    if (password !== confirmPassword) {
        message.innerText = "Passwords do not match";
        message.style.color = "red";
        return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    message.innerText = "Signup successful! Redirecting to login...";
    message.style.color = "green";

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
}