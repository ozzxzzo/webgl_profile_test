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
    bloomStrength: 2.2,
    bloomRadius: 0.00,
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
    repulsionStrength: 40,
    repulsionRange: 190,

    enableRipple: true,
    rippleStrength: 25,
    rippleSpeed: 0.8,
    rippleDecay: 0.02,

    enableInfection: false,
    infectionColor: new THREE.Color(0xff00ff),
    infectionIntensity: 0.8,
    infectionRange: 30,

    // 其他特效参数
    enableDOF: false,
    focusDistance: 55,
    dofRange: 35,
    blurStrength: 2.6,

    enableReflection: false,
    reflectionIntensity: 0.8,
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
