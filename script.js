let currentStudent = {}, timerInterval, timeLeft, violations = 0, quizActive = false;
const questions = Array.from({ length: 10 }, (_, i) => ({ q: `Question ${i + 1}`, a: ["Option A", "Option B", "Option C"], c: 1 }));

// Elements
const studentLoginDiv = document.getElementById("studentLogin");
const adminLoginDiv = document.getElementById("adminLogin");

// Switch logins
document.getElementById("showAdminBtn").onclick = () => {
    studentLoginDiv.style.display = "none";
    adminLoginDiv.style.display = "block";
};
document.getElementById("showStudentBtn").onclick = () => {
    adminLoginDiv.style.display = "none";
    studentLoginDiv.style.display = "block";
};

// Student login
document.getElementById("studentLoginBtn").onclick = () => {
    const name = document.getElementById("studentName").value.trim();
    const adm = document.getElementById("admission").value.trim();
    const cls = document.getElementById("studentClass").value;
    const pass = document.getElementById("studentPassword").value;
    if (!name || !adm || !cls || pass !== "mary") return alert("Fill all details correctly. Password = mary");
    currentStudent = { name, adm, cls };
    studentLoginDiv.style.display = "none";
    document.getElementById("navbar").style.display = "flex";
    showSection('subjects');
    enableSecurity();
};

// Admin login
document.getElementById("adminLoginBtn").onclick = () => {
    const pass = document.getElementById("adminPassword").value.trim();
    if (pass !== "headteacher") return alert("Password must be 'headteacher'");
    adminLoginDiv.style.display = "none";
    document.getElementById("navbar").style.display = "flex";
    showSection('adminPanel');
    loadAdmin();
};

function showSection(id) {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function startQuiz() {
    quizActive = true;
    const sub = document.getElementById("subject").value;
    document.getElementById("quizTitle").innerText = sub + " Assessment";
    const form = document.getElementById("quizForm");
    form.innerHTML = "";
    questions.forEach((q, i) => {
        form.innerHTML += `<p><strong>${q.q}</strong><br>
        <input type="radio" name="q${i}" value="0">${q.a[0]}<br>
        <input type="radio" name="q${i}" value="1">${q.a[1]}<br>
        <input type="radio" name="q${i}" value="2">${q.a[2]}</p>`;
    });
    setTimer(sub === "Mathematics" ? 30 : 20);
    showSection('quiz');
}

function setTimer(mins) {
    clearInterval(timerInterval);
    timeLeft = mins * 60;
    updateTimer();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) { clearInterval(timerInterval); alert("Time up! Submitting..."); submitQuiz(); }
    }, 1000);
}

function updateTimer() {
    const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
    document.getElementById("timer").innerText = `Time Left: ${m}:${s.toString().padStart(2, "0")}`;
}

function submitQuiz() {
    quizActive = false;
    clearInterval(timerInterval);
    let score = 0;
    questions.forEach((q, i) => {
        const ans = document.querySelector(`input[name="q${i}"]:checked`);
        if (ans && ans.value == q.c) score++;
    });
    let data = JSON.parse(localStorage.getItem("results") || "[]");
    data.push({ name: currentStudent.name, adm: currentStudent.adm, cls: currentStudent.cls, subject: document.getElementById("subject").value, score, time: new Date().toLocaleString() });
    localStorage.setItem("results", JSON.stringify(data));
    alert(`Submitted! Score: ${score}/10`);
    showSection('subjects');
    loadAdmin();
}

function loadAdmin() {
    const data = JSON.parse(localStorage.getItem("results") || "[]");
    const table = document.getElementById("adminTable");
    table.innerHTML = "";
    if (data.length === 0) { table.innerHTML = "<tr><td colspan='7'>No student submissions yet.</td></tr>"; return; }
    data.forEach((d, i) => {
        table.innerHTML += `<tr>
        <td>${d.name}</td><td>${d.adm}</td><td>${d.cls}</td><td>${d.subject}</td>
        <td>${d.score}</td><td>${d.time}</td>
        <td><button onclick="restart('${d.name}','${d.adm}','${d.cls}',${i})">Restart</button></td>
        </tr>`;
    });
}

function restart(name, adm, cls, index) {
    let data = JSON.parse(localStorage.getItem("results") || "[]");
    data.splice(index, 1);
    localStorage.setItem("results", JSON.stringify(data));
    loadAdmin();
}

function enableSecurity() {
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('copy', e => e.preventDefault());
    document.addEventListener('paste', e => e.preventDefault());
    window.addEventListener('blur', () => {
        if (quizActive) { alert("Do not leave assessment!"); submitQuiz(); }
    });
}

function logout() {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById("navbar").style.display = "none";
    studentLoginDiv.style.display = "block";
}