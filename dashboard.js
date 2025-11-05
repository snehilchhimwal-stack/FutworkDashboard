document.addEventListener("DOMContentLoaded", () => {
  // Temporary demo data if no localStorage data found
  if (!localStorage.getItem("futworkData")) {
    const sampleData = [
      { date: "2025-11-01", region: "Western", leadsCH: 12, leadsOpp: 10, siteVisits: 4, totalLeads: 50, connected: 35, pending: 10 },
      { date: "2025-11-02", region: "Thane", leadsCH: 8, leadsOpp: 6, siteVisits: 3, totalLeads: 40, connected: 28, pending: 12 },
      { date: "2025-11-02", region: "Central", leadsCH: 10, leadsOpp: 9, siteVisits: 5, totalLeads: 60, connected: 40, pending: 20 },
      { date: "2025-11-03", region: "Navi Mumbai", leadsCH: 15, leadsOpp: 12, siteVisits: 6, totalLeads: 70, connected: 50, pending: 10 }
    ];
    localStorage.setItem("futworkData", JSON.stringify(sampleData));
  }

  updateDashboard();
});

let chartInstance = null;

function updateDashboard() {
  const regionFilter = document.getElementById("regionFilter").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const data = JSON.parse(localStorage.getItem("futworkData")) || [];

  // Filter data based on slicers
  let filtered = data.filter(d => {
    const dateMatch =
      (!startDate || d.date >= startDate) && (!endDate || d.date <= endDate);
    const regionMatch = regionFilter === "all" || d.region === regionFilter;
    return dateMatch && regionMatch;
  });

  // Update summary totals
  const totals = filtered.reduce(
    (acc, d) => {
      acc.totalLeads += +d.totalLeads || 0;
      acc.connected += +d.connected || 0;
      acc.pending += +d.pending || 0;
      acc.siteVisits += +d.siteVisits || 0;
      return acc;
    },
    { totalLeads: 0, connected: 0, pending: 0, siteVisits: 0 }
  );

  document.getElementById("totalLeads").textContent = totals.totalLeads;
  document.getElementById("connectedLeads").textContent = totals.connected;
  document.getElementById("pendingLeads").textContent = totals.pending;
  document.getElementById("siteVisitsTotal").textContent = totals.siteVisits;

  // Update table
  const tableBody = document.getElementById("dataTable");
  tableBody.innerHTML = filtered
    .map(
      d => `
    <tr>
      <td>${d.date}</td>
      <td>${d.region}</td>
      <td>${d.leadsCH}</td>
      <td>${d.leadsOpp}</td>
      <td>${d.siteVisits}</td>
      <td>${d.totalLeads}</td>
      <td>${d.connected}</td>
      <td>${d.pending}</td>
    </tr>
  `
    )
    .join("");

  // Chart Data
  const regionTotals = {};
  filtered.forEach(d => {
    regionTotals[d.region] = (regionTotals[d.region] || 0) + (+d.totalLeads || 0);
  });

  const ctx = document.getElementById("regionChart");
  if (chartInstance) chartInstance.destroy(); // Reset if existing
  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(regionTotals),
      datasets: [
        {
          label: "Leads per Region",
          data: Object.values(regionTotals),
          backgroundColor: "#0056b3"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}
