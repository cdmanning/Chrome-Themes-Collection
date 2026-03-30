document.addEventListener('DOMContentLoaded', () => {
    fetch('./themes.json')
        .then(response => response.json())
        .then(data => {
            const grid = document.getElementById('theme-grid');
            data.forEach(theme => {
                const card = document.createElement('a');
                card.href = `./carousel/#${theme.slug}`;
                card.className = 'theme-card';
                card.innerHTML = `<img src="${theme.promo}" alt="${theme.name}">`;
                grid.appendChild(card);
            });
        });
});