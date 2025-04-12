/**
 * CostaRicaHappyHour.com - Main JavaScript
 * Handles form submission, validation, and other interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Form handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Form is using the Getform.io service which handles the submission
            // This code adds client-side validation and explicit redirect
            
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const messageField = document.getElementById('message');
            
            let isValid = true;
            
            // Basic validation
            if (!nameField.value.trim()) {
                highlightField(nameField, 'Please enter your name');
                isValid = false;
            } else {
                resetField(nameField);
            }
            
            if (!emailField.value.trim()) {
                highlightField(emailField, 'Please enter your email');
                isValid = false;
            } else if (!isValidEmail(emailField.value)) {
                highlightField(emailField, 'Please enter a valid email address');
                isValid = false;
            } else {
                resetField(emailField);
            }
            
            if (!messageField.value.trim()) {
                highlightField(messageField, 'Please enter your message');
                isValid = false;
            } else {
                resetField(messageField);
            }
            
            if (!isValid) {
                e.preventDefault();
                return false;
            }
            
            // Use AJAX submission to ensure we can control the redirect
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            
            // Show loading indicator
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            fetch('https://getform.io/f/bolmoqya', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Set flag and explicitly redirect to thank-you page
                    localStorage.setItem('formSubmitted', 'true');
                    window.location.href = 'thank-you.html';
                } else {
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                    alert('There was a problem submitting the form. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                alert('There was a problem submitting the form. Please try again.');
            });
        });
    }
    
    // Check if user is coming from a form submission
    if (window.location.pathname.includes('thank-you') && !localStorage.getItem('formSubmitted')) {
        // If user navigated directly to thank you page without submitting form
        // Redirect to home page
        // Uncomment if you want to enforce this behavior
        // window.location.href = 'index.html';
    } else if (window.location.pathname.includes('thank-you')) {
        // Clear the flag once on thank you page
        localStorage.removeItem('formSubmitted');
    }
    
    // Helper functions
    function highlightField(field, message) {
        field.style.borderColor = '#e63946';
        
        // Check if error message already exists
        let errorElement = field.parentNode.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = '#e63946';
            errorElement.style.fontSize = '0.8rem';
            errorElement.style.marginTop = '5px';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    function resetField(field) {
        field.style.borderColor = '';
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Mobile menu toggle (if needed in the future)
    // const menuToggle = document.querySelector('.menu-toggle');
    // const navMenu = document.querySelector('nav ul');
    
    // if (menuToggle && navMenu) {
    //     menuToggle.addEventListener('click', function() {
    //         navMenu.classList.toggle('active');
    //         menuToggle.classList.toggle('active');
    //     });
    // }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
});
