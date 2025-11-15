import * as THREE from 'three';
import { config, defaultConfig, setNeedsRebuild } from './config.js';

/**
 * 控制面板切换
 */
export function togglePanel() {
    const panel = document.getElementById('controlPanel');
    const toggleBtn = document.querySelector('.toggle-btn');
    const isVisible = panel.classList.contains('visible');

    if (!isVisible) {
        panel.style.display = 'block';
        setTimeout(() => {
            panel.classList.add('visible');
        }, 10);
        toggleBtn.style.right = '400px';
        toggleBtn.textContent = '隐藏面板';
    } else {
        panel.classList.remove('visible');
        setTimeout(() => {
            panel.style.display = 'none';
        }, 300);
        toggleBtn.style.right = '20px';
        toggleBtn.textContent = '控制面板';
    }
}

/**
 * 重置为默认值
 */
export function resetToDefault() {
    config.colorStart = new THREE.Color(defaultConfig.colorStart);
    config.colorEnd = new THREE.Color(defaultConfig.colorEnd);
    config.infectionColor = new THREE.Color(defaultConfig.infectionColor);
    Object.assign(config, {
        ...defaultConfig,
        colorStart: config.colorStart,
        colorEnd: config.colorEnd,
        infectionColor: config.infectionColor
    });
    updateUIFromConfig();
    setNeedsRebuild(true);
}

/**
 * 随机化参数
 */
export function randomize() {
    config.surfaceCount = Math.floor(Math.random() * 8) + 2;
    config.gridDensity = Math.random() * 1.5 + 0.5;
    config.surfaceWidth = Math.random() * 120 + 50;
    config.surfaceHeight = Math.random() * 30 + 10;
    config.colorFlowSpeed = Math.random() * 0.4;
    config.bloomStrength = Math.random() * 2 + 0.5;
    config.bloomRadius = Math.random();
    config.bloomThreshold = Math.random() * 0.5;
    config.brightness = Math.random() * 2 + 0.5;
    config.waveAmplitude = Math.random() * 6 + 1;
    config.waveSpeed = Math.random() * 0.8 + 0.1;
    config.spiralFreq = Math.random() * 10 + 1;
    config.spiralAmp = Math.random() * 4 + 0.5;
    config.twistStrength = Math.random() * 2;
    config.dnaStrength = Math.random() * 1.5;
    config.particleSize = Math.random() * 1.5 + 0.3;
    config.particlePulse = Math.random() * 0.8;
    config.cameraZ = Math.random() * 80 + 40;
    config.fov = Math.random() * 60 + 40;
    config.fogDensity = Math.random() * 0.015;
    config.timeSpeed = Math.random() * 2 + 0.2;

    const randomColor1 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const randomColor2 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    config.colorStart = new THREE.Color(randomColor1);
    config.colorEnd = new THREE.Color(randomColor2);

    config.reflectionIntensity = Math.random() * 1.5;

    updateUIFromConfig();
    setNeedsRebuild(true);
}

/**
 * 全效果开关
 */
export function toggleAllEffects() {
    const allEnabled = config.enableRepulsion && config.enableRipple && config.enableInfection &&
                      config.enableDOF && config.enableReflection;

    config.enableRepulsion = !allEnabled;
    config.enableRipple = !allEnabled;
    config.enableInfection = !allEnabled;
    config.enableDOF = !allEnabled;
    config.enableReflection = !allEnabled;

    updateUIFromConfig();
}

/**
 * 从配置更新UI
 */
