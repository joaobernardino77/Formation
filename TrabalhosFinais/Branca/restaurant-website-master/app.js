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
    Name: "Fish Soup",
    Day: "Friday",
    Type: "Fish",
    Price: 7,
    img:
      "https://cdn.pixabay.com/photo/2018/01/01/17/57/fish-soup-3054627_960_720.jpg",
  },
  {
    Name: "Chicken",
    Day: "Friday",
    Type: "Meat",
    Price: 6,
    img:
      "https://cdn.pixabay.com/photo/2016/11/18/17/42/barbecue-1836053_960_720.jpg",
  },
];

function lowerCasePlates() {
  for (var i = 0; i < plates.length; i++) {
    for (var key in plates[i]) {
      if (key.toLowerCase() !== key) {
        plates[i][key.toLowerCase()] = plates[i][key];
        delete plates[i][key];
      }
    }
  }
  // console.log(plates);
}
lowerCasePlates();

var meals = document.querySelector(".meals");

function displayMenu(item) {
  var div = document.createElement("div");
  div.setAttribute("class", "dish-box");
  div.innerHTML = `<img class="dish-image" src="${item.img}" alt="${item.name}"/>
                <div class="dish-info">
                  <div>
                    <div class="dish-details">
                      <div class="dish-day">
                        <i class="far fa-calendar-alt"></i>
                        <p>${item.day}</p>
                      </div>
                      <div class="dish-type">
                        <i class="fas fa-utensils"></i>
                        <p>${item.type}</p>
                      </div>
                      <div class="dish-price">
                        <i class="fas fa-wallet"></i>
                        <p>${item.price}€</p>
                      </div>
                    </div>
                    <h4 class="dish-name">${item.name}</h4>
                  </div>
                </div>`;
  meals.appendChild(div);
}

function getDishes() {
  plates.forEach((item) => {
    displayMenu(item);
  });
}

window.onload = function () {
  this.getDishes();
  keepUserLogged();
};

// modal close and open
function startModal(choosenModal) {
  var modal = document.getElementById(choosenModal);
  if (modal) {
    modal.classList.add("open-modal");
    modal.addEventListener("click", (x) => {
      if (x.target.id == choosenModal || x.target.className == "close-button") {
        modal.classList.remove("open-modal");
      }
    });
  }
}

var buttonLogin = document.querySelector(".login-user");
buttonLogin.addEventListener("click", () => startModal("login-container"));

var buttonRegister = document.querySelector(".register-user");
buttonRegister.addEventListener("click", () =>
  startModal("register-container")
);

var linkRegister = document.querySelector(".register-thru-login");
linkRegister.addEventListener("click", () => startModal("register-container"));

var buttonLogout = document.querySelector(".logout-user");
buttonLogout.addEventListener("click", () => startModal("logout-container"));

// save user and password
function store() {
  var email = document.getElementById("email");
  var password = document.getElementById("password");
  var lowerCaseLetters = /[a-z]/g;
  var upperCaseLetters = /[A-Z]/g;
  var numbers = /[0-9]/g;

  if (email.value.length == 0) {
    alert("Please fill in email");
  } else if (password.value.length == 0) {
    alert("Please fill in password");
  } else if (email.value.length == 0 && password.value.length == 0) {
    alert("Please fill in email and password");
  } else if (password.value.length < 5) {
    alert("Password need to have more than 5 characters");
  } else if (!password.value.match(numbers)) {
    alert("please add 1 number");
  } else if (!password.value.match(upperCaseLetters)) {
    alert("please add 1 uppercase letter");
  } else if (!password.value.match(lowerCaseLetters)) {
    alert("please add 1 lovercase letter");
  } else {
    //localStorage.setItem("email", email.value);
    //localStorage.setItem("password", password.value);

    var users = JSON.parse(localStorage.getItem("Users")) || [];
    var userData = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      choosenplates: [],
    };
    users.push(userData);
    localStorage.setItem("Users", JSON.stringify(users));

    alert("Your account has been created");
    var modalRgt = document.getElementById("register-container");
    modalRgt.classList.remove("open-modal");
    var modalLog = document.getElementById("login-container");
    modalLog.classList.add("open-modal");
  }
}

//checking
var isLogin = false;

