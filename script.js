let processors = [];
let interval;

function initializeSystem() {
    const n = document.getElementById("processorCount").value;
    const mode = document.getElementById("loadMode").value;
    const manualDiv = document.getElementById("manualInputs");

    processors = [];
    manualDiv.innerHTML = "";

    if (mode === "manual") {
        manualDiv.classList.remove("hidden");

        for (let i = 0; i < n; i++) {
            manualDiv.innerHTML += `
                <div class="manual-box">
                    P${i + 1}<br>
                    Load:
                    <input type="number" id="mload${i}" min="0" value="3">
                </div>
            `;
        }

        document.getElementById("step").innerText =
            "Step 1: Enter manual load and click Start Balancing.";
        drawChart();
        updateMetrics();
        return;
    }

    // RANDOM MODE (default)
    manualDiv.classList.add("hidden");

    for (let i = 0; i < n; i++) {
        processors.push({
            id: i + 1,
            load: Math.floor(Math.random() * 10) + 1
        });
    }

    updateMetrics();
    drawChart();
    document.getElementById("step").innerText =
        "Step 1: Random unbalanced load generated.";
}

function loadFromManual() {
    processors = [];
    const n = document.getElementById("processorCount").value;

    for (let i = 0; i < n; i++) {
        const val = parseInt(document.getElementById(`mload${i}`).value);
        processors.push({
            id: i + 1,
            load: isNaN(val) ? 0 : val
        });
    }
}

function updateMetrics() {
    if (processors.length === 0) return;

    const total = processors.reduce((s, p) => s + p.load, 0);
    const avg = (total / processors.length).toFixed(2);

    const loads = processors.map(p => p.load);
    const diff = Math.max(...loads) - Math.min(...loads);

    document.getElementById("avgLoad").innerText = avg;
    document.getElementById("diff").innerText = diff;
}

function drawChart(maxIndex = -1, minIndex = -1) {
    const chart = document.getElementById("chart");
    chart.innerHTML = "";

    processors.forEach((p, i) => {
        const bar = document.createElement("div");
        bar.className = "bar";

        if (i === maxIndex) bar.classList.add("overloaded");
        if (i === minIndex) bar.classList.add("underloaded");

        bar.style.height = p.load * 20 + "px";
        bar.innerHTML = `<span>${p.load}</span>`;
        chart.appendChild(bar);
    });
}

function startBalancing() {
    clearInterval(interval);
    const speed = document.getElementById("speed").value;
    const mode = document.getElementById("loadMode").value;

    if (mode === "manual") {
        loadFromManual();
        updateMetrics();
        drawChart();
    }

    interval = setInterval(() => {

        const maxIndex = processors.reduce(
            (m, p, i) => p.load > processors[m].load ? i : m, 0);
        const minIndex = processors.reduce(
            (m, p, i) => p.load < processors[m].load ? i : m, 0);

        updateMetrics();

        if (processors[maxIndex].load - processors[minIndex].load <= 1) {
            document.getElementById("step").innerText =
                "✅ System balanced successfully.";
            clearInterval(interval);
            drawChart();
            return;
        }

        document.getElementById("step").innerText =
            `Migrating load from Processor ${processors[maxIndex].id}
             to Processor ${processors[minIndex].id}`;

        processors[maxIndex].load--;
        processors[minIndex].load++;

        drawChart(maxIndex, minIndex);

    }, speed);
}
function resetSystem() {
    // Stop any ongoing balancing
    clearInterval(interval);

    // Clear processor data
    processors = [];

    // Clear chart
    document.getElementById("chart").innerHTML = "";

    // Reset metrics
    document.getElementById("avgLoad").innerText = "-";
    document.getElementById("diff").innerText = "-";

    // Reset step message
    document.getElementById("step").innerText =
        "System reset. Please initialize again.";

    // Hide manual input section if visible
    const manualDiv = document.getElementById("manualInputs");
    manualDiv.classList.add("hidden");
    manualDiv.innerHTML = "";

    // Optional: reset mode selector
    document.getElementById("loadMode").value = "random";
}
