let currentStep = 1;
const totalSteps = 3;

document.addEventListener('DOMContentLoaded', () => {
    updateStepDisplay();
    setupEventListeners();
});

function setupEventListeners() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const startBtn = document.getElementById('startBtn');
    const dontShowAgain = document.getElementById('dontShowAgain');

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStepDisplay();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepDisplay();
        }
    });

    startBtn.addEventListener('click', () => {
        finishOnboarding();
    });

    dontShowAgain.addEventListener('change', (e) => {
        chrome.storage.local.set({
            onboardingDontShowAgain: e.target.checked
        });
    });
}

function updateStepDisplay() {
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    // Update content
    document.querySelectorAll('.step-content').forEach((content, index) => {
        if (index + 1 === currentStep) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    // Update buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const startBtn = document.getElementById('startBtn');

    if (currentStep === 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'block';
        startBtn.style.display = 'none';
    } else if (currentStep === totalSteps) {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'none';
        startBtn.style.display = 'block';
    } else {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        startBtn.style.display = 'none';
    }
}

function finishOnboarding() {
    // Mark onboarding as shown
    chrome.storage.local.set({
        onboardingShown: true
    }, () => {
        // Close the onboarding tab
        window.close();
    });
}
