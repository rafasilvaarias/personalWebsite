<script lang="ts">
	//import favicon from '$lib/assets/icon.ico';

	import icon0 from '$lib/assets/icon0.ico';
	import icon1 from '$lib/assets/icon1.ico';
	import icon2 from '$lib/assets/icon2.ico';
	import icon3 from '$lib/assets/icon3.ico';
	import icon4 from '$lib/assets/icon4.ico';

	const icons = [icon0, icon1, icon2, icon3, icon4];
	let iconIndex = $state(0);
	let iconRef = $derived(icons[iconIndex]);

	import '$lib/global.css';

	import { onMount } from 'svelte';
	import { ui } from '$lib/state.svelte.js';

	onMount(() => {
		const mq = window.matchMedia('(max-width: 55rem)');
		ui.isMobile = mq.matches;
		mq.addEventListener('change', (e) => ui.isMobile = e.matches);

		const id = setInterval(() => {
			if (iconIndex == 4) iconIndex = 0;
			else iconIndex += 1;
		}, 416);
	});

	let { children } = $props();
</script>

<svelte:head>
	<title>Rafa Silva Arias</title>
	<link rel="icon" href={iconRef} />
</svelte:head>

{@render children()}

{#if ui.introComplete}

<hr/> 
<footer>
	<div id="backToTop" class="black">
		<button onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
			<img src="/icons/blueArrowTop.svg" alt="arrow pointing up" />
			<p class="textCenter">back to top</p>
		</button>
	</div>
	<div id="linkList">
		<nav>
			<ul>
				<li><a id="homeLink" href="/"><img src="/icons/blueArrowLeft.svg" alt="arrow pointing left"/>Home</a></li>
				<li><a href="/#projects"><img src="/icons/blueArrowLeft.svg" alt="arrow pointing left"/>Projects (Selected)</a></li>
				<li><a href="/project/mastersDissertation" class="indented"><img src="/icons/blueArrowLeft.svg" alt="arrow pointing left"/>Master's Dissertation</a></li>
				<li><a href="/project/shiftAPPens" class="indented"><img src="/icons/blueArrowLeft.svg" alt="arrow pointing left"/>Shift APPens</a></li>
				<li><a href="/project/rese" class="indented"><img src="/icons/blueArrowLeft.svg" alt="arrow pointing left"/>RESE</a></li>
				<li><a href="/project/festaDasLatas" class="indented"><img src="/icons/blueArrowLeft.svg" alt="arrow pointing left"/>Festa das Latas</a></li>
				<li><a href="/about"><img src="/icons/blueArrowLeft.svg" alt="arrow pointing left"/>About</a></li>
			</ul>
		</nav>
		<ul id="externalLinks">
			<li><a id="CVLink" href="/CV.pdf" class="resize"><img src="/icons/blueArrowLeft.svg" alt="arrow pointing left"/>CV</a></li>
			<li><a href="mailto:arias.rafael@outlook.pt" class="resize"><img src="/icons/blueArrowLeft.svg" alt="arrow pointing left"/>Email</a></li>
			<li><a href="https://www.linkedin.com/in/rafasilvaarias/" target="_blank" class="resize"><img src="/icons/blueArrowLeft.svg" alt="arrow pointing left"/>LinkedIn</a></li>
			<li><a href="https://github.com/rafasilvaarias" target="_blank" class="resize"><img src="/icons/blueArrowLeft.svg" alt="arrow pointing left"/>GitHub</a></li>
			<li><a href="https://www.instagram.com/rafasilvaarias/" target="_blank" class="resize"><img src="/icons/blueArrowLeft.svg" alt="arrow pointing left"/>Instagram</a></li>
		</ul>
	</div>
</footer>

{/if}


<style>
	footer {
		margin: 0;
        width: 100%;
        min-height: 100svh;
		background: radial-gradient(ellipse 100svw 100svh at bottom, var(--prYellow) 0%, transparent 100%);
		padding: var(--marS);

		display:flex;
		justify-content: space-between;
		flex-direction: column;

		> #backToTop {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 0.5rem;
			justify-content: center;
			margin-bottom: var(--marM);

			> button {
				display: flex;
				flex-direction: row;
				align-items: center;
				gap: 0.5rem;
				transform: translateX(-0.65rem);
				transition: all var(--quickTransition) ease-in-out;

				> img {
					opacity: 0;
					transform: rotate(15deg);
					transition: all var(--quickTransition) ease-in-out;
				}
			}

			> button:hover {
				transform: translateX(0);
				> img {
					opacity: 1;
					transform: rotate(0deg);
				}
			}
		}
			

		> #linkList {
			display: flex;
			flex-direction: row;
			gap: var(--marS);
			align-items: flex-end;
			height: 100%;

			ul{
				display: flex;
				flex-direction: column;
				

				> li {
					height: 1.85rem;

					

					a{
						display: flex;
						flex-direction: row;
						align-items: center;
						gap: 0.5rem;
						transform: translateX(-1.25rem);
						transition: all var(--quickTransition) ease-in-out;
						
						img{
							opacity: 0;
							transform: rotate(165deg);
							transition: all var(--quickTransition) ease-in-out;
						}
					}

					a:hover{
						transform: translateX(0rem);
						img{
							opacity: 1;
							transform: rotate(180deg);
						}
					}

					.indented {
						margin-left: 1.25rem;
					}

					#homeLink { img{
							transform: rotate(15deg);
					}}

					#homeLink:hover { img{
							transform: rotate(0deg);
					}}
				}

			}

			#externalLinks { 
				li{ 
					a{ 
						img{
							transform: rotate(150deg);
						}
					}

					#CVLink { 
						img{
							transform: rotate(-75deg);
						}
					}
				}
			}

			#externalLinks { 
				li{ 
					a:hover{ 
						img{
							transform: rotate(135deg);
						}
					}

					#CVLink:hover{ 
						img{
							transform: rotate(-90deg);
						}
					}
				}
			}

			> nav, > ul {
				width: var(--gridSize);
			}
		}
	}

	@media (max-width: 55rem) {
		footer {
			> #linkList {
				gap: var(--marS);
				flex-direction: column;
				justify-content: end;
				> nav, > ul {
					width: 100%;
				}
			}
		}
	}
</style>
