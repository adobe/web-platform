Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, wl, hl, color) {
	// remember the grid
	this.gridLocation = { x:x, y:y, w:w, h:h, wv:wv, hv:hv };

    var wlabels = null;
    if ( wl ){
        wlabels = this.set();
    }
    color = color || "#000";
    var path = ["M"
                , Math.round(x) + .5, Math.round(y) + .5 /* TL */
            , "L"
                , Math.round(x + w) + .5, Math.round(y) + .5 /* TR */
                , Math.round(x + w) + .5, Math.round(y + h) + .5 /* BR */
                , Math.round(x) + .5, Math.round(y + h) + .5 /* BL */
                , Math.round(x) + .5, Math.round(y) + .5], /* TL, again */
        rowHeight = h / hv,
        columnWidth = w / wv;
    for (var i = 1; i < hv; i++) {
       path = path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5
                         , "H", Math.round(x + w) + .5]);
    }
    for (i = 1; i < wv; i++) {
        path = path.concat(["M", Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
        if ( wl[i] ) {
            var text = this.text( x + i * columnWidth + .5, 
                    Math.round(y + h) + (.5 * rowHeight) + .5
                    , wl[i]).attr( this.textattr );
            wlabels.push( );
        }
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

    var results = commits.results,
        commitdata = []

    for (var i = 0; i < results.length; i++)
    {
        commitdata.push({label: results[i].until, value: results[i].total })
    }

    labels = [], data = [];
    for (var i = 0; i < commitdata.length; i++) {
        var d = new Date( commitdata[i].label );
        var l = d.getMonth()+1+'/'+(d.getDate()+1)+'/'+d.getFullYear();
        labels.push(l);
        data.push(commitdata[i].value);
    };

    var width = 800,
        height = 250,
        leftgutter = 20,
        bottomgutter = 40,
        topgutter = 20,
        colorhue =  Math.random(),
        color = "hsl(" + [colorhue, .5, .5] + ")",
        columncount  = 52,
        rowincrement = 50,
        r = Raphael("commit-holder", width, height),
        textattr = {font: '10px Ubuntu, Arial', fill: color},
        txt1 = {font: '10px Ubuntu, Arial', fill: "#fff"},
        txt2 = {font: '12px Ubuntu, Arial', fill: "#000"},
        X = (width - leftgutter) / columncount,
        max = Math.max.apply(Math, data),
        committarget = 300,
        max = Math.max( max, committarget ),
        Y = (height - bottomgutter - topgutter) / max;

        r.textattr = textattr;

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

    r.drawGrid(leftgutter + X * .5 + .5  /* x */
                , topgutter + .5  /* y */
                , width - leftgutter - X /* w */
                , height - topgutter - bottomgutter /* h */
                , 11 /* wv */
                , Math.floor( max/rowincrement)  /* hv */
                , ['1/1','2/1','3/1','4/1','5/1','6/1','7/1','8/1','9/1','10/1','11/1','12/1'] /* wl */
                , null /* hl */
                , "#000" /* color */
                );
    var baseline = drawBaseline(0, committarget, false);

    // Draw the commit data path
    var cp = r.path()
        .attr( {"stroke": color, "stroke-width": 4, "stroke-linejoin": "round"}),
        cpp = [];
    for (var i = 0; i < data.length; i++) {
        var x0 = leftgutter + X * ( i + .5 ),
            y0 = height - bottomgutter - Y * data[i] + cp.attr("stroke-width");
            if (!i) 
                cpp.push(['M', x0, y0, 'C', x0, y0 ])
            else
                cpp.push([x0, y0])
    }
    cp.attr({path: cpp});

};