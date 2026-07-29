const token = localStorage.getItem("token");
const apiKey = localStorage.getItem("apikey");

if (!token || !apiKey) {
    window.location = "/login.html";
}

async function loadDashboard() {

    try {

        const res = await fetch("/api", {
            headers: {
                "x-api-key": apiKey
            }
        });

        const data = await res.json();

        document.getElementById("username").innerText = data.user;
        document.getElementById("plan").innerText = data.plan;
        document.getElementById("requests").innerText = data.requests;
        document.getElementById("apikey").innerText = apiKey;

    } catch (e) {

        alert("Error al cargar el dashboard.");

    }

}

function copyKey() {

    navigator.clipboard.writeText(apiKey);

    alert("API Key copiada.");

}

async function regenerateKey() {

    const res = await fetch("/api/apikey/regenerate", {

        headers: {
            "x-api-key": apiKey
        }

    });

    const data = await res.json();

    if (data.success) {

        localStorage.setItem("apikey", data.api_key);

        alert("Nueva API Key creada.");

        location.reload();

    }

}

function logout() {

    localStorage.clear();

    window.location = "/login.html";

}

loadDashboard();