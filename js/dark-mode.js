(function() {
    const toggle = document.getElementById('darkModeToggle');
    const body = document.body;

    const savedMode = localStorage.getItem('theme');
    if (savedMode === 'dark') {
        body.classList.add('dark-mode');
        if (toggle) toggle.textContent = '☀️';
    } else {
        body.classList.remove('dark-mode');
        if (toggle) toggle.textContent = '🌙';
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            toggle.textContent = isDark ? '☀️' : '🌙';
        });
    }
})();