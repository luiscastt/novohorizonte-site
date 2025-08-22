
document.addEventListener('DOMContentLoaded', () => {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const pageLinks = document.querySelectorAll('[data-page]');
    const mainNavLinks = document.querySelectorAll('#nav-menu .nav-link');
    const pages = document.querySelectorAll('.page');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    const showPage = (pageId) => {
        const targetId = pageId.endsWith('-page') ? pageId : pageId + '-page';

        pages.forEach(page => {
            page.classList.remove('active');
        });

        const pageToShow = document.getElementById(targetId);
        if (pageToShow) {
            pageToShow.classList.add('active');
        }

        mainNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageId) {
                link.classList.add('active');
            }
        });

        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }

        window.scrollTo(0, 0);
    };

    pageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.dataset.page;
            showPage(pageId);
        });
    });

    showPage('home');
});
