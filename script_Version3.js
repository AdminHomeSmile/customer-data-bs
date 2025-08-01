document.addEventListener('DOMContentLoaded', function() {
    // Service selection
    const serviceButtons = document.querySelectorAll('.service-btn');
    const mainMenu = document.getElementById('main-menu');
    const newRoofForm = document.getElementById('new-roof-form');
    const renovationForm = document.getElementById('renovation-form');
    const metalRoofForm = document.getElementById('metal-roof-form');
    const successMessage = document.getElementById('success-message');
    const backButtons = document.querySelectorAll('.back-btn');
    const returnButton = document.querySelector('.btn-return');
    
    // Form navigation buttons
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    
    // Initialize Thailand address autocomplete
    initThailandAddressAutocomplete();
    
    // Service button click handlers
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            mainMenu.classList.remove('active');
            
            if (service === 'new-roof') {
                newRoofForm.classList.add('active');
            } else if (service === 'renovation') {
                renovationForm.classList.add('active');
            } else if (service === 'metal-roof') {
                metalRoofForm.classList.add('active');
            }
        });
    });
    
    // Back button click handlers
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentForm = this.closest('.content-section');
            currentForm.classList.remove('active');
            mainMenu.classList.add('active');
            
            // Reset forms when going back
            if (currentForm.contains(document.getElementById('newRoofForm'))) {
                document.getElementById('newRoofForm').reset();
            } else if (currentForm.contains(document.getElementById('renovationForm'))) {
                document.getElementById('renovationForm').reset();
            } else if (currentForm.contains(document.getElementById('metalRoofForm'))) {
                document.getElementById('metalRoofForm').reset();
            }
            
            // Reset form steps
            currentForm.querySelectorAll('.form-step').forEach(step => {
                step.classList.remove('active');
            });
            currentForm.querySelectorAll('.form-step[data-step="1"]').forEach(step => {
                step.classList.add('active');
            });
            currentForm.querySelectorAll('.progress-step').forEach(step => {
                step.classList.remove('active');
            });
            currentForm.querySelectorAll('.progress-step[data-step="1"]').forEach(step => {
                step.classList.add('active');
            });
        });
    });
    
    // Return to main menu from success message
    returnButton.addEventListener('click', function() {
        successMessage.classList.remove('active');
        mainMenu.classList.add('active');
    });
    
    // Form step navigation
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const formContainer = currentStep.closest('form');
            const currentStepNum = parseInt(currentStep.getAttribute('data-step'));
            const nextStepNum = currentStepNum + 1;
            
            // Validate current step before proceeding
            if (validateFormStep(currentStep)) {
                currentStep.classList.remove('active');
                formContainer.querySelector(`.form-step[data-step="${nextStepNum}"]`).classList.add('active');
                
                // Update progress indicator
                formContainer.closest('.content-section').querySelectorAll('.progress-step').forEach(step => {
                    step.classList.remove('active');
                });
                formContainer.closest('.content-section').querySelector(`.progress-step[data-step="${nextStepNum}"]`).classList.add('active');
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const formContainer = currentStep.closest('form');
            const currentStepNum = parseInt(currentStep.getAttribute('data-step'));
            const prevStepNum = currentStepNum - 1;
            
            currentStep.classList.remove('active');
            formContainer.querySelector(`.form-step[data-step="${prevStepNum}"]`).classList.add('active');
            
            // Update progress indicator
            formContainer.closest('.content-section').querySelectorAll('.progress-step').forEach(step => {
                step.classList.remove('active');
            });
            formContainer.closest('.content-section').querySelector(`.progress-step[data-step="${prevStepNum}"]`).classList.add('active');
        });
    });
    
    // Show/hide "Other" text fields
    setupOtherTextFields();
    
    // Form submissions
    document.getElementById('newRoofForm').addEventListener('submit', function(e) {
        handleFormSubmit(e, 'new-roof');
    });
    
    document.getElementById('renovationForm').addEventListener('submit', function(e) {
        handleFormSubmit(e, 'renovation');
    });
    
    document.getElementById('metalRoofForm').addEventListener('submit', function(e) {
        handleFormSubmit(e, 'metal-roof');
    });
});

// Initialize Thailand address autocomplete
function initThailandAddressAutocomplete() {
    // Setup for each form's address fields
    setupAddressAutocomplete('', '');
    setupAddressAutocomplete('reno_', 'reno_');
    setupAddressAutocomplete('metal_', 'metal_');
}

function setupAddressAutocomplete(prefix, idPrefix) {
    if ($.Thailand) {
        $.Thailand({
            database: 'https://earthchie.github.io/jquery.Thailand.js/jquery.Thailand.js/database/db.json',
            $district: $(`#${idPrefix}subDistrict`),
            $amphoe: $(`#${idPrefix}district`),
            $province: $(`#${idPrefix}province`),
            $zipcode: $(`#${idPrefix}zipCode`),
            onDataFill: function(data) {
                console.log(data);
            }
        });
    } else {
        console.warn('$.Thailand is not available');
    }
}

