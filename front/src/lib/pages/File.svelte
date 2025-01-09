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
            const response = await axios.get(`/api/static/${uploadedFile.id}?token=${localStorage.getItem('apiToken')}`, {
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
    {#if uploadedFile.file.mimeType.split('/')[0] === 'image'}
        <div class="w-full flex justify-center">
            <Button customStyle={true} className="mt-10" on:click={handleDownload}>
                <img
                    alt={uploadedFile.title}
                    src={`${process.env.VITE_API_BASE_URL}/api/static/${uploadedFile.id}?token=${localStorage.getItem('apiToken')}`}
                    class="w-64 m-auto rounded-2xl"
                />
            </Button>
        </div>
    {/if}
    <Fab horizontal="middle" vertical="bottom" icon="download" on:click={handleDownload} />
{:else}
    <Title title={$t('file.title')} />
{/if}
