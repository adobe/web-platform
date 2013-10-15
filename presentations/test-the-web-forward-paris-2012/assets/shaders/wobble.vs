precision mediump float;
attribute vec4 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_projectionMatrix;
uniform sampler2D textureBack;

uniform float amplitude;
uniform float amount;
uniform float angle;   

varying vec2 v_texCoord;

const float PI = 3.1415;

mat4 rotateX(float f) {
    return mat4(
	1.0, 0.0, 0.0, 0.0, 
	0.0, cos(f), -sin(f), 0.0, 
	0.0, sin(f), cos(f), 0.0, 
	0.0, 0.0, 0.0, 1.0);
}

mat4 rotateY(float f) {
    return mat4(
	cos(f), 0.0, sin(f), 0.0, 
	0.0, 1.0, 0.0, 0.0, 
	-sin(f), 0, cos(f), 0.0, 
	0.0, 0.0, 0.0, 1.0);
}


mat4 rotateZ(float f) {
    return mat4(
	cos(f), -sin(f), 0.0, 0.0, 
	sin(f), cos(f), 0.0, 0.0, 
    0.0, 0.0, 1.0, 0.0,
	0.0, 0.0, 0.0, 1.0);
}

void main()
{        
    v_texCoord = a_texCoord;
    vec4 pos = a_position;
    
    float r = 1.0 - abs((amount - 0.5) / 0.5);
    float a = r * angle * PI / 180.0;
    mat4 rotX = rotateX(a);
    mat4 rotY = rotateY(a / 4.0);
    mat4 rotZ = rotateZ(a / 8.0);
    
    float dx = 0.01 * cos(3.0 * PI * (pos.x + amount)) * r;
    float dy = 0.01 * cos(3.0 * PI * (pos.y + amount)) * r;
    float dz = 0.1 * cos(3.0 * PI * (pos.x + pos.y + amount)) * r;

    pos.x += dx;
    pos.y += dy;
    pos.z += dz;
    
    gl_Position = u_projectionMatrix * rotZ * rotY * rotX * pos;
}
