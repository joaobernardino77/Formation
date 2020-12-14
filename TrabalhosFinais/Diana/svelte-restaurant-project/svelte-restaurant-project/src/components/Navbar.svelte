<script>
  import { Route, Router, Link} from 'svelte-routing';
  import About from '../pages/About.svelte';
  import Menu from './Menu.svelte';
  import Schedule from './Schedule.svelte';

  import { login } from '../resources/js/restaurant'
  import { logout } from '../resources/js/restaurant'
  import { register } from '../resources/js/restaurant'

  let isUserLogged = localStorage.getItem('isUserlogged');

</script>

<style>
  /* Add a black background color to the top navigation */
  .topnav {
    background-color: rgb(109, 108, 108);
    overflow: hidden;
    width: 100%;
	  position: relative;
  }
  
  /* Style the links inside the navigation bar */
  .topnav-link {
    float: left;
    color: #f8f4f4;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px;
  }
  
  /* Change the color of links on hover */
  .topnav-link:hover {
    background-color: #ddd;
    color: black;
    text-decoration: none;
  }

  .topnav-link{
      color:red !important;
  }

</style>

<Router>
    <div class="topnav">
        <!-- <Link to="/home">Home</Link> -->
        <div class="topnav-link">
          <Link to="/about">About</Link>
        </div>
        <div class="topnav-link">
          <Link to="/menu">Menu</Link>
        </div>
      {#if isUserLogged}
        <div class="topnav-link">
          <Link to="/schedule">Schedule</Link>
        </div>
          <div class="topnav-link">
          <Link to="" on:click={logout}>Logout</Link>
          </div>
      {:else}
        <div class="topnav-link">
          <Link to="" on:click={register}>Register</Link>
        </div>
        <div class="topnav-link">
          <Link to="" on:click={login}>Login</Link>
        </div>
      {/if}
</div>

    <Route path="/about" component={About}></Route>
    <Route path="/menu" component={Menu}/>
    <Route path="/schedule" component={Schedule}/>

</Router>