precision mediump float; // Required.

// ===== CSS Parameters =====
uniform float amplitude; // Unused in the fragment shader.
uniform float amount;

// ===== Varyings ======
varying vec2 v_texCoord;

// ===== Constants ======
const vec3 scanlineColor = vec3(1.0, 1.0, 1.0);
const float gradientHeight = 0.1;
const mat4 grayscaleMatrix = mat4(
    0.333, 0.333, 0.333, 0.000,
    0.333, 0.333, 0.333, 0.000,
    0.333, 0.333, 0.333, 0.000,
    0.000, 0.000, 0.000, 1.000
);

// ==== Shader Entry Point =====
void main()
{
    // The scanline goes from the bottom of the element (1.0) to just above the top of the element (-gradientHeight).
    // This makes sure the gradient is out of view at amount = 1.0.
    float scanlineTravelDistance = 1.0 + gradientHeight;

    // Scale amount from [0,1] to [0,scanlineTravelDistance].
    float scanlineAmount = amount * scanlineTravelDistance;

    // Make the scanline start at the bottom and progress upward.
    // Its position goes from [1.0, -gradientHeight].
    float scanlinePosition = 1.0 - scanlineAmount;

    if (v_texCoord.y < scanlinePosition) {
        // Make the element grayscale above the scanline.
        css_ColorMatrix = grayscaleMatrix;
    } else {
        // Apply a gradient below the scanline.
        float distanceFromScanline = v_texCoord.y - scanlinePosition;
        float gradientStrength = (gradientHeight - min(distanceFromScanline, gradientHeight)) / gradientHeight;
        css_MixColor = vec4(scanlineColor, gradientStrength);
    }
}
