// ===== SWIFTDROP USER DASHBOARD JAVASCRIPT =====

let currentStep = 1;
let selectedPackageType = 'small';
let offerPrice = 2300;

// ===== STEP NAVIGATION =====
function nextStep(step) {
    // Validate current step
    if (currentStep === 1) {
        const pickup = document.getElementById('pickupLocation').value;
        const dropoff = document.getElementById('dropoffLocation').value;
        
        if (!pickup || !dropoff) {
            alert('Please enter both pickup and delivery addresses');
            return;
        }
        
        // Calculate distance (mock)
        calculateDistance();
    }
    
    if (currentStep === 2) {
        const desc = document.getElementById('packageDesc').value;
        const recipient = document.getElementById('recipientName').value;
        const phone = document.getElementById('recipientPhone').value;
        
        if (!desc || !recipient || !phone) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Update summary
        updateSummary();
    }
    
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.querySelector(`.step-indicator[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.step-indicator[data-step="${currentStep}"]`).classList.add('completed');
    
    // Show next step
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.querySelector(`.step-indicator[data-step="${currentStep}"]`).classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.querySelector(`.step-indicator[data-step="${currentStep}"]`).classList.remove('active');
    
    // Show previous step
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.querySelector(`.step-indicator[data-step="${currentStep}"]`).classList.add('active');
    document.querySelector(`.step-indicator[data-step="${currentStep}"]`).classList.remove('completed');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== LOCATION FUNCTIONS =====
function getCurrentLocation(type) {
    if (navigator.geolocation) {
        const btn = event.target.closest('.location-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Mock reverse geocoding
                const mockAddress = type === 'pickup' 
                    ? '15 Allen Avenue, Ikeja, Lagos'
                    : 'Plot 5, Victoria Island, Lagos';
                
                if (type === 'pickup') {
                    document.getElementById('pickupLocation').value = mockAddress;
                } else {
                    document.getElementById('dropoffLocation').value = mockAddress;
                }
                
                btn.innerHTML = originalHTML;
                calculateDistance();
            },
            (error) => {
                alert('Unable to get your location. Please enter manually.');
                btn.innerHTML = originalHTML;
            }
        );
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

function selectSavedLocation(type) {
    const addresses = {
        home: '15 Allen Avenue, Ikeja, Lagos',
        work: 'Plot 5, Victoria Island, Lagos'
    };
    
    document.getElementById('pickupLocation').value = addresses[type];
    calculateDistance();
}

function calculateDistance() {
    const pickup = document.getElementById('pickupLocation').value;
    const dropoff = document.getElementById('dropoffLocation').value;
    
    if (pickup && dropoff) {
        // Mock calculation
        const distance = (Math.random() * 15 + 5).toFixed(1); // 5-20km
        const time = Math.ceil(distance * 3.5); // ~3.5 min per km
        
        document.getElementById('distanceDisplay').textContent = `${distance} km`;
        document.getElementById('timeDisplay').textContent = `${time} mins`;
    }
}

// ===== PACKAGE TYPE SELECTION =====
document.addEventListener('DOMContentLoaded', function() {
    const packageBtns = document.querySelectorAll('.package-type-btn');
    
    packageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            packageBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedPackageType = this.dataset.type;
        });
    });
    
    // Payment method selection
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            paymentOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// ===== PRICE ADJUSTMENT =====
function adjustPrice(amount) {
    const priceInput = document.getElementById('offerPrice');
    let currentPrice = parseInt(priceInput.value);
    let newPrice = currentPrice + amount;
    
    // Minimum price validation
    if (newPrice < 1000) {
        alert('Minimum offer is ₦1,000');
        return;
    }
    
    // Maximum price validation
    if (newPrice > 50000) {
        alert('Maximum offer is ₦50,000');
        return;
    }
    
    priceInput.value = newPrice;
    offerPrice = newPrice;
    
    // Update display
    document.querySelector('.price-amount').textContent = `₦${newPrice.toLocaleString()}`;
}

// ===== UPDATE SUMMARY =====
function updateSummary() {
    const pickup = document.getElementById('pickupLocation').value;
    const dropoff = document.getElementById('dropoffLocation').value;
    const desc = document.getElementById('packageDesc').value;
    const recipient = document.getElementById('recipientName').value;
    
    const sizeMap = {
        small: 'Small Package (up to 5kg)',
        medium: 'Medium Package (5-15kg)',
        large: 'Large Package (15kg+)'
    };
    
    document.getElementById('summaryPickup').textContent = pickup;
    document.getElementById('summaryDropoff').textContent = dropoff;
    document.getElementById('summarySize').textContent = sizeMap[selectedPackageType];
    document.getElementById('summaryDesc').textContent = desc;
    document.getElementById('summaryRecipient').textContent = recipient;
}

