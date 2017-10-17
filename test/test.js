window.onload = function () {
    document.cookie = "city1=Houston";
    document.cookie = "city2=Dallas";

    if (document.cookie.split(";").length > 1) {
        document.cookie = "state=TX";
    }

    window.console.log(document.cookie);
}