document.addEventListener("DOMContentLoaded", function() {
    "use strict";

    // ================== Mobile Viewport Height Fix ==================
    function setRealViewportHeight() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    // Initialize and update viewport height
    setRealViewportHeight();
    window.addEventListener('resize', setRealViewportHeight);
    window.addEventListener('orientationchange', setRealViewportHeight);

    // ================== Debounce Function for Performance ==================
    function debounce(func, wait = 100) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(this, args);
            }, wait);
        };
    }

    // ================== Typing Animation ==================
    const typingElement = document.querySelector(".typing");
    if (typingElement && typeof Typed !== 'undefined') {
        const typedOptions = {
            strings: ["Full-Stack Web Developer",  "Lecturer", "UI/UX Designer"],
            typeSpeed: 100,
            backSpeed: 60,
            loop: true,
            // Reduce animation intensity on mobile
            ...(window.innerWidth < 768 && {
                typeSpeed: 120,
                backSpeed: 80
            })
        };
        
        var typed = new Typed(".typing", typedOptions);
    }

    // ================== Navigation ==================
    const navToggler = document.querySelector(".nav-toggler");
    const aside = document.querySelector(".aside");
    const nav = document.querySelector(".nav");
    const mainContent = document.querySelector(".main-content");
    const allSections = document.querySelectorAll(".section");

    function asideSectionTogglerBtn() {
        aside.classList.toggle("open");
        navToggler.classList.toggle("open");
        mainContent.classList.toggle("active");
        document.body.classList.toggle("sidebar-open");
        
        // Lock body scroll when sidebar is open
        if (aside.classList.contains("open")) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
    }

    // Add both click and optimized touch events
    if (navToggler) {
        navToggler.addEventListener("click", asideSectionTogglerBtn);
        navToggler.addEventListener("touchend", function(e) {
            e.preventDefault();
            asideSectionTogglerBtn();
        }, { passive: false });
    }

    // Close menu when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (aside.classList.contains('open') && 
            !e.target.closest('.aside') && 
            !e.target.closest('.nav-toggler')) {
            asideSectionTogglerBtn();
        }
    });

    // Handle navigation with smooth scrolling
    if (nav && allSections) {
        nav.querySelectorAll("li a").forEach(link => {
            // Click event
            link.addEventListener("click", function(e) {
                e.preventDefault();
                
                // Update active nav link
                nav.querySelectorAll("li a").forEach(navLink => navLink.classList.remove("active"));
                this.classList.add("active");

                const targetId = this.getAttribute("href");
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Update section visibility
                    allSections.forEach(section => {
                        section.classList.remove("active");
                        section.classList.add("back-section");
                        
                        if (section.id === targetId.split("#")[1]) {
                            section.classList.add("active");
                            section.classList.remove("back-section");
                        }
                    });

                    // Smooth scroll with offset for header
                    const offset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }

                // Close sidebar if open (mobile)
                if (aside.classList.contains("open")) {
                    asideSectionTogglerBtn();
                }
            });

            // Touch event for mobile
            link.addEventListener('touchend', function(e) {
                e.preventDefault();
                this.click();
            }, { passive: false });
        });
    }

    // ================== Initial Section Activation ==================
    function activateInitialSection() {
        const currentHash = window.location.hash;
        if (currentHash) {
            const initialTargetSection = document.querySelector(currentHash);
            const initialTargetLink = document.querySelector(`.nav li a[href="${currentHash}"]`);

            if (initialTargetSection && initialTargetLink) {
                document.querySelector('.nav li a.active')?.classList.remove('active');
                document.querySelector('.section.active')?.classList.remove('active');

                initialTargetLink.classList.add('active');
                initialTargetSection.classList.add('active');

                allSections.forEach(section => {
                    if (section.id !== initialTargetSection.id) {
                        section.classList.add('back-section');
                    } else {
                        section.classList.remove('back-section');
                    }
                });
            }
        } else {
            // Default to Home section
            const homeLink = document.querySelector('.nav li a[href="#home"]');
            const homeSection = document.getElementById('home');
            if (homeLink) homeLink.classList.add('active');
            if (homeSection) homeSection.classList.add('active');
            
            allSections.forEach(section => {
                if (section.id !== 'home') {
                    section.classList.add('back-section');
                }
            });
        }
    }

    activateInitialSection();

    // ================== Style Switcher ==================
    const styleSwitcher = document.querySelector(".style-switcher");
    const styleSwitcherToggler = document.querySelector(".style-switcher-toggler");

    if (styleSwitcher && styleSwitcherToggler) {
        styleSwitcherToggler.addEventListener("click", () => {
            styleSwitcher.classList.toggle("open");
        });

        // Add touch support
        styleSwitcherToggler.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.click();
        }, { passive: false });

        // Hide on scroll with debounce
        window.addEventListener("scroll", debounce(() => {
            if (styleSwitcher.classList.contains("open")) {
                styleSwitcher.classList.remove("open");
            }
        }));
    }

    // ================== Theme Colors ==================
    const alternateStyles = document.querySelectorAll(".alternate-style");

    window.setActiveStyle = function(color) {
        alternateStyles.forEach((style) => {
            if (color === style.getAttribute("title")) {
                style.removeAttribute("disabled");
            } else {
                style.setAttribute("disabled", "true");
            }
        });
        localStorage.setItem("color", color);
    };

    // Load saved color
    const storedColor = localStorage.getItem("color");
    if (storedColor) {
        setActiveStyle(storedColor);
    } else {
        setActiveStyle("color-1");
    }

    // ================== Day / Night Mode ==================
    const dayNight = document.querySelector(".day-night");

    if (dayNight) {
        // Click handler
        dayNight.addEventListener("click", () => {
            const icon = dayNight.querySelector("i");
            icon.classList.toggle("fa-sun");
            icon.classList.toggle("fa-moon");
            document.body.classList.toggle("dark");
            localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
        });

        // Touch support
        dayNight.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.click();
        }, { passive: false });

        // Apply saved theme
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            if (storedTheme === "dark") {
                document.body.classList.add("dark");
                dayNight.querySelector("i")?.classList.remove("fa-moon");
                dayNight.querySelector("i")?.classList.add("fa-sun");
            } else {
                document.body.classList.remove("dark");
                dayNight.querySelector("i")?.classList.remove("fa-sun");
                dayNight.querySelector("i")?.classList.add("fa-moon");
            }
        } else if (dayNight) {
            dayNight.querySelector("i")?.classList.remove("fa-sun");
            dayNight.querySelector("i")?.classList.add("fa-moon");
        }
    }

    // ================== Passive Event Listeners for Performance ==================
    document.addEventListener('touchstart', function() {}, { passive: true });
});
function sendmail() {
    const templateparams = {
        name: document.querySelector('[name="name"]').value,
        email: document.querySelector('[name="email"]').value,
        subject: document.querySelector('[name="subject"]').value,
        message: document.querySelector('[name="message"]').value,
    };

    emailjs.send("service_ifnquml", "template_km32odg", templateparams)
        .then(() => alert("Email sent!!"))
        .catch(() => alert("Email not sent!!"));
}
