document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos del DOM
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const currentYear = document.getElementById('current-year');
    const pdfButtons = document.querySelectorAll('.view-pdf');
    const pdfViewerContainer = document.getElementById('pdf-viewer-container');
    const closePdfBtn = document.getElementById('close-pdf');
    const pdfTitle = document.getElementById('pdf-title');
    const pdfViewer = document.getElementById('pdf-viewer');
    const contactForm = document.getElementById('contactForm');
    
    // Configurar año actual en el footer
    currentYear.textContent = new Date().getFullYear();
    
    // Crear botón hamburguesa y overlay dinámicamente
    const nav = document.querySelector('nav');
    const navContainer = nav.querySelector('.container');
    const navMenu = nav.querySelector('.nav-menu');
    
    // Crear botón hamburguesa
    const navToggle = document.createElement('button');
    navToggle.className = 'nav-toggle';
    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    navContainer.appendChild(navToggle);
    
    // Crear overlay para cerrar menú
    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
    
    // Función para alternar menú hamburguesa
    function toggleNavMenu() {
        navMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        
        // Cambiar ícono del botón
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    }
    
    // Función para cerrar menú
    function closeNavMenu() {
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Restaurar ícono del botón
        const icon = navToggle.querySelector('i');
        icon.className = 'fas fa-bars';
    }
    
    // Event listeners para menú hamburguesa
    navToggle.addEventListener('click', toggleNavMenu);
    navOverlay.addEventListener('click', closeNavMenu);
    
    // Cerrar menú al hacer clic en un enlace (en móviles)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeNavMenu();
            }
        });
    });
    
    // Función para cambiar entre modo día y noche
    themeToggle.addEventListener('click', function() {
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Modo Día';
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i> Modo Noche';
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Modo Día';
    }
    
    // Navegación entre secciones
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener el ID de la sección objetivo
            const targetId = this.getAttribute('href').substring(1);
            
            // Actualizar enlace activo
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar sección activa
            sections.forEach(section => {
                section.classList.remove('active-section');
                if (section.id === targetId) {
                    section.classList.add('active-section');
                }
            });
            
            // Cerrar visor de PDF si está abierto
            pdfViewerContainer.style.display = 'none';
            
            // Desplazamiento suave hacia la sección
            document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Carrusel de imágenes
    const carruselTrack = document.querySelector('.carrusel-track');
    const carruselSlides = document.querySelectorAll('.carrusel-slide');
    const prevBtn = document.querySelector('.carrusel-btn.prev');
    const nextBtn = document.querySelector('.carrusel-btn.next');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentSlide = 0;
    const totalSlides = carruselSlides.length;
    
    // Función para actualizar carrusel
    function updateCarrusel() {
        carruselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Actualizar indicadores
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Event listeners para botones del carrusel
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide > 0) ? currentSlide - 1 : totalSlides - 1;
        updateCarrusel();
    });
    
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide < totalSlides - 1) ? currentSlide + 1 : 0;
        updateCarrusel();
    });
    
    // Event listeners para indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateCarrusel();
        });
    });
    
    // Autoavance del carrusel
    let carruselInterval = setInterval(() => {
        currentSlide = (currentSlide < totalSlides - 1) ? currentSlide + 1 : 0;
        updateCarrusel();
    }, 5000);
    
    // Pausar autoavance al interactuar con el carrusel
    const carruselContainer = document.querySelector('.carrusel');
    carruselContainer.addEventListener('mouseenter', () => {
        clearInterval(carruselInterval);
    });
    
    carruselContainer.addEventListener('mouseleave', () => {
        carruselInterval = setInterval(() => {
            currentSlide = (currentSlide < totalSlides - 1) ? currentSlide + 1 : 0;
            updateCarrusel();
        }, 5000);
    });
    
    // PDF Viewer - Simulación de visualización de PDFs
    pdfButtons.forEach(button => {
        button.addEventListener('click', function() {
            const pdfName = this.getAttribute('data-pdf');
            
            // Actualizar título del PDF
            pdfTitle.textContent = `Visualizando: ${this.parentElement.querySelector('h3').textContent}`;
            
            // Mostrar contenido simulado del PDF
            pdfViewer.innerHTML = `
                <div class="pdf-simulation">
                    <h4>Contenido del PDF: ${pdfName}</h4>
                    <p>Esta es una simulación del contenido del PDF. En una implementación real, aquí se mostraría el PDF usando la biblioteca PDF.js.</p>
                    
                    <div class="pdf-content">
                        <h5>Introducción</h5>
                        <p>Este documento contiene la actividad realizada durante el semestre. Incluye conceptos teóricos, ejemplos prácticos y ejercicios resueltos.</p>
                        
                        <h5>Contenido Principal</h5>
                        <p>El desarrollo de esta actividad permitió aplicar los conocimientos adquiridos en clase y desarrollar habilidades prácticas en el área de tecnología.</p>
                        
                        <h5>Conclusiones</h5>
                        <p>La actividad fue completada exitosamente, logrando los objetivos planteados inicialmente y obteniendo un aprendizaje significativo.</p>
                    </div>
                    
                    <div class="pdf-actions">
                        <button class="btn" onclick="alert('Descarga simulada del PDF')">
                            <i class="fas fa-download"></i> Descargar PDF
                        </button>
                    </div>
                </div>
            `;
            
            // Mostrar el visor de PDF
            pdfViewerContainer.style.display = 'block';
            
            // Desplazar hacia el visor
            pdfViewerContainer.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Cerrar visor de PDF
    closePdfBtn.addEventListener('click', function() {
        pdfViewerContainer.style.display = 'none';
    });
    
    // Formulario de contacto
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener valores del formulario
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Simular envío del formulario
        alert(`¡Gracias ${name}! Tu mensaje ha sido enviado. Te responderemos a ${email} en breve.`);
        
        // Limpiar formulario
        contactForm.reset();
    });
    
    // Efectos interactivos para botones
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Cerrar menú al redimensionar la ventana (si se vuelve a tamaño de escritorio)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeNavMenu();
        }
    });
    
    // Inicializar carrusel
    updateCarrusel();
});
