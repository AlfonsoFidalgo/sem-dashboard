// Load the Visualization API and the controls package.
google.charts.load('current', {'packages':['corechart', 'controls']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawSheetName);

//query spreadsheet, executed OnLoad
function drawSheetName() {
  var queryString = encodeURIComponent("SELECT A, B, sum(J), sum(I)/sum(J), sum(I), sum(K)/sum(G), sum(I)/sum(H), sum(H)/sum(G), sum(J)/sum(H), sum(H), D, E, F GROUP BY A, B, D, E, F");

  var query = new google.visualization.Query(
      'https://docs.google.com/spreadsheets/d/1Mw9VkPaciMng7HMmVTa-s7nmIpqdpzyNWsorX7xyJnE/gviz/tq?sheet=Sheet1&headers=1&tq=' + queryString);
  query.send(handleSampleDataQueryResponse);
};

//handle response from spreadsheet
function handleSampleDataQueryResponse(response) {
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  };
  var data = response.getDataTable();

  var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard_div'));

  // Create all the filters
  var rangeSlider = new google.visualization.ControlWrapper({
    'controlType': 'DateRangeFilter', //'DateRangeFilter'
    'containerId': 'filter_div',
    'options': {
      'filterColumnLabel': 'Week'
    }
  });

  var catFilter = new google.visualization.ControlWrapper({
    'controlType': 'CategoryFilter',
    'containerId': 'filter_divB',
    'options': {
      'filterColumnLabel': 'Category',
      'ui': {'allowMultiple': false}
    },
    'state': {'selectedValues': ['Generic']}
  });

  var devFilter = new google.visualization.ControlWrapper({
    'controlType': 'CategoryFilter',
    'containerId': 'filter_divC',
    'options': {
      'filterColumnLabel': 'Device',
      'ui': {'allowMultiple': false}
    },
    'state': {'selectedValues': ['Computers']}
  });

  var languageFilter = new google.visualization.ControlWrapper({
    'controlType': 'CategoryFilter',
    'containerId': 'filter_divD',
    'options': {
      'filterColumnLabel': 'language',
      'ui': {'allowMultiple': false}
    },
    'state': {'selectedValues': ['EN']}
  });

  var marketFilter = new google.visualization.ControlWrapper({
    'controlType': 'CategoryFilter',
    'containerId': 'filter_divE',
    'options': {
      'filterColumnLabel': 'market',
      'ui': {'allowMultiple': false}
    },
    'state': {'selectedValues': ['US']}
  });

//Create all the charts
  var lineChart = new google.visualization.ChartWrapper({
    'chartType': 'LineChart',
    'containerId': 'chart1',
    'options': {
      //'height': 400,
      'legend': 'bottom',
      'title': 'Conversions & CPA',
      'series': {
        0: {targetAxisIndex: 0, labelInLegend: "Conversions"},
        1: {targetAxisIndex: 1, labelInLegend: "CPA"}
      },
      'vAxes': {
        0: {'title': 'Conversions'},
        1: {'title': 'CPA', 'format': 'currency'}
      }
    },
    'view': {'columns': [0, 2, 3]}
  });

  var lineChart2 = new google.visualization.ChartWrapper({
    'chartType': 'LineChart',
    'containerId': 'chart2',
    'options': {
      //'height': 400,
      'legend': 'bottom',
      'title': 'Cost & Avg. Position',
      'series': {
        0: {targetAxisIndex: 0, labelInLegend: "Cost"},
        1: {targetAxisIndex: 1, labelInLegend: "Avg. Position"}
      },
      'vAxes': {
        0: {'title': 'Cost', 'format': 'currency'},
        1: {'title': 'Avg. Position'}
      }
    },
    'view': {'columns': [0, 4, 5]}
  });

  var lineChart3 = new google.visualization.ChartWrapper({
    'chartType': 'LineChart',
    'containerId': 'chart3',
    'options': {
      //'height': 400,
      'legend': 'bottom',
      'title': 'CPC & CTR',
      'series': {
        0: {targetAxisIndex: 0, labelInLegend: "CPC"},
        1: {targetAxisIndex: 1, labelInLegend: "CTR"}
      },
      'vAxes': {
        0: {'title': 'CPC', 'format': 'currency'},
        1: {'title': 'CTR', 'format': 'percent'}
      }
    },
    'view': {'columns': [0, 6, 7]}
  });

  var lineChart4 = new google.visualization.ChartWrapper({
    'chartType': 'LineChart',
    'containerId': 'chart4',
    'options': {
      //'height': 400,
      'legend': 'bottom',
      'title': 'CVR & Clicks',
      'series': {
        0: {targetAxisIndex: 0, labelInLegend: "CVR"},
        1: {targetAxisIndex: 1, labelInLegend: "Clicks"}
      },
      'vAxes': {
        0: {'title': 'CVR', 'format': 'percent'},
        1: {'title': 'Clicks', 'format': 'decimal'}
      }
    },
    'view': {'columns': [0, 8, 9]}
  });

//Bind and draw
  dashboard.bind([rangeSlider, devFilter, catFilter, languageFilter, marketFilter], [lineChart, lineChart2, lineChart3, lineChart4]);
  dashboard.draw(data);
};
