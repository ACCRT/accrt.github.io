window.onload = function () {
    document.cookie = "city1=Houston";
    document.cookie = "city2=Dallas";

    var expiry = new Date();
    expiry.setDate(1);
    document.cookie = "city2=Austin; expires=" +
                          expiry.toString();

    if (document.cookie.split(";").length > 1) {
        document.cookie = "state=TX";
    }

    window.console.log(document.cookie);
}