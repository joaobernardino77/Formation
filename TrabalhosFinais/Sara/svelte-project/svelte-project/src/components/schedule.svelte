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
    Type: "Fish",
    Price: 6,
    img:
      "https://cdn.pixabay.com/photo/2016/11/18/17/42/barbecue-1836053_960_720.jpg",
  },
  {
    Name: "Fish Soup",
    Day: "Friday",
    Type: "Meat",
    Price: 7,
    img:
      "https://cdn.pixabay.com/photo/2018/01/01/17/57/fish-soup-3054627_960_720.jpg",
  },
];
    
    let total = 0;

  function handleSubmit(event) {	
    const formData = new FormData(event.target)
    const formSchedule = {};
    let dayChoices = [];
    let platesUserChoices = [];

    for (const [k, v] of formData.entries()) {
        formSchedule[k] = v

        if (k != "type") {
            dayChoices.push(v);
        }

    }

    platesUserChoices = plates.filter((plate) => {
        if (
        dayChoices.indexOf(plate.Day.toLowerCase()) >= 0 &&
        plate.Type.toLowerCase() === formSchedule.type.toLowerCase()
        ) {
        return true;
        }
        return false;
    });

    if (platesUserChoices.length > 0) {
        total = platesUserChoices
        .map(function (res) {
            return res.Price;
        })
        .reduce(function (acc, curr) {
            return acc + curr;
        });
    }
  }
</script>

<div id="schedule"class="schedule">
    <h2>Schedule</h2>
    <form on:submit|preventDefault={handleSubmit} id="form-schedule" class="form-schedule">
        <div>
            <input type="checkbox" id="monday" name="monday" value="monday">
            <label for="monday">Monday</label>
        </div>
        <div>
            <input type="checkbox" id="tuesday" name="tuesday" value="tuesday">
            <label for="tuesday">Tuesday</label>
        </div>
        <div>
            <input type="checkbox" id="wednesday" name="wednesday" value="wednesday">
            <label for="wednesday">wednesday</label>
        </div>
        <div>
            <input type="checkbox" id="thursday" name="thursday" value="thursday">
            <label for="thursday">thursday</label>
        </div>
        <div>
            <input type="checkbox" id="friday" name="friday" value="friday">
            <label for="friday">friday</label>
        </div>
        <select name="type" id="type">
            <option value="meat">Meat</option>
            <option value="fish">Fish</option>
        </select>
        <input type="submit" value="Schedule">
    </form>
    <div>
        <div class="total">Total:</div>
    <div id="total" >{total}</div>
    </div>
</div>