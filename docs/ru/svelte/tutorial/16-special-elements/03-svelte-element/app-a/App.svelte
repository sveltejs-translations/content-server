<script>
    const options = ['h1', 'h3', 'p'];
    let selected = options[0];
</script>

<select bind:value={selected}>
    {#each options as option}
        <option value={option}>{option}</option>
    {/each}
</select>

{#if selected === 'h1'}
    <h1>Я тэг h1</h1>
{:else if selected === 'h3'}
    <h3>Я тэг h3</h3>
{:else if selected === 'p'}
    <p>Я тэг p</p>
{/if}