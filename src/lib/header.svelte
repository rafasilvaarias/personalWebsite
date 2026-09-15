<script lang="ts">
  import { goto } from '$app/navigation';

  let { header }: { header: string[] } = $props();

  function goHome() {
    goto('/');
  }
</script>

<div class="headerWrapper">
    <div class="header">
        <div id="buttonDiv">
            <button onclick={goHome}>
                <img src="/icons/blueArrowLeft.svg" alt="arrow pointing left"/>
                <p>go to home</p>
            </button>
        </div>
        {#if header[1]}
            <div id="infoDiv">
                <h1>{header[0]}</h1>
                <p class="hideOnMobile">{header[1]}</p>
            </div>
        {:else}
            <div id="infoDiv" class="right">
                <h1>{header[0]}</h1>
            </div>
        {/if}
    </div>
    <hr/>
</div>

<style>
.headerWrapper{
    z-index: 1000;
    background-color: var(--prWhite);
    position: sticky;
    top:0px;

  .header {
    height: 3.5rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: var(--marS);
    padding: 0px 2rem;
    align-items: center;
    #buttonDiv{
        min-width: var(--gridSize);
        button{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: left;
            gap: 0.5rem;
            transform: translateX(-1.35rem);
            transition: all var(--quickTransition) ease-in-out;
            img{
                transition: all var(--quickTransition) ease-in-out;
                opacity: 0;
                transform: rotate(15deg);
            }
        }

        button:hover{
            transform: translateX(0px);
            img{
                opacity: 1;
                transform: rotate(0deg);
            }
        }
    }
    #infoDiv{
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: baseline;
        justify-content: space-between;
    }
    #infoDiv.right{
        justify-content: flex-end;
    }
  }
}

@media (max-width: 55rem) {
    .headerWrapper { .header { #infoDiv {
        justify-content: right;
    }}}
}
</style>