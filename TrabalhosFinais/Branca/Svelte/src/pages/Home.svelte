<script>
  import Navbar from '../components/Navbar/Navbar.svelte';
  import Hero from '../components/Hero.svelte';
  import About from '../components/About.svelte';
  import Plates from '../components/Plates/Plates.svelte';
  import Footer from '../components/Footer.svelte';
  import { Link } from 'svelte-routing';
</script>

<Navbar />
<Hero />
<About title= "About"/>
<Plates title= "Menu"/>
<Footer />
