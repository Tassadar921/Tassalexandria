<script>
    import { t } from 'svelte-i18n';
    import Search from '../shared/Search.svelte';
    import axios from 'axios';
    import { onMount } from 'svelte';
    import TagItem from './TagItem.svelte';
    import SelectedTag from './SelectedTag.svelte';
    import IconButton from '../shared/IconButton.svelte';
    import { showToast } from '../../services/toastService.js';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let selectedTags = [];
    export let update = false;
    export let allowCreateTag = false;
    export let id = null;

    let menuOpen = false;
    let query = '';

    let tags = [];
    let filteredTags = [];

    let isSaveDisabled = true;

    onMount(async () => {
        await getItemsRequest();
    });

    const handleFocusOut = (event) => {
        if (!event.relatedTarget?.closest('#myDropdown')) {
            menuOpen = false;
        }
    };

    const handleSearch = async (event) => {
        const searchTerm = query.toLowerCase();
        filteredTags = tags.filter((item) => item.name.toLowerCase().includes(searchTerm));

        if (event.detail) { // 'Enter' key is pressed
            const foundTag = tags.find((item) => item.name.toLowerCase() === searchTerm);
            if (foundTag) {
                await selectItem(foundTag, false); // Select the tag without a new request
                menuOpen = false;
            } else if (allowCreateTag) {
                const newTag = { name: query }; // Example: Adjust according to your schema
                await selectItem(newTag, false);
                showToast($t('toast.tags.created'), 'success');
                menuOpen = false;
            }
        } else {
            await getItemsRequest(); // Update tags for the query
            filteredTags = tags.filter((item) => item.name.toLowerCase().includes(searchTerm));
        }

        // Force DOM update
        filteredTags = [...filteredTags];
        menuOpen = true; // Ensure dropdown remains open
    };

    const handleDeleteTag = async (tag) => {
        selectedTags = selectedTags.filter((item) => item.name !== tag.name);
        await getItemsRequest();
        isSaveDisabled = false;
        dispatch('delete');
    };

    const selectItem = async (item, sendRequest = true) => {
        if (!selectedTags.includes(item)) {
            selectedTags = [...selectedTags, item];
            if (sendRequest) {
                await getItemsRequest();
            }
            isSaveDisabled = false;
            dispatch('select');
        }
        menuOpen = true;
    };

    const getItemsRequest = async () => {
        try {
            const { data } = await axios.post(`/api/tags?query=${query}`, {
                excludedNames: selectedTags.map((tag) => tag.name),
            });
            tags = data.tags;
        } catch (e) {
            showToast($t('toast.tags.error'), 'error');
        }
    };

    const updateRequest = async () => {
        try {
            await axios.post(`/api/file/${id}/tags`, {
                tags: selectedTags.map((tag) => tag.name),
            });
            showToast($t('toast.file.tags.success'));
        } catch (e) {
            showToast($t('toast.file.tags.error'), 'error');
        }
    };
</script>

<div class="flex gap-3 flex-wrap">
    {#each selectedTags as tag}
        <SelectedTag {tag} on:delete={() => handleDeleteTag(tag)} />
    {/each}
</div>

{#if update}
    <div class="mt-8 ml-3">
        <IconButton size="50" bind:disabled={isSaveDisabled} icon="save" on:click={updateRequest} />
    </div>
{/if}

<div class="relative inline-block w-full" on:focusin={() => (menuOpen = true)} on:focusout={handleFocusOut}>
    <Search label={$t('upload.search-tags')} bind:search={query} on:search={handleSearch} minChars={0} />

    <div
        id="myDropdown"
        class="min-w-64 max-h-96 hidden absolute border border-gray-300 overflow-y-scroll"
        class:block={menuOpen}
        class:hidden={!menuOpen}
    >
        <ul>
            {#if query.length}
                {#each filteredTags as tag}
                    <TagItem {tag} on:select={(event) => selectItem(event.detail)} />
                    <p>ici</p>
                {/each}
            {:else}
                {#each tags as tag}
                    <TagItem {tag} on:select={(event) => selectItem(event.detail)} />
                    <p>là</p>
                {/each}
            {/if}
        </ul>
    </div>
</div>
