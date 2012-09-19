/*
Copyright 2012 Adobe Systems, Incorporated
This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License http://creativecommons.org/licenses/by-nc-sa/3.0/ .
Permissions beyond the scope of this license, pertaining to the examples of code included within this work are available at Adobe http://www.adobe.com/communities/guidelines/ccplus/commercialcode_plus_permission.html .
*/

precision mediump float;

attribute vec4 a_position;
attribute vec2 a_texCoord;
attribute vec2 a_meshCoord;

uniform mat4 u_projectionMatrix;

// This uniform value are passed in using CSS.
uniform mat4 transform;

const float PI = 3.1415;

// Varyings are passed from the vertex shader to the fragment shader.
// The value of the varying in the fragment shader is interpolated
// between the varying values at the three vertices of the triangle
// which contains the fragment.
varying float shadow;

void main()
{
    float curve = abs(sin(a_meshCoord.x * PI * 1.75 + PI/8.0));
    shadow = abs(a_position.x) < 0.25 ? min(1.0, curve + 0.2) : 1.0;

    vec4 pos = a_position;
    pos.z = 40.0 * curve;
    gl_Position = u_projectionMatrix * transform * pos;
}
