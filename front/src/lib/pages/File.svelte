<script>
    import { onMount } from 'svelte';
    import axios from 'axios';
    import Title from '../shared/Title.svelte';
    import { t } from 'svelte-i18n';
    import { language } from '../../stores/languageStore';
    import Subtitle from '../shared/Subtitle.svelte';
    import Fab from '../shared/Fab.svelte';
    import Button from '../shared/Button.svelte';
    import Editable from '../shared/Editable.svelte';
    import { showToast } from '../../services/toastService.js';
    import TagSelector from '../shared/TagSelector.svelte';

    export let id;

    let uploadedFile = null;
    let selectedTags = [];
    let createdAt;
    let updatedAt;

    const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };

    onMount(async () => {
        try {
            const { data } = await axios.get(`/api/file/${id}`);
            uploadedFile = data.file;
            selectedTags = uploadedFile?.fileTags?.map((fileTag) => fileTag.tag) ?? [];
        } catch (e) {
            showToast($t('toast.file.fetch.error'), 'error');
        }
    });

    const handleDownload = async () => {
        try {
            const response = await axios.get(`/api/file/${uploadedFile.id}/download`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', uploadedFile.file.name);
            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (e) {
            showToast($t('toast.file.download.error'), 'error');
        }
    };

    const handleRename = async () => {
        try {
            const response = await axios.post(`/api/file/${id}/rename`, {
                title: uploadedFile.title,
            });
            if (response.status === 200) {
                showToast($t('toast.file.rename.success'));
            } else {
                showToast($t('toast.file.rename.error'), 'error');
            }
        } catch (e) {
            showToast($t('toast.file.rename.error'), 'error');
        }
    };

    $: if (uploadedFile) {
        createdAt = new Date(uploadedFile.createdAt).toLocaleDateString($language, dateOptions);
        updatedAt = new Date(uploadedFile.updatedAt).toLocaleDateString($language, dateOptions);
    }

    // Default assets for missing or loading media
    const defaultImage = '/assets/default/image.png';
    const defaultVideo = '/assets/default/video.png';
</script>

{#if uploadedFile}
    <Editable bind:value={uploadedFile.title} min={3} max={50} className="text-3xl font-bold mb-2" iconClassName="mt-1" on:rename={handleRename}>
        <Title title={uploadedFile?.title} />
    </Editable>
    <Subtitle>{$t('common.created-at')}: {createdAt}</Subtitle>
    <Subtitle>{$t('common.updated-at')}: {updatedAt}</Subtitle>
    <div class="mt-3">
        <TagSelector bind:selectedTags update={true} {id} />
    </div>
    {#if uploadedFile.file.mimeType.startsWith('image')}
        <div class="w-full flex justify-center">
            <Button customStyle={true} className="mt-10" on:click={handleDownload}>
                <img
                    alt={uploadedFile.title}
                    src={uploadedFile?.id
                        ? `${process.env.VITE_API_BASE_URL}/api/static/upload/${uploadedFile.id}?token=${localStorage.getItem('apiToken')}`
                        : defaultImage}
                    class="max-h-96 rounded-2xl"
                    onerror="this.src='/assets/default/image.png'"
                />
            </Button>
        </div>
    {:else if uploadedFile.file.mimeType.startsWith('video')}
        <div class="w-full flex justify-center">
            <!-- svelte-ignore a11y-media-has-caption -->
            <video
                src={uploadedFile?.id
                    ? `${process.env.VITE_API_BASE_URL}/api/static/file/${uploadedFile.id}?token=${localStorage.getItem('apiToken')}`
                    : defaultVideo}
                class="mt-10 max-h-96 rounded-2xl"
                controls
                onerror="this.src='/assets/default/video.png'"
            />
        </div>
    {:else}
        <Button customStyle={true} className="mt-10" on:click={handleDownload}>
            <img alt={uploadedFile.title} src={defaultImage} class="max-h-96 rounded-2xl" />
        </Button>
    {/if}
    <Fab horizontal="middle" vertical="bottom" icon="download" on:click={handleDownload} />
{:else}
    <Title title={$t('file.title')} />
    <div class="w-full flex justify-center mt-10">
        <img src={defaultImage} alt="Default Placeholder" class="max-h-96 rounded-2xl" />
    </div>
{/if}
