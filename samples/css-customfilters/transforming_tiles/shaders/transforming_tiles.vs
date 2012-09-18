/*
Copyright 2012 Adobe Systems, Incorporated
This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License http://creativecommons.org/licenses/by-nc-sa/3.0/ .
Permissions beyond the scope of this license, pertaining to the examples of code included within this work are available at Adobe http://www.adobe.com/communities/guidelines/ccplus/commercialcode_plus_permission.html .
*/

precision mediump float;

attribute vec4 a_position;
attribute vec2 a_texCoord;
attribute vec2 a_meshCoord;
attribute vec3 a_triangleCoord;

uniform vec2 u_meshSize;
uniform mat4 u_projectionMatrix;

// These uniform values are passed in using CSS.
uniform mat4 transform;
uniform mat4 page1Transform;
uniform float page1Depth;
uniform mat4 page2Transform;
uniform float page2Depth;

varying vec2 v_texCoord;

const float PI = 3.1415;

mat4 perspectiveMatrix(float p)
{
    float perspective = - 1.0 / p;
    return mat4(
	1.0, 0.0, 0.0, 0.0,
	0.0, 1.0, 0.0, 0.0,
	0.0, 0.0, 1.0, perspective,
	0.0, 0.0, 0.0, 1.0);
}

void main()
{
    v_texCoord = a_texCoord;

    mat4 pageTransform;
    float depth;

    // Divide the tiles in two sets, the left page and the right page.
    // a_triangleCoord.x is the coordinate of the current triangle. It goes from 0 to u_meshSize.x.
    // For the left page we just need to compare check that a_triangleCoord.x is in the first half of that interval.
    if (a_triangleCoord.x < u_meshSize.x / 2.0) {
        pageTransform = page1Transform;
        depth = page1Depth;
    } else {
        pageTransform = page2Transform;
        depth = page2Depth;
    }

    vec4 pos = a_position;
    float curve = abs(cos(a_meshCoord.x * PI));
    pos.z = curve * depth / 500.0;

    gl_Position = u_projectionMatrix * perspectiveMatrix(1000.0) * transform * pageTransform * pos;
}
