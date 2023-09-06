const fetchInflucard = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5500/src/data.json");

    if (!response.ok) throw new Error("Error fetching data.");

    let data = await response.json();

    console.log(data.influcard);
    return data.influcard;
  } catch (err) {
    console.error(err);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  Swal.fire({
    timer: 2000,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const data = await fetchInflucard();
    fillCharts(data);

    Swal.close();
  } catch (err) {
    console.error(err);
    Swal.close();
  }

  const exitButton = document.getElementById("exit-button");
  exitButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});

const fillCharts = (data) => {
  // Generar todas las gráficas
  generateAgeGraph(data);
  generateGenderGraph(data);
  generateTerritoryGraph(data);
  generateHoraryGraph(data);
  generateEngagementDayGraph(data);
  generateCountryGraph(data);
  generateBrandsImages(data);
  generateCircleGraphs(data);

  const getElement = (id) => document.getElementById(id);

  const updateTextContent = (elementId, value) => {
    const element = getElement(elementId);
    if (element) {
      element.textContent = value;
    }
  };

  const updateProfileImage = (src) => {
    const profileImage = getElement("profile_image");
    if (profileImage) {
      profileImage.src = src;
    }
  };

  const updateAccountInfo = (country, gender, age) => {
    const accountInfo = getElement("account-info");
    if (accountInfo) {
      const flagImg = document.createElement("img");
      flagImg.src = `assets/flags/4x3/${country}.svg`;
      flagImg.alt = "Flag";
      flagImg.classList.add("country-flag");

      const countryAbbr = document.createElement("span");
      countryAbbr.textContent = `${country}-`;

      const genderText = gender === "1" ? " Mujer ♀️" : " Hombre ♂️";
      const genderAgeText = document.createElement("span");
      genderAgeText.textContent = ` ${genderText}, ${age} años`;

      accountInfo.innerHTML = ""; // Limpiar el contenido anterior
      accountInfo.appendChild(flagImg);
      accountInfo.appendChild(countryAbbr);
      accountInfo.appendChild(genderAgeText);

      accountInfo.style.margin = "10px";
      accountInfo.style.display = "flex";
      accountInfo.style.alignItems = "center";
    }
  };

  const updateDateData = (updatedAt) => {
    const dateData = getElement("date-data");
    if (dateData) {
      dateData.textContent = `Datos actualizados a ${updatedAt}`;
    }
  };

  // Actualizar todos los elementos de texto
  updateTextContent("username", data.username);
  updateTextContent("username-rrss", data.username);
  updateTextContent("e11-audiencia", data.followers_formated);
  updateTextContent("e11-fakes", data.fake_followers_formated + "%");
  updateTextContent("e11-audiencia-real", data.real_followers_formated);
  updateTextContent("e13-audiencia-valor", data.followers_formated);
  updateTextContent("e13-alcance-valor", data.reach_formated);
  updateTextContent("e23-impresiones-valor", data.impressions_formated);
  updateTextContent("e23-impresiones-alcance-valor", data.ir_alcance + "%");
  updateTextContent("e23-impresiones-audiencia-valor", data.ir_audiencia + "%");
  updateTextContent("e33-reproducciones-valor", data.vplays_formated);
  updateTextContent("e33-reproducciones-alcance-valor", data.vr_alcance + "%");
  updateTextContent(
    "e33-reproducciones-audiencia-valor",
    data.vr_audiencia + "%"
  );
  updateTextContent("e43-engagement-valor", data.engagement_formated);
  updateTextContent("e43-engagement-alcance-valor", data.er_alcance + "%");
  updateTextContent("e43-engagement-audiencia-valor", data.er_audiencia + "%");

  // Actualizar elementos especiales
  updateProfileImage(data.account_picture);
  updateAccountInfo(data.country, data.gender, data.age);
  updateDateData(data.updated_at_formated);
};

