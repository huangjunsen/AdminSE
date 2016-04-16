$(function(){
  //参数js内部全局变量

  //自定义函数

  /**
  * 初始化 添加Chartjs图形
  * 
  * @param Null
  * @return false
  */
  function initChartjsChart(){
    var ctx;
    var Canvas = '<canvas height="150px"></canvas>';
    var randomFactor = function(){ return Math.round(Math.random()*100)};
    var lineBaseData = {
      labels : ["a","b","c","d","e"],
      datasets : [
        {
          label: "1",
          fillColor : "rgba(220,120,120,0.5)",
          strokeColor : "rgba(220,120,120,1)",
          pointColor : "rgba(220,120,120,1)",
          pointStrokeColor : "#fff",
          pointHighlightFill : "#fff",
          pointHighlightStroke : "rgba(220,120,120,1)",
          data : [randomFactor(),randomFactor(),randomFactor(),randomFactor(),randomFactor()]
        },
        {
          label: "2",
          fillColor : "rgba(151,187,205,0.5)",
          strokeColor : "rgba(151,187,205,1)",
          pointColor : "rgba(151,187,205,1)",
          pointStrokeColor : "#fff",
          pointHighlightFill : "#fff",
          pointHighlightStroke : "rgba(151,187,205,1)",
          data : [randomFactor(),randomFactor(),randomFactor(),randomFactor(),randomFactor()]
        }
      ]
    };
    var pieData = [
      {value: 300,color:"#F7464A",highlight: "#FF5A5E",label: "a"},
      {value: 50,color: "#46BFBD",highlight: "#5AD3D1",label: "b"},
      {value: 100,color: "#FDB45C",highlight: "#FFC870",label: "c"},
      {value: 40,color: "#949FB1",highlight: "#A8B3C5",label: "d"},
      {value: 120,color: "#4D5360",highlight: "#616774",label: "e"}
    ];
    //相应页面大小变化
    Chart.defaults.global.responsive = true;
    //去除所有选中状态
    $('#DashBoardCharts .press-hover').removeClass('press-on');

    $('#ChartJSLineChart').html(Canvas);
    ctx = $('#ChartJSLineChart canvas').get(0).getContext("2d");
    var ChartJSLineChart = new Chart(ctx).Line(lineBaseData,{datasetFill:false});

    $('#ChartJSBarChart').html(Canvas);
    ctx = $('#ChartJSBarChart canvas').get(0).getContext("2d");
    var ChartJSBarChart = new Chart(ctx).Bar(lineBaseData);

    $('#ChartJSRadarChart').html(Canvas);
    ctx = $('#ChartJSRadarChart canvas').get(0).getContext("2d");
    var ChartJSRadarChart = new Chart(ctx).Radar(lineBaseData);

    $('#ChartJSDoughnutChart').html(Canvas);
    ctx = $('#ChartJSDoughnutChart canvas').get(0).getContext("2d");
    var ChartJSDoughnutChart = new Chart(ctx).Doughnut(pieData);

    $('#ChartJSPieChart').html(Canvas);
    ctx = $('#ChartJSPieChart canvas').get(0).getContext("2d");
    var ChartJSPieChart = new Chart(ctx).Pie(pieData);

    $('#ChartJSPolarChart').html(Canvas);
    ctx = $('#ChartJSPolarChart canvas').get(0).getContext("2d");
    var ChartJSPolarChart = new Chart(ctx).PolarArea(pieData);

    return false;
  };

  /**
  * 初始化 添加Plitlyjs图形
  * 
  * @param Null
  * @return false
  */
  function initPlitlyjsChart(){
    var option = {    //公共选项
      displaylogo: false,    //不显示poltly logo
      // staticPlot: true       //设置为静态图形
      // displayModeBar: true   //永远显示工具栏
      // scrollZoom: true       //响应鼠标滚动缩放
    }

    //****************************Line*****************//
    var trace1 = {
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
      mode: 'markers'    //仅点
    };
    var trace2 = {
      x: [2, 3, 4, 5],
      y: [16, 5, 11, 10],
      mode: 'lines'    //仅线
    };
    var trace3 = {
      x: [1, 2, 3, 4],
      y: [12, 9, 15, 12],
      mode: 'lines+markers'    //线+点
    };
    var data = [ trace1, trace2, trace3 ];    //数据列，元素数量表示线条数量

    var layout = {
      title:'点线图示例',
      height: 400,
      // width: 480
    };    //布局设置，标题、高、宽

    Plotly.newPlot('PlitlyJSLineChart', data, layout, option);


    //****************************Bar*****************//
    var xData = ['Product<br>Revenue', 'Services<br>Revenue',
      'Total<br>Revenue', 'Fixed<br>Costs',
      'Variable<br>Costs', 'Total<br>Costs', 'Total'
    ];
    var yData = [400, 660, 660, 590, 400, 400, 340];
    var textList = ['$430K', '$260K', '$690K', '$-120K', '$-200K', '$-320K', '$370K'];

    var trace1 = {
      x: xData,
      y: [0, 430, 0, 570, 370, 370, 0],
      marker: {
        color: 'rgba(1,1,1,0.0)'
      },
      type: 'bar'
    };
    var trace2 = {
      x: xData,
      y: [430, 260, 690, 0, 0, 0, 0],
      type: 'bar',
      marker: {
        color: 'rgba(55,128,191,0.7)',
        line: {
          color: 'rgba(55,128,191,1.0)',
          width: 2
        }
      }
    };
    var trace3 = {
      x: xData,
      y: [0, 0, 0, 120, 200, 320, 0],
      type: 'bar',
      marker: {
        color: 'rgba(219, 64, 82, 0.7)',
        line: {
          color: 'rgba(219, 64, 82, 1.0)',
          width: 2
        }
      }
    };
    var trace4 = {
      x: xData,
      y: [0, 0, 0, 0, 0, 0, 370],
      type: 'bar',
      marker: {
        color: 'rgba(50,171, 96, 0.7)',
        line: {
          color: 'rgba(50,171,96,1.0)',
          width: 2
        }
      }
    };
    var data = [trace1, trace2, trace3, trace4];

    var layout = {
      title: '瀑布图示例',
      barmode: 'stack',
      paper_bgcolor: 'rgba(245,246,249,1)',
      plot_bgcolor: 'rgba(245,246,249,1)',
      // width: 480,
      height: 400,
      showlegend: false,
      annotations: []
    };

    for ( var i = 0 ; i < xData.length ; i++ ) {
      var result = {
        x: xData[i],
        y: yData[i],
        text: textList[i],
        font: {
          family: 'Arial',
          size: 14,
          color: 'rgba(245,246,249,1)'
        },
        showarrow: false
      };
      layout.annotations.push(result);
    }

    Plotly.newPlot('PlitlyJSBarChart', data, layout, option);

    //****************************Bar*****************//
    // Enter a speed between 0 and 180
    var level = 175;
    // Trig to calc meter point
    var degrees = 180 - level,radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
         pathX = String(x),
         space = ' ',
         pathY = String(y),
         pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ type: 'scatter',
       x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'speed',
        text: level,
        hoverinfo: 'text+name'},
      { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
      rotation: 90,
      text: ['TOO FAST!', 'Pretty Fast', 'Fast', 'Average',
                'Slow', 'Super Slow', ''],
      textinfo: 'text',
      textposition:'inside',      
      marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                       'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                       'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                       'rgba(255, 255, 255, 0)']},
      labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: '<b>仪表盘</b> <br> Speed 0-100',
      height: 400,
      // width: 1000,
      xaxis: {zeroline:false, showticklabels:false,showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('PlitlyJSGaugeChart', data, layout, option);

    //****************************Contour*****************//
    var data = [{
      z: [[10, 10.625, 12.5, 15.625, 20],
           [5.625, 6.25, 8.125, 11.25, 15.625],
           [2.5, 3.125, 5., 8.125, 12.5],
           [0.625, 1.25, 3.125, 6.25, 10.625],
           [0, 0.625, 2.5, 5.625, 10]],
      x: [-9, -6, -5 , -3, -1],
      y: [0, 1, 4, 5, 7],
      type: 'contour'
    }];

    var layout = {
      title: '等高线图示例',
      height: 400
    };

    Plotly.newPlot('PlitlyJSContourChart', data, layout);
    return false;
  };

  /**
  * main
  * 
  * @return false
  */
  function startUp(){
    //初始化菜单
    $(".sidebar-menu").html(getMenuStr());
    highLightMenu('DashBoard');

    hljs.initHighlightingOnLoad();

    initChartjsChart();
    initPlitlyjsChart();

    return false;
  }

  //main
  startUp();
});
