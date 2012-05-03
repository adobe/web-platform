precision mediump float;
attribute vec3 a_position;
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
    v_texCoord = a_texCoord;
    vec4 pos = vec4(a_position, 1.0);
    
    float phi = degToRad * phase;
    pos.z = (amplitude / 1000.0) * cos(pos.x * PI * 2.0 + phi);
    
    gl_Position = u_projectionMatrix * txf * pos;
}