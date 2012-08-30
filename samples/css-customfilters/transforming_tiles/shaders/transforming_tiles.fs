/*
Copyright 2012 Adobe Systems, Incorporated
This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License http://creativecommons.org/licenses/by-nc-sa/3.0/ .
Permissions beyond the scope of this license, pertaining to the examples of code included within this work are available at Adobe http://www.adobe.com/communities/guidelines/ccplus/commercialcode_plus_permission.html .
*/

precision mediump float;

// These uniform values are passed in using CSS.
uniform float frontColor;
uniform float backColor;

void main()
{
    // Use gl_FrontFacing to hide the back face.
    css_BlendColor = vec4(gl_FrontFacing ? frontColor : backColor);
}
