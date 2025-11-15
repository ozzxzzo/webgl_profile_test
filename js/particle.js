import * as THREE from 'three';
import { particleVertexShader, particleFragmentShader } from '../shaders/particleShader.js';
import { glassVertexShader, glassFragmentShader } from '../shaders/glassShader.js';
import {
    calculateSpiralEffect,
    calculateWaveEffect,
    calculateRadialWave,
    calculateTwistEffect,
    calculateDNAEffect,
    applyRepulsionEffect,
    calculateColorFlow,
    applyInfectionEffect,
    calculateParticleSize,
    calculateParticleAlpha
} from './effects.js';
import { mouse } from './interaction.js';
import { applyQuantumPulse, applyQuantumPulseColor, applyQuantumPulseParticle } from './interaction.js';
import { updateDigitalSnow, applySnowEffect, snowConfig } from './digitalSnow.js';

// 丝带数组
export const ribbons = [];

// 玻璃效果激活区域
export const glassActivation = {
    enabled: false,
    activeParticles: new Map(), // particleIdx -> activation level (0-1)
    clickRadius: 15, // 点击激活半径
    fadeSpeed: 0.01 // 淡出速度
};

// 雪花效果激活区域
export const snowActivation = {
    activeParticles: [], // 当前激活区域内的粒子索引
    clickRadius: 15
};

/**
 * 创建粒子材质
 */
export function createParticleMaterial(config, useGlassShader = false) {
    const uniforms = {
        time: { value: 0 },
        colorStart: { value: config.colorStart },
        colorEnd: { value: config.colorEnd },
        reflectionIntensity: { value: config.reflectionIntensity },
        enableReflection: { value: config.enableReflection ? 1.0 : 0.0 }
    };

    // 如果使用玻璃shader，添加额外的uniforms
    if (useGlassShader) {
        Object.assign(uniforms, {
            glassOpacity: { value: config.glassOpacity || 0.5 },
            frostedAmount: { value: config.frostedAmount || 0.4 },
            highlightIntensity: { value: config.highlightIntensity || 1.0 },
            glassColor: { value: config.glassColor || new THREE.Color(0xccffff) }
        });
    }

    return new THREE.ShaderMaterial({
        uniforms,
        vertexShader: useGlassShader ? glassVertexShader : particleVertexShader,
        fragmentShader: useGlassShader ? glassFragmentShader : particleFragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
}

/**
 * 激活玻璃效果（点击激活）
 */
export function activateGlassEffect() {
    if (!glassActivation.enabled) return;

    ribbons.forEach((surface) => {
        const positions = surface.geometry.attributes.position.array;
        let idx = 0;

        for (let iy = 0; iy < surface.gridH; iy++) {
            for (let ix = 0; ix < surface.gridW; ix++) {
                const px = positions[idx * 3];
                const py = positions[idx * 3 + 1];
                const pz = positions[idx * 3 + 2];

                const dx = mouse.worldX - px;
                const dy = mouse.worldY - py;
                const dz = mouse.worldZ - pz;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < glassActivation.clickRadius) {
                    // 激活玻璃效果，设置为1.0
                    glassActivation.activeParticles.set(idx, 1.0);
                }
                idx++;
            }
        }
    });
}

/**
 * 激活雪花效果（点击激活）
 */
export function activateSnowEffect() {
    if (!snowConfig.enabled) return;

    snowActivation.activeParticles = [];
    ribbons.forEach((surface) => {
        const positions = surface.geometry.attributes.position.array;
        let idx = 0;

        for (let iy = 0; iy < surface.gridH; iy++) {
            for (let ix = 0; ix < surface.gridW; ix++) {
                const px = positions[idx * 3];
                const py = positions[idx * 3 + 1];
                const pz = positions[idx * 3 + 2];

                const dx = mouse.worldX - px;
                const dy = mouse.worldY - py;
                const dz = mouse.worldZ - pz;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < snowActivation.clickRadius) {
                    snowActivation.activeParticles.push(idx);
                }
                idx++;
            }
        }
    });
}

/**
 * 创建所有光流曲面
 */
export function createSurfaces(scene, config) {
    // 清空现有丝带
    ribbons.length = 0;

    for (let i = 0; i < config.surfaceCount; i++) {
        const surface = createSurface(i, config.surfaceCount, config);
        ribbons.push(surface);
        scene.add(surface.points);
    }
}

