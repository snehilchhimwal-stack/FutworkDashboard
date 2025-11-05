// Futwork Dashboard — with fade animation between chart visibility states

let lineChart, horizChart;

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('futworkData')) {
    localStorage.setItem('futworkData', JSON.stringify([]));
  }
  updateDashboard();
});

function parseData() {
  return JSON.parse(localStorage.getItem('futworkData')) || [];
}

function updateDashboard() {
  const region = document.getElementById('regionFilter').value;
  const start = document.getElementById('startDate').value;
  const end = document.getElementById('endDate').value;

  let data = parseData();

  // Filter by region and date
  data = data.filter(d => {
    if (region !== 'all' && d.region !== region) return false;
    if (start && d.date < start) return false;
    if (end && d.date > end) return false;
    return true;
  });

  // Totals
  const totals = data.reduce((acc, r) => {
    acc.totalLeads += +r.totalLeads || 0;
    acc.leadsConcluded += +r.leadsConcluded || 0;
    acc.connected += +r.connected || 0;
    acc.busy += +r.busy || 0;
    acc.noAnswer += +r.noAnswer || 0;
    acc.failed += +r.failed || 0;
    acc.pending += +r.pending || 0;
    acc.opportunity += +r.opportunity || 0;
    acc.siteVisits += +r.siteVisits || 0;
    return acc;
  }, {
    totalLeads: 0, leadsConcluded: 0, connected: 0, busy: 0,
    noAnswer: 0, failed: 0, pending: 0, opportunity: 0, siteVisits: 0
  });

  // Update cards
  document.getElementById('cardTotalLeads').textContent = totals.totalLeads;
  document.getElementById('cardLeadsConcluded').textContent = totals.leadsConcluded;
  document.getElementById('cardConnected').textContent = totals.connected;
  document.getElementById('cardBusy').textContent = totals.busy;
  document.getElementById('cardNoAnswer').textContent = totals.noAnswer;
  document.getElementById('cardFailed').textContent = totals.failed;
  document.getElementById('cardPending').textContent = totals.pending;
  document.getElementById('cardOpportunity').textContent = totals.opportunity;
  document.getElementById('cardSiteVisits').textContent = totals.siteVisits;

  renderCharts(data, region);
}

function renderCharts(data, region) {
  if (lineChart) lineChart.destroy();
  if (horizChart) horizChart.destroy();

  const ctxLine = document.getElementById('lineChart');
  const ctxH = document.getElementById('horizontalChart');
  const horizBox = document.getElementById('horizontalChartBox');
  const lineBox = document.getElementById('lineChartBox');

  // Data for line chart
  const byDate = {};
  data.forEach(r => {
    const d = r.date || '(no-date)';
    byDate[d] = (byDate[d] || 0) + (+r.totalLeads || 0);
  });
  const dates = Object.keys(byDate).sort();
  const leadsSeries = dates.map(d => byDate[d]);

  // Line chart
  lineChart = new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Total Leads',
        data: leadsSeries,
        borderColor: '#0056b3',
        backgroundColor: 'rgba(0,86,179,0.15)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });

  // Horizontal chart only for region = all
  if (region === 'all') {
    horizBox.classList.remove('hidden');
    lineBox.style.flex = '1 1 48%';

    const byRegion = {};
    data.forEach(r => {
      const reg = r.region || '(no region)';
      byRegion[reg] = (byRegion[reg] || 0) + (+r.totalLeads || 0);
    });
    const regions = Object.keys(byRegion);
    const regionVals = regions.map(r => byRegion[r]);

    horizChart = new Chart(ctxH, {
      type: 'bar',
      data: {
        labels: regions,
        datasets: [{
          label: 'Total Leads by Region',
          data: regionVals,
          backgroundColor: '#00b4d8'
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true } }
      }
    });
  } else {
    horizBox.classList.add('hidden');
    lineBox.style.flex = '1 1 100%';
  }
}
