angular.module('App', [])
.controller('ContentController', function ($scope) {
    var content = this;
    content.page = 1;

    $scope.$watch(
        function () { return document.getElementById('billboard').scrollWidth },
        function (oldValue, newValue) {
            if(newValue != 0)
                document.getElementById('billboard').height = newValue / 560 * 420;
        });

    $scope.$watch(
        function () { return document.getElementById('hellocorn').scrollWidth },
        function (oldValue, newValue) {
            if (newValue != 0)
                document.getElementById('hellocorn').height = newValue / 480 * 270;
        });

    $scope.$watch(
        function () { return document.getElementById('musicube1').scrollWidth },
        function (oldValue, newValue) {
            if (newValue != 0)
                document.getElementById('musicube1').height = newValue / 560 * 315;
        });

    $scope.$watch(
        function () { return document.getElementById('musicube2').scrollWidth },
        function (oldValue, newValue) {
            if (newValue != 0)
                document.getElementById('musicube2').height = newValue / 560 * 315;
        });

    $scope.$watch(
        function () { return document.getElementById('memorycage').scrollWidth },
        function (oldValue, newValue) {
            if (newValue != 0)
                document.getElementById('memorycage').height = newValue / 560 * 315;
        });

    $scope.$watch(
        function () { return document.getElementById('supperzzle').scrollWidth },
        function (newValue, oldValue) {
            if (newValue != 0)
                document.getElementById('supperzzle').height = newValue / 560 * 420;
        });

    content.changePage = function(page)
    {
        content.page = page;
    }
})
