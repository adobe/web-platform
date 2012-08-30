/*
Copyright 2012 Adobe Systems, Incorporated
This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License http://creativecommons.org/licenses/by-nc-sa/3.0/ .
Permissions beyond the scope of this license, pertaining to the examples of code included within this work are available at Adobe http://www.adobe.com/communities/guidelines/ccplus/commercialcode_plus_permission.html .
*/

precision mediump float;

attribute vec4 a_position;
attribute vec2 a_texCoord;
attribute vec3 a_triangleCoord;

uniform mat4 u_projectionMatrix;

// These uniform values are passed in using CSS.
uniform mat4 transform;
uniform float amount;
uniform float t;

mat4 perspectiveMatrix(float p)
{
    float perspective = - 1.0 / p;
    return mat4(
	1.0, 0.0, 0.0, 0.0,
	0.0, 1.0, 0.0, 0.0,
	0.0, 0.0, 1.0, perspective,
	0.0, 0.0, 0.0, 1.0);
}

// Random function based on the tile coordinate.
// This will return the same value for all the vertices in the same tile
// (i.e. two triangles).
float random(vec2 scale)
{
    // Use the fragment position as a different seed per-pixel.
    return fract(sin(dot(vec2(a_triangleCoord.x, a_triangleCoord.y), scale)) * 4000.0);
}

void main()
{
    float r = random(vec2(10.0, 80.0));

    vec4 pos = a_position;

    float dz = -amount * t * r;
    vec3 tc = a_triangleCoord;

    if (mod(tc.x + tc.y, 2.0) == 0.0) {
	dz = amount * t * r;
    }

    pos.z += dz;

    gl_Position = u_projectionMatrix * perspectiveMatrix(0.9) * transform * pos;
}
