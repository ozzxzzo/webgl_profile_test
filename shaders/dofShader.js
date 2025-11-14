// 景深着色器 (Depth of Field Shader)
export const DOFShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'tDepth': { value: null },
        'focusDistance': { value: 50.0 },
        'dofRange': { value: 30.0 },
        'blurStrength': { value: 1.5 },
        'cameraNear': { value: 0.1 },
        'cameraFar': { value: 1000.0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float focusDistance;
        uniform float dofRange;
        uniform float blurStrength;
        varying vec2 vUv;

        void main() {
            vec4 color = texture2D(tDiffuse, vUv);

            // 简化的景深模糊
            float depth = gl_FragCoord.z / gl_FragCoord.w;
            float blur = abs(depth - focusDistance) / dofRange;
            blur = clamp(blur * blurStrength, 0.0, 1.0);

            // 简单的模糊采样
            vec4 blurred = vec4(0.0);
            float samples = 9.0;
            float offset = blur * 0.003;

            for(float x = -1.0; x <= 1.0; x++) {
                for(float y = -1.0; y <= 1.0; y++) {
                    vec2 sampleUv = vUv + vec2(x, y) * offset;
                    blurred += texture2D(tDiffuse, sampleUv);
                }
            }
            blurred /= samples;

            gl_FragColor = mix(color, blurred, blur);
        }
    `
};
