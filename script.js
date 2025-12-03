let processors = [];
let interval;

function initializeSystem() {
    const n = document.getElementById("processorCount").value;
    processors = [];

    for (let i = 0; i < n; i++) {
        processors.push({
            id: i + 1,
            load: Math.floor(Math.random() * 10) + 1
        });
    }

    updateMetrics();
    drawChart();
    document.getElementById("step").innerText =
        "Step 1: Unbalanced load generated.";
}

function updateMetrics() {
    let total = processors.reduce((s, p) => s + p.load, 0);
    let avg = (total / processors.length).toFixed(2);

    let loads = processors.map(p => p.load);
    let diff = Math.max(...loads) - Math.min(...loads);

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
    let speed = document.getElementById("speed").value;

    interval = setInterval(() => {
        let maxIndex = processors.reduce(
            (m, p, i) => p.load > processors[m].load ? i : m, 0);
        let minIndex = processors.reduce(
            (m, p, i) => p.load < processors[m].load ? i : m, 0);

        updateMetrics();

        if (processors[maxIndex].load - processors[minIndex].load <= 1) {
            document.getElementById("step").innerText =
                "✅ Step 4: System balanced. Load difference minimized.";
            clearInterval(interval);
            drawChart();
            return;
        }

        document.getElementById("step").innerText =
            `Step 3: Migrating task from Processor ${processors[maxIndex].id}
             to Processor ${processors[minIndex].id}`;

        processors[maxIndex].load--;
        processors[minIndex].load++;

        drawChart(maxIndex, minIndex);
    }, speed);
}