// ===== CONFIRM ORDER =====
function confirmOrder() {
    const btn = event.target.closest('button');
    const originalHTML = btn.innerHTML;
    
    // Show loading
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Finding nearby riders...';
    btn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Create order object
        const orderData = {
            orderId: 'SD' + Date.now(),
            pickup: document.getElementById('pickupLocation').value,
            dropoff: document.getElementById('dropoffLocation').value,
            packageType: selectedPackageType,
            description: document.getElementById('packageDesc').value,
            recipient: document.getElementById('recipientName').value,
            recipientPhone: document.getElementById('recipientPhone').value,
            instructions: document.getElementById('instructions').value,
            price: offerPrice,
            status: 'searching',
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        let orders = JSON.parse(localStorage.getItem('swiftdrop_orders') || '[]');
        orders.unshift(orderData);
        localStorage.setItem('swiftdrop_orders', JSON.stringify(orders));
        localStorage.setItem('swiftdrop_current_order', JSON.stringify(orderData));
        
        // Show success message
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Order Placed!';
        
        setTimeout(() => {
            // Redirect to tracking page
            window.location.href = 'track.html';
        }, 1500);
    }, 2000);
}

// ===== AUTO-SAVE FORM DATA =====
function saveFormData() {
    const formData = {
        pickup: document.getElementById('pickupLocation')?.value || '',
        dropoff: document.getElementById('dropoffLocation')?.value || '',
        packageDesc: document.getElementById('packageDesc')?.value || '',
        recipientName: document.getElementById('recipientName')?.value || '',
        recipientPhone: document.getElementById('recipientPhone')?.value || '',
        instructions: document.getElementById('instructions')?.value || ''
    };
    
    sessionStorage.setItem('swiftdrop_form_draft', JSON.stringify(formData));
}

// Load saved form data
function loadFormData() {
    const savedData = sessionStorage.getItem('swiftdrop_form_draft');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        if (document.getElementById('pickupLocation')) {
            document.getElementById('pickupLocation').value = data.pickup || '';
            document.getElementById('dropoffLocation').value = data.dropoff || '';
        }
        
        if (document.getElementById('packageDesc')) {
            document.getElementById('packageDesc').value = data.packageDesc || '';
            document.getElementById('recipientName').value = data.recipientName || '';
            document.getElementById('recipientPhone').value = data.recipientPhone || '';
            document.getElementById('instructions').value = data.instructions || '';
        }
    }
}

// Auto-save on input
document.addEventListener('DOMContentLoaded', function() {
    loadFormData();
    
    const inputs = document.querySelectorAll('.location-input, .form-control');
    inputs.forEach(input => {
        input.addEventListener('input', saveFormData);
    });
});

// ===== CLEAR FORM =====
function clearForm() {
    if (confirm('Are you sure you want to clear the form?')) {
        document.getElementById('pickupLocation').value = '';
        document.getElementById('dropoffLocation').value = '';
        document.getElementById('packageDesc').value = '';
        document.getElementById('recipientName').value = '';
        document.getElementById('recipientPhone').value = '';
        document.getElementById('instructions').value = '';
        
        sessionStorage.removeItem('swiftdrop_form_draft');
        
        // Reset to step 1
        if (currentStep !== 1) {
            document.getElementById(`step${currentStep}`).classList.remove('active');
            currentStep = 1;
            document.getElementById('step1').classList.add('active');
        }
    }
}

// ===== INPUT VALIDATION =====
function validatePhone(input) {
    const value = input.value.replace(/\D/g, '');
    if (value.length > 0) {
        let formatted = '+234 ';
        if (value.length > 3) {
            formatted += value.substring(0, 3) + ' ';
            if (value.length > 6) {
                formatted += value.substring(3, 6) + ' ';
                formatted += value.substring(6, 10);
            } else {
                formatted += value.substring(3);
            }
        } else {
            formatted += value;
        }
        input.value = formatted.trim();
    }
}

// Add phone validation on input
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('recipientPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            validatePhone(this);
        });
    }
});