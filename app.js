// PWA Registration & Notifications
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(reg => {
            // registered successfully 
        }).catch(err => {
            // registration failed silently
        });
    });
}

// Request Notification Permission on load
if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
}

// Data model for simulated YOLO CCTV tracking
let locations = [
    { id: 'gate-g8', name: 'Gate G8 (Queen\'s Road)', capacity: 150, currentPeople: 45 },
    { id: 'gate-g16', name: 'Gate G16 (Cubbon Road)', capacity: 100, currentPeople: 85 },
    { id: 'wash-a', name: 'Washroom (A Stand)', capacity: 40, currentPeople: 12 },
    { id: 'wash-pav', name: 'Washroom (Pavilion Terrace)', capacity: 40, currentPeople: 38 }
];

/**
 * Calculates the congestion status label based on current occupancy vs capacity.
 * @param {number} current - The current number of people.
 * @param {number} max - The maximum capacity of the area.
 * @returns {Object} The status object containing text and CSS class.
 */
function getStatus(current, max) {
    const ratio = current / max;
    if (ratio >= 0.85) return { text: 'FULL', class: 'red' };
    if (ratio >= 0.50) return { text: 'BUSY', class: 'yellow' };
    return { text: 'AVAILABLE', class: 'green' };
}

/**
 * Renders the latest JSON location data directly into the DOM.
 * Automatically updates both the Fan View and Management View feeds.
 */
function renderData() {
    const fanList = document.getElementById('fan-status-list');
    const mgmtGrid = document.getElementById('mgmt-feed-grid');
    
    if(!fanList || !mgmtGrid) return;

    fanList.innerHTML = '';
    mgmtGrid.innerHTML = '';

    locations.forEach(loc => {
        const status = getStatus(loc.currentPeople, loc.capacity);
        const percent = Math.min(Math.round((loc.currentPeople / loc.capacity) * 100), 100);

        fanList.innerHTML += `
            <div class="status-item">
                <div>
                    <strong>${loc.name}</strong>
                    <div style="font-size:0.8rem; color:var(--text-muted)">Live via YOLO AI</div>
                </div>
                <div class="status-indicator ${status.class}">${status.text}</div>
            </div>
        `;

        mgmtGrid.innerHTML += `
            <div class="feed-card ${status.class === 'red' ? 'danger' : ''}">
                <div style="font-size: 0.8rem; color: var(--accent-blue); margin-bottom: 5px;">
                    <i class="fa-solid fa-video"></i> CAM: ${loc.id.toUpperCase()}
                </div>
                <strong>${loc.name}</strong>
                <div style="margin-top: 5px; font-size:1.2rem; font-weight:800;">
                    <i class="fa-solid fa-users"></i> ${loc.currentPeople}
                </div>
                <div class="density-meter">
                    <div class="density-fill ${status.class}" style="width: ${percent}%; background-color: var(--${status.class === 'red' ? 'danger-red' : status.class === 'yellow' ? 'warning' : 'success'})"></div>
                </div>
            </div>
        `;
    });
}

setInterval(() => {
    locations.forEach(loc => {
        const change = Math.floor(Math.random() * 11) - 5; 
        loc.currentPeople = Math.max(0, loc.currentPeople + change);
    });
    renderData();
}, 3000);

renderData();

// View Toggling logic with Fade Animations
/**
 * Toggles the main UI view between the Fan dashboard and Management dashboard.
 * @param {string} role - The target role view ('fan' or 'management').
 */
function switchRole(role) {
    const fanView = document.getElementById('fan-view');
    const mgmtView = document.getElementById('mgmt-view');
    const fanBtn = document.getElementById('fan-btn');
    const mgmtBtn = document.getElementById('mgmt-btn');

    // Strip animations first
    fanView.classList.remove('anim-fade-in');
    mgmtView.classList.remove('anim-fade-in');

    if (role === 'fan') {
        fanView.classList.remove('view-hidden');
        // Small delay to trigger animation reflow
        setTimeout(() => fanView.classList.add('anim-fade-in'), 10);
        mgmtView.classList.add('view-hidden');
        
        fanBtn.classList.add('active');
        mgmtBtn.classList.remove('active');
    } else {
        fanView.classList.add('view-hidden');
        mgmtView.classList.remove('view-hidden');
        setTimeout(() => mgmtView.classList.add('anim-fade-in'), 10);
        
        fanBtn.classList.remove('active');
        mgmtBtn.classList.add('active');
    }
}

// SOS Logic
/**
 * Triggers a simulated SOS beacon from a fan's location.
 * Broadcasts the alert to the central management dashboard.
 */
function triggerSOS() {
    alert("SOS Beacon Activated! Switching to Management View to show exactly what security sees.");
    const userSeat = "A STAND, Row 12, Seat 45";
    const alertBox = document.getElementById('mgmt-alerts');
    alertBox.classList.remove('hidden');
    
    alertBox.innerHTML = `
        <div class="sos-banner">
            <div>
                <strong style="font-size:1.1rem;"><i class="fa-solid fa-truck-medical"></i> URGENT SOS DISPATCH</strong><br>
                Passenger Beacon located at: <strong>${userSeat}</strong>
            </div>
            <button class="btn btn-outline" style="width: auto; color: white; border-color: white;" onclick="this.parentElement.remove()">Resolve</button>
        </div>
    ` + alertBox.innerHTML;
    
    switchRole('management');
}

