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

    // Tornar showPage disponível globalmente
    window.showPage = showPage;

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

// Dropdown de vagas no menu (simplificado)
document.addEventListener('DOMContentLoaded', () => {
    // Dropdown removido - "Trabalhe Conosco" agora é um link direto para vagas
    console.log('Menu "Trabalhe Conosco" configurado como link direto');
});

// Filtros de categoria
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const vagaCards = document.querySelectorAll('.vaga-card');
    
    // Função para filtrar vagas
    window.filtrarVagas = function(categoria) {
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
    };
    
    // Event listeners para os filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Adicionar classe active ao botão clicado
            button.classList.add('active');
            // Filtrar vagas
            const categoria = button.dataset.category;
            if (typeof window.filtrarVagas === 'function') {
                window.filtrarVagas(categoria);
            }
        });
    });
});

// Formulário de contato modernizado
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const contactFormPage = document.getElementById('contact-form-page');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await enviarFormularioContato(contactForm);
        });
    }
    
    if (contactFormPage) {
        contactFormPage.addEventListener('submit', async (e) => {
            e.preventDefault();
            await enviarFormularioContato(contactFormPage);
        });
    }
});

async function enviarFormularioContato(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validação básica
    if (!data.name || !data.email || !data.message) {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Mostrar loading
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;
    
    try {
        // Simular envio de email
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Aqui você integraria com um serviço de email como EmailJS ou backend
        console.log('Dados do formulário:', data);
        console.log('Enviando para: josean.castilho@novohorizonteconservadora.com.br');
        
        showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        form.reset();
        
    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
    } finally {
        // Restaurar botão
        btnText.style.display = 'inline-flex';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

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
    
    // Resetar upload de arquivo
    const filePreview = document.getElementById('file-preview');
    const uploadArea = document.querySelector('#candidatura-modal .upload-area');
    if (filePreview) filePreview.style.display = 'none';
    if (uploadArea) uploadArea.style.display = 'block';
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
    const closeBtn = document.getElementById('candidatura-close');
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
    
    // Upload de currículo
    const curriculoUpload = document.getElementById('curriculo-upload');
    const filePreview = document.getElementById('file-preview');
    const fileName = document.getElementById('file-name');
    const removeFile = document.getElementById('remove-file');
    
    if (curriculoUpload) {
        curriculoUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.type === 'application/pdf') {
                    fileName.textContent = file.name;
                    filePreview.style.display = 'flex';
                    document.querySelector('#candidatura-modal .upload-area').style.display = 'none';
                } else {
                    showNotification('Por favor, selecione um arquivo PDF.', 'error');
                    e.target.value = '';
                }
            }
        });
    }
    
    if (removeFile) {
        removeFile.addEventListener('click', () => {
            curriculoUpload.value = '';
            filePreview.style.display = 'none';
            document.querySelector('#candidatura-modal .upload-area').style.display = 'block';
        });
    }
});

// Função para enviar candidatura
async function enviarCandidatura() {
    const form = document.getElementById('candidatura-form');
    const formData = new FormData(form);
    const vaga = document.getElementById('vaga-titulo').textContent.trim();
    const curriculoFile = document.getElementById('curriculo-upload').files[0];
    
    // Validar campos obrigatórios
    const camposObrigatorios = ['nome', 'email', 'telefone', 'experiencia'];
    let todosPreenchidos = true;
    
    camposObrigatorios.forEach(campo => {
        const input = form.querySelector(`[name="${campo}"]`);
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            todosPreenchidos = false;
        } else {
            input.style.borderColor = '#e5e7eb';
        }
    });
    
    // Verificar checkbox de termos
    const aceitoTermos = document.getElementById('aceito-termos');
    if (!aceitoTermos.checked) {
        showNotification('Você deve aceitar os termos de uso para continuar.', 'error');
        return;
    }
    
    if (!todosPreenchidos) {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }
    
    // Simular envio
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Mostrar loading
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;
    
    try {
        // Simular envio
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Preparar dados para envio
        const candidaturaData = {
            vaga: vaga,
            dados: Object.fromEntries(formData),
            curriculo: curriculoFile ? curriculoFile.name : null,
            dataEnvio: new Date().toISOString()
        };
        
        console.log('Dados da candidatura:', candidaturaData);
        console.log('Enviando para: rh@novohorizonteconservadora.com.br');
        
        // Salvar candidatura no perfil do usuário (se logado)
        if (window.userManager && window.userManager.isLoggedIn()) {
            window.userManager.addApplication({
                position: vaga,
                location: 'Serra - ES',
                type: 'CLT',
                notes: candidaturaData.dados.observacoes || ''
            });
        }
        
        // Mostrar mensagem de sucesso
        showNotification(`Candidatura para ${vaga} enviada com sucesso! Entraremos em contato em breve.`, 'success');
        fecharModalCandidatura();
        
    } catch (error) {
        console.error('Erro ao enviar candidatura:', error);
        showNotification('Erro ao enviar candidatura. Tente novamente.', 'error');
    } finally {
        // Restaurar botão
        btnText.style.display = 'inline-flex';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Função universal para mostrar notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#06b6d4'};
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 4 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Máscara para telefone
document.addEventListener('DOMContentLoaded', () => {
    const telefoneInputs = document.querySelectorAll('input[type="tel"]');
    
    telefoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
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
    });
});

// Animações de scroll
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
    
    // Observar cards de serviço
    const servicoCards = document.querySelectorAll('.servico-card');
    servicoCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// Adicionar estilos para as animações de notificação
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification i {
        font-size: 18px;
    }
`;
document.head.appendChild(notificationStyles);

// Tornar funções disponíveis globalmente
window.abrirFormularioCandidatura = abrirFormularioCandidatura;
window.fecharModalCandidatura = fecharModalCandidatura;
window.showNotification = showNotification;