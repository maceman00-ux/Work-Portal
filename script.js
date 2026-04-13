let currentUser = localStorage.getItem("currentUser") || "Austin";
let employees = ["Austin", "Employee1", "Employee2"];
let managers = ["Austin"];

function changeUser() {
    let select = document.getElementById("userSelect");
    if (!select) return;

    currentUser = select.value;
    localStorage.setItem("currentUser", currentUser);

    displayNotices();
    displayAnnouncements();
    displayMyRequests();
    toggleManagerButton();
}

function goToManager() {
    window.location.href = "manager.html";
}

function toggleManagerButton() {
    let btn = document.getElementById("managerBtn");
    if (!btn) return;

    if (managers.includes(currentUser)) {
        btn.style.display = "inline-block";
    } else {
        btn.style.display = "none";
    }
}

function checkManagerAccess() {
    if (!managers.includes(currentUser)) {
        alert("Access denied. Manager only.");
        window.location.href = "index.html";
    }
}

// -------------------- REQUESTS --------------------

function getRequests() {
    return JSON.parse(localStorage.getItem("requests")) || [];
}

function saveRequests(requests) {
    localStorage.setItem("requests", JSON.stringify(requests));
}

function requestTimeOff() {
    let requests = getRequests();

    let requestedDateInput = document.getElementById("requestDate");
    let reasonInput = document.getElementById("requestReason");

    let requestedDate = requestedDateInput ? requestedDateInput.value : "";
    let reason = reasonInput ? reasonInput.value.trim() : "";

    if (!requestedDate) {
        alert("Please select a date.");
        return;
    }

    let request = {
        name: currentUser,
        dateRequested: new Date().toLocaleString(),
        requestedDate: requestedDate,
        reason: reason || "No reason provided",
        status: "Pending"
    };

    requests.push(request);
    saveRequests(requests);

    if (requestedDateInput) requestedDateInput.value = "";
    if (reasonInput) reasonInput.value = "";

    alert("Request submitted!");
    displayRequests();
    displayRequestHistory();
    displayMyRequests();
    displayDashboardSummary();
}

function displayRequests() {
    let container = document.getElementById("requests");
    if (!container) return;

    let requests = getRequests();

    container.innerHTML = "";

    requests.forEach((req, index) => {
        if (req.status === "Pending") {
            container.innerHTML += `
                <div style="margin-bottom:15px; padding:10px; border:1px solid #ccc;">
                    <strong>Employee:</strong> ${req.name}<br>
                    <strong>Date Requested:</strong> ${req.dateRequested || "Unknown"}<br>
                    <strong>Requested Off Date:</strong> ${req.requestedDate || "Not entered"}<br>
                    <strong>Reason:</strong> ${req.reason || "None"}<br>
                    <strong>Status:</strong> ${req.status}<br><br>

                    <button onclick="updateRequestStatus(${index}, 'Approved')">Approve</button>
                    <button onclick="updateRequestStatus(${index}, 'Denied')">Deny</button>
                </div>
            `;
        }
    });

    if (container.innerHTML === "") {
        container.innerHTML = "<p>No active requests.</p>";
    }
}

function displayRequestHistory() {
    let container = document.getElementById("requestHistory");
    if (!container) return;

    let requests = getRequests();

    container.innerHTML = "";

    requests.forEach((req, index) => {
        if (req.status === "Approved" || req.status === "Denied") {
            container.innerHTML += `
                <div style="margin-bottom:15px; padding:10px; border:1px solid #ccc;">
                    <strong>Employee:</strong> ${req.name}<br>
                    <strong>Date Requested:</strong> ${req.dateRequested || "Unknown"}<br>
                    <strong>Requested Off Date:</strong> ${req.requestedDate || "Not entered"}<br>
                    <strong>Reason:</strong> ${req.reason || "None"}<br>
                    <strong>Status:</strong> ${req.status}<br><br>

                    <button onclick="updateRequestStatus(${index}, 'Pending')">Set Back to Pending</button>
                    <button onclick="updateRequestStatus(${index}, 'Approved')">Approve</button>
                    <button onclick="updateRequestStatus(${index}, 'Denied')">Deny</button>
                </div>
            `;
        }
    });

    if (container.innerHTML === "") {
        container.innerHTML = "<p>No request history.</p>";
    }
}

function updateRequestStatus(index, newStatus) {
    let requests = getRequests();
    requests[index].status = newStatus;
    saveRequests(requests);
    displayRequests();
    displayRequestHistory();
    displayMyRequests();
    displayDashboardSummary();
}

