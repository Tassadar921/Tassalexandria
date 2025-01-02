<script>
    import { t } from 'svelte-i18n';
    import Search from "./Search.svelte";
    import axios from 'axios';
    import {onMount} from "svelte";
    import TagItem from "./TagItem.svelte";
    import SelectedTag from "./SelectedTag.svelte";

    export let selectedTags = [];

    let menuOpen = false;
    let query = "";

    let tags = [];
    let filteredTags = [];

    onMount(async () => {
        await getItemsRequest();
    });

    const handleFocusOut = (event) => {
        if (!event.relatedTarget?.closest('#myDropdown')) {
            menuOpen = false;
        }
    };

    const handleSearch = async () => {
        filteredTags = tags.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        await getItemsRequest();
    };

    const selectItem = async (item) => {
        if (!selectedTags.includes(item)) {
            selectedTags = [...selectedTags, item];
            await getItemsRequest();
        }
        menuOpen = true;
    };

    const getItemsRequest = async () => {
        const { data } = await axios.post(`/api/tags?query=${query}`, {
            excludedNames: selectedTags.map(tag => tag.name),
        });
        tags = data.tags;
    };
</script>

<div class="flex gap-3 flex-wrap">
    {#each selectedTags as tag}
        <SelectedTag {tag} />
    {/each}
</div>

<div
    class="relative inline-block w-full"
    on:focusin={() => menuOpen = true}
    on:focusout={handleFocusOut}
>
    <Search
        label={$t('upload.search-tags')}
        bind:search={query}
        {handleSearch}
        minChars={0}
    />
    <div id="myDropdown" class:show={menuOpen} class="dropdown-content max-h-96 overflow-y-scroll">
        <ul>
            {#if query.length}
                {#each filteredTags as tag}
                    <TagItem {tag} on:select={(event) => selectItem(event.detail)} />
                {/each}
            {:else}
                {#each tags as tag}
                    <TagItem {tag} on:select={(event) => selectItem(event.detail)} />
                {/each}
            {/if}
        </ul>
    </div>
</div>

<style>
    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f6f6f6;
        min-width: 230px;
        border: 1px solid #ddd;
        z-index: 100;
    }

    .show {
        display: block;
    }
</style>
