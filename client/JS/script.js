document.addEventListener("DOMContentLoaded", function () {

    /* ==============================
       SPLASH SCREEN
       ============================== */

    if (document.body.classList.contains("splash-page")) {

        setTimeout(function () {
            window.location.href = "welcome.html";
        }, 3000);

    }


    /* ==============================
       REGISTER
       ============================== */

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {

        registerForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const password =
                document.getElementById("registerPassword");

            const confirmPassword =
                document.getElementById("confirmPassword");


            if (password && confirmPassword) {

                if (password.value !== confirmPassword.value) {

                    alert("Password and Confirm Password do not match.");

                    return;
                }

            }


            // Direct Home Page
            window.location.href = "home.html";

        });

    }


    /* ==============================
       DONATE CATEGORY
       ============================== */

    const categoryButtons =
        document.querySelectorAll(".donate-category");

    const selectedCategory =
        document.getElementById("selectedCategory");


    if (categoryButtons.length > 0 && selectedCategory) {

        categoryButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                categoryButtons.forEach(function (item) {

                    item.classList.remove("active");

                });

                this.classList.add("active");

                selectedCategory.value =
                    this.getAttribute("data-category");

            });

        });

    }


    
    /* ==============================
       AVAILABLE DONATIONS FILTER
       ============================== */

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    const donationCards =
        document.querySelectorAll(".available-card");

    const donationSearch =
        document.getElementById("donationsSearch");

    const noDonations =
        document.getElementById("noDonations");


    if (filterButtons.length > 0 && donationCards.length > 0) {

        filterButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                filterButtons.forEach(function (item) {

                    item.classList.remove("active");

                });

                this.classList.add("active");

                const filter =
                    this.getAttribute("data-filter");

                let visibleCount = 0;


                donationCards.forEach(function (card) {

                    const category =
                        card.getAttribute("data-category");


                    if (
                        filter === "all" ||
                        category === filter
                    ) {

                        card.style.display = "block";

                        visibleCount++;

                    } else {

                        card.style.display = "none";

                    }

                });


                if (noDonations) {

                    noDonations.style.display =
                        visibleCount === 0
                            ? "block"
                            : "none";

                }

            });

        });

    }


    /* ==============================
       SEARCH DONATIONS
       ============================== */

    if (donationSearch) {

        donationSearch.addEventListener("input", function () {

            const searchText =
                this.value.toLowerCase().trim();

            let visibleCount = 0;


            donationCards.forEach(function (card) {

                const cardText =
                    card.textContent.toLowerCase();


                if (cardText.includes(searchText)) {

                    card.style.display = "block";

                    visibleCount++;

                } else {

                    card.style.display = "none";

                }

            });


            if (noDonations) {

                noDonations.style.display =
                    visibleCount === 0
                        ? "block"
                        : "none";

            }

        });

    }

});

/* ==============================
   LOGOUT
   ============================== */

const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", function () {

        window.location.href = "login.html";

    });

}

/* ==============================
   MARK ALL NOTIFICATIONS READ
   ============================== */

const markAllRead =
    document.getElementById("markAllRead");

if (markAllRead) {

    markAllRead.addEventListener("click", function () {

        const unreadNotifications =
            document.querySelectorAll(".notification-card.unread");

        unreadNotifications.forEach(function (notification) {

            notification.classList.remove("unread");

        });

    });

}

/* ==============================
   CONTACT FORM
   ============================== */

const contactForm =
    document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        window.location.href = "home.html";

    });

}

/* ==============================
   ADMIN LOGIN
   ============================== */

const adminLoginForm =
    document.getElementById("adminLoginForm");

if (adminLoginForm) {

    adminLoginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        window.location.href = "admindashboard.html";

    });

}

/* ==============================
   ADMIN LOGOUT
   ============================== */

const adminLogout =
    document.getElementById("adminLogout");

if (adminLogout) {

    adminLogout.addEventListener("click", function () {

        window.location.href = "adminlogin.html";

    });

}
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("fullName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const phone = document.getElementById("mobile").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    password: password
                })
            });

            const data = await response.json();

            if (data.success) {
                alert("Registration successful!");
                window.location.href = "login.html";
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error(error);
            alert("Server connection failed!");
        }
    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("userId", data.user.id);
                localStorage.setItem("userName", data.user.name);
                localStorage.setItem("userEmail", data.user.email);
                alert("Login successful!");
                window.location.href = "home.html";
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error(error);
            alert("Server connection failed!");
        }
    });
}

const donationForm = document.getElementById("donationForm");

