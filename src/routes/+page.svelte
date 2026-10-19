<script module lang="ts">
    let introPlayed = false;
</script>

<script lang="ts">
    import { ui } from '$lib/state.svelte.js';
    import { onMount } from 'svelte';
    import FishAnimation from '$lib/components/fishAnimation.svelte';
    import LinkRow from '$lib/components/linkRow.svelte';
    import RevealText from '$lib/components/revealText.svelte';

    // #region Projects
    const projects = [
        {
            name: "Master's Dissertation",
            link: '/project/mastersDissertation',
            characteristics: ['Web Development', 'Music Artwork'],
            year: "2026",
            phrase: "Making generative music run and distribute on the web",
            photo: '/projects/content/mdBanner.jpg',
        },
        {
            name: 'Shift APPens',
            link: '/project/shiftAPPens',
            characteristics: ['Visual Identity', 'Web Development', 'Design Tool Development'],
            year: "2025/2026",
            phrase: "How coding a design tool defined a visual identity",
            photo: '/projects/content/saBanner.jpg',
            photoSize: [-40, -30, 60]
        },
        {
            name: "RESE",
            link: '/project/rese',
            characteristics: ['Service Design', 'Web Development', 'Visual Identity'],
            year: "2024/2025",
            phrase: "Solving the workflow of a ~60 people online radio station",
            photo: '/projects/content/reseFestR.jpg',
            photoSize: [-170, -10, 35]
        },
        {
            name: 'Festa das Latas',
            link: '/project/festaDasLatas',
            characteristics: ['Visual Identity'],
            year: "2024",
            phrase: "A 30€ budget visual identity for a 25000 people festival",
            photo: '/projects/content/flBanner.jpg',
            photoSize: [-90, 10, 60]
        },
    ];

    // Stable arrays, so RevealText doesn't see a new `texts` on every render
    const projectNames = projects.map((p) => p.name);
    const projectPhrases = projects.map((p) => p.phrase);

    const extras = [
        {
            name: "Essay colla voce: Where Afro-Surrealism Meets Music",
            link: "https://stylorevistaea.wordpress.com/rafa-arias/"
        },
        {
            name: "Podcast Como Calha [PT]",
            link: "https://www.youtube.com/@ComoCalha"
        }
    ]

    let scrollY = $state(0);
    let innerHeight = $state(0);

    let sectionEl = $state<HTMLElement>();
    let sectionTop = $state(0);
    let scrollLength = $state(0);

    $effect(() => {
        if (!sectionEl) return;
        sectionTop = sectionEl.getBoundingClientRect().top + window.scrollY;
        scrollLength = sectionEl.offsetHeight - innerHeight; // re-runs on resize
    });

    let activeIndex = $derived(
        scrollY < sectionTop || scrollLength <= 0
            ? 0
            : Math.min(
                Math.floor((scrollY - sectionTop) / (scrollLength / projects.length)),
                projects.length - 1
            )
    );
    let projectProgress = $derived(
        scrollY < sectionTop || scrollLength <= 0
            ? 0
            : Math.min(
                (scrollY - sectionTop) / (scrollLength / projects.length),
                projects.length
            )
    );
    let slotProgress = $derived(Math.min(projectProgress - activeIndex, 1));

    // The projects block pins to the top at scrollY === sectionTop, which is
    // the moment the phrase is fully in view. Latches: never goes back to 0.
    let phraseEl = $state<HTMLElement>();
    let revealed = $state(false);

    $effect(() => {
        if (!phraseEl) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    revealed = true;
                    io.disconnect(); // latches, only the first time
                }
            },
            { threshold: 1 }
        );
        io.observe(phraseEl);
        return () => io.disconnect();
    });

    let shouldScroll = $state(false);

    $effect(() => {
        if (stage === 8 && shouldScroll) {
            ui.introComplete = true;
            window.scrollTo({ top: 40, behavior: 'smooth' });
            shouldScroll = false;
        }
    });

    // 0 = hidden, otherwise 1-based project number
    let projectSlot = $derived(revealed ? activeIndex + 1 : 0);

    
	// #region Intro
	// 0 idle · 1 Hi! · 2 icon · 3 wiggle
	// 4 name appears · 5 greeting exits · 6 collapse + token/role
	// 7 done

	// 0 idle · 1 Hi! · 2 icon · 3 wiggle · 4 name
    // 5 greeting exits · 6 swap + width transition
    // 7 reveal trail · 8 done

    let stage = $state(introPlayed ? 8 : 0);

    const EXIT_MS = 300;
    const COLLAPSE_MS = 250;

    const timeline: [number, number][] = [
        [100, 1],
        [100, 2],
        [200, 3],
        [200, 4],
        [700, 5],
        [EXIT_MS, 6],
        [COLLAPSE_MS, 7],
        [300, 8],
    ];

    const hiActive = $derived(stage >= 5 ? 0 : stage >= 1 ? 1 : 0);
    const iconActive = $derived(stage >= 5 ? 0 : stage >= 2 ? 1 : 0);
    const imActive = $derived(stage >= 5 ? 0 : stage >= 4 ? 1 : 0);
    const nameActive = $derived(stage >= 4 ? 1 : 0);
    const trailActive = $derived(stage >= 7 ? 1 : 0);

    let leadW = $state(0);
    let trailW = $state(0);

    const iconSize = $derived(
        ui.isDesktop ? 'iconSize3'
            : ui.isTablet ? 'iconSize2'
            : 'iconSize15'
    );

    const leadWidth = $derived(
        stage >= 6 ? '0px' : leadW ? `${leadW}px` : 'auto'
    );

    const trailWidth = $derived(
        stage >= 8 ? 'auto' : stage >= 6 ? `${trailW}px` : '0px'
    );

	onMount(() => {

        history.scrollRestoration = 'manual';

        const resetScroll = () => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        };

        resetScroll();
        window.addEventListener('pageshow', resetScroll);

        requestAnimationFrame(resetScroll);

		if (stage === 8) {
            ui.introComplete = true;
            return;
        }

		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			introPlayed = true;
            stage = 8;
            ui.introComplete = true;
            return;
		}
        shouldScroll = true;
		introPlayed = true;
		let cancelled = false;

		// Prevent scrolling while the intro plays.
		const block = (e: Event) => e.preventDefault();

		window.addEventListener('wheel', block, { passive: false });
		window.addEventListener('touchmove', block, { passive: false });

		const unlock = () => {
			window.removeEventListener('wheel', block);
			window.removeEventListener('touchmove', block);
		};

		(async () => {
			for (const [wait, next] of timeline) {
				await new Promise((resolve) => setTimeout(resolve, wait));

				if (cancelled) return;

				stage = next;
			}

			unlock();
			ui.introComplete = true;
		})();

		return () => {
			cancelled = true;
			unlock();
			ui.introComplete = true;
		};
	});
	// #endregion
