function getRequests() {
    return JSON.parse(localStorage.getItem("requests")) || [];
}

function saveRequests(requests) {
    localStorage.setItem("requests", JSON.stringify(requests));
}

function requestTimeOff() {
    let requests = getRequests();

    let request = {
        name: "Employee",
        status: "Pending"
    };

    requests.push(request);
    saveRequests(requests);

    alert("Request submitted!");
}

function displayRequests() {
    let container = document.getElementById("requests");
    if (!container) return;

    let requests = getRequests();

    container.innerHTML = "";

    requests.forEach((req, index) => {
        container.innerHTML += `
            <div>
                ${req.name} - ${req.status}
                <button onclick="approve(${index})">Approve</button>
                <button onclick="deny(${index})">Deny</button>
            </div>
        `;
    });
}

function approve(index) {
    let requests = getRequests();
    requests[index].status = "Approved";
    saveRequests(requests);
    displayRequests();
}

function deny(index) {
    let requests = getRequests();
    requests[index].status = "Denied";
    saveRequests(requests);
    displayRequests();
}

window.onload = displayRequests;