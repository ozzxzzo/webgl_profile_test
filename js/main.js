import { config } from './config.js';
import { initScene, getSceneComponents } from './scene.js';
import { createSurfaces, activateSnowEffect } from './particle.js';
import { initMouseInteraction } from './interaction.js';
import { setupControls, updateUIFromConfig, togglePanel, resetToDefault, randomize, toggleAllEffects } from './ui.js';
import { animate } from './animation.js';

/**
 * 初始化应用
 */
function init() {
    // 初始化场景
    initScene(config);

    // 获取场景组件
    const { scene, camera } = getSceneComponents();

    // 创建粒子系统
    createSurfaces(scene, config);

    // 初始化鼠标交互（需要传入config以便点击时创建波纹）
    initMouseInteraction(camera);

    // 点击事件：激活雪花效果
    document.addEventListener('click', () => {
        activateSnowEffect();
    });

    // 设置UI控制
    setupControls();
    updateUIFromConfig();

    // 将UI函数暴露到全局作用域（供HTML按钮调用）
    window.togglePanel = togglePanel;
    window.resetToDefault = resetToDefault;
    window.randomize = randomize;
    window.toggleAllEffects = toggleAllEffects;

    // 隐藏加载提示
    document.getElementById('loading').style.display = 'none';
}

// 启动应用
init();
animate();