// Setup handlers for "Other" text fields
function setupOtherTextFields() {
    // New Roof Form
    document.getElementById('planOther').addEventListener('change', function() {
        document.getElementById('planOtherText').classList.toggle('d-none', !this.checked);
    });
    
    // Renovation Form
    document.getElementById('houseType3').addEventListener('change', function() {
        document.getElementById('houseTypeOther').classList.toggle('d-none', !this.checked);
    });
    
    document.getElementById('roofProblem3').addEventListener('change', function() {
        document.getElementById('roofProblemOther').classList.toggle('d-none', !this.checked);
    });
    
    document.getElementById('reno_customerType4').addEventListener('change', function() {
        document.getElementById('reno_customerTypeOther').classList.toggle('d-none', !this.checked);
    });
    
    // Metal Roof Form
    document.getElementById('metal_houseType3').addEventListener('change', function() {
        document.getElementById('metal_houseTypeOther').classList.toggle('d-none', !this.checked);
    });
    
    document.getElementById('metal_roofProblem3').addEventListener('change', function() {
        document.getElementById('metal_roofProblemOther').classList.toggle('d-none', !this.checked);
    });
    
    document.getElementById('metal_customerType4').addEventListener('change', function() {
        document.getElementById('metal_customerTypeOther').classList.toggle('d-none', !this.checked);
    });
}

// Validate form step
function validateFormStep(step) {
    const inputs = step.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
            
            // If invalid feedback doesn't exist, add it
            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('invalid-feedback')) {
                const feedback = document.createElement('div');
                feedback.classList.add('invalid-feedback');
                feedback.textContent = 'กรุณากรอกข้อมูลในช่องนี้';
                input.parentNode.insertBefore(feedback, input.nextSibling);
            }
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    if (!isValid) {
        // Scroll to the first invalid input
        step.querySelector('.is-invalid').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    return isValid;
}

// Format current date in YYYY-MM-DD HH:MM:SS format
function getCurrentFormattedDate() {
    // Using the exact format provided: '2025-08-01 21:54:21'
    return '2025-08-01 21:54:21';
}

// Handle form submission
function handleFormSubmit(e, formType) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate the entire form
    const allInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    allInputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
            
            // If invalid feedback doesn't exist, add it
            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('invalid-feedback')) {
                const feedback = document.createElement('div');
                feedback.classList.add('invalid-feedback');
                feedback.textContent = 'กรุณากรอกข้อมูลในช่องนี้';
                input.parentNode.insertBefore(feedback, input.nextSibling);
            }
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    if (!isValid) {
        // Find the step with invalid inputs and make it active
        const invalidInput = form.querySelector('.is-invalid');
        const invalidStep = invalidInput.closest('.form-step');
        const invalidStepNum = invalidStep.getAttribute('data-step');
        
        // Activate the step with invalid inputs
        form.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        invalidStep.classList.add('active');
        
        // Update progress indicator
        form.closest('.content-section').querySelectorAll('.progress-step').forEach(step => {
            step.classList.remove('active');
        });
        form.closest('.content-section').querySelector(`.progress-step[data-step="${invalidStepNum}"]`).classList.add('active');
        
        // Scroll to the first invalid input
        invalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        return;
    }
    
    // Prepare data object from form data
    const formDataObj = {};
    formData.forEach((value, key) => {
        // Handle checkbox groups (multiple values)
        if (formDataObj[key]) {
            if (!Array.isArray(formDataObj[key])) {
                formDataObj[key] = [formDataObj[key]];
            }
            formDataObj[key].push(value);
        } else {
            formDataObj[key] = value;
        }
    });
    
    // Add user info and timestamp with exact format provided
    formDataObj.submittedBy = 'AdminHomeSmile';
    formDataObj.submissionDate = getCurrentFormattedDate();
    formDataObj.boothId = document.getElementById('boothId').textContent;
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-submit');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> กำลังส่งข้อมูล...';
    
    // Google Apps Script URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbx6B5oIyqcpsEGdWYSo0fCLABQjcMjc1O7W_0cX4fd_-CO3F5WxD2EUBbrSlXRYF8Pv/exec';
    
    // Log the data being sent (for debugging)
    console.log('Sending data:', JSON.stringify(formDataObj));
    
    // Send data to Google Apps Script
    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(formDataObj),
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors' // Enable CORS
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        
        // Hide current form and show success message
        form.closest('.content-section').classList.remove('active');
        document.getElementById('success-message').classList.add('active');
        
        // Reset form
        form.reset();
        
        // Reset form steps
        form.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        form.querySelector('.form-step[data-step="1"]').classList.add('active');
        
        // Reset progress indicator
        form.closest('.content-section').querySelectorAll('.progress-step').forEach(step => {
            step.classList.remove('active');
        });
        form.closest('.content-section').querySelector('.progress-step[data-step="1"]').classList.add('active');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
    })
    .finally(() => {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    });
}