window.onload = function () {
    forbidRightClickMenu();

    document.onmousedown = function () {
        console.log("on")
        console.log(event);
        if (event.button == 0) {
            console.log(event);
            leftClickShade().on();
        }
        else if (event.button == 2) rightClickShade().on();
        return true;
    }

    document.onmouseup = function () {
        console.log("off")
        console.log(event);
        if(event.button == 0)  leftClickShade().off();
        else if (event.button == 2) rightClickShade().off();
    }
}

/*
 * Forbid the menu of the right click of mouse
 */
var forbidRightClickMenu = function () {

    console.log(document.implementation.hasFeature('http://www.w3.org/TR/SVG2/feature#GraphicsAttribute', 2.0));

    document.oncontextmenu = new Function("event.returnValue=false;");
    document.onselectstart = new Function("event.returnValue=false;");
}

var leftClickShade = function () {
    var redTapShade = document.getElementById("redTapShade");

    return {
        on:function(){
            redTapShade.style.visibility = "unset";
        },
        off:function(){
            redTapShade.style.visibility = "hidden";
        }
    }
};

var rightClickShade = function () {
    var blueTapShade = document.getElementById("blueTapShade");

    return {
        on:function(){
            blueTapShade.style.visibility = "unset";
        },
        off:function(){
            blueTapShade.style.visibility = "hidden";
        }
    }
};