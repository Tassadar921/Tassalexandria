<script>
    import Title from "../shared/Title.svelte";
    import { t } from 'svelte-i18n';
    import Form from "../shared/Form.svelte";
    import FileUpload from "../shared/FileUpload.svelte";
    import {showToast} from "../../services/toastService.js";
    import TagSelector from "../shared/TagSelector.svelte";

    let selectedTags = [];
    let file = null;
    let isValid = false;

    const handleSuccess = () => {
        showToast($t('toast.upload.success'));
    };

    const handleError = () => {
        showToast($t('toast.upload.error'), 'error');
    };

    $: isValid = !!file;
</script>

<Title title={$t('upload.title')} hasBackground={true} />

<Form method="post" action="/api/upload" on:success={handleSuccess} on:error={handleError} bind:isValid>
    <TagSelector bind:selectedTags />

    {#each selectedTags as tag}
        <input value={tag.name} name="tags" type="hidden" />
    {/each}

    <FileUpload
        name="file"
        accept="png jpg gif jpeg webp mp3 mp4 mov"
        title={$t('upload.file.title')}
        bind:file
    />
</Form>
