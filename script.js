document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Navigation Menu Toggle (Mobile) ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // --- 2. Header Scroll Effect ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // --- 3. Active Link Highlighter on Scroll ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 250)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- 4. Stats Counter Animation ---
    const statsSection = document.querySelector('.stats-row');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const prefix = stat.getAttribute('data-prefix') || '';
            const suffix = stat.getAttribute('data-suffix') || '';
            let current = 0;
            const increment = target / 50; // speed
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    stat.textContent = prefix + Math.ceil(current) + suffix;
                    setTimeout(updateCounter, 25);
                } else {
                    stat.textContent = prefix + target + suffix;
                }
            };
            updateCounter();
        });
    };

    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animateStats();
                    animated = true;
                }
            });
        }, { threshold: 0.3 });
        observer.observe(statsSection);
    }

    // --- 5. Skill Bar Animation ---
    const skillCards = document.querySelectorAll('.skill-card');
    const animateSkillBars = () => {
        document.querySelectorAll('.skill-bar-inner').forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
        });
    };

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        observer.observe(skillsSection);
    }

    // --- 6. Skills Filter Logic ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            skillCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    // Re-trigger bar animation if visible
                    setTimeout(() => {
                        const bar = card.querySelector('.skill-bar-inner');
                        bar.style.width = bar.getAttribute('data-width');
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- 7. Contact Form Handler (Mock Submission) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get values
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (!name || !email || !subject || !message) {
                formStatus.textContent = 'Please fill out all fields.';
                formStatus.className = 'form-status-msg error';
                return;
            }

            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending Message...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                formStatus.textContent = `Thank you, ${name}! Your message was successfully recorded. I will contact you at ${email} shortly.`;
                formStatus.className = 'form-status-msg success';
                
                // Save to local storage for demo verification
                const submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
                submissions.push({ name, email, subject, message, date: new Date().toISOString() });
                localStorage.setItem('contact_submissions', JSON.stringify(submissions));

                contactForm.reset();
                
                // Hide message after 8 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 8000);
            }, 1500);
        });
    }

    // --- 8. Portfolio Category Filter Logic ---
    const workFilterButtons = document.querySelectorAll('.work-filter-btn');
    const workCards = document.querySelectorAll('.work-card');
    const worksGrid = document.querySelector('.works-grid');

    workFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            workFilterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            // Dynamic grid layout adjustments for 9:16 promotional video aspect ratios
            if (worksGrid) {
                if (filterValue === 'promo-video') {
                    worksGrid.classList.add('promo-active');
                } else {
                    worksGrid.classList.remove('promo-active');
                }
            }
            
            workCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    // Trigger fade in animation
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Initialize the default filter state on load
    const activeFilterBtn = document.querySelector('.work-filter-btn.active');
    if (activeFilterBtn) {
        activeFilterBtn.click();
    }

    // --- 9. Portfolio Details Modal Logic ---
    const worksModal = document.getElementById('works-modal');
    const worksModalClose = document.getElementById('works-modal-close');
    const worksModalOverlay = document.getElementById('works-modal-overlay');

    const modalCategory = document.getElementById('modal-project-category');
    const modalTitle = document.getElementById('modal-project-title');
    const modalDesc = document.getElementById('modal-project-description');
    const modalDetails = document.getElementById('modal-project-details');
    const modalTagsContainer = document.getElementById('modal-project-tags');
    const modalMediaContainer = document.querySelector('.works-modal-media');

    const openModal = (card) => {
        // Retrieve data fields from card attributes
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');
        const details = card.getAttribute('data-details');
        const img = card.getAttribute('data-image');
        const videoUrl = card.getAttribute('data-video-url');
        const tags = card.getAttribute('data-tags') ? card.getAttribute('data-tags').split(',') : [];
        const categoryLabel = card.querySelector('.work-category-badge').textContent;

        // Clear media container first
        modalMediaContainer.innerHTML = '';

        if (videoUrl) {
            if (videoUrl.toLowerCase().endsWith('.mp4') || videoUrl.toLowerCase().includes('.mp4')) {
                // Render local MP4 video player
                const videoEl = document.createElement('video');
                videoEl.setAttribute('src', videoUrl);
                videoEl.setAttribute('controls', 'true');
                videoEl.setAttribute('autoplay', 'true');
                modalMediaContainer.appendChild(videoEl);
            } else {
                // Render YouTube iframe (use youtube-nocookie.com and strict-origin-when-cross-origin to fix referrer issues)
                const secureUrl = videoUrl.replace('youtube.com', 'youtube-nocookie.com');
                const iframe = document.createElement('iframe');
                iframe.setAttribute('src', secureUrl);
                iframe.setAttribute('title', title);
                iframe.setAttribute('width', '100%');
                iframe.setAttribute('height', '100%');
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
                iframe.setAttribute('allowfullscreen', 'true');
                modalMediaContainer.appendChild(iframe);
            }
        } else {
            // Render standard image
            const imgEl = document.createElement('img');
            imgEl.id = 'modal-project-img';
            imgEl.src = img;
            imgEl.alt = title;
            modalMediaContainer.appendChild(imgEl);
        }

        // Populate text fields
        modalCategory.textContent = categoryLabel;
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        modalDetails.innerHTML = details;

        // Render tags
        modalTagsContainer.innerHTML = '';
        tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'project-modal-tag';
            span.textContent = tag.trim();
            modalTagsContainer.appendChild(span);
        });

        // Toggle Modal open classes
        worksModal.classList.add('open');
        worksModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Disable page scrolling
    };

    const closeModal = () => {
        worksModal.classList.remove('open');
        worksModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Re-enable page scrolling
        
        // Clear media container to stop any playing videos
        setTimeout(() => {
            modalMediaContainer.innerHTML = '';
        }, 300);
    };

    // Attach click listeners to cards
    workCards.forEach(card => {
        if (card.classList.contains('video-card-direct')) {
            return;
        }
        card.addEventListener('click', () => {
            openModal(card);
        });
    });

    // Modal close events
    if (worksModalClose) {
        worksModalClose.addEventListener('click', closeModal);
    }
    if (worksModalOverlay) {
        worksModalOverlay.addEventListener('click', closeModal);
    }

    // Close on ESC key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && worksModal && worksModal.classList.contains('open')) {
            closeModal();
        }
    });
});

