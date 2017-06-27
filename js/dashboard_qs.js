// Load the Visualization API and the controls package.
google.charts.load('current', {'packages':['corechart', 'controls']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawSheetName);

//query spreadsheet, executed OnLoad
function drawSheetName() {
  var queryString = encodeURIComponent("SELECT sum(J), sum(I)/sum(J), sum(I), sum(K)/sum(G), sum(I)/sum(H), sum(H)/sum(G), sum(J)/sum(H), sum(H), sum(M)/sum(G), D, B, F, C GROUP BY D, B, F, C");

  var query = new google.visualization.Query(
      'https://docs.google.com/spreadsheets/d/1WSwOslPcCIY5kbYSVgDHyZiBRJf_W0val4amNDrKoTE/gviz/tq?sheet=Sheet1&headers=1&tq=' + queryString);
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
  var devFilter = new google.visualization.ControlWrapper({
    'controlType': 'CategoryFilter',
    'containerId': 'filter_device',
    'options': {
      'filterColumnLabel': 'Device',
      'ui': {'allowMultiple': false}
    },
    'state': {'selectedValues': ['Computers']}
  });

  var slotFilter = new google.visualization.ControlWrapper({
    'controlType': 'CategoryFilter',
    'containerId': 'filter_slot',
    'options': {
      'filterColumnLabel': 'Top vs. Other',
      'ui': {'allowMultiple': false}
    },
    'state': {'selectedValues': ['Top']}
  });

  var marketFilter = new google.visualization.ControlWrapper({
    'controlType': 'CategoryFilter',
    'containerId': 'filter_market',
    'options': {
      'filterColumnLabel': 'market',
      'ui': {'allowMultiple': false}
    },
    'state': {'selectedValues': ['US']}
  });

//Create all the charts
  var columnChart1 = new google.visualization.ChartWrapper({
    'chartType': 'ColumnChart',
    'containerId': 'chart1',
    'options': {
      //'height': 300,
      'legend': 'bottom',
      'title': 'Quality Score & CPA',
      'series': {
        0: {targetAxisIndex: 0, labelInLegend: "Quality Score"},
        1: {targetAxisIndex: 1, labelInLegend: "CPA"}
      },
      'vAxes': {
        0: {'title': 'Quality Score'},
        1: {'title': 'CPA'}
      }
    },
    'view': {'columns': [9, 8, 1]}
  });

  var columnChart2 = new google.visualization.ChartWrapper({
    'chartType': 'ColumnChart',
    'containerId': 'chart2',
    'options': {
      //'height': 400,
      'legend': 'bottom',
      'title': 'Quality Score & Conversions',
      'series': {
        0: {targetAxisIndex: 0, labelInLegend: "Quality Score"},
        1: {targetAxisIndex: 1, labelInLegend: "Conversions"}
      },
      'vAxes': {
        0: {'title': 'Quality Score'},
        1: {'title': 'Conversions'}
      }
    },
    'view': {'columns': [9, 8, 0]}
  });

  var columnChart3 = new google.visualization.ChartWrapper({
    'chartType': 'ColumnChart',
    'containerId': 'chart3',
    'options': {
      //'height': 400,
      'legend': 'bottom',
      'title': 'Quality Score & Cost',
      'series': {
        0: {targetAxisIndex: 0, labelInLegend: "Quality Score"},
        1: {targetAxisIndex: 1, labelInLegend: "Cost"}
      },
      'vAxes': {
        0: {'title': 'Quality Score'},
        1: {'title': 'Cost'}
      }
    },
    'view': {'columns': [9, 8, 2]}
  });

  var columnChart4 = new google.visualization.ChartWrapper({
    'chartType': 'ColumnChart',
    'containerId': 'chart4',
    'options': {
      //'height': 400,
      'legend': 'bottom',
      'title': 'Quality Score & CPC',
      'series': {
        0: {targetAxisIndex: 0, labelInLegend: "Quality Score"},
        1: {targetAxisIndex: 1, labelInLegend: "CPC"}
      },
      'vAxes': {
        0: {'title': 'Quality Score'},
        1: {'title': 'CPC'}
      }
    },
    'view': {'columns': [9, 8, 4]}
  });

//Bind and draw
  dashboard.bind([devFilter, marketFilter, slotFilter], [columnChart1, columnChart2, columnChart3, columnChart4]);
  //dashboard.bind([rangeSlider, devFilter, catFilter, mtFilter, slotFilter], [lineChart, lineChart2, lineChart3, lineChart4]);
  dashboard.draw(data);
};
