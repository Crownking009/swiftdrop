// ===== SWIFTDROP MAIN JAVASCRIPT =====

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MOBILE MENU TOGGLE =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navButtons = document.querySelector('.nav-buttons');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            navButtons.classList.toggle('active');
            
            // Animate hamburger
            const spans = hamburger.querySelectorAll('span');
            if (hamburger.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow on scroll
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
        
        // Hide/show navbar on scroll (optional)
        // Uncomment below if you want navbar to hide on scroll down
        /*
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        */
        
        lastScroll = currentScroll;
    });
    
    // ===== ANIMATED COUNTER =====
    const counters = document.querySelectorAll('.counter');
    let counterAnimated = false;
    
    function animateCounters() {
        if (counterAnimated) return;
        
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60 FPS
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    // Handle decimal numbers
                    if (target % 1 !== 0) {
                        counter.textContent = current.toFixed(1);
                    } else {
                        counter.textContent = Math.floor(current).toLocaleString();
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    // Final value
                    if (target % 1 !== 0) {
                        counter.textContent = target.toFixed(1);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                }
            };
            
            updateCounter();
        });
        
        counterAnimated = true;
    }
    
    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class
                entry.target.classList.add('animate-in');
                
                // Trigger counter animation if it's a stat section
                if (entry.target.closest('.hero-stats') && !counterAnimated) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animateElements = document.querySelectorAll('.feature-card, .step, .testimonial-card, .stat');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ===== FORM VALIDATION (for future forms) =====
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePhone(phone) {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }
    
    // ===== BUTTON RIPPLE EFFECT =====
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // ===== PARALLAX EFFECT FOR HERO =====
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContent && heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            
            if (scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${rate}px)`;
                heroImage.style.transform = `translateY(${rate * 0.5}px)`;
            }
        });
    }
    
    // ===== LAZY LOADING IMAGES (for future use) =====
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
    
    // ===== SCROLL PROGRESS BAR (optional) =====
    function createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.classList.add('scroll-progress');
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', function() {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
    
    // Uncomment to enable scroll progress bar
    // createScrollProgress();
    
    // ===== TOAST NOTIFICATION SYSTEM =====
    window.showToast = function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };
    
    // ===== COPY TO CLIPBOARD =====
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Failed to copy', 'error');
        });
    };
    
    // ===== MODAL SYSTEM (for future use) =====
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    };
    
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
    };
    
    // Close modal on outside click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
    
    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // ===== CONSOLE MESSAGE =====
    console.log('%c🚀 SwiftDrop Platform', 'color: #007BFF; font-size: 20px; font-weight: bold;');
    console.log('%cDeliver Smarter. Faster. Easier.', 'color: #FFD700; font-size: 14px;');
    console.log('%cDeveloped with ❤️', 'color: #666; font-size: 12px;');
    
    // ===== PAGE LOAD COMPLETE =====
    window.addEventListener('load', function() {
        // Add loaded class to body
        document.body.classList.add('page-loaded');
        
        // Trigger counter if hero stats are visible
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats && isElementInViewport(heroStats)) {
            animateCounters();
        }
    });
    
    // ===== UTILITY: CHECK IF ELEMENT IS IN VIEWPORT =====
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // ===== FORM HANDLER (for future forms) =====
    window.handleFormSubmit = function(formId, successCallback) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Show loading
            const submitBtn = form.querySelector('[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Please wait...';
            submitBtn.disabled = true;
            
            // Simulate API call (replace with actual API call)
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                if (successCallback) {
                    successCallback(data);
                }
                
                showToast('Form submitted successfully!', 'success');
                form.reset();
            }, 2000);
        });
    };
    
});

// ===== ADD ANIMATION KEYFRAMES FOR TOAST =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
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
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .page-loaded {
        /* Add any page loaded styles here */
    }
    
    /* Mobile menu styles */
    @media (max-width: 968px) {
        .nav-menu, .nav-buttons {
            position: fixed;
            top: 70px;
            left: 0;
            width: 100%;
            background: white;
            flex-direction: column;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 999;
        }
        
        .nav-menu.active, .nav-buttons.active {
            display: flex;
            transform: translateX(0);
        }
        
        .nav-menu {
            gap: 15px;
        }
        
        .nav-buttons {
            top: auto;
            bottom: 0;
            padding: 20px;
            border-top: 1px solid #f0f0f0;
        }
    }
`;
document.head.appendChild(style);



// ===== ACTIVE NAV LINK menu=====

    (function () {
      // find nav links and mark the one matching the current filename as active
      const navLinks = document.querySelectorAll('.nav-menu a');
      if (!navLinks.length) return;

      const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

      navLinks.forEach(link => {
        const href = (link.getAttribute('href') || '').split('/').pop().toLowerCase();
        // match index/page names; treat empty href as index
        if (!href && (current === '' || current === 'index.html')) {
          link.classList.add('active');
        } else if (href === current || (current === '' && href === 'index.html')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }

        // keep active on click (for non-navigation demos)
        link.addEventListener('click', () => {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        });
      });
    })();
 



document.getElementById('calculateBtn').addEventListener('click', function() {
    const pickup = document.getElementById('pickupLocation').value;
    const delivery = document.getElementById('deliveryLocation').value;
    const packageSize = document.getElementById('packageSize').value;
    const speed = document.getElementById('deliverySpeed').value;

    if (!pickup || !delivery || !packageSize || !speed) {
        alert('Please fill in all fields to calculate price');
        return;
    }

    // Base prices
    let basePrice = 0;
    
    // Calculate base price by route
    if (pickup === 'mainland' && delivery === 'mainland') {
        basePrice = 1500;
    } else if (pickup === 'island' && delivery === 'island') {
        basePrice = 2000;
    } else {
        // Cross location (mainland to island or vice versa)
        basePrice = 3500;
    }

    // Adjust for package size
    const sizeMultipliers = {
        'small': 1,
        'medium': 1.5,
        'large': 2,
        'xlarge': 2.5
    };
    basePrice *= sizeMultipliers[packageSize];

    // Adjust for delivery speed (discounts for slower delivery)
    const speedMultipliers = {
        'express': 1,
        'nextday': 0.8,  // 20% discount
        'twoday': 0.7    // 30% discount
    };
    basePrice *= speedMultipliers[speed];

    // Round to nearest 50
    const finalPrice = Math.round(basePrice / 50) * 50;

    // Display result
    document.getElementById('estimatedPrice').textContent = finalPrice.toLocaleString();
    document.getElementById('priceResult').style.display = 'block';
    
    // Smooth scroll to result
    document.getElementById('priceResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});