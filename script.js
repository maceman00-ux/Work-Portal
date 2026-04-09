let currentUser = "Austin";
let employees = ["Austin", "Employee1", "Employee2"];

function getRequests() {
    return JSON.parse(localStorage.getItem("requests")) || [];
}

function saveRequests(requests) {
    localStorage.setItem("requests", JSON.stringify(requests));
}

function requestTimeOff() {
    let requests = getRequests();

    let request = {
        name: currentUser,
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
            <div style="margin-bottom:10px; padding:10px; border:1px solid #ccc;">
                ${req.name} - ${req.status}
                <br>
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
}

function markAsRead(index) {
    let announcements = getAnnouncements();
    announcements[index].read = true;
    saveAnnouncements(announcements);
    displayAnnouncements();
}

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
}

function displayNoticeTracking() {
    const container = document.getElementById("noticeTracking");
    if (!container) return;

    let notices = getNotices();

    container.innerHTML = "";

   notices.forEach((n) => {

  let acknowledged = n.acknowledgedBy || [];

  let notAcknowledged = employees.filter(emp => 
    emp === n.employee && !acknowledged.includes(emp)
  );

  container.innerHTML += `
    <div style="margin-bottom:15px; padding:10px; border:1px solid #ccc;">
      <strong>${n.date}</strong><br>
      ${n.message}<br><br>

      <strong>Sent to:</strong> ${n.employee}<br>

      <strong style="color:green;">Acknowledged:</strong> 
      ${acknowledged.length ? acknowledged.join(", ") : "None"}<br>

      <strong style="color:red;">Not Acknowledged:</strong> 
      ${notAcknowledged.length ? notAcknowledged.join(", ") : "None"}
    </div>
  `;
});
}


window.onload = function () {
    displayRequests();
    displayAnnouncements();
    displayNotices();
    displayNoticeTracking();
};
