// Load games from JSON
let allGames = [];

fetch('games.json')
    .then(response => response.json())
    .then(data => {
        allGames = data.games;
        displayGames(allGames);
    })
    .catch(error => console.error('Error loading games:', error));

// Display games
function displayGames(games) {
    const gamesGrid = document.getElementById('gamesGrid');
    gamesGrid.innerHTML = '';

    if (games.length === 0) {
        gamesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: white; padding: 40px;">No games found</p>';
        return;
    }

    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <div class="game-card-image">${game.emoji}</div>
            <div class="game-card-info">
                <h3>${game.title}</h3>
                <p>${game.category}</p>
            </div>
        `;
        gameCard.addEventListener('click', () => openGame(game));
        gamesGrid.appendChild(gameCard);
    });
}

// Open game in modal
function openGame(game) {
    const modal = document.getElementById('gameModal');
    const gameFrame = document.getElementById('gameFrame');
    const gameTitle = document.getElementById('gameTitle');

    gameTitle.textContent = game.title;
    gameFrame.src = game.url;
    modal.style.display = 'block';
}

// Close modal
const modal = document.getElementById('gameModal');
const closeBtn = document.querySelector('.close');

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.getElementById('gameFrame').src = '';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        document.getElementById('gameFrame').src = '';
    }
});

// Search functionality
document.getElementById('searchInput').addEventListener('keyup', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allGames.filter(game =>
        game.title.toLowerCase().includes(searchTerm) ||
        game.category.toLowerCase().includes(searchTerm)
    );
    displayGames(filtered);
});
