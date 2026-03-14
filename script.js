// Variables globales
let portafolioData = {};

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Cargando portafolio...');
    
    // Cargar datos del JSON
    await cargarDatos();
    
    // Renderizar el contenido
    renderizarPerfil();
    renderizarHistoria();
    renderizarLogros();
    renderizarCertificados();
    renderizarHerramientas();
    
    // Configurar navegación
    configurarNavegacion();
    
    // Configurar hamburger menu para móviles
    configurarHamburger();

    // Configurar tema claro/oscuro
    configurarThemeToggle();
    aplicarTemaGuardado();
    
    // Configurar modal de certificados
    configurarModalCertificado();
    
    // Configurar back to top
    configurarBackToTop();
    
    // Configurar scrollspy para navegación automática
    configurarScrollSpy();
    
    // Mostrar sección de inicio por defecto
    mostrarSeccion('inicio');
});

// Cargar datos del archivo JSON
async function cargarDatos() {
    try {
        const response = await fetch('data.json');
        portafolioData = await response.json();
        console.log('Datos cargados:', portafolioData);
    } catch (error) {
        console.error('Error cargando datos:', error);
        portafolioData = {
            nombre: 'Tu Nombre',
            carrera: 'Tu Carrera',
            universidad: 'Tu Universidad'
        };
    }
}

// Renderizar perfil principal
function renderizarPerfil() {
    document.getElementById('nombreHeader').textContent = portafolioData.nombre;
    document.getElementById('nombreCompleto').textContent = portafolioData.nombre;
    document.getElementById('carreraTexto').textContent = portafolioData.carrera;
    document.getElementById('universidadTexto').textContent = portafolioData.universidad;
    document.getElementById('resumenTexto').textContent = portafolioData.resumenPerfil;
    document.getElementById('emailTexto').textContent = portafolioData.email;
    document.getElementById('telefonoTexto').textContent = portafolioData.telefono;

    // Hacer clic en el nombre regresa al inicio
    const nombreHeader = document.getElementById('nombreHeader');
    if (nombreHeader) {
        nombreHeader.style.cursor = 'pointer';
        nombreHeader.addEventListener('click', () => {
            mostrarSeccion('inicio');
            setActiveNav('inicio');
        });
    }
    
    // Actualizar redes sociales
    if (portafolioData.redesSociales) {
        const whatsappLink = document.getElementById('whatsappLink');
        const instagramLink = document.getElementById('instagramLink');
        const linkedinLink = document.getElementById('linkedinLink');
        
        if (whatsappLink && portafolioData.redesSociales.whatsapp) {
            whatsappLink.href = portafolioData.redesSociales.whatsapp;
        }
        if (instagramLink && portafolioData.redesSociales.instagram) {
            instagramLink.href = portafolioData.redesSociales.instagram;
        }
        if (linkedinLink && portafolioData.redesSociales.linkedin) {
            linkedinLink.href = portafolioData.redesSociales.linkedin;
        }
    }
}