if (donationForm) {

    const categoryButtons = document.querySelectorAll(".donate-category");
    const selectedCategory = document.getElementById("selectedCategory");

    categoryButtons.forEach(button => {
        button.addEventListener("click", function () {

            categoryButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            this.classList.add("active");

            selectedCategory.value = this.dataset.category;
        });
    });


    donationForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const userId = localStorage.getItem("userId");

        if (!userId) {
            alert("Please login first!");
            window.location.href = "login.html";
            return;
        }

        const category = document.getElementById("selectedCategory").value;
        const itemName = document.getElementById("itemName").value.trim();
        const quantity = document.getElementById("quantity").value;
        const condition = document.getElementById("condition").value;
        const description = document.getElementById("description").value.trim();
        const location = document.getElementById("location").value.trim();

        try {

            const response = await fetch("http://localhost:3000/api/donations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: userId,
                    category: category,
                    item_name: itemName,
                    description: description,
                    quantity: quantity,
                    condition: condition,
                    location: location
                })
            });

            const data = await response.json();

            if (data.success) {

                alert("Donation submitted successfully!");

                donationForm.reset();

                selectedCategory.value = "Clothes";

                window.location.href = "mydonations.html";

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error("Donation Error:", error);
            alert("Server connection failed!");

        }
    });
}

/* ==============================
   REQUEST FORM
   ============================== */

const requestForm = document.getElementById("requestForm");

if (requestForm) {

    requestForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const donationId =
            document.getElementById("donationId").value;

        const requesterId =
            localStorage.getItem("userId");

        const requestReason =
            document.getElementById("requestReason").value.trim();

        if (!requesterId) {
            alert("Please login first!");
            window.location.href = "login.html";
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:3000/api/requests",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        donation_id: donationId,
                        requester_id: requesterId,
                        message: requestReason
                    })
                }
            );

            const data = await response.json();

            if (data.success) {

                alert("Request submitted successfully!");

                requestForm.reset();

                window.location.href = "myrequests.html";

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error("Request Error:", error);

            alert("Server connection failed!");

        }

    });

}
// ==============================
// LOAD MY REQUESTS
// ==============================

const myRequestsList = document.getElementById("requestsList");

if (myRequestsList) {

    fetch("http://localhost:3000/api/requests/1")
        .then(response => response.json())
        .then(data => {

            console.log("MY REQUESTS:", data);

            if (!data.success) {
                myRequestsList.innerHTML =
                    "<p>Failed to load requests.</p>";
                return;
            }

            if (!data.requests || data.requests.length === 0) {
                myRequestsList.innerHTML =
                    "<p>No requests found.</p>";
                return;
            }

            myRequestsList.innerHTML = "";

            data.requests.forEach(request => {

                const card = document.createElement("div");

                card.className = "my-request-card";

                card.innerHTML = `
                    <div class="request-image">
                        🎁
                    </div>

                    <div class="request-info">

                        <span class="request-category">
                            ${request.category || "Donation"}
                        </span>

                        <h3>
                            ${request.item_name || "Requested Donation"}
                        </h3>

                        <p>
                            ${request.message || "Request submitted"}
                        </p>

                        <small>
                            Quantity: ${request.quantity || 1}
                        </small>

                        <br>

                        <small>
                            Request ID: ${request.id}
                        </small>

                    </div>

                    <span class="request-status ${request.status || "pending"}">
                        ${request.status || "pending"}
                    </span>
                `;

                myRequestsList.appendChild(card);
            });

        })
        .catch(error => {

            console.error("MY REQUESTS ERROR:", error);

            myRequestsList.innerHTML =
                "<p>Unable to load requests.</p>";

        });
}

const adminRequestList = document.getElementById("adminRequestList");

if (adminRequestList) {

    fetch("http://localhost:3000/api/admin/requests")
        .then(response => response.json())
        .then(data => {

            if (!data.success) {
                adminRequestList.innerHTML =
                    "<p>Failed to load requests.</p>";
                return;
            }

            if (data.requests.length === 0) {
                adminRequestList.innerHTML =
                    "<p>No requests found.</p>";
                return;
            }

            adminRequestList.innerHTML = "";

            data.requests.forEach(request => {

                const card = document.createElement("div");

                card.className = "admin-request-card";

                card.innerHTML = `
                    <div class="admin-request-icon">
                        📩
                    </div>

                    <div>
                        <strong>
                            Donation Request #${request.id}
                        </strong>

                        <small>
                            Donation ID: ${request.donation_id}
                        </small>
                    </div>

                    <span class="table-status ${request.status}">
                        ${request.status}
                    </span>
                `;

                adminRequestList.appendChild(card);

            });

        })
        .catch(error => {

            console.error("Admin Requests Error:", error);

            adminRequestList.innerHTML =
                "<p>Unable to load requests.</p>";

        });

}