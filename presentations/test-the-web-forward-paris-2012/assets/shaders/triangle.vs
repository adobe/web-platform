precision mediump float;

attribute vec4 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_projectionMatrix;


void main()
{
    float x = a_position.x;
    float y = a_position.y;
    float p = 0.5 + y;
    
    float dx = (1.0 - p) * x;
    
    vec4 pos = vec4(dx, y, a_position.z, a_position.w);
    
    gl_Position = u_projectionMatrix * pos;
}