function showRequestSection(section) {
    const activeSection = document.getElementById("activeRequestsSection");
    const historySection = document.getElementById("historyRequestsSection");

    if (!activeSection || !historySection) return;

    if (section === "active") {
        activeSection.style.display = "block";
        historySection.style.display = "none";
    } else {
        activeSection.style.display = "none";
        historySection.style.display = "block";
        displayRequestHistory();
    }
}

function displayMyRequests() {
    let container = document.getElementById("myRequests");
    if (!container) return;

    let requests = getRequests();

    container.innerHTML = "";

    requests
        .filter(r => r.name === currentUser)
        .forEach((r) => {
            container.innerHTML += `
                <div style="margin-bottom:10px; padding:10px; border:1px solid #ccc;">
                    <strong>Date Requested:</strong> ${r.dateRequested}<br>
                    <strong>Requested Off Date:</strong> ${r.requestedDate}<br>
                    <strong>Reason:</strong> ${r.reason}<br>
                    <strong>Status:</strong> ${r.status}
                </div>
            `;
        });

    if (container.innerHTML === "") {
        container.innerHTML = "<p>No requests submitted.</p>";
    }
}

// -------------------- ANNOUNCEMENTS --------------------

function getAnnouncements() {
    return JSON.parse(localStorage.getItem("announcements")) || [];
}

function saveAnnouncements(announcements) {
    localStorage.setItem("announcements", JSON.stringify(announcements));
}

function displayAnnouncements() {
    const list = document.getElementById("announcementList");
    const count = document.getElementById("newCount");

    if (!list || !count) return;

    let announcements = getAnnouncements();

    list.innerHTML = "";

    let unreadCount = 0;

    announcements.forEach((a, index) => {
        if (!a.read) unreadCount++;

        list.innerHTML += `
            <div class="announcement" onclick="markAsRead(${index})">
                <strong>${a.date}</strong><br>
                ${a.message}
                ${!a.read ? '<span class="new-badge">NEW</span>' : ''}
            </div>
        `;
    });

    count.innerText = unreadCount > 0 ? `(${unreadCount} new)` : "";
}

function postAnnouncement() {
    const input = document.getElementById("announcementInput");
    if (!input) return;

    const message = input.value.trim();
    if (message === "") {
        alert("Please type an announcement first.");
        return;
    }

    let announcements = getAnnouncements();

    announcements.unshift({
        message: message,
        date: new Date().toLocaleString(),
        read: false
    });

    saveAnnouncements(announcements);
    input.value = "";

    alert("Announcement posted!");
    displayAnnouncements();
    displayDashboardSummary();
}

function markAsRead(index) {
    let announcements = getAnnouncements();
    announcements[index].read = true;
    saveAnnouncements(announcements);
    displayAnnouncements();
    displayDashboardSummary();
}

// -------------------- NOTICES --------------------

function getNotices() {
    return JSON.parse(localStorage.getItem("notices")) || [];
}

function saveNotices(notices) {
    localStorage.setItem("notices", JSON.stringify(notices));
}

function displayNotices() {
    const list = document.getElementById("noticesList");
    if (!list) return;

    let notices = getNotices();

    list.innerHTML = "";

    notices
        .map((notice, originalIndex) => ({ notice, originalIndex }))
        .filter(item => item.notice.employee === currentUser)
        .forEach((item) => {
            const n = item.notice;
            const originalIndex = item.originalIndex;

            list.innerHTML += `
                <div class="notice">
                    <strong>${n.date}</strong><br>
                    ${n.message}
                    <br><br>
                    ${
                        n.acknowledgedBy && n.acknowledgedBy.includes(currentUser)
                            ? "<strong style='color:green;'>Acknowledged</strong>"
                            : `<label>
                                <input type="checkbox" onchange="acknowledgeNotice(${originalIndex})">
                                I confirm that I have read, understand, and acknowledge this notice.
                              </label>`
                    }
                </div>
            `;
        });
}

function acknowledgeNotice(originalIndex) {
    let notices = getNotices();

    if (!notices[originalIndex].acknowledgedBy) {
        notices[originalIndex].acknowledgedBy = [];
    }

    if (!notices[originalIndex].acknowledgedBy.includes(currentUser)) {
        notices[originalIndex].acknowledgedBy.push(currentUser);
    }

    saveNotices(notices);
    displayNotices();
    displayNoticeTracking();
    displayNoticeHistory();
    displayDashboardSummary();
}