function checkLogin() {
  var userEmail = document.getElementById("userEmail").value;
  var userPassword = document.getElementById("userPassword").value;
  var userRemember = document.getElementById("rememberMe");

  if (localStorage.getItem("Users")) {
    var allUsers = JSON.parse(localStorage.getItem("Users"));
    var matchedUser = allUsers.filter((user) => {
      return userEmail === user.email && userPassword === user.password;
    });
    if (matchedUser.length) {
      alert("You are logged in " + userEmail);
      isLogin = true;
      showInsideLogin();
      saveCurrentUser();
      var modalLogin = document.getElementById("login-container");
      modalLogin.classList.remove("open-modal");
    } else {
      alert("Error on login");
    }
  } else {
    alert("Error on login");
  }
}

function saveCurrentUser() {
  rememberChoice = document.getElementById("rememberMe").checked;
  if (rememberChoice == true || rememberChoice == false) {
    var crrUser = JSON.parse(localStorage.getItem("CurrentUser")) || [];
    var crrUserData = {
      crremail: document.getElementById("userEmail").value,
      crrpassword: document.getElementById("userPassword").value,
      remenber: document.getElementById("rememberMe").checked,
    };
    crrUser.pop();
    crrUser.push(crrUserData);
    localStorage.setItem("CurrentUser", JSON.stringify(crrUser));
  }
}

function keepUserLogged() {
  if (localStorage.getItem("CurrentUser") !== null) {
    var status = JSON.parse(localStorage.getItem("CurrentUser"))[0].remenber;
    if (status === true) {
      showInsideLogin();
    } else {
      localStorage.removeItem("CurrentUser");
      window.location.reload();
    }
  }
}

// show btn schedule and btn logout
function showInsideLogin() {
  var loginBtn = document.querySelector(".login-user");
  var registerBtn = document.querySelector(".register-user");
  var scheduleBtn = document.querySelector(".schedule");
  var logoutBtn = document.querySelector(".logout-user");
  var scheduleSection = document.querySelector(".schedule-section");

  loginBtn.parentNode.removeChild(loginBtn);
  registerBtn.parentNode.removeChild(registerBtn);

  scheduleBtn.style.display = "inline-block";
  logoutBtn.style.display = "inline-block";
  scheduleSection.style.display = "block";
}

function logout() {
  // window.localStorage.clear();
  localStorage.removeItem("CurrentUser");
  window.location.reload();
}

function continueLogin() {
  isLogin = true;
  var modalLogout = document.getElementById("logout-container");
  modalLogout.classList.remove("open-modal");
}

// schedule items

// form with items
var daysChoose = "";
for (var i = 0; i < plates.length; i++) {
  if (daysChoose !== plates[i].day) {
    daysChoose = plates[i].day;

    // select div where to insert
    var div = document.querySelector(".choose-items");

    // create div with attributes
    var listDiv = document.createElement("div");
    listDiv.setAttribute("class", "wrapper-option");

    // create Day with attributes
    var dayElement = document.createElement("p");
    dayElement.setAttribute("id", "day");
    dayElement.setAttribute("value", plates[i].day);
    var dayTextNode = document.createTextNode(plates[i].day + ":");

    // create form with attributes
    var formElements = document.createElement("form");
    formElements.setAttribute("class", "myForm");

    // create select with attributes
    var selectOptions = document.createElement("select");
    selectOptions.setAttribute("id", "select" + daysChoose);

    // create options with attributes + text  None
    var optionNone = document.createElement("option");
    optionNone.setAttribute("value", "none");
    var nodeNone = document.createTextNode("None");

    // create options with attributes + text  Fish
    var optionFish = document.createElement("option");
    optionFish.setAttribute("value", plates[i].name);
    var nodeFish = document.createTextNode(plates[i].name);

    optionNone.appendChild(nodeNone);
    optionFish.appendChild(nodeFish);
    selectOptions.appendChild(optionNone);
    selectOptions.appendChild(optionFish);
    formElements.appendChild(selectOptions);
    listDiv.appendChild(formElements);
    dayElement.appendChild(dayTextNode);
    listDiv.insertBefore(dayElement, listDiv.childNodes[0]);
    div.appendChild(listDiv);
  } else {
    var getSelectElm = document.getElementById("select" + daysChoose);

    // create options Meat
    var optionMeat = document.createElement("option");
    optionMeat.setAttribute("value", plates[i].name);
    var nodeMeat = document.createTextNode(plates[i].name);

    optionMeat.appendChild(nodeMeat);
    getSelectElm.appendChild(optionMeat);
  }
}

