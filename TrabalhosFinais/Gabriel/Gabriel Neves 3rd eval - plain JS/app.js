var plates = [
  { Name: "Salmon", Day: "Monday", Type: "Fish", Price: 8, img: "https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_960_720.jpg" },
  { Name: "Lasagna", Day: "Monday", Type: "Meat", Price: 7, img: "https://cdn.pixabay.com/photo/2016/12/11/22/41/lasagna-1900529_960_720.jpg" },
  { Name: "Sardines", Day: "Tuesday", Type: "Fish", Price: 6, img: "https://cdn.pixabay.com/photo/2016/06/30/18/49/sardines-1489626_960_720.jpg" },
  { Name: "Chicken", Day: "Tuesday", Type: "Meat", Price: 5, img: "https://cdn.pixabay.com/photo/2016/11/18/17/42/barbecue-1836053_960_720.jpg" },
  { Name: "Fish And Chips", Day: "Wednesday", Type: "Fish", Price: 5, img: "https://cdn.pixabay.com/photo/2017/12/26/04/51/fish-and-chip-3039746_960_720.jpg" },
  { Name: "Hamburguer", Day: "Wednesday", Type: "Meat", Price: 4, img: "https://cdn.pixabay.com/photo/2016/03/05/19/37/appetite-1238459_960_720.jpg" },
  { Name: "Sushi", Day: "Thursday", Type: "Fish", Price: 10, img: "https://cdn.pixabay.com/photo/2016/11/25/16/08/sushi-1858696_960_720.jpg" },
  { Name: "Spaghetti bolognese", Day: "Thursday", Type: "Meat", Price: 7, img: "https://cdn.pixabay.com/photo/2019/10/13/14/23/spaghetti-bolognese-4546233_960_720.jpg" },
  { Name: "Fish Soup", Day: "Friday", Type: "Fish", Price: 7, img: "https://cdn.pixabay.com/photo/2018/01/01/17/57/fish-soup-3054627_960_720.jpg" },
  { Name: "Chicken", Day: "Friday", Type: "Meat", Price: 6, img: "https://cdn.pixabay.com/photo/2016/11/18/17/42/barbecue-1836053_960_720.jpg" },
  { Name: "No service on weekends", Day: "Saturday", Type: "None", Price: 0, img: "" },
  { Name: "No service on weekends", Day: "Sunday", Type: "None", Price: 0, img: "" }
]

// Weekday
const today = new Date();
let weekDay = '';

switch (today.getDay()) {
  case 0:
    weekDay = 'Sunday';
    break;
  case 1:
    weekDay = 'Monday';
    break;
  case 2:
    weekDay = 'Tuesday';
    break;
  case 3:
    weekDay = 'Wednesday';
    break;
  case 4:
    weekDay = 'Thursday';
    break;
  case 5:
    weekDay = 'Friday';
    break;
  case 6:
    weekDay = 'Saturday';
    break;
}


// New user
const newUserInput = document.querySelector('.newUser')
const newUserPassword = document.querySelector('.newPassword')
const addNewUser = document.querySelector('.addUser')
const userLogin = document.querySelector('.userLogin');
const userPassword = document.querySelector('.userPassword');
const authorize = document.querySelector('.authorize');
const signInBtn = document.querySelector('.sign-in-btn');
const signUpBtn = document.querySelector('.sign-up-btn');
const loggedUser = document.querySelector('.logged-user');
const loggout = document.querySelector('.loggout');
const schedule = document.querySelector('.schedule');
const mealsForm = document.querySelector('#weekMeals');

let mondayMeal = document.querySelector('.mondayMeal');
let tuesdayMeal = document.querySelector('.tuesdayMeal');
let wednesdaymeal = document.querySelector('.wednesdaymeal');
let thursdayMeal = document.querySelector('.thursdayMeal');
let fridayMeal = document.querySelector('.fridayMeal');

let users = [];

let newUsername = '';
let newPassword = '';
let currentLogin = '';
let currentPassword = '';
let isLogged = false;
let loggedAs = '';

