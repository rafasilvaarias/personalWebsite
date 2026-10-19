<script lang="ts">
  import { tick } from 'svelte';
  import { parseProjectMd } from './parseProject';
  import type { PageData } from './$types';
  import Header from '$lib/components/header.svelte';
  import RevealText from '$lib/components/revealText.svelte';

  let { data }: { data: PageData } = $props();

  let mainRef = $state<HTMLElement>();
  let scrollY = $state(0);
  let innerHeight = $state(0);
  let readProgress = $state(0);

  function updateProgress() {
    if (!mainRef) {
      readProgress = 0;
      return;
    }
    const top = mainRef.offsetTop;
    const bottom = top + mainRef.offsetHeight - innerHeight;
    readProgress =
      scrollY > bottom ? 1 :
      scrollY < top ? 0 :
      (scrollY - top) / (bottom - top);
  }

  $effect(() => {
    scrollY; innerHeight; mainRef; // track these
    updateProgress();
  });

  $effect(() => {
    if (!mainRef) return;
    const ro = new ResizeObserver(updateProgress);
    ro.observe(mainRef);
    return () => ro.disconnect();
  });

  function scrollToSection(e: MouseEvent, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      history.pushState(null, '', `#${id}`);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function loadInstagramEmbed() {
    // @ts-ignore
    if (window.instgrm) {
      // @ts-ignore
      window.instgrm.Embeds.process();
      return;
    }
    const script = document.createElement('script');
    script.src = '//www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
  }

  function splitContext(html: string) {
    const m = html.match(
      /^([\s\S]*?)<!--reveal-start-->([\s\S]*?)<!--reveal-end-->([\s\S]*)$/
    );
    return m
      ? { before: m[1], context: m[2], after: m[3] }
      : { before: html, context: '', after: '' };
  }

  $effect(() => {
    data.md; // dependency: new promise identity on every navigation

    Promise.resolve(data.md).then(async () => {
      await tick();
      loadInstagramEmbed();
    });
  });
  
</script>

<svelte:window bind:scrollY bind:innerHeight/>

{#await data.md}
<p>loading</p>
{:then md}
{@const parsed = parseProjectMd(md, data.slug)}
{@const parts = splitContext(parsed.html)}
<Header/>

<main bind:this={mainRef}>
  <article>
    {@html parts.before}
    {#if parts.context}
      {#key data.slug}
        <RevealText>
          {@html parts.context}
        </RevealText>
      {/key}
    {/if}
    {@html parts.after}
  </article>
</main>
{/await}

<style>
  :global(html) {
    scroll-padding-top: calc(var(--fullHeaderHeight) + var(--marS));
  }

  /* ---------- layout ---------- */
  article {
    position: relative;
    width: 100%;
    padding: var(--marXL) var(--marB);
    display: inline-flex;
    flex-direction: column;
    gap: var(--marS);
    align-items: center;
  }

  /* ---------- sections ---------- */

  article > :global(.section) {
    margin-top: var(--marL);
    display: inline-flex;
    flex-direction: row;
    gap: var(--marS);
    align-items: first baseline;
    width: 100%;
  }

  article > :global(.section > h2) {
    min-width: calc((2 * var(--gridSize)) + var(--marS));
  }

  article > :global(.section > .content) {
    width: 100%;
  }

  article > :global(.section > .content > p) {
    width: 100%;
  }

  article > :global(.section > .content > *:not(:last-child)) {
    margin-bottom: var(--marS);
  }

  article > :global(.fauxContent) {
    margin-left: calc(2 * var(--gridSize) + 2 * var(--marS));
    width: calc((3 * var(--gridSize)) + (2 * var(--marS)));
  }

  article > :global(.fauxContent > *:not(:last-child)) {
    margin-bottom: var(--marS);
  }

  :global(.info){
    display: flex;
    flex-direction: row;
    border: 1px solid var(--prBlack);
    width: fit-content;
    margin-bottom: var(--marS);

    :global(.infoItem) {
      display: flex;
      flex-direction: column;

      &:not(:first-child) {
        border-left: 1px solid var(--prBlack);
      }

      :global(.label) {
        font-size: var(--size-05);
        color: var(--prBlack2);
        border-bottom: 1px solid var(--prBlack);
      }

      :global(.label), :global(.value) {
        padding: var(--marXXS) var(--marXS);
        text-align: center;

      }

      :global(.value) {
         padding: var(--marXS) var(--marXS);
      }
    }
  }

  article :global(#tableOfContents) {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: var(--marXS);
    flex-wrap: wrap;
  }

  /* ---------- logic chain ---------- */

  article :global(.logicChain) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    gap: 0.4rem;
  }

  article :global(.logicChain .blocks) {
    padding: var(--marXXS);
    border: 1px solid var(--prBlack3);
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    background-color: var(--prWhite);
    margin: 0px;
    cursor: help;
  }

  :global(.arrows) {
    width: fit-content !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ---------- media ---------- */

  article :global(img),
  article :global(video) {
    --s: 100;
    width: calc(var(--s) * 1%);
    min-width: 0;
    cursor: help;
  }

  article :global(.gallery) {
    display: inline-flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--marS);
    align-items: flex-start;
  }

  article :global(.gallery img),
  article :global(.gallery video) {
    --s: 1;
    --s2: calc(var(--s) - 1);
    width: calc(((var(--s) + 1) * var(--gridSize)) + ((var(--s2) + 1) * var(--marS)));
  }

  article :global(.flexGallery) {
    display: inline-flex;
    justify-content: space-between;
    flex-direction: row;
    gap: var(--marS);
    align-items: flex-start;
  }

  article :global(.flexGallery img),
  article :global(.flexGallery video) {
    width: 100%;
    min-width: 0;
  }

  article :global(.stiffGallery) {
    display: inline-flex;
    flex-direction: row;
    gap: var(--marS);
    align-items: flex-start;
  }

  article :global(.stiffGallery img),
  article :global(.stiffGallery video) {
    width: auto;
    max-width: 100%;
    flex: 0 1 auto;
    min-width: 0;
  }

  /* ---------- text ---------- */

  article :global(h2) {
    font-size: var(--size-15);
  }

  article :global(.phrase) {
    font-size: var(--size-4);
    line-height: 1.4;   
  }

  article :global(#context) {
    text-align: center;
  }


  article :global(p) {
    line-height: 1.6;
  }

  article :global(a) {
    text-decoration: underline dotted;
    text-decoration-thickness: 2px;
    text-underline-offset: 15%;
    cursor: ne-resize;
  }

  article :global(a img),
  article :global(a video) {
    cursor: ne-resize;
  }

  article :global(.internal) {
    cursor: pointer;
  }

  /* ---------- responsive ---------- */

  @media (max-width: 68rem) {
    article > :global(*:nth-last-child(2)) {
      margin-bottom: var(--marS);
    }

    article :global(.gallery img),
    article :global(.gallery video) {
      --s: 1;
      --s2: calc(var(--s) - 1);
      width: calc(((var(--s)) * var(--gridSize)) + ((var(--s2)) * var(--marS)));
    }

    article > :global(.section > h2) {
      min-width: calc(var(--gridSize));
    }
    article > :global(.fauxContent) {
      margin-left: calc(var(--gridSize) + var(--marS));
      width: calc((2 * var(--gridSize)) + (1 * var(--marS)));
    }
  }

  @media (max-width: 55rem) {

    article :global(.phrase) {
      font-size: var(--size-3);
      line-height: 1.2;   
      text-align: left !important;
    }

    article > :global(.section) {
      flex-direction: column;
    }

    article > :global(.fauxContent) {
      margin-left: 0px;
    }

    article :global(.gallery img),
    article :global(.gallery video),
    article :global(.flexGallery img),
    article :global(.flexGallery video) {
      width: 100% !important;
    }

    :global(.value) {
      padding: var(--marXXS) !important;
      line-height: 1.3 !important;
    }
  }

  @media (max-width: 42rem) {
    article :global(.logicChain) {
      flex-wrap: wrap;
    }

    article :global(.logicChain .arrows) {
      margin: 0 auto;
      transform: rotate(90deg);
    }

    article :global(.logicChain .arrows),
    article :global(.logicChain .blocks) {
      text-align: center;
    }

    article :global(.logicChain .blocks) {
      min-width: 100%;
    }

    article :global(.logicChain p) {
      margin-bottom: 0px;
    }

    article :global(.gallery),
    article :global(.flexGallery) {
      flex-direction: column;
    }
  }
</style>