const generateCircleGraphs = (data) => {
  const chartData = [
    {
      title: "Reach",
      percentage: data.reach_formated_graph,
      color: "blue",
    },
    {
      title: "Relevance",
      percentage: data.relevance_formated_graph,
      color: "orange",
    },
    {
      title: "Resonance",
      percentage: data.resonance_formated_graph,
      color: "aqua",
    },
  ];

  const circleGraphsContainer = document.querySelector(".circle-graphs");

  chartData.forEach((chart) => {
    const chartContainer = document.createElement("div");
    chartContainer.classList.add("chart-container");

    const chartTitle = document.createElement("div");
    chartTitle.textContent = chart.title;
    chartTitle.style.fontSize = "12px"; // Establece el tamaño de fuente más pequeño
    chartContainer.appendChild(chartTitle);

    const canvas = document.createElement("canvas");
    canvas.classList.add("chart");
    chartContainer.appendChild(canvas);

    circleGraphsContainer.appendChild(chartContainer);

    chartContainer.style.width = "60px";
    chartContainer.style.height = "60px";
    chartContainer.style.display = "flex";
    chartContainer.style.flexDirection = "column";
    chartContainer.style.alignItems = "center";
    chartContainer.style.justifyContent = "center";

    new Chart(canvas, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [chart.percentage, 100 - chart.percentage],
            backgroundColor: [chart.color, "lightgray"],
          },
        ],
      },
      options: {
        cutout: "80%",
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });
  });
};

const generateAgeGraph = (data) => {
  const ageData = data.insightsAge;

  const ageRangeMapping = {
    13: "13-17",
    18: "18-24",
    25: "25-34",
    35: "35-44",
    45: "45-64",
    65: "65 +",
  };

  const ageMap = {
    "13-17": 0,
    "18-24": 0,
    "25-34": 0,
    "35-44": 0,
    "45-64": 0,
    "65 +": 0,
  };

  let totalPercentage = 0;

  ageData.forEach((item) => {
    const ageValue = item.age_range;
    const ageRange = ageRangeMapping[ageValue];
    const percentage = parseFloat(item.percentage.replace(",", "."));
    if (ageMap[ageRange] !== undefined) {
      ageMap[ageRange] += percentage;
      totalPercentage += percentage;
    }
  });

  const ageChartContainer = document.getElementById("age-graph");

  Object.keys(ageMap).forEach((ageRange) => {
    const percentage = ((ageMap[ageRange] / totalPercentage) * 100).toFixed(2);
    const ageBar = document.createElement("div");
    ageBar.classList.add("age-bar");
    ageBar.innerHTML = `
      <label class="age-label">${ageRange}</label>
      <progress class="age-progressbar" max="100" value="${percentage}"></progress>
      <label class="age-percentage">${percentage}%</label>
    `;
    ageChartContainer.appendChild(ageBar);
  });
};

const generateTerritoryGraph = (data) => {
  const territoryData = data.territories;

  const territoryMap = {};
  let totalPercentage = 0;
  let maxCategories = 8;

  territoryData.forEach((item, index) => {
    const territoryName = item.territory_name.name;
    const percentage = parseFloat(item.perc);

    if (index < maxCategories) {
      territoryMap[territoryName] = percentage;
    }
    totalPercentage += percentage;
  });

  territoryMap["Otras"] += 100 - totalPercentage;

  const territoryChartData = Object.keys(territoryMap).map((territoryName) => ({
    territoryName,
    percentage: ((territoryMap[territoryName] / totalPercentage) * 100).toFixed(
      2
    ),
  }));

  territoryChartData.reverse();

  am4core.ready(function () {
    am4core.useTheme(am4themes_animated);
    let chart = am4core.create("territory-graph", am4charts.XYChart);
    chart.padding(0, 40, 0, 0);

    chart.data = territoryChartData;

    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "territoryName";
    categoryAxis.renderer.minGridDistance = 0;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.labels.template.fontSize = 11;

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;

    chart.colors.list = [
      am4core.color("#f7fe6c"),
      am4core.color("#f9996e"),
      am4core.color("#ff63f0"),
      am4core.color("#707cc4"),
      am4core.color("#fad272"),
    ];

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = "percentage";
    series.dataFields.categoryY = "territoryName";
    series.columns.template.tooltipText = "{categoryY}: {valueX}%";
    series.columns.template.height = am4core.percent(90);
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusBottomRight = 5;
    series.columns.template.column.cornerRadiusTopRight = 5;
    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });
    let labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.text = "{valueX}%";
    labelBullet.label.truncate = false;
    labelBullet.label.hideOversized = false;
    labelBullet.label.horizontalCenter = "right";
    labelBullet.label.fontSize = 11;
    labelBullet.label.dx = 20;
  });
};

