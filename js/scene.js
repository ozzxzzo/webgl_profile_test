import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { DOFShader } from '../shaders/dofShader.js';

// 场景组件
export let scene, camera, renderer, composer, bloomPass, dofPass;

/**
 * 初始化场景
 */
export function initScene(config) {
    // 创建场景
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0f, config.fogDensity);

    // 创建相机
    camera = new THREE.PerspectiveCamera(
        config.fov,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, config.cameraZ);
    camera.lookAt(0, 0, 0);

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = config.brightness;
    document.body.appendChild(renderer.domElement);

    // 设置后处理
    setupPostProcessing(config);

    // 监听窗口大小变化
    window.addEventListener('resize', onWindowResize);
}

/**
 * 设置后处理
 */
function setupPostProcessing(config) {
    composer = new EffectComposer(renderer);

    // 渲染通道
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // 辉光通道
    bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        config.bloomStrength,
        config.bloomRadius,
        config.bloomThreshold
    );
    composer.addPass(bloomPass);

    // 景深通道
    dofPass = new ShaderPass(DOFShader);
    dofPass.uniforms['focusDistance'].value = config.focusDistance;
    dofPass.uniforms['dofRange'].value = config.dofRange;
    dofPass.uniforms['blurStrength'].value = config.blurStrength;
    composer.addPass(dofPass);

    // 输出通道
    const outputPass = new OutputPass();
    composer.addPass(outputPass);
}

/**
 * 窗口大小调整
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * 更新实时参数
 */
export function updateSceneParameters(config) {
    // 更新相机
    camera.position.z = config.cameraZ;
    camera.fov = config.fov;
    camera.updateProjectionMatrix();

    // 更新雾效
    if (scene.fog) {
        scene.fog.density = config.fogDensity;
    }

    // 更新辉光效果
    if (bloomPass) {
        bloomPass.strength = config.bloomStrength;
        bloomPass.radius = config.bloomRadius;
        bloomPass.threshold = config.bloomThreshold;
    }

    // 更新景深效果
    if (dofPass) {
        dofPass.enabled = config.enableDOF;
        dofPass.uniforms['focusDistance'].value = config.focusDistance;
        dofPass.uniforms['dofRange'].value = config.dofRange;
        dofPass.uniforms['blurStrength'].value = config.blurStrength;
    }

    // 更新亮度
    renderer.toneMappingExposure = config.brightness;
}

/**
 * 渲染场景
 */
export function renderScene() {
    composer.render();
}

/**
 * 获取场景组件（用于其他模块）
 */
export function getSceneComponents() {
    return { scene, camera, renderer, composer, bloomPass, dofPass };
}
