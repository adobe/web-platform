precision mediump float;
attribute vec4 a_position;
attribute vec2 a_texCoord;
uniform mat4 u_projectionMatrix;
uniform mat4 txf;
varying vec2 v_texCoord;

const float PI = 3.1415;
const float degToRad = PI / 180.0;

void main()
{        
    v_texCoord = a_texCoord;
    vec4 pos = a_position;
    
    float phi = degToRad * 90.0;
    pos.z = 0.1 * cos(pos.x * PI * 2.0 + phi);
    
    gl_Position = u_projectionMatrix * txf * pos;
}