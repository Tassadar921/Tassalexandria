<script>
    import Title from '../shared/Title.svelte';
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import { showToast } from '../../services/toastService.js';
    import TagSelector from '../shared/TagSelector.svelte';
    import Search from '../shared/Search.svelte';
    import BrowseItem from '../browse/BrowseItem.svelte';

    let query = '';
    let selectedTags = [];
    let paginated;

    onMount(async () => {
        await initializeFromUrl();
        await search();
    });

    const initializeFromUrl = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        query = urlParams.get('query') || '';

        const tags = urlParams.get('tags');
        if (tags) {
            const { data } = await axios.post('/api/tags/details', {
                tags: tags.split(','),
            });
            selectedTags = data.tags;
        }
    };

    const search = async () => {
        try {
            const searchParams = updateUri();
            const { data } = await axios.get(`/api/file/search?${searchParams}`);
            paginated = data;
        } catch (e) {
            showToast($t('toast.browse.search.error'), 'error');
        }
    };

    const updateUri = () => {
        const params = new URLSearchParams();
        params.set('query', query);

        if (selectedTags.length > 0) {
            params.set('tags', selectedTags.map((tag) => tag.name).join(','));
        }

        const searchParams = params.toString();

        const url = new URL(window.location.href);
        url.search = searchParams;
        window.history.pushState({}, '', url);

        return searchParams;
    };
</script>

<Title title={$t('browse.title')} />

<div class="flex flex-col gap-3 mb-3">
    <Search label={$t('browse.search.label')} bind:search={query} on:search={search} minChars={0} />
    <TagSelector bind:selectedTags on:select={search} on:delete={search} />

    {#if paginated?.uploadedFiles?.uploadedFiles?.length}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 justify-items-center items-center mt-5">
            {#each paginated.uploadedFiles.uploadedFiles as uploadedFile}
                <BrowseItem {uploadedFile} />
            {/each}
        </div>
    {/if}
</div>
