import * as THREE from 'three';

/**
 * 数字雪花效果系统
 * 对激活区域内的粒子应用随机闪烁效果
 */

// 雪花数据存储
export const snowData = {
    affectedParticles: new Set(),  // 受影响的粒子索引
    lastUpdateTime: 0,
    updateInterval: 16,  // 更新间隔（ms），约60fps
};

/**
 * 数字雪花配置
 */
export const snowConfig = {
    enabled: false,
    density: 0.15,           // 雪花密度 (0-1)
    updateSpeed: 1.0,        // 更新频率倍速
    colorMode: 'monochrome', // 'monochrome'/'color'/'rainbow'/'flicker'
    flickerIntensity: 0.8,   // 闪烁强度 (0-2)
    pattern: 'random',       // 'random'/'noise'
};

/**
 * 简单的伪随机函数（基于种子）
 */
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

/**
 * 为粒子生成雪花颜色
 */
function generateSnowColor(mode, particleIndex, baseColor) {
    const rand = seededRandom(particleIndex + performance.now() * 0.001);

    switch (mode) {
        case 'monochrome':
            // 黑白闪烁
            return rand > 0.5
                ? new THREE.Color(0xffffff)
                : new THREE.Color(0x000000);

        case 'color':
            // 随机彩色
            return new THREE.Color(
                seededRandom(particleIndex * 2),
                seededRandom(particleIndex * 3),
                seededRandom(particleIndex * 5)
            );

        case 'rainbow':
            // 彩虹色（随机色相）
            const hue = seededRandom(particleIndex * 7);
            return new THREE.Color().setHSL(hue, 1.0, 0.7);

        case 'flicker':
            // 在原色和白色之间闪烁
            return rand > 0.5
                ? new THREE.Color(0xffffff)
                : baseColor.clone();

        default:
            return baseColor.clone();
    }
}

/**
 * 更新雪花效果
 * @param {Array} particleIndices - 激活区域内的粒子索引数组
 * @param {number} currentTime - 当前时间
 */
export function updateDigitalSnow(particleIndices, currentTime) {
    if (!snowConfig.enabled) {
        snowData.affectedParticles.clear();
        return;
    }

    // 检查是否需要更新
    const timeSinceLastUpdate = currentTime - snowData.lastUpdateTime;
    const adjustedInterval = snowData.updateInterval / snowConfig.updateSpeed;

    if (timeSinceLastUpdate < adjustedInterval) {
        return; // 还没到更新时间
    }

    snowData.lastUpdateTime = currentTime;
    snowData.affectedParticles.clear();

    // 根据密度随机选择粒子
    for (const idx of particleIndices) {
        if (Math.random() < snowConfig.density) {
            snowData.affectedParticles.add(idx);
        }
    }
}

/**
 * 应用雪花效果到粒子
 * @param {number} particleIdx - 粒子索引
 * @param {THREE.Color} baseColor - 基础颜色
 * @param {number} baseAlpha - 基础透明度
 * @returns {Object} { color, alpha, brightness }
 */
export function applySnowEffect(particleIdx, baseColor, baseAlpha) {
    if (!snowConfig.enabled || !snowData.affectedParticles.has(particleIdx)) {
        return {
            color: baseColor,
            alpha: baseAlpha,
            brightness: 1.0
        };
    }

    // 生成雪花颜色
    const snowColor = generateSnowColor(snowConfig.colorMode, particleIdx, baseColor);

    // 亮度变化
    const brightness = 0.5 + seededRandom(particleIdx * 11 + performance.now() * 0.01) * snowConfig.flickerIntensity;

    // 透明度变化（可选）
    const alphaVariation = 0.7 + seededRandom(particleIdx * 13) * 0.3;

    return {
        color: snowColor,
        alpha: baseAlpha * alphaVariation,
        brightness: brightness
    };
}

/**
 * 重置雪花系统
 */
export function resetSnowSystem() {
    snowData.affectedParticles.clear();
    snowData.lastUpdateTime = 0;
}

/**
 * 设置雪花配置
 */
export function setSnowConfig(newConfig) {
    Object.assign(snowConfig, newConfig);
}

/**
 * 获取受影响的粒子数量
 */
export function getAffectedParticleCount() {
    return snowData.affectedParticles.size;
}
