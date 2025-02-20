// Load the JSON data
function formatTitle(text) {
  return text
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
}

fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    // Update Cards Data
    document.querySelector(".cards .blue b").textContent =
      data.leadsSummary.totalLeads;
    document.querySelector(".cards .dark-green b").textContent =
      data.leadsSummary.newLeads;
    document.querySelector(".cards .purple b").textContent =
      data.leadsSummary.convertedLeads;
    document.querySelector(".cards .marron b").textContent =
      data.leadsSummary.existingLeads;
    document.querySelector(".cards .orange b").textContent =
      data.leadsSummary.followUps;
    document.querySelector(".cards .green b").textContent =
      data.leadsSummary.whatsappLeads;
    document.querySelector(".cards .pink b").textContent =
      data.leadsSummary.emailLeads;
    document.querySelector(".cards .red b").textContent =
      data.leadsSummary.notConvertedLeads;

    // Update Chart
    const ctx = document.getElementById("barChart").getContext("2d");
    function getGradient(ctx, chartArea) {
      let gradient = ctx.createLinearGradient(
        0,
        chartArea.top,
        0,
        chartArea.bottom
      );
      gradient.addColorStop(0, "#A8DEFF");
      gradient.addColorStop(0.88, "#2D3AAC");
      return gradient;
    }
    const chartData = {
      labels: data.monthlyChartData.labels,
      datasets: [
        {
          label: "Monthly Data",
          data: data.monthlyChartData.data,
          backgroundColor: (context) => {
            const { chart } = context;
            if (!chart.chartArea) return;
            return getGradient(chart.ctx, chart.chartArea);
          },
          borderRadius: 25,
        },
      ],
    };
    new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          legend: false,
          y: {
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
            border: {
              display: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#20313A",
              font: {
                size: 14,
              },
            },
            border: {
              display: false,
            },
          },
        },
      },
    });

    // Update Leads Location Map
    document.querySelector(".map-img").src = data.leadsLocation;

    // Populate Salesperson Dropdown
    const salesDropdown = document.getElementById("sales");
    data.salesPersons.forEach((person) => {
      const option = document.createElement("option");
      option.value = person;
      option.textContent = person;
      salesDropdown.appendChild(option);
    });

    // Populate Monthly Dropdown
    const monthlyDropdown = document.getElementById("monthly");
    data.monthlyData.forEach((month) => {
      const option = document.createElement("option");
      option.value = month.toLowerCase();
      option.textContent = month;
      monthlyDropdown.appendChild(option);
    });

    // Populate sources tabs
    const sourceTabDiv = document.getElementById("source-tabs");
    data.leadSources.forEach((source) => {
      const button = document.createElement("button");
      button.textContent = source;
      button.classList.add("type-tab");
      sourceTabDiv.appendChild(button);
    });

    // Populate Lead Source Dropdown
    const sourceDropdown = document.getElementById("source");
    data.leadSources.forEach((source) => {
      const option = document.createElement("option");
      option.value = source.toLowerCase();
      option.textContent = source;
      sourceDropdown.appendChild(option);
    });

    // Populate Top Products List
    const productList = document.querySelector(".product-list");
    productList.innerHTML = "";
    data.topProducts["India Mart"].forEach((product, index) => {
      const li = document.createElement("li");
      li.className = "product-name";
      li.textContent = `${index + 1}. ${product}`;
      productList.appendChild(li);
    });
  })
  .catch((error) => console.error("Error loading JSON data:", error));
