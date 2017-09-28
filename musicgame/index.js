var timeClip = 0;
var greatTime = 0;
var goodTime = 0;
var missTime = 0;

var nodeNum = 100;
var maxScore = 100000;
var greatScore = maxScore / nodeNum;
var goodScore = greatScore / 2;
var missScore = 0;

var combo = 0;
var maxCombo = 0;

var score = 0;
var bestScore = localStorage.bestScore == null ? 0 : localStorage.bestScore;

/*
 * Show the highest score in the seesion on the UI
 */
var showHighestScore = function () {
    setNum("advance_num", bestScore);
}

/*
 * A factory to generate node, push it, and check the tap.
 */
var nodeListFac = function () {
    var list = [];

    return {
        push: function (value) { list.push(value) },
        shift: function () { list.shift() },
        check: function () {
            if(list.length == 0) return;
            var first = list[0];
            var nowTime = getTime();
            var timeDiff = Math.abs(first.duration-(nowTime - first.beginTime));

            var greatTaps = document.getElementsByClassName("great_tap");
            var goodTaps = document.getElementsByClassName("good_tap");
            var missTaps = document.getElementsByClassName("miss_tap");
            if (timeDiff < greatTime) {
                addNum("great_num", 1);
                score += greatScore;
                setNum("score_num", score);
                combo++;
                if (combo > maxCombo) {
                    maxCombo = combo;
                    setNum("combo_num", combo);
                }
                animateTrigger("great_tap");
                first.node.parentNode.removeChild(first.node);
                list.shift();
            }
            else if (timeDiff < goodTime) {
                addNum("good_num", 1);
                score += goodScore;
                setNum("score_num", score);
                combo++;
                if (combo > maxCombo) {
                    maxCombo = combo;
                    setNum("combo_num", combo);
                }
                animateTrigger("good_tap");
                first.node.parentNode.removeChild(first.node);
                list.shift();
            }
            else if (timeDiff < missTime) {
                addNum("miss_num", 1);
                score += missScore;
                setNum("score_num", score);
                combo = 0;
                animateTrigger("miss_tap");
                first.node.parentNode.removeChild(first.node);
                list.shift();
            }
        },
        get:function(){return list;}
    }
};

var leftNodeList = nodeListFac();
var rightNodeList = nodeListFac();

/*
 * Trigger the animate tag in the elementId
 */
var animateTrigger = function (elementId) {
    var elements = document.getElementsByClassName(elementId);
    [].forEach.call(elements, function (element) {
        var animates = element.getElementsByTagName("animate");
        [].forEach.call(animates, function (animate) {
            animate.beginElement();
        });
    });
}

/*
 * Get the current time of the svg.
 */
var getTime = function () {
    return document.getElementById("rootSVG").getCurrentTime();
}

/*
 * Add the num to elementId's origin num
 * Fix it with the origin length, if not long enough, plus 0 before.
 */
var addNum = function (elementId, addNum) {
    var node = document.getElementById(elementId);
    var string = node.getElementsByTagName("textPath")[0].innerHTML;
    var length = string.length;
    var num = Number.parseInt(string);

    num += addNum;

    string = num.toString();
    while (string.length < length) string = '0' + string;
    node.getElementsByTagName("textPath")[0].innerHTML = string;
}

/*
 * Set the num of elementId.
 * Fix it with the origin length, if not long enough, plus 0 before.
 */
var setNum = function (elementId, setNum) {
    var node = document.getElementById(elementId);
    var string = node.getElementsByTagName("textPath")[0].innerHTML;
    var length = string.length;
    var num = setNum;

    string = num.toString();
    while (string.length < length) string = '0' + string;
    node.getElementsByTagName("textPath")[0].innerHTML = string;
}

/*
 * Init time clip
 * BPM means the number of max nodes in one minute
 * Time clip is the min time distance of two nodes of the bpm
 */