export function updateUIFromConfig() {
    document.getElementById('surfaceCount').value = config.surfaceCount;
    document.getElementById('surfaceCount-value').textContent = config.surfaceCount;

    document.getElementById('gridDensity').value = config.gridDensity;
    document.getElementById('gridDensity-value').textContent = config.gridDensity.toFixed(1);

    document.getElementById('surfaceWidth').value = config.surfaceWidth;
    document.getElementById('surfaceWidth-value').textContent = Math.round(config.surfaceWidth);

    document.getElementById('surfaceHeight').value = config.surfaceHeight;
    document.getElementById('surfaceHeight-value').textContent = Math.round(config.surfaceHeight);

    document.getElementById('colorStart').value = '#' + config.colorStart.getHexString();
    document.getElementById('colorEnd').value = '#' + config.colorEnd.getHexString();

    document.getElementById('colorFlowSpeed').value = config.colorFlowSpeed;
    document.getElementById('colorFlowSpeed-value').textContent = config.colorFlowSpeed.toFixed(2);

    document.getElementById('bloomStrength').value = config.bloomStrength;
    document.getElementById('bloomStrength-value').textContent = config.bloomStrength.toFixed(1);

    document.getElementById('bloomRadius').value = config.bloomRadius;
    document.getElementById('bloomRadius-value').textContent = config.bloomRadius.toFixed(2);

    document.getElementById('bloomThreshold').value = config.bloomThreshold;
    document.getElementById('bloomThreshold-value').textContent = config.bloomThreshold.toFixed(2);

    document.getElementById('brightness').value = config.brightness;
    document.getElementById('brightness-value').textContent = config.brightness.toFixed(1);

    document.getElementById('waveAmplitude').value = config.waveAmplitude;
    document.getElementById('waveAmplitude-value').textContent = config.waveAmplitude.toFixed(1);

    document.getElementById('waveSpeed').value = config.waveSpeed;
    document.getElementById('waveSpeed-value').textContent = config.waveSpeed.toFixed(2);

    document.getElementById('spiralFreq').value = config.spiralFreq;
    document.getElementById('spiralFreq-value').textContent = config.spiralFreq.toFixed(1);

    document.getElementById('spiralAmp').value = config.spiralAmp;
    document.getElementById('spiralAmp-value').textContent = config.spiralAmp.toFixed(1);

    document.getElementById('twistStrength').value = config.twistStrength;
    document.getElementById('twistStrength-value').textContent = config.twistStrength.toFixed(1);

    document.getElementById('dnaStrength').value = config.dnaStrength;
    document.getElementById('dnaStrength-value').textContent = config.dnaStrength.toFixed(1);

    document.getElementById('particleSize').value = config.particleSize;
    document.getElementById('particleSize-value').textContent = config.particleSize.toFixed(1);

    document.getElementById('particlePulse').value = config.particlePulse;
    document.getElementById('particlePulse-value').textContent = config.particlePulse.toFixed(2);

    document.getElementById('cameraZ').value = config.cameraZ;
    document.getElementById('cameraZ-value').textContent = Math.round(config.cameraZ);

    document.getElementById('fov').value = config.fov;
    document.getElementById('fov-value').textContent = Math.round(config.fov);

    document.getElementById('fogDensity').value = config.fogDensity;
    document.getElementById('fogDensity-value').textContent = config.fogDensity.toFixed(3);

    document.getElementById('timeSpeed').value = config.timeSpeed;
    document.getElementById('timeSpeed-value').textContent = config.timeSpeed.toFixed(1);

    // 鼠标交互特效
    document.getElementById('enableRepulsion').checked = config.enableRepulsion;
    document.getElementById('repulsionStrength').value = config.repulsionStrength;
    document.getElementById('repulsionStrength-value').textContent = config.repulsionStrength.toFixed(1);
    document.getElementById('repulsionRange').value = config.repulsionRange;
    document.getElementById('repulsionRange-value').textContent = Math.round(config.repulsionRange);

    document.getElementById('enableRipple').checked = config.enableRipple;
    document.getElementById('rippleStrength').value = config.rippleStrength;
    document.getElementById('rippleStrength-value').textContent = config.rippleStrength.toFixed(1);
    document.getElementById('rippleSpeed').value = config.rippleSpeed;
    document.getElementById('rippleSpeed-value').textContent = config.rippleSpeed.toFixed(1);
    document.getElementById('rippleDecay').value = config.rippleDecay;
    document.getElementById('rippleDecay-value').textContent = config.rippleDecay.toFixed(2);

    document.getElementById('enableInfection').checked = config.enableInfection;
    document.getElementById('infectionColor').value = '#' + config.infectionColor.getHexString();
    document.getElementById('infectionIntensity').value = config.infectionIntensity;
    document.getElementById('infectionIntensity-value').textContent = config.infectionIntensity.toFixed(1);
    document.getElementById('infectionRange').value = config.infectionRange;
    document.getElementById('infectionRange-value').textContent = Math.round(config.infectionRange);

    document.getElementById('enableDOF').checked = config.enableDOF;
    document.getElementById('focusDistance').value = config.focusDistance;
    document.getElementById('focusDistance-value').textContent = Math.round(config.focusDistance);
    document.getElementById('dofRange').value = config.dofRange;
    document.getElementById('dofRange-value').textContent = Math.round(config.dofRange);
    document.getElementById('blurStrength').value = config.blurStrength;
    document.getElementById('blurStrength-value').textContent = config.blurStrength.toFixed(1);

    document.getElementById('enableReflection').checked = config.enableReflection;
    document.getElementById('reflectionIntensity').value = config.reflectionIntensity;
    document.getElementById('reflectionIntensity-value').textContent = config.reflectionIntensity.toFixed(1);
    document.getElementById('refractionIndex').value = config.refractionIndex;
    document.getElementById('refractionIndex-value').textContent = config.refractionIndex.toFixed(1);
}

/**
 * 设置控制面板事件监听器
 */
