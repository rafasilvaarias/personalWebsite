<script lang="ts">
    import { onMount, tick } from 'svelte';

    interface Props {
        fishCount?: number;          // normal fish (the big one is added on top)
        fishScaleMin?: number;
        fishScaleMax?: number;
        bigFishScale?: number;
        speedMin?: number;           // px per second
        speedMax?: number;
        fishWobbleDegrees?: number;         // eyes / fin details (cut-out look)
        idPrefix?: string;
    }

    let {
        fishCount = 5,
        fishScaleMin = 1.2,
        fishScaleMax = 1.4,
        bigFishScale = 1.8,
        speedMin = 25,
        speedMax = 60,
        fishWobbleDegrees = 5,
        idPrefix = 'fishSwim'
    }: Props = $props();

    // #region size (fills the parent, which needs position: relative)
    let W = $state(0);
    let H = $state(0);
    let root = $state<HTMLElement>();
    let visible = $state(true);

    const pad = 40; // fish travel this far past each edge before wrapping
    // #endregion

    // #region fish
    interface Fish {
        u: number;          // start position along the lane (0..1 of the travel span)
        yf: number;         // vertical position (0..1 of the height)
        speed: number;      // px per second
        dir: 1 | -1;        // 1 = right, -1 = left
        s: number;
        symbol: 'fish1' | 'fish2';
        wobDuration: number;
        wobDelay: number;
    }

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    // random values are created on mount so server and client markup match
    let fish = $state.raw<Fish[]>([]);

    // Per-frame state is deliberately NOT reactive: transforms are written directly.
    let fishEls: (SVGGElement | undefined)[] = [];
    let elapsed = 0; // seconds

    function fishTransform(f: Fish, t: number) {
        const span = W + pad * 2;
        const raw = f.u * span + f.dir * f.speed * t;
        const x = ((raw % span) + span) % span - pad;
        const y = f.yf * H;
        // the artwork faces left, so flip it when swimming right
        return `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${(-f.dir * f.s).toFixed(2)} ${f.s.toFixed(2)})`;
    }

    function updateFish(t: number) {
        for (let i = 0; i < fish.length; i++) {
            fishEls[i]?.setAttribute('transform', fishTransform(fish[i], t));
        }
    }

    // Re-place the fish when they're created or the size changes
    // (also covers prefers-reduced-motion, where the loop never runs).
    $effect(() => {
        void W; void H;
        if (!fish.length) return;
        tick().then(() => updateFish(elapsed));
    });

    onMount(() => {
        const total = fishCount + 1;
        const bigIndex = Math.floor(Math.random() * total);

        fish = Array.from({ length: total }, (_, i) => {
            const isBig = i === bigIndex;
            return {
                u: Math.random(),
                // spread evenly over the height, with a little jitter
                yf: Math.min(0.9, Math.max(0.1, (i + 0.5) / total + rand(-0.04, 0.04))),
                speed: rand(speedMin, speedMax) * (isBig ? 0.7 : 1),
                dir: i % 2 ? 1 : -1,   // alternate, so both directions are always present
                s: isBig ? bigFishScale : rand(fishScaleMin, fishScaleMax),
                symbol: isBig ? 'fish1' : 'fish2',
                wobDuration: rand(1.2, 2.2),
                wobDelay: -rand(0, 2)
            };
        });

        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (still) return;

        let raf = 0;
        let last = 0;
        const frame = (now: number) => {
            elapsed += (now - last) / 1000;
            last = now;
            updateFish(elapsed);
            raf = requestAnimationFrame(frame);
        };

        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            cancelAnimationFrame(raf);
            if (visible) {
                last = performance.now();
                raf = requestAnimationFrame(frame);
            }
        });
        if (root) io.observe(root);

        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
        };
    });
    // #endregion
</script>

<div
    class="fishSwim"
    class:paused={!visible}
    bind:this={root}
    bind:clientWidth={W}
    bind:clientHeight={H}
    style="--wobble-deg: {fishWobbleDegrees}deg"
