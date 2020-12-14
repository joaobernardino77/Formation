<script>
	import Navbar from './components/Navbar.svelte'
	import Hero from './components/Hero.svelte'
	import Menu from './components/Menu.svelte'
	import About from './components/About.svelte'
	import Footer from './components/Footer.svelte'
	import Modal from './components/Modal.svelte'
</script>

<main>
	<Modal>
		<Navbar/>
	</Modal>
	<div class="page-main">
		<Hero/>
		<Menu/>
		<About/>
	</div>
	<Footer/>
</main>