// function setLocalStorage() {
//   localStorage.setItem('users', JSON.stringify(users))
//   localStorage.setItem('selection', JSON.stringify(selection))
// }

// scroll to top

document.querySelector('nav').addEventListener('click', () => {
  document.body.scrollTop = 0;
})

// functions

function clearFields() {
  newUserInput.value = '';
  newUserPassword.value = '';
  userLogin.value = '';
  userPassword.value = '';

  mealsForm.reset()

  mondayCost.textContent = `This plate costs: 0`;
  tuesdayCost.textContent = `This plate costs: 0`;
  wednesdayCost.textContent = `This plate costs: 0`;
  thursdayCost.textContent = `This plate costs: 0`;
  fridayCost.textContent = `This plate costs: 0`;
}

newUserInput.addEventListener('keyup', (e) => {
  newUsername = e.target.value;
})


newUserPassword.addEventListener('keyup', (e) => {
  newPassword = e.target.value;
})

function logIn() {

  users = JSON.parse(localStorage.getItem('users'));

  users.forEach(user => {

    if (user.username === currentLogin && user.password === currentPassword) {

      loggedAs = user.username;

      isLogged = true;
      signInBtn.style.display = 'none';
      signUpBtn.style.display = 'none';
      loggedUser.classList.remove('d-none');
      schedule.classList.remove('d-none');
      document.querySelector('.welcome').innerHTML = `Welcome, ${loggedAs}! Select your preferred meals for the week.
      <br><br>`
      clearFields();

      return loggedAs;
    }
  })

}

// Register & add user to users array

addNewUser.addEventListener('click', (e) => {

  let newUser = { username: `${newUsername}`, password: `${newPassword}` }

  users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];

  users.push(newUser);

  localStorage.setItem('users', JSON.stringify(users))

  logIn();

  clearFields();

  alert('User created! Use your credentials to sign in.')

})

const close = document.querySelectorAll('.clear')

close.forEach((item) => {

  item.addEventListener('click', () => {

    clearFields();
  })

})



// Login

userLogin.addEventListener('keyup', (e) => {
  currentLogin = e.target.value;
})

userPassword.addEventListener('keyup', (e) => {
  currentPassword = e.target.value;
})

authorize.addEventListener('click', () => {
  logIn();
  lastChoices();
})

// loggout
loggout.addEventListener('click', () => {
  isLogged = false;
  loggedAs = '';

  signInBtn.style.display = 'inline';
  signUpBtn.style.display = 'inline';
  loggedUser.classList.add('d-none');
  schedule.classList.add('d-none');

  mondayMeal.textContent = ``;
  tuesdayMeal.textContent = ``;
  wednesdaymeal.textContent = ``;
  thursdayMeal.textContent = ``;
  fridayMeal.textContent = ``;

  clearFields();


})

// Dynamic menu

document.querySelector('nav').addEventListener('click', () => {
  scroll(0, 0);
})

const plateList = document.querySelector('#plate-list');

let menuToday = plates.filter(plate => plate.Day === weekDay ? true : false);


menuToday.forEach((item) => {


  let plateItem = document.createElement('li');
  plateItem.classList.add('plateItem');
  plateItem.innerHTML = `  
  <p><img class="plate-img" src="${item.img}" alt="">${item.Name} - €${item.Price}</p>
  `;
  plateList.appendChild(plateItem);

})

// Dynamic week menu



plates.forEach(plate => {

  switch (plate.Day) {
    case 'Monday':
      document.querySelector('#monday').innerHTML += `<option value="${plate.Price}" data-plate="${plate.Name}">${plate.Name}</option>`
      break;
    case 'Tuesday':
      document.querySelector('#tuesday').innerHTML += `<option value="${plate.Price}" data-plate="${plate.Name}">${plate.Name}</option>`
      break;
    case 'Wednesday':
      document.querySelector('#wednesday').innerHTML += `<option value="${plate.Price}" data-plate="${plate.Name}">${plate.Name}</option>`
      break;
    case 'Thursday':
      document.querySelector('#thursday').innerHTML += `<option value="${plate.Price}" data-plate="${plate.Name}">${plate.Name}</option>`
      break;
    case 'Friday':
      document.querySelector('#friday').innerHTML += `<option value="${plate.Price}" data-plate="${plate.Name}">${plate.Name}</option>`
      break;
  }
})

