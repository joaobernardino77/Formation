<script>
    import plates from '../localMenus'
    import { getContext } from 'svelte';
    import scheduleUser from '../strapi/scheduleUser'

    var mondayMeals = plates.filter(plate => plate.Day === 'Monday')
    var tuesdayMeals = plates.filter(plate => plate.Day === 'Tuesday')
    var wednesdayMeals = plates.filter(plate => plate.Day === 'Wednesday')
    var thursdayMeals = plates.filter(plate => plate.Day === 'Thursday')
    var fridayMeals = plates.filter(plate => plate.Day === 'Friday')

    let mondaySelected
    let tuesdaySelected
    let wednesdaySelected
    let thursdaySelected
    let fridaySelected

    var totalPrice
    $: totalPrice = parseInt(mondaySelected) + parseInt(tuesdaySelected) + parseInt(wednesdaySelected) + parseInt(thursdaySelected) + parseInt(fridaySelected)

    const { open, close } = getContext('simple-modal');

    let opening = false;
	let opened = false;
	let closing = false;
    let closed = false;
    
    import Notification from './Notification.svelte'

    const showNotification = (messageColor, message) => {
        open(Notification,{message}, {messageColor})
    }

    const handleScheduleSubmit = async () => {
        /*
        var scheduleChoices = {
            monday: monday.options[monday.selectedIndex].text === 'Select' ? '' : monday.options[monday.selectedIndex].text,
            tuesday: tuesday.options[tuesday.selectedIndex].text === 'Select' ? '' : tuesday.options[tuesday.selectedIndex].text,
            wednesday: wednesday.options[wednesday.selectedIndex].text === 'Select' ? '' : wednesday.options[wednesday.selectedIndex].text,
            thursday: thursday.options[thursday.selectedIndex].text === 'Select' ? '' : thursday.options[thursday.selectedIndex].text,
            friday: friday.options[friday.selectedIndex].text === 'Select' ? '' : friday.options[friday.selectedIndex].text
        }
        console.log(scheduleChoices)
        */

        var monday = mondaySelect.options[mondaySelect.selectedIndex].text === 'Select' ? '' : mondaySelect.options[mondaySelect.selectedIndex].text
        var tuesday = tuesdaySelect.options[tuesdaySelect.selectedIndex].text === 'Select' ? '' : tuesdaySelect.options[tuesdaySelect.selectedIndex].text
        var wednesday = wednesdaySelect.options[wednesdaySelect.selectedIndex].text === 'Select' ? '' : wednesdaySelect.options[wednesdaySelect.selectedIndex].text
        var thursday = thursdaySelect.options[thursdaySelect.selectedIndex].text === 'Select' ? '' : thursdaySelect.options[thursdaySelect.selectedIndex].text
        var friday = fridaySelect.options[fridaySelect.selectedIndex].text === 'Select' ? '' : fridaySelect.options[fridaySelect.selectedIndex].text
        var user = JSON.parse(localStorage.getItem('user'))
        var userToken = user.jwt

        const response = await scheduleUser({monday,tuesday,wednesday,thursday,friday,userToken})
        if(response){
          showNotification('green','Choices saved!')
            setTimeout(()=> {
                window.location.reload()
                return false;
            }, 3100)
        } else {
          showNotification('red','Something went wrong, please try again!')
        }
        /*
        localStorage.setItem('schedule', JSON.stringify(scheduleChoices))
            showNotification('green','Choices saved!')
            setTimeout(()=> {
                window.location.reload()
                return false;
            }, 3100)
        */
        }
</script>

<div id="scheduleModal">
    <div style="margin-top: 10%; text-align: center;">
        <div class="modal-header">
          <h2>Schedule Your Meal</h2>
        </div>
        <div class="modal-body">
          <p>Monday</p>
          <select bind:value={mondaySelected} id="mondaySelect">
            <option value="0">Select</option>
            {#each mondayMeals as mondayPlate}
                <option value={mondayPlate.Price}>{mondayPlate.Name}</option>
            {/each}
          </select>
          <p>Tuesday</p>
            <select bind:value={tuesdaySelected} id="tuesdaySelect">
            <option value="0">Select</option>
            {#each tuesdayMeals as tuesdayPlate}
                <option value={tuesdayPlate.Price}>{tuesdayPlate.Name}</option>
            {/each}
            </select>
            <p>Wednesday</p>
            <select bind:value={wednesdaySelected} id="wednesdaySelect">
              <option value="0">Select</option>
              {#each wednesdayMeals as wednesdayPlate}
                <option value={wednesdayPlate.Price}>{wednesdayPlate.Name}</option>
            {/each}
            </select>
            <p>Thursday</p>
            <select bind:value={thursdaySelected} id="thursdaySelect">
              <option value="0">Select</option>
              {#each thursdayMeals as thursdayPlate}
                <option value={thursdayPlate.Price}>{thursdayPlate.Name}</option>
            {/each}
            </select>
            <p>Friday</p>
            <select bind:value={fridaySelected} id="fridaySelect">
              <option value="0">Select</option>
              {#each fridayMeals as fridayPlate}
                <option value={fridayPlate.Price}>{fridayPlate.Name}</option>
            {/each}
            </select>
            <br/>
            <p id="totalPrice">Total: {totalPrice}€</p>
            <button id="scheduleBtn" on:click={handleScheduleSubmit}>Schedule</button>
        </div>
        <div class="modal-footer">
          <p>all food is made with love </p>
        </div>
      </div>
</div>