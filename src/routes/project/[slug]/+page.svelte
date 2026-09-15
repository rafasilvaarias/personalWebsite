<script lang="ts">
  import { tick } from 'svelte';
  import { parseProjectMd } from '$lib/parseProject';
  import type { PageData } from './$types';
  import { getProgressChar} from '$lib/utils';
  import Header from '$lib/header.svelte';

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
<Header header={parsed.header} />

<main bind:this={mainRef}>
  
    
  
    
    <div id="sidebar">
      <div>
        <nav class="toc">
          <ul>
            {#each parsed.tableOfContents as item (item.id)}
                <li><a class="blue" href="#{item.id}" onclick={(e) => scrollToSection(e, item.id)}>{item.name}</a></li>
            {/each}
          </ul>
        </nav>
        <p id="readingTime" class="black3 serif">{parsed.readingTimeMinutes} min. read</p>
      </div>
      <p class="blue">{getProgressChar(readProgress)}</p>
    </div>

    <article>
      {@html parsed.html}
      <p id="progressBar" class="blue">{getProgressChar(readProgress)}</p>
    </article>
</main>
{/await}

<style>

  :global(html){
    scroll-padding-top: calc(var(--fullHeaderHeight) + var(--marS));
  }

  main{
    display: inline-flex;
    flex-direction: row;
    justify-content: top;
    gap: var(--marS);
    padding: 0px var(--marS);

    article, #sidebar{
      padding: var(--marS) 0px;
    }

    article{
      position: relative;
      width: 100%;

      :global(> *:nth-last-child(n+3)) {
        margin-bottom: var(--marS);
      }

      :global(> .section) {
        margin-top: var(--marL);
        display: inline-flex;
        flex-direction: row;
        gap: var(--marS);
        align-items: first baseline;
        :global(> h2) {
          min-width: var(--gridSize);
        }
        :global(> .content) {
          width: 100%;
          :global(> *:not(:last-child)) {
            margin-bottom: var(--marS);
          }
        }
      }

      :global(> .fauxContent) {
        margin-left: calc(var(--gridSize) + var(--marS));
        :global(> *:not(:last-child)) {
          margin-bottom: var(--marS);
        }
      }

      :global(.logicChain) {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        gap: 0.4rem;

        :global(.arrows) {
          white-space: nowrap;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          margin: 0px;
        }

        :global(.blocks) {
          padding: var(--marXS);
          border: 0.5px solid var(--prBlack3);
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          background-color: var(--prWhite);
          filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.025));
          margin: 0px;
          cursor: help;
        }
      }

      :global(img, video){
        --s: 100;
        width: calc(var(--s) * 1%);
        min-width: 0;  
        cursor: help;
        filter: drop-shadow(12px 12px 27px rgba(0, 0, 0, 0.125));
      }

      :global(.gallery) {
        display: inline-flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: var(--marS);
        align-items: flex-start;
        :global(img, video){
          --s: 1;
          --s2 : calc(var(--s) - 1);
          width: calc(
            (var(--s) * var(--gridSize) )
            + ( 
              (var(--s2) 
              * 2rem
            )));
        }
      }

      :global(.flexGallery) {
        display: inline-flex;
        justify-content: space-between;
        flex-direction: row;
        gap: var(--marS);
        align-items: flex-start;
        :global(img, video){
          width: 100%;
          min-width: 0;
        }
      }

      :global(.stiffGallery) {
        display: inline-flex;
        flex-direction: row;
        gap: var(--marS);
        align-items: flex-start;
        :global(img, video){
          width: auto;
          max-width: 100%;
          flex: 0 1 auto;
          min-width: 0;
        }
      }

      :global(h2){
        font-size: var(--tSize2);
        font-family: 'prSerif', serif;
      }

      :global(.phrase){
        font-size: var(--tSize3);
        line-height: 1.4;
      }

      :global(a) {
        color: var(--prBlue);
        cursor: ne-resize;
        :global(img, video){
          cursor: ne-resize;
        }
      }

      :global(.internal) {
        cursor: pointer;
      }
       
      :global(p) {
        line-height: 1.6;
      }

      #progressBar {
        position: sticky;
        bottom: var(--marS);
        width: 100%;
        text-align: center;
        pointer-events: none;
        display: none;
      }
    }

    #sidebar{
      position: sticky;
      top: var(--fullHeaderHeight);
      align-self: flex-start;
      height: calc(100svh - var(--fullHeaderHeight));
      min-width: var(--gridSize);
      

      display: flex;
      flex-direction: column;
      justify-content: space-between;
      > div{
        display: flex;
        flex-direction: column;
        gap: var(--marS);
      }
    }
  }

  @media (max-width: 68rem) {
    main{ 

      article{
        #progressBar {
          display:inline-block;
        }

        :global(> *:nth-last-child(2)) {
          margin-bottom: var(--marS);
        }
      }

      #sidebar{
        display: none;
      }
    }
  } 

  @media (max-width: 55rem) {
    main { article { 
      :global(> .section){
        flex-direction: column;
      }
      :global(> .fauxContent){
        margin-left: 0px;
      }
    }}
  }

  @media (max-width: 42rem) {
    main { article { 
      :global(.logicChain){
        flex-wrap: wrap;

        :global(.arrows) {
          width: fit-content;
          margin: 0 auto; 
          transform: rotate(90deg);
        }

        :global(.arrows), :global(.blocks) {
          text-align: center;
        }

        :global(.blocks) {
          min-width: 100%;
        }

        :global(p) {
          margin-bottom: 0px;
        }
      }
      :global(.gallery, .flexGallery) {
        flex-direction: column;
        :global(img, video){
          width: 100% !important;
        }
      }
    }}
  }
</style>