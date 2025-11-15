import * as THREE from 'three';

// 鼠标状态
export const mouse = { x: 0, y: 0, worldX: 0, worldY: 0, worldZ: 0 };

// 波纹数组
export const ripples = [];

/**
 * 初始化鼠标交互
 */
export function initMouseInteraction(camera) {
    const cursor = document.getElementById('cursor');

    // 鼠标移动事件
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 20 + 'px';
        cursor.style.top = e.clientY - 20 + 'px';

        // 更新鼠标世界坐标
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        // 转换为世界坐标
        const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const pos = camera.position.clone().add(dir.multiplyScalar(distance));

        mouse.worldX = pos.x;
        mouse.worldY = pos.y;
        mouse.worldZ = 0;
    });

    // 鼠标点击事件（光标动画）
    document.addEventListener('click', () => {
        cursor.style.transform = 'scale(1.5)';
        setTimeout(() => {
            cursor.style.transform = 'scale(1)';
        }, 150);
    });
}

/**
 * 创建量子脉冲效果
 */
export function createQuantumPulse(config) {
    if (!config.enableRipple) return;

    const pulseCount = 2; // 精简到2层脉冲
    const time = performance.now();

    for (let i = 0; i < pulseCount; i++) {
        ripples.push({
            x: mouse.worldX,
            y: mouse.worldY,
            z: mouse.worldZ,
            radius: 0,
            strength: config.rippleStrength * (1 - i * 0.2),
            layer: i,
            speed: config.rippleSpeed * (1 + i * 0.25),
            frequency: 2.5 + i * 1.0,
            phase: i * Math.PI / 2,
            birthTime: time,
            colorHue: i * 60
        });
    }
}

/**
 * 更新波纹效果
 */
export function updateRipples(config) {
    for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.radius += ripple.speed;
        ripple.strength *= (1 - config.rippleDecay);
        if (ripple.strength < 0.1) {
            ripples.splice(i, 1);
        }
    }
}

/**
 * 应用量子脉冲效果到粒子位置
 */
export function applyQuantumPulse(finalX, finalY, finalZ, idx, time) {
    let quantumPulseIntensity = 0;
    let posX = finalX;
    let posY = finalY;
    let posZ = finalZ;

    for (let r = 0; r < ripples.length; r++) {
        const ripple = ripples[r];
        const rdx = finalX - ripple.x;
        const rdy = finalY - ripple.y;
        const rdz = finalZ - ripple.z;
        const rippleDist = Math.sqrt(rdx * rdx + rdy * rdy + rdz * rdz);
        const rippleEdge = Math.abs(rippleDist - ripple.radius);

        const edgeWidth = 4 + ripple.layer * 1;

        if (rippleEdge < edgeWidth) {
            const pulseTime = (performance.now() - ripple.birthTime) * 0.003;
            const pulseFactor = Math.sin(pulseTime * ripple.frequency + ripple.phase) * 0.5 + 0.5;

            const edgeFalloff = 1 - rippleEdge / edgeWidth;
            const smoothFalloff = edgeFalloff * edgeFalloff * (3 - 2 * edgeFalloff);

            const wavePattern = Math.sin(rippleEdge * 0.3 + ripple.phase);
            const rippleForce = ripple.strength * smoothFalloff * wavePattern * (0.6 + pulseFactor * 0.4);

            posX += (rdx / rippleDist) * rippleForce * 0.015;
            posY += (rdy / rippleDist) * rippleForce * 0.015;
            posZ += (rdz / rippleDist) * rippleForce * 0.015;

            quantumPulseIntensity += edgeFalloff * pulseFactor * (1 - ripple.layer * 0.2);
        }
    }

    quantumPulseIntensity = Math.min(quantumPulseIntensity, 1.0);

    // 马赛克破碎效果
    if (quantumPulseIntensity > 0.15) {
        const seed = (idx * 12345.6789) % 1000;
        const randomX = Math.sin(seed + time * 3) * quantumPulseIntensity;
        const randomY = Math.cos(seed * 1.3 + time * 3.2) * quantumPulseIntensity;
        const randomZ = Math.sin(seed * 1.7 + time * 2.8) * quantumPulseIntensity;

        const shatterStrength = 0.5;
        posX += randomX * shatterStrength;
        posY += randomY * shatterStrength;
        posZ += randomZ * shatterStrength;
    }

    return { x: posX, y: posY, z: posZ, intensity: quantumPulseIntensity };
}

/**
 * 应用量子脉冲颜色效果
 */
export function applyQuantumPulseColor(color, posX, posY, posZ, quantumPulseIntensity) {
    if (quantumPulseIntensity <= 0.15) return color;

    let hueShift = 0;
    let colorIntensity = 0;

    for (let r = 0; r < ripples.length; r++) {
        const ripple = ripples[r];
        const rdx = posX - ripple.x;
        const rdy = posY - ripple.y;
        const rdz = posZ - ripple.z;
        const rippleDist = Math.sqrt(rdx * rdx + rdy * rdy + rdz * rdz);
        const rippleEdge = Math.abs(rippleDist - ripple.radius);
        const edgeWidth = 4 + ripple.layer * 1;

        if (rippleEdge < edgeWidth) {
            const edgeFalloff = 1 - rippleEdge / edgeWidth;
            hueShift += ripple.colorHue * edgeFalloff * 0.0008;
            colorIntensity += edgeFalloff * (1 - ripple.layer * 0.2);
        }
    }

    const hsl = { h: 0, s: 0, l: 0 };
    color.getHSL(hsl);
    hsl.h = (hsl.h + hueShift) % 1.0;
    hsl.s = Math.min(hsl.s + colorIntensity * 0.08, 1.0);
    hsl.l = Math.min(hsl.l + colorIntensity * 0.04, 1.0);
    color.setHSL(hsl.h, hsl.s, hsl.l);

    return color;
}

/**
 * 应用量子脉冲大小和透明度效果
 */
export function applyQuantumPulseParticle(baseSize, baseAlpha, idx, time, quantumPulseIntensity) {
    let size = baseSize;
    let alpha = baseAlpha;

    if (quantumPulseIntensity > 0.15) {
        const seed = (idx * 9876.543) % 1000;
        const sizeFlicker = Math.sin(seed + time * 4.5) * 0.5 + 0.5;
        const sizeVariation = 1.0 + (sizeFlicker - 0.5) * quantumPulseIntensity * 0.2;
        size *= sizeVariation;

        const alphaSeed = (idx * 6543.21) % 1000;
        const alphaFlicker = Math.sin(alphaSeed + time * 5) * 0.5 + 0.5;
        const alphaBoost = 1.0 + alphaFlicker * quantumPulseIntensity * 0.15;
        alpha = Math.min(alpha * alphaBoost, 1.0);
    }

    return { size, alpha };
}
