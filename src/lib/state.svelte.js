import { browser } from '$app/environment';

export const ui = $state({
	isMobile: false,
	isTablet: false,
	isDesktop: true,
	introComplete: false
});

if (browser) {
    const mobileMq = window.matchMedia('(max-width: 55rem)');
    const tabletMq = window.matchMedia('(min-width: 55.001rem) and (max-width: 68rem)');
    const desktopMq = window.matchMedia('(min-width: 68.001rem)');

    const update = () => {
        ui.isMobile = mobileMq.matches;
        ui.isTablet = tabletMq.matches;
        ui.isDesktop = desktopMq.matches;
    };

    update(); // runs once at import time, before any component renders
    mobileMq.addEventListener('change', update);
    tabletMq.addEventListener('change', update);
    desktopMq.addEventListener('change', update);
}