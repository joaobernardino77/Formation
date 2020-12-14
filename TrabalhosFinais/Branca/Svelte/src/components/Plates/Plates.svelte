<script>
  export let title = "";
  import { onMount, onDestroy } from "svelte";
  import plates from "../../stores/defaultPlates";
  import Plate from "./Plate.svelte";
</script>


<div id="menu" class="menu-section">
  <div class="menu-section-inside">
    <div class="menu-header">
      <h2>{title}</h2>
    </div>

    <div class="meals">
      {#each $plates as plate}
        <Plate {plate}/>
      {/each}
    </div>
  </div>
</div>
