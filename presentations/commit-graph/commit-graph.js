Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, wl, hl, color) {
	// remember the grid
	this.gridLocation = { x:x, y:y, w:w, h:h, wv:wv, hv:hv };

    var wlabels = this.set()
        ,hlabels = this.set();

    color = color || "#000";
    this.monthCoords = [{ x: Math.round(x) + .5, y:0 }];
    /* Start with the outer box */
    var path = ["M"
                , Math.round(x) + .5, Math.round(y) + .5 /* TL */
            , "L"
                , Math.round(x + w) + .5, Math.round(y) + .5 /* TR */
                , Math.round(x + w) + .5, Math.round(y + h) + .5 /* BR */
                , Math.round(x) + .5, Math.round(y + h) + .5 /* BL */
                , Math.round(x) + .5, Math.round(y) + .5], /* TL, again */
        rowHeight = h / hv,
        columnWidth = w / wv;
    /* then row markers */
    for (var i = 1; i < hv; i++) {
       path = path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5
                         , "H", Math.round(x + w) + .5]);
    }
    /* then column markers */
    for (i = 1; i < wv; i++) {
        var x0 = Math.round(x + i * columnWidth) + .5;
        this.monthCoords[this.monthCoords.length] = {x: x0, y:0};
        path = path.concat(["M", x0, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
    }

    /* x-axis labels */
    for (i = 0; i < wl.length+1; i++)
    {
        if ( wl[i] ) {
            var text = this.text( x + i * columnWidth + .5
                    , Math.round(y + h) + (.5 * rowHeight) + .5
                    , wl[i]).attr( this.textattr ).attr({stroke: color});
            wlabels.push( );
        }
    }
    /* y-axis labels */
    for (i = 0; i < hl.length+1; i++)
    {
        if ( hl[i] ) {
            var text = this.text( x + - .3 * columnWidth + .5
                    , Math.round(y + h) - (i * rowHeight) + .5
                    , hl[i]).attr( this.textattr ).attr({stroke: color});
            hlabels.push( );
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
        leftgutter = 40,
        rightgutter = 20,
        bottomgutter = 40,
        topgutter = 20,
        colorhue =  Math.random(),
        color = "#bf3f6c", /*hsl(" + [colorhue, .5, .5] + ")", */
        columncount  = 52,
        rowincrement = 50,
        r = Raphael("graph-holder", width, height),
        textattr = {font: '10px Ubuntu, Arial', fill: color},
        X = (width - leftgutter - rightgutter) / columncount,
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

    var gridrowcount = Math.floor( max/rowincrement)
        , gridrowvals = [];
    for (var i = 0; i<gridrowcount+1; i++) gridrowvals[i] = i*rowincrement;
    r.drawGrid(leftgutter + X * .5 + .5  /* x */
                , topgutter + .5  /* y */
                , width - leftgutter - rightgutter - X /* w */
                , height - topgutter - bottomgutter /* h */
                , 12 /* wv */
                , gridrowcount  /* hv */
                , ['1/1','2/1','3/1','4/1','5/1','6/1','7/1','8/1','9/1','10/1','11/1','12/1'] /* wl */
                , gridrowvals /* hl */
                , "#000" /* color */
                );
    var baseline = drawBaseline(0, committarget, false);

    // Draw the commit data path
    var cp = r.path()
        .attr( {"stroke": color, "stroke-width": 2, "stroke-linejoin": "round"}),
        cpp = [];
    for (var i = 0; i < data.length; i++) {

        // Offset each point from its month's starting gridline, using r.monthCoords.
        // This keeps points within the proper month and limits the stretching of time so that
        // 28 day months and 30/31 day months can have the same x-range without minds exploding.
        var splitlabel = labels[i].split('/');
        var month = splitlabel[0]-1;
        var pointdate = new Date(splitlabel[2],month,splitlabel[1]);
        var monthstart = new Date(2012,month,1);
        var delta = pointdate.getTime() - monthstart.getTime();
        var x0 = r.monthCoords[month].x + (width * (delta/86400000) / 366) + .5;
        var y0 = height - bottomgutter - Y * data[i] + cp.attr("stroke-width");
            if (!i) 
                cpp.push(['M', x0, y0, 'C', x0, y0 ])
            else
                cpp.push([x0, y0])
    }
    cp.attr({path: cpp});

    // Populate details
    var details = $('#commit-details');

    details.html("Total commits (as of "+labels[labels.length-1]+") : " + data[data.length-1]);

};