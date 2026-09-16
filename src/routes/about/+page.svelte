<script lang="ts">
    import Header from '$lib/header.svelte';

    const timeline = [
        { photo: "baby.gif", time: "Rafa Silva Arias" },
        { message: "born in Porto, Portugal", time: "sep 2003" },
        { message: 'enrolled in classical piano @ <a class="resize" target="_blank" href="https://www.emos.pt/">EMOS</a>', time: "2008" },
        { message: 'left classical piano for jazz guitar and piano @ <a class="resize" target="_blank" href="https://valentim.pt/conteudos/cursos">Valentim de Carvalho</a>', time: "sep 2018" },
        { message: "discovered Björk", time: "aug 2019" },
        { message: "stopped studying music formally", time: "jul 2020" },
        { message: 'enrolled in bachelor\'s in <a class="resize" target="_blank" href="https://www.uc.pt/en/fctuc/dei/education/bachelors/ldm/">design and multimedia</a> @ FCTUC, UC', time: "sep 2021" },
        { message: 'interned as a designer @ <a class="resize" target="_blank" href="https://www.uc.pt/desporto/">Desporto UC</a>, mildly disliked it', time: "oct 2022" },
        { message: 'co-founded <a class="resize" target="_blank" href="https://www.radiorese.pt">RESE</a> and served as head of design', time: "jan 2023" },
        { message: 'left <a class="resize" target="_blank" href="https://www.uc.pt/desporto/">Desporto UC</a>', time: "jun 2023" },
        { message: 'designed for Festa das Latas for 4 months, made <a class="resize" target="_blank" href="https://noticias.uc.pt/artigos/cartaz-da-festa-das-latas-2023-ja-circula/">its poster</a>', time: "jul 2023" },
        { message: 'elected head of communication and image @ <a class="resize" target="_blank" href="https://academica.pt/">AAC</a>', time: "nov 2023" },
        { message: '<a class="resize" target="_blank" href="https://lnkd.in/p/e23RhMAs">met the president</a>', time: "apr 2024" },
        { message: 'back @ Festa das Latas for 4 months, now as head of communication and design', time: "jul 2024" },
        { message: 'finished my bachelor\'s and started a master\'s in <a class="resize" target="_blank" href="https://www.uc.pt/en/fctuc/dei/education/masters/master-in-computer-music-and-sound-design/">computer music and sound design</a> @ FCTUC, UC', time: "sep 2024" },
        { message: 'became president @ <a class="resize" target="_blank" href="https://www.radiorese.pt">RESE</a>', time: "sep 2024" },
        { message: 'my tenure @ <a class="resize" target="_blank" href="https://academica.pt/">AAC</a> ended', time: "dec 2024" },
        { message: '<a class="resize" target="_blank" href="https://lnkd.in/p/eVwFUuNc">designed the campaign</a> for the 4th anniversary of Porto\'s citizen card', time: "mar 2024" },
        { message: 'published <a class="resize" target="_blank" href="https://stylorevistaea.wordpress.com/rafa-arias/">an essay on Stylo</a>', time: "may 2025" },
        { message: 'left <a class="resize" target="_blank" href="https://www.radiorese.pt">RESE</a>, now advise its presidency occasionally', time: "aug 2025" },
        { message: 'became head of design for the <a class="resize" target="_blank" href="https://shiftappens.com/">Shift APPens 2026</a> hackathon, a joint venture of <a class="resize" target="_blank" href="https://nei.dei.uc.pt/">NEI/AAC</a> and <a class="resize" target="_blank" href="https://www.jeknowledge.com/">jeKnowledge</a>', time: "sep 2025" },
        { message: "bought a Kobo Clara BW <br/> (!important)", time: "jan 2026" },
        { message: 'presented <a class="resize" target="_blank" href="https://shiftappens.com/">Shift APPens 2026</a> hackathon because there was no one else to do it', time: "may 2026" },
        { message: 'threw a 100 people fundraiser party in a backyard for <a class="resize" target="_blank" href="https://www.radiorese.pt">RESE</a>, DJ\'d', time: "jun 2026" }
    ];

    
</script>

<Header header={["About"]} />

<div id="aboutWrapper">
    <div id="about">
        {#each timeline as happening, index}
            <div>
                <p class={index != 0 ? "black3 time": "time"}>{happening.time}</p>
                {#if happening.message}
                    <p class="message">{@html happening.message}</p>
                {:else if happening.photo}
                    <img class="dropShadow help" src={"/photos/about/" + happening.photo} alt="" />
                {/if}
            </div>
        {/each}
    </div>
</div>

<style>
    #about{
        padding: var(--marS);
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
        justify-content: center;
        gap: 4rem 4rem;

        > div {
            position: relative;
            min-width: 0;
            min-height: 12rem;
            display: flex;
            flex-direction: column;
            gap: 0.6rem;

            .time{
                font-size: 0.8rem;
            }
        }

        :global(a) {
            color: var(--prBlue);
        }
    }


    @media (min-width: 40rem) {
        #about > div:nth-child(n+3)::after {
            content: "→";
            position: absolute;
            top: 1.75rem;
            left: -2.5rem;
            color: var(--prBlack);
        }
    }
</style>