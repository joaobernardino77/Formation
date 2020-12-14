<script>
    
    import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';
	

  const { open } = getContext('simple-modal');
	
	let opening = false;
	let opened = false;
	let closing = false;
    let closed = false;
    
    import LoginModal from './LoginModal.svelte'

    const showLoginModal = () => {
        open(LoginModal)
    }

    import Notification from './Notification.svelte'

    const showNotification = (messageColor, message) => {
        open(Notification,{message,messageColor})
    }

    import ScheduleModal from './ScheduleModal.svelte'

    const showScheduleModal = () => {
        open(ScheduleModal)
    }

    var showLogin = ''
    var showSchedule = 'none'
    var showLogout = 'none'

    if(localStorage.getItem('login') === 'true'){
        showLogin = 'none'
        showSchedule = ''
        showLogout = ''
    }

    function scroll(e) {
        e.preventDefault()
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        })
    }

    const handleLogout = (event)=> {
        event.preventDefault()
        localStorage.removeItem('login')
        localStorage.removeItem('schedule')
        showNotification('green','Bye bye')
        setTimeout(()=> {
            window.location.reload()
        },1500)
    }
</script>

<header>
    <!-- Logo -->
    <h2 id="page-header" style="font-family: helvetica">
    Beverlly's Corner
    </h2>
    <!-- NAVIGATION -->
    <nav id="main-navigation">
    <ul>
        <li>
        <a href="#menu" on:click={scroll}>Menu</a>
        </li>
        <li>
        <a href="#about" on:click={scroll}>About</a>
        </li>
        <li>
        <a id="login" on:click={showLoginModal} style={`display: ${showLogin};`}>Login</a>
        </li>
        <li>
        <a id="schedule" style={`display: ${showSchedule};`} on:click={showScheduleModal}>Schedule</a>
        </li>
        <li>
        <a id="logout" style={`display: ${showLogout};`} on:click={handleLogout}>Logout</a>
        </li>
    </ul>
    </nav>
</header>
