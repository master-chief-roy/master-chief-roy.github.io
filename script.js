// Variables globales
let portafolioData = {};
let terminalTypingTimeout = null;

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Cargando portafolio...');
    
    // Cargar datos del JSON
    await cargarDatos();
    
    // Renderizar el contenido
    renderizarPerfil();
    iniciarTerminal();
    renderizarHistoria();
    renderizarLogros();
    renderizarProyectos();
    renderizarTecnologias();
    renderizarCertificados();
    renderizarContacto();
    
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
    document.getElementById('nombreCompleto').textContent = portafolioData.nombreCompleto || portafolioData.nombre;
    document.getElementById('subtituloProf').textContent = portafolioData.subtituloProfesional;
    document.getElementById('fraseBranding').textContent = portafolioData.fraseBranding;
    document.getElementById('resumenTexto').textContent = portafolioData.resumenPerfil;

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

// Animación tipo terminal (hero)
function iniciarTerminal() {
    const terminal = document.getElementById('terminalBody');
    if (!terminal) return;

const lines = [
    `> const engineer = {`,
    `>   name: "Ronny Toctaquiza",`,
    `>   role: "Telecommunications Engineer",`,
    `>   focus: ["Software", "Networking", "Cloud"],`,
    `>   location: "Riobamba, Ecuador"`,
    `> };`,
    `> console.log(engineer);`,
    `> // Welcome to portfolio`,
];

    let lineIndex = 0;
    let charIndex = 0;

    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';

    function typeNextChar() {
        if (lineIndex >= lines.length) {
            if (!terminal.contains(cursor)) terminal.appendChild(cursor);
            terminalTypingTimeout = null;
            return;
        }

        const line = lines[lineIndex];
        terminal.textContent += line[charIndex] || '';

        if (!terminal.contains(cursor)) terminal.appendChild(cursor);

        charIndex += 1;
        if (charIndex > line.length) {
            terminal.textContent += '\n';
            lineIndex += 1;
            charIndex = 0;
            terminalTypingTimeout = setTimeout(typeNextChar, 350);
        } else {
            terminalTypingTimeout = setTimeout(typeNextChar, 45);
        }
    }

    // Reiniciar la animación si ya estaba corriendo
    if (terminalTypingTimeout) {
        clearTimeout(terminalTypingTimeout);
        terminalTypingTimeout = null;
    }

    terminal.textContent = '';
    if (terminal.contains(cursor)) terminal.removeChild(cursor);
    typeNextChar();
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
                <div class="timeline-header">
                    <span class="ano">${exp.año}</span>
                    <h3>${exp.titulo}</h3>
                    <span class="empresa">${exp.empresa}</span>
                </div>
                <p class="descripcion">${exp.descripcion}</p>
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
function renderizarTecnologias() {
    const { tecnologias } = portafolioData;
    if (!tecnologias) return;

    const herramientasContainer = document.getElementById('herramientasContainer');
    herramientasContainer.innerHTML = '';

    const categorias = tecnologias.categorias || [];

    categorias.forEach(categoria => {
        const categoriaContainer = document.createElement('div');
        categoriaContainer.className = 'herramienta-categoria';

        const titulo = document.createElement('h3');
        titulo.className = 'categoria-title';
        titulo.textContent = categoria.titulo;

        const grid = document.createElement('div');
        grid.className = 'categoria-grid';

        const items = categoria.items || [];
        items.forEach(skill => {
            const card = document.createElement('div');
            card.className = 'skill-card';

            const color = skill.color || 'var(--accent)';
            const iconHtml = skill.icono && skill.icono.startsWith('fa')
                ? `<i class="${skill.icono}"></i>`
                : '';

            const imagenHtml = skill.imagen
                ? `<img src="${skill.imagen}" alt="${skill.nombre}" class="skill-imagen">`
                : '';

            card.innerHTML = `
                <div class="skill-header">
                    <div class="skill-icon" style="color: ${color}; border-color: ${color}; background: ${color}22;">
                        ${imagenHtml || iconHtml}
                    </div>
                    <div class="skill-name">${skill.nombre}</div>
                </div>
            `;

            grid.appendChild(card);
        });

        categoriaContainer.appendChild(titulo);
        categoriaContainer.appendChild(grid);
        herramientasContainer.appendChild(categoriaContainer);
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

// Renderizar Proyectos
function renderizarProyectos() {
    const { proyectos } = portafolioData;
    if (!proyectos) return;

    const container = document.getElementById('proyectosContainer');
    if (!container) return;
    
    container.innerHTML = '';

    const items = proyectos.items || [];
    items.forEach(proyecto => {
        const card = document.createElement('div');
        card.className = 'proyecto-card';
        card.style.cursor = 'pointer';

        const iconHtml = proyecto.icono && proyecto.icono.startsWith('fa')
            ? `<i class="${proyecto.icono}"></i>`
            : '<i class="fa-solid fa-code"></i>';

        const techsHtml = (proyecto.tecnologias || [])
            .map(tech => `<span class="proyecto-tech-tag">${tech}</span>`)
            .join('');

        const imagenHtml = proyecto.imagen 
            ? `<img src="${proyecto.imagen}" alt="${proyecto.titulo}" class="proyecto-imagen">`
            : '';

        card.innerHTML = `
            <div class="proyecto-header">
                <div class="proyecto-icon">${iconHtml}</div>
            </div>
            ${imagenHtml}
            <div class="proyecto-body">
                <h3>${proyecto.titulo}</h3>
                <p>${proyecto.descripcion}</p>
                <div class="proyecto-techs">${techsHtml}</div>
                <a href="${proyecto.enlace}" class="btn btn-primary proyecto-btn" onclick="event.stopPropagation();">Ver Proyecto</a>
            </div>
        `;

        // Hacer toda la tarjeta clickeable
        card.addEventListener('click', () => {
            if (proyecto.enlace) {
                window.open(proyecto.enlace, '_blank');
            }
        });

        container.appendChild(card);
    });
}

// Renderizar Contacto
function renderizarContacto() {
    const { contacto, redesSociales } = portafolioData;
    if (!contacto) return;

    const contactoTitle = document.getElementById('contactoTitle');
    const contactoDesc = document.getElementById('contactoDesc');
    const contactoEmail = document.getElementById('contactoEmail');
    const contactoTel = document.getElementById('contactoTel');
    const contactoWhatsapp = document.getElementById('contactoWhatsapp');
    const contactoInstagram = document.getElementById('contactoInstagram');
    const contactoLinkedin = document.getElementById('contactoLinkedin');

    if (contactoTitle) contactoTitle.textContent = contacto.titulo;
    if (contactoDesc) contactoDesc.textContent = contacto.descripcion;
    
    if (contactoEmail) {
        contactoEmail.href = `mailto:${contacto.email}`;
        contactoEmail.textContent = contacto.email;
    }
    
    if (contactoTel) {
        contactoTel.href = `tel:${contacto.telefono}`;
        contactoTel.textContent = contacto.telefono;
    }

    // Configurar redes sociales en contacto
    if (redesSociales) {
        if (contactoWhatsapp && redesSociales.whatsapp) {
            contactoWhatsapp.href = redesSociales.whatsapp;
        }
        if (contactoInstagram && redesSociales.instagram) {
            contactoInstagram.href = redesSociales.instagram;
        }
        if (contactoLinkedin && redesSociales.linkedin) {
            contactoLinkedin.href = redesSociales.linkedin;
        }
    }
}

// Helper para activar el enlace de navegación correspondiente
function setActiveNav(seccion) {
    const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('data-seccion') === seccion) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
}

// Configurar navegación entre secciones
function configurarNavegacion() {
    const sideLinks = document.querySelectorAll('.side-nav-link');
    sideLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const seccion = link.getAttribute('data-seccion');
            // Quitar 'active' de todos los side-nav-link
            sideLinks.forEach(l => l.classList.remove('active'));
            // Poner 'active' solo al link clickeado
            link.classList.add('active');
            mostrarSeccion(seccion);
        });
    });
}

// Configurar hamburger menu para móviles
function configurarHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    };

    hamburger.addEventListener('click', toggleMenu);

    // Accessibility: abrir/cerrar con Enter o Space
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
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
        
        // Si volvemos a Inicio, refrescar la animación de la terminal
        if (nombreSeccion === 'inicio') {
            iniciarTerminal();
        }

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

// Función para descargar CV
function descargarCV() {
    // Crear un elemento de enlace para descargar el CV
    // Nota: Asegúrate de tener un archivo CV.pdf en la carpeta principal
    const link = document.createElement('a');
    link.href = './CV_Ronny_Toctaquiza.pdf'; // Ruta del archivo CV
    link.download = 'CV_Ronny_Toctaquiza.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Alert como alternativa
    alert('La descarga de CV comenzará. Si no hay archivo, por favor contacta al ingeniero.');
}

// Actualizar los datos en tiempo real (si es necesario)
function actualizarDatos(nuevosDatos) {
    portafolioData = { ...portafolioData, ...nuevosDatos };
    
    // Re-renderizar todo
    renderizarPerfil();
    renderizarHistoria();
    renderizarLogros();
    renderizarCertificados();
    renderizarTecnologias();
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
