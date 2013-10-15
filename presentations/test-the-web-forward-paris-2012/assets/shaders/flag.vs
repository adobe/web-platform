/*
Copyright 2012 Adobe Systems, Incorporated
This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License http://creativecommons.org/licenses/by-nc-sa/3.0/ .
Permissions beyond the scope of this license, pertaining to the examples of code included within this work are available at Adobe http://www.adobe.com/communities/guidelines/ccplus/commercialcode_plus_permission.html .
*/

precision mediump float;

attribute vec4 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_projectionMatrix;

// These uniform values are passed in using CSS.
uniform mat4 txf;
uniform float phase;
uniform float amplitude;

varying vec2 v_texCoord;

const float PI = 3.1415;
const float degToRad = PI / 180.0;

void main()
{
    vec4 pos = a_position;
    float phi = degToRad * phase;
    float amount = -sin(pos.x * PI + phi);
    
    pos.z = 0.0; // 
    pos.y = 0.98 * pos.y + 0.02 * amount; // (amplitude / 1000.0) * amount;

    amount = -sin(pos.y * PI + phi);
    pos.x = 0.98 * pos.x + 0.02 * amount; 
    gl_Position = u_projectionMatrix * txf * pos;
}

