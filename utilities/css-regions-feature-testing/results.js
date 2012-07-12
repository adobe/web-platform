var hash = {"Document should return a flow by name":"Document returns flow",   
            "Element should have regionOverflow property":"Element.regionOverflow",   
            "NamedFlow getContent() should return NodeList":"getContent() = NodeList",   
            "NamedFlow should have getContent() function":"NamedFlow.getContent()",   
            "NamedFlow should have name property":"NamedFlow.name",   
            "NamedFlow should have overset property":"NamedFlow.overset",   
            "regionLayoutUpdate event is thrown":"regionLayoutUpdate event",   
            "Named flow - content should be pulled to a flow":"Named flow pulls content",   
            "Region - should consume from flow":"Region consumes flow",   
            "Region properties - region-overflow property":"Region.region-overflow exists",
            "NamedFlow should have firstEmptyRegionIndex property":"NamedFlow.firstEmptyRegionIndex",
            "NamedFlow getRegionsByContent() should return NodeList":"getRegionsByContent() = NodeList",
            "NamedFlow should have getRegionsByContent() function":"NamedFlow.getRegionsByContent()",   
            "Basic @region rule support":"Basic @region support"};

 function notImplemented() {
      alert("Not implemented yet")
      return false;
}
      
      function getUserBrowser() {
            var p = new UAParser();
            console.log(p.result);
            var name = p.result.browser.name;
            var version = p.result.browser.version;

            if (name === "Safari"){
                  var ua = navigator.userAgent;
                  var versionString = "Version/";
                  var loc = ua.indexOf(versionString) + versionString.length;
                  console.log(loc);
                  major = ua.substring(loc, loc+7);
            }

            var versionArray = version.split(".");
            if (versionArray.length > 3){
              version =  versionArray[0] + "." + versionArray[1] + "." + versionArray[2];
            }


            return name + " " + version;
      }


  function changeActionWell(){
      $("#action-well").toggleClass("alert-info");

      var browserBeingUsed = getUserBrowser();
      var browserTableID = convertToID(browserBeingUsed);



      var htmlContent ='<div id="test-results">';
      htmlContent += '<p>We think that you are using <strong>' + browserBeingUsed + '</strong> for your browser.  <a href="#">No?</a></p>';
      htmlContent += '<p id="support-results">Your Browser supports<br /> <span id="support-precentage">88%</span> of CSS Regions features</p>';
      if ($('#publish-results').is(':checked')) {
        htmlContent += '<p>Thank you for sharing your results</p>';
      }
      htmlContent += '</div>';
      $("#action-well").html(htmlContent);

      // Would rather do this by changing the class, but there is an issue with:
      // Changing a class on a column in a table styled by Bootstrap in Chrome. 
      // Will track down issue and report to relevant project.
      console.log(browserTableID);
      $("#" + browserTableID).css("background-color", "#fcf8e3");
      $("thead th").css("background-color", "#FFF");
      




  }

  function createTableShell() {
      var tableShell = '<table class="table table-bordered" id="bscope-results"></table>';
      $("#results_panel").append(tableShell);
  }

  function massageTestResults(results) {
      var outputResults = new Object();

      var newResults = [];
      for (var index in results.results){
          var obj = results.results[index];
              if (obj.count === "0"){
                  continue;
              }

          var newSubResults = [];
          for (var testIndex in obj.results){
              var subResultsArray = [];
              var subResultsFromObj = obj.results[testIndex];
              var testTitle = testIndex.split(":");
              subResultsFromObj.name = testTitle[1];
              subResultsFromObj.type = testTitle[0];
              newSubResults.push(subResultsFromObj);
          }
          newSubResults.sort(testSort);
          obj.results = newSubResults;
          obj.name = index;
          newResults.push(obj);
      }
      newResults.sort(browserSort);
      outputResults.results = newResults;
      return outputResults;
  }


  function createTableHeader(results) {
      var i = results.results.length;
      var htmlContent = "<thead>";
      
      var row = '<tr class="test-title-row"><th />';
      var columns = '<col>';
      for (var index in results.results){
          var obj = results.results[index];
          columns += '<col id="' + convertToID(obj.name) + '">';
          row += '<th><div><span style="z-index:' + i + '">' + obj.name + '</span></div></th>';
          i--;
      }

      row +=  '</tr>'
      htmlContent += row + "</thead>";
      $("#bscope-results").prepend(htmlContent);
      $("#bscope-results").prepend(columns);
  }

  function createTableRows(results) {
      var i = 0;
      var htmlContent = "<tbody>";
      
      var testArray = [];
      for (var i = 0; i < results.results.length; i++){
          var browserArray = [];
          var obj = results.results[i];

          for (var j = 0; j < obj.results.length; j++){
              var row = '<tr><th>' + shortenTestName(obj.results[j].name) + '</th>'

              for (var k = 0; k < results.results.length; k++){
                  var test = results.results[k].results[j];

                  var cellClass = "blank";
                  if (test.result === "1"){
                      cellClass = "success";
                  }
                  if (test.result === "0"){
                      cellClass = "fail";
                  }

                  var cell = '<td class="' + cellClass + '"><span>' + test.result + '</span></td>';
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
  function convertToID (str){
      var result = str.replace(/\s+/g, '-').toLowerCase();
      result = result.replace(/\./g, "-");
      return result;
  }

  function convertToShortString(str) {
      return str.substring(0,20) + "...";
  }

  function testSort(a,b) {
      if (a.type < b.type){
          return -1;
      }    
      if (a.type > b.type){
          return 1;
      } 
      if (a.name < b.name){
          return -1;
      }    
      if (a.name > b.name){
          return 1;
      } 
      return 0;
  }

  function browserSort(a,b) {
      if (a.name < b.name){
          return -1;
      }    
      if (a.name > b.name){
          return 1;
      } 
      return 0;
  }

  function shortenTestName (longname) {
      var results = hash[$.trim(longname)]
      if (typeof results === "undefined") {
        results = longname;
      }

      return results;
      
  }            