// check want items was choosen

var sum = 0;
function checkSelection(choosenDay) {
  var all = document.getElementById(choosenDay);
  var choosenFood = all.options[all.selectedIndex].text;
  // var choosenFood = wednesday.options[wednesday.selectedIndex].value;
  if (choosenFood !== "None") {
    console.log(choosenFood);
    var div = document.querySelector(".final-order");

    var finalOrderItems = document.createElement("p");
    finalOrderItems.setAttribute("class", "order-item");
    var finalOrderItemsNode = document.createTextNode(choosenFood);

    finalOrderItems.appendChild(finalOrderItemsNode);
    div.insertBefore(finalOrderItems, div.childNodes[1]);

    var filterPlates = plates.filter(function (plate) {
      return plate.name == choosenFood;
    });
    sum += filterPlates[0].price;
  }
}

// print items choosen
function printSelection() {
  var div = document.querySelector(".final-order");
  div.innerHTML = "";

  var thankYou = document.createElement("h3");
  var thankYouNode = document.createTextNode(
    "Thank You for choosing White & Yellow"
  );

  var finalTitle = document.createElement("h4");
  finalTitle.setAttribute("class", "title-order");
  var finalTitleNode = document.createTextNode("Your final order:");

  var total = document.createElement("h4");
  total.setAttribute("class", "total");
  var totalNode = document.createTextNode("Total price:");

  total.appendChild(totalNode);
  div.insertBefore(total, div.childNodes[0]);

  finalTitle.appendChild(finalTitleNode);
  div.insertBefore(finalTitle, div.childNodes[0]);

  checkSelection("selectMonday");
  checkSelection("selectTuesday");
  checkSelection("selectWednesday");
  checkSelection("selectThursday");
  checkSelection("selectFriday");

  var finalOrderTotal = document.createElement("p");
  finalOrderTotal.setAttribute("class", "order-total");
  var finalOrderTotalNode = document.createTextNode(sum + "€");

  finalOrderTotal.appendChild(finalOrderTotalNode);
  div.appendChild(finalOrderTotal);

  thankYou.appendChild(thankYouNode);
  div.appendChild(thankYou);
}

function finishOrder() {
  var totalOrder = document.querySelector(".final-order");
  totalOrder.parentNode.appendChild(totalOrder);
  totalOrder.style.display = "block";
  printSelection();
}

function saveStorage() {
  // know which user is choosing
  var crrUser = JSON.parse(localStorage.getItem("CurrentUser"));
  var allUsers = JSON.parse(localStorage.getItem("Users"));
  var matchedUser = allUsers.filter((user) => {
    return (
      crrUser[0].crremail === user.email &&
      crrUser[0].crrpassword === user.password
    );
  });
  if (matchedUser.length !== 0) {
    var selectedVal2 = document.getElementById("selectMonday").value;
    var selectedVal3 = document.getElementById("selectTuesday").value;
    var selectedVal4 = document.getElementById("selectWednesday").value;
    var selectedVal5 = document.getElementById("selectThursday").value;
    var selectedVal6 = document.getElementById("selectFriday").value;
    if (selectedVal2 !== "none") {
      matchedUser[0].choosenplates.push({
        Monday: selectedVal2,
        OrderDate: new Date().toLocaleString(),
      });
    }
    if (selectedVal3 !== "none") {
      matchedUser[0].choosenplates.push({
        Tuesday: selectedVal3,
        OrderDate: new Date().toLocaleString(),
      });
    }
    if (selectedVal4 !== "none") {
      matchedUser[0].choosenplates.push({
        Wednesday: selectedVal4,
        OrderDate: new Date().toLocaleString(),
      });
    }
    if (selectedVal5 !== "none") {
      matchedUser[0].choosenplates.push({
        Thursday: selectedVal5,
        OrderDate: new Date().toLocaleString(),
      });
    }
    if (selectedVal6 !== "none") {
      matchedUser[0].choosenplates.push({
        Friday: selectedVal6,
        OrderDate: new Date().toLocaleString(),
      });
    }
  }
  localStorage.setItem("Users", JSON.stringify(allUsers));
}
