<script lang="ts">
    import { onMount, type Snippet } from 'svelte';

    type Variant = Snippet | string;

    let {
        children,
        texts,
        active,
        delay = 0,
        tag = 'p',
        stagger = 14,
        duration = 1200,
        threshold = 0.3,
        byLetter = false,   // split into letters instead of words
        class: className = '',
    }: {
        children?: Snippet;
        texts?: Variant[];
        active?: number;
        delay?: number;
        tag?: string;
        stagger?: number;
        duration?: number;
        threshold?: number;
        byLetter?: boolean;
        class?: string;
    } = $props();

    const variants = $derived<Variant[]>(texts ?? (children ? [children] : []));
    const controlled = $derived(active !== undefined);

    let rootEl = $state<HTMLElement>();
    let variantEls = $state<HTMLElement[]>([]);
    let ready = $state(false);
    let reduced = $state(false);
    let seen = $state(false);

    // Which variant is on screen (1-based, 0 = none)
    const current = $derived(controlled ? (active as number) : seen ? 1 : 0);
    // Which variant screen readers get. In uncontrolled mode the text is
    // always readable, even before it has been animated in.
    const readable = $derived(controlled ? (active as number) : 1);

    function makeMask(index: number, decoration: string) {
        const word = document.createElement('span');
        word.className = 'rt-word';
        word.style.setProperty('--i', String(index));
        const inner = document.createElement('span');
        inner.className = 'rt-inner';
        // text-decoration doesn't propagate into inline-block children,
        // so re-apply the parent's (e.g. a link's underline) on the inner span
        if (decoration && decoration !== 'none') inner.style.textDecorationLine = decoration;
        word.append(inner);
        return { word, inner };
    }

    // Splits one variant. The --i counter restarts for every variant,
    // so each text staggers on its own.
    function split(root: HTMLElement) {
        let index = 0;

        const walk = (node: Node, decoration: string) => {
            for (const child of Array.from(node.childNodes)) {
                if (child.nodeType === Node.TEXT_NODE) {
                    const frag = document.createDocumentFragment();
                    let lastInner: HTMLElement | null = null;

                    for (const part of (child.textContent ?? '').split(/(\s+)/)) {
                        if (!part) continue;
                        if (/^\s+$/.test(part)) {
                            if (decoration !== 'none' && lastInner) {
                                lastInner.append(part);
                            } else {
                                frag.append(part);
                            }
                        } else if (byLetter) {
                            const group = document.createElement('span');
                            group.className = 'rt-group';
                            for (const char of Array.from(part)) {
                                const { word, inner } = makeMask(index++, decoration);
                                inner.textContent = char;
                                group.append(word);
                                lastInner = inner;
                            }
                            frag.append(group);
                        } else {
                            const { word, inner } = makeMask(index++, decoration);
                            inner.textContent = part;
                            frag.append(word);
                            lastInner = inner;
                        }
                    }
                    child.replaceWith(frag);
                } else if (child instanceof HTMLImageElement || child instanceof SVGElement) {
                    const { word, inner } = makeMask(index++, 'none');
                    child.replaceWith(word);
                    inner.append(child);
                } else if (child instanceof HTMLElement) {
                    const d = getComputedStyle(child).textDecorationLine;
                    if (d !== 'none') child.style.textDecorationLine = 'none';
                    walk(child, d);
                }
            }
        };

        walk(root, 'none');
    }

    onMount(() => {
        if (!rootEl) return;

        if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
            reduced = ready = seen = true;
            return;
        }

        for (const el of variantEls) if (el) split(el);
        ready = true;

        // Controlled mode: the parent decides, no observer.
        if (controlled) return;

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    seen = true;
                    io.disconnect(); // only the first time
                }
            },
            { threshold }
        );
        io.observe(rootEl);
        return () => io.disconnect();
    });
</script>

<svelte:element
    this={tag}
    bind:this={rootEl}
    class="reveal {className}"
    class:ready
    class:reduced
    style:--stagger="{stagger}ms"
    style:--duration="{duration}ms"
    style:--delay="{delay}ms"
>
    {#each variants as variant, i}
        {@const n = i + 1}
        <span
            class="rt-variant"
            class:current={n === current}
            class:exited={n < current}
            bind:this={variantEls[i]}
            aria-hidden={n !== readable}
            inert={n !== readable}
        >
            {#if typeof variant === 'string'}
                {variant}
            {:else}
                {@render variant()}
            {/if}
        </span>
    {/each}
</svelte:element>

<style>
    /* avoid a flash of unsplit text before mount */
    .reveal:not(.ready) {
        visibility: hidden;
    }

    /* all variants share one grid cell: the block is as tall as the tallest */
    .reveal {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
    }

    .rt-variant {
        grid-area: 1 / 1;
        display: block;
    }

    /* reduced motion: no splitting, so just swap */
    .reveal.reduced .rt-variant:not(.current) {
        visibility: hidden;
    }

    /* the mask */
    .reveal :global(.rt-word) {
        display: inline-block;
        vertical-align: top;
        overflow: hidden;
        /* extra room so ascenders/descenders aren't clipped, without changing layout */
        padding: 0.12em 0 0.18em;
        margin: -0.12em 0 -0.18em;
    }

    .reveal :global(.rt-group) {
        white-space: nowrap;
    }

    /* what slides. Default = waiting below the mask */
    .reveal :global(.rt-inner) {
        display: inline-block;
        white-space: pre;
        transform: translateY(110%);
        transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
        transition-delay: calc(var(--i) * 8ms);
        will-change: transform;
    }

    /* entering: slow and staggered */
    .rt-variant.current :global(.rt-inner) {
        transform: translateY(0);
        transition-duration: var(--duration);
        transition-delay: calc(var(--delay) + var(--i) * var(--stagger));
    }

    /* exited upward: fast */
    .rt-variant.exited :global(.rt-inner) {
        transform: translateY(-110%);
        transition-duration: 400ms;
        transition-delay: calc(var(--i) * 8ms);
    }

    .reveal :global(a.underline) { text-decoration: none; }

    .reveal :global(a.underline .rt-inner) {
        text-decoration: underline dotted;
        text-decoration-thickness: var(--lineThickness);
    }
</style>