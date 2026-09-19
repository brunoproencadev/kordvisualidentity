// 1. Background Orbs Animation
        gsap.to(".orb-1", { x: "20vw", y: "10vh", duration: 15, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to(".orb-2", { x: "-15vw", y: "-20vh", duration: 18, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to(".mascot-float", { y: -15, duration: 2.5, ease: "sine.inOut", yoyo: true, repeat: -1 });

        // 2. SHADER E DISTORÇÃO MAGNÉTICA DE TEXTO
        const cursorGlow = document.getElementById('cursorGlow');
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let orbX = mouseX;
        let orbY = mouseY;

        // Atualiza posição real do mouse
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Loop principal de renderização (Smooth Follow + Text Distortion)
        function renderOrb() {
            orbX += (mouseX - orbX) * 0.12;
            orbY += (mouseY - orbY) * 0.12;
            cursorGlow.style.transform = `translate(${orbX}px, ${orbY}px)`;

            // Efeito Magnético
            const distortTargets = document.querySelectorAll('.slide.active .distort-target');

            distortTargets.forEach(el => {
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const distX = mouseX - centerX;
                const distY = mouseY - centerY;
                const distance = Math.sqrt(distX * distX + distY * distY);

                if (distance < 200) {
                    const intensity = (200 - distance) / 200;

                    gsap.to(el, {
                        x: (distX * -0.05) * intensity,
                        y: (distY * -0.05) * intensity,
                        scale: 1 + (0.04 * intensity),
                        skewX: (distX * 0.015) * intensity,