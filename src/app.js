var app = angular.module('app', ['ui.router','truncate']);

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');
  $stateProvider.state('app', {
    url: '/',
    templateUrl: 'view.html',
    controller: function($scope, $http, data) {
      var width = 700, height = 600;
      var projection = d3.geo.mercator().center([5.5, 47.5]).scale(2500);

      var extent = $scope.extent = d3.extent(data.features, function(d) {
        return d.properties.datasets;
      });
      $scope.sum = d3.sum(data.features, function(d) {
        return d.properties.datasets;
      });
      data.features.sort(function(a, b) {
        return a.properties.datasets - b.properties.datasets;
      });

      var sizes = data.features.map(function(f) {
        return f.properties.datasets;
      });

      var numColors = 8;
      var generator = d3.scale.cubehelix().domain([0, numColors/2, numColors]).range([
        // d3.hsl(-100, 0.95, 0.32),
        // d3.hsl(80, 1.15, 0.62),
        // d3.hsl(220, 0.55, 0.32)
        d3.hsl(-10, 0.8, 0.4),
        d3.hsl(60, 0.9, 0.7),
        d3.hsl(110, 0.7, 0.5)
      ]);

      var range = d3.range(numColors).map(generator);
      var quantile = d3.scale.quantile().domain(sizes).range(range);

      var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
          return '<strong>' + d.properties.name + ' (' + d.properties.code + ')</strong><br>Datasets: <span style="color:red">' + d.properties.datasets + '</span>';
        });

      $scope.getCatalog = function(uri){
        $http.get(uri).then(function(result){
          $scope.catalog = result.data;
        });
      };

      var svg = d3.select("#map").append("svg").attr("width", width).attr("height", height);
      svg.call(tip);

      var path = d3.geo.path().projection(projection);
      var g = svg.append("g");

      g.selectAll("path").data(data.features).enter()
        .append("path").attr("d", path).attr("fill", function(d) {
          return quantile(d.properties.datasets);
          // return d3.hsl(180,0.9,0.1+0.5*(d.properties.datasets-extent[0])/(extent[1]-extent[0]))
        }).on('mouseover', tip.show).on('mouseout', tip.hide).on('click',function(d){
          $scope.getCatalog('https://www.data.gouv.fr/api/1/datasets/?page_size=5&geozone='+encodeURIComponent(d.id));
        });

      column(quantile);

      function column(scale) {
        var legend = d3.legend.color().labelFormat(d3.format(",.0f")).cells(10).scale(scale);
        var div = d3.select("#legend").append("div").attr("class", "column");
        var svg = div.append("svg");
        svg.append("g").attr("class", "legendQuant").attr("transform", "translate(20,20)");
        svg.select(".legendQuant").call(legend);
      }
    },
    resolve: {
      // levels : function($http){
      //   return $http.get('https://www.data.gouv.fr/api/1/spatial/levels');
      // },
      data: function($http) {
        // a data file can be provided for dev to avoid loading data.gouv.fr
        return $http.get('https://www.data.gouv.fr/api/1/spatial/coverage/fr%2Fcounty').then(function(result) {
          return result.data;
        });
      }
    }
  });
});