let cost = document.querySelector('.cost');

const selections = document.querySelectorAll('select');
const option = document.querySelectorAll('option');

let totalCost = 0;

const mondayCost = document.querySelector('.monday-cost')
const tuesdayCost = document.querySelector('.tuesday-cost')
const wednesdayCost = document.querySelector('.wednesday-cost')
const thursdayCost = document.querySelector('.thursday-cost')
const fridayCost = document.querySelector('.friday-cost')

// individual date values for the total cost

let mondayValue = 0;
let tuesdayValue = 0;
let wednesdayValue = 0;
let thursdayValue = 0;
let fridayValue = 0;

// Used to store the meal name for the LS persistance

let userChoices = [];

let mondaySelection = 'nothing is selected';
let tuesdaySelection = 'nothing is selected';
let wednesdaySelection = 'nothing is selected';
let thursdaySelection = 'nothing is selected';
let fridaySelection = 'nothing is selected';

function handleSelection(choice) {
  if (choice === 0) {
    return 'nothing is selected';
  } else if (choice === 1) {
    return ' fish is selected';
  } else {
    return 'meat is selected';
  }
}

selections.forEach((selection) => {

  selection.addEventListener('change', (e) => {


    // console.log(e.target.selectedIndex)

    switch (e.target.name) {
      case 'monday':
        mondayValue = parseInt(e.target.value, 10);
        mondayCost.textContent = `This plate costs: ${mondayValue}`;
        mondaySelection = handleSelection(e.target.selectedIndex);
        break;
      case 'tuesday':
        tuesdayValue = parseInt(e.target.value, 10);
        tuesdayCost.textContent = `This plate costs: ${tuesdayValue}`;
        tuesdaySelection = handleSelection(e.target.selectedIndex);
        break;
      case 'wednesday':
        wednesdayValue = parseInt(e.target.value, 10);
        wednesdayCost.textContent = `This plate costs: ${wednesdayValue}`;
        wednesdaySelection = handleSelection(e.target.selectedIndex);
        break;
      case 'thursday':
        thursdayValue = parseInt(e.target.value, 10);
        thursdayCost.textContent = `This plate costs: ${thursdayValue}`;
        thursdaySelection = handleSelection(e.target.selectedIndex);
        break;
      case 'friday':
        fridayValue = parseInt(e.target.value, 10);
        fridayCost.textContent = `This plate costs: ${fridayValue}`;;
        fridaySelection = handleSelection(e.target.selectedIndex);
        break;
    }

    // total cost

    totalCost = mondayValue + tuesdayValue + wednesdayValue + thursdayValue + fridayValue;
    cost.textContent = `Total cost: ${totalCost}`;

    // local storage

    let userSelections = { username: `${loggedAs}`, mondaySelection: `${mondaySelection}`, tuesdaySelection: `${tuesdaySelection}`, wednesdaySelection: `${wednesdaySelection}`, thursdaySelection: `${thursdaySelection}`, fridaySelection: `${fridaySelection}` };


    userChoices = localStorage.getItem('selections') ? JSON.parse(localStorage.getItem('selections')) : [];

    userChoices.push(userSelections);
    localStorage.setItem('selections', JSON.stringify(userChoices));
    

  });
})



function lastChoices() {

  let value = JSON.parse(localStorage.getItem('selections'))

  if (value[value.length - 1].username === loggedAs) {
    mondayMeal.textContent = `For monday: ${value[value.length - 1].mondaySelection}`
    tuesdayMeal.textContent = `For tuesday: ${value[value.length - 1].tuesdaySelection}`
    wednesdaymeal.textContent = `For wednesday: ${value[value.length - 1].wednesdaySelection}`
    thursdayMeal.textContent = `For thursday: ${value[value.length - 1].thursdaySelection}`
    fridayMeal.textContent = `For friday: ${value[value.length - 1].fridaySelection}`
  }

}