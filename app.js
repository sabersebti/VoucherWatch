document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        usernameInput: document.getElementById('username'),
        passwordInput: document.getElementById('password'),
        staffNameInput: document.getElementById('staff-name'),
        staffEmailInput: document.getElementById('staff-email'),
        voucherInput: document.getElementById('voucher-input'),
        voucherCodeDiv: document.getElementById('voucher-code'),
        voucherResponseDiv: document.getElementById('voucher-response'),
        loginBtn: document.getElementById('login-btn'),
        issueBtn: document.getElementById('issue-btn'),
        validateBtn: document.getElementById('validate-btn'),
        shiftControllerBtn: document.getElementById('shift-controller-btn'),
        canteenManagerBtn: document.getElementById('canteen-manager-btn'),
        errorDisplay: document.getElementById('error-display') 
    };

    async function handleAPI(endpoint, data) {
        const API_BASE_URL = 'http://your-backend-api-url'; 
        try {
            let response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // Assuming JSON data 
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            return await response.json(); // Assume JSON response from the backend
        } catch (err) {
            console.error(err); 
            elements.errorDisplay.textContent = 'An error occurred. Please try again.';
        }
    }

    function validateEmail(email) {
        // ... Your email validation logic  ...
    }

    elements.loginBtn.addEventListener('click', async () => {
        // ... Validation ...

        const result = await handleAPI('/login', {
            username: elements.usernameInput.value,
            password: elements.passwordInput.value
        });

        // Handle login success/failure based on 'result'
    });

    elements.issueBtn.addEventListener('click', async () => {
        // ... Validation ...

        const result = await handleAPI('/issue-voucher', {
            staffName: elements.staffNameInput.value,
            staffEmail: elements.staffEmailInput.value
        });

        // ... Update voucherCodeDiv ...
    });

    elements.validateBtn.addEventListener('click', async () => { 
        // ... Validation ...

        const result = await handleAPI('/validate-voucher', {
            voucherCode: elements.voucherInput.value
        });

        // ... Update voucherResponseDiv ... 
    });


    elements.shiftControllerBtn.addEventListener('click', () => {
        showSection('shift-controller-container');
    });

    elements.canteenManagerBtn.addEventListener('click', () => {
        showSection('canteen-staff-container'); 
    });

    function showSection(sectionClass) {
        document.querySelectorAll('.container').forEach(section => {
            section.classList.add('hidden'); 
        });
        document.querySelector(`.${sectionClass}`).classList.remove('hidden');
    }
});
