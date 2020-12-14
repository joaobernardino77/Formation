<script>

    import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';
	

  const { open, close } = getContext('simple-modal');
	
	let opening = false;
	let opened = false;
	let closing = false;
    let closed = false;
    
    import Notification from './Notification.svelte'

    const showNotification = (messageColor, message) => {
        open(Notification,{message,messageColor})
    }

    //////////////////////////////////////////
    const handleWarging = () => {
    if(registerLoginInput.value && registerPasswordInput.value){
        confirmRegisterBtn.disabled = false
        registerPWarning.style.display= "none"
    } else {
        confirmRegisterBtn.disabled = true
        registerPWarning.style.display= ""
    }}

    const handleRegister = (event) => {
        const username = registerLoginInput.value
        const password = registerPasswordInput.value
        var allRegistered = localStorage.getItem('allRegistered') ? JSON.parse(localStorage.getItem('allRegistered')) : []
        localStorage.setItem('allRegistered', JSON.stringify([...allRegistered, {username, password}]))
        showNotification('green','Register was successfull')
        setTimeout(() => {
            close(Notification)
        },1000)
    }
</script>
<div id="myModalRegister">
    <div style="margin-top: 10%; text-align: center;">
        <div class="modal-header">
          <h2>Register</h2>
        </div>
        <div class="modal-body">
            <form>
                <input type="text" placeholder="Username" id="registerLoginInput" on:input={handleWarging}>
                <br>
                <input type="password" placeholder="Password" id="registerPasswordInput" on:input={handleWarging}>
                <br>
                <button id="confirmRegisterBtn" type="submit" disabled on:click|preventDefault={handleRegister}>Register</button>
                <p id="registerPWarning">Please fill out all fields</p>
            </form>
        </div>
        <div class="modal-footer">
        </div>
      </div>
</div>
