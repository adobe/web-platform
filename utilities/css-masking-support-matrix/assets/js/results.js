/*
Copyright (C) 2014 Adobe Systems, Incorporated. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var browserScopeVersions = {
        "browsers-all": {urlFlag:"3", label:"All Browsers", depth:"version"},
        "browsers-major": {urlFlag:"1", label:"Major Versions", depth:"major"},
        "browsers-family": {urlFlag:"0", label:"Browser Families", depth:"browser"}
};

function notImplemented() {
    alert("Not implemented yet");
    return false;
}


function convertToID(str) {
    var result = str.replace(/\s+/g, '-').toLowerCase();
    result = result.replace(/\./g, "-");
    return result;
}

function convertToShortString(str) {
    return str.substring(0, 20) + "...";
}

function testSort(a, b) {
    if (a.type < b.type) {
        return -1;
    }
    if (a.type > b.type) {
        return 1;
    }
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}

function browserSort(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}

function drawChart(results) {
    $("#results_panel").empty();
    var htmlChart = '<div id="chart">';
    var htmlLegend = '<div id="legend">';
    var i = results.results.length;
    var index;
    var j;

    for (index in results.results) {
        var obj = results.results[index];
        var bar = '<span class="bar" id="' + convertToID(obj.name) + '"><span>' + obj.summary_score + '%</span></span>';
        htmlChart += bar;

        var legend = '<span class="legend"><span>' + obj.name + '</span></span>';
        htmlLegend += legend;
    }
    htmlChart += "</div>";
    htmlLegend += "</div>";
    $("#results_panel").prepend(htmlChart);
    $("#results_panel").append(htmlLegend);


    for (j=0; j < results.results.length; j++) {
        var obj = results.results[j];
        var id = convertToID(obj.name);
        $("#" + id).height(obj.summary_score * 2);
        $("#" + id).css("left", j * 45);
    }

}

function createTableShell() {
    var tableShell = '<table class="table table-bordered" id="bscope-results"></table>';
    $("#results_panel").append(tableShell);
}



function createTableHeader(results) {
    var i = results.results.length;
    var htmlContent = "<thead>";
    var index;

    var row = '<tr class="test-title-row"><th />';
    var columns = '<col>';
    for (index in results.results) {
        var obj = results.results[index];
        columns += '<col id="' + convertToID(obj.name) + '">';
        row += '<th><div><span style="z-index:' + i + '">' + obj.name + '</span></div></th>';
        i--;
    }

    row +=  '</tr>';
    htmlContent += row + "</thead>";
    $("#bscope-results").prepend(htmlContent);
    $("#bscope-results").prepend(columns);
}

function createTableRows(results) {
    var i = 0;
    var j = 0;
    var k = 0;
    var htmlContent = "<tbody>";

    var testArray = [];
    for (i = 0; i < results.results.length; i++) {
        var browserArray = [];
        var obj = results.results[i];

        for (j = 0; j < obj.results.length; j++) {
            var row = '<tr><th>' + obj.results[j].name + '</th>';

            for (k = 0; k < results.results.length; k++) {
                var test = results.results[k].results[j];
                var browserClass = convertToID(results.results[k].name);
                var cellClass = "blank";

                if (test.result === "1") {
                    cellClass = "success";
                }
                if (test.result === "0") {
                    cellClass = "fail";
                }

                var cell = '<td class="' + cellClass + " " + browserClass + '"><span>' + test.result + '</span></td>';
                row += cell;
            }

            row += "</tr>";
            htmlContent += row;
        }
        break;
    }
    htmlContent += "</tbody>";
    $("#bscope-results").append(htmlContent);
}

function drawTable(results) {
    $("#results_panel").empty();
    createTableShell();
    createTableHeader(results);
    createTableRows(results);
}

function getUserBrowser(depth) {
    if (typeof depth === "undefined") {
        depth = "browser";
    }
    var result = "";

    var p = new UAParser();
    var name = p.result.browser.name;
    var version = p.result.browser.version;
    var major = p.result.browser.major

    if (name === "Safari") {
        var ua = navigator.userAgent;
        var versionString = "Version/";
        var loc = ua.indexOf(versionString) + versionString.length;
    }

    var versionArray = version.split(".");
    if (versionArray.length > 3) {
        version =  versionArray[0] + "." + versionArray[1] + "." + versionArray[2];
    }

    if (depth === "browser") {
        result = name;
    } else if (depth === "major") {
        result = name + " "  + major;
    } else {
        result = name + " " + version;
    }

    return result;
}


function changeActionWell(browserVersionDepth) {
    $("#action-well").toggleClass("alert-info");

    var browserBeingUsed = getUserBrowser(browserVersionDepth);
    var browserTableID = convertToID(browserBeingUsed);

    var htmlContent = '<div id="test-results">';
    htmlContent += '<p>We think that you are using <strong>' + browserBeingUsed + '</strong> for your browser.  <a href="#">No?</a></p>';
    htmlContent += '<p id="support-results">Your Browser supports<br /> <span id="support-precentage"></span> of CSS Masking features<span class="filter-label"/></p>';

    if ($('#publish-results').is(':checked')) {
        htmlContent += '<p>Thank you for sharing your results</p>';
    }

    htmlContent += '</div>';
    $("#action-well").html(htmlContent);

    // Would rather do this by changing the class, but there is an issue with:
    // Changing a class on a column in a table styled by Bootstrap in Chrome.
    // Will track down issue and report to relevant project.
    $("#" + browserTableID).css("background-color", "#fcf8e3");
    $("." + browserTableID).css("background-color", "#fcf8e3");
    $("thead th").css("background-color", "#FFF");
}

function massageTestResults(results, filter) {
    var outputResults = {};
    var index;
    var testIndex;
    var newResults = [];

    for (index in results.results) {
        var obj = results.results[index];
        if (obj.count === "0") {
            continue;
        }

        var filtered_pass = 0;
        var newSubResults = [];

        for (testIndex in obj.results) {
            var testTitle = testIndex.split(":");
            // Skip this test if the name does not match the filter
            if (filter && testTitle[1].indexOf(filter) < 0)
                continue;

            var subResultsArray = [];
            var subResultsFromObj = obj.results[testIndex];
            if (parseInt(subResultsFromObj.result) == 1)
                filtered_pass ++;

            subResultsFromObj.name = testTitle[1];
            subResultsFromObj.type = testTitle[0];
            newSubResults.push(subResultsFromObj);
        }
        newSubResults.sort(testSort);
        obj.results = newSubResults;
        obj.name = index;

        // Only change the summary score if we actually filtered the results
        // Using Math.round on non-filtered results yields the exact same
        // values as the old browser scope ones.
        if (filter) {
            obj.summary_score =
                    newSubResults.length ?
                    Math.round(100 * filtered_pass / newSubResults.length) :
                    0;
        }

        newResults.push(obj);
    }
    newResults.sort(browserSort);
    outputResults.results = newResults;
    return outputResults;
}

function browserScopeVersionTranslate (menuselection) {
    return browserScopeVersions[menuselection].urlFlag;
}

function browserScopeLabelTranslate (menuselection) {
    return browserScopeVersions[menuselection].label;
}

function browserScopeDepthTranslate (menuselection) {
    return browserScopeVersions[menuselection].depth;
}


if (!Object.keys) {
    Object.keys = function (obj) {
        var keys = [],
            k;
        for (k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
                keys.push(k);
            }
        }
        return keys;
    };
}