function sendNotice() {
    const input = document.getElementById("noticeInput");
    const employeeSelect = document.getElementById("employeeSelect");

    if (!input || !employeeSelect) return;

    const message = input.value.trim();
    const employee = employeeSelect.value;

    if (message === "") {
        alert("Please type a required notice first.");
        return;
    }

    let notices = getNotices();

    notices.unshift({
        message: message,
        date: new Date().toLocaleString(),
        employee: employee,
        acknowledgedBy: []
    });

    saveNotices(notices);
    input.value = "";

    alert("Required notice sent!");
    displayNotices();
    displayNoticeTracking();
    displayNoticeHistory();
    displayDashboardSummary();
}

function displayNoticeTracking() {
    const container = document.getElementById("noticeTracking");
    if (!container) return;

    let notices = getNotices();

    container.innerHTML = "";

    notices.forEach((n) => {
        let acknowledged = n.acknowledgedBy || [];
        let isFullyAcknowledged = acknowledged.includes(n.employee);

        if (!isFullyAcknowledged) {
            container.innerHTML += `
                <div style="margin-bottom:15px; padding:10px; border:1px solid #ccc;">
                    <strong>${n.date}</strong><br>
                    ${n.message}<br><br>

                    <strong>Sent to:</strong> ${n.employee}<br>

                    <strong style="color:green;">Acknowledged:</strong> 
                    ${acknowledged.length ? acknowledged.join(", ") : "None"}<br>

                    <strong style="color:red;">Not Acknowledged:</strong> 
                    ${!acknowledged.includes(n.employee) ? n.employee : "None"}
                </div>
            `;
        }
    });

    if (container.innerHTML === "") {
        container.innerHTML = "<p>No active notices.</p>";
    }
}

function displayNoticeHistory() {
    const container = document.getElementById("noticeHistory");
    if (!container) return;

    let notices = getNotices();

    container.innerHTML = "";

    notices.forEach((n) => {
        let acknowledged = n.acknowledgedBy || [];
        let isFullyAcknowledged = acknowledged.includes(n.employee);

        if (isFullyAcknowledged) {
            container.innerHTML += `
                <div style="margin-bottom:15px; padding:10px; border:1px solid #ccc;">
                    <strong>${n.date}</strong><br>
                    ${n.message}<br><br>

                    <strong>Sent to:</strong> ${n.employee}<br>

                    <strong style="color:green;">Acknowledged:</strong> 
                    ${acknowledged.join(", ")}
                </div>
            `;
        }
    });

    if (container.innerHTML === "") {
        container.innerHTML = "<p>No notice history.</p>";
    }
}

function showNoticeSection(section) {
    const active = document.getElementById("activeNoticeSection");
    const history = document.getElementById("historyNoticeSection");

    if (!active || !history) return;

    if (section === "active") {
        active.style.display = "block";
        history.style.display = "none";
    } else {
        active.style.display = "none";
        history.style.display = "block";
        displayNoticeHistory();
    }
}

// -------------------- DASHBOARD --------------------

function displayDashboardSummary() {
    let requests = getRequests();
    let notices = getNotices();
    let announcements = getAnnouncements();

    let pendingRequests = requests.filter(r => r.status === "Pending").length;
    let activeNotices = notices.filter(n => {
        let acknowledged = n.acknowledgedBy || [];
        return !acknowledged.includes(n.employee);
    }).length;
    let unreadAnnouncements = announcements.filter(a => !a.read).length;

    let pendingEl = document.getElementById("pendingRequestsCount");
    let noticesEl = document.getElementById("activeNoticesCount");
    let announcementsEl = document.getElementById("unreadAnnouncementsCount");

    if (pendingEl) pendingEl.innerText = pendingRequests;
    if (noticesEl) noticesEl.innerText = activeNotices;
    if (announcementsEl) announcementsEl.innerText = unreadAnnouncements;
}
function goToEmployee() {
    window.location.href = "index.html";
}

// -------------------- PAGE LOAD --------------------

window.onload = function () {
    let select = document.getElementById("userSelect");
    if (select) {
        select.value = currentUser;
    }

    displayRequests();
    displayRequestHistory();
    displayAnnouncements();
    displayNotices();
    displayNoticeTracking();
    displayNoticeHistory();
    displayMyRequests();
    toggleManagerButton();
    displayDashboardSummary();
};