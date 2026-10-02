import { animate, hover, inView, press, stagger } from 'framer-motion';

/**
 * Animaciones globales con Framer Motion (API vanilla, sin hidratar islas de React).
 *
 * Atributos soportados (en cualquier .astro):
 * - data-motion="page"     → entrada de la página (fade + slide).
 * - data-motion="reveal"   → aparece al entrar en pantalla. Opciones: data-motion-from="up|down|left|right|scale"
 *                            y data-motion-delay="0.2" (segundos).
 * - data-motion="float"    → flotación infinita suave (hero).
 * - data-motion-stagger    → contenedor cuyos [data-motion-item] aparecen en cascada al entrar en pantalla.
 * - data-motion-tap        → micro-interacción hover/press en botones.
 *
 * El estado inicial oculto vive en default.css (solo con JS y sin prefers-reduced-motion).
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const OFFSET = 28;

const handled = new WeakSet<Element>();
let cleanups: Array<() => void> = [];

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function hiddenState(from: string | undefined): Record<string, number> {
	switch (from) {
		case 'down':
			return { opacity: 0, y: -OFFSET };
		case 'left':
			return { opacity: 0, x: -OFFSET };
		case 'right':
			return { opacity: 0, x: OFFSET };
		case 'scale':
			return { opacity: 0, scale: 0.9 };
		default:
			return { opacity: 0, y: OFFSET };
	}
}

const visibleState = { opacity: 1, x: 0, y: 0, scale: 1 };

// Al terminar, se devuelve el control al CSS (hover, filtros, etc.) quitando los estilos inline de Framer Motion.
function finish(...els: HTMLElement[]) {
	els.forEach((el) => {
		el.setAttribute('data-motion-done', '');
		el.style.removeProperty('opacity');
		el.style.removeProperty('transform');
	});
}

function once(el: Element): boolean {
	if (handled.has(el)) return false;
	handled.add(el);
	return true;
}

function initPage() {
	document.querySelectorAll<HTMLElement>('[data-motion="page"]').forEach((el) => {
		if (!once(el)) return;
		animate(el, { opacity: [0, 1], y: [14, 0] }, { duration: 0.5, ease: EASE }).then(() => finish(el));
	});
}

function initReveal() {
	document.querySelectorAll<HTMLElement>('[data-motion="reveal"]').forEach((el) => {
		if (!once(el)) return;
		const from = hiddenState(el.dataset.motionFrom);
		const delay = Number(el.dataset.motionDelay ?? 0);
		animate(el, from, { duration: 0 });
		const stop = inView(
			el,
			() => {
				animate(el, visibleState, { duration: 0.7, delay, ease: EASE }).then(() => finish(el));
			},
			{ amount: 0.15, margin: '0px 0px -8% 0px' }
		);
		cleanups.push(stop);
	});
}

function initStagger() {
	document.querySelectorAll<HTMLElement>('[data-motion-stagger]').forEach((container) => {
		if (!once(container)) return;
		const items = Array.from(container.querySelectorAll<HTMLElement>('[data-motion-item]'));
		if (!items.length) return;
		const gap = Number(container.dataset.motionStagger) || 0.07;
		const from = hiddenState(container.dataset.motionFrom);
		animate(items, from, { duration: 0 });
		const stop = inView(
			container,
			() => {
				animate(items, visibleState, { duration: 0.6, delay: stagger(gap), ease: EASE }).then(() =>
					finish(...items)
				);
			},
			{ amount: 0.1, margin: '0px 0px -5% 0px' }
		);
		cleanups.push(stop);
	});
}

function initFloat() {
	document.querySelectorAll<HTMLElement>('[data-motion="float"]').forEach((el) => {
		if (!once(el)) return;
		const controls = animate(el, { y: [0, -14, 0] }, { duration: 6, ease: 'easeInOut', repeat: Infinity });
		cleanups.push(() => controls.stop());
	});
}

function initTap() {
	document.querySelectorAll<HTMLElement>('[data-motion-tap]').forEach((el) => {
		if (!once(el)) return;
		const stopHover = hover(el, () => {
			animate(el, { scale: 1.04 }, { type: 'spring', stiffness: 400, damping: 20 });
			return () => animate(el, { scale: 1 }, { type: 'spring', stiffness: 400, damping: 25 });
		});
		const stopPress = press(el, () => {
			animate(el, { scale: 0.95 }, { duration: 0.12 });
			return () => animate(el, { scale: 1 }, { type: 'spring', stiffness: 500, damping: 20 });
		});
		cleanups.push(stopHover, stopPress);
	});
}

function init() {
	// Con movimiento reducido el CSS no oculta nada: no hay nada que animar.
	if (prefersReducedMotion()) return;
	initPage();
	initReveal();
	initStagger();
	initFloat();
	initTap();
}

function teardown() {
	cleanups.forEach((stop) => stop());
	cleanups = [];
}

// ClientRouter dispara astro:page-load en cada navegación; sin él (p. ej. la tarjeta) usamos la carga normal.
document.addEventListener('astro:before-swap', teardown);
document.addEventListener('astro:page-load', init);
if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init, { once: true });
