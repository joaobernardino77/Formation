<script>
  import { Link } from "svelte-routing";
  import { userdata } from "../store/store";

  function handleLogout() {
    localStorage.clear();
    location.reload();
  }
</script>

<header>
  <h2 id="page-header">
    <img src="/images/log.png" alt="logo" />
    The restaurant
  </h2>

  <nav id="main-navigation">
    <ul>
      <li><a href="/#about">About</a></li>
      <li><a href="/#menu">Menu</a></li>
      {#if userdata && userdata.jwt != null}
        <li><a on:click|once={handleLogout}>Logout</a></li>
      {:else}
        <li>
          <Link to="/login">Login</Link>
        </li>
      {/if}
    </ul>
  </nav>
</header>
