<script>
  import plates from '../resources/js/plates';
</script>

<style>
  
  .menu{
    overflow: auto;
    margin-bottom: 20%;
  }

  .menu img{
      width: 80%;
  }

/*** MENU ***/
  *{
    box-sizing: border-box;
}

/* Three image containers (use 25% for four, and 50% for two, etc) */
.menu-body{
    float: left;
    width: 33.33%;
    padding: 5px;
    /* height: 30%; */
}
.menu-body p{
    text-align: center;
}

.menu-body p img{
    height: 300px;
    /* height: auto; */
    border-radius: 2%;
}

/* Clear floats after image containers */
.menu-container::after {
    content: "";
    clear: both;
    display: table;
  }


</style>


<div id="menu">
  <h1>Menu</h1>

  <p>Available menus</p>

  <div id="menu-content" class="menu">

    {#each plates as plate}

      <div class="menu-body">
        <p>Day: {plate.Day}</p>
        <p>Plate: {plate.Name}</p>
        <p>Type: {plate.Type}</p>
        <p>Price: {plate.Price} €</p>
        <p>
          <img src="{plate.img}" alt="{plate.Name}">
        </p>
      </div>
    {/each}
  </div>
</div>
