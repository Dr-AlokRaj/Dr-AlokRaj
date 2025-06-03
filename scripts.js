// Navigation functionality
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navMenu = document.getElementById('nav-menu');
        this.hamburger = document.getElementById('hamburger');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.handleSmoothScroll();
        this.handleActiveSection();
        
        // Event listeners
        window.addEventListener('scroll', () => this.handleScroll());
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close mobile menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
    }
    
    handleScroll() {
        if (window.scrollY > 100) {
            this.navbar.style.background = 'hsla(var(--background-primary) / 0.98)';
            this.navbar.style.boxShadow = '0 2px 20px hsla(var(--shadow-light))';
        } else {
            this.navbar.style.background = 'hsla(var(--background-primary) / 0.95)';
            this.navbar.style.boxShadow = 'none';
        }
    }
    
    handleMobileMenu() {
        // Initialize mobile menu state
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
    }
    
    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
    }
    
    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
    }
    
    handleSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    handleActiveSection() {
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 150;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => link.classList.remove('active'));
                    if (navLink) navLink.classList.add('active');
                }
            });
        });
    }
}

// Animation on scroll functionality
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-animation]');
        this.init();
    }
    
    init() {
        this.observeElements();
        this.addAnimationClasses();
    }
    
    addAnimationClasses() {
        // Add animation classes to elements based on their position
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            const items = section.querySelectorAll('.timeline-item, .research-card, .award-item, .publication-item, .skill-category');
            items.forEach((item, itemIndex) => {
                if (index % 2 === 0) {
                    item.classList.add('fade-in');
                } else {
                    item.classList.add(itemIndex % 2 === 0 ? 'slide-in-left' : 'slide-in-right');
                }
            });
        });
    }
    
    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        animatedElements.forEach(el => observer.observe(el));
    }
}

// Publications filter functionality
class PublicationsFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.publicationItems = document.querySelectorAll('.publication-item');
        this.init();
    }
    
    init() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => this.handleFilter(button));
        });
    }
    
    handleFilter(activeButton) {
        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
        
        const filter = activeButton.getAttribute('data-filter');
        
        // Filter publications with animation
        this.publicationItems.forEach((item, index) => {
            const shouldShow = filter === 'all' || item.classList.contains(filter);
            
            if (shouldShow) {
                setTimeout(() => {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
}

// Contact form functionality
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.form);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Validate form
        if (!this.validateForm(name, email, subject, message)) {
            return;
        }
        
        // Create mailto link
        const mailtoLink = `mailto:alokraj3300@yahoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        this.showSuccessMessage();
        
        // Reset form
        this.form.reset();
    }
    
    validateForm(name, email, subject, message) {
        if (!name || !email || !subject || !message) {
            this.showErrorMessage('Please fill in all fields.');
            return false;
        }
        
        if (!this.isValidEmail(email)) {
            this.showErrorMessage('Please enter a valid email address.');
            return false;
        }
        
        return true;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showSuccessMessage() {
        this.showMessage('Thank you for your message! Your email client should open shortly.', 'success');
    }
    
    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }
    
    showMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 0.5rem;
            font-weight: 500;
            ${type === 'success' 
                ? 'background: hsl(120 100% 95%); color: hsl(120 100% 25%); border: 1px solid hsl(120 100% 85%);'
                : 'background: hsl(0 100% 95%); color: hsl(0 100% 25%); border: 1px solid hsl(0 100% 85%);'
            }
        `;
        
        // Insert message
        this.form.insertBefore(messageElement, this.form.firstChild);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
}

// Back to top functionality
class BackToTop {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        window.addEventListener('scroll', () => this.handleScroll());
        this.button.addEventListener('click', () => this.scrollToTop());
    }
    
    handleScroll() {
        if (window.scrollY > 500) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Typing animation for hero section
class TypingAnimation {
    constructor() {
        this.element = document.querySelector('.hero-subtitle');
        this.texts = [
            'Postdoctoral Young Professional',
            'Environmental Science Researcher',
            'Remote Sensing Expert',
            'Geospatial Technology Specialist'
        ];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.init();
    }
    
    init() {
        if (!this.element) return;
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }
        
        let typeSpeed = this.isDeleting ? 50 : 100;
        
        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            typeSpeed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Statistics counter animation
class StatsCounter {
    constructor() {
        this.statsElements = document.querySelectorAll('.stat-item h4, .pub-stat h3');
        this.init();
    }
    
    init() {
        this.observeStats();
    }
    
    observeStats() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.statsElements.forEach(el => observer.observe(el));
    }
    
    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const prefix = element.textContent.replace(/[\d]/g, '');
        let current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                element.textContent = prefix.replace(/\d+/, Math.floor(current));
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = element.textContent.replace(/\d+/, target);
            }
        };
        
        updateCounter();
    }
}

// Theme switcher (if needed in future)
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }
    
    init() {
        this.applyTheme();
    }
    
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
    }
    
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }
}

