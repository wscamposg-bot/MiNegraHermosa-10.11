// Inicialización, persistencia y efectos de la experiencia.
(() => {
    const STORAGE_KEY = "historia-sideral-progress";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const welcome = document.getElementById("welcome-screen");
    const game = document.getElementById("game-screen");
    const final = document.getElementById("final-screen");
    const content = document.getElementById("level-content");
    const feedback = document.getElementById("feedback");
    const progressFill = document.getElementById("progress-fill");
    const progressBar = document.querySelector(".progress-track");
    const lockCounter = document.getElementById("lock-counter");
    const progressPercent = document.getElementById("progress-percent");
    const lockRow = document.getElementById("lock-row");
    const gallery = document.getElementById("photo-gallery");
    let currentLevel = 0;
    let unlocked = 0;
    let activePhoto = 0;
    let letterTimer = null;
    let touchStartX = 0;
    let transitioning = false;

    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        if (saved && Number.isInteger(saved.unlocked) && saved.unlocked >= 0 && saved.unlocked <= LEVELS.length) {
            unlocked = saved.unlocked;
        }
    } catch (error) {
        console.warn("No se pudo recuperar el progreso guardado.", error);
    }

    lockRow.innerHTML = LEVELS.map((_, index) => `<span class="lock-icon${index < unlocked ? " unlocked" : ""}" aria-hidden="true">${index < unlocked ? "🔓" : "🔒"}</span>`).join("");
    updateProgress();
    setupBackground();
    setupImageFallbacks();
    setupGallery();
    setupInteractions();

    function saveProgress() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ unlocked }));
        } catch (error) {
            console.warn("No se pudo guardar el progreso.", error);
        }
    }

    function updateProgress() {
        const complete = Math.min(unlocked, LEVELS.length);
        const percent = Math.round((complete / LEVELS.length) * 100);
        progressFill.style.width = `${Math.max(percent, complete ? percent : 12.5)}%`;
        progressBar.setAttribute("aria-valuenow", String(complete));
        progressPercent.textContent = `${percent}%`;
        lockCounter.textContent = `Candado ${Math.min(currentLevel + 1, LEVELS.length)} de ${LEVELS.length}`;
        lockRow.querySelectorAll(".lock-icon").forEach((icon, index) => {
            const isUnlocked = index < unlocked;
            icon.textContent = isUnlocked ? "🔓" : "🔒";
            icon.classList.toggle("unlocked", isUnlocked);
        });
    }

    function showGame() {
        welcome.hidden = true;
        final.hidden = true;
        game.hidden = false;
        transitioning = false;
        currentLevel = Math.min(unlocked, LEVELS.length - 1);
        renderCurrentLevel();
        updateProgress();
    }

    function renderCurrentLevel() {
        content.classList.remove("level-exit", "level-enter");
        void content.offsetWidth;
        feedback.textContent = "";
        feedback.classList.remove("visible");
        renderLevel(currentLevel, { submit: handleAnswer });
        content.classList.add("level-enter");
        updateProgress();
    }

    function handleAnswer(value, button) {
        if (transitioning) return;
        if (!checkAnswer(LEVELS[currentLevel], value)) {
            feedback.textContent = LEVELS[currentLevel].hint;
            feedback.classList.remove("visible");
            void feedback.offsetWidth;
            feedback.classList.add("visible");
            const card = document.querySelector(".story-card");
            card.classList.remove("shake");
            void card.offsetWidth;
            card.classList.add("shake");
            if (button && button.classList.contains("option-button")) {
                document.querySelectorAll(".option-button").forEach((option) => option.classList.remove("selected"));
                button.classList.add("selected");
            }
            return;
        }

        if (button) button.classList.add("selected");
        transitioning = true;
        content.querySelectorAll("button, input").forEach((control) => { control.disabled = true; });
        unlocked = Math.max(unlocked, currentLevel + 1);
        saveProgress();
        updateProgress();
        flashSuccess();
        if (currentLevel === LEVELS.length - 1) {
            window.setTimeout(showFinal, reducedMotion ? 50 : 580);
            return;
        }

        content.classList.remove("level-exit");
        void content.offsetWidth;
        content.classList.add("level-exit");
        window.setTimeout(() => {
            currentLevel += 1;
            transitioning = false;
            renderCurrentLevel();
        }, reducedMotion ? 50 : 220);
    }

    function flashSuccess() {
        const flash = document.createElement("div");
        flash.className = "success-flash";
        document.body.append(flash);
        window.setTimeout(() => flash.remove(), 600);
        if (window.confetti && !reducedMotion) {
            window.confetti({ particleCount: 22, spread: 54, startVelocity: 20, origin: { y: .65 }, colors: ["#a855f7", "#e9d5ff", "#c084fc"] });
        }
    }

    function showFinal() {
        game.hidden = true;
        welcome.hidden = true;
        final.hidden = false;
        final.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
        startLetter();
        if (window.confetti && !reducedMotion) {
            window.confetti({ particleCount: 180, spread: 80, origin: { y: .62 }, colors: ["#a855f7", "#e9d5ff", "#c084fc", "#d8b4fe"] });
            let bursts = 0;
            const rain = window.setInterval(() => {
                window.confetti({ particleCount: 8, angle: 90, spread: 48, startVelocity: 20, origin: { x: Math.random(), y: .2 }, colors: ["#a855f7", "#e9d5ff", "#c084fc"] });
                bursts += 1;
                if (bursts >= 6) window.clearInterval(rain);
            }, 550);
        }
        updateCountdown();
    }

    function startLetter() {
        const target = document.getElementById("letter-text");
        const skip = document.getElementById("skip-letter");
        window.clearInterval(letterTimer);
        target.textContent = "";
        if (reducedMotion) {
            target.textContent = LETTER_TEXT;
            skip.hidden = true;
            return;
        }
        skip.hidden = false;
        let index = 0;
        letterTimer = window.setInterval(() => {
            target.textContent += LETTER_TEXT[index];
            index += 1;
            if (index >= LETTER_TEXT.length) {
                window.clearInterval(letterTimer);
                skip.hidden = true;
            }
        }, 24);
    }

    function updateCountdown() {
        const distance = Math.max(0, CONCERT_DATE.getTime() - Date.now());
        const days = Math.floor(distance / 86400000);
        const hours = Math.floor((distance % 86400000) / 3600000);
        const minutes = Math.floor((distance % 3600000) / 60000);
        const seconds = Math.floor((distance % 60000) / 1000);
        document.getElementById("days").textContent = String(days).padStart(3, "0");
        document.getElementById("hours").textContent = String(hours).padStart(2, "0");
        document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
        document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
    }

    function setupGallery() {
        GALLERY_PHOTOS.forEach((photo, index) => {
            const card = document.createElement("figure");
            card.className = "photo-card";
            card.tabIndex = 0;
            card.setAttribute("role", "button");
            card.setAttribute("aria-label", `Ampliar foto: ${photo.caption}`);
            card.style.transitionDelay = `${(index % 4) * 70}ms`;
            const wrap = document.createElement("div");
            wrap.className = "photo-image-wrap";
            wrap.dataset.placeholder = "💜";
            const image = document.createElement("img");
            image.src = photo.src;
            image.alt = photo.alt;
            image.loading = "lazy";
            image.addEventListener("error", () => image.classList.add("image-failed"));
            wrap.append(image);
            const caption = document.createElement("figcaption");
            caption.textContent = photo.caption;
            card.append(wrap, caption);
            card.addEventListener("click", () => openLightbox(index));
            card.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openLightbox(index);
                }
            });
            gallery.append(card);
        });

        const cards = gallery.querySelectorAll(".photo-card");
        if ("IntersectionObserver" in window && !reducedMotion) {
            const observer = new IntersectionObserver((entries, instance) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        instance.unobserve(entry.target);
                    }
                });
            }, { threshold: .12 });
            cards.forEach((card) => observer.observe(card));
        } else {
            cards.forEach((card) => card.classList.add("is-visible"));
        }
    }

    function openLightbox(index) {
        activePhoto = index;
        updateLightbox();
        document.getElementById("lightbox").hidden = false;
        document.body.style.overflow = "hidden";
        document.getElementById("lightbox-close").focus();
    }

    function updateLightbox() {
        const photo = GALLERY_PHOTOS[activePhoto];
        const image = document.getElementById("lightbox-image");
        image.classList.remove("image-failed");
        image.src = photo.src;
        image.alt = photo.alt;
        image.onerror = () => image.classList.add("image-failed");
        document.getElementById("lightbox-caption").textContent = photo.caption;
    }

    function closeLightbox() {
        document.getElementById("lightbox").hidden = true;
        document.body.style.overflow = "";
    }

    function moveLightbox(direction) {
        activePhoto = (activePhoto + direction + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length;
        updateLightbox();
    }

    function setupImageFallbacks() {
        document.querySelectorAll(".ticket-image-wrap img, .ticket-qr-wrap img").forEach((image) => {
            const hideIfMissing = () => {
                const fallback = image.dataset.fallback;
                if (fallback && !image.dataset.fallbackTried) {
                    image.dataset.fallbackTried = "true";
                    image.src = fallback;
                } else {
                    image.classList.add("image-failed");
                }
            };
            image.addEventListener("error", hideIfMissing);
            if (image.complete && image.naturalWidth === 0) hideIfMissing();
        });
    }

    function setupInteractions() {
        document.getElementById("start-button").addEventListener("click", showGame);
        document.getElementById("reset-button").addEventListener("click", () => {
            unlocked = 0;
            currentLevel = 0;
            transitioning = false;
            saveProgress();
            final.hidden = true;
            game.hidden = true;
            welcome.hidden = false;
            updateProgress();
            window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
        });
        document.getElementById("skip-letter").addEventListener("click", () => {
            window.clearInterval(letterTimer);
            document.getElementById("letter-text").textContent = LETTER_TEXT;
            document.getElementById("skip-letter").hidden = true;
        });
        document.getElementById("repeat-confetti").addEventListener("click", () => {
            if (window.confetti) window.confetti({ particleCount: 180, spread: 80, origin: { y: .62 }, colors: ["#a855f7", "#e9d5ff", "#c084fc", "#d8b4fe"] });
        });
        document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
        document.getElementById("lightbox-prev").addEventListener("click", () => moveLightbox(-1));
        document.getElementById("lightbox-next").addEventListener("click", () => moveLightbox(1));
        document.getElementById("lightbox").addEventListener("click", (event) => {
            if (event.target.id === "lightbox") closeLightbox();
        });
        document.addEventListener("keydown", (event) => {
            const lightbox = document.getElementById("lightbox");
            if (lightbox.hidden) return;
            if (event.key === "Escape") closeLightbox();
            if (event.key === "ArrowLeft") moveLightbox(-1);
            if (event.key === "ArrowRight") moveLightbox(1);
        });
        document.getElementById("lightbox").addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
        document.getElementById("lightbox").addEventListener("touchend", (event) => {
            const delta = event.changedTouches[0].screenX - touchStartX;
            if (Math.abs(delta) > 45) moveLightbox(delta < 0 ? 1 : -1);
        }, { passive: true });
        const ticket = document.getElementById("concert-ticket");
        ticket.addEventListener("pointermove", (event) => {
            if (reducedMotion || event.pointerType === "touch") return;
            const rect = event.currentTarget.getBoundingClientRect();
            const rotateY = ((event.clientX - rect.left) / rect.width - .5) * 5;
            const rotateX = ((event.clientY - rect.top) / rect.height - .5) * -4;
            event.currentTarget.style.setProperty("--ticket-rotate-x", `${rotateX}deg`);
            event.currentTarget.style.setProperty("--ticket-rotate-z", `${rotateY * .25}deg`);
        });
        ticket.addEventListener("pointerleave", (event) => {
            event.currentTarget.style.removeProperty("--ticket-rotate-x");
            event.currentTarget.style.removeProperty("--ticket-rotate-z");
        });
        ticket.addEventListener("pointerup", (event) => {
            if (event.pointerType !== "touch") return;
            const flipped = ticket.classList.toggle("is-flipped");
            ticket.setAttribute("aria-pressed", String(flipped));
        });
        ticket.addEventListener("keydown", (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            const flipped = ticket.classList.toggle("is-flipped");
            ticket.setAttribute("aria-pressed", String(flipped));
        });
        document.addEventListener("click", (event) => {
            const button = event.target.closest(".button");
            if (!button || reducedMotion) return;
            const rect = button.getBoundingClientRect();
            const ripple = document.createElement("span");
            ripple.className = "ripple";
            ripple.style.left = `${event.clientX - rect.left}px`;
            ripple.style.top = `${event.clientY - rect.top}px`;
            button.append(ripple);
            window.setTimeout(() => ripple.remove(), 650);
        });
        window.setInterval(updateCountdown, 1000);
    }

    function setupBackground() {
        const canvas = document.getElementById("starfield");
        const context = canvas.getContext("2d");
        if (!context || reducedMotion) return;
        let width = 0;
        let height = 0;
        let stars = [];
        let pointerX = 0;
        let pointerY = 0;
        let shootingStar = null;
        let lastShootingStar = performance.now();
        let frame = 0;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            const count = Math.min(290, Math.max(200, Math.round(width * height / 4600)));
            stars = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.1 + .25,
                phase: Math.random() * Math.PI * 2,
                speed: Math.random() * .018 + .005,
                alpha: Math.random() * .55 + .22
            }));
        }

        function draw(now) {
            frame = requestAnimationFrame(draw);
            context.clearRect(0, 0, width, height);
            stars.forEach((star) => {
                const twinkle = .65 + Math.sin(now * star.speed + star.phase) * .35;
                const x = star.x + pointerX * (star.radius * 2.5);
                const y = star.y + pointerY * (star.radius * 2.5);
                context.beginPath();
                context.arc(x, y, star.radius, 0, Math.PI * 2);
                context.fillStyle = `rgba(233, 213, 255, ${star.alpha * twinkle})`;
                context.fill();
            });
            if (!shootingStar && now - lastShootingStar > 5000 + Math.random() * 3000) {
                shootingStar = { x: Math.random() * width * .7, y: Math.random() * height * .38, age: 0, length: 75 + Math.random() * 70 };
            }
            if (shootingStar) {
                shootingStar.age += 1;
                const x = shootingStar.x + shootingStar.age * 5;
                const y = shootingStar.y + shootingStar.age * 2.2;
                const gradient = context.createLinearGradient(x, y, x - shootingStar.length, y - shootingStar.length * .42);
                gradient.addColorStop(0, "rgba(233, 213, 255, .75)");
                gradient.addColorStop(1, "rgba(168, 85, 247, 0)");
                context.beginPath();
                context.moveTo(x, y);
                context.lineTo(x - shootingStar.length, y - shootingStar.length * .42);
                context.strokeStyle = gradient;
                context.lineWidth = 1.3;
                context.stroke();
                if (shootingStar.age > 35) {
                    shootingStar = null;
                    lastShootingStar = now;
                }
            }
        }

        resize();
        frame = requestAnimationFrame(draw);
        window.addEventListener("resize", resize, { passive: true });
        window.addEventListener("pointermove", (event) => {
            pointerX = (event.clientX / Math.max(width, 1) - .5) * 2;
            pointerY = (event.clientY / Math.max(height, 1) - .5) * 2;
        }, { passive: true });
        window.addEventListener("deviceorientation", (event) => {
            pointerX = Math.max(-1, Math.min(1, (event.gamma || 0) / 35));
            pointerY = Math.max(-1, Math.min(1, (event.beta || 0) / 55));
        }, { passive: true });
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) cancelAnimationFrame(frame);
            else frame = requestAnimationFrame(draw);
        });
        createAmbientParticles();
    }

    function createAmbientParticles() {
        const host = document.getElementById("ambient-particles");
        const symbols = ["✦", "·", "♡"];
        const addParticle = () => {
            if (document.hidden) return;
            const particle = document.createElement("span");
            particle.className = "ambient-particle";
            particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.setProperty("--duration", `${11 + Math.random() * 8}s`);
            particle.style.setProperty("--drift", `${Math.random() * 70 - 35}px`);
            particle.style.fontSize = `${9 + Math.random() * 11}px`;
            host.append(particle);
            window.setTimeout(() => particle.remove(), 20000);
        };
        for (let index = 0; index < 9; index += 1) window.setTimeout(addParticle, index * 1100);
        window.setInterval(addParticle, 1700);
    }
})();
