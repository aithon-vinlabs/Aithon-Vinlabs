document.addEventListener("DOMContentLoaded", () => {

    // ==================== MOBILE MENU TOGGLE ====================
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
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

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove("active");
                const icon = menuToggle.querySelector("i");
                icon.classList.remove("fa-times");
                icon.classList.add("fa-bars");
            }
        });
    }

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

    // ==================== ENHANCED FORM VALIDATION ====================
    const form = document.getElementById('contact-form');
    const formResponse = document.getElementById('form-response');

    // Validation rules
    const validationRules = {
        name: {
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s'-]+$/,
            errorMessages: {
                required: 'Name is required',
                minLength: 'Name must be at least 2 characters',
                maxLength: 'Name cannot exceed 50 characters',
                pattern: 'Name can only contain letters, spaces, hyphens, and apostrophes'
            }
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
            errorMessages: {
                required: 'Email is required',
                pattern: 'Please enter a valid email address (e.g., user@example.com)'
            }
        },
        phone: {
            pattern: /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
            errorMessages: {
                pattern: 'Please enter a valid phone number'
            }
        },
        message: {
            minLength: 10,
            maxLength: 1000,
            errorMessages: {
                required: 'Message is required',
                minLength: 'Message must be at least 10 characters',
                maxLength: 'Message cannot exceed 1000 characters'
            }
        },
        projectType: {
            errorMessages: {
                required: 'Please select a project type'
            }
        }
    };

    // Real-time validation function
    function validateField(input) {
        const fieldName = input.name || input.id;
        const value = input.value.trim();
        const rules = validationRules[fieldName];
        const errorElement = document.getElementById(`${fieldName}-error`);

        if (!rules) return true;

        let isValid = true;
        let errorMessage = '';

        // Check if required
        if (!value && rules.errorMessages.required) {
            isValid = false;
            errorMessage = rules.errorMessages.required;
        }
        // Check minimum length
        else if (rules.minLength && value.length > 0 && value.length < rules.minLength) {
            isValid = false;
            errorMessage = rules.errorMessages.minLength;
        }
        // Check maximum length
        else if (rules.maxLength && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = rules.errorMessages.maxLength;
        }
        // Check pattern
        else if (rules.pattern && value.length > 0 && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.errorMessages.pattern;
        }

        // Update UI
        if (errorElement) {
            if (isValid || value.length === 0) {
                errorElement.textContent = '';
                errorElement.classList.add('hidden');
                input.classList.remove('invalid');
                input.classList.add('valid');
            } else {
                errorElement.textContent = errorMessage;
                errorElement.classList.remove('hidden');
                input.classList.add('invalid');
                input.classList.remove('valid');
            }
        }

        return isValid || value.length === 0;
    }

    // Add real-time validation to all form inputs
    if (form) {
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            // Validate on blur (when user leaves the field)
            input.addEventListener('blur', function() {
                validateField(this);
            });

            // Clear error on focus
            input.addEventListener('focus', function() {
                const errorElement = document.getElementById(`${this.name || this.id}-error`);
                if (errorElement) {
                    errorElement.classList.add('hidden');
                }
                this.classList.remove('invalid');
            });

            // Real-time validation for text inputs (with debounce)
            if (input.type === 'text' || input.type === 'email' || input.tagName === 'TEXTAREA') {
                let timeout;
                input.addEventListener('input', function() {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        if (this.value.trim().length > 0) {
                            validateField(this);
                        }
                    }, 500); // 500ms debounce
                });
            }
        });
    }

    // ==================== FORM SUBMISSION HANDLER ====================
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validate all fields before submission
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            let isFormValid = true;

            inputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                // Show error message
                showFormMessage('Please fix the errors above before submitting.', 'error');
                return;
            }

            // Get submit button
            const submitButton = form.querySelector('.submit-button') || form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;

            // Disable submit button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.classList.add('loading');

            // Clear previous messages
            if (formResponse) {
                formResponse.textContent = '';
                formResponse.classList.remove('hidden', 'success-message', 'error-message');
            }

            try {
                const formData = new FormData(form);

                // Add timestamp
                formData.append('timestamp', new Date().toISOString());

                // Send the form data to Web3Forms
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    // Success - show success message
                    showFormMessage('✓ Message sent successfully! We\'ll get back to you within 24 hours.', 'success');

                    // Reset form
                    form.reset();

                    // Remove validation classes
                    inputs.forEach(input => {
                        input.classList.remove('valid', 'invalid');
                    });

                    // Track successful submission (if you have analytics)
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submission', {
                            'event_category': 'Contact',
                            'event_label': 'Contact Form'
                        });
                    }

                    // Hide success message after 6 seconds
                    setTimeout(() => {
                        if (formResponse) {
                            formResponse.classList.add('hidden');
                        }
                    }, 6000);

                } else {
                    // Server returned error
                    showFormMessage('✗ Failed to send message. Please try again or email us directly at contact@example.com', 'error');
                }

            } catch (error) {
                // Network error or other issues
                console.error('Form submission error:', error);
                showFormMessage('✗ Network error. Please check your internet connection and try again.', 'error');
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                submitButton.classList.remove('loading');
            }
        });
    }

    // Helper function to show form messages
    function showFormMessage(message, type) {
        if (formResponse) {
            formResponse.textContent = message;
            formResponse.classList.remove('hidden', 'success-message', 'error-message');
            formResponse.classList.add(type === 'success' ? 'success-message' : 'error-message');

            // Scroll to message
            formResponse.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            // Fallback to alert if formResponse element doesn't exist
            alert(message);
        }
    }

    // ==================== CHARACTER COUNTER FOR TEXTAREA ====================
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        const maxLength = validationRules.message.maxLength;

        // Create character counter element
        const counterDiv = document.createElement('div');
        counterDiv.className = 'character-counter';
        counterDiv.style.textAlign = 'right';
        counterDiv.style.fontSize = '0.85rem';
        counterDiv.style.marginTop = '5px';
        counterDiv.style.color = '#666';

        messageTextarea.parentNode.insertBefore(counterDiv, messageTextarea.nextSibling);

        messageTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            counterDiv.textContent = `${currentLength} / ${maxLength} characters`;

            if (currentLength > maxLength) {
                counterDiv.style.color = '#ef4444';
            } else if (currentLength > maxLength * 0.9) {
                counterDiv.style.color = '#f59e0b';
            } else {
                counterDiv.style.color = '#666';
            }
        });

        // Initialize counter
        messageTextarea.dispatchEvent(new Event('input'));
    }

    // ==================== DYNAMIC STYLES ====================
    const style = document.createElement('style');
    style.textContent = `
        /* Success and Error Messages */
        .success-message {
            color: #10b981;
            background-color: #d1fae5;
            border: 1px solid #10b981;
            padding: 12px 16px;
            border-radius: 8px;
            display: block;
            margin-top: 15px;
            font-weight: 500;
            animation: slideDown 0.3s ease-out;
        }

        .error-message {
            color: #ef4444;
            background-color: #fee2e2;
            border: 1px solid #ef4444;
            padding: 12px 16px;
            border-radius: 8px;
            display: block;
            margin-top: 15px;
            font-weight: 500;
            animation: slideDown 0.3s ease-out;
        }

        .error-message.hidden,
        .success-message.hidden {
            display: none;
        }

        /* Field Validation States */
        .form-input.invalid,
        .form-textarea.invalid,
        .form-select.invalid {
            border-color: #ef4444 !important;
            background-color: #fef2f2;
        }

        .form-input.valid,
        .form-textarea.valid,
        .form-select.valid {
            border-color: #10b981 !important;
        }

        /* Error Message Styling */
        .field-error {
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 5px;
            display: block;
            animation: fadeIn 0.2s ease-in;
        }

        .field-error.hidden {
            display: none;
        }

        /* Submit Button States */
        .submit-button:disabled,
        .submit-button.loading {
            opacity: 0.6;
            cursor: not-allowed;
            pointer-events: none;
        }

        .submit-button.loading {
            position: relative;
        }

        /* Animations */
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        /* Scroll button smooth fade */
        #scrollUpBtn {
            transition: opacity 0.3s ease-in-out;
        }

        /* Focus states for accessibility */
        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
        }

        /* Character counter */
        .character-counter {
            transition: color 0.2s ease;
        }
    `;
    document.head.appendChild(style);

    // ==================== FLOATING BUTTON FUNCTIONALITY ====================
    const mainButton = document.querySelector('.main-button');
    const buttonContainer = document.querySelector('.button-container');

    if (mainButton && buttonContainer) {
        mainButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            buttonContainer.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!buttonContainer.contains(e.target)) {
                buttonContainer.classList.remove('active');
            }
        });
    }

    // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Close mobile menu if open
                    if (navLinks && navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        const icon = menuToggle.querySelector('i');
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });
});