/**
 * 创建单个光流曲面
 */
function createSurface(index, total, config) {
    const gridW = Math.floor(config.gridWidth * config.gridDensity);
    const gridH = Math.floor(config.gridHeight * config.gridDensity);
    const particleCount = gridW * gridH;
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const alphas = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);
    const offsets = new Float32Array(particleCount);
    const gridCoords = new Float32Array(particleCount * 2);
    const glassActivations = new Float32Array(particleCount); // 玻璃激活等级

    const yOffset = (index - total / 2) * 8;
    const zOffset = (index % 2 === 0 ? 1 : -1) * (3 + index * 2);

    let idx = 0;
    for (let iy = 0; iy < gridH; iy++) {
        for (let ix = 0; ix < gridW; ix++) {
            const u = ix / (gridW - 1);
            const v = iy / (gridH - 1);

            gridCoords[idx * 2] = u;
            gridCoords[idx * 2 + 1] = v;

            const x = (u - 0.5) * config.surfaceWidth;
            const y = (v - 0.5) * config.surfaceHeight + yOffset;
            const z = zOffset;

            positions[idx * 3] = x;
            positions[idx * 3 + 1] = y;
            positions[idx * 3 + 2] = z;

            const color = new THREE.Color();
            color.lerpColors(config.colorStart, config.colorEnd, u);
            colors[idx * 3] = color.r;
            colors[idx * 3 + 1] = color.g;
            colors[idx * 3 + 2] = color.b;

            const edgeFadeX = Math.sin(u * Math.PI);
            const edgeFadeY = Math.sin(v * Math.PI);
            alphas[idx] = edgeFadeX * edgeFadeY * 0.8 + 0.2;

            sizes[idx] = config.particleSize + Math.random() * 0.3;
            offsets[idx] = Math.random() * Math.PI * 2;
            glassActivations[idx] = 0.0; // 初始未激活

            idx++;
        }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('glassActivation', new THREE.BufferAttribute(glassActivations, 1));

    // 始终使用玻璃shader（当glassActivation为0时会正常渲染）
    const material = createParticleMaterial(config, true);
    const points = new THREE.Points(geometry, material);

    return {
        points,
        geometry,
        offsets,
        gridCoords,
        gridW,
        gridH,
        yOffset,
        zOffset,
        phaseOffset: index * 1.2
    };
}

/**
 * 更新光流曲面动画
 */
