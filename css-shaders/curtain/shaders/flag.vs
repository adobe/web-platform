precision mediump float;
attribute vec4 a_position;
attribute vec2 a_texCoord;
uniform mat4 u_projectionMatrix;
uniform mat4 txf;
varying vec2 v_texCoord;

const float PI = 3.1415;

// Shader uniforms to be passed by CSS
uniform float phase;
uniform float amplitude;

const float degToRad = PI / 180.0;

void main()
{        
    vec4 pos = a_position;
    
    float phi = degToRad * phase;
    pos.z = (amplitude / 1000.0) * cos(pos.x * PI * 2.0 + phi);
    
    gl_Position = u_projectionMatrix * txf * pos;
}