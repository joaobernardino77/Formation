<script>
	var plates = [
		{
			Name: "Salmon",
			Day: "Monday",
			Type: "Fish",
			Price: 8,
			img:
				"https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_960_720.jpg",
		},
		{
			Name: "Lasagna",
			Day: "Monday",
			Type: "Meat",
			Price: 7,
			img:
				"https://cdn.pixabay.com/photo/2016/12/11/22/41/lasagna-1900529_960_720.jpg",
		},
		{
			Name: "Sardines",
			Day: "Tuesday",
			Type: "Fish",
			Price: 6,
			img:
				"https://cdn.pixabay.com/photo/2016/06/30/18/49/sardines-1489626_960_720.jpg",
		},
		{
			Name: "Chicken",
			Day: "Tuesday",
			Type: "Meat",
			Price: 5,
			img:
				"https://cdn.pixabay.com/photo/2016/11/18/17/42/barbecue-1836053_960_720.jpg",
		},
		{
			Name: "Fish And Chips",
			Day: "Wednesday",
			Type: "Fish",
			Price: 5,
			img:
				"https://cdn.pixabay.com/photo/2017/12/26/04/51/fish-and-chip-3039746_960_720.jpg",
		},
		{
			Name: "Hamburguer",
			Day: "Wednesday",
			Type: "Meat",
			Price: 4,
			img:
				"https://cdn.pixabay.com/photo/2016/03/05/19/37/appetite-1238459_960_720.jpg",
		},
		{
			Name: "Sushi",
			Day: "Thursday",
			Type: "Fish",
			Price: 10,
			img:
				"https://cdn.pixabay.com/photo/2016/11/25/16/08/sushi-1858696_960_720.jpg",
		},
		{
			Name: "Spaghetti bolognese",
			Day: "Thursday",
			Type: "Meat",
			Price: 7,
			img:
				"https://cdn.pixabay.com/photo/2019/10/13/14/23/spaghetti-bolognese-4546233_960_720.jpg",
		},
		{
			Name: "Chicken",
			Day: "Friday",
			Type: "Meat",
			Price: 6,
			img:
				"https://cdn.pixabay.com/photo/2016/11/18/17/42/barbecue-1836053_960_720.jpg",
		},
		{
			Name: "Fish Soup",
			Day: "Friday",
			Type: "Fish",
			Price: 7,
			img:
				"https://cdn.pixabay.com/photo/2018/01/01/17/57/fish-soup-3054627_960_720.jpg",
		},
	];
	let showMenu = false;
	let showLogin = false;
	let loggedIn = false;

	const Menu = () => (showMenu = showMenu ? false : true);
	const Login = () => (showLogin = showLogin ? false : true);

	// storing input from register-form
	function store() {
		// Name and Password from the register-form
		var name1 = document.getElementById("user").value;
		var pw = document.getElementById("pw").value;

		localStorage.setItem("user", name1);
		localStorage.setItem("pw", pw);
	}

	// check if stored data from register-form is equal to entered data in the   login-form
	function check() {
		// stored data from the register-form
		var storedName = localStorage.getItem("user");
		var storedPw = localStorage.getItem("pw");

		// entered data from the login-form
		var userName = document.getElementById("userName").value;
		var userPw = document.getElementById("userPw").value;

		// check if stored data from register-form is equal to data from login form
		if (userName !== storedName || userPw !== storedPw) {
			alert("ERROR");
		} else {
			alert("You are loged in.");
			loggedIn = true;
		}
	}
</script>

<style>
	#ul_top {
		list-style-type: none;
		margin: 0;
		padding: 0;
		overflow: hidden;
		background-color: #333;
	}

	#il_top {
		float: left;
	}

	#il_top a {
		display: block;
		color: white;
		text-align: center;
		padding: 14px 16px;
		text-decoration: none;
	}

	#il_top a:hover {
		background-color: #111;
	}

	div {
		height: 100%;
	}

	article {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		padding: 20px;
	}

	h1 {
		font-size: 1.75rem;
		margin: 0 0 0.75rem 0;
	}

	/* Pattern styles */
	.container {
		display: table;
		width: 100%;
		text-align: center;
	}

	.left-half {
		background-color: #b1b1b1;
		border-style: solid;
		border-width: thin;
		position: absolute;
		left: 0px;
		width: 50%;
		height: 100%;
	}

	.right-half {
		background-color: #b1b1b1;
		border-style: solid;
		border-width: thin;
		position: absolute;
		right: 0px;
		width: 50%;
		height: 100%;
	}

	.image {
		max-height: 15%;
		max-width: 15%;
	}
</style>

<main>
	<nav>
		<ul id="ul_top">
			<li id="il_top"><a href="#about">About</a></li>
			<li id="il_top"><a href="#menu" on:click={Menu}>Menu</a></li>
			{#if loggedIn === true}
				<li id="il_top"><a href="#contact">Schedule</a></li>
			{/if}
			<li id="il_top" style="float:right">
				<a href="#login" on:click={Login}> LOGIN</a>
			</li>
		</ul>
	</nav>
	{#if showLogin === true}
		<h1>Login</h1>
		<form id="register-form">
			<input id="user" type="text" placeholder="Name" value="" />
			<input id="pw" type="password" placeholder="Password" value="" />
			<input
				id="rgstr_btn"
				type="submit"
				value="get Account"
				on:click|once={store} />
		</form>

		<form id="login-form">
			<input
				id="userName"
				type="text"
				placeholder="Enter Username"
				value="" />
			<input
				id="userPw"
				type="password"
				placeholder="Enter Password"
				value="" />
			<input
				id="login_btn"
				type="submit"
				value="Login"
				on:click={check} />
		</form>
	{/if}
	<div id="about">
		<section>
			<hr />
			<h2 style="text-align:center">About the restaurant</h2>
			<hr />
			<p>
				Loraaa
			</p>
			<hr />
		</section>
	</div>

	{#if showMenu === true}
		<section class="container">
			<h1 style="text-align:center;">MENU</h1>
			<hr />
			<div class="left-half" id="menu">
				<article>
					<h1>MEAT</h1>
					{#each plates as { Name, Day, Type, Price, img }}
						{#if Type === 'Meat'}
							<h1><b>{Name}</b> <span> - {Price} €</span></h1>
							<h6>Done at {Day}</h6>
							<img class="image" src={img} alt="food" />
						{/if}
					{/each}
				</article>
			</div>
			<div class="right-half">
				<article>
					<h1>FISH</h1>
					{#each plates as { Name, Day, Type, Price, img }}
						{#if Type === 'Fish'}
							<h1><b>{Name}</b> <span> - {Price} €</span></h1>
							<h6>Done at {Day}</h6>
							<img class="image" src={img} alt="food" />
						{/if}
					{/each}
				</article>
			</div>
		</section>
	{/if}
</main>
