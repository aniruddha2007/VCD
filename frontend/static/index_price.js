// index_price.js

// Initial values
let aci;
let ici;

// Function to update index prices
function updateIndexPrices() {
    console.log("ACI:", aci);
    console.log("ICI:", ici);

    // Update the HTML elements with new prices
    document.getElementById("aciprice").innerText = aci.toFixed(2);  // Formatting to two decimal places
    document.getElementById("iciprice").innerText = ici.toFixed(2);
}

// Set initial values
updateIndexPrices();

// Handle form submission
document.getElementById("indexPriceForm").addEventListener("submit", function (event) {
    // Prevent the default form submission
    event.preventDefault();
    event.stopPropagation();

    // Update aci and ici values with form inputs
    aci = parseFloat(document.getElementById("aci_price").value) || aci;  // Use entered value or current value
    ici = parseFloat(document.getElementById("ici_price").value) || ici;

    // Validate that values are positive
    if (aci < 0 || ici < 0) {
        alert("Enter a positive value for prices.");
        return;
    }

    // Update index prices
    updateIndexPrices();

    // Close the modal
    const modal = new bootstrap.Modal(document.getElementById("index_price_modal"));
    modal.hide();

    // Send the updated values to the server
    fetch('/api/update_index_prices', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aci: aci, ici: ici }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data.message);
            } else {
                console.error(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// Trigger the modal on page load
document.addEventListener("DOMContentLoaded", function () {
    const modal = new bootstrap.Modal(document.getElementById("index_price_modal"));
    modal.show();
});
