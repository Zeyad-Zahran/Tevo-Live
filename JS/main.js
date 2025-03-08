const apiKey = "7746eaf28b7753de9e933a99189e036a"; // ضع مفتاح API هنا
const matchesUrl = "https://v3.football.api-sports.io/fixtures?live=all"; // API لجلب المباريات الحية

function filterMatches() {
    let searchValue = document.getElementById("search-box").value.toLowerCase();
    let matches = document.querySelectorAll(".match");

    matches.forEach(match => {
        let text = match.textContent.toLowerCase();
        match.style.display = text.includes(searchValue) ? "block" : "none";
    });
}

function fetchLiveMatches() {
    fetch(matchesUrl, {
        method: "GET",
        headers: {
            "x-apisports-key": apiKey,
        },
    })
    .then(response => response.json())
    .then(data => {
        const matchesContainer = document.getElementById("live-matches");
        matchesContainer.innerHTML = ""; // مسح المحتوى القديم

        if (data.response.length === 0) {
            matchesContainer.innerHTML = "<p>🚀 No Live Matches Now</p>";
            return;
        }

        data.response.forEach(match => {
            const matchElement = document.createElement("div");
            matchElement.classList.add("match");

            matchElement.innerHTML = `
            <section>
                <h3 id="team">${match.teams.home.name} 🆚 ${match.teams.away.name}</h3>
                <p id="Time"> ${match.fixture.status.elapsed}'</p>
                <p id="result"> ${match.goals.home ?? 0} - ${match.goals.away ?? 0}</p>
            </section>
            `;

            matchesContainer.appendChild(matchElement);
        });
    })
    .catch(error => {
        console.error("ُError", error);
        document.getElementById("live-matches").innerHTML = "<p>❌Make sure you are connected</p>";
    });
}

// جلب البيانات عند فتح الصفحة
fetchLiveMatches();

// تحديث البيانات كل دقيقة
setInterval(fetchLiveMatches, 60000);