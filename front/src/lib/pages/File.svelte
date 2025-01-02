<script>
    import { onMount } from "svelte";
    import axios from 'axios';
    import Title from "../shared/Title.svelte";
    import { t } from 'svelte-i18n';
    import Tag from "../file/Tag.svelte";
    import { language } from '../../stores/languageStore';
    import Subtitle from "../shared/Subtitle.svelte";
    import Icon from "../shared/Icon.svelte";
    import IconButton from "../shared/IconButton.svelte";
    import Fab from "../shared/Fab.svelte";
    import Button from "../shared/Button.svelte";

    export let id;

    let uploadedFile = null;
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
        } catch (e) {

        }
    });

    const handleDownload = async () => {
        try {
            const response = await axios.get(`${uploadedFile.file.path}`, {
                responseType: 'blob'
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
            console.log(e.response.data);
        }
    };

    $: if (uploadedFile) {
        createdAt = new Date(uploadedFile.createdAt).toLocaleDateString($language, dateOptions);
        updatedAt = new Date(uploadedFile.updatedAt).toLocaleDateString($language, dateOptions);
    }
</script>

<Title title={uploadedFile?.title ?? $t('file.title')} />

{#if uploadedFile}
    <Subtitle>{$t('common.created-at')}: {createdAt}</Subtitle>
    <Subtitle>{$t('common.updated-at')}: {updatedAt}</Subtitle>
    <div class="flex gap-3 flex-wrap mt-2">
        {#each uploadedFile.fileTags as fileTag}
            <Tag tag={fileTag.tag} />
        {/each}
    </div>
    {#if uploadedFile.file.mimeType.split('/')[0] === 'image'}
        <div class="w-full flex justify-center">
            <Button customStyle={true} className="mt-10" on:click={handleDownload}>
                <img alt={uploadedFile.title} src={`${process.env.VITE_TASSADAPI_BASE_URL}/${uploadedFile.file.path}`} class="w-64 m-auto rounded-2xl" />
            </Button>
        </div>
    {/if}
    <Fab horizontal="middle" vertical="bottom" icon="download" on:click={handleDownload} />
{/if}
