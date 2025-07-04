document.addEventListener("DOMContentLoaded", function() {
    "use strict"; // Enforce stricter parsing and error handling

    /* ========================= Typing Animation ========================= */
    // Ensure the .typing element exists before initializing Typed.js
    
    const typingElement = document.querySelector(".typing");
    if (typingElement) {
        // Make sure Typed.js library is loaded before this script runs
        // (i.e., its <script> tag comes before script.js in index.html)
        var typed = new Typed(".typing", {
            strings: ["Web Developer", "Front-End Engineer", "Lecturer", "UI/UX Designer"],
            typeSpeed: 100,
            backSpeed: 60, // Corrected to 'backSpeed' (lowercase 'b') for Typed.js
            loop: true
        });
    }

    /* ========================= Aside (Sidebar) Toggler & Navigation ========================= */
    const navToggler = document.querySelector(".nav-toggler");
    const aside = document.querySelector(".aside");
    const nav = document.querySelector(".nav");
    const mainContent = document.querySelector(".main-content");
    const allSections = document.querySelectorAll(".section");

    // Function to toggle sidebar and main content visibility/layout
    function asideSectionTogglerBtn() {
        if (aside && navToggler && mainContent) {
            aside.classList.toggle("open");
            navToggler.classList.toggle("open");
            // Assuming 'active' class on main-content adjusts its width/margin
            mainContent.classList.toggle("active"); 
        }
    }

    // Toggle sidebar on nav-toggler click
    if (navToggler) {
        navToggler.addEventListener("click", () => {
            asideSectionTogglerBtn();
        });
    }

    // Handle navigation clicks
    if (nav && allSections && aside && navToggler && mainContent) {
        nav.querySelectorAll("li a").forEach(link => {
            link.addEventListener("click", function() {
                // Deactivate all nav links
                nav.querySelectorAll("li a").forEach(navLink => navLink.classList.remove("active"));
                // Activate the clicked nav link
                this.classList.add("active");

                // Get target section ID from href (e.g., "#home" -> "home")
                const targetId = this.getAttribute("href").split("#")[1];

                // Update section visibility and "back-section" class for transitions
                allSections.forEach(section => {
                    section.classList.remove("active"); // Deactivate all sections
                    section.classList.add("back-section"); // Add back-section to all for default state

                    if (section.id === targetId) {
                        section.classList.add("active"); // Activate target section
                        section.classList.remove("back-section"); // Remove back-section from active
                    }
                });

                // If sidebar is open (on mobile), close it after clicking a link
                if (aside.classList.contains("open")) {
                    asideSectionTogglerBtn();
                }
            });
        });
    }

    // Initial section activation on page load (handles direct URL access or refresh)
    const currentHash = window.location.hash;
    if (currentHash) {
        const initialTargetSection = document.querySelector(currentHash);
        const initialTargetLink = document.querySelector(`.nav li a[href="${currentHash}"]`);

        if (initialTargetSection && initialTargetLink) {
            // Remove active from any default/initial link/section
            document.querySelector('.nav li a.active')?.classList.remove('active');
            document.querySelector('.section.active')?.classList.remove('active');

            // Add active to the one matching the hash
            initialTargetLink.classList.add('active');
            initialTargetSection.classList.add('active');

            // Set other sections to back-section for transitions
            allSections.forEach(section => {
                if (section.id !== initialTargetSection.id) {
                    section.classList.add('back-section');
                } else {
                    section.classList.remove('back-section'); // Ensure active section doesn't have it
                }
            });
        }
    } else {
        // Default to Home section if no hash is present
        const homeLink = document.querySelector('.nav li a[href="#home"]');
        const homeSection = document.getElementById('home');
        if (homeLink) homeLink.classList.add('active');
        if (homeSection) homeSection.classList.add('active');
        
        // Ensure all other sections start with 'back-section' if home is active by default
        allSections.forEach(section => {
            if (section.id !== 'home') {
                section.classList.add('back-section');
            }
        });
    }

    /* ========================= Style Switcher ========================= */
    const styleSwitcher = document.querySelector(".style-switcher");
    const styleSwitcherToggler = document.querySelector(".style-switcher-toggler");

    if (styleSwitcher && styleSwitcherToggler) {
        // Toggle style switcher panel open/close
        styleSwitcherToggler.addEventListener("click", () => {
            styleSwitcher.classList.toggle("open");
        });

        // Hide style switcher on scroll (for better user experience)
        window.addEventListener("scroll", () => {
            if (styleSwitcher.classList.contains("open")) {
                styleSwitcher.classList.remove("open");
            }
        });
    }

    /* ========================= Theme Colors ========================= */
    const alternateStyles = document.querySelectorAll(".alternate-style");

    // Function to set the active color theme based on 'title' attribute
    window.setActiveStyle = function(color) { // Make it global so onclick works
        alternateStyles.forEach((style) => {
            if (color === style.getAttribute("title")) {
                style.removeAttribute("disabled");
            } else {
                style.setAttribute("disabled", "true");
            }
        });
        // Save selected color to local storage
        localStorage.setItem("color", color);
    };

    // Load saved color from local storage on page load
    const storedColor = localStorage.getItem("color");
    if (storedColor) {
        setActiveStyle(storedColor); // Apply the saved color
    } else {
        // Default to 'color-1' if no color is saved in local storage
        setActiveStyle("color-1");
    }
    // In your initSidebarNavigation function
const toggleSidebar = () => {
    const aside = document.querySelector(".aside");
    const navToggler = document.querySelector(".nav-toggler");
    
    if (aside && navToggler) {
        aside.classList.toggle("open");
        navToggler.classList.toggle("open");
        
        // Change hamburger to X when open
        if (aside.classList.contains("open")) {
            navToggler.innerHTML = '<span class="close-icon">×</span>';
        } else {
            navToggler.innerHTML = '<span></span><span></span><span></span>';
        }
    }
};

    /* ========================= Day / Night Mode ========================= */
    const dayNight = document.querySelector(".day-night");

    if (dayNight) {
        dayNight.addEventListener("click", () => {
            const icon = dayNight.querySelector("i");
            // Toggle Font Awesome classes for sun/moon icons
            icon.classList.toggle("fa-sun");
            icon.classList.toggle("fa-moon");
            // Toggle 'dark' class on the body to switch between themes
            document.body.classList.toggle("dark");
            // Save theme preference to local storage
            localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
        });
    }

    // Apply saved theme on page load (ensuring dayNight element exists before manipulation)
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
        if (storedTheme === "dark") {
            document.body.classList.add("dark");
            if (dayNight) {
                dayNight.querySelector("i")?.classList.remove("fa-moon");
                dayNight.querySelector("i")?.classList.add("fa-sun");
            }
        } else {
            document.body.classList.remove("dark");
            if (dayNight) {
                dayNight.querySelector("i")?.classList.remove("fa-sun");
                dayNight.querySelector("i")?.classList.add("fa-moon");
            }
        }
    } else {
        // Default icon to moon (assuming default theme is light) if no theme saved
        if (dayNight) {
             dayNight.querySelector("i")?.classList.remove("fa-sun"); // Ensure no sun icon
             dayNight.querySelector("i")?.classList.add("fa-moon"); // Default to moon icon
        }
    }

}); // End of DOMContentLoaded