// Renderizar sección de historia
function renderizarHistoria() {
    const { historia } = portafolioData;
    
    document.getElementById('historiaTitle').textContent = historia.titulo;
    document.getElementById('historiaTexto').textContent = historia.contenido;
    
    const timelineContainer = document.getElementById('timelineContainer');
    timelineContainer.innerHTML = '';
    
    historia.experiencias.forEach((exp, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <span class="ano">${exp.año}</span>
                <h3>${exp.titulo}</h3>
                <p>${exp.empresa}</p>
                <p>${exp.descripcion}</p>
            </div>
        `;
        timelineContainer.appendChild(timelineItem);
    });
}

// Renderizar logros
function renderizarLogros() {
    const { logros } = portafolioData;

    document.getElementById('logrosTitle').textContent = logros.titulo;

    const logrosContainer = document.getElementById('logrosContainer');
    logrosContainer.innerHTML = '';

    logros.items.forEach(logro => {
        const card = document.createElement('div');
        card.className = 'logro-card';

        const iconHtml = logro.icono && logro.icono.startsWith('fa')
            ? `<i class="${logro.icono}"></i>`
            : logro.icono || '';

        card.innerHTML = `
            <div class="logro-icon">${iconHtml}</div>
            <h3>${logro.titulo}</h3>
            <p>${logro.descripcion}</p>
        `;
        logrosContainer.appendChild(card);
    });
}

// Renderizar certificados
function renderizarCertificados() {
    const { certificados } = portafolioData;

    document.getElementById('certificadosTitle').textContent = certificados.titulo;

    const certificadosContainer = document.getElementById('certificadosContainer');
    certificadosContainer.innerHTML = '';

    certificados.items.forEach(cert => {
        const card = document.createElement('div');
        card.className = 'certificado-card';
        card.style.cursor = 'pointer';

        const iconHtml = cert.icono && cert.icono.startsWith('fa')
            ? `<i class="${cert.icono} certificado-icon"></i>`
            : '';

        card.innerHTML = `
            <div class="certificado-header">
                ${iconHtml}
                <h3>${cert.nombre}</h3>
            </div>
            <div class="certificado-meta">
                <span><strong>Plataforma:</strong> ${cert.precio}</span>
                <span><strong>Año:</strong> ${cert.fecha}</span>
            </div>
            <p>${cert.descripcion}</p>
        `;

        // Agregar evento click para abrir modal
        card.addEventListener('click', () => abrirModalCertificado(cert));

        certificadosContainer.appendChild(card);
    });
}

// Función para abrir modal de certificado
function abrirModalCertificado(cert) {
    const modal = document.getElementById('certificadoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalIcon = document.getElementById('modalIcon');
    const modalPlataforma = document.getElementById('modalPlataforma');
    const modalFecha = document.getElementById('modalFecha');
    const modalDescription = document.getElementById('modalDescription');

    modalTitle.textContent = cert.nombre;
    modalPlataforma.textContent = cert.precio;
    modalFecha.textContent = cert.fecha;
    modalDescription.textContent = cert.descripcion;

    // Agregar icono si existe
    if (cert.icono && cert.icono.startsWith('fa')) {
        modalIcon.innerHTML = `<i class="${cert.icono} certificado-modal-main-icon"></i>`;
    } else {
        modalIcon.innerHTML = '';
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Función para cerrar modal
function cerrarModalCertificado() {
    const modal = document.getElementById('certificadoModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Configurar eventos del modal
function configurarModalCertificado() {
    const modal = document.getElementById('certificadoModal');
    const closeBtn = document.getElementById('modalClose');

    // Cerrar modal al hacer click en la X
    closeBtn.addEventListener('click', cerrarModalCertificado);

    // Cerrar modal al hacer click fuera del contenido
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            cerrarModalCertificado();
        }
    });

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            cerrarModalCertificado();
        }
    });
}

// Renderizar herramientas
function renderizarHerramientas() {
    const { herramientas } = portafolioData;
    
    document.getElementById('herramientasTitle').textContent = herramientas.titulo;
    
    const herramientasContainer = document.getElementById('herramientasContainer');
    herramientasContainer.innerHTML = '';

    const skills = herramientas.skills || [];

    skills.forEach(skill => {
        const card = document.createElement('div');
        card.className = 'skill-card';

        const color = skill.color || 'var(--accent)';
        const iconHtml = skill.icono && skill.icono.startsWith('fa')
            ? `<i class="${skill.icono}"></i>`
            : '';

        const percent = Number(skill.porcentaje) || 0;
        const barWidth = Math.min(Math.max(percent, 0), 100);

        card.innerHTML = `
            <div class="skill-header">
                <div class="skill-icon" style="color: ${color}; border-color: ${color}; background: ${color}22;">
                    ${iconHtml}
                </div>
                <div class="skill-name">${skill.nombre}</div>
            </div>
            <div class="skill-progress">
                <div class="skill-bar" data-percent="${barWidth}" style="background: ${color};"></div>
            </div>
            <div class="skill-value">${barWidth}%</div>
        `;

        herramientasContainer.appendChild(card);
    });

    // Activar animación al aparecer en pantalla
    activarAnimacionesDeSkills();
}

function activarAnimacionesDeSkills() {
    const cards = document.querySelectorAll('.skill-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');

                const bar = entry.target.querySelector('.skill-bar');
                if (bar) {
                    const percent = bar.dataset.percent || '0';
                    // Agregar delay progresivo para cada barra
                    setTimeout(() => {
                        bar.style.width = `${percent}%`;
                    }, index * 200); // 200ms delay entre cada barra
                }

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(card => {
        observer.observe(card);
    });
}

// Helper para activar el enlace de navegación correspondiente
function setActiveNav(seccion) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-seccion') === seccion);
    });
}

// Configurar navegación entre secciones
function configurarNavegacion() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Obtener la sección
            const seccion = link.getAttribute('data-seccion');
            
            // Actualizar clase activa en navegación
            setActiveNav(seccion);
            
            // Mostrar sección
            mostrarSeccion(seccion);
            
            // Cerrar hamburger menu si está abierto
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
}

// Configurar hamburger menu para móviles
function configurarHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Cerrar menú cuando se presiona fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Mostrar una sección específica
function mostrarSeccion(nombreSeccion) {
    // Ocultar todas las secciones
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(seccion => {
        seccion.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const seccionActual = document.getElementById(nombreSeccion);
    if (seccionActual) {
        seccionActual.classList.add('active');
        
        // Scroll al inicio de la página
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Función para navegar a una sección (usada en botones)
function irSeccion(nombreSeccion) {
    // Actualizar navegación
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('data-seccion') === nombreSeccion) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Mostrar sección
    mostrarSeccion(nombreSeccion);
}

// Actualizar los datos en tiempo real (si es necesario)
function actualizarDatos(nuevosDatos) {
    portafolioData = { ...portafolioData, ...nuevosDatos };
    
    // Re-renderizar todo
    renderizarPerfil();
    renderizarHistoria();
    renderizarLogros();
    renderizarCertificados();
    renderizarHerramientas();
}

// Tema claro / oscuro / automático
function aplicarTemaGuardado() {
    const temaGuardado = localStorage.getItem('theme') || 'auto';
    aplicarTema(temaGuardado);
}

function aplicarTema(tema) {
    if (tema === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('light', !prefersDark);
    } else {
        document.body.classList.toggle('light', tema === 'light');
    }
    actualizarIconoTema(tema);
}

function configurarThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    // Aplicar tema inicial
    const temaGuardado = localStorage.getItem('theme') || 'auto';
    aplicarTema(temaGuardado);

    toggle.addEventListener('click', () => {
        let currentTheme = localStorage.getItem('theme') || 'auto';
        let nextTheme;

        // Ciclo: auto -> light -> dark -> auto
        if (currentTheme === 'auto') {
            nextTheme = 'light';
        } else if (currentTheme === 'light') {
            nextTheme = 'dark';
        } else {
            nextTheme = 'auto';
        }

        localStorage.setItem('theme', nextTheme);
        aplicarTema(nextTheme);
    });

    // Escuchar cambios en el modo del sistema cuando esté en auto
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const currentTheme = localStorage.getItem('theme') || 'auto';
        if (currentTheme === 'auto') {
            aplicarTema('auto');
        }
    });
}

function actualizarIconoTema(tema) {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const icon = toggle.querySelector('i');
    if (!icon) return;

    if (tema === 'light') {
        icon.className = 'fas fa-sun';
    } else if (tema === 'dark') {
        icon.className = 'fas fa-moon';
    } else { // auto
        icon.className = 'fas fa-adjust';
    }
}

// Configurar botón back to top
function configurarBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    // Mostrar/ocultar botón basado en scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // Scroll suave al top al hacer click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Configurar scrollspy para navegación automática
function configurarScrollSpy() {
    const sections = document.querySelectorAll('.seccion');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                // Actualizar navegación activa
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('data-seccion') === id);
                });
            }
        });
    }, observerOptions);

    // Observar todas las secciones
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Para debugging en consola
console.log('Portafolio SPA cargado correctamente');
