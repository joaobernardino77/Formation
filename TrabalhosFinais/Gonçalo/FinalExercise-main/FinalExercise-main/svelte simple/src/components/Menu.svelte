<script>
    import plates from '../localMenus'
    import Plate from './Plate.svelte'
</script>

<div class="site-section" id="menu">
    <h2 class="site-section-title about-title">Menu</h2>
    <div class="menus-center" id="addMenu">
        {#each plates as plate}
            <Plate {plate} />
        {/each}
    </div>
</div>
