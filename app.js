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
        generateTestVoucherBtn: document.getElementById('generate-test-voucher-btn'),
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
            hideTitle();
        } else if (username === demoCredentials['canteen_staff'].username && password === demoCredentials['canteen_staff'].password) {
            showSection('canteen-staff-container');
            elements.roleHeading.textContent = 'Canteen Manager';
            hideTitle();
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
        printVoucher(elements.voucherCodeDiv.textContent, elements.staffNameInput.value, elements.staffEmailInput.value);
    });

    elements.printValidatedVoucherBtn.addEventListener('click', () => {
        printVoucher(elements.voucherResponseDiv.textContent, elements.staffNameInput.value, elements.staffEmailInput.value);
    });

    elements.generateTestVoucherBtn.addEventListener('click', () => {
        const testVoucherCode = 'TEST123456';
        elements.voucherCodeDiv.textContent = testVoucherCode;
        elements.printVoucherBtn.classList.remove('hidden'); // Show print button
    });

    elements.shiftControllerBtn.addEventListener('click', () => {
        showSection('login-container');
        elements.roleHeading.textContent = 'Shift Controller Login';
        hideTitle();
    });

    elements.canteenManagerBtn.addEventListener('click', () => {
        showSection('login-container');
        elements.roleHeading.textContent = 'Canteen Manager Login';
        hideTitle();
    });

    function showSection(sectionClass) {
        document.querySelectorAll('.container').forEach(section => {
            section.classList.add('hidden');
        });
        document.querySelector(`.${sectionClass}`).classList.remove('hidden');
    }

    function hideTitle() {
        document.getElementById('myTitle').style.display = 'none';
    }

    function printVoucher(voucherCode, staffName, staffEmail) {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Voucher</title><style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #333; padding: 10px; text-align: left; } th { background-color: #f2f2f2; }</style></head><body>');
        printWindow.document.write('<h1>Voucher</h1>');
        printWindow.document.write('<table>');
        printWindow.document.write('<tr><th>Name</th><th>Email</th><th>Voucher Code</th></tr>');
        printWindow.document.write(`<tr><td>${staffName}</td><td>${staffEmail}</td><td>${voucherCode}</td></tr>`);
        printWindow.document.write('</table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }
});
