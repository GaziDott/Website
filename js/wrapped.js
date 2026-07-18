/* ========================================
   Gazi DOTT Wrapped — horizontal gallery
   ======================================== */

(function () {
    function initWrappedCarousel() {
        const carousel = document.getElementById('wrapped-carousel');
        if (!carousel || carousel.dataset.initialized === 'true') return;

        const section = carousel.closest('.wrapped-section');
        const slides = Array.from(carousel.querySelectorAll('.wrapped-slide'));
        const previousButton = document.getElementById('wrapped-prev');
        const nextButton = document.getElementById('wrapped-next');
        const counter = document.getElementById('wrapped-counter');
        const progressItems = Array.from(document.querySelectorAll('.wrapped-progress button'));
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (!slides.length || !previousButton || !nextButton || !counter) return;

        let activeIndex = 0;
        let scrollFrame = null;
        let targetIndex = null;
        let sectionInView = false;

        function getSlidePosition(index) {
            return slides[index].offsetLeft - slides[0].offsetLeft;
        }

        function updateState(index) {
            activeIndex = Math.max(0, Math.min(index, slides.length - 1));
            counter.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
            previousButton.disabled = activeIndex === 0;
            nextButton.disabled = activeIndex === slides.length - 1;

            progressItems.forEach((item, itemIndex) => {
                const isActive = itemIndex === activeIndex;
                item.classList.toggle('is-active', isActive);
                if (isActive) {
                    item.setAttribute('aria-current', 'true');
                } else {
                    item.removeAttribute('aria-current');
                }
            });
        }

        function findClosestSlide() {
            if (targetIndex !== null) {
                const targetPosition = getSlidePosition(targetIndex);
                if (Math.abs(carousel.scrollLeft - targetPosition) <= 2) {
                    const settledIndex = targetIndex;
                    targetIndex = null;
                    updateState(settledIndex);
                }
                return;
            }

            let closestIndex = 0;
            let closestDistance = Number.POSITIVE_INFINITY;

            slides.forEach((slide, index) => {
                const distance = Math.abs(carousel.scrollLeft - getSlidePosition(index));
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            updateState(closestIndex);
        }

        function goToSlide(index) {
            const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
            targetIndex = nextIndex;
            carousel.scrollTo({
                left: getSlidePosition(nextIndex),
                behavior: reducedMotion.matches ? 'auto' : 'smooth'
            });
            updateState(nextIndex);
        }

        previousButton.addEventListener('click', () => goToSlide(activeIndex - 1));
        nextButton.addEventListener('click', () => goToSlide(activeIndex + 1));
        progressItems.forEach((item, index) => {
            item.addEventListener('click', () => goToSlide(index));
        });

        document.addEventListener('keydown', event => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

            const target = event.target;
            const isEditing = target instanceof HTMLElement && (
                target.isContentEditable ||
                ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
            );
            if (isEditing) return;

            const focusInsideSection = section?.contains(document.activeElement);
            if (!sectionInView && !focusInsideSection) return;

            event.preventDefault();
            goToSlide(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
        });

        carousel.addEventListener('scroll', () => {
            if (scrollFrame) cancelAnimationFrame(scrollFrame);
            scrollFrame = requestAnimationFrame(findClosestSlide);
        }, { passive: true });

        carousel.addEventListener('pointerdown', () => {
            targetIndex = null;
        }, { passive: true });

        carousel.addEventListener('wheel', () => {
            targetIndex = null;
        }, { passive: true });

        if ('ResizeObserver' in window) {
            new ResizeObserver(findClosestSlide).observe(carousel);
        }

        if (section && 'IntersectionObserver' in window) {
            new IntersectionObserver(entries => {
                sectionInView = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.35;
            }, { threshold: [0, 0.35] }).observe(section);
        }

        carousel.dataset.initialized = 'true';
        updateState(0);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWrappedCarousel);
    } else {
        initWrappedCarousel();
    }
})();
