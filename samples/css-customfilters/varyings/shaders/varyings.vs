/*
Copyright 2012 Adobe Systems, Incorporated
This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License http://creativecommons.org/licenses/by-nc-sa/3.0/ .
Permissions beyond the scope of this license, pertaining to the examples of code included within this work are available at Adobe http://www.adobe.com/communities/guidelines/ccplus/commercialcode_plus_permission.html .
*/

precision mediump float;

attribute vec4 a_position;
attribute vec2 a_texCoord;
attribute vec2 a_meshCoord;

uniform vec2 u_meshSize;
uniform mat4 u_projectionMatrix;

// This uniform value are passed in using CSS.
uniform mat4 transform;

const float PI = 3.1415;

// Varyings are passed from the vertex shader to the fragment shader.
// The value of the varying in the fragment shader is interpolated
// between the varying values at the three vertices of the triangle
// which contains the fragment.
varying float shadow;

mat4 perspective(float p) {
    float perspective = - 1.0 / p;
    return mat4(
	1.0, 0.0, 0.0, 0.0,
	0.0, 1.0, 0.0, 0.0,
	0.0, 0.0, 1.0, perspective,
	0.0, 0.0, 0.0, 1.0);
}

void main()
{
    float curve = abs(cos(a_meshCoord.x * PI * 3.0));
    shadow = min(1.0, curve + 0.2);

    vec4 pos = a_position;
    pos.z = curve * 0.1;

    gl_Position = u_projectionMatrix * perspective(1000.9) * transform * pos;
}
