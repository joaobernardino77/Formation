<script>
    export let plate
    const {Name, img, Price, Day} = plate

</script>

<article class="menu">
    <div class="img-container">
        <img src="{img}" alt="{Name}">
    </div>
    <div class="menu-footer">
        <p class="menu-title">{Name}</p>
        <p class="menu-price">{Price}</p>
        <p class="menu-day">{Day}</p>
    </div>
</article>