var initTimeClip = function () {
    var bpmNumNode = document.getElementById("bpm_num");
    var bpmString = bpmNumNode.getElementsByTagName("textPath")[0].innerHTML;
    var bpm = Number.parseInt(bpmString);
    timeClip = 60 / bpm;
    greatTime = timeClip / 5;
    goodTime = timeClip / 2;
    missTime = timeClip;
}

/*
 * Forbid the menu of the right click of mouse
 */
var forbidRightClickMenu = function () {
    document.oncontextmenu = new Function("event.returnValue=false;");
    document.onselectstart = new Function("event.returnValue=false;");
}

/*
 * Show the left shade when click
 */
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

/*
 * Show the right shade when click
 */
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

/*
 * Fuction to generate a svg element
 */
function parseSVG(s) {
    var div = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + s + '</svg>';
    var frag = document.createDocumentFragment();
    while (div.firstChild.firstChild)
        frag.appendChild(div.firstChild.firstChild);
    return frag;
}

/*
 * The factory of node in red, blue and yellow
 */
var nodeFactory = function () {
    var yellow = { name: "yellow", fill: "fill_orange500", i: 0 };
    var blue = { name: "blue", fill: "fill_light_blue500", i: 0 };
    var red = { name: "red", fill: "fill_red500", i: 0 };

    var left = { cx: -409, cy: 1430, from: 0, to: 90 };
    var right = { cx: 1689, cy: 1430, from: 0, to: -90 };
    
    var duration = 2;

    var generateNode = function (color, position, list) {
        var node = parseSVG(
            '<svg id="' + color.name + '_node' + color.i + '">'
                + '<circle class="' + color.fill + '" cx="' + position.cx + '" cy="' + position.cy + '" r="34">'
                    + '<animateTransform id="'+color.name+'_animation'+color.i+'" attributeName="transform" attributeType="XML"'
                        + 'type="rotate"'
                        + 'from="' + position.from + ' 640 1430" to="' + position.to + ' 640 1430"'
                        + 'begin="indefinite" dur="'+duration+'s"'
                        + 'repeatCount="1">'
                     + '</animateTransform>'
                    + '<animate attributeName="opacity" begin="' + color.name + '_animation' + color.i + '.end"'
                            + 'from="0.5" to="0.5" dur="'+goodTime+'s" repeatCount="1" />'
                + '</circle>'
                + '<circle class="fill_brown900" r="30" cx="' + position.cx + '" cy="' + position.cy + '">'
                    + '<animateTransform attributeName="transform"'
                        + 'type="rotate"'
                        + 'from="' + position.from + ' 640 1430" to="' + position.to + ' 640 1430"'
                        + 'begin="indefinite" dur="'+duration+'s"'
                        + 'repeatCount="1">'
                   + '</animateTransform>'
                    + '<animate attributeName="opacity" begin="' + color.name + '_animation' + color.i + '.end"'
                            + 'from="0.5" to="0.5" dur="' + goodTime + 's" repeatCount="1" />'
                + '</circle>'
                + '<circle class="' + color.fill + '" r="26" cx="' + position.cx + '" cy="' + position.cy + '">'
                    + '<animateTransform attributeName="transform"'
                        + 'type="rotate"'
                        + 'from="' + position.from + ' 640 1430" to="' + position.to + ' 640 1430"'
                        + 'begin="indefinite" dur="'+duration+'s"'
                        + 'repeatCount="1">'
                    + '</animateTransform>'
                    + '<animate attributeName="opacity" begin="' + color.name + '_animation' + color.i + '.end"'
                            + 'from="0.5" to="0.5" dur="' + goodTime + 's" repeatCount="1" />'
                + '</circle>'
            + '</svg>'
        )
        var nodeList = document.getElementById('note_list');
        var preNode = nodeList.getElementById(color.name+"_node" + (color.i - 1));
        nodeList.insertBefore(node, preNode == null ? null : preNode);

        node = nodeList.getElementById((color.name + "_node" + color.i));
        var transformAnimates = node.getElementsByTagName("animateTransform");
        var animates = node.getElementsByTagName("animate");
        [].forEach.call(transformAnimates, function (transformAnimate) {
            transformAnimate.onend = function () {
                transformAnimate.parentNode.setAttribute("cx", 640);
                transformAnimate.parentNode.setAttribute("cy", 381);
            }
            transformAnimate.beginElement();
        });

        [].forEach.call(animates, function (animate) {
            animate.onend = function () {
                if (node.parentNode != null) {
                    addNum("miss_num", 1);
                    score += missScore;
                    setNum("score_num", score);
                    combo = 0;
                    animateTrigger("miss_tap");
                    node.parentNode.removeChild(node);
                    list.shift();
                }
            }
        });

        list.push({ node: node, beginTime: getTime(), duration: duration });
        color.i++;
        return node;
    }
    return {
        generateBlueNode: function () {
            generateNode(blue, right, rightNodeList);
        },
        generateRedNode: function () {
            generateNode(red, left, leftNodeList);
            
        },
        generateYellowNode: function () {
            generateNode(yellow, left, leftNodeList);
            generateNode(yellow, right, rightNodeList);
        }
    }    
}

