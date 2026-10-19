<script lang="ts">
    let {
        text,
        link,
        width,
        progress,
        resize,
    }: {
        text: string;
        link: string;
        width?: 1 | 2 | 3 | 4 | 5;
        progress?: number; // 0 to 1
        resize?: boolean; // 0 to 1
    } = $props();

    let useGrid = $derived(width !== undefined && width >= 1 && width <= 5);

    // No progress => treated as fully filled
    let progressPercent = $derived(
        progress === undefined ? 100 : Math.min(1, Math.max(0, progress)) * 100
    );

    import { ui } from '$lib/state.svelte.js';
</script>

<a
    href={link}
    class="linkRow"
    class:gridW={useGrid}
    class:full={!useGrid}
    class:resize
    style:--s={useGrid ? width : undefined}
    style:--progress="{progressPercent}%"
    target={resize ? "_blank" : ""}
>
    <div class="lines">
        <div class="base"></div>
        <div class="fill"></div>
    </div>
    <span class="content">
        <span class="text {ui.isMobile ? "tSize15" : "tSize2"}">{text}</span>
        <img class="arrow {ui.isMobile ? "iconSize2" : "iconSize2"}" src="/icons/arrowRight.svg" alt="" aria-hidden="true" />
    </span>
</a>

<style>
    .linkRow {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        color: inherit;
        text-decoration: none;
        padding-bottom: 0.75rem;
    }

    .linkRow.full {
        width: 100%;
    }

    .lines {
        position: relative;
        width: 100%;
        height: var(--lineThickness);
    }

    .base,
    .fill {
        position: absolute;
        top: 0;
        left: 0;
        height: var(--lineThickness);
    }

    .base {
        width: 100%;
        background: var(--prBlack3);
    }

    .fill {
        width: var(--progress);
        background: var(--prBlack);
        transition: width var(--vQuickTransition) ease;
    }

    .linkRow:hover .fill {
        width: 100%;
    }

    .content {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: var(--marXS, 0.5rem);
    }

    .arrow, .text {
        transition: transform var(--quickTransition) ease;
    }

    .linkRow:hover .arrow {
        transform: rotate(-35deg) ;
    }
</style>