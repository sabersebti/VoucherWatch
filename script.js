// Placeholder API interaction, needs actual backend calls.
const API_BASE_URL = 'http://your-backend-api-url';
const LOGIN_ENDPOINT = '/login';
const ISSUE_VOUCHER_ENDPOINT = '/issue-voucher';
const VALIDATE_VOUCHER_ENDPOINT = '/validate-voucher';

// Get element references once.
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const staffNameInput = document.getElementById('staff-name');
const staffEmailInput = document.getElementById('staff-email');
const voucherInput = document.getElementById('voucher-input');
const voucherDialog = document.getElementById('voucher-dialog');
const voucherCodeDiv = document.getElementById('voucher-code');
const voucherResponseDiv = document.getElementById('voucher-response');

// Simplified Login Logic.
document.getElementById('login-btn').addEventListener('click', async () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        // Make a POST request to your backend's /login endpoint.
        let response = await fetch(`${API_BASE_URL}${LOGIN_ENDPOINT}`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        // Handle successful login by showing the appropriate container.
    } catch (err) {
        console.log(err);
    }
});

// Issue Voucher.
document.getElementById('issue-btn').addEventListener('click', async () => {
    const staffName = staffNameInput.value;
    const staffEmail = staffEmailInput.value;

    try {
        // Make a POST request to your backend's /issue-voucher endpoint.
        let response = await fetch(`${API_BASE_URL}${ISSUE_VOUCHER_ENDPOINT}`, {
            method: 'POST',
            body: JSON.stringify({ staffName, staffEmail }),
        });
        // Show voucher code.
        voucherCodeDiv.textContent = await response.text();
    } catch (err) {
        console.log(err);
    }
});

// Voucher Validation (similar logic for both buttons).
document.getElementById('eloops-btn').addEventListener('click', () => {
    voucherDialog.classList.remove('hidden');
});

document.getElementById('validate-btn').addEventListener('click', async () => {
    const voucherCode = voucherInput.value;

    try {
        // Make POST call to your backend's /validate-voucher endpoint.
        let response = await fetch(`${API_BASE_URL}${VALIDATE_VOUCHER_ENDPOINT}`, {
            method: 'POST',
            body: JSON.stringify({ voucherCode }),
        });
        // Update the 'voucher-response' div with the appropriate message.
        voucherResponseDiv.textContent = await response.text();
    } catch (err) {
        console.log(err);
    }
});
