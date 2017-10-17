window.onload = function () {
    console.log("tets");
    document.cookie = "city=Houston";
    document.cookie = "city=Dallas";

    if (document.cookie.split(";").length > 1) {
        document.cookie = "state=TX";
    }

    window.console.log(document.cookie);
}