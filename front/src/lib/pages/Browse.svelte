<script>
    import Title from '../shared/Title.svelte';
    import { t } from 'svelte-i18n'; // Ensure correct import alias for `$t`
    import { onMount } from 'svelte';
    import axios from 'axios';
    import { showToast } from '../../services/toastService.js';
    import TagSelector from '../shared/TagSelector.svelte';
    import Link from '../shared/Link.svelte';
    import Search from '../shared/Search.svelte';

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
        <div class="flex flex-wrap justify-around gap-5 mt-5">
            {#each paginated.uploadedFiles.uploadedFiles as uploadedFile}
                <Link href={`/file/${uploadedFile.id}`} className="flex items-center justify-center group">
                    <img
                        alt={uploadedFile.title}
                        src={`${process.env.VITE_API_BASE_URL}/api/static/thumbnail/${uploadedFile.id}?token=${localStorage.getItem('apiToken')}`}
                        class="w-64 rounded-2xl group-hover:border group-hover:border-primary-500"
                        onerror="this.src='/assets/default/image.png'"
                    />
                </Link>
            {/each}
        </div>
    {/if}
</div>
