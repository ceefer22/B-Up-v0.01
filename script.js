document.getElementById("goBtn").onclick = async () => {
  const subs = document.getElementById("subs").value;

  const res = await fetch("/api/optimize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscriptions: subs })
  });

  const data = await res.json();

  document.getElementById("summaryScreen").innerHTML = `
    <h2>Summary</h2>
    <p>Recommendations: ${data.summary.recommendation_count}</p>
    <p>Total Savings: $${data.summary.total_savings.toFixed(2)}</p>
  `;
  document.getElementById("summaryScreen").style.display = "block";
  document.getElementById("nextBtn").style.display = "block";

  document.getElementById("nextBtn").onclick = () => {
    renderTable(data);
  };
};

function renderTable(data) {
  const rows = data.table.map(r => `
    <tr>
      <td>${r.Category}</td>
      <td>${r["Current Subscription & Price"]}</td>
      <td>${r["Applicable Bundle / Perk / Credit"]}</td>
      <td>$${r["Estimated Savings"].toFixed(2)}</td>
    </tr>
  `).join("");

  const total = data.total_row["Total Estimated Savings"].toFixed(2);

  document.getElementById("tableScreen").innerHTML = `
    <h2>Optimization Table</h2>
    <table border="1" cellpadding="6">
      <thead>
        <tr>
          <th>Category</th>
          <th>Current Subscription & Price</th>
          <th>Applicable Bundle / Perk / Credit</th>
          <th>Estimated Savings</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr>
          <th>Total Estimated Savings</th>
          <td></td><td></td>
          <th>$${total}</th>
        </tr>
      </tbody>
    </table>
  `;
}
