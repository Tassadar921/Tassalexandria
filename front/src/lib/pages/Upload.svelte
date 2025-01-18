<script>
    import Title from '../shared/Title.svelte';
    import { t } from 'svelte-i18n';
    import Form from '../shared/Form.svelte';
    import FileUpload from '../shared/FileUpload.svelte';
    import { showToast } from '../../services/toastService.js';
    import TagSelector from '../shared/TagSelector.svelte';
    import { navigate } from '../../stores/locationStore.js';
    import Input from '../shared/Input.svelte';
    import { profile } from '../../stores/profileStore.js';

    let title = '';
    let selectedTags = [];
    let file = null;
    let thumbnail = null;
    let isValid = false;
    let hideThumbnail = true;

    const handleSuccess = (event) => {
        console.log(event.detail);
        showToast($t('toast.upload.success'));
        navigate(`/file/${event.detail.fileId}`);
    };

    const handleError = () => {
        showToast($t('toast.upload.error'), 'error');
    };

    $: isValid = !!file;
    $: {
        hideThumbnail = file ? file.type.split('/')[0] === 'image' || file.type.split('/')[0] === 'video' : true;
    }
</script>

<Title title={$t('upload.title')} hasBackground={true} />

<Form method="post" action="/api/upload" on:success={handleSuccess} on:error={handleError} bind:isValid>
    <Input
        name="title"
        placeholder={$t('common.title.placeholder')}
        label={$t('common.title.label')}
        bind:value={title}
        required={true}
        min={3}
        max={50}
    />

    <TagSelector bind:selectedTags allowCreateTag={true} />

    {#each selectedTags as tag}
        <input value={tag.name} name="tags" type="hidden" />
    {/each}

    <div class="flex flex-col md:flex-row gap-5 justify-center">
        <div class="order-1 md:order-2">
            <FileUpload
                name="file"
                accept="png jpg gif jpeg webp mp3 mp4 mov txt docx xls xlsx pdf"
                title={$t('upload.file.title')}
                bind:file
                pathPrefix="upload"
                id={$profile.id}
            />
        </div>
        {#if !hideThumbnail}
            <div class="order-2 md:order-1">
                <FileUpload
                    name="thumbnail"
                    accept="png jpg gif jpeg webp"
                    title={$t('upload.thumbnail.title')}
                    bind:file={thumbnail}
                    pathPrefix="upload"
                    id={$profile.id}
                    bind:disabled={hideThumbnail}
                />
            </div>
        {/if}
    </div>
</Form>
