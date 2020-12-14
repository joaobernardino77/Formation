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

plates.forEach(function (plate) {
  var element = document.createElement("div");
  element.className = "plate";
  element.innerHTML =
    "<img src='" +
    plate.img +
    "'><h4>" +
    plate.Name +
    "</h4>" +
    "<p>Day: " +
    plate.Day +
    "</p><p>Type: " +
    plate.Type +
    "</p><p>Price: " +
    plate.Price +
    "</p>";
  document.getElementById("menu").appendChild(element);
});

//Is logged in change menu and schedule

var isLoggedIn = localStorage.getItem("isLoggedIn")
  ? localStorage.getItem("isLoggedIn")
  : null;
var menuItemLogin = document.getElementById("login");
var menuItemLogout = document.getElementById("logout");
var scheduleElement = document.getElementById("schedule");

if (isLoggedIn) {
  menuItemLogin.style.display = "none";
  menuItemLogout.style.display = "inline-block";
  scheduleElement.style.display = "block";
} else {
  menuItemLogin.style.display = "inline-block";
  menuItemLogout.style.display = "none";
  scheduleElement.style.display = "none";
}

//Logout

menuItemLogout.addEventListener("click", function () {
  localStorage.clear();
  location.reload();
});

//Schedule

var form = document.getElementById("form-schedule");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  var typeInput = document.getElementById("type");
  var mondayInput = document.getElementById("monday");
  var tuesdayInput = document.getElementById("tuesday");
  var wednesdayInput = document.getElementById("wednesday");
  var thursdayInput = document.getElementById("thursday");
  var fridayInput = document.getElementById("friday");
  var totalElement = document.getElementById("total");

  // create schedule object
  var schedule = {
    monday: mondayInput.checked,
    tuesday: tuesdayInput.checked,
    wednesday: wednesdayInput.checked,
    thursday: thursdayInput.checked,
    friday: fridayInput.checked,
    type: typeInput.value,
  };
  // save to localstorage
  localStorage.setItem("schedule", JSON.stringify(schedule));

  // calculate total
  var platesUserChoices = [];

  // Days
  var dayChoices = [];
  if (mondayInput.checked) {
    dayChoices.push(mondayInput.value);
  }
  if (tuesdayInput.checked) {
    dayChoices.push(tuesdayInput.value);
  }
  if (wednesdayInput.checked) {
    dayChoices.push(wednesdayInput.value);
  }
  if (thursdayInput.checked) {
    dayChoices.push(thursdayInput.value);
  }
  if (fridayInput.checked) {
    dayChoices.push(fridayInput.value);
  }

  // array of plates by type
  platesUserChoices = plates.filter((plate) => {
    if (
      dayChoices.indexOf(plate.Day.toLowerCase()) >= 0 &&
      plate.Type.toLowerCase() === typeInput.value.toLowerCase()
    ) {
      return true;
    }
    return false;
  });

  // calculate total price
  var total = 0;

  if (platesUserChoices.length > 0) {
    total = platesUserChoices
      .map(function (res) {
        return res.Price;
      })
      .reduce(function (acc, curr) {
        return acc + curr;
      });
  }

  totalElement.textContent = total;
});
