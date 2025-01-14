<script>
    import Link from '../shared/Link.svelte';

    export let uploadedFile;

    let imgError = false;
    let imageRef;

    const handleImageError = () => {
        imgError = true;
        imageRef.src = '/assets/default/image.png';
    };
</script>

<Link href={`/file/${uploadedFile.id}`} className="flex items-center justify-center w-48 h-60 md:w-64 md:h-80 group">
    {#if imgError}
        <span class="absolute font-bold">{uploadedFile.title}</span>
    {/if}
    <img
        bind:this={imageRef}
        alt={uploadedFile.title}
        src={`${process.env.VITE_API_BASE_URL}/api/static/thumbnail/${uploadedFile.id}?token=${localStorage.getItem('apiToken')}`}
        class="max-w-64 max-h-80 p-1.5 rounded-2xl group-hover:border group-hover:border-primary-500"
        on:error={handleImageError}
    />
</Link>
