angular.module('App', [])
.controller('ContentController', function () {
    var content = this;
    content.page = 1;

    content.changePage = function(page)
    {
        content.page = page;
    }
})