export function updateRibbons(time, config) {
    // 更新数字雪花系统
    if (snowConfig.enabled) {
        updateDigitalSnow(snowActivation.activeParticles, performance.now());
    }

    // 更新玻璃激活等级（淡出效果）
    if (glassActivation.enabled) {
        for (const [idx, level] of glassActivation.activeParticles.entries()) {
            const newLevel = Math.max(0, level - glassActivation.fadeSpeed);
            if (newLevel <= 0) {
                glassActivation.activeParticles.delete(idx);
            } else {
                glassActivation.activeParticles.set(idx, newLevel);
            }
        }
    }

    ribbons.forEach((surface) => {
        const positions = surface.geometry.attributes.position.array;
        const colors = surface.geometry.attributes.customColor.array;
        const sizes = surface.geometry.attributes.size.array;
        const alphas = surface.geometry.attributes.alpha.array;
        const glassActivations = surface.geometry.attributes.glassActivation.array;

        let idx = 0;
        for (let iy = 0; iy < surface.gridH; iy++) {
            for (let ix = 0; ix < surface.gridW; ix++) {
                const u = surface.gridCoords[idx * 2];
                const v = surface.gridCoords[idx * 2 + 1];

                const x = (u - 0.5) * config.surfaceWidth;
                const y = (v - 0.5) * config.surfaceHeight + surface.yOffset;
                const z = surface.zOffset;

                // 计算基础位置到鼠标的距离
                const baseDx = mouse.worldX - x;
                const baseDy = mouse.worldY - y;
                const baseDz = mouse.worldZ - z;
                const mouseDistance = Math.sqrt(baseDx * baseDx + baseDy * baseDy + baseDz * baseDz);

                // 计算各种波动效果
                const { spiralY, spiralZ, waveOffset } = calculateSpiralEffect(u, v, time, config, surface.phaseOffset);
                const { wave1, wave2 } = calculateWaveEffect(u, v, waveOffset, config.waveAmplitude);
                const radialWave = calculateRadialWave(u, v, waveOffset, config.waveAmplitude);
                const { twistX, twistY } = calculateTwistEffect(u, v, time, config.twistStrength);
                const { dnaY, dnaZ } = calculateDNAEffect(u, v, waveOffset, config.dnaStrength);

                let finalX = x + twistX;
                let finalY = y + spiralY + wave1 + wave2 + radialWave + dnaY + twistY;
                let finalZ = z + spiralZ + dnaZ;

                // 应用排斥力效果
                const repulsed = applyRepulsionEffect(finalX, finalY, finalZ, mouse, config);
                finalX = repulsed.x;
                finalY = repulsed.y;
                finalZ = repulsed.z;

                // 应用量子脉冲效果
                const pulseResult = applyQuantumPulse(finalX, finalY, finalZ, idx, time);
                const mosaicX = pulseResult.x;
                const mosaicY = pulseResult.y;
                const mosaicZ = pulseResult.z;
                const quantumPulseIntensity = pulseResult.intensity;

                positions[idx * 3] = mosaicX;
                positions[idx * 3 + 1] = mosaicY;
                positions[idx * 3 + 2] = mosaicZ;

                // 计算颜色
                let color = calculateColorFlow(u, time, config.colorFlowSpeed, config.colorStart, config.colorEnd);
                color = applyInfectionEffect(color, mouseDistance, config);
                color = applyQuantumPulseColor(color, mosaicX, mosaicY, mosaicZ, quantumPulseIntensity);

                // 计算粒子大小和透明度
                let baseSize = calculateParticleSize(u, v, time, config);
                let baseAlpha = calculateParticleAlpha(u, v, time, config);

                const particle = applyQuantumPulseParticle(baseSize, baseAlpha, idx, time, quantumPulseIntensity);
                let finalSize = particle.size;
                let finalAlpha = particle.alpha;

                // 应用数字雪花效果
                if (snowConfig.enabled) {
                    const snowEffect = applySnowEffect(idx, color, finalAlpha);
                    color = snowEffect.color;
                    finalAlpha = snowEffect.alpha;
                    finalSize *= snowEffect.brightness; // 亮度影响大小
                }

                // 更新玻璃激活等级
                const glassLevel = glassActivation.activeParticles.get(idx) || 0;
                glassActivations[idx] = glassLevel;

                // 如果有玻璃效果，调整透明度（玻璃效果在shader中处理颜色）
                if (glassLevel > 0) {
                    finalAlpha *= (1.0 + glassLevel * 0.3); // 玻璃化时稍微增加透明度
                }

                // 最终设置颜色、大小、透明度
                colors[idx * 3] = color.r;
                colors[idx * 3 + 1] = color.g;
                colors[idx * 3 + 2] = color.b;
                sizes[idx] = finalSize;
                alphas[idx] = finalAlpha;

                idx++;
            }
        }

        surface.geometry.attributes.position.needsUpdate = true;
        surface.geometry.attributes.customColor.needsUpdate = true;
        surface.geometry.attributes.size.needsUpdate = true;
        surface.geometry.attributes.alpha.needsUpdate = true;
        surface.geometry.attributes.glassActivation.needsUpdate = true;

        surface.points.material.uniforms.time.value = time;
        surface.points.material.uniforms.reflectionIntensity.value = config.reflectionIntensity;
        surface.points.material.uniforms.enableReflection.value = config.enableReflection ? 1.0 : 0.0;

        // 更新玻璃shader的uniforms（如果启用）
        if (glassActivation.enabled && surface.points.material.uniforms.glassOpacity) {
            surface.points.material.uniforms.glassOpacity.value = config.glassOpacity || 0.5;
            surface.points.material.uniforms.frostedAmount.value = config.frostedAmount || 0.4;
            surface.points.material.uniforms.highlightIntensity.value = config.highlightIntensity || 1.0;
            surface.points.material.uniforms.glassColor.value = config.glassColor || new THREE.Color(0xccffff);
        }
    });
}

/**
 * 清理所有丝带
 */
export function cleanupRibbons(scene) {
    ribbons.forEach(surface => {
        scene.remove(surface.points);
        surface.geometry.dispose();
        surface.points.material.dispose();
    });
    ribbons.length = 0;
}
