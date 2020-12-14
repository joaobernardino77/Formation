var plates=[
    {
    Name:"Salmon",
    Day:"Monday",
    Type:"Fish",
    Price:8,
    img:"https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_960_720.jpg"
    },
    {
    Name:"Lasagna",
    Day:"Monday",
    Type:"Meat",
    Price:7,
    img:"https://cdn.pixabay.com/photo/2016/12/11/22/41/lasagna-1900529_960_720.jpg"
    },
    {
    Name:"Sardines",
    Day:"Tuesday",
    Type:"Fish",
    Price:6,
    img:"https://cdn.pixabay.com/photo/2016/06/30/18/49/sardines-1489626_960_720.jpg"
    },
    {
    Name:"Chicken",
    Day:"Tuesday",
    Type:"Meat",
    Price:5,
    img:"https://cdn.pixabay.com/photo/2016/11/18/17/42/barbecue-1836053_960_720.jpg"
    },
    {
     Name:"Fish And Chips",
    Day:"Wednesday",
    Type:"Fish",
    Price:5,
    img:"https://cdn.pixabay.com/photo/2017/12/26/04/51/fish-and-chip-3039746_960_720.jpg"
    },
    {
    Name:"Hamburguer",
    Day:"Wednesday",
    Type:"Meat",
    Price:4,
    img:"https://cdn.pixabay.com/photo/2016/03/05/19/37/appetite-1238459_960_720.jpg"
    },
    {
    Name:"Sushi",
    Day:"Thursday",
    Type:"Fish",
    Price:10,
    img:"https://cdn.pixabay.com/photo/2016/11/25/16/08/sushi-1858696_960_720.jpg"
    },
    {
    Name:"Spaghetti bolognese",
    Day:"Thursday",
    Type:"Meat",
    Price:7,
    img:"https://cdn.pixabay.com/photo/2019/10/13/14/23/spaghetti-bolognese-4546233_960_720.jpg"
    },
    {
    Name:"Fish Soup",
    Day:"Friday",
    Type:"Fish",
    Price:7,
    img:"https://cdn.pixabay.com/photo/2018/01/01/17/57/fish-soup-3054627_960_720.jpg"
    },
    {
    Name:"Chicken",
    Day:"Friday",
    Type:"Meat",
    Price:6,
    img:"https://cdn.pixabay.com/photo/2016/11/18/17/42/barbecue-1836053_960_720.jpg"
    }
];

// Login variables
var loginForm = document.querySelector('.modal-content');
var username = document.getElementById('username');
var password = document.getElementById('psw');
// To change modal from login to register and vice versa - starts at login modal by default
var isMember = true;
var loginText = "Login";
document.getElementById('modal-button').textContent = loginText;
var registerText = "Register";
document.getElementById('aregister').textContent = registerText;
var registerButton = document.querySelector('.register');
// Login logout buttons
var loginButton = document.getElementById('login-button');
var logoutButton = document.getElementById('logout-button');
var registerMeal = document.querySelector('.regular-button');

//var selectedPlates = plates.map(element => ({...element, selected: false}));
// Checks if there is someone logged in and adjusts isLogged boolean
var currentUser = localStorage.getItem('currentUser');
var isLogged;
if (currentUser==null || currentUser==''){
    isLogged = false;
    toggleLogButtons();
    memberContent();
    document.getElementById('welcome').textContent = "";
} else {
    isLogged = true;
    toggleLogButtons();
    memberContent();
    getPlates();
    document.getElementById('welcome').textContent = `Hello ${currentUser}!`;
}



// Toggle login logout buttons visibility according to user being logged in or not
function toggleLogButtons(){
    if (isLogged){
        loginButton.style.display='none';
        logoutButton.style.display='inline-block';
    } else {
        loginButton.style.display='inline-block';
        logoutButton.style.display='none';
    }
}
// Adds logout button event
logoutButton.addEventListener('click', function(){
    logoutUser();
});


