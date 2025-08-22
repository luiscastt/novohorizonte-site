// Menu hambúrguer
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Animações de scroll
const elements = document.querySelectorAll("section, .card");

window.addEventListener("scroll", () => {
    elements.forEach(el => {
        const position = el.getBoundingClientRect().top;
        const screenHeight = window.innerHeight / 1.2;
        if (position < screenHeight) {
            el.classList.add("visible");
        }
    });
});