const generateGenderGraph = (data) => {
  const genderData = data.insightsGender;

  const maleData = genderData.find((item) => item.gender === "0");
  const femaleData = genderData.find((item) => item.gender === "1");

  const malePercentage = parseFloat(maleData.percentage.replace(",", "."));
  const femalePercentage = parseFloat(femaleData.percentage.replace(",", "."));

  am4core.ready(function () {
    am4core.useTheme(am4themes_animated);
    let chart = am4core.create("gender-graph", am4charts.PieChart);

    chart.data = [
      {
        gender: "Hombres",
        percentage: malePercentage,
        color: am4core.color("#007BFF"),
      },
      {
        gender: "Mujeres",
        percentage: femalePercentage,
        color: am4core.color("#FF69B4"),
      },
    ];

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.cornerRadius = 6;
    pieSeries.dataFields.value = "percentage";
    pieSeries.dataFields.category = "gender";

    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;
    pieSeries.dataFields.radiusValue = "percentage";
    pieSeries.slices.template.propertyFields.fill = "color";

    chart.legend = new am4charts.Legend();
  });
};

const generateCountryGraph = (data) => {
  const countryData = data.top_countries_formated;

  const countryChartContainer = document.getElementById("country-graph");

  countryData.forEach((item) => {
    const countryBar = document.createElement("div");
    countryBar.classList.add("country-bar");
    countryBar.innerHTML = `
      <img src="./${item.href}" alt="${item.country}" class="country-flag">
      <label class="country-label">${item.country_short}</label>
      <progress class="country-progressbar" max="100" value="${parseFloat(
        item.value
      ).toFixed(2)}"></progress>
      <label class="country-percentage">${item.value}%</label>
    `;
    countryChartContainer.appendChild(countryBar);
  });
};

const generateHoraryGraph = (data) => {
  const horaryData = data.post_moment_json;

  am4core.ready(function () {
    am4core.useTheme(am4themes_animated);

    let chart = am4core.create("post-horary-graph", am4charts.XYChart);

    chart.data = horaryData;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "none";

    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "type";
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.labels.template.fontSize = 10;
    categoryAxis.renderer.labels.template.horizontalCenter = "left";
    categoryAxis.renderer.minGridDistance = 0;

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.labels.template.disabled = true;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = "value";
    series.dataFields.categoryY = "type";
    series.columns.template.tooltipText = "{valueX}%";
    series.columns.template.tooltipY = 0;
    series.columns.template.strokeOpacity = 0;
    series.columns.template.height = am4core.percent(40);
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.cornerRadiusBottomRight = 10;
    series.columns.template.adapter.add("fill", function (fill, target) {
      return am4core.color(target.dataItem.dataContext.color);
    });

    let image = series.createChild(am4core.Image);
    image.horizontalCenter = "middle";
    image.verticalCenter = "middle";
    image.width = 20;
    image.height = 20;
    image.adapter.add("href", (href, target) => {
      let dataItem = target.dataItem;
      if (dataItem && dataItem.dataContext) {
        return dataItem.dataContext.href;
      }
      return href;
    });
  });
};

const generateEngagementDayGraph = (data) => {
  const dayData = data.post_day_json;

  am4core.ready(function () {
    am4core.useTheme(am4themes_animated);

    let chart = am4core.create("engagement-rate-graph", am4charts.XYChart);

    chart.data = dayData;
    chart.padding(10, 40, -10, 0);

    let categoryAxisX = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxisX.dataFields.category = "day";
    categoryAxisX.renderer.grid.template.strokeOpacity = 0;
    categoryAxisX.renderer.minGridDistance = 1;
    categoryAxisX.renderer.labels.horizontalCenter = "right";
    categoryAxisX.renderer.labels.template.verticalCenter = "middle";

    let valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());

    valueAxisY.renderer.labels.template.adapter.add("text", function (text) {
      return text + "%";
    });

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "day";
    series.dataFields.valueY = "rate";
    series.columns.template.tooltipText = "{valueY}%";
    series.columns.template.tooltipY = 0;
    series.columns.template.strokeOpacity = 0;

    series.columns.template.adapter.add("fill", (fill, target) => {
      return chart.colors.getIndex(target.dataItem.index);
    });
  });
};

const generateBrandsImages = (data) => {
  const brandsData = data.brands_images.slice(0, 8);
  const brandsGraphContainer = document.getElementById("brands-graph");

  const brandsGrid = document.createElement("div");
  brandsGrid.classList.add("brands-grid");

  brandsData.map((item) => {
    const brandItem = document.createElement("div");
    brandItem.classList.add("brand-item");
    brandItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="brand-image"/>
      <label class="brand-name">${item.name}</label>
    `;
    brandsGrid.appendChild(brandItem);
  });

  brandsGraphContainer.appendChild(brandsGrid);
};
