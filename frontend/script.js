const API = "https://bloggr-9wuh.onrender.com";

// Feed Page Logic
const postButton = document.getElementById("postButton");

document.addEventListener("DOMContentLoaded", () => {
    const postContent = document.getElementById("postContent");
    const postButton = document.getElementById("postButton");

    if (postContent && postButton) {
        postContent.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                postButton.click();
            }
        });
    }
});

if (postButton) {
    loadPosts();

    postButton.addEventListener("click", async () => {
        const content = document.getElementById("postContent").value.trim();

        if (content === "") {
            alert("Please write something.");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${API}/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    title: "Untitled",
                    content
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            document.getElementById("postContent").value = "";

            loadPosts();

        } catch (error) {
            console.log(error);
            alert("Failed to create post");
        }
    });
}

async function loadPosts() {
    const postsDiv = document.getElementById("posts");

    if (!postsDiv) return;

    try {
        const response = await fetch(`${API}/posts`);

        const posts = await response.json();

        let html = "";

        posts.slice(0, 7).forEach(post => {
         html += `
              <div class="post">
                    <strong>${post.author.username}</strong>
                    <p>${post.content}</p>
              </div>`;
        });

postsDiv.innerHTML = html;

    } catch (error) {
        console.log(error);
    }
}

// Register User
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });

            const data = await response.json();

            alert(data.message);

            if (response.ok) {
                window.location.href = "login.html";
            }

        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    });
}

// Login User
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            localStorage.setItem("token", data.token);

            window.location.href = "feed.html";

        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    });
}

// Logout
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
}