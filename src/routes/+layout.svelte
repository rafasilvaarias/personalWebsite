<script lang="ts">

	import BoxButton from '$lib/components/boxButton.svelte';
	import LinkRow from '$lib/components/linkRow.svelte';
	
	//favicon
	import icon0 from '$lib/assets/icon0.ico';
	import icon1 from '$lib/assets/icon1.ico';
	import icon2 from '$lib/assets/icon2.ico';
	import icon3 from '$lib/assets/icon3.ico';
	import icon4 from '$lib/assets/icon4.ico';

	const icons = [icon0, icon1, icon2, icon3, icon4];
	let iconIndex = $state(0);
	let iconRef = $derived(icons[iconIndex]);

	import '$lib/global.css';

	//ui variables
	import { onMount } from 'svelte';
	import { ui } from '$lib/state.svelte.js';

	onMount(() => {
		const id = setInterval(() => {
			iconIndex = (iconIndex + 1) % icons.length;
		}, 416);

		return () => clearInterval(id);
	});

	//go to top button

	let launching = $state(false);

	function goTop(): void {
		if (launching) return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		return;
		}

		launching = true;
	}

	function onAnimationEnd(e: AnimationEvent): void {
		if (!e.animationName.endsWith('chargeUp')) return;
		window.scrollTo({ top: 0, behavior: 'smooth' });
		launching = false;
	}

	//footerBlur

	let footerEl: HTMLElement | undefined = $state();
	let contentH = $state(0);
	let winH = $state(0);
	let progress = $state(0);
	let eased = $derived(progress ** 3); // ease-in cubic

	const MAX_BLUR = 15;
	const START_INSET = 0.5;

	let blur = $derived(eased * MAX_BLUR);
	let inset = $derived((1 - eased) * START_INSET);

	function updateBlur(): void {
		if (!footerEl) return;
		const rect = footerEl.getBoundingClientRect();
		const covered = window.innerHeight - rect.top;
		progress = Math.min(1, Math.max(0, covered / rect.height));
	}

	// sticky offset: pin the *bottom* of the content to the bottom of the viewport
	let stickyTop = $derived(Math.min(0, winH - contentH));

	let { children } = $props();
</script>

<svelte:head>
	<title>Rafa Silva Arias</title>
	<link rel="icon" href={iconRef} />
</svelte:head>

<svelte:window bind:innerHeight={winH} onscroll={updateBlur} onresize={updateBlur} />

<div class="wrap">
	<div
		class="content"
		bind:clientHeight={contentH}
		style:top="{stickyTop}px"
		style:filter="blur({blur}px)"
	>
		{@render children()}
	</div>

	<footer
		bind:this={footerEl}
		style:margin-inline="calc(var(--marB) + {inset}rem)"
	>
		<nav>
			{#if ui.isDesktop}
				<div>
					<button
						id="goTop"
						class:launching
						onclick={goTop}
						onanimationend={onAnimationEnd}
						aria-label="go to top of the page"
						>
						<img alt="handUp" class="iconSize3" src="/icons/handUp.svg" />
					</button>
					<BoxButton text={"Home"} link={"/"}  />
				</div>
				<div>	
					<h3 class="tSize1">Projects</h3>
					<BoxButton text={"Master's Dissertation"} link={"/project/mastersDissertation"} />
					<BoxButton text={"Shift APPens"} link={"/project/shiftAPPens"} />
					<BoxButton text={"RESE"} link={"/project/rese"}  />
					<BoxButton text={"Festa das Latas"} link={"/project/festaDasLatas"} />
				</div>
				<div>
					<BoxButton text={"About"} link={"/about"}  />
				</div>
			{:else}
				<button
					id="goTop"
					class:launching
					class="mbXS"
					onclick={goTop}
					onanimationend={onAnimationEnd}
					aria-label="go to top of the page"
					>
					<img alt="handUp" class="iconSize3" src="/icons/handUp.svg" />
				</button>
				<LinkRow text={"Home"} link={"/"}/>
				<LinkRow text={"Master's Dissertation"} link={"/project/mastersDissertation"}/>
				<LinkRow text={"Shift APPens"} link={"/project/shiftAPPens"}/>
				<LinkRow text={"RESE"} link={"/project/rese"}/>
				<LinkRow text={"Festa das Latas"} link={"/project/festaDasLatas"}/>
				<LinkRow text={"About"} link={"/about"}/>
			{/if}
		</nav>
		<div id="links">
			{#if ui.isDesktop}
				<div>
					<BoxButton text={"Email"} link={"mailto:arias.rafael@outlook.pt"}  resize />
				</div>
				<div>	
					<h3 class="tSize1">Social</h3>
					<BoxButton text={"LinkedIn"} link={"https://www.linkedin.com/in/rafasilvaarias/"}  resize />
					<BoxButton text={"Instagram"} link={"https://www.instagram.com/rafasilvaarias/"}  resize />
					<BoxButton text={"Github"} link={"https://github.com/rafasilvaarias"}  resize />
				</div>
				<div>
					<BoxButton text={"CV"} link={"/CV.pdf"}  resize />
				</div>
			{:else}
				<a class="tSize1 underline resize" href="mailto:arias.rafael@outlook.pt">Email</a>
				<a class="tSize1 underline resize" href="https://www.linkedin.com/in/rafasilvaarias/">LinkedIn</a>
				<a class="tSize1 underline resize" href="https://www.instagram.com/rafasilvaarias/">Instagram</a>
				<a class="tSize1 underline resize" href="https://github.com/rafasilvaarias">Github</a>
				<a class="tSize1 underline resize" href="/CV.pdf">CV</a>
			{/if}
		</div>
	</footer>
</div>

<style>
	#goTop:hover {
		animation: wiggle 0.3s linear infinite;
	}

  /* must come after :hover and be at least as specific */
	#goTop.launching,
	#goTop.launching:hover {
		animation: chargeUp 0.6s cubic-bezier(0.23, 1, 0.320, 1) forwards;
	}

	@keyframes chargeUp {
		0%   { transform: translateY(0); }
		22%   { transform: translateY(-3px); }
		88%  { transform: translateY(12px) rotate(5deg); }   /* slowly crouch down */
		100% { transform: translateY(-6px) rotate(0); }   /* spring up a bit past the start */
	}

	nav, #links{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
		align-items: center;
		div{
			display: flex;
			justify-content: center;
			align-items: center;
			gap: var(--marXS);
		}
	}

	.wrap {
		position: relative;
		display: flow-root;
	}

	.content {
		position: sticky;
		z-index: 0;
		will-change: filter;
	}

	footer{
		position: relative;
		z-index: 1;
		background: var(--prWhite);
		height: calc(100svh - (2* var(--marB)));
		max-height: 29rem;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin: var(--marB);
		padding: var(--marXS);
		border: var(--lineThickness) solid var(--prBlack);
	}

	@media (max-width: 68rem) {
		footer{
			height: fit-content;
			max-height: none;
			gap: var(--marM);
		}

		nav, #links{
			flex-direction: column;
			justify-content:center;
		}

		nav{
			align-items:center;
		}

		#links{
			align-items:start;
		}
	}
</style>
