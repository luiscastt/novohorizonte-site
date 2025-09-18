
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

// ===== FUNCIONALIDADES DA PÁGINA DE VAGAS =====

// Filtros de categoria
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const vagaCards = document.querySelectorAll('.vaga-card');
    
    // Função para filtrar vagas
    function filtrarVagas(categoria) {
        vagaCards.forEach(card => {
            if (categoria === 'todas' || card.dataset.category === categoria) {
                card.classList.remove('hidden');
                // Animação de entrada
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.classList.add('hidden');
            }
        });
    }
    
    // Event listeners para os filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Adicionar classe active ao botão clicado
            button.classList.add('active');
            // Filtrar vagas
            const categoria = button.dataset.category;
            filtrarVagas(categoria);
        });
    });
});

// ===== MODAL DE CANDIDATURA =====

// Função para abrir o modal de candidatura
function abrirFormularioCandidatura(nomeVaga) {
    const modal = document.getElementById('candidatura-modal');
    const tituloVaga = document.getElementById('vaga-titulo');
    
    tituloVaga.textContent = nomeVaga;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Limpar formulário
    document.getElementById('candidatura-form').reset();
}

// Função para fechar o modal
function fecharModalCandidatura() {
    const modal = document.getElementById('candidatura-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event listeners para o modal
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('candidatura-modal');
    const closeBtn = document.querySelector('.candidatura-close');
    const form = document.getElementById('candidatura-form');
    
    // Fechar modal ao clicar no X
    if (closeBtn) {
        closeBtn.addEventListener('click', fecharModalCandidatura);
    }
    
    // Fechar modal ao clicar fora dele
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                fecharModalCandidatura();
            }
        });
    }
    
    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            fecharModalCandidatura();
        }
    });
    
    // Submissão do formulário
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            enviarCandidatura();
        });
    }
});

// Função para enviar candidatura
function enviarCandidatura() {
    const form = document.getElementById('candidatura-form');
    const formData = new FormData(form);
    const vaga = document.getElementById('vaga-titulo').textContent;
    
    // Validar campos obrigatórios
    const camposObrigatorios = ['nome', 'email', 'telefone', 'experiencia'];
    let todosPreenchidos = true;
    
    camposObrigatorios.forEach(campo => {
        const input = form.querySelector(`[name="${campo}"]`);
        if (!input.value.trim()) {
            input.style.borderColor = '#e74c3c';
            todosPreenchidos = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    // Verificar checkbox de termos
    const aceitoTermos = document.getElementById('aceito-termos');
    if (!aceitoTermos.checked) {
        alert('Você deve aceitar os termos de uso para continuar.');
        return;
    }
    
    if (!todosPreenchidos) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Simular envio (aqui você integraria com seu backend)
    const submitBtn = document.querySelector('.candidatura-submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Simular delay de envio
    setTimeout(() => {
        alert(`Candidatura para ${vaga} enviada com sucesso! Entraremos em contato em breve.`);
        fecharModalCandidatura();
        
        // Restaurar botão
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Aqui você enviaria os dados para seu servidor
        console.log('Dados da candidatura:', {
            vaga: vaga,
            dados: Object.fromEntries(formData)
        });
    }, 2000);
}

// Máscara para telefone
document.addEventListener('DOMContentLoaded', () => {
    const telefoneInput = document.getElementById('telefone');
    
    if (telefoneInput) {
        telefoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });
    }
});

// Animações de scroll para a página de vagas
document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer para animações
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar cards de vaga
    const vagaCards = document.querySelectorAll('.vaga-card');
    vagaCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
    
    // Observar benefícios
    const beneficioItems = document.querySelectorAll('.beneficio-item');
    beneficioItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `all 0.4s ease ${index * 0.1}s`;
        observer.observe(item);
    });
});
