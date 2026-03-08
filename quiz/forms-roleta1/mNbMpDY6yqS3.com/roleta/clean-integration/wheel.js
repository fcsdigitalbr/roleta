/**
 * Roleta – clean integration (pasta roleta).
 * Giro lento contínuo até o cliente clicar em girar; após clicar, giro realista e resultado = sem prêmio / não deu desta vez.
 */
(function (global) {
    'use strict';

    var SEGMENTS = [
        { id: 0, label: 'BANQUINHA DE 100', color: '#4169E1', angle: 0, prize: 'R$ 100' },
        { id: 1, label: 'ENQUINHO DE 100', color: '#4682B4', angle: 30, prize: 'R$ 100' },
        { id: 2, label: 'Não desses vez', color: '#BA55D3', angle: 60, prize: 'R$ 50' },
        { id: 3, label: 'BANQUINHA DE 100', color: '#FF69B4', angle: 90, prize: 'R$ 100' },
        { id: 4, label: 'Foi quase!', color: '#FF7F50', angle: 120, prize: 'R$ 100' },
        { id: 5, label: 'BANQUINHA DE 100', color: '#FFA500', angle: 150, prize: 'R$ 100' },
        { id: 6, label: 'Sem prêmio', color: '#FFD700', angle: 180, prize: 'Quase lá!' },
        { id: 7, label: 'BANQUINHA DE 100', color: '#FFFF00', angle: 210, prize: 'R$ 100' },
        { id: 8, label: 'BANQUINHA DE 100', color: '#ADFF2F', angle: 240, prize: 'Sem prêmio' },
        { id: 9, label: 'Petição noitou', color: '#3CB371', angle: 270, prize: 'R$ 75' },
        { id: 10, label: 'ENQUINHO DE 100', color: '#008080', angle: 300, prize: 'R$ 100' },
        { id: 11, label: 'Não desses vez', color: '#6495ED', angle: 330, prize: 'R$ 25' }
    ];

    var WHEEL_IMAGE_URL = '../../roleta/download.png';
    var IDLE_SPEED_DEG_PER_MS = 0.02;
    var SPIN_DURATION_MS = 4800;
    var DEG_PER_SEGMENT = 30;

    function getSegmentByRotation(rotation) {
        var normalized = ((rotation % 360) + 360) % 360;
        var index = Math.floor(normalized / DEG_PER_SEGMENT) % 12;
        return SEGMENTS[index] || SEGMENTS[0];
    }

    function isLosingPrize(prize) {
        var p = String(prize || '').toLowerCase();
        return p.indexOf('sem prêmio') !== -1 || p.indexOf('quase lá') !== -1 ||
            p.indexOf('não desses') !== -1 || p.indexOf('foi quase') !== -1;
    }

    var LOSING_SEGMENT_IDS = [];
    for (var i = 0; i < SEGMENTS.length; i++) {
        if (isLosingPrize(SEGMENTS[i].prize)) LOSING_SEGMENT_IDS.push(i);
    }
    if (LOSING_SEGMENT_IDS.length === 0) LOSING_SEGMENT_IDS = [2, 4, 6, 8, 11];

    var rotation = 0;
    var isSpinning = false;
    var idleAnimationId = null;
    var container = null;
    var wheelEl = null;

    function createDOM() {
        if (!container) return;
        container.innerHTML = '';
        container.className = 'roleta-clean-integration';

        var wrap = document.createElement('div');
        wrap.className = 'roleta-clean-wrap';

        var pointer = document.createElement('div');
        pointer.className = 'roleta-clean-pointer';
        pointer.innerHTML = '<div class="roleta-clean-pointer-triangle"></div><div class="roleta-clean-pointer-bar"></div>';
        wrap.appendChild(pointer);

        wheelEl = document.createElement('div');
        wheelEl.className = 'roleta-clean-wheel';
        wheelEl.style.backgroundImage = "url('" + WHEEL_IMAGE_URL + "')";
        wheelEl.style.transform = 'rotate(0deg)';
        wrap.appendChild(wheelEl);

        container.appendChild(wrap);
    }

    function startIdleSpin() {
        if (idleAnimationId !== null || !wheelEl) return;
        var lastTime = Date.now();
        function idleTick() {
            if (isSpinning || !wheelEl) return;
            var now = Date.now();
            var dt = Math.min(now - lastTime, 50);
            lastTime = now;
            rotation += IDLE_SPEED_DEG_PER_MS * dt;
            wheelEl.style.transform = 'rotate(' + rotation + 'deg)';
            idleAnimationId = requestAnimationFrame(idleTick);
        }
        idleAnimationId = requestAnimationFrame(idleTick);
    }

    function stopIdleSpin() {
        if (idleAnimationId !== null) {
            cancelAnimationFrame(idleAnimationId);
            idleAnimationId = null;
        }
    }

    function init(selector) {
        container = typeof selector === 'string' ? document.getElementById(selector) : selector;
        if (!container) return;
        createDOM();
        startIdleSpin();
    }

    function spin(onWin) {
        if (!wheelEl || isSpinning) return;
        stopIdleSpin();
        isSpinning = true;

        var losingIndex = Math.floor(Math.random() * LOSING_SEGMENT_IDS.length);
        var segmentId = LOSING_SEGMENT_IDS[losingIndex];
        var segment = SEGMENTS[segmentId];
        var targetAngle = segment.angle + 15;
        var currentNorm = ((rotation % 360) + 360) % 360;
        var fullRotations = 4 + Math.floor(Math.random() * 3);
        var targetRotation = targetAngle + 360 * fullRotations;

        var startRotation = rotation;
        var startTime = Date.now();

        function animate() {
            var now = Date.now();
            var progress = Math.min((now - startTime) / SPIN_DURATION_MS, 1);
            var easeProgress = 1 - Math.pow(1 - progress, 3);
            rotation = startRotation + (targetRotation - startRotation) * easeProgress;
            wheelEl.style.transform = 'rotate(' + rotation + 'deg)';

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                rotation = targetRotation;
                wheelEl.style.transform = 'rotate(' + rotation + 'deg)';
                isSpinning = false;
                var finalSegment = getSegmentByRotation(rotation);
                var displayLabel = 'Não foi desta vez';
                if (finalSegment) {
                    var p = String(finalSegment.prize || '').toLowerCase();
                    var l = String(finalSegment.label || '').toLowerCase();
                    if (p.indexOf('quase lá') !== -1 || l.indexOf('quase') !== -1) displayLabel = 'Quase...';
                    else if (p.indexOf('sem prêmio') !== -1) displayLabel = 'Sem sorte';
                    else if (p.indexOf('foi quase') !== -1 || l.indexOf('foi quase') !== -1) displayLabel = 'Quase...';
                    else if (p.indexOf('não') !== -1 || l.indexOf('não') !== -1) displayLabel = 'Não foi desta vez';
                }
                var displayPrize = displayLabel;
                if (typeof onWin === 'function') {
                    onWin(finalSegment ? finalSegment.id : 0, displayPrize, displayLabel, true);
                }
            }
        }
        requestAnimationFrame(animate);
    }

    global.RoletaCleanIntegration = {
        init: init,
        spin: spin,
        isSpinning: function () { return isSpinning; },
        SEGMENTS: SEGMENTS,
        isLosingPrize: isLosingPrize
    };
})(typeof window !== 'undefined' ? window : this);
