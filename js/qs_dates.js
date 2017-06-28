// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(querySs);

//query spreadsheet, executed OnLoad
function querySs() {
  var queryString = encodeURIComponent("SELECT A, sum(J)/sum(F) GROUP BY A PIVOT D");

  var query = new google.visualization.Query(
      'https://docs.google.com/spreadsheets/d/1d_kl28VCdyFVl_qBOWbK8J82ieoTCV3gqawRNrw4iWY/gviz/tq?sheet=Sheet1&headers=1&tq=' + queryString);
  query.send(handleResponse);
};

//handle response from spreadsheet
function handleResponse(response) {
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  };
  var data = response.getDataTable();

  var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard_div'));

  // Create all the filters
  var rangeSlider = new google.visualization.ControlWrapper({
    'controlType': 'DateRangeFilter',
    'containerId': 'filter_date',
    'options': {
      'filterColumnLabel': 'Date'
    }
  });


//Create all the charts
  var lineChart = new google.visualization.ChartWrapper({
    'chartType': 'LineChart',
    'containerId': 'chart5',
    'options': {
      //'height': 400,
      'legend': 'bottom',
      'title': 'Historical Quality Score',
       'series': {
         0: {targetAxisIndex: 0, labelInLegend: "Brand"},
         1: {targetAxisIndex: 0, labelInLegend: "Generic"}
       }
      //  'vAxes': {
      //    0: {'title': 'Conversions'},
      //    1: {'title': 'CPA', 'format': 'currency'}
      //   }
     }
    // 'view': {'columns': [0, 2, 3]}
  });

//Bind and draw
  dashboard.bind(rangeSlider, lineChart);
  dashboard.draw(data);
};
