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
    if (message === "") return;

    let announcements = getAnnouncements();

    announcements.unshift({
        message: message,
        date: new Date().toLocaleString(),
        read: false
    });

    saveAnnouncements(announcements);
    input.value = "";

    alert("Announcement posted!");
}

function markAsRead(index) {
    let announcements = getAnnouncements();
    announcements[index].read = true;
    saveAnnouncements(announcements);
    displayAnnouncements();
}

window.onload = function () {
    displayRequests();
    displayAnnouncements();
    displayNotices();
};

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

  notices.forEach((n, index) => {
    list.innerHTML += `
      <div class="notice">
        <strong>${n.date}</strong><br>
        ${n.message}
        <br><br>
        ${
          n.acknowledged
            ? "<strong style='color:green;'>Acknowledged</strong>"
            : `<label>
                <input type="checkbox" onchange="acknowledgeNotice(${index})">
                I confirm that I have read, understand, and acknowledge this notice.
              </label>`
        }
      </div>
    `;
  });
}

function acknowledgeNotice(index) {
  let notices = getNotices();
  notices[index].acknowledged = true;
  saveNotices(notices);
  displayNotices();
}
function sendNotice() {
  const input = document.getElementById("noticeInput");
  if (!input) return;

  const message = input.value.trim();
  if (message === "") return;

  let notices = getNotices();

  notices.unshift({
    message: message,
    date: new Date().toLocaleString(),
    acknowledged: false
  });

  saveNotices(notices);
  input.value = "";

  alert("Required notice sent!");
}