const apiKeys = [
    "2059275dc97121229c45f10bad9171fd",
    "2172e857da16c9a81f98e28db160f7e4",
    "3685406a217fbad1bc070bc189fa5e87",
    "8a6a9e518bd9a1a22cd36c1abccc693f",
    "a60d8104f1f6ec2278591f3f0ea32682"
];
let currentKeyIndex = 0;

function getApiKey() {
    return apiKeys[currentKeyIndex];
}

function switchApiKey() {
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
    console.log(`🔄 Switched to API Key: ${getApiKey()}`);
}

function filterMatches() {
    let searchValue = document.getElementById("search-box").value.toLowerCase();
    let matches = document.querySelectorAll(".match");

    matches.forEach(match => {
        let text = match.textContent.toLowerCase();
        match.style.display = text.includes(searchValue) ? "flex" : "none";
    });
}

function fetchLiveMatches(retry = true) {
    const matchesUrl = `https://v3.football.api-sports.io/fixtures?live=all`;
    
    fetch(matchesUrl, {
        method: "GET",
        headers: {
            "x-apisports-key": getApiKey(),
        },
    })
    .then(response => {
        if (!response.ok) throw new Error(`API request failed: ${response.status}`);
        return response.json();
    })
    .then(data => {
        const matchesContainer = document.getElementById("live-matches");
        matchesContainer.innerHTML = "";

        if (!data.response || data.response.length === 0) {
            matchesContainer.innerHTML = "<p>🚀 No Live Matches Now</p>";
            return;
        }

        data.response.forEach(match => {
            const matchElement = document.createElement("div");
            matchElement.classList.add("match");
            matchElement.innerHTML = `
            <section class="match-card">
                <div class="league">
                    <p class="l-n">🏆 ${match.league.name}</p>
                    <img class="i-l-n" src="${match.league.logo}" alt="${match.league.name} Logo" class="league-logo">
                </div>
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
        if (retry) {
            console.log("🔄 Retrying with a new API key...");
            switchApiKey();
            fetchLiveMatches(false);
        } else {
            document.getElementById("live-matches").innerHTML = "<p>❌ Make sure you are connected</p>";
        }
    });
}

// جلب البيانات عند فتح الصفحة
fetchLiveMatches();
