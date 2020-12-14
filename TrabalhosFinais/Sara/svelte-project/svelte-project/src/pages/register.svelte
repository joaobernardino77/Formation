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
      .post(`http://localhost:1337/auth/local/register`, {
        username: formUser.username,
        email: formUser.email,
        password: formUser.password,
      })

      .then((response) => {
        localStorage.setItem('userdata', JSON.stringify(response.data));
        alert("user registered");
        window.location.href = "/";
      })
      .catch((error) => {
        alert("An error occurred:", error.response);
      });
  }
  
</script>

<Navbar />
<div id="register">
  <form on:submit|preventDefault={handleSubmit}>
    <input type="text" name="username" id="username" placeholder="username" required />
    <input type="email" name="email" id="email" placeholder="email" required />
    <input type="password" name="password" id="password" placeholder="password" required />
    <input
      type="password"
      id="passwordconfirm"
      placeholder="password confirmation"
      required />
    <input type="submit" value="Register" />
  </form>
  <p>
    or login
    <Link to="/login">here</Link>
  </p>
</div>
