<script>
  import Home from "./pages/home.svelte";
  import Login from "./pages/login.svelte";
  import Register from "./pages/register.svelte";

  import { Router, Route, Link } from "svelte-routing";
</script>

<Router>
  <Route path="/" component={Home} />
  <Route path="/login" component={Login} />
  <Route path="/register" component={Register} />
</Router>
