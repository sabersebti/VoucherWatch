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
        redeemEloopsBtn: document.getElementById('redeem-eloops-btn'),
        printVoucherBtn: document.getElementById('print-voucher-btn'),
        printValidatedVoucherBtn: document.getElementById('print-validated-voucher-btn'),
        shiftControllerBtn: document.getElementById('shift-controller-btn'),
        canteenManagerBtn: document.getElementById('canteen-manager-btn'),
        errorDisplay: document.getElementById('error-display'),
        roleHeading: document.getElementById('role-heading')
    };

    const demoCredentials = {
        'shift_controller': { username: 'shiftcontroller', password: 'shift123' },
        'canteen_staff': { username: 'canteenmanager', password: 'canteen123' }
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
        const username = elements.usernameInput.value;
        const password = elements.passwordInput.value;

        if (!username || !password) {
            elements.errorDisplay.textContent = 'Please enter both username and password.';
            return;
        }

        if (username === demoCredentials['shift_controller'].username && password === demoCredentials['shift_controller'].password) {
            showSection('shift-controller-container');
            elements.roleHeading.textContent = 'Shift Controller';
            document.getElementById('myTitle').style.display = 'none'; // Hide title
        } else if (username === demoCredentials['canteen_staff'].username && password === demoCredentials['canteen_staff'].password) {
            showSection('canteen-staff-container');
            elements.roleHeading.textContent = 'Canteen Manager';
            document.getElementById('myTitle').style.display = 'none'; // Hide title
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
            elements.printVoucherBtn.classList.remove('hidden'); // Show print button
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
            if (result.valid) {
                elements.printValidatedVoucherBtn.classList.remove('hidden'); // Show print button
            }
        }
    });

    elements.printVoucherBtn.addEventListener('click', () => {
        printVoucher(elements.voucherCodeDiv.textContent);
    });

    elements.printValidatedVoucherBtn.addEventListener('click', () => {
        printVoucher(elements.voucherResponseDiv.textContent);
    });

    elements.shiftControllerBtn.addEventListener('click', () => {
        showSection('login-container');
        elements.roleHeading.textContent = 'Shift Controller Login';
    });

    elements.canteenManagerBtn.addEventListener('click', () => {
        showSection('login-container');
        elements.roleHeading.textContent = 'Canteen Manager Login';
    });

    function showSection(sectionClass) {
        document.querySelectorAll('.container').forEach(section => {
            section.classList.add('hidden');
        });
        document.querySelector(`.${sectionClass}`).classList.remove('hidden');
    }

    function printVoucher(content) {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Voucher</title></head><body>');
        printWindow.document.write('<h1>Voucher</h1>');
        printWindow.document.write(`<p>${content}</p>`);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }
});
