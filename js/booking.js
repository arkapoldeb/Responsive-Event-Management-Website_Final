
// =======================================
// EVENTORA - TICKET BOOKING SYSTEM
// =======================================

// Read event information from URL
const params = new URLSearchParams(window.location.search);

const eventName = params.get("event") || "Eventora Special Event";
const basePrice = Math.max(
    1,
    Number(params.get("price")) || 499
);

// Ticket prices
const ticketPrices = {
    General: basePrice,
    VIP: basePrice + 500,
    Premium: basePrice + 1000
};

const bookingFee = 20;
let quantity = 1;

// HTML elements
const quantityDisplay = document.getElementById("quantity");
const minusButton = document.getElementById("minus");
const plusButton = document.getElementById("plus");
const payButton = document.getElementById("payButton");

// Display event name
document.getElementById("eventName").textContent = eventName;

// Display ticket prices
document.getElementById("generalPrice").textContent =
    formatPrice(ticketPrices.General);

document.getElementById("vipPrice").textContent =
    formatPrice(ticketPrices.VIP);

document.getElementById("premiumPrice").textContent =
    formatPrice(ticketPrices.Premium);


// Format Indian currency
function formatPrice(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}


// Get selected ticket
function getSelectedTicket() {
    return document.querySelector(
        'input[name="ticket"]:checked'
    ).value;
}


// Get selected payment
function getSelectedPayment() {
    return document.querySelector(
        'input[name="payment"]:checked'
    ).value;
}


// Calculate booking total
function updateSummary() {

    const ticketType = getSelectedTicket();
    const price = ticketPrices[ticketType];

    const subtotal = price * quantity;
    const total = subtotal + bookingFee;

    quantityDisplay.textContent = quantity;

    document.getElementById("summaryType").textContent =
        ticketType;

    document.getElementById("summaryQuantity").textContent =
        quantity;

    document.getElementById("summaryPrice").textContent =
        formatPrice(subtotal);

    document.getElementById("bookingFee").textContent =
        formatPrice(bookingFee);

    document.getElementById("totalAmount").textContent =
        formatPrice(total);

}


// Quantity controls
minusButton.addEventListener("click", function () {

    if (quantity > 1) {
        quantity--;
        updateSummary();
    }

});


plusButton.addEventListener("click", function () {

    if (quantity < 10) {
        quantity++;
        updateSummary();
    }

});


// Update summary when ticket changes
document.querySelectorAll('input[name="ticket"]')
    .forEach(function (radio) {

        radio.addEventListener("change", updateSummary);

    });


// Initial calculation
updateSummary();


// =======================================
// COMPLETE DEMO BOOKING
// =======================================

payButton.addEventListener("click", function () {

    const name = document.getElementById("customerName")
        .value.trim();

    const email = document.getElementById("customerEmail")
        .value.trim();

    const phone = document.getElementById("customerPhone")
        .value.trim();

    // Validate customer name
    if (name.length < 2) {
        alert("Please enter your full name.");
        return;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Validate mobile number
    if (!/^[6-9]\d{9}$/.test(phone)) {
        alert("Please enter a valid 10-digit Indian mobile number.");
        return;
    }

    const ticketType = getSelectedTicket();
    const paymentMethod = getSelectedPayment();

    const subtotal = ticketPrices[ticketType] * quantity;
    const total = subtotal + bookingFee;

    // Create unique demo booking ID
    const bookingId =
        "EVT" + Date.now().toString().slice(-9);

    // Booking information
    const booking = {
        bookingId: bookingId,
        event: eventName,
        customer: name,
        email: email,
        phone: phone,
        ticketType: ticketType,
        quantity: quantity,
        paymentMethod: paymentMethod,
        amount: total,
        status: "DEMO CONFIRMED",
        bookingDate: new Date().toLocaleString("en-IN")
    };

    // Save demo booking in browser
    try {
        const bookings = JSON.parse(
            localStorage.getItem("eventoraBookings") || "[]"
        );

        bookings.push(booking);

        localStorage.setItem(
            "eventoraBookings",
            JSON.stringify(bookings)
        );

    } catch (error) {
        alert("Browser storage is unavailable. Please allow local storage to continue.");
        return;
    }

    // Show successful booking
    showTicket(booking);

});


// =======================================
// GENERATE DIGITAL TICKET
// =======================================

function showTicket(booking) {

    document.querySelector(".heading").hidden = true;
    document.querySelector(".booking-layout").hidden = true;

    const success = document.getElementById("successSection");
    success.hidden = false;

    // Display ticket details
    document.getElementById("ticketEvent").textContent =
        booking.event;

    document.getElementById("bookingId").textContent =
        booking.bookingId;

    document.getElementById("ticketName").textContent =
        booking.customer;

    document.getElementById("ticketType").textContent =
        booking.ticketType;

    document.getElementById("ticketQuantity").textContent =
        booking.quantity;

    document.getElementById("ticketPayment").textContent =
        booking.paymentMethod + " (Demo)";

    document.getElementById("ticketAmount").textContent =
        formatPrice(booking.amount);

    // QR code contains booking verification information
    const qrData = JSON.stringify({
        bookingId: booking.bookingId,
        event: booking.event,
        ticket: booking.ticketType,
        quantity: booking.quantity,
        status: booking.status
    });

    const qrContainer = document.getElementById("qrcode");

    qrContainer.innerHTML = "";

    if (typeof QRCode !== "undefined") {

        new QRCode(qrContainer, {
            text: qrData,
            width: 180,
            height: 180,
            correctLevel: QRCode.CorrectLevel.H
        });

    } else {

        qrContainer.textContent =
            "QR library unavailable. Booking ID: " + booking.bookingId;

    }

    // Scroll to confirmation
    success.scrollIntoView({
        behavior: "smooth"
    });

}


// =======================================
// PRINT / SAVE TICKET
// =======================================

document.getElementById("downloadButton")
    .addEventListener("click", function () {

        window.print();

    });
