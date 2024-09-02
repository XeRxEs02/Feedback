document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedbackForm');
    const progressBar = document.getElementById('progressBar');
    const inputs = form.querySelectorAll('input, select, textarea');
    const errorMessages = form.querySelectorAll('.error-message');

    // Update the progress bar based on form completion
    inputs.forEach(input => {
        input.addEventListener('input', updateProgressBar);
        input.addEventListener('blur', () => validateInput(input));
    });

    function updateProgressBar() {
        const totalInputs = Array.from(inputs).filter(input => input.type !== 'radio' || input.checked).length;
        let filledInputs = 0;

        inputs.forEach(input => {
            if (input.type === 'radio') {
                const radios = form.querySelectorAll(`input[name="${input.name}"]`);
                if (Array.from(radios).some(radio => radio.checked)) {
                    filledInputs += 1;
                }
            } else if (input.value.trim() !== '') {
                filledInputs += 1;
            }
        });

        const progress = (filledInputs / totalInputs) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Real-time form validation
    form.addEventListener('input', event => {
        validateInput(event.target);
    });

    function validateInput(input) {
        const errorMessage = input.parentElement.querySelector('.error-message');
        if (input.checkValidity()) {
            input.style.borderColor = '#1e3c72';
            errorMessage.style.display = 'none';
        } else {
            input.style.borderColor = '#ff4d4d';
            errorMessage.style.display = 'block';
            errorMessage.textContent = getErrorMessage(input);
        }
    }

    function getErrorMessage(input) {
        if (input.validity.valueMissing) {
            return 'This field is required.';
        } else if (input.validity.typeMismatch) {
            return 'Please enter a valid value.';
        }
        return 'Invalid input.';
    }

    // Handle form submission
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Final validation check
        let isValid = true;
        inputs.forEach(input => {
            if (input.type === 'radio') {
                const radios = form.querySelectorAll(`input[name="${input.name}"]`);
                if (!Array.from(radios).some(radio => radio.checked)) {
                    isValid = false;
                    const errorMessage = radios[radios.length - 1].parentElement.parentElement.querySelector('.error-message');
                    errorMessage.style.display = 'block';
                    errorMessage.textContent = 'Please select a rating.';
                } else {
                    const errorMessage = radios[radios.length - 1].parentElement.parentElement.querySelector('.error-message');
                    errorMessage.style.display = 'none';
                }
            } else {
                validateInput(input);
                if (!input.checkValidity()) {
                    isValid = false;
                }
            }
        });

        if (isValid) {
            const feedbackData = {
                name: form.name.value.trim(),
                email: form.email.value.trim(),
                counselor: form.counselor.value,
                timeliness: form.timeliness.value,
                communication: form.communication.value,
                experience: form.experience.value,
                feedback: form.feedback.value.trim(),
                submittedAt: new Date().toLocaleString()
            };

            // Save the feedback to local storage
            let feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || [];
            feedbackList.push(feedbackData);
            localStorage.setItem('feedbackList', JSON.stringify(feedbackList));

            // Reset the form
            form.reset();
            progressBar.style.width = '0%';

            alert('Thank you for your feedback!');

            // Optionally, you can redirect the user or perform other actions here
        } else {
            alert('Please fill out the form correctly before submitting.');
        }
    });
});
