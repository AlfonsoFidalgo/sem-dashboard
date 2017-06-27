google.charts.load('current', {'packages' : ['table']});
google.charts.setOnLoadCallback(function() { sendAndDraw('') });

var dataSourceUrl = 'https://docs.google.com/spreadsheets/d/1Mw9VkPaciMng7HMmVTa-s7nmIpqdpzyNWsorX7xyJnE/gviz/tq?sheet=Sheet1&headers=1&tq=';
var query;

function sendAndDraw(queryString) {
  var container = document.getElementById('qResult');
  var chart = new google.visualization.Table(container);
  query && query.abort();
  query = new google.visualization.Query(dataSourceUrl + queryString);
  var queryWrapper = new QueryWrapper(query, chart, {'page': 'enable', 'pageSize': 50}, container);
  queryWrapper.sendAndDraw();
}
