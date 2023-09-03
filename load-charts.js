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

const fillCharts = (data) => {
  const profileImage = document.getElementById("profile_image");
  profileImage.src = data.account_picture;
};

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchInflucard();
  fillCharts(data);
  generateAgeGraph(data);
  generateGenderGraph(data);
  generateTerritoryGraph(data);
  generateHoraryGraph(data);

  const exitButton = document.getElementById("exit-button");
  exitButton.addEventListener("click", () => {});
});

// ---------
// ---------
// ---------
// ---------
// ---------
// ---------
// ---------
// ---------
// ---------
// ---------
// ---------
// ---------

const generateAgeGraph = (data) => {
  const ageData = data.insightsAge;

  const ageRangeMapping = {
    13: "13-17",
    18: "18-24",
    25: "25-34",
    35: "35-44",
    45: "45-64",
    65: "+65",
  };

  const ageMap = {
    "13-17": 0,
    "18-24": 0,
    "25-34": 0,
    "35-44": 0,
    "45-64": 0,
    "+65": 0,
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

  const ageChartData = Object.keys(ageMap).map((ageRange) => ({
    ageRange,
    percentage: ((ageMap[ageRange] / totalPercentage) * 100).toFixed(2),
  }));

  am4core.ready(function () {
    am4core.useTheme(am4themes_animated);
    var chart = am4core.create("age-graph", am4charts.XYChart);

    chart.data = ageChartData;

    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "ageRange";
    categoryAxis.renderer.minGridDistance = 0;
    categoryAxis.renderer.grid.template.disabled = true;

    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;

    valueAxis.renderer.labels.template.adapter.add("text", (text) => {
      return "";
    });

    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = "percentage";
    series.dataFields.categoryY = "ageRange";
    series.columns.template.tooltipText = "{categoryY}: {valueX}%";
    series.columns.template.width = am4core.percent(100);
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusBottomRight = 5;
    series.columns.template.column.cornerRadiusTopRight = 5;
    var labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.text = "{valueX}%";
    labelBullet.label.truncate = false;
    labelBullet.label.hideOversized = false;
    labelBullet.label.horizontalCenter = "right";
  });
};

const generateTerritoryGraph = (data) => {
  const territoryData = data.territories;

  const territoryMap = {};
  let totalPercentage = 0;
  let maxCategories = 6;

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
    var chart = am4core.create("territory-graph", am4charts.XYChart);

    chart.data = territoryChartData;

    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "territoryName";
    categoryAxis.renderer.minGridDistance = 0;
    categoryAxis.renderer.grid.template.disabled = true;

    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;

    chart.colors.list = [
      am4core.color("#FA5733"),
      am4core.color("#FF5733"),
      am4core.color("#FFC300"),
      am4core.color("#4CAF50"),
      am4core.color("#03A9F4"),
      am4core.color("#9C27B0"),
      am4core.color("#E91E63"),
      am4core.color("#607D8B"),
    ];

    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = "percentage";
    series.dataFields.categoryY = "territoryName";
    series.columns.template.tooltipText = "{categoryY}: {valueX}%";
    series.columns.template.width = am4core.percent(100);
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusBottomRight = 5;
    series.columns.template.column.cornerRadiusTopRight = 5;
    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });
    var labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.text = "{valueX}%";
    labelBullet.label.truncate = false;
    labelBullet.label.hideOversized = false;
    labelBullet.label.horizontalCenter = "right";
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
    var chart = am4core.create("gender-graph", am4charts.PieChart);

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

    var pieSeries = chart.series.push(new am4charts.PieSeries());
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

const generateHoraryGraph = (data) => {
  const horaryData = JSON.parse(data.post_moment_json);

  am4core.ready(function () {
    am4core.useTheme(am4themes_animated);

    var chart = am4core.create("post-horary-graph", am4charts.XYChart);

    chart.data = horaryData;

    // Crea un eje Y
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "type";
    categoryAxis.renderer.grid.template.location = 0;

    // Crea un eje X
    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inversed = true;

    // Configura la serie de barras horizontales
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = "value";
    series.dataFields.categoryY = "type";
    series.columns.template.tooltipText = "{categoryY}: {valueX}%";

    // Configura el color de las barras
    series.columns.template.fill = am4core.color("#5B6F8E"); // Color predeterminado
    series.columns.template.fillOpacity = 0.8;

    // Configura la apariencia de las barras móviles (bullets)
    var bullet = series.bullets.push(new am4charts.Bullet());
    bullet.horizontalCenter = "middle";
    bullet.verticalCenter = "middle";
    bullet.width = 10; // Ancho del bullet
    bullet.height = 30; // Altura del bullet
    bullet.tooltipText = "{categoryY}: {valueX}%";

    // Crea la imagen en el bullet
    var image = bullet.createChild(am4core.Image);
    image.width = 10; // Ancho de la imagen
    image.height = 30; // Altura de la imagen
    image.href = "{href}";

    // Actualiza los colores de las barras con los colores proporcionados en los datos
    series.columns.template.adapter.add("fill", function (fill, target) {
      return am4core.color(target.dataItem.dataContext.color);
    });

    // Habilita la exportación de la gráfica
    chart.exporting.menu = new am4core.ExportMenu();
  });
};
