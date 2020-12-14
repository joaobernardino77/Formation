<script>
  import { Link } from "svelte-routing";
  import Navbar from "../components/navbar.svelte";
  import axios from "axios";
  
  function handleSubmit(event) {	
    const formData = new FormData(event.target)
		const formUser = {}
		for (const [k, v] of formData.entries()) {
			formUser[k] = v
		}

    axios
      .post('http://localhost:1337/auth/local', {
        identifier: formUser.username,
        password: formUser.password,
      })
      .then(response => {
        localStorage.setItem('userdata', JSON.stringify(response.data));
        alert("user logged in");
        window.location.href = "/";
      })
      .catch(error => {
        alert('An error occurred:', error.response);
      });

  }
</script>

<Navbar />
<div id="login">
  <form on:submit|preventDefault={handleSubmit}>
    <input type="text" name="username" id="username" placeholder="username" required />
    <input type="password" name="password" id="password" placeholder="password" required />
    <input type="submit" value="Login" />
  </form>
  <p>
    or register
    <Link to="/register">here</Link>
  </p>
</div>
