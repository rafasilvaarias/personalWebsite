<!-- ProjectCard.svelte -->
<script lang="ts">
    import RevealText from "./revealText.svelte";

    let { project } = $props();
    let active = $state(1);
</script>

<a
    class="project"
    href={project.link}
    onmouseenter={() => (active = 2)}
    onmouseleave={() => (active = 1)}
>
    <img src={project.photo} alt="{project.name} project photo" />
    <div class="projectInfo">
        <h3><RevealText texts={[project.name, project.name]} {active} /></h3>
        <p>{project.info}</p>
    </div>
</a>

<style>
    h3{
        text-align: left;
    }

    p{
        text-align: right;
    }
</style>