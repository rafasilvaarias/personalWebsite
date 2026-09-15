<script lang="ts">
    import { disableScrollHandling } from '$app/navigation';
    import { ui } from '$lib/state.svelte.js';
    import {progressChar, getProgressChar} from '$lib/utils';
    import InfinityCircles from './infinityCircles.svelte';
    import { onMount, onDestroy } from 'svelte';
  

    // #region Projects

    let projectsRef = $state<HTMLElement>();
    let projectsTop = $state(0);
    let projectsHeight = $state(0);
    let projectsBottom = $state(0);

    $effect(() => {
        if (projectsRef) projectsTop = projectsRef.offsetTop;
    });
    $effect(() => {
        if (projectsRef) projectsHeight = projectsRef.offsetHeight * (2 / 3);
    });
    $effect(() => {
        projectsBottom = projectsHeight + projectsTop;
    });

    let hoveredProject : null | number = $state(null);
    let progressBar = $state(0);

    $effect(() => {
        hoveredProject = 
        scrollY < projectsTop || projectsHeight <= 0 ?
        null :
        Math.max(0, Math.min(Math.floor(
            (scrollY - projectsTop)
            / (projectsHeight / 4)
        ), projectLinks.length - 1));
    });

    $effect(() => {
        progressBar = 
        scrollY < projectsTop ?
        0 :
        scrollY > projectsBottom ?
        1 :
        ((scrollY - projectsTop)
        % (projectsHeight / progressChar.length)
        / (projectsHeight / progressChar.length));
    });

    const projectLinks = [
        {
            name: "Master's Dissertation",
            link: '/project/mastersDissertation',
            characteristics: ['Web Development', 'Music Artwork'],
            year: "2026",
            phrase: "Making generative music run and distribute on the web",
            photo: '/photos/homepageTokens/mastersDissertationToken.jpg',
            photoSize: [20, 10, 55]
        },
        {
            name: 'Shift APPens',
            link: '/project/shiftAPPens',
            characteristics: ['Visual Identity', 'Web Development', 'Design Tool Development'],
            year: "2025/2026",
            phrase: "How <span class='serif'>coding a design tool </span>defined a visual identity",
            photo: '/photos/homepageTokens/shiftAPPensToken.png',
            photoSize: [-40, -30, 60]
        },
        {
            name: "RESE",
            link: '/project/rese',
            characteristics: ['Service Design','Web Development', 'Visual Identity'],
            year: "2024/2025",
            phrase: "<span class='serif'>Solving the workflow</span> of a ~60 people online radio station",
            photo: '/photos/homepageTokens/reseToken.png',
            photoSize: [-170, -10, 35]
        },
        {
            name: 'Festa das Latas',
            link: '/project/festaDasLatas',
            characteristics: ['Visual Identity'],
            year: "2024",
            phrase: "A <span class='serif'>30€ budget visual identity </span> for a 25000 people festival",
            photo: '/photos/homepageTokens/festaDasLatasToken.png',
            photoSize: [-80, 10, 60]

        },
        
    ];
    onMount(() => {
        projectLinks.forEach(project => {
            const img = new Image();
            img.src = project.photo;
        });
    });  

    // #endregion

    // #region percentual scroll
        let scrollY = $state(0);
        let innerHeight = $state(0);
        let scrollHeight = $state(1); // avoid divide-by-zero on first render

        $effect(() => {
        scrollHeight = document.documentElement.scrollHeight;
        });

        let scrollPercent = $derived(
        scrollHeight > innerHeight ? scrollY / (scrollHeight - innerHeight) : 0
        );
    // #endregion

    // #region intro
    const introPhrases = [
        ["Hi! I'm <span class='serif'>Rafa <br> Silva Arias</span>", "and I'm <br> culturally aware"],
        ["I made <br> this token", "to prove <br> <span class='serif'> I'm tapped in </span>"],
        ["It's this <br> <span class='serif'>neat object</span>", "creating me <br> into <span class='serif'>reality </span>"],
        ["It represents <br> me as a", "Designer <br> Programmer <br> Human"],
        ["<span class='serif'> Rafa <br> Silva <br> Arias </span>", "Designer <br> Programmer <br> Human"]
    ]

    const SEEN_INTRO_KEY = 'seenIntro';
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    function getSeenIntro(): boolean {
        if (typeof localStorage === 'undefined') return false;
        const raw = localStorage.getItem(SEEN_INTRO_KEY);
        if (!raw) return false;

        try {
            const { value, expiresAt } = JSON.parse(raw);
            if (Date.now() > expiresAt) {
                localStorage.removeItem(SEEN_INTRO_KEY);
                return false;
            }
            return value === true;
        } catch {
            localStorage.removeItem(SEEN_INTRO_KEY);
            return false;
        }
    }

    function setSeenIntro() {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem(
            SEEN_INTRO_KEY,
            JSON.stringify({ value: true, expiresAt: Date.now() + THIRTY_DAYS_MS })
        );
    }

    function upIntroIndex() {
        introIndex = Math.max(introIndex - 1, 0);
    }

    function downIntroIndex() {
        introIndex = Math.min(introIndex + 1, 4);
        if (introIndex == 4) {
            setTimeout(() => {
                window.scrollTo({
                    top: 64,
                    behavior: 'smooth'
                });
            }, 500);
        } 
    }

    let introIndex = $state(4);
    let introKey = $state(4);
    let seconds: number = $state(0);

    let introInitialized = $state(false);
    let hasMounted = false;

    onMount(() => {
        if (!getSeenIntro()) {
            introIndex = 0;
            introKey = 0;
        }

        ui.introComplete = introIndex === 4;

        introInitialized = true;
        hasMounted = true;
    });

    $effect(() => {
        ui.introComplete = introIndex === 4;
    });

    $effect(() => {
        seconds = 0;

        if (introIndex === 4) {
            if (!hasMounted) return;

            setSeenIntro();

            return;
        }

        introKey = introIndex;

        const id = setInterval(() => {
            if (seconds >= 3) {
                introIndex += 1;
            } else {
                seconds += 0.2;
            }
        }, 200);

        return () => clearInterval(id);
    });

    // #endregion
