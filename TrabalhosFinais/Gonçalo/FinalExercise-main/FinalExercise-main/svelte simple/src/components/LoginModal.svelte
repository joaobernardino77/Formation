<script>
    import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';
	

  const { open } = getContext('simple-modal');
	
	let opening = false;
	let opened = false;
	let closing = false;
    let closed = false;
    
    import RegisterModal from './RegisterModal.svelte'

    const showRegisterModal = () => {
        open(RegisterModal,{message: "It's a popup!"})
    }

    import Notification from './Notification.svelte'

    const showNotification = (messageColor, message) => {
        open(Notification,{message,messageColor})
    }
    //////////////////////////////////////////
    const handleWarging = () => {
    if(loginInput.value && passwordInput.value){
        loginBtn.disabled = false
        pWarning.style.display= "none"
    } else {
        loginBtn.disabled = true
        pWarning.style.display= ""
    }}

    const handleLogin = (event) => {
        var allRegister = JSON.parse(localStorage.getItem('allRegistered'))
        for(var i = 0; i < allRegister.length; i++){
            if(allRegister[i].username === loginInput.value && allRegister[i].password === passwordInput.value){
            showNotification('green','Login was successfull')
            localStorage.setItem('login', 'true')
            setTimeout(()=> {
                window.location.reload()
                return false;
            }, 3100)
            return;
            }
        }
        showNotification('red','Wrong credentials')
    }
</script>
<div id="myModal">
    <div style="margin-top: 10%; text-align: center;">
        <div class="modal-header">
          <h2>Login</h2>
        </div>
        <div class="modal-body">
            <form>
                <input type="text" placeholder="Username" id="loginInput" on:input={handleWarging}>
                <br>
                <input type="password" placeholder="Password" id="passwordInput" on:input={handleWarging}>
                <br>
                <button id="loginBtn" type="submit" disabled on:click={handleLogin}>Login</button>
                <p id="pWarning">Please fill out all fields</p>
            </form>
        </div>
        <div class="modal-footer">
          <p>If you are not registered click <a id="registerBtn" on:click={showRegisterModal}>here</a></p>
        </div>
      </div>
</div>
