document.addEventListener('DOMContentLoaded', function() {
    // ===== ELEMENTOS DEL DOM =====
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const currentYear = document.getElementById('current-year');
    const scrollTopBtn = document.getElementById('scroll-top');
    const contactForm = document.getElementById('contactForm');
    
    // ===== CARRUSEL ELEMENTOS =====
    const carruselTrack = document.querySelector('.carrusel-track-large');
    const carruselSlides = document.querySelectorAll('.carrusel-slide-large');
    const prevBtn = document.querySelector('.carrusel-btn.prev');
    const nextBtn = document.querySelector('.carrusel-btn.next');
    const indicators = document.querySelectorAll('.indicator-large');
    const slideCounter = document.querySelector('.slide-counter');
    
    // ===== VARIABLES GLOBALES =====
    let currentSlide = 0;
    const totalSlides = carruselSlides.length;
    let carruselInterval;
    let isTransitioning = false;
    let isMenuOpen = false;
    
    // ===== FUNCIONES DE INICIALIZACIÓN =====
    function init() {
        console.log('Inicializando aplicación...');
        
        // Verificar que los elementos críticos existen
        if (!menuToggle || !navMenu) {
            console.warn('Elementos del menú no encontrados');
        }
        
        setCurrentYear();
        setupNavigation();
        setupCarrusel();
        setupScrollTop();
        setupFormValidation();
        setupAnimations();
        setupPDFViewers();
        setupVideoPlayers();
        
        // Forzar la sección de inicio al cargar
        setTimeout(() => {
            showSection('inicio');
        }, 100);
    }
    
    // ===== AÑO ACTUAL =====
    function setCurrentYear() {
        if (currentYear) {
            currentYear.textContent = new Date().getFullYear();
        }
    }
    
    // ===== NAVEGACIÓN CORREGIDA =====
    function setupNavigation() {
        // 1. TOGGLE DEL MENÚ MÓVIL - FIXED
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleMobileMenu();
            });
            
            // Cerrar menú al hacer clic en un enlace (solo móvil)
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        
                        // Cerrar menú primero
                        closeMobileMenu();
                        
                        // Luego navegar
                        const targetId = this.getAttribute('href').substring(1);
                        setTimeout(() => {
                            navigateToSection(targetId, this);
                        }, 300);
                    } else {
                        // Para desktop, comportamiento normal
                        e.preventDefault();
                        const targetId = this.getAttribute('href').substring(1);
                        navigateToSection(targetId, this);
                    }
                });
            });
            
            // Cerrar menú al hacer clic fuera
            document.addEventListener('click', function(e) {
                if (isMenuOpen && 
                    !menuToggle.contains(e.target) && 
                    !navMenu.contains(e.target)) {
                    closeMobileMenu();
                }
            });
            
            // Cerrar menú con tecla ESC
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && isMenuOpen) {
                    closeMobileMenu();
                }
            });
        } else {
            console.error('Menu elements not found');
        }
        
        // 2. NAVEGACIÓN POR SECCIONES PARA DESKTOP
        if (navLinks.length > 0 && sections.length > 0) {
            // Asegurar que el primer enlace esté activo al inicio
            if (!document.querySelector('.nav-link.active')) {
                navLinks[0].classList.add('active');
            }
        }
    }
    
    function toggleMobileMenu() {
        if (!navMenu || !menuToggle) return;
        
        if (isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    function openMobileMenu() {
        navMenu.style.display = 'flex';
        setTimeout(() => {
            navMenu.classList.add('active');
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            isMenuOpen = true;
            
            // Añadir overlay para mejor UX
            const overlay = document.createElement('div');
            overlay.className = 'menu-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 998;
                display: block;
            `;
            overlay.addEventListener('click', closeMobileMenu);
            document.body.appendChild(overlay);
            
            // Bloquear scroll del body
            document.body.style.overflow = 'hidden';
        }, 10);
    }
    
    function closeMobileMenu() {
        if (!navMenu || !menuToggle) return;
        
        navMenu.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        isMenuOpen = false;
        
        // Remover overlay
        const overlay = document.querySelector('.menu-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        // Restaurar scroll
        document.body.style.overflow = '';
        
        setTimeout(() => {
            if (!navMenu.classList.contains('active')) {
                navMenu.style.display = 'none';
            }
        }, 300);
    }
    
    function navigateToSection(sectionId, clickedLink) {
        // Validar que la sección existe
        const targetSection = document.getElementById(sectionId);
        if (!targetSection) {
            console.error(`Sección ${sectionId} no encontrada`);
            return;
        }
        
        // 1. Actualizar enlaces activos
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        if (clickedLink) {
            clickedLink.classList.add('active');
        }
        
        // 2. Mostrar sección con animación
        showSection(sectionId);
        
        // 3. Scroll suave (solo si no es móvil con menú abierto)
        if (window.innerWidth > 768 || !isMenuOpen) {
            setTimeout(() => {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
    
    // ===== MOSTRAR SECCIÓN CON ANIMACIÓN =====
    function showSection(sectionId) {
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.style.display = 'block';
                // Pequeño delay para asegurar display
                requestAnimationFrame(() => {
                    section.classList.add('active-section');
                    animateSectionElements(section);
                });
            } else {
                section.classList.remove('active-section');
                setTimeout(() => {
                    if (!section.classList.contains('active-section')) {
                        section.style.display = 'none';
                    }
                }, 300);
            }
        });
    }
    
    // ===== ANIMAR ELEMENTOS DE SECCIÓN =====
    function animateSectionElements(section) {
        const animatedElements = section.querySelectorAll('.pdf-card, .video-card, .link-card, .stat-card');
        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 + (index * 100));
        });
    }
    
    // ===== CARRUSEL MEJORADO =====
    function setupCarrusel() {
        if (!carruselTrack || carruselSlides.length === 0) {
            console.warn('Elementos del carrusel no encontrados');
            return;
        }
        
        // Configurar dimensiones iniciales
        updateCarruselDimensions();
        
        // Event listeners para botones
        if (prevBtn) {
            prevBtn.addEventListener('click', () => navigateCarrusel(-1));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => navigateCarrusel(1));
        }
        
        // Event listeners para indicadores
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToSlide(index));
        });
        
        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') navigateCarrusel(-1);
            if (e.key === 'ArrowRight') navigateCarrusel(1);
        });
        
        // Swipe para móviles
        let touchStartX = 0;
        let touchEndX = 0;
        
        if (carruselTrack) {
            carruselTrack.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            carruselTrack.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
        }
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const difference = touchStartX - touchEndX;
            
            if (Math.abs(difference) > swipeThreshold) {
                if (difference > 0) {
                    navigateCarrusel(1); // Swipe izquierda
                } else {
                    navigateCarrusel(-1); // Swipe derecha
                }
            }
        }
        
        // Autoavance
        startAutoAdvance();
        
        // Pausar autoavance al interactuar
        const carruselContainer = document.querySelector('.carrusel-container-large');
        if (carruselContainer) {
            carruselContainer.addEventListener('mouseenter', pauseAutoAdvance);
            carruselContainer.addEventListener('touchstart', pauseAutoAdvance);
            carruselContainer.addEventListener('mouseleave', startAutoAdvance);
        }
        
        // Actualizar dimensiones en resize
        window.addEventListener('resize', updateCarruselDimensions);
        
        // Actualizar contador
        updateSlideCounter();
    }
    
    function navigateCarrusel(direction) {
        if (isTransitioning || !carruselTrack) return;
        
        isTransitioning = true;
        const newSlide = (currentSlide + direction + totalSlides) % totalSlides;
        goToSlide(newSlide);
        
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    }
    
    function goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= totalSlides || !carruselTrack) return;
        
        currentSlide = slideIndex;
        
        // Actualizar posición del track
        carruselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Actualizar indicadores
        indicators.forEach((indicator, index) => {
            if (indicator) {
                indicator.classList.toggle('active', index === currentSlide);
            }
        });
        
        // Actualizar contador
        updateSlideCounter();
        
        // Restart auto advance
        restartAutoAdvance();
    }
    
    function updateSlideCounter() {
        if (slideCounter) {
            slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
        }
    }
    
    function updateCarruselDimensions() {
        const container = document.querySelector('.carrusel-container-large');
        const slides = document.querySelectorAll('.carrusel-slide-large');
        
        if (container && slides.length > 0) {
            slides.forEach(slide => {
                slide.style.minWidth = `${container.offsetWidth}px`;
            });
        }
    }
    
    function startAutoAdvance() {
        clearInterval(carruselInterval);
        carruselInterval = setInterval(() => {
            navigateCarrusel(1);
        }, 7000); // 7 segundos
    }
    
    function pauseAutoAdvance() {
        clearInterval(carruselInterval);
    }
    
    function restartAutoAdvance() {
        pauseAutoAdvance();
        startAutoAdvance();
    }
    
    // ===== SCROLL TOP =====
    function setupScrollTop() {
        if (!scrollTopBtn) return;
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===== TEMA OSCURO/CLARO =====
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (body.classList.contains('light-mode')) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
                this.innerHTML = '<i class="fas fa-sun"></i><span>Modo Día</span>';
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
                this.innerHTML = '<i class="fas fa-moon"></i><span>Modo Noche</span>';
            }
        });
        
        // Cargar tema guardado
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Modo Día</span>';
        }
    }
    
    // ===== FORMULARIO DE CONTACTO =====
    function setupFormValidation() {
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                simulateFormSubmission();
            }
        });
        
        // Validación en tiempo real
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
    }
    
    function validateForm() {
        let isValid = true;
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function validateField(field) {
        let isValid = true;
        let errorMessage = '';
        
        // Limpiar error anterior
        clearError(field);
        
        // Validar campo requerido
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Este campo es requerido';
        }
        
        // Validar email
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Ingresa un email válido';
            }
        }
        
        // Mostrar error si existe
        if (!isValid) {
            showError(field, errorMessage);
        }
        
        return isValid;
    }
    
    function showError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--primary-color)';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = 'var(--primary-color)';
    }
    
    function clearError(field) {
        const error = field.parentNode.querySelector('.error-message');
        
        if (error) {
            error.remove();
        }
        
        field.style.borderColor = '';
    }
    
    function simulateFormSubmission() {
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        // Mostrar estado de carga
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Simular delay de red
        setTimeout(() => {
            // Mostrar mensaje de éxito
            showNotification('¡Mensaje enviado con éxito! Te responderemos pronto.', 'success');
            
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Limpiar formulario
            contactForm.reset();
        }, 2000);
    }
    
    // ===== NOTIFICACIONES =====
    function showNotification(message, type = 'info') {
        // Remover notificación anterior si existe
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Estilos de notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--accent-color)' : 'var(--primary-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Botón para cerrar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // ===== ANIMACIONES =====
    function setupAnimations() {
        // Intersection Observer para animaciones al scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);
        
        // Observar elementos para animar
        const animatableElements = document.querySelectorAll('.pdf-card, .video-card, .link-card, .stat-card, .gallery-item');
        animatableElements.forEach(el => {
            if (el) observer.observe(el);
        });
    }
    
    // ===== VISORES PDF =====
    function setupPDFViewers() {
        const pdfIframes = document.querySelectorAll('.pdf-preview iframe');
        
        pdfIframes.forEach(iframe => {
            // Añadir mensaje de carga
            iframe.onload = function() {
                const parent = iframe.parentNode;
                if (parent) parent.classList.remove('loading');
            };
            
            // Manejar errores
            iframe.onerror = function() {
                const parent = iframe.parentNode;
                if (parent) {
                    parent.classList.remove('loading');
                    parent.innerHTML = `
                        <div class="pdf-error" style="text-align: center; padding: 2rem;">
                            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
                            <h4>No se pudo cargar el PDF</h4>
                            <p>El archivo no está disponible o hubo un error al cargarlo.</p>
                            <a href="${iframe.src}" class="btn" target="_blank" style="margin-top: 1rem;">
                                <i class="fas fa-external-link-alt"></i> Abrir en nueva pestaña
                            </a>
                        </div>
                    `;
                }
            };
        });
    }
    
    // ===== REPRODUCTORES DE VIDEO =====
    function setupVideoPlayers() {
        const videos = document.querySelectorAll('video');
        
        videos.forEach(video => {
            if (video) {
                // Añadir controles personalizados si es necesario
                video.addEventListener('play', () => {
                    video.parentNode.classList.add('playing');
                });
                
                video.addEventListener('pause', () => {
                    video.parentNode.classList.remove('playing');
                });
                
                // Prevenir autoplay en móviles
                if (window.innerWidth <= 768) {
                    video.removeAttribute('autoplay');
                }
            }
        });
    }
    
    // ===== MANEJO DE RESIZE =====
    function handleResize() {
        // Cerrar menú si se redimensiona a desktop
        if (window.innerWidth > 768 && isMenuOpen) {
            closeMobileMenu();
        }
        
        // Actualizar visibilidad del menú en desktop
        if (window.innerWidth > 768 && navMenu) {
            navMenu.style.display = 'flex';
        } else if (window.innerWidth <= 768 && navMenu && !isMenuOpen) {
            navMenu.style.display = 'none';
        }
    }
    
    // Event listener para resize
    window.addEventListener('resize', handleResize);
    
    // Configurar menú inicial según tamaño de pantalla
    if (window.innerWidth <= 768 && navMenu) {
        navMenu.style.display = 'none';
    }
    
    // ===== INICIALIZAR TODO =====
    init();
    
    // Asegurar que el DOM esté completamente listo
    setTimeout(() => {
        // Forzar un repaint para asegurar que los estilos se apliquen
        document.body.style.opacity = '1';
    }, 100);
});

// Añadir soporte para navegadores antiguos
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector || 
        Element.prototype.oMatchesSelector || 
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;            
        };
}
