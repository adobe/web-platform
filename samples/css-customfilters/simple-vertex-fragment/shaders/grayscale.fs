/*
Copyright 2012 Adobe Systems, Incorporated
This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License http://creativecommons.org/licenses/by-nc-sa/3.0/ .
Permissions beyond the scope of this license, pertaining to the examples of code included within this work are available at Adobe http://www.adobe.com/communities/guidelines/ccplus/commercialcode_plus_permission.html .
*/

precision mediump float;

// This uniform value is passed in using CSS.
uniform float amount;

void main()
{
    const mat4 identityMatrix = mat4(1.0);

    const mat4 grayscaleMatrix = mat4(0.33, 0.33, 0.33, 0.0,
                                      0.33, 0.33, 0.33, 0.0,
                                      0.33, 0.33, 0.33, 0.0,
                                       0.0,  0.0,  0.0, 1.0);

    css_ColorMatrix[0] = mix(identityMatrix[0], grayscaleMatrix[0], amount);
    css_ColorMatrix[1] = mix(identityMatrix[1], grayscaleMatrix[1], amount);
    css_ColorMatrix[2] = mix(identityMatrix[2], grayscaleMatrix[2], amount);
    css_ColorMatrix[3] = mix(identityMatrix[3], grayscaleMatrix[3], amount);
}
