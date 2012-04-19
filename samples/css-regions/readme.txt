Adobe CSS Regions prototype, Copyright (c) 2011 Adobe Systems Incorporated 

About
-----

CSS Regions bring new properties to CSS (Cascading Style Sheets) that provide:
    * text containers with custom shapes.
    * exclusion shapes which text will wrap around.
    * text that flows from one area into another.
We have put together a set of demos for you. They showcase some of the concepts we proposed to the W3C 
with CSS Regions: content threads, content shapes and text exclusions.
The samples presented here require a mini-browser using a specially modified version of WebKit. 
This experimental version will allow you to experiment with the samples, and are a way for us to explore 
the implementation options for these features. Please see the "Usage instructions" section below for 
instructions on how to run this browser.
You'll find basic samples that demonstrate individual CSS properties, as well as more complex ideas 
that highlight how they work together. 


Usage instructions
------------------

Double-click on MiniBrowser.app that can be found in the bin\ folder of this package


Supported platforms 
-------------------

Mac OS X Snow Leopard (10.6)


Changelog
---------

v0.1
	This is the first public build. 
	For a complete description of the features supported, check the landing page of the browser 
	distributed with this package - see "Usage instructions" section below.


Release identification
----------------------

The version of this package is 0.1. 
The version can be identified using navigator.useragent property, which contains "AdobeCSSRegionsPrototype/0.1"
This package is distributed via http://www.adobe.com/go/cssregions


Copyright information
---------------------

This package is provided under the MIT License specified in LICENSING.txt file that accompanies this package.

Important note: 
This release uses several copyrighted libraries. See section "Libraries used by this release" for details 
on permissions and warranty for these libraries.
Majority of these libraries have not been modified by Adobe for this release. 
The only library that has been modified is the WebKit library with the intention to accommodate 
CSSRegions features this release aims to demonstrate.
Source code of the modified WebKit is available at http://sourceforge.net/adobe/adobe-webkit/ and 
files modified have their header properly marked.


Libraries used by this release
------------------------------

This release uses the following libraries, either statically or dynamically linked, as mentioned below.
Note that this package uses also other libraries available from the operating system.
All libraries linked dynamically are included in the release package.
Details on permissions and warranty and a copy of each license are distributed with this release 
in a file called LICENSING.txt.

1. WebKit version 82111 (dynamically linked) 
This library has been modified by Adobe to add CSSRegions features and modified source code is made 
available by Adobe - see "Copyright information" section.


End of document