</script>

<svelte:window bind:scrollY bind:innerHeight />

<main>
    <div id="intro">
        <p class="introLine {ui.isDesktop ? 'tSize3' : ui.isTablet ? 'tSize2' : 'tSize15'} serif textCenter">
            <span class="collapse" style:width={leadWidth}>
                <span class="collapseInner lead" bind:clientWidth={leadW}>
                    <RevealText tag="span" duration={600} active={hiActive}>Hi!</RevealText>
                    <RevealText tag="span" duration={600} active={iconActive}>
                        <img
                            class={iconSize}
                            class:wiggle={stage >= 3 && stage < 5}
                            src="/icons/handPalm.svg"
                            alt=""
                            aria-hidden="true"
                        />
                    </RevealText>
                    <RevealText duration={600} tag="span" active={imActive}>I'm</RevealText>
                </span>
            </span>

            <RevealText duration={600} tag="span" active={nameActive} delay={100}>
                Rafa Silva Arias
            </RevealText>

            {#if stage >= 6}
                <span class="collapse" class:settled={stage >= 8} style:width={trailWidth}>
                    <span class="collapseInner trail" bind:clientWidth={trailW}>
                        <RevealText duration={600} tag="span" active={trailActive}>
                            <img class={iconSize} id="token" src="/photos/token.webp" alt="gold token animation" />
                        </RevealText>
                        <RevealText duration={600} tag="span" class="sans" active={trailActive} delay={100}>
                            {ui.isMobile ? '' : 'Web '}Designer/Developer
                        </RevealText>
                    </span>
                </span>
            {/if}
        </p>
    </div>

    <div id="slideIn">
        <hr id="topLine"/>
        <div id="phrase" class="mbS">
            <RevealText>
                <p class="{ui.isDesktop ? "tSize4" : "tSize3"} textLeft">
                    Creative work comes from
                    <img class="{ui.isDesktop ? "iconSize4" : "iconSize3"}" src="/icons/book.svg" alt="" aria-hidden="true" />
                    <a href="https://en.wikipedia.org/wiki/Catching_the_Big_Fish" target="_blank" class="underline">diving</a> in one's pool of ideas.
                    My desire is an ever-expanding pool, with room to dive into any discipline.
                    Like Brian Jones, <a href="/about" class="underline">I</a>
                    <img class="{ui.isDesktop ? "iconSize4" : "iconSize3"}" src="/icons/I.svg" alt="" aria-hidden="true" />
                    was born to swim.
                </p>
            </RevealText>
            <FishAnimation/>
        </div>

        <div id="projectsWrapper" class="{ui.isMobile ? "mbM" : "mbL" }" bind:this={sectionEl}>
            <div id="projects">
                <div id="projectsL" class="{ui.isMobile ? "" : ui.isTablet ? "gridW g2" : "gridW g3"}">
                    <div>
                        <RevealText tag="h1" class="projectsHeading tSize1 {ui.isMobile ? "" : "mbXXS"}" delay={75} active={revealed ? 1 : 0}>Selected Projects</RevealText>
                        <RevealText tag="h2" class="projectsName {ui.isMobile ? "mbXXS tSize15" : "mbXS tSize2"}" delay={150} texts={projectNames} active={projectSlot} />
                    </div>
                    {#each projects as project, i}
                        <img  src={project.photo} alt="" aria-hidden="true" class:active={i === activeIndex}>
                    {/each}
                </div>
                <div id="projectsR" class="{ui.isMobile ? "" : ui.isTablet ? "gridW g1" : "gridW g2"}">
                    <div bind:this={phraseEl}>
                        <RevealText class="{!ui.isDesktop ? "tSize2" : "tSize3"}" texts={projectPhrases} active={projectSlot} />
                    </div>
                    <LinkRow text="See Project" link={projects[activeIndex].link} width={ui.isMobile ? undefined : 1} progress={slotProgress} />
                </div>
            </div>
        </div>

        <div id="extras" class="mbL">
            <h1 class="{ui.isMobile ? "tSize2" : "tSize3"} mbXS hideOnDesktop">Extras</h1>
            <hr />
            <div>
                <h1 class="tSize2 serif mtXXS hideOnMobile">Extras</h1>
                <div id="extrasLinks">
                    {#each extras as extra}
                        <LinkRow text={extra.name} link={extra.link} width={ui.isDesktop ? 3 : ui.isTablet ? 2 : ui.isMobile ? undefined : undefined} resize={true} />
                    {/each}
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
    }

    .introLine img.wiggle {
        animation: wiggle 600ms ease-out;
    }

    .introLine {
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        margin: 0;
    }

    .introLine :global(.reveal) {
        flex: none;
    }

    /* the width animation that makes the name slide */
    .collapse {
        display: block;
        flex: none;
        min-width: 0;
        overflow: hidden;
        transition: width 300ms cubic-bezier(0.23, 1, 0.320, 1);
    }

    .collapse.settled {
        transition: none;
    }

    .collapseInner {
        display: flex;
        align-items: center;
        gap: 0.25em;
        width: max-content;
    }

    .collapseInner.lead { padding-right: 0.25em; }
    .collapseInner.trail { padding-left: 0.25em; }

    #intro {
        position: sticky;   /* stays pinned while the slide-in covers it */
        top: 0;
        z-index: 0;
        padding: var(--marB);
        background: radial-gradient(ellipse 100svw 100svh at top, var(--prYellow) 0%, transparent 100%);
        display: inline-flex;
        gap: var(--marXS);
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 100svh;

        > p { z-index: 3; }
    }

    #slideIn {
        filter: drop-shadow(0px -4px 4px rgba(0, 0, 0, 0.05)) drop-shadow(0px -12px 32px rgba(0, 0, 0, 0.05));
        position: relative;
        z-index: 1;
        background-color: var(--prWhite);
        padding: var(--marB);   /* the only padding now */

        #topLine {
            position: absolute;
            top: 0px;
            left: 0px;
            height: 1px;
            background-color: var(--prBlack3);
        }



        > div {
            width: 100%;
            padding: 0;
        }
    }


    #phrase {
        position: relative;
    }

    #projectsWrapper {
    height: 400svh;
    position: relative;

        #projects {
            position: sticky;
            top: 0;
            height: 100svh;
            padding-block: var(--marS); /* see note below */
            display: flex;
            flex-direction: row;
            gap: var(--marS);

            #projectsL{
                display: flex;
                flex-direction: column;
                gap: var(--marS);

                img {
                    display: none;
                    min-height: 0;
                    object-fit: cover;
                    height: 100%;
                    width: 100%;

                    &.active {
                        display: block;
                    }
                }
            }
            

            #projectsR{
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: var(--marS);
            }
            
        }
    }

    #extras {

        > div {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            #extrasLinks{
                display: flex;
                flex-direction: column;
                align-items: end;
                transform: translateY(calc(-1 * var(--lineThickness)));
            }
            h1 {
                transform: translateY(calc(-1 * var(--lineThickness)));
            }
        }
        
    }

    @media (max-width: 55rem) {

        #projects {
            flex-direction: column !important;
            #projectsL{
                height: 100%;
                gap: var(--marXXS) !important;
            }
        }
    }

    @media (max-width: 62rem) {

    }

    @keyframes slideIn {
        from {
            transform: translate(calc(var(--tx) + 1%), calc(var(--ty) + 1%)) rotate(calc(var(--rot) + 1deg));
            opacity: 0.7;
        }
        to {
            transform: translate(var(--tx), var(--ty)) rotate(var(--rot));
            opacity: 1;
        }
    }

    @keyframes pointHint {
        from {
            transform: translateY(1rem);
        }
        to {
            transform: translateY(0rem);
        }
    }

    @keyframes wiggle {
    0%   { transform: rotate(0deg); }
    12.5%  { transform: rotate(20deg); }
    37.5%  { transform: rotate(-20deg); }
    62.5%  { transform: rotate(20deg); }
    87.5%  { transform: rotate(-20deg); }
    99% { transform: rotate(0deg); }
    }
</style>