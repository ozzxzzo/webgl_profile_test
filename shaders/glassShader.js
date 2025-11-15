// 磨砂玻璃着色器 (Frosted Glass Shader)

export const glassVertexShader = `
    attribute float alpha;
    attribute float size;
    attribute vec3 customColor;
    attribute float glassActivation; // 0-1，玻璃效果激活程度

    varying vec3 vColor;
    varying float vAlpha;
    varying float vGlassActivation;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
        vColor = customColor;
        vAlpha = alpha;
        vGlassActivation = glassActivation;
        vPosition = position;
        vNormal = normalize(position);

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;

        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

export const glassFragmentShader = `
    uniform float time;
    uniform vec3 colorStart;
    uniform vec3 colorEnd;

    // 玻璃参数
    uniform float glassOpacity;        // 玻璃透明度
    uniform float frostedAmount;       // 磨砂程度
    uniform float highlightIntensity;  // 高光强度
    uniform vec3 glassColor;           // 玻璃色调

    varying vec3 vColor;
    varying float vAlpha;
    varying float vGlassActivation;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    // 简单的伪随机函数
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    // 噪声函数（用于磨砂质感）
    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        vec2 absCenter = abs(center);

        // 基础形状（圆角正方形）
        float cornerRadius = 0.15;
        float squareSize = 0.45;
        vec2 d = absCenter - vec2(squareSize - cornerRadius);
        float dist = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - cornerRadius;

        if (dist > 0.0) discard;

        // 边缘渐变
        float strength = 1.0 - smoothstep(-0.1, 0.0, dist);
        strength = pow(strength, 1.5);

        // 原始颜色
        vec3 baseColor = vColor * 1.8;
        float baseAlpha = strength * vAlpha;

        // 如果没有玻璃激活，直接返回原色
        if (vGlassActivation < 0.01) {
            gl_FragColor = vec4(baseColor, baseAlpha);
            return;
        }

        // ========== 玻璃效果 ==========

        // 1. 磨砂噪声（添加表面粗糙度）
        vec2 noiseUV = gl_PointCoord * 20.0 + time * 0.5;
        float frostedNoise = noise(noiseUV) * frostedAmount;

        // 2. 玻璃基色（混合原色和玻璃色）
        vec3 glassBaseColor = mix(vColor, glassColor, 0.6);
        glassBaseColor += vec3(frostedNoise);

        // 3. 菲涅尔效果（边缘高光）
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 3.0);
        vec3 fresnelColor = vec3(1.0) * fresnel * highlightIntensity;

        // 4. 边缘额外高光（模拟玻璃边缘反光）
        float edgeDist = abs(dist);
        float edgeHighlight = smoothstep(0.0, 0.15, edgeDist) * 0.3;

        // 5. 中心高光点（模拟光源反射）
        float centerDist = length(center);
        vec2 highlightPos = vec2(0.2, 0.2); // 高光位置
        float highlightDist = length(center - highlightPos);
        float highlight = smoothstep(0.3, 0.0, highlightDist) * highlightIntensity * 0.5;

        // 6. 合成玻璃颜色
        vec3 glassResult = glassBaseColor;
        glassResult += fresnelColor;
        glassResult += vec3(edgeHighlight);
        glassResult += vec3(highlight);

        // 7. 玻璃透明度
        float glassAlphaFinal = glassOpacity * strength;

        // 8. 根据激活程度混合原色和玻璃效果
        vec3 finalColor = mix(baseColor, glassResult, vGlassActivation);
        float finalAlpha = mix(baseAlpha, glassAlphaFinal, vGlassActivation);

        gl_FragColor = vec4(finalColor, finalAlpha);
    }
`;

// 创建玻璃材质
export function createGlassMaterial(config) {
    return {
        uniforms: {
            time: { value: 0 },
            colorStart: { value: config.colorStart },
            colorEnd: { value: config.colorEnd },

            // 玻璃参数
            glassOpacity: { value: 0.4 },
            frostedAmount: { value: 0.15 },
            highlightIntensity: { value: 0.3 },
            glassColor: { value: new THREE.Color(0xffffff) }
        },
        vertexShader: glassVertexShader,
        fragmentShader: glassFragmentShader
    };
}