export function setupControls() {
    setupSlider('surfaceCount', (val) => {
        config.surfaceCount = parseInt(val);
        setNeedsRebuild(true);
    });

    setupSlider('gridDensity', (val) => {
        config.gridDensity = parseFloat(val);
        setNeedsRebuild(true);
    });

    setupSlider('surfaceWidth', (val) => {
        config.surfaceWidth = parseFloat(val);
    });

    setupSlider('surfaceHeight', (val) => {
        config.surfaceHeight = parseFloat(val);
    });

    setupColorPicker('colorStart', (val) => {
        config.colorStart = new THREE.Color(val);
    });

    setupColorPicker('colorEnd', (val) => {
        config.colorEnd = new THREE.Color(val);
    });

    setupSlider('colorFlowSpeed', (val) => {
        config.colorFlowSpeed = parseFloat(val);
    });

    setupSlider('bloomStrength', (val) => {
        config.bloomStrength = parseFloat(val);
    });

    setupSlider('bloomRadius', (val) => {
        config.bloomRadius = parseFloat(val);
    });

    setupSlider('bloomThreshold', (val) => {
        config.bloomThreshold = parseFloat(val);
    });

    setupSlider('brightness', (val) => {
        config.brightness = parseFloat(val);
    });

    setupSlider('waveAmplitude', (val) => {
        config.waveAmplitude = parseFloat(val);
    });

    setupSlider('waveSpeed', (val) => {
        config.waveSpeed = parseFloat(val);
    });

    setupSlider('spiralFreq', (val) => {
        config.spiralFreq = parseFloat(val);
    });

    setupSlider('spiralAmp', (val) => {
        config.spiralAmp = parseFloat(val);
    });

    setupSlider('twistStrength', (val) => {
        config.twistStrength = parseFloat(val);
    });

    setupSlider('dnaStrength', (val) => {
        config.dnaStrength = parseFloat(val);
    });

    setupSlider('particleSize', (val) => {
        config.particleSize = parseFloat(val);
    });

    setupSlider('particlePulse', (val) => {
        config.particlePulse = parseFloat(val);
    });

    setupSlider('cameraZ', (val) => {
        config.cameraZ = parseFloat(val);
    });

    setupSlider('fov', (val) => {
        config.fov = parseFloat(val);
    });

    setupSlider('fogDensity', (val) => {
        config.fogDensity = parseFloat(val);
    });

    setupSlider('timeSpeed', (val) => {
        config.timeSpeed = parseFloat(val);
    });

    // 鼠标交互特效控制
    setupCheckbox('enableRepulsion', (val) => {
        config.enableRepulsion = val;
    });

    setupSlider('repulsionStrength', (val) => {
        config.repulsionStrength = parseFloat(val);
    });

    setupSlider('repulsionRange', (val) => {
        config.repulsionRange = parseFloat(val);
    });

    setupCheckbox('enableRipple', (val) => {
        config.enableRipple = val;
    });

    setupSlider('rippleStrength', (val) => {
        config.rippleStrength = parseFloat(val);
    });

    setupSlider('rippleSpeed', (val) => {
        config.rippleSpeed = parseFloat(val);
    });

    setupSlider('rippleDecay', (val) => {
        config.rippleDecay = parseFloat(val);
    });

    setupCheckbox('enableInfection', (val) => {
        config.enableInfection = val;
    });

    setupColorPicker('infectionColor', (val) => {
        config.infectionColor = new THREE.Color(val);
    });

    setupSlider('infectionIntensity', (val) => {
        config.infectionIntensity = parseFloat(val);
    });

    setupSlider('infectionRange', (val) => {
        config.infectionRange = parseFloat(val);
    });

    setupCheckbox('enableDOF', (val) => {
        config.enableDOF = val;
    });

    setupSlider('focusDistance', (val) => {
        config.focusDistance = parseFloat(val);
    });

    setupSlider('dofRange', (val) => {
        config.dofRange = parseFloat(val);
    });

    setupSlider('blurStrength', (val) => {
        config.blurStrength = parseFloat(val);
    });

    setupCheckbox('enableReflection', (val) => {
        config.enableReflection = val;
    });

    setupSlider('reflectionIntensity', (val) => {
        config.reflectionIntensity = parseFloat(val);
    });

    setupSlider('refractionIndex', (val) => {
        config.refractionIndex = parseFloat(val);
    });
}

/**
 * 辅助函数：设置滑块
 */
function setupSlider(id, callback) {
    const slider = document.getElementById(id);
    const valueDisplay = document.getElementById(id + '-value');

    slider.addEventListener('input', (e) => {
        const val = e.target.value;
        callback(val);

        const step = parseFloat(slider.step);
        if (step >= 1) {
            valueDisplay.textContent = parseInt(val);
        } else if (step >= 0.1) {
            valueDisplay.textContent = parseFloat(val).toFixed(1);
        } else if (step >= 0.01) {
            valueDisplay.textContent = parseFloat(val).toFixed(2);
        } else if (step >= 0.001) {
            valueDisplay.textContent = parseFloat(val).toFixed(3);
        } else {
            valueDisplay.textContent = parseFloat(val).toFixed(4);
        }
    });
}

/**
 * 辅助函数：设置颜色选择器
 */
function setupColorPicker(id, callback) {
    const picker = document.getElementById(id);
    picker.addEventListener('input', (e) => {
        callback(e.target.value);
    });
}

/**
 * 辅助函数：设置复选框
 */
function setupCheckbox(id, callback) {
    const checkbox = document.getElementById(id);
    checkbox.addEventListener('change', (e) => {
        callback(e.target.checked);
    });
}
