let themes = [];
let currentIndex = 0;

async function loadThemes() {
    try {
        const response = await fetch('themes.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        themes = await response.json();
        if (themes.length > 0) {
            const hash = window.location.hash.substring(1);
            if (hash) {
                const targetIndex = themes.findIndex(t => slugify(t.name) === hash);
                if (targetIndex !== -1) {
                    currentIndex = targetIndex;
                }
            }
            renderTheme();
            preloadImages();
        }
    } catch (error) {
        console.error("Failed to load themes:", error);
        displayErrorMessage();
    }
}

function slugify(text) {
    return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

function updateURL() {
    const theme = themes[currentIndex];
    window.history.replaceState(null, null, `#${slugify(theme.name)}`);
}

function preloadImages() {
    themes.forEach(theme => {
        const img = new Image();
        img.src = theme.previewImage;
    });
}


let currentLayer = 1;
function renderTheme() {
    const theme = themes[currentIndex];
    const c = theme.colors;
    updateURL();

    const toRGB = (arr) => arr ? `rgb(${arr[0]}, ${arr[1]}, ${arr[2]})` : null;

    const setStyle = (selector, property, colorArray) => {
        const elements = document.querySelectorAll(selector);
        const color = toRGB(colorArray);

        if (color && elements.length > 0) {
            elements.forEach(el => {
                if (el.tagName.toLowerCase() === 'svg' && property === 'color') {
                    el.style.fill = color;
                } else {
                    el.style[property] = color;
                }
            });
        }
    };


    // Layer #1
    // Background Behind the Active Tab & Window Controls"
    setStyle('.tab-strip', 'backgroundColor', c.frame);

    // Background of the Omnibox
    setStyle('.url-input', 'backgroundColor', c.omnibox_background);

    // Layer #2
    // Background of the Omnibox Focused Tab
    setStyle('.tab.active', 'backgroundColor', c.toolbar);

    // The Framing Around the URL Bar
    setStyle('.url-bar-container', 'backgroundColor', c.toolbar);

    // Layer #3
    // Tab Text ("New Tab")
    setStyle('.tab-text', 'color', c.tab_text);

    // Close Tab Button (The "X")
    setStyle('.tab-close-svg', 'color', c.tab_text);

    // New Tab Button ( The "+")
    setStyle('.tab-new-svg', 'color', c.tab_text);

    // Window Controls (Minimize, Maximize, Close)
    setStyle('.window-controls-svg', 'color', c.caption_text || c.tab_text);

    // Navigation Controls (Backwards, Forwards, Refresh)
    setStyle('.nav-icon-svg', 'color', c.tab_text);

    // Search Provider Icon
    setStyle('.search-icon-svg', 'color', c.omnibox_text);

    // URL Input Text ("Search Google or type a URL")
    setStyle('.url-example-text', 'color', c.omnibox_text);

    // User Circle Icon
    setStyle('.user-circle-svg', 'color', c.tab_text);

    // Hamburger Menu Icon
    setStyle('.menu-icon-svg', 'color', c.tab_text);


    // Progress Bar
    const progressPercent = ((currentIndex + 1) / themes.length) * 100;
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${progressPercent}%`;
    progressBar.style.backgroundColor = toRGB(c.toolbar);

    const infoSide = document.querySelector('.info-side');
    infoSide.classList.add('text-hidden');

    const nextLayerNum = currentLayer === 1 ? 2 : 1;
    const currentTab = document.getElementById(`bg-${currentLayer}`);
    const nextTab = document.getElementById(`bg-${nextLayerNum}`);
    nextTab.style.backgroundImage = `url('${theme.previewImage}')`;
    nextTab.classList.remove('hidden');
    currentTab.classList.add('hidden');
    currentLayer = nextLayerNum;

    setTimeout(() => {
        document.getElementById('theme-name').innerText = theme.name;
        document.getElementById('theme-desc').innerText = theme.description;
        document.getElementById('theme-attr').innerText = theme.attribution;
        document.getElementById('theme-attr-link').href = theme.attrLink;
        document.getElementById('store-button').href = theme.storeLink;

        infoSide.classList.remove('text-hidden');
    }, 300);
}

function changeTheme(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = themes.length - 1;
    if (currentIndex >= themes.length) currentIndex = 0;
    renderTheme();
}

let isThrottled = false;
document.addEventListener('keydown', (e) => {
    if (isThrottled) return;
    const isNext = e.key === "ArrowRight" || e.key === "Enter";
    const isPrev = e.key === "ArrowLeft";
    if (isNext || isPrev) {
        changeTheme(isNext ? 1 : -1);
        isThrottled = true;
        setTimeout(() => {
            isThrottled = false;
        }, 800); 
    }
});

loadThemes();