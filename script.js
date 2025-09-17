
document.addEventListener('DOMContentLoaded', () => {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const pageLinks = document.querySelectorAll('[data-page]');
    const mainNavLinks = document.querySelectorAll('#nav-menu .nav-link');
    const pages = document.querySelectorAll('.page');
    
    // Melhorar comportamento do menu mobile
    let isMenuOpen = false;

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            isMenuOpen = !isMenuOpen;
            
            // Alterar ícone do menu
            const icon = navToggle.querySelector('i');
            if (isMenuOpen) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            
            // Prevenir scroll quando menu está aberto
            document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
        });
    }
    
    // Fechar menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            isMenuOpen = false;
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isMenuOpen) {
            navMenu.classList.remove('active');
            isMenuOpen = false;
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = 'auto';
        }
    });

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
            isMenuOpen = false;
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = 'auto';
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
    
    // Melhorar experiência de toque em mobile
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
    
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