// Lazy loading for images (if images are added later)
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('[data-src]');
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.lazyLoad();
        } else {
            this.loadAllImages();
        }
    }
    
    lazyLoad() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        this.images.forEach(img => imageObserver.observe(img));
    }
    
    loadAllImages() {
        this.images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Search functionality for publications (enhanced feature)
class PublicationSearch {
    constructor() {
        this.searchInput = this.createSearchInput();
        this.publicationItems = document.querySelectorAll('.publication-item');
        this.init();
    }
    
    createSearchInput() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'publication-search';
        searchContainer.style.cssText = `
            margin-bottom: 2rem;
            display: flex;
            justify-content: center;
        `;
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search publications...';
        searchInput.style.cssText = `
            width: 100%;
            max-width: 400px;
            padding: 1rem;
            border: 2px solid hsl(var(--border-color));
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: all 0.3s ease;
        `;
        
        searchContainer.appendChild(searchInput);
        
        const publicationsSection = document.querySelector('.publications-filter');
        if (publicationsSection) {
            publicationsSection.parentNode.insertBefore(searchContainer, publicationsSection.nextSibling);
        }
        
        return searchInput;
    }
    
    init() {
        if (!this.searchInput) return;
        
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
    }
    
    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        this.publicationItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const authors = item.querySelector('.pub-authors').textContent.toLowerCase();
            const journal = item.querySelector('.pub-journal').textContent.toLowerCase();
            
            const matches = title.includes(term) || authors.includes(term) || journal.includes(term);
            
            if (matches || term === '') {
                item.style.display = 'block';
                item.style.opacity = '1';
            } else {
                item.style.opacity = '0.3';
            }
        });
    }
}

// Progress indicators for reading
class ReadingProgress {
    constructor() {
        this.progressBar = this.createProgressBar();
        this.init();
    }
    
    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, hsl(var(--primary-color)), hsl(var(--accent-color)));
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        return progressBar;
    }
    
    init() {
        window.addEventListener('scroll', () => this.updateProgress());
    }
    
    updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        this.progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    new Navigation();
    new ScrollAnimations();
    new PublicationsFilter();
    new ContactForm();
    new BackToTop();
    
    // Enhanced features
    new TypingAnimation();
    new StatsCounter();
    new LazyLoader();
    new PublicationSearch();
    new ReadingProgress();
    new ThemeManager();
    
    // Add loading animation
    document.body.classList.add('loaded');
    
    console.log('Dr. Alok Raj\'s Portfolio Website Loaded Successfully! 🎓');
});

// Handle external links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="http"]')) {
        e.target.setAttribute('target', '_blank');
        e.target.setAttribute('rel', 'noopener noreferrer');
    }
});

// Service Worker registration (for future PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker registration would go here
        console.log('Service Worker support detected');
    });
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Portfolio Error:', e.error);
});

// Performance monitoring
window.addEventListener('load', () => {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Portfolio loaded in ${loadTime}ms`);
    }
});
