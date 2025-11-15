import * as THREE from 'three';

// 配置参数
export const config = {
    // 基础参数
    surfaceCount: 1,
    gridWidth: 200,
    gridHeight: 60,
    surfaceWidth: 200,
    surfaceHeight: 29,
    gridDensity: 1.4,

    // 颜色参数
    colorStart: new THREE.Color(0x28f321),
    colorEnd: new THREE.Color(0x2196F3),
    colorFlowSpeed: 0.05,

    // 光效参数
    bloomStrength: 0.9,
    bloomRadius: 0.60,
    bloomThreshold: 0.80,
    brightness: 1.5,

    // 波动效果参数
    waveAmplitude: 1.5,
    waveSpeed: 0.09,
    spiralFreq: 11.5,
    spiralAmp: 1.2,
    twistStrength: 1.8,
    dnaStrength: 0.7,

    // 粒子参数
    particleSize: 0.8,
    particlePulse: 0.25,

    // 相机与环境
    cameraZ: 50,
    fov: 60,
    fogDensity: 0.005,
    timeSpeed: 0.8,

    // 鼠标交互特效参数
    enableRepulsion: false,
    repulsionStrength: 20,
    repulsionRange: 100,

    enableRipple: true,
    rippleStrength: 25,
    rippleSpeed: 0.8,
    rippleDecay: 0.02,

    enableInfection: false,
    infectionColor: new THREE.Color(0xff00ff),
    infectionIntensity: 0.8,
    infectionRange: 100,

    // 其他特效参数
    enableDOF: true,
    focusDistance: 65,
    dofRange: 70,
    blurStrength: 0.9,

    enableReflection: true,
    reflectionIntensity: 0.8,
    refractionIndex: 1.5,

    // 玻璃效果参数
    enableGlass: false,
    glassOpacity: 0.10,
    frostedAmount: 0.60,
    highlightIntensity: 2.0,
    glassColor: new THREE.Color(0xccffff),
    glassRadius: 6,
    glassFadeSpeed: 0.01,

    // 数字雪花效果参数
    enableSnow: false,
    snowDensity: 0.90,
    snowUpdateSpeed: 2.3,
    snowColorMode: 'monochrome',
    snowFlickerIntensity: 0.8,
    snowPattern: 'random',
    snowRadius: 8
};

// 默认配置备份
export const defaultConfig = JSON.parse(JSON.stringify({
    ...config,
    colorStart: 0x28f321,
    colorEnd: 0x2196F3,
    infectionColor: 0xff00ff,
    glassColor: 0xccffff
}));

// 重建标志
export let needsRebuild = false;

export function setNeedsRebuild(value) {
    needsRebuild = value;
}

export function getNeedsRebuild() {
    return needsRebuild;
}