>
    {#if W > 0 && H > 0}
        <svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
                <symbol id="{idPrefix}-fish1" overflow="visible">
                    <g transform="translate(-16 -16)" fill="none">
                        <path d="M8.03321 8.50012H17.9585C17.985 8.50012 18.0104 8.48959 18.0292 8.47083L18.9706 7.52941C18.9893 7.51066 18.9999 7.48522 18.9999 7.4587V6.00012V3.04154C18.9999 3.01502 19.0104 2.98959 19.0292 2.97083L19.9999 2.00012L20.9706 1.02941C20.9893 1.01066 21.0148 1.00012 21.0413 1.00012H23.3999C23.4551 1.00012 23.4999 1.0449 23.4999 1.10012V1.9587C23.4999 1.98522 23.5104 2.01066 23.5292 2.02941L24.4706 2.97083C24.4893 2.98959 24.4999 3.01502 24.4999 3.04154V9.00012V9.90012C24.4999 9.95535 24.5447 10.0001 24.5999 10.0001H25.9585C25.985 10.0001 26.0104 10.0107 26.0292 10.0294L29.9706 13.9708C29.9893 13.9896 29.9999 14.015 29.9999 14.0415V19.9587C29.9999 19.9852 29.9893 20.0107 29.9706 20.0294L26.0292 23.9708C26.0104 23.9896 25.985 24.0001 25.9585 24.0001H23.0999C23.0447 24.0001 22.9999 24.0449 22.9999 24.1001V28.9587C22.9999 28.9852 22.9893 29.0107 22.9706 29.0294L21.9999 30.0001L21.0292 30.9708C21.0104 30.9896 20.985 31.0001 20.9585 31.0001H19.0413C19.0148 31.0001 18.9893 30.9896 18.9706 30.9708L18.0292 30.0294C18.0104 30.0107 17.9999 29.9852 17.9999 29.9587V27.0001V26.0415C17.9999 26.015 17.9893 25.9896 17.9706 25.9708L17.0292 25.0294C17.0104 25.0107 16.985 25.0001 16.9585 25.0001H8.0413C8.01478 25.0001 7.98934 24.9896 7.97059 24.9708L4.99988 22.0001L3.49988 20.5001L2.02917 19.0294C2.01042 19.0107 1.99988 18.9852 1.99988 18.9587V18.0001V11.0415C1.99988 11.015 2.01041 10.9896 2.02917 10.9708L2.97059 10.0294C2.98934 10.0107 3.01478 10.0001 3.0413 10.0001H5.96655C5.98818 10.0001 6.00924 9.99311 6.02655 9.98012L7.97321 8.52012C7.99052 8.50714 8.01158 8.50012 8.03321 8.50012Z" class="body" />
                        <path d="M5 13.5V14.4C5 14.4552 5.04477 14.5 5.1 14.5H6.9C6.95523 14.5 7 14.4552 7 14.4V13.5V13.1C7 13.0448 6.95523 13 6.9 13H6.02361C6.00808 13 5.99277 13.0036 5.97889 13.0106L5 13.5ZM7 13.5H5" class="detail" />
                        <path d="M10.0279 16.721L11.1721 15.529C11.19 15.5104 11.2 15.4856 11.2 15.4598V14.2902C11.2 14.2644 11.21 14.2396 11.2279 14.221L12.3705 13.0307C12.3893 13.0111 12.4154 13 12.4426 13H13.5574C13.5846 13 13.6107 13.0111 13.6295 13.0307L15.9721 15.471C15.99 15.4896 16 15.5144 16 15.5402V16.7098C16 16.7356 15.99 16.7604 15.9721 16.779L14.8295 17.9693C14.8107 17.9889 14.7846 18 14.7574 18H10.1C10.0448 18 10 17.9552 10 17.9V16.7902C10 16.7644 10.01 16.7396 10.0279 16.721Z" class="detail" />
                    </g>
                </symbol>

                <symbol id="{idPrefix}-fish2" overflow="visible">
                    <g transform="translate(-16 -16)" fill="none">
                        <path d="M2 18.9586V17V13.0414C2 13.0149 2.01054 12.9895 2.02929 12.9707L3 12L5 10L6.97071 8.02929C6.98947 8.01054 7.0149 8 7.04142 8H14H15.9586C15.9851 8 16.0105 8.01054 16.0293 8.02929L18 10L19 11L19.9707 11.9707C19.9895 11.9895 20.0149 12 20.0414 12H20.9586C20.9851 12 21.0105 12.0105 21.0293 12.0293L21.9707 12.9707C21.9895 12.9895 22.0149 13 22.0414 13H23.9586C23.9851 13 24.0105 12.9895 24.0293 12.9707L24.9707 12.0293C24.9895 12.0105 25 11.9851 25 11.9586V11.0414C25 11.0149 25.0105 10.9895 25.0293 10.9707L26.9707 9.02929C26.9895 9.01054 27.0149 9 27.0414 9H28.9586C28.9851 9 29.0105 9.01054 29.0293 9.02929L29.9707 9.97071C29.9895 9.98947 30 10.0149 30 10.0414V14.9586C30 14.9851 29.9895 15.0105 29.9707 15.0293L29.0293 15.9707C29.0105 15.9895 29 16.0149 29 16.0414V24.9586C29 24.9851 28.9895 25.0105 28.9707 25.0293L28.0293 25.9707C28.0105 25.9895 27.9851 26 27.9586 26H27H26.1C26.0448 26 26 25.9552 26 25.9V25.0414C26 25.0149 25.9895 24.9895 25.9707 24.9707L24.0293 23.0293C24.0105 23.0105 24 22.9851 24 22.9586V21.0414C24 21.0149 23.9895 20.9895 23.9707 20.9707L23.0293 20.0293C23.0105 20.0105 23 19.9851 23 19.9586V19.1C23 19.0448 22.9552 19 22.9 19H22.0414C22.0149 19 21.9895 19.0105 21.9707 19.0293L20.0293 20.9707C20.0105 20.9895 19.9851 21 19.9586 21H19.0414C19.0149 21 18.9895 21.0105 18.9707 21.0293L17 23L16.0293 23.9707C16.0105 23.9895 15.9851 24 15.9586 24H14H11H7.04142C7.0149 24 6.98947 23.9895 6.97071 23.9707L6 23L3 20L2.02929 19.0293C2.01054 19.0105 2 18.9851 2 18.9586Z" class="body" />
                        <path d="M6.97071 12.0293L6.02929 12.9707C6.01054 12.9895 6 13.0149 6 13.0414V13.9586C6 13.9851 6.01054 14.0105 6.02929 14.0293L6.97071 14.9707C6.98947 14.9895 7.0149 15 7.04142 15H7.95858C7.9851 15 8.01054 14.9895 8.02929 14.9707L8.97071 14.0293C8.98947 14.0105 9 13.9851 9 13.9586V13.0414C9 13.0149 8.98947 12.9895 8.97071 12.9707L8.02929 12.0293C8.01054 12.0105 7.9851 12 7.95858 12H7.04142C7.0149 12 6.98947 12.0105 6.97071 12.0293Z" class="detail" />
                    </g>
                </symbol>
            </defs>

            <!-- each fish's outer <g> transform is written imperatively in updateFish() -->
            {#each fish as f, i}
                <g bind:this={fishEls[i]}>
                    <g class="wobble" style="--w: {f.wobDuration.toFixed(2)}s; animation-delay: {f.wobDelay.toFixed(2)}s">
                        <use href="#{idPrefix}-{f.symbol}" />
                    </g>
                </g>
            {/each}
        </svg>
    {/if}
</div>

<style>
    .fishSwim {
        position: absolute; 
        width: 100svw;
        height: 100%;
        top: 0px;
        left: calc(-1 * var(--marS));  /* sits on top of the phrase; parent must be position: relative */
        z-index: 2;
        overflow: hidden;
        pointer-events: none;
    }

    svg {
        display: block;
        width: 100%;
        height: 100%;
    }

    .wobble {
        animation: wobble var(--w) ease-in-out infinite;
    }

    .body {
        fill: var(--prWhite);
        stroke: var(--prBlack);
        stroke-width: 1.5;
        vector-effect: non-scaling-stroke; /* keeps the line weight the same on the big fish */
    }

    .detail {
        fill: none;
        stroke: var(--prBlack);
        stroke-width: 1.5;
        vector-effect: non-scaling-stroke;
    }

    @keyframes wobble {
        0%, 100% { transform: rotate(calc(var(--wobble-deg, 5deg) * -1)); }
        50%      { transform: rotate(var(--wobble-deg, 5deg)); }
    }

    .paused .wobble {
        animation-play-state: paused;
    }

    @media (prefers-reduced-motion: reduce) {
        .wobble {
            animation-play-state: paused;
        }
    }
</style>