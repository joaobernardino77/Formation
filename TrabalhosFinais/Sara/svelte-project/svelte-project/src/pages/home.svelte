<script>
  import Navbar from "../components/navbar.svelte";
  import Intro from "../components/intro.svelte";
  import About from "../components/about.svelte";
  import Menu from "../components/menu.svelte";
  import Footer from "../components/footer.svelte";
  import Schedule from "../components/schedule.svelte";
  
  import { userdata } from "../store/store";
</script>

<Navbar />
<Intro />
<Menu />
{#if userdata && userdata.jwt != null}
  <Schedule />
{/if}
<About />
<Footer />
