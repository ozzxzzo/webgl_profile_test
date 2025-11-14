// 粒子着色器 (Particle Shader)
export const particleVertexShader = `
    attribute float alpha;
    attribute float size;
    attribute vec3 customColor;

    varying vec3 vColor;
    varying float vAlpha;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
        vColor = customColor;
        vAlpha = alpha;
        vPosition = position;
        vNormal = normalize(position);

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;

        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

export const particleFragmentShader = `
    uniform float time;
    uniform vec3 colorStart;
    uniform vec3 colorEnd;
    uniform float reflectionIntensity;
    uniform float enableReflection;

    varying vec3 vColor;
    varying float vAlpha;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        vec2 absCenter = abs(center);

        float cornerRadius = 0.15;
        float squareSize = 0.45;

        vec2 d = absCenter - vec2(squareSize - cornerRadius);
        float dist = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - cornerRadius;

        if (dist > 0.0) discard;

        float strength = 1.0 - smoothstep(-0.1, 0.0, dist);
        strength = pow(strength, 1.5);

        vec3 finalColor = vColor * 1.8;

        // 反射效果
        if (enableReflection > 0.5) {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            vec3 reflection = reflect(-viewDir, normal);
            float reflectionFactor = (sin(reflection.x * 10.0 + time) * 0.5 + 0.5) *
                                    (cos(reflection.y * 10.0 + time * 0.7) * 0.5 + 0.5);
            finalColor += vec3(reflectionFactor * reflectionIntensity) * 0.5;
        }

        gl_FragColor = vec4(finalColor, strength * vAlpha);
    }
`;
