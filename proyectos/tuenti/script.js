// Tuenti App - Mobile Application Controller
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupServiceClickHandlers();
    setupButtonAnimations();
    setupCarouselLinks();
    setupUsageCarousel();
    console.log('Tuenti App Initialized');
}

// Navigation handlers - Bottom navigation bar
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get navigation label
            const label = this.querySelector('.nav-label').textContent;
            console.log('Navigating to:', label);
            
            // Add navigation logic here based on label
            handleNavigation(label);
        });
    });
}

// Handle navigation between sections
function handleNavigation(section) {
    switch(section) {
        case 'Cuenta':
            console.log('Loading account section');
            break;
        case 'Perfil':
            console.log('Loading profile section');
            break;
        case 'Menú':
            console.log('Loading menu section');
            break;
        case 'Servicios':
            console.log('Loading services section');
            break;
        case 'Ayuda':
            console.log('Loading help section');
            break;
    }
}

// Service items click animation and handlers
function setupServiceClickHandlers() {
    const serviceItems = document.querySelectorAll('.servicio-item');
    
    serviceItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const serviceTitle = this.querySelector('p').textContent;
            console.log('Service clicked:', serviceTitle);
            
            // Handle specific service actions
            handleServiceClick(serviceTitle);
        });
    });
}

// Handle service item clicks
function handleServiceClick(service) {
    switch(service) {
        case 'Llamadas a otro país':
            console.log('Opening international calls');
            break;
        case 'Datos Global':
            console.log('Opening global data service');
            break;
        case 'Extras en 4G':
            console.log('Opening 4G extras');
            break;
        case 'Plan de viaje':
            console.log('Opening travel plan');
            break;
        case 'Llamadas sin roaming':
            console.log('Opening roaming free calls');
            break;
        case 'Recarga otro':
            console.log('Opening recharge service');
            break;
    }
}

// Button animations and handlers
function setupButtonAnimations() {
    // Compra más button
    const compraBtn = document.querySelector('.btn-compra');
    if (compraBtn) {
        compraBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Compra más clicked - opening purchase flow');
        });
    }
    
    // Icon buttons (message, notification)
    const iconBtns = document.querySelectorAll('.icon-btn');
    iconBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.textContent;
            console.log('Icon button clicked:', icon);
            
            if (icon.includes('💬')) {
                console.log('Opening messages');
            } else if (icon.includes('🔔')) {
                console.log('Opening notifications');
            }
        });
    });
    
    // Ver detalles link
    const verDetallesLink = document.querySelector('.ver-detalles');
    if (verDetallesLink) {
        verDetallesLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Ver detalles clicked - showing usage details');
        });
    }
}

// Setup carousel links to navigate to packages
function setupCarouselLinks() {
    const carouselLinks = document.querySelectorAll('.carousel-slide a');
    
    carouselLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Carousel link clicked - navigating to packages');
            
            // Find the Servicios nav item and click it
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                if (item.querySelector('.nav-label').textContent === 'Servicios') {
                    item.click();
                }
            });
        });
    });
}

// Setup usage carousel with swipe and click navigation
function setupUsageCarousel() {
    const indicators = document.querySelectorAll('.indicator-dot');
    const slides = document.querySelectorAll('.usage-carousel-slide');
    const wrapper = document.querySelector('.usage-carousel-wrapper');
    let currentSlide = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    // Click indicators to navigate
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            goToSlide(slideIndex);
        });
    });

    function goToSlide(slideIndex) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));

        // Add active class to selected slide and indicator
        slides[slideIndex].classList.add('active');
        indicators[slideIndex].classList.add('active');

        currentSlide = slideIndex;
        console.log('Usage carousel: showing slide', slideIndex);
    }

    // Touch/swipe support
    wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    wrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - next slide
                currentSlide = (currentSlide + 1) % slides.length;
            } else {
                // Swiped right - previous slide
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            }
            goToSlide(currentSlide);
        }
    }
}

// Optional: Load data from data.json
async function loadAppData() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();
        console.log('App data loaded:', data);
    } catch (error) {
        console.error('Error loading app data:', error);
    }
}

// Optional: Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Optional: Format data size
function formatDataSize(gigabytes) {
    return `${gigabytes.toFixed(2)} GB`;
}
