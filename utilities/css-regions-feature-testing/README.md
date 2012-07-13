CSS Regions basic feature testing
=================================
                                                                                                         
This set of unit tests helps determine the level of support for CSS Regions in a browser.

It is not meant to be a full test suite or to have a broad code coverage. For that please refer to the [CSS Regions WebKit Layout Tests](http://trac.webkit.org/browser/trunk/LayoutTests/fast/regions).
    
How to use
----------
Open index.html in your CSS Regions-enabled browser.                        

A passing test means that the feature is supported by the browser.
A failing test means that the feature is not yet supported by the browser.

Uses
----
The feature detect page uses the [QUnit](https://github.com/jquery/qunit) and [-prefix-free](http://leaverou.github.com/prefixfree/) JavaScript frameworks.

Maintenance
-----------
The look and feel of the page, components and icons of the table and chart comes from [Bootstrap](http://twitter.github.com/bootstrap/).

The CSS that powers the results table and chart are powered by assets/css/results.css.  This file can be generated using 
[Sass](http://sass-lang.com/) on results.scss.  It's not required, and futher changes can be done by editing the CSS, but 
Sass is recommended here as it makes the CSS a lot easier to write.

The chart data comes from [Browserscope](http://www.browserscope.org/). The main documentation for how to pull down tests is on their [API Documention](http://www.browserscope.org/user/tests/howto). The data comes from [our test results page](http://www.browserscope.org/user/tests/table/agt1YS1wcm9maWxlcnINCxIEVGVzdBiQzuQQDA?o=html&v=3&highlight=1).  By using the various (url flags)[http://www.browserscope.org/user/tests/howto#urlparams] for their api, you can control what ranges of data you pull down and format. 

Workflow
--------
Here's what happens when a user comes to the page:
* The page pulls in Browserscope data presents the test result data
* It renders that as a table and shows it.
* The user has a choice to toggle between a table view of the data, and a chart view. 
* The user is presented with a choice to run the tests. They can selected a checkmark to report their results to Browserscope.

When they run the tests:
* We run the Qunit tests.
* We report the general results as a percentage in the #action-well.
* We will also highlight the results on the browser table matching their browser.
* We provide a toggle at the bottom to display the raw Qunit tests.

If they choose to report their scores:
* We flag Qunit to report scores to Browserscope. 