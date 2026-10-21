<script lang="ts">
  import { goto } from '$app/navigation';
  import BoxButton from './boxButton.svelte';

  function goHome() {
    goto('/');
  }
</script>

<div class="headerWrapper">
    <div class="header">
        <a class="tSize1" href="/"> Home </a>
    </div>
</div>

<style>
.headerWrapper{
    z-index: 1;
    background-color: var(--prWhite);
    position: sticky;
    top:0px;

  .header {
    height: 3.5rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 0px var(--marB);
    align-items: center;
  }
}
</style>