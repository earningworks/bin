document.addEventListener('DOMContentLoaded', () => {
    // 1. Search Logic - Optimized with direct memory access
    const searchToggle = document.getElementById('searchToggle');
    const searchContainer = document.getElementById('searchContainer');
    const searchInput = document.getElementById('searchInput');
    let movieCards = []; // Cache list

    searchToggle.addEventListener('click', () => {
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
            searchInput.focus();
            // Refresh cache when search is opened
            movieCards = Array.from(document.querySelectorAll('.movie-card'));
        }
    });

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const term = e.target.value.toLowerCase().trim();
            if (movieCards.length === 0) movieCards = Array.from(document.querySelectorAll('.movie-card'));

            movieCards.forEach(card => {
                const title = card.getAttribute('data-title').toLowerCase();
                const serial = card.getAttribute('data-serial') || "";

                const matches = title.includes(term) || serial === term || serial.startsWith(term);
                card.style.display = matches ? 'flex' : 'none';
            });
        }, 10); // Ultra-fast debounce
    });

    // 2. Serial Numbering (Bottom to Top)
    initSerialNumbers();
});

function initSerialNumbers() {
    const movieCards = document.querySelectorAll('.movie-card');
    const total = movieCards.length;
    movieCards.forEach((card, index) => {
        const serialNum = total - index;
        const nameElement = card.querySelector('.movie-name');
        if (nameElement && !nameElement.querySelector('.serial-num')) {
            const span = document.createElement('span');
            span.className = 'serial-num';
            span.innerText = `${serialNum}. `;
            nameElement.prepend(span);
            // Also store it on the card for faster search logic
            card.setAttribute('data-serial', serialNum);
        }
    });
}

// 2. Share Functionality
function shareMovie(movieName) {
    const shareUrl = window.location.origin + window.location.pathname;
    const shareText = `Download ${movieName} on U-BOMMA!`;

    if (navigator.share) {
        navigator.share({
            title: 'U-BOMMA',
            text: shareText,
            url: shareUrl,
        }).catch(err => console.log('Error sharing:', err));
    } else {
        const tempInput = document.createElement('input');
        tempInput.value = shareUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        showToast('Link copied to clipboard!');
    }
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}
