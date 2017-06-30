// Load the Visualization API and the controls package.
google.charts.load('current', {'packages':['table', 'controls']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(queryLastWeek);

//Get dates
var todayDOW = moment().day();
var lastWeek = moment().subtract(todayDOW - 1, 'Days').subtract(1, 'Week');
var weekBefore = moment().subtract(todayDOW - 1, 'Days').subtract(2, 'Week');

//query last week
function queryLastWeek(){
  var queryString = encodeURIComponent("SELECT A, D, sum(G), sum(H), sum(H)/sum(G), sum(I), sum(I)/sum(H), sum(J), sum(K)/sum(G), sum(I)/sum(J), sum(J)/sum(H) WHERE " +
        "day(A) = " + lastWeek.date() + " AND month(A) = " + lastWeek.month()
        +  "AND year(A) = " + lastWeek.year() + " GROUP BY A, D " +
        "label sum(G) 'Impressions', sum(H) 'Clicks', sum(H)/sum(G) 'CTR', sum(I) 'Cost', " +
      "sum(I)/sum(H) 'CPC', sum(J) 'Conversions', sum(K)/sum(G) 'Avg. Position', sum(I)/sum(J) 'CPA', sum(J)/sum(H) 'CVR'");

  var query = new google.visualization.Query(
    'https://docs.google.com/spreadsheets/d/1Mw9VkPaciMng7HMmVTa-s7nmIpqdpzyNWsorX7xyJnE/gviz/tq?sheet=Sheet1&headers=1&tq=' + queryString);

  query.send(handleLastWeek);
};

function queryWeekBefore(){
  var queryString = encodeURIComponent("SELECT A, D, sum(G), sum(H), sum(H)/sum(G), sum(I), sum(I)/sum(H), sum(J), sum(K)/sum(G), sum(I)/sum(J), sum(J)/sum(H) WHERE " +
        "day(A) = " + weekBefore.date() + " AND month(A) = " + weekBefore.month()
        +  "AND year(A) = " + weekBefore.year() + " GROUP BY A, D " +
        "label sum(G) 'Impressions', sum(H) 'Clicks', sum(H)/sum(G) 'CTR', sum(I) 'Cost', " +
      "sum(I)/sum(H) 'CPC', sum(J) 'Conversions', sum(K)/sum(G) 'Avg. Position', sum(I)/sum(J) 'CPA', sum(J)/sum(H) 'CVR'");

  var query = new google.visualization.Query(
    'https://docs.google.com/spreadsheets/d/1Mw9VkPaciMng7HMmVTa-s7nmIpqdpzyNWsorX7xyJnE/gviz/tq?sheet=Sheet1&headers=1&tq=' + queryString);
  query.send(handleWeekBefore);
};

function queryLastTwoWeeks(){
  var queryString = encodeURIComponent("SELECT A, D, sum(G), sum(H), sum(H)/sum(G), sum(I), sum(I)/sum(H), sum(J), sum(K)/sum(G), sum(I)/sum(J), sum(J)/sum(H) WHERE " +
        "day(A) >= " + weekBefore.date() + " AND month(A) >= " + weekBefore.month()
        +  "AND year(A) >= " + weekBefore.year() + " GROUP BY A, D " +
        "label sum(G) 'Impressions', sum(H) 'Clicks', sum(H)/sum(G) 'CTR', sum(I) 'Cost', " +
      "sum(I)/sum(H) 'CPC', sum(J) 'Conversions', sum(K)/sum(G) 'Avg. Position', sum(I)/sum(J) 'CPA', sum(J)/sum(H) 'CVR'");

  var query = new google.visualization.Query(
    'https://docs.google.com/spreadsheets/d/1Mw9VkPaciMng7HMmVTa-s7nmIpqdpzyNWsorX7xyJnE/gviz/tq?sheet=Sheet1&headers=1&tq=' + queryString);
  query.send(handleLastTwoWeeks);
};

//handle last week
function handleLastWeek(response){
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  };
  var data = response.getDataTable();
  var table = new google.visualization.Table(document.getElementById('tableLastWeek'));
  table.draw(data, {width: '100%'});
  queryWeekBefore();
};

function handleWeekBefore(response){
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  };
  var data = response.getDataTable();
  var table = new google.visualization.Table(document.getElementById('tableWeekBefore'));
  table.draw(data, {width: '100%'});
  queryLastTwoWeeks();
};

function handleLastTwoWeeks(response){
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  };
  var data = response.getDataTable();
  var newDt = new google.visualization.DataTable();
  newDt.addColumn('string', 'Week');
  newDt.addColumn('string', 'Category');
  newDt.addColumn('string', 'Impressions');
  newDt.addColumn('string', 'Clicks');
  newDt.addColumn('string', 'CTR');
  newDt.addColumn('string', 'Cost');
  newDt.addColumn('string', 'CPC');
  newDt.addColumn('string', 'Conversions');
  newDt.addColumn('string', 'Avg. Position');
  newDt.addColumn('string', 'CPA');
  newDt.addColumn('string', 'CVR');

  var rowBorderless = ['Weekly variation', 'BORDERLESS'];
  var rowBrand = ['Weekly variation', 'Brand'];
  var rowCompetitor = ['Weekly variation', 'Competitor'];
  var rowCurrency = ['Weekly variation', 'Currency'];
  var rowGeneric = ['Weekly variation', 'Generic'];
  var rowRoute = ['Weekly variation', 'Route'];
  var allNewRows = [rowBorderless, rowBrand, rowCompetitor, rowCurrency, rowGeneric, rowRoute];
  var allVariations = [];

  for(var i = 6; i < 12; i++){ //iterate last 6 rows (most recent week)
    for(k = 2; k < 11; k++){ //iterate columns
      var variation = ((data.getValue(i, k) - data.getValue(i - 6, k)) / data.getValue(i - 6, k)*100).toFixed(2) + "%";
      allVariations.push(variation);
    };
  };

  var x = 0;
  for(var j = 0; j < allVariations.length; j++){
    allNewRows[x].push(allVariations[j]);
    if(allNewRows[x].length == 11) {x++};
  };

  newDt.addRows([
    allNewRows[0],
    allNewRows[1],
    allNewRows[2],
    allNewRows[3],
    allNewRows[4],
    allNewRows[5]
  ]);

  var table = new google.visualization.Table(document.getElementById('tableWoW'));
  table.draw(newDt, {width: '100%'});
};
