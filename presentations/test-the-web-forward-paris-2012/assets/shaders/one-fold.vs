precision mediump float;

attribute vec4 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_projectionMatrix;

void main()
{
    vec4 pos = vec4(a_position);
    float a = 0.25;

    float t = 1.0 - abs(pos.x / 0.5);
    pos.y = (pos.y + t * a) / (1.0 + 2.0 * a);

    gl_Position = u_projectionMatrix * pos;
}

