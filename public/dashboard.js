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

        if (!data.success) {
            alert("API Key inválida.");
            return;
        }

        document.getElementById("username").textContent = data.user;
        document.getElementById("plan").textContent = data.plan;
        document.getElementById("requests").textContent = data.requests;
        document.getElementById("apikey").textContent = apiKey;

    } catch (err) {

        console.error(err);
        alert("No se pudo cargar el dashboard.");

    }

}

function copyKey() {

    navigator.clipboard.writeText(apiKey);

    alert("API Key copiada correctamente.");

}

async function regenerateKey() {

    try {

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

        } else {

            alert(data.message);

        }

    } catch (err) {

        alert("Error al regenerar la API Key.");

    }

}

function logout() {

    localStorage.clear();

    location.href = "/login.html";

}

loadDashboard();