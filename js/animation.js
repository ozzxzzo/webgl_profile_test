import { config, getNeedsRebuild, setNeedsRebuild } from './config.js';
import { updateRibbons, cleanupRibbons, createSurfaces, ribbons } from './particle.js';
import { updateRipples } from './interaction.js';
import { updateSceneParameters, renderScene, getSceneComponents } from './scene.js';

// 时间变量
export let time = 0;

/**
 * 重建场景
 */
function rebuildScene() {
    const { scene } = getSceneComponents();
    cleanupRibbons(scene);
    createSurfaces(scene, config);
}

/**
 * 更新材质颜色
 */
function updateRibbonMaterials() {
    ribbons.forEach(surface => {
        if (surface.points && surface.points.material && surface.points.material.uniforms) {
            surface.points.material.uniforms.colorStart.value = config.colorStart;
            surface.points.material.uniforms.colorEnd.value = config.colorEnd;
        }
    });
}

/**
 * 动画循环
 */
export function animate() {
    requestAnimationFrame(animate);

    time += 0.01 * config.timeSpeed;

    // 检查是否需要重建场景
    if (getNeedsRebuild()) {
        rebuildScene();
        setNeedsRebuild(false);
    }

    // 更新实时参数
    updateSceneParameters(config);
    updateRibbonMaterials();

    // 更新效果
    updateRibbons(time, config);
    updateRipples(config);

    // 渲染
    renderScene();
}

/**
 * 获取当前时间（供其他模块使用）
 */
export function getTime() {
    return time;
}