var nodeFac = nodeFactory();

/*
 * The function to actually generate Node
 */
var generateNodeFun = function () {
    var i = 0;

    var generateNode = function () {
        var value = Math.floor(Math.random() * 6);
        if (value == 0) {
            nodeFac.generateBlueNode();
            i++;
        }
        else if (value == 1) {
            nodeFac.generateRedNode();
            i++;
        }
        else if (value == 2) {
            nodeFac.generateYellowNode();
            i += 2;
        }
        else ;
        if (i >= nodeNum) {
            interval = clearInterval(interval);
            if (score > bestScore) {
                bestScore = score;
                localStorage.bestScore = score;
            }

            setTimeout(function () {
                var change_animate_part1 = document.getElementById("change_animate_part1");
                var change_animate_part2 = document.getElementById("change_animate_part2");
                change_animate_part1.onend = function () {
                    initUI();
                }
                change_animate_part2.onend = function () {
                    showUI();
                }
                change_animate_part1.beginElement();
            }, 4000);
        }
    }

    var interval = setInterval(generateNode, timeClip * 1000);
}

window.onload = function () {
    forbidRightClickMenu();

    initUI();
}

/*
 * Show the UI instead of Game
 */
var showUI = function () {
    document.getElementById("game").style.visibility = "hidden";
    document.getElementById("ui").style.visibility = "unset";
};

/*
 * Show the game instead of UI
 */
var showGame = function () {
    document.getElementById("game").style.visibility = "unset";
    document.getElementById("ui").style.visibility = "hidden";
}

/*
 * Init the ui with show the highest score, ui, and set click function
 */
var initUI = function () {
    showHighestScore();
    showUI();
    document.onmousedown = function () {
        if (event.button == 0) {
            var change_animate_part1 = document.getElementById("change_animate_part1");
            var change_animate_part2 = document.getElementById("change_animate_part2");
            change_animate_part1.onend = function () {
                showGame();
            }
            change_animate_part2.onend = function () {
                initGame();
            }
            change_animate_part1.beginElement();
        }
        return true;
    }
}

/*
 * Init the game.
 */
var initGame = function () {

    combo = 0;
    maxCombo = 0;
    setNum("miss_num", 0);
    setNum("great_num", 0);
    setNum("good_num", 0);

    score = 0;

    initTimeClip();

    generateNodeFun();

    document.onmousedown = function () {
        if (event.button == 0) {
            leftClickShade().on();
            leftNodeList.check();
        }
        else if (event.button == 2) {
            rightClickShade().on();
            rightNodeList.check();
        }
        return true;
    }

    document.onmouseup = function () {
        if (event.button == 0) leftClickShade().off();
        else if (event.button == 2) rightClickShade().off();
    }
}
