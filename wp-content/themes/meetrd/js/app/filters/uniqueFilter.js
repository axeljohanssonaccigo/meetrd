//Unique filter for ng-repeat

angular.module('uniqueFilter', []).filter('unique', [function () {
    return function (arr, field) {
        return _.uniq(arr, function (a) {
            return a[field];
        });
    };
}]);