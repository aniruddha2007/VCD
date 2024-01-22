function updateGraph(data) {
    // Get the canvas element for the chart
    var canvas = document.getElementById("priceGraph");

    // Check if the canvas element is null or undefined
    if (!canvas) {
        console.error("Canvas element not found.");
        return;
    }

    // Check if getContext method is supported (it should be, but just to be sure)
    if (!canvas.getContext) {
        console.error("getContext method is not supported.");
        return;
    }

    // Initialize Chart.js line chart
    var ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("Unable to get 2D context for the canvas.");
        return;
    }

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.date),
            datasets: [{
                label: 'Price History',
                data: data.map(item => item.price),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                }
            }
        }
    });
}
