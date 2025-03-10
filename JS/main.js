
const apiKey = "7746eaf28b7753de9e933a99189e036a"; // ضع مفتاح API هنا
const matchesUrl = "https://v3.football.api-sports.io/fixtures?live=all"; // API لجلب المباريات الحية
//const apiKey = "1125921903e70b518893cd14bbc62d51"; // استبدل بمفتاحك الحقيقي
//const matchesUrl = "https://v3.football.api-sports.io/fixtures?live=all"; 


function filterMatches() {
    let searchValue = document.getElementById("search-box").value.toLowerCase();
    let matches = document.querySelectorAll(".match");

    matches.forEach(match => {
        let text = match.textContent.toLowerCase();
        match.style.display = text.includes(searchValue) ? "flex" : "none";
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
            <section class="match-card">
                <div class="team">
                    <img src="${match.teams.home.logo}" alt="${match.teams.home.name} Logo" class="team-logo">
                    <span>${match.teams.home.name}</span>
                </div>
                
                <div class="match-info">
                    <p class="result">⚽ ${match.goals.home ?? 0} - ${match.goals.away ?? 0}</p>
                    <p class="time">⏱ ${match.fixture.status.elapsed}<span class="small-quote">'</span></p>
                </div>
                
                <div class="team">
                    <span>${match.teams.away.name}</span>
                    <img src="${match.teams.away.logo}" alt="${match.teams.away.name} Logo" class="team-logo">
                </div>
            </section>
            `;

            matchesContainer.appendChild(matchElement);
        });
    })
    .catch(error => {
        console.error("❌ Error", error);
        document.getElementById("live-matches").innerHTML = "<p>❌ Make sure you are connected</p>";
    });
}

// جلب البيانات عند فتح الصفحة
fetchLiveMatches();

// تحديث البيانات كل دقيقة
setInterval(fetchLiveMatches, 60000);


