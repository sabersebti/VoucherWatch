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
        errorDisplay: document.getElementById('error-display'),
        roleHeading: document.getElementById('role-heading')
    };

    async function handleAPI(endpoint, data) {
        const API_BASE_URL = 'http://your-backend-api-url';
        try {
            let response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json();
        } catch (err) {
            console.error('Error:', err);
            elements.errorDisplay.textContent = 'An error occurred. Please try again.';
            return null;
        }
    }

    elements.loginBtn.addEventListener('click', async () => {
        if (!elements.usernameInput.value || !elements.passwordInput.value) {
            elements.errorDisplay.textContent = 'Please enter both username and password.';
            return;
        }

        const loginResult = await handleAPI('/login', {
            username: elements.usernameInput.value,
            password: elements.passwordInput.value
        });

        if (loginResult && loginResult.success) {
            const role = loginResult.role;

            if (role === 'shift_controller') {
                showSection('shift-controller-container');
                elements.roleHeading.textContent = 'Shift Controller';
            } else if (role === 'canteen_staff') {
                showSection('canteen-staff-container');
                elements.roleHeading.textContent = 'Canteen Manager';
            } else {
                elements.errorDisplay.textContent = 'Invalid role received.';
            }
        } else {
            elements.errorDisplay.textContent = 'Invalid username or password.';
        }
    });

    elements.issueBtn.addEventListener('click', async () => {
        if (!elements.staffNameInput.value || !elements.staffEmailInput.value) {
            elements.errorDisplay.textContent = 'Please fill in all required fields.';
            return;
        }

        const result = await handleAPI('/issue-voucher', {
            staffName: elements.staffNameInput.value,
            staffEmail: elements.staffEmailInput.value
        });

        if (result) {
            elements.voucherCodeDiv.textContent = result.code || 'Voucher code issued';
        }
    });

    elements.validateBtn.addEventListener('click', async () => {
        if (!elements.voucherInput.value) {
            elements.errorDisplay.textContent = 'Please enter a voucher code.';
            return;
        }

        const result = await handleAPI('/validate-voucher', {
            voucherCode: elements.voucherInput.value
        });

        if (result) {
            elements.voucherResponseDiv.textContent = result.valid ? 'Valid Voucher' : 'Invalid Voucher';
        }
    });

    elements.shiftControllerBtn.addEventListener('click', () => {
        showSection('shift-controller-container');
        elements.roleHeading.textContent = 'Shift Controller';
    });

    elements.canteenManagerBtn.addEventListener('click', () => {
        showSection('canteen-staff-container');
        elements.roleHeading.textContent = 'Canteen Manager';
    });

    function showSection(sectionClass) {
        document.querySelectorAll('.container').forEach(section => {
            section.classList.add('hidden');
        });
        document.querySelector(`.${sectionClass}`).classList.remove('hidden');
    }
});
