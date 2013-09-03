(function(window) {

var ManualTest = function(title, expectedResultImage, assertion) {
    this.element = $("<div/>", { class:"manual-test clearfix" })
    var header = $("<div/>", {class: "manual-test-header"}).appendTo(this.element);
    this.title = $("<h4/>", {text:title}).appendTo(header);

    this.contentBox = $("<div/>", {class: "test-content-box clearfix"} ).appendTo(this.element);
    this.result = $("<div/>", { class: "manual-test-actual" }).appendTo(this.contentBox);
    this.expected = $('<img/>', { src: expectedResultImage, class: 'manual-test-expected' }).appendTo(this.contentBox);

    this.footer = $("<div/>", {class: "clearfix manual-test-footer"}).appendTo(this.element);

    if (!assertion)
        this.assertionText = this.defaultAssertionText;
    else
        this.assertionText = assertion;


    this.assertion = $("<span/>",
                {
                  text: this.assertionText, 
                  style: "vertical-align:middle"
                }).appendTo(this.footer);

    this.btnYes = $("<div/>",
                    { class: 'btn btn-success',
                      text: 'YES', 
                      style: "float:right"
                    }).appendTo(this.footer);
    this.btnNo = $("<div/>",
                    { class: 'btn btn-danger',
                      text: "NO",
                      style: "float:right"}).appendTo(this.footer);
    this.bottomLayer = this.defaultBackdropGradient;

    this.expected.load(this,function(event) {
        var self = event.data;
        self.result.width(self.expected.width() + "px");
        self.result.height(self.expected.height() + "px");
    });
}

ManualTest.prototype = {
    defaultBackdropGradient : "linear-gradient(to right, #00ffff 0%, rgba(0,0,255,0) 24%, #ff0000 50%, #ffff00 75%, #00ff00 100%)",
    defaultAssertionText: "Does the image on the left have the same colors as the one on the right?",

    // Pass in an acceptable value for the background property here.
    setBottomLayer : function(bottomLayerValue) {
        this.bottomLayer = bottomLayerValue;
    },

    asBackgroundBlendingTest: function(blendMode, imageToBlend) {
        this.title.text("Background Blending: " + this.title.text());
        this.topLayer = "url('" + imageToBlend + "') no-repeat 0 0 /100% 100%";
        
        var backgroundStyle = this.topLayer + ", " + this.bottomLayer;

        this.result.css("background", backgroundStyle);
        this.result.css("background-blend-mode", blendMode);
    },

    // This test will overlap two elements, and set blending on the top one
    asElementBlendingTest : function(blendMode, imageToBlend) {
        this.title.text("Element Blending: " + this.title.text());
        this.topElement = $("<img/>", {src: imageToBlend, 
                                       class: "element-blending-test eb-top-layer"})
                            .appendTo(this.result);

        this.backdropElement = $("<div/>", {class: "element-blending-test eb-backdrop-layer"})
                                .appendTo(this.result);
        this.backdropElement.css("background", this.bottomLayer);

        this.result.css("mix-blend-mode", blendMode);
    }

}

window.ManualTest = ManualTest;



// get at whatever the global object is, like window in browsers
})( (function() {return this}).call() );
