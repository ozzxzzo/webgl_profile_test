import * as THREE from 'three';

// 配置参数
export const config = {
    // 基础参数
    surfaceCount: 1,
    gridWidth: 200,
    gridHeight: 60,
    surfaceWidth: 200,
    surfaceHeight: 29,
    gridDensity: 1.7,

    // 颜色参数
    colorStart: new THREE.Color(0x28f321),
    colorEnd: new THREE.Color(0x2196F3),
    colorFlowSpeed: 0.05,

    // 光效参数
    bloomStrength: 1.7,
    bloomRadius: 0.00,
    bloomThreshold: 0.55,
    brightness: 1.5,

    // 波动效果参数
    waveAmplitude: 1.7,
    waveSpeed: 0.27,
    spiralFreq: 11.5,
    spiralAmp: 1.3,
    twistStrength: 1.9,
    dnaStrength: 0.5,

    // 粒子参数
    particleSize: 0.8,
    particlePulse: 0.20,

    // 相机与环境
    cameraZ: 50,
    fov: 60,
    fogDensity: 0.011,
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
    focusDistance: 50,
    dofRange: 30,
    blurStrength: 1.5,

    enableReflection: true,
    reflectionIntensity: 0.6,
    refractionIndex: 1.5
};

// 默认配置备份
export const defaultConfig = JSON.parse(JSON.stringify({
    ...config,
    colorStart: 0x28f321,
    colorEnd: 0x2196F3,
    infectionColor: 0xff00ff
}));

// 重建标志
export let needsRebuild = false;

export function setNeedsRebuild(value) {
    needsRebuild = value;
}

export function getNeedsRebuild() {
    return needsRebuild;
}