// Toggle isMember and the respective text changes in the modal
function toggleMember(){
    isMember = !isMember;
    if (isMember==false) {
        loginText = 'Register';
        registerText = 'Login';
    }
    else {
        loginText = 'Login';
        registerText = 'Register';
    }
}

// Adds event for button to change between register and login modal
registerButton.addEventListener('click', function(e){
    e.preventDefault();
    toggleMember();
    document.getElementById('modal-button').textContent = loginText;
    document.getElementById('aregister').textContent = registerText;
    // JUST TESTING
    console.log(isMember);
});

// Handles the modal submit button event and directs to appropriate function
var modal = document.getElementById('modal1');
loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    if (isMember){
        loginUser();
    } else {
        registerUser();
    }
    modal.style.display = "none";
});

// Displays the modal
loginButton.addEventListener('click', function(){
    document.getElementById('modal1').style.display='block';
});
// Hides the modal
var modalClose = document.getElementById('modal-close');
modalClose.addEventListener('click', function(){
    document.getElementById('modal1').style.display='none';
})


// Register new user
function registerUser(){
    // Retrieves the localStorage
    var registeredUsers = JSON.parse(localStorage.getItem('registeredUsers'));
    var selectedPlates = [0,0,0,0,0];
    // registeredUsers doesn't exist yet
    if (registeredUsers==null) {
        registeredUsers=[];
        registeredUsers.push({username: username.value, password: password.value,
            selectedPlates: selectedPlates});
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        console.log("registeredUsers was empty, 1st user registered");
        loginUser();
        // simple success alert
        setTimeout(function () {
            alert("Congratulations! Your account has been created and you are now logged in!");
        }, 10);
    // Found a user already registered with that username
    } else if ( registeredUsers.find(element => element.username == username.value)!=undefined ) {
            alert('User already exists!');
        // registeredUsers already exists so we just add the user and update the localStorage as usual
        } else {
            registeredUsers.push({username: username.value, password: password.value,
                selectedPlates: selectedPlates});
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            console.log("retrieved registeredUsers and added the new user");
            loginUser();
            // simple success alert
            setTimeout(function () {
                alert("Congratulations! Your account has been created and you are now logged in!");
            }, 10);
        }
};

// Login user
function loginUser(){
    // Retrieves the localStorage
    var registeredUsers = JSON.parse(localStorage.getItem('registeredUsers'));
    // Checks if registeredUsers exist
    if (registeredUsers==null){
        alert("There are no registered users yet!");
    // Searches for the username in localStorage and retrieves the user if it exists
    } else if ( registeredUsers.find(element => element.username == username.value)!=undefined ) {
        var tempUser = registeredUsers.find(element => element.username == username.value);
        // Checks if the entered password corresponds to the one saved for the user in localStorage
        if (tempUser.password == password.value) {
            isLogged=true;
            localStorage.setItem('currentUser', tempUser.username);
            currentUser=tempUser.username;
            toggleLogButtons();
            memberContent();
            getPlates();
            //console.log(`username: ${tempUser.username}, password: ${tempUser.password}`);
            console.log(`user "${localStorage.getItem('currentUser')}" is currently logged in.`);
            document.getElementById('welcome').textContent = `Hello ${currentUser}!`;
        } else {
            alert("The password is wrong.");
        }
    } else {
        alert("The username is wrong.");
    }
}

// Logout user
function logoutUser(){
    if (isLogged) {
        localStorage.setItem('currentUser', '');
        isLogged=false;
        currentUser=null;
        toggleLogButtons();
        memberContent();
        document.getElementById('welcome').textContent = "";
    } else {
        alert("This should not happen.")
    }
}

// Displays members only section when user is logged in
function memberContent(){
    if (isLogged){
        document.querySelector('.selected-plates').style.display='block';
    } else {
        document.querySelector('.selected-plates').style.display='none';
    }
}

