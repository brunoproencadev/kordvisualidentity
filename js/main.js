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
                        textShadow: `0px ${8 * intensity}px ${15 * intensity}px rgba(30, 96, 242, ${0.3 * intensity})`,
                        duration: 0.3,
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                } else {
                    if (el._gsap && (el._gsap.x !== 0 || el._gsap.scale !== 1)) {
                        gsap.to(el, {
                            x: 0, y: 0, scale: 1, skewX: 0, textShadow: "none",
                            duration: 0.6, ease: "power2.out", overwrite: "auto"
                        });
                    }
                }
            });

            requestAnimationFrame(renderOrb);
        }
        renderOrb();

        // 3. SLIDER LOGIC
        const slides = document.querySelectorAll('.slide');
        const dotsContainer = document.getElementById('dotsContainer');
        const btnPrev = document.getElementById('btnPrev');
        const btnNext = document.getElementById('btnNext');
        let currentSlide = 0;
        let isAnimating = false;

        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.onclick = () => goToSlide(i);
            dotsContainer.appendChild(dot);
        });
        const dots = document.querySelectorAll('.dot');

        gsap.from(".anim-hero", { y: 60, opacity: 0, duration: 1.2, stagger: 0.15, ease: "expo.out", delay: 0.2 });

        window.goToSlide = function (targetIndex) {
            if (isAnimating || currentSlide === targetIndex) return;
            if (targetIndex < 0 || targetIndex >= slides.length) return;

            isAnimating = true;
            const current = slides[currentSlide];
            const next = slides[targetIndex];
            const isForward = targetIndex > currentSlide;

            gsap.to(current.querySelectorAll('.distort-target'), { x: 0, y: 0, scale: 1, skewX: 0, textShadow: "none", duration: 0.2 });

            gsap.to(current.querySelectorAll('.anim-hero, .anim-el'), {
                y: isForward ? -40 : 40, opacity: 0, duration: 0.45, stagger: 0.03, ease: "power2.in",
                onComplete: () => {
                    current.classList.remove('active');
                    gsap.set(current.querySelectorAll('.anim-hero, .anim-el'), { clearProps: "all" });
                }
            });

            setTimeout(() => {
                next.classList.add('active');
                next.scrollTop = 0;

                gsap.fromTo(next.querySelectorAll('.anim-hero, .anim-el'),
                    { y: isForward ? 60 : -60, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: "expo.out", onComplete: () => {
                            isAnimating = false;
                        }
                    }
                );

                dots[currentSlide].classList.remove('active');
                currentSlide = targetIndex;
                dots[currentSlide].classList.add('active');

                btnPrev.disabled = currentSlide === 0;
                btnNext.disabled = currentSlide === slides.length - 1;

            }, 400);
        }

        function changeSlide(direction) { goToSlide(currentSlide + direction); }

        btnPrev.disabled = true;

        // 4. SUPORTE A TECLADO & MOUSEWHEEL
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') changeSlide(1);
            if (e.key === 'ArrowLeft') changeSlide(-1);
        });

        window.addEventListener('wheel', (e) => {
            const currentSlideEl = slides[currentSlide];
            const isScrollable = currentSlideEl.scrollHeight > currentSlideEl.clientHeight + 2;

            if (isScrollable) {
                const atTop = currentSlideEl.scrollTop === 0;
                const atBottom = Math.abs(currentSlideEl.scrollHeight - currentSlideEl.scrollTop - currentSlideEl.clientHeight) < 2;
                if (e.deltaY > 0 && !atBottom) return;
                if (e.deltaY < 0 && !atTop) return;
            }

            if (Math.abs(e.deltaY) > 40 && !isAnimating) {
                if (e.deltaY > 0) changeSlide(1);
                else changeSlide(-1);
            }
        });