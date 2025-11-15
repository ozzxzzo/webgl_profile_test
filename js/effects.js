import * as THREE from 'three';

// ==================== 波动效果函数 ====================

/**
 * 计算螺旋效果
 */
export function calculateSpiralEffect(u, v, time, config, phaseOffset) {
    const waveOffset = phaseOffset + time * config.waveSpeed;
    const spiralY = Math.sin(u * Math.PI * config.spiralFreq + waveOffset + v * Math.PI * 2) * config.spiralAmp;
    const spiralZ = Math.cos(u * Math.PI * config.spiralFreq + waveOffset + v * Math.PI * 2) * config.spiralAmp;
    return { spiralY, spiralZ, waveOffset };
}

/**
 * 计算主波动效果
 */
export function calculateWaveEffect(u, v, waveOffset, waveAmplitude) {
    const wave1 = Math.sin(u * Math.PI * 3 + waveOffset) * waveAmplitude * 0.8;
    const wave2 = Math.cos(v * Math.PI * 4 + waveOffset * 1.5) * waveAmplitude * 0.5;
    return { wave1, wave2 };
}

/**
 * 计算径向波动效果
 */
export function calculateRadialWave(u, v, waveOffset, waveAmplitude) {
    const centerX = u - 0.5;
    const centerY = v - 0.5;
    const distFromCenter = Math.sqrt(centerX * centerX + centerY * centerY);
    return Math.sin(distFromCenter * Math.PI * 6 + waveOffset * 2) * waveAmplitude * 0.3;
}

/**
 * 计算扭曲效果
 */
export function calculateTwistEffect(u, v, time, twistStrength) {
    const twistX = Math.sin(u * Math.PI * 12 + time * 2) * Math.cos(v * Math.PI * 6 + time) * twistStrength;
    const twistY = Math.cos(u * Math.PI * 6 + time * 1.5) * Math.sin(v * Math.PI * 12 + time * 2) * twistStrength;
    return { twistX, twistY };
}

/**
 * 计算DNA效果
 */
export function calculateDNAEffect(u, v, waveOffset, dnaStrength) {
    const dnaPhase = u * Math.PI * 8 + waveOffset * 3;
    const dnaY = Math.sin(dnaPhase + v * Math.PI) * dnaStrength;
    const dnaZ = Math.cos(dnaPhase + v * Math.PI) * dnaStrength;
    return { dnaY, dnaZ };
}

/**
 * 应用排斥力效果
 */
export function applyRepulsionEffect(finalX, finalY, finalZ, mouse, config) {
    // 检查鼠标是否在粒子群附近（只有悬浮在粒子上时才激活）
    const particleBoundaryMargin = 50;
    const maxX = config.surfaceWidth / 2 + particleBoundaryMargin;
    const maxY = config.surfaceHeight / 2 + particleBoundaryMargin;

    const mouseInBounds = Math.abs(mouse.worldX) < maxX && Math.abs(mouse.worldY) < maxY;

    if (!mouseInBounds || !config.enableRepulsion) {
        return { x: finalX, y: finalY, z: finalZ };
    }

    const dx = mouse.worldX - finalX;
    const dy = mouse.worldY - finalY;
    const dz = mouse.worldZ - finalZ;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (distance < config.repulsionRange) {
        const force = (1 - distance / config.repulsionRange) * config.repulsionStrength;
        return {
            x: finalX - (dx / distance) * force * 0.1,
            y: finalY - (dy / distance) * force * 0.1,
            z: finalZ - (dz / distance) * force * 0.1
        };
    }

    return { x: finalX, y: finalY, z: finalZ };
}

/**
 * 计算颜色流动效果
 */
export function calculateColorFlow(u, time, colorFlowSpeed, colorStart, colorEnd) {
    const flowOffset = (time * colorFlowSpeed) % 1.0;
    const colorPos = (u + flowOffset) % 1.0;

    let t;
    if (colorPos < 0.5) {
        t = colorPos * 2;
    } else {
        t = (1.0 - colorPos) * 2;
    }

    // smoothstep
    t = t * t * (3 - 2 * t);

    const color = new THREE.Color();
    color.lerpColors(colorStart, colorEnd, t);
    return color;
}

/**
 * 应用色彩感染效果
 */
export function applyInfectionEffect(color, mouseDistance, config) {
    if (config.enableInfection && mouseDistance < config.infectionRange) {
        const infectionFactor = (1 - mouseDistance / config.infectionRange) * config.infectionIntensity;
        color.lerp(config.infectionColor, infectionFactor);
    }
    return color;
}

/**
 * 计算粒子大小律动
 */
export function calculateParticleSize(u, v, time, config) {
    const pulse1 = Math.sin(time * 2 + u * Math.PI * 6) * config.particlePulse;
    const pulse2 = Math.cos(time * 1.5 + v * Math.PI * 8) * config.particlePulse * 0.75;
    return (config.particleSize + Math.random() * 0.15) * (1.0 + pulse1 + pulse2);
}

/**
 * 计算粒子透明度律动
 */
export function calculateParticleAlpha(u, v, time, config) {
    const edgeFadeX = Math.sin(u * Math.PI);
    const edgeFadeY = Math.sin(v * Math.PI);
    const alphaPulse1 = Math.sin(time * 1.5 + u * Math.PI * 4) * config.particlePulse * 0.75;
    const alphaPulse2 = Math.cos(time * 2 + v * Math.PI * 6) * config.particlePulse * 0.5;
    return edgeFadeX * edgeFadeY * (0.75 + alphaPulse1 + alphaPulse2);
}
