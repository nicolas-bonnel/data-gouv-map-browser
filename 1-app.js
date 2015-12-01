var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');
  $stateProvider.state('app', {
    url: '/',
    templateUrl: 'view.html',
    controller: function($scope, $http, data) {
      var width = 960, height = 800;
      var projection = d3.geo.mercator().center([4, 48]).scale(3000);

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
      var generator = d3.scale.cubehelix().domain([0, numColors - 1]).range([
        d3.hsl(-100, 0.95, 0.32),
        d3.hsl(80, 1.15, 0.62),
        d3.hsl(220, 0.55, 0.32)
      ]);

      var range = d3.range(numColors).map(generator);
      var quantile = d3.scale.quantile().domain(sizes).range(range);

      var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
          return '<strong>' + d.properties.name + ' (' + d.properties.code + ')</strong><br>Datasets: <span style="color:red">' + d.properties.datasets + '</span>';
        });

      var svg = d3.select("#map").append("svg").attr("width", width).attr("height", height);
      svg.call(tip);

      var path = d3.geo.path().projection(projection);
      var g = svg.append("g");

      g.selectAll("path").data(data.features).enter()
        .append("path").attr("d", path).attr("fill", function(d) {
          return quantile(d.properties.datasets);
          // return d3.hsl(180,0.9,0.1+0.5*(d.properties.datasets-extent[0])/(extent[1]-extent[0]))
        }).on('mouseover', tip.show).on('mouseout', tip.hide).on('click',function(d){
          console.log(d);
          $http.get('https://www.data.gouv.fr/api/1/datasets?geozone='+encodeURIComponent(d.id)).then(function(result){
            console.log(result.data);
          });
        });

      column(quantile);

      function column(scale) {
        var legend = d3.legend.color().labelFormat(d3.format(",.0f")).cells(10).scale(scale);
        var div = d3.select("#legend").append("div").attr("class", "column");
        var svg = div.append("svg");
        svg.append("g").attr("class", "legendQuant").attr("transform", "translate(20,20)");
        svg.select(".legendQuant").call(legend);
      };
    },
    resolve: {
      // levels : function($http){
      //   return $http.get('https://www.data.gouv.fr/api/1/spatial/levels');
      // },
      data: function($http) {
        // a data file can be provided for dev to avoid loading data.gouv.fr
        return data || $http.get('https://www.data.gouv.fr/api/1/spatial/coverage/fr%2Fcounty').then(function(result) {
          return result.data;
        });
      }
    }
  });
});

!function(){function t(t){return function(e,i){e=d3.hsl(e),i=d3.hsl(i);var r=(e.h+120)*a,h=(i.h+120)*a-r,s=e.s,l=i.s-s,o=e.l,u=i.l-o;return isNaN(l)&&(l=0,s=isNaN(s)?i.s:s),isNaN(h)&&(h=0,r=isNaN(r)?i.h:r),function(a){var e=r+h*a,i=Math.pow(o+u*a,t),c=(s+l*a)*i*(1-i);return"#"+n(i+c*(-.14861*Math.cos(e)+1.78277*Math.sin(e)))+n(i+c*(-.29227*Math.cos(e)-.90649*Math.sin(e)))+n(i+c*1.97294*Math.cos(e))}}}function n(t){var n=(t=0>=t?0:t>=1?255:0|255*t).toString(16);return 16>t?"0"+n:n}var a=Math.PI/180;d3.scale.cubehelix=function(){return d3.scale.linear().range([d3.hsl(300,.5,0),d3.hsl(-240,.5,1)]).interpolate(d3.interpolateCubehelix)},d3.interpolateCubehelix=t(1),d3.interpolateCubehelix.gamma=t}();
