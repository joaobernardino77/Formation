<script>
  //pages
	// import Login from './pages/Login.svelte'
  // import Checkout from './pages/Checkout.svelte'
  import Home from './pages/Home.svelte'

  //
  import { Router, Route, Link } from 'svelte-routing'

</script>

<Router>

  <Route path ="/" component= {Home} />

<!--   <Route path ="/login" component= {Login} /> -->
</Router>
