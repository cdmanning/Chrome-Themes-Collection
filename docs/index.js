document.addEventListener('DOMContentLoaded', () => {
    fetch('./themes.json')
        .then(response => response.json())
        .then(data => {
            const grid = document.getElementById('theme-grid');
            data.forEach(theme => {
                const card = document.createElement('a');
                card.href = `./carousel/#${theme.slug}`;
                card.className = 'theme-card';
                const cardColor = theme.colors.toolbar;
                card.style.borderColor = `rgba(${cardColor[0]}, ${cardColor[1]}, ${cardColor[2]}, 0.5)`;
                card.innerHTML = `<img src="${theme.promo}" alt="${theme.name}">`;
                grid.appendChild(card);
            });
        });
});