let allGames = [];

fetch('games.json')
.then(res => res.json())
.then(data => {
allGames = data.games;
loadCategories();
displayGames(allGames);
});

function loadCategories() {
const catSelect = document.getElementById('category');
const categories = ["All", ...new Set(allGames.map(g => g.category))];

categories.forEach(cat => {
const option = document.createElement('option');
option.value = cat;
option.textContent = cat;
catSelect.appendChild(option);
});
}

function displayGames(games) {
const container = document.getElementById('games');
container.innerHTML = "";

games.forEach(game => {
const div = document.createElement('div');
div.className = "game";

```
const btn = document.createElement('button');
btn.innerText = game.emoji + " " + game.title;

btn.onclick = () => {
  window.open(game.url, "_blank");
};

div.appendChild(btn);
container.appendChild(div);
```

});
}

document.getElementById('search').addEventListener('input', filterGames);
document.getElementById('category').addEventListener('change', filterGames);

function filterGames() {
const search = document.getElementById('search').value.toLowerCase();
const category = document.getElementById('category').value;

const filtered = allGames.filter(game => {
return (
game.title.toLowerCase().includes(search) &&
(category === "All" || game.category === category)
);
});

displayGames(filtered);
}