</script>

<svelte:window bind:scrollY bind:innerHeight/>

<main>
    <div id="intro">
        {#if introInitialized}
            {#key introIndex}
                <p class="tSize3 textRight appear">{@html introPhrases[introIndex][0]}</p>
            {/key}
            <img id="token" src="/photos/token.webp" alt="gold token animation">
            {#key introKey}
                <p class="tSize3 textLeft appear">{@html introPhrases[introIndex][1]}</p>
            {/key}

            {#if introIndex != 4}
                <div id="introControls">
                    <button aria-label="advance intro" onclick={upIntroIndex}></button>
                    <button aria-label="retreat intro" onclick={downIntroIndex}></button>
                </div>
                <div aria-hidden="true" id="progressBarWrapper" class="appear">
                    {#each Array(introPhrases.length - 1) as _, index}
                        <p aria-hidden="true" class="blue">{introIndex > index ? "█" : introIndex == index ? getProgressChar(seconds/3) : "░"}</p>
                    {/each}
                </div>
            {:else}
                <button id="rewatchIntro" onclick={() => introIndex = 0}>
                    <img src="/icons/blueCurveArrow.svg" alt="arrow pointing left" />
			        <p class="textCenter">rewatch intro</p>
                </button>
            {/if}
        {/if}
    </div>
    {#if introInitialized && introIndex == 4}
        <hr>
        <div id="phrase">
            <img
                style="--tx: 63%; --ty: 80%; --rot: -3deg; --s: 35%; top: calc(50% + {scrollPercent * -15}%);"
                src="/photos/homepagePhrase/fish.jpg" alt="Ocean Sunfish" class="dropShadow help" 
            />
            <img 
                style="--tx: -150%; --ty: -100%; --rot: 5deg; --s: 40%; top: calc(50% + {scrollPercent * -15}%"
                src="/photos/homepagePhrase/scuba.jpg" alt="Scuba Diver" class="dropShadow help" />
            <p class="tSize3 textCenter">Creative work comes from <a href="https://en.wikipedia.org/wiki/Catching_the_Big_Fish" target="_blank" class="serif blue resize"> diving in one's pool of ideas</a>. Like Brian Jones, <a href="/about" class="blue">I</a> was born to swim. </p>
        </div>
        <hr>
        <div id="projectsWrapper" bind:this={projectsRef}>
            <div id="projects">
                <h1 class={ui.isMobile ? "tSize1 textCenter" : "tSize2 serif textCenter"}>Projects (Selected)</h1>
                {#if hoveredProject !== null}
                    <h2 class="tSize2 textCenter hideOnDesktop"><a href={projectLinks[hoveredProject].link}>{projectLinks[hoveredProject].name}</a></h2>
                {/if}
                <div id="projectsList" class="hideOnMobile">
                    <ul>
                        {#each projectLinks as project, index}
                            <li class={hoveredProject === index ? 'hovered' : ''}>
                                <a href={project.link} onmouseenter={() => scrollTo({ top: -1 + projectsTop + (projectsHeight * (index + 1) / 4)})} >
                                    <div class="progressBar" role="progressbar"
                                        aria-valuenow={index === hoveredProject ? progressBar : 0}
                                        aria-valuemin="0" aria-valuemax="100" aria-label="Upload progress">
                                        <span aria-hidden="true" class="blue">
                                            {index === hoveredProject ? getProgressChar(progressBar) : "░░░"}
                                        </span>
                                    </div>
                                    <h2>{project.name}</h2>
                                </a>
                            </li>
                        {/each}
                    </ul>
                    <ul class="black3">
                        {#each hoveredProject !== null ? Array(hoveredProject) : [] as _}
                            <li></li>
                        {/each}
                        {#each hoveredProject !== null ? projectLinks[hoveredProject].characteristics : [] as characteristic}
                            <li>{characteristic}</li>
                        {/each}
                    </ul>
                    <ul class="black3">
                        {#each hoveredProject !== null ? Array(hoveredProject) : [] as _}
                            <li></li>
                        {/each}
                        <li>{hoveredProject !== null ? projectLinks[hoveredProject].year : ''}</li>
                    </ul>
                </div>

                <div id="projectPhrase">
                    {#if hoveredProject !== null}
                        <h3 class={ui.isMobile ? "tSize3" : "tSize4"}><a href={projectLinks[hoveredProject].link}>{@html projectLinks[hoveredProject].phrase}</a></h3>
                    {/if}
                </div>

                <p id="progressBar" class="blue hideOnDesktop">{getProgressChar(progressBar)}</p>

                {#if hoveredProject !== null}
                    {#key hoveredProject}
                        <img 
                            class="dropShadow help"
                            id="projectToken"
                            src={projectLinks[hoveredProject].photo} 
                            alt={projectLinks[hoveredProject].name + " Photo"} 
                            style="--tx: {projectLinks[hoveredProject].photoSize[0] + (Math.random() * 20 - 10)}%; --ty: {(ui.isMobile ? 10 : (projectLinks[hoveredProject].photoSize[1] + (Math.random() * 20 - 10)))}%; --rot: {Math.random() * 30 - 15}deg; width: {projectLinks[hoveredProject].photoSize[2]}%; height: {projectLinks[hoveredProject].photoSize[2]}%"
                        />
                    {/key}
                {/if}
            </div>
        </div>
    {/if}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        gap: 0rem;
    }

    main > div, #projects {
        margin: 0;
        width: 100%;
        height: 100svh;
        padding: var(--marS);
    }

    #intro {
        background: radial-gradient(circle at top, var(--prYellow) 0%, transparent 70%);
        display: inline-flex;
        gap: var(--marM);
        flex-direction: row;
        justify-content: center;
        align-items: center;

        > p{
            width: 100%;
            z-index: 3;
        }

        .appear {
            animation: appear calc(var(--quickTransition)) ease-out;
        }

        #token{
            width: 20rem;
        }


        #introControls{
            position: absolute;
            display: flex;
            width: 100%;
            height: 100svh;
            z-index: 1;
            button{
                cursor:w-resize;
                height: 100%;
                width: 100%;
            }
        }

        #progressBarWrapper{
            position: absolute;
            bottom: var(--marS);
            display: flex;
            width: 100%;
            align-items: baseline;
            justify-content: center;
            gap: 0.5rem;
        }

        #rewatchIntro{
            position: absolute;
            bottom: var(--marS);
            display: flex;
            align-items: baseline;
            justify-content: center;
            gap: 0.5rem;
            transition: all var(--quickTransition) ease-in-out;
            transform: translateX(-1rem);

            img{
                opacity: 0;
                transition: all var(--quickTransition) ease-in-out;
                transform: rotate(30deg);
            }
        }

        #rewatchIntro:hover{
            transform: translateX(0);
            img{ opacity: 1; transform: rotate(0deg);}
            
        }



    }

    #phrase {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        p{
            max-width: 58.43rem;
        }

        img {
            position: absolute;
            top: 50%;
            left: 50%;
            object-fit: cover;
            z-index: 2;
            pointer-events: none;
            transform: translate(var(--tx), var(--ty)) rotate(var(--rot));
            width: var(--s);
            height: var(--s);
            object-fit: contain;
            animation: top var(--quickTransition) ease-in-out;
        }
    }

    #projectsWrapper {
        height: 300svh;
        position: relative;
        padding: 0;
        #projects {
            position: sticky;
            top: 0;
            h1{
                margin-bottom: var(--marS);
            }
            #projectsList {
                display: flex;
                flex-direction: row;
                gap: var(--marS);
                ul {
                    display: flex;
                    flex-direction: column;
                    width: var(--gridSize);
                    > li {
                        height: 1.85rem;
                        > a {
                            height: 1.85rem;
                            padding: 0.25rem 0;
                            width: fit-content;
                            color: var(--prBlack2);
                            display: flex;
                            flex-direction: row;
                            gap: 0.5rem;
                            align-items: center;
                            transform: translateX(-2.65rem);
                            transition: all var(--quickTransition) ease-in-out;
                            > .progressBar {
                                opacity: 0;
                                transition: opacity var(--vQuickTransition) ease-in-out;
                            }
                        }
                        
                    }
                    > li.hovered {
                        > a {
                            color: var(--prBlack);
                            transform: translateX(0);
                            > .progressBar {
                                opacity: 1;
                                transition: opacity var(--vQuickTransition) ease-in-out var(--vQuickTransition);
                            }
                        }
                    }
                }
                
            }
            #projectPhrase {
                width: calc(100% - (2 * var(--marM)));
                max-width: 40rem;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                z-index: 10;
            }

            #projectToken {
                position: absolute;
                top: 50%;
                left: 50%;
                object-fit: cover;
                z-index: 9;
                pointer-events: none;
                transform: translate(var(--tx), var(--ty)) rotate(var(--rot));
                animation: slideIn 0.2s ease-out;
                object-fit: contain;
            }

            #progressBar {
                position: absolute;
                bottom: calc(0px + var(--marM));
                top: auto;
                left: 50%;
                transform: translate(-50%, 0);
                text-align: center;
                z-index: 11;
            }
            
        }
    }

    @media (min-width: 55rem) {
        @media (max-height: 42rem) {
            #projectsWrapper{
                #projects{
                    #projectPhrase {
                        position: absolute;
                        bottom: calc(0px + var(--marM));
                        top: auto;
                        left: 50%;
                        transform: translate(-50%, 0);
                        text-align: center;
                        z-index: 10;
                    }
                }
            }
        }
    }

    @media (max-width: 62rem) {
        #intro {
            flex-direction: column;
            p {
                text-align: center;
                z-index: 1000;
            }

            #token{
                width: 15rem;
            }
        }
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

    @keyframes appear {
        from {
            transform: translateY(-0.25rem);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
</style>