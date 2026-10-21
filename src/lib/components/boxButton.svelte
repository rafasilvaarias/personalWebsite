<script lang="ts">
    import { ui } from '$lib/state.svelte.js';
    import RevealText from './revealText.svelte';

    let {
        text,
        link,
        resize,
        byLetter = false,
    }: {
        text: string;
        link: string;
        resize?: boolean;
        byLetter?: boolean;
    } = $props();

    let hovered = $state(false);

    // 1 = rest, 2 = hover. Never 0, so the text is always visible.
    const active = $derived(hovered ? 2 : 1);
</script>

<a
    href={link}
    class="textBox"
    class:resize
    target={resize ? "_blank" : ""}
    onmouseenter={() => (hovered = true)}
    onmouseleave={() => (hovered = false)}
    onfocus={() => (hovered = true)}
    onblur={() => (hovered = false)}
>
    <RevealText
        tag="span"
        texts={[text, text]}
        {active}
        byLetter={byLetter}
        stagger={10}
        duration={600}
        class={ui.isTablet ? 'tSize1' : 'tSize15'}
    />
</a>

<style>
    .textBox {
        background-color: var(--prWhite);
        display: inline-flex;
        align-items: center;
        width: fit-content;
        height: fit-content;
        box-sizing: border-box;
        border: var(--lineThickness) solid var(--prBlack2);
        padding: var(--marXXS, 0.5rem);
        color: inherit;
        text-decoration: none;
        white-space: nowrap;
    }
</style>