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
        card.innerHTML = `
            <div class="logro-icon">${logro.icono}</div>
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
        card.innerHTML = `
            <h3>${cert.nombre}</h3>
            <div class="certificado-meta">
                <span><strong>Plataforma:</strong> ${cert.precio}</span>
                <span><strong>Año:</strong> ${cert.fecha}</span>
            </div>
            <p>${cert.descripcion}</p>
        `;
        certificadosContainer.appendChild(card);
    });
}

// Renderizar herramientas
function renderizarHerramientas() {
    const { herramientas } = portafolioData;
    
    document.getElementById('herramientasTitle').textContent = herramientas.titulo;
    
    const herramientasContainer = document.getElementById('herramientasContainer');
    herramientasContainer.innerHTML = '';
    
    herramientas.categorias.forEach(categoria => {
        const categoriaDiv = document.createElement('div');
        categoriaDiv.className = 'herramienta-categoria';
        
        const tecnologiasHtml = categoria.tecnologias
            .map(tech => `<span class="herramienta-tag">${tech}</span>`)
            .join('');
        
        categoriaDiv.innerHTML = `
            <h3>${categoria.nombre}</h3>
            <div class="herramienta-lista">
                ${tecnologiasHtml}
            </div>
        `;
        
        herramientasContainer.appendChild(categoriaDiv);
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
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
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

// Para debugging en consola
console.log('Portafolio SPA cargado correctamente');