function setPlates(){
    if (isLogged){
        // Retrieves the registeredUsers
        var registeredUsers = JSON.parse(localStorage.getItem('registeredUsers'));
        // Gets the current user object from localStorage
        var oldUser = registeredUsers.find(element => element.username == currentUser);
        // Gets the user plate selection from the select HTML
        var selection =[
            parseInt(document.getElementById('monday').value),
            parseInt(document.getElementById('tuesday').value),
            parseInt(document.getElementById('wednesday').value),
            parseInt(document.getElementById('thursday').value),
            parseInt(document.getElementById('friday').value)
        ];
        // Gets the index of the current user from the array of registered users in localStorage
        var indexUser = registeredUsers.indexOf(oldUser);
        // Creates a new user using the values from localStorage and replacing the selectedPlates with the selection we got from the HTML select
        var updatedUser = {username: oldUser.username, password: oldUser.password, selectedPlates: selection};
        // Replaces the old user info with the updated selectedPlateds
        registeredUsers[indexUser] = updatedUser;
        console.log("plates do user substituido: " + registeredUsers[indexUser].selectedPlates);
        // Saves the new updated registeredUsers array in localStorage
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        // Calls getTotals function to display the total cost of the user selection
        document.getElementById('total-price').textContent = `Weekly meal cost: ${getTotals(registeredUsers[indexUser].selectedPlates)}$`;
    } else {
        alert("This should not happen.");
    }
}
// Adds event to weekly meal button
registerMeal.addEventListener('click', function(){
    setPlates();
});

// Gets the user weekly meal selection from localStorage
function getPlates(){
    if (isLogged) {
        var registeredUsers = JSON.parse(localStorage.getItem('registeredUsers'));
        var targetUser = registeredUsers.find(element => element.username == currentUser);
        var selected = targetUser.selectedPlates;
        document.getElementById('monday').value=selected[0];
        document.getElementById('tuesday').value=selected[1];
        document.getElementById('wednesday').value=selected[2];
        document.getElementById('thursday').value=selected[3];
        document.getElementById('friday').value=selected[4];
        // totals
        document.getElementById('total-price').textContent = `Weekly meal cost: ${getTotals(selected)}$`;
    } else {
        alert("This should not happen.");
    }
}

// Calculates the total price for the weekly meal plan from the users selectedPlates array
function getTotals(selected){
    var total=0;
    for (var i=0; i<selected.length; i++){
        if (selected[i]==0)
            total+=0;
        if (selected[i]==1)
            total+=plates[i*2].Price;
        if (selected[i]==2)
            total+=plates[i*2+1].Price;
    }
    return total;
}

// Displays the menu
var menuSection = document.getElementById('menu-inside');
var grid = document.createElement('section');
grid.setAttribute('class', 'grid');
menuSection.appendChild(grid);

plates.forEach(element => {
    var card = document.createElement('div');
    card.classList.add('card');
    card.dataset.name=element.Name;

    var cardInfo = document.createElement('div');
    cardInfo.classList.add('card-info');
    card.appendChild(cardInfo);

    var plateDay = document.createElement('h3');
    plateDay.classList.add('plate-day');
    plateDay.textContent = element.Day;
    cardInfo.appendChild(plateDay);

    var plateType = document.createElement('h5');
    plateType.classList.add('plate-type');
    plateType.textContent = element.Type;
    cardInfo.appendChild(plateType);

    var plateName = document.createElement('h4');
    plateName.classList.add('plate-name');
    plateName.textContent = element.Name;
    cardInfo.appendChild(plateName);

    var platePrice = document.createElement('p');
    platePrice.classList.add('plate-price');
    platePrice.textContent = `Price: ${element.Price}$`;
    cardInfo.appendChild(platePrice);

    var platePhoto = document.createElement('img');
    platePhoto.setAttribute('src', element.img);
    platePhoto.setAttribute('alt', 'meal photo');
    card.appendChild(platePhoto);

    grid.appendChild(card);
})
