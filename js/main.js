// Navegação
document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    
    burger.addEventListener('click', function() {
        nav.classList.toggle('active');
        burger.classList.toggle('toggle');
    });

    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-links li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            burger.classList.remove('toggle');
        });
    });

    // Scroll suave para as seções
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Configuração das habilidades
    const frontendSkills = [
        { name: 'HTML5', icon: 'fab fa-html5', level: 90 },
        { name: 'CSS3', icon: 'fab fa-css3-alt', level: 85 },
        { name: 'JavaScript', icon: 'fab fa-js', level: 80 },
        { name: 'React', icon: 'fab fa-react', level: 75 }
    ];

    const backendSkills = [
        { name: 'Node.js', icon: 'fab fa-node-js', level: 80 },
        { name: 'Java', icon: 'fab fa-java', level: 75 },
        { name: 'Python', icon: 'fab fa-python', level: 70 },
        { name: 'PHP', icon: 'fab fa-php', level: 65 }
    ];

    const toolsSkills = [
        { name: 'Git', icon: 'fab fa-git-alt', level: 85 },
        { name: 'Docker', icon: 'fab fa-docker', level: 70 },
        { name: 'VS Code', icon: 'fas fa-code', level: 90 },
        { name: 'Figma', icon: 'fab fa-figma', level: 75 }
    ];

    // Adicionar habilidades ao DOM
    function addSkillsToDOM(skills, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        skills.forEach(skill => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="skill-icon"><i class="${skill.icon}"></i></div>
                <div class="skill-info">
                    <span class="skill-name">${skill.name}</span>
                    <div class="skill-progress">
                        <div class="skill-bar" style="--fill-width: ${skill.level}%"></div>
                    </div>
                </div>
            `;
            container.appendChild(li);
        });
    }

    addSkillsToDOM(frontendSkills, 'frontend-skills');
    addSkillsToDOM(backendSkills, 'backend-skills');
    addSkillsToDOM(toolsSkills, 'tools-skills');

    // Formulário de contato
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aqui você pode adicionar a lógica de envio do formulário
            // Por enquanto, vamos apenas mostrar um alerta
            alert('Mensagem enviada com sucesso! (Simulação)');
            contactForm.reset();
        });
    }

    // Animação de elementos ao scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-title, .about-content, .skill-category, .stats-card, .project-card, .contact-container').forEach(el => {
        observer.observe(el);
    });
});