const apiKeys = [
    "2172e857da16c9a81f98e28db160f7e4",
    "2059275dc97121229c45f10bad9171fd",
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

const urlParams = new URLSearchParams(window.location.search);
const matchId = urlParams.get("id");

if (!matchId) {
    document.getElementById("match-details").innerHTML = "<p>❌ لم يتم العثور على المباراة</p>";
} else {
    fetchMatchDetails();
}

function fetchMatchDetails(retry = true) {
    const url = `https://v3.football.api-sports.io/fixtures?id=${matchId}`;

    fetch(url, {
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
        if (!data.response || data.response.length === 0) {
            document.getElementById("match-details").innerHTML = "<p>🚀 لا توجد بيانات متاحة للمباراة</p>";
            return;
        }

        const match = data.response[0];
        document.getElementById("match-details").innerHTML = `
            <section class="match-card">
                <div class="league">
                    <p class="l-n">🏆 ${match.league.name}</p>
                    <img style="width: 60px;height: 30px;" class="l-n" src="${match.league.logo}" alt="${match.league.name} Logo">
                </div>
                <div class="team">
                    <img src="${match.teams.home.logo}" alt="${match.teams.home.name}" class="team-logo">
                    <span>${match.teams.home.name}</span>
                </div>
                
                <div class="match-info">
                    <p class="result">⚽ ${match.goals.home ?? 0} - ${match.goals.away ?? 0}</p>
                    <p class="time">⏱ ${match.fixture.status.long}</p>
                </div>
                
                <div class="team">
                    <span>${match.teams.away.name}</span>
                    <img src="${match.teams.away.logo}" alt="${match.teams.away.name}" class="team-logo">
                </div>
            </section>

            <section>
                <h2>⚽ Facts</h2>
                <div class="events-container" id="events-container"></div>
            </section>
        `;

        fetchMatchStats();
        fetchMatchLineups();
        fetchMatchEvents();
    })
    .catch(error => {
        console.error("❌ Error", error);
        if (retry) {
            console.log("🔄 Retrying with a new API key...");
            switchApiKey();
            fetchMatchDetails(false);
        } else {
            document.getElementById("match-details").innerHTML = "<p>❌ فشل في جلب البيانات</p>";
        }
    });
}

function fetchMatchStats() {
    fetch(`https://v3.football.api-sports.io/fixtures/statistics?fixture=${matchId}`, {
        method: "GET",
        headers: { "x-apisports-key": getApiKey() },
    })
    .then(response => response.json())
    .then(data => {
        const statsContainer = document.getElementById("stats-container");
        statsContainer.innerHTML = data.response.map(stat => `
            <p>⚡ ${stat.type}: ${stat.value}</p>
        `).join("");
    })
    .catch(error => console.error("❌ Error fetching stats:", error));
}

function fetchMatchLineups() {
    fetch(`https://v3.football.api-sports.io/fixtures/lineups?fixture=${matchId}`, {
        method: "GET",
        headers: { "x-apisports-key": getApiKey() },
    })
    .then(response => response.json())
    .then(data => {
        const lineupsContainer = document.getElementById("lineups-container");
        if (data.response.length === 0) {
            lineupsContainer.innerHTML = "<p>🚀 لا توجد بيانات التشكيلة</p>";
            return;
        }

        data.response.forEach(lineup => {
            lineupsContainer.innerHTML += `
                <h3>📋 ${lineup.team.name}</h3>
                <p>💼 المدرب: ${lineup.coach.name}</p>
                <p>🏟️ التشكيلة: ${lineup.formation}</p>
            `;
        });
    })
    .catch(error => console.error("❌ Error fetching lineups:", error));
}

function fetchMatchEvents() {
    fetch(`https://v3.football.api-sports.io/fixtures/events?fixture=${matchId}`, {
        method: "GET",
        headers: { "x-apisports-key": getApiKey() },
    })
    .then(response => response.json())
    .then(data => {
        const eventsContainer = document.getElementById("events-container");
        eventsContainer.innerHTML = data.response.map(event => `
            <p>⏱ ${event.time.elapsed}' - ${event.team.name}: ${event.player.name} (${event.type})</p>
        `).join("");
    })
    .catch(error => console.error("❌ Error fetching events:", error));
}
