document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        const icon = menuToggle.querySelector("i");
        if (navLinks.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-times");
        } else {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        }
    });

    // --- Scroll to top with progress indicator ---
    const scrollBtn = document.getElementById("scrollUpBtn");
    if (scrollBtn) {
        const circle = scrollBtn.querySelector(".progress-circle .progress");
        // The radius of the circle in the SVG is 15.9155.
        const circumference = 2 * Math.PI * 15.9155;

        if (circle) {
            // Set initial dash array and offset
            circle.style.strokeDasharray = `${circumference}`;
            circle.style.strokeDashoffset = `${circumference}`;
        }

        window.addEventListener("scroll", () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

            // Animate progress circle
            if (circle) {
                const offset = circumference * (1 - scrollPercent);
                circle.style.strokeDashoffset = offset;
            }

            // Show/hide button
            scrollBtn.style.display = scrollTop > 100 ? "block" : "none";
        });

        scrollBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // --- Contact Form Validation ---
    const form = document.getElementById("contact-form");
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("email-error");

    if (form && emailInput) {
        // Email validation function
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email); // Fixed: was .text(), should be .test()
        }

        // Real-time email validation
        emailInput.addEventListener("blur", function() {
            if (this.value && !isValidEmail(this.value)) {
                emailError.textContent = "Please enter a valid email address.";
                emailError.classList.remove("hidden");
                emailInput.classList.add("border-red-500");
            } else {
                emailError.classList.add("hidden");
                emailInput.classList.remove("border-red-500");
            }
        });

        // Form submission handler
        form.addEventListener("submit", function (event) {
            const emailIsValid = isValidEmail(emailInput.value);

            if (!emailIsValid) {
                event.preventDefault();
                emailError.textContent = "Please enter a valid email address.";
                emailError.classList.remove("hidden");
                emailInput.classList.add("border-red-500");
                emailInput.focus();
            } else {
                emailError.classList.add("hidden");
                emailInput.classList.remove("border-red-500");
                
                // Show loading state
                const submitBtn = form.querySelector('.submit-btn');
                const btnText = submitBtn.querySelector('.btn-text');
                const originalText = btnText.textContent;
                
                btnText.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Note: FormSubmit will handle the actual submission
                // The form will redirect after submission completes
            }
        });
    }

    const mainButton = document.querySelector('.main-button');
    const buttonContainer = document.querySelector('.button-container');
    
    mainButton.addEventListener('click', function(e) {
        e.preventDefault();
        buttonContainer.classList.toggle('active');
    });
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
        if (!buttonContainer.contains(e.target)) {
            buttonContainer.classList.remove('active');
        }
    });
});