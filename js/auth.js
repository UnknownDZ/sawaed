(function() {
    const currentUser = localStorage.getItem('currentUser');
    const authDiv = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userNameSpan = document.getElementById('userName');

    if (currentUser) {
        const user = JSON.parse(currentUser);
        if (authDiv) authDiv.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (userNameSpan) userNameSpan.textContent = user.name;
    } else {
        if (authDiv) authDiv.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
    }
})();