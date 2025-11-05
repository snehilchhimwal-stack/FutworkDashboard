function switchTab(event, tabId) {
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

function saveToStorage(entry) {
  const data = JSON.parse(localStorage.getItem("futworkData")) || [];
  data.push(entry);
  localStorage.setItem("futworkData", JSON.stringify(data));
}

// TAB 1: Leads Added
function submitLeads() {
  const region = document.getElementById('region1').value;
  const ch = document.getElementById('leadsCH').value;
  const opp = document.getElementById('leadsOpp').value;
  const site = document.getElementById('siteVisits').value;

  document.getElementById('outRegion1').textContent = region || '—';
  document.getElementById('outCH').textContent = ch || '0';
  document.getElementById('outOpp').textContent = opp || '0';
  document.getElementById('outSite').textContent = site || '0';
  document.getElementById('output1').style.display = 'block';

  saveToStorage({
  date: new Date().toISOString().split("T")[0],
  region,
  leadsCH: ch,
  leadsOpp: opp,
  siteVisits: site,
  totalLeads: totalLeadsValue,
  connected: connectedValue,
  pending: pendingValue
});

}

// TAB 2: Database
function submitDatabase() {
  const region = document.getElementById('region2').value;
  document.getElementById('outRegion2').textContent = region || '—';
  document.getElementById('outTotal').textContent = document.getElementById('totalLeads').value || '0';
  document.getElementById('outConcluded').textContent = document.getElementById('leadsConcluded').value || '0';
  document.getElementById('outConnected').textContent = document.getElementById('leadsConnected').value || '0';
  document.getElementById('outBusy').textContent = document.getElementById('leadsBusy').value || '0';
  document.getElementById('outNoAnswer').textContent = document.getElementById('leadsNoAnswer').value || '0';
  document.getElementById('outFailed').textContent = document.getElementById('leadsFailed').value || '0';
  document.getElementById('outPending').textContent = document.getElementById('leadsPending').value || '0';
  document.getElementById('output2').style.display = 'block';

  saveToStorage({
  date: new Date().toISOString().split("T")[0],
  region,
  leadsCH: ch,
  leadsOpp: opp,
  siteVisits: site,
  totalLeads: totalLeadsValue,
  connected: connectedValue,
  pending: pendingValue
});

}

// TAB 3: Daily Lead Qualification
function submitQualification() {
  const region = document.getElementById('region3').value;
  const date = document.getElementById('date3').value;
  const leads = document.getElementById('leadsAdded3').value;

  document.getElementById('outRegion3').textContent = region || '—';
  document.getElementById('outDate').textContent = date || '(No date selected)';
  document.getElementById('outLeadsAdded').textContent = leads || '0';
  document.getElementById('output3').style.display = 'block';
}
