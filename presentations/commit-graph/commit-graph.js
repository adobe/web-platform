Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color) {
	// remember the grid
	this.gridLocation = { x:x, y:y, w:w, h:h, wv:wv, hv:hv };

    color = color || "#000";
    var path = ["M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + w) + .5, Math.round(y) + .5, Math.round(x + w) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y) + .5],
        rowHeight = h / hv,
        columnWidth = w / wv;
    for (var i = 1; i < hv; i++) {
        path = path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5, "H", Math.round(x + w) + .5]);
    }
    for (i = 1; i < wv; i++) {
        path = path.concat(["M", Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
    }
    return this.path(path.join(",")).attr({stroke: color});
};

Raphael.fn.drawBaseline = function() {

    return;
};


// Hide the input data table
$(function () {
    $("#data").css({
        position: "absolute",
        left: "-9999em",
        top: "-9999em",
    });
});


window.onload = function(){
    // Grab the data
    var labels = [],
        data = [];
    $("#data tfoot th").each(function () {
        labels.push($(this).html());
    });
    $("#data tbody td").each(function () {
        data.push($(this).html());
    });

    // Replace table-based data with JSON-based input
    var commitdata = [
        {
            label: "1/1/2012",
            value: "0",
        },
        {
            label: "2/1/2012",
            value: "7",
        },
        {
            label: "3/1/2012",
            value: "31",
        },
        {
            label: "4/1/2012",
            value: "425",
        }
    ];
    labels = [], data = [];
    for (var i = commitdata.length - 1; i >= 0; i--) {
        labels.push(commitdata[i].label);
        data.push(commitdata[i].value);
    };

    var width = 800,
        height = 250,
        leftgutter = 20,
        bottomgutter = 40,
        topgutter = 20,
        colorhue =  Math.random(),
        color = "hsl(" + [colorhue, .5, .5] + ")",
        columncount  = commitdata.length, /* labels.length */
        rowincrement = 50,
        r = Raphael("commit-holder", width, height),
        txt = {font: '12px Ubuntu, Arial', fill: "#fff"},
        txt1 = {font: '10px Ubuntu, Arial', fill: "#fff"},
        txt2 = {font: '12px Ubuntu, Arial', fill: "#000"},
        X = (width - leftgutter) / columncount,
        max = Math.max.apply(Math, data),
        committarget = 300,
        max = Math.max( max, committarget ),
        Y = (height - bottomgutter - topgutter) / max;

    alert("max = "+max);
    function drawBaseline( startval, endval, attr ){
        var path = r.path()
            .attr( {stroke: "#aaa", "stroke-width": 2, "stroke-linejoin": "round"}),
            x0 = leftgutter + X * .5,
            y0 = height - bottomgutter - Y * startval + path.attr("stroke-width"),
            x1 = x0 + X * columncount - X,
            y1 = height - bottomgutter - Y * endval + path.attr("stroke-width"),
            p = ['M', x0, y0, 'L', x1, y1 ];
        path.attr( {path: p} );
        return path.toBack();
    };

	// Creates circle at x = 50, y = 40, with radius 10
	circle = r.circle(250, 40, 50)
	// Sets the fill attribute of the circle to red (#f00)
	circle.attr("fill", color);
	// Sets the stroke attribute of the circle to white
	circle.attr("stroke", "#f0f");


    r.drawGrid(leftgutter + X * .5 + .5, topgutter + .5, width - leftgutter - X, height - topgutter - bottomgutter, columncount, Math.floor( max/rowincrement) , "#000");
    drawBaseline(0, committarget, false)


    circle.toFront();
};