let currentFanAlert = "";
let fanAlertTimeout;

// Stampede Prevention / Mass Haptic Logic / Push Notifications / Wayfinding
/**
 * Initiates the Stampede Prevention Protocol.
 * Dispatches mass haptic feedback, native push notifications, and visual wayfinding.
 */
function triggerStampedeProtocol() {
    alert("Alert Dispatched to all Fan Apps!");
    
    // OS Push Notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
        try {
            if (navigator.serviceWorker) {
                navigator.serviceWorker.ready.then(reg => {
                    reg.showNotification("URGENT: StadiSync Alert", {
                        body: "Guided exit required. Open app for directions.",
                        icon: "icon.svg",
                        vibrate: [500, 200, 500]
                    });
                });
            } else {
                new Notification("URGENT: StadiSync Alert", {
                    body: "Guided exit required. Open app for directions.",
                    icon: "icon.svg"
                });
            }
        } catch (e) {
            // fallback notification failed
        }
    }

    const nearestExits = [
        { loc: "A STAND", gate: "Gate G6 (Queen's Road)" },
        { loc: "C UPPER STAND", gate: "Gate G16 (Cubbon Road)" },
        { loc: "M3 STAND", gate: "Gate G18 (Link Road)" },
        { loc: "PAVILION", gate: "Gate G1 (MG Road)" }
    ];
    
    const assigned = nearestExits[Math.floor(Math.random() * nearestExits.length)];
    
    const alertMessage = `Your beacon shows you are at <strong>${assigned.loc}</strong>. Please proceed to: <strong style="color:var(--warning)">${assigned.gate}</strong>.`;
    currentFanAlert = alertMessage;
    
    document.getElementById('fan-alert-text').innerHTML = `Please remain calm and follow your designated exit.<br><br>` + alertMessage;

    document.getElementById('wayfinder-compass').classList.remove('hidden');

    switchRole('fan');
    document.getElementById('fan-alert-modal').classList.remove('hidden');

    if (navigator.vibrate) {
        navigator.vibrate([500, 200, 500, 200, 1500]);
    }

    clearTimeout(fanAlertTimeout);
    fanAlertTimeout = setTimeout(() => {
        closeFanAlert();
    }, 12000); // Auto dismiss down to banner after 12 seconds
}

function closeFanAlert() {
    document.getElementById('fan-alert-modal').classList.add('hidden');
    document.getElementById('wayfinder-compass').classList.add('hidden');
    
    const alertsContainer = document.getElementById('fan-active-alerts');
    if(alertsContainer) {
        alertsContainer.classList.remove('hidden');
        alertsContainer.innerHTML = `
            <div class="report-banner anim-fade-in" style="background: rgba(245, 158, 11, 0.9); margin-bottom: 1.5rem;">
                <div>
                    <strong style="color: #000; font-size: 1.1rem;"><i class="fa-solid fa-circle-info"></i> Guided Exit Active</strong><br>
                    <span style="color: #000; font-size: 0.9rem;">${currentFanAlert.replace('color:var(--warning)', 'color:#000; text-decoration:underline; font-weight:800; font-size:1rem;')}</span>
                </div>
                <button class="btn btn-outline" style="width: auto; color: black; border-color: black; margin-left: 15px;" onclick="openFanAlert()">View</button>
            </div>
        `;
    }
}

function openFanAlert() {
    document.getElementById('fan-alert-modal').classList.remove('hidden');
    document.getElementById('wayfinder-compass').classList.remove('hidden');
    clearTimeout(fanAlertTimeout); // Prevent it from auto-hiding immediately if opened manually
}

// Map Logic & Panzoom integration
let pz;
function openMap() {
    document.getElementById('map-modal').classList.remove('hidden');
    if (!pz && window.Panzoom) {
        const elem = document.getElementById('panzoom-img');
        pz = Panzoom(elem, {
            maxScale: 6,
            minScale: 1
        });
        elem.parentElement.addEventListener('wheel', pz.zoomWithWheel);
    }
}

function closeMap() {
    document.getElementById('map-modal').classList.add('hidden');
}

// Fan Reporting Logic
function openReport() {
    document.getElementById('report-modal').classList.remove('hidden');
}

function closeReport() {
    document.getElementById('report-modal').classList.add('hidden');
}

function submitReport() {
    const text = document.getElementById('report-text').value;
    if (!text.trim()) {
        alert("Please describe the issue.");
        return;
    }
    
    closeReport();
    alert("Report submitted successfully! Switching to Management view to demo reception.");
    
    const alertBox = document.getElementById('mgmt-alerts');
    alertBox.classList.remove('hidden');
    
    const safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    alertBox.innerHTML = `
        <div class="report-banner anim-fade-in">
            <div>
                <strong style="font-size:1.1rem;"><i class="fa-solid fa-bullhorn"></i> FAN REPORT</strong><br>
                ${safeText}
            </div>
            <button class="btn btn-outline" style="width: auto; color: black; border-color: black;" onclick="this.parentElement.remove()">Acknowledge</button>
        </div>
    ` + alertBox.innerHTML;
    
    document.getElementById('report-text').value = '';
    
    // Auto switch to management view so user sees the report received
    setTimeout(() => switchRole('management'), 1000);
}
