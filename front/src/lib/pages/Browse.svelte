<script>
    import Title from '../shared/Title.svelte';
    import { t } from 'svelte-i18n'; // Ensure correct import alias for `$t`
    import { onMount } from "svelte";
    import axios from "axios";
    import { showToast } from "../../services/toastService.js";
    import TagSelector from "../upload/TagSelector.svelte";

    let query = '';
    let selectedTags = [];
    let paginated;

    onMount(async () => {
        await search();
    });

    const search = async () => {
        try {
            const searchParams = updateUri();
            console.log(`/api/file/search?${searchParams}`);
            const { data } = await axios.get(`/api/file/search?${searchParams}`);
            console.log(data);
            paginated = data;
        } catch (e) {
            console.error(e);
            showToast($t('toast.browse.search.error'), 'error');
        }
    };

    const updateUri = () => {
        const params = new URLSearchParams();
        params.set('query', 'photo');

        if (selectedTags.length > 0) {
            params.set('tags', selectedTags.map(tag => tag.name).join(','));
        }

        const searchParams = params.toString();

        const url = new URL(window.location.href);
        url.search = searchParams;
        window.history.pushState({}, '', url);

        return searchParams;
    }

    $: console.log(selectedTags);
</script>

<Title title={$t('browse.title')}/>

<TagSelector bind:selectedTags search={true} on:select={search()} />
