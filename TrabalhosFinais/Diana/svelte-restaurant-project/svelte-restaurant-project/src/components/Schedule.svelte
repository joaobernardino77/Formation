<script>
    import { schedule } from '../resources/js/restaurant'
</script>

<style>

  .schedule-content{
    float: left;
    padding-right: 30px;
    display: inline;
  }

  .schedule-title{
    font-size: large;
    font-weight: bold;
  }
  
  .select-day{
    width: 80%;
    overflow: auto;
    height: 120px;
  }
  .select-plate{
    width: 10%;
  }

  .btn-schedule {
    clear: both;
    padding-top: 10px;
  }

  .btn-schedule button{
    background-color: lightgreen;
  }

  .schedule-total{
    font-weight: bolder;
  }

</style>

<div id='schedule'>
    <h1>Schedule</h1>

    <div class="schedule-content">

      <div class="schedule-title">
        <label for="day">Please choose days:</label>
      </div>
        <select class="select-day" name="day" id="day" multiple>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
        </select>
      </div>
     
      <div class="schedule-title">
        <label for="Plate">Please choose your plate:</label>
      </div>
      <div> 
        <select class="select-plate" name="plate" id="plate">
          <option value="Meat">Meat</option>
          <option value="Fish">Fish</option>
        </select>
      </div>

      <div class="btn-schedule">
        <button id='btn-schedule' type="button" on:click={schedule}>Schedule</button>
      </div>
    
      <div>
        <p class="schedule-total" id="total"></p>
      </div>

    </div>


