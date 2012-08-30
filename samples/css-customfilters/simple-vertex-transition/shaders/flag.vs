/*
Copyright 2012 Adobe Systems, Incorporated
This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License http://creativecommons.org/licenses/by-nc-sa/3.0/ .
Permissions beyond the scope of this license, pertaining to the examples of code included within this work are available at Adobe http://www.adobe.com/communities/guidelines/ccplus/commercialcode_plus_permission.html .
*/

precision mediump float;

attribute vec3 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_projectionMatrix;
uniform mat4 txf;

// These uniform values are passed in using CSS.
uniform float phase;
uniform float amplitude;

varying vec2 v_texCoord;

const float PI = 3.1415;
const float degToRad = PI / 180.0;

void main()
{
    v_texCoord = a_texCoord;
    vec4 pos = vec4(a_position, 1.0);

    float phi = degToRad * phase;
    pos.z = (amplitude / 1000.0) * cos(pos.x * PI * 2.0 + phi);

    gl_Position = u_projectionMatrix * txf * pos;
}
