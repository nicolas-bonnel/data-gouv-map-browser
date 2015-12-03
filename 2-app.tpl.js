angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("view.html","<h1>Nombre de jeux de données par département sur le site data.gouv.fr</h1>\nIl n\'est pour l\'instant pas possible de lister les jeux de données à partir de cet écran, l\'api ne supportant pas les requêtes cross-domaine pour tous les end-points. :(\n<div class=\"row\">\n  <div id=\"legend\" class=\"col-sm-1\">\n    <h4>{{sum}} datasets</h4>\n  </div>\n  <div id=\"map\" class=\"col-sm-6\"></div>\n  <div id=\"datasets\" class=\"col-sm-5\">\n    <h4 ng-if=\"catalog\">\n      {{catalog.total}} jeux de données -&nbsp;\n      <a ng-if=\"catalog.previous_page\" ng-click=\"getCatalog(catalog.previous_page);\" style=\"cursor:pointer;\">Précédent</a>\n      {{(catalog.page-1)*catalog.page_size+1}}-{{catalog.page*catalog.page_size}}\n      <a ng-if=\"catalog.next_page\" ng-click=\"getCatalog(catalog.next_page);\" style=\"cursor:pointer;\">Suivant</a>\n    </h4>\n    <ul class=\"list-unstyled\">\n      <li ng-repeat=\"dataset in catalog.data\">\n        <h5><a target=\"_blank\" ng-href=\"{{dataset.page}}\">{{dataset.title}}</a></h5>\n        <p title=\"{{dataset.description}}\">{{dataset.description|characters:230}}</p>\n        <hr ng-if=\"!$last\" />\n      </li>\n    </ul>\n  </div>\n</div>\n");}]);