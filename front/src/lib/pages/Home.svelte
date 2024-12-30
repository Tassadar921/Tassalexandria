<script>
    import Card from '../shared/Card.svelte';
    import { t } from 'svelte-i18n';
    import Title from "../shared/Title.svelte";
    import {onMount} from "svelte";
    import axios from "axios";

    let products = [];

    onMount(async () => {
       const { data } = await axios.get('/api/tags');
       console.log(data);
    });
</script>

<Title title={$t('home.title')} />

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
    {#each products as product}
        <Card title={product.title} icon={product.icon} href={product.href} description={product.description} />
    {/each}
</div>
