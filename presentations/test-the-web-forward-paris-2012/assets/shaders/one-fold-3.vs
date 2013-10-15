precision mediump float;

attribute vec4 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_projectionMatrix;
uniform float amount;
const float MAX_AMOUNT = 0.5;

varying float shadow;

void main()
{
    vec4 pos = vec4(a_position);
    float a = clamp(amount, 0.0, 1.0) * MAX_AMOUNT;

    float t = 1.0 - abs(pos.x / 0.5);
    pos.y = (pos.y + t * a) / (1.0 + 2.0 * a);
    
    shadow = t * t * t;

    gl_Position = u_projectionMatrix * pos;
}



