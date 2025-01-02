<script>
    export let tag;
</script>

<div
    class="rounded-full px-2 py-1 relative flex gap-1"
    style="background-color: rgba({tag.red}, {tag.green}, {tag.blue}, 0.8); opacity: 0.5;"
>
    <span>{tag.name}</span>
</div>
