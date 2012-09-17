precision mediump float; // Required.

// ===== Built-in Per-vertex Attributes =====
attribute vec3 a_position; // The vertex's coordinates.
attribute vec2 a_texCoord; // The vertex's texture coordinate.

// ===== Built-in Parameters =====
// Uniform parameters are available to shaders and have the
// same value for each vertex and fragment.
uniform mat4 u_projectionMatrix; // The projection matrix.

// ===== CSS Parameters =====
uniform float amplitude;
uniform float amount;

// ===== Varyings =====
// Varying are set in the vertex shader and available in the
// fragment shader.
// A fragment's value for a varying is a weighted average based
// on its distance from the three vertices surrounding it.
varying vec2 v_texCoord;

// ===== Constants ======
const float rotate = 20.0;
const float PI = 3.1415926;

// ===== Helper Functions ======
mat4 rotateX(float a)
{
    float sinA = sin(a);
    float cosA = cos(a);
    return mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, cosA, -sinA, 0.0,
        0.0, sinA, cosA, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}
mat4 rotateY(float a)
{
    float sinA = sin(a);
    float cosA = cos(a);
    return mat4(
        cosA, 0.0, sinA, 0.0,
        0.0, 1.0, 0.0, 0.0,
        -sinA, 0.0, cosA, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}
mat4 rotateZ(float a)
{
    float sinA = sin(a);
    float cosA = cos(a);
    return mat4(
        cosA, -sinA, 0.0, 0.0,
        sinA, cosA, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

// ===== Shader Entry Point ===== //
void main()
{
    v_texCoord = a_texCoord.xy;
    vec4 pos = vec4(a_position, 1.0);

    float r = 1.0 - abs((amount - 0.5) / 0.5);
    float a = r * rotate * PI / 180.0;
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