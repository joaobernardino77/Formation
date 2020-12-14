
var plates = [
    {
        Name: "Salmon",
        Day: "Monday",
        Type: "Fish",
        Price: 8,
        img: "https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_960_720.jpg"
    },
    {
        Name: "Lasagna",
        Day: "Monday",
        Type: "Meat",
        Price: 7,
        img: "https://cdn.pixabay.com/photo/2016/12/11/22/41/lasagna-1900529_960_720.jpg"
    },
    {
        Name: "Sardines",
        Day: "Tuesday",
        Type: "Fish",
        Price: 6,
        img: "https://cdn.pixabay.com/photo/2016/06/30/18/49/sardines-1489626_960_720.jpg"
    },
    {
        Name: "Chicken",
        Day: "Tuesday",
        Type: "Meat",
        Price: 5,
        img: "https://cdn.pixabay.com/photo/2016/11/18/17/42/barbecue-1836053_960_720.jpg"
    },
    {
        Name: "Fish And Chips",
        Day: "Wednesday",
        Type: "Fish",
        Price: 5,
        img: "https://cdn.pixabay.com/photo/2017/12/26/04/51/fish-and-chip-3039746_960_720.jpg"
    },
    {
        Name: "Hamburguer",
        Day: "Wednesday",
        Type: "Meat",
        Price: 4,
        img: "https://cdn.pixabay.com/photo/2016/03/05/19/37/appetite-1238459_960_720.jpg"
    },
    {
        Name: "Sushi",
        Day: "Thursday",
        Type: "Fish",
        Price: 10,
        img: "https://cdn.pixabay.com/photo/2016/11/25/16/08/sushi-1858696_960_720.jpg"
    },
    {
        Name: "Spaghetti bolognese",
        Day: "Thursday",
        Type: "Meat",
        Price: 7,
        img: "https://cdn.pixabay.com/photo/2019/10/13/14/23/spaghetti-bolognese-4546233_960_720.jpg"
    },
    {
        Name: "Chicken",
        Day: "Friday",
        Type: "Fish",
        Price: 6,
        img: "https://cdn.pixabay.com/photo/2016/11/18/17/42/barbecue-1836053_960_720.jpg"
    },
    {
        Name: "Fish Soup",
        Day: "Friday",
        Type: "Meat",
        Price: 7,
        img: "https://cdn.pixabay.com/photo/2018/01/01/17/57/fish-soup-3054627_960_720.jpg"
    }
];



var authorizedUsers = {
    logins: [{
        user: 'admin',
        pass: '1234'
    }]
};

// document.getElementById("register").addEventListener("click", register);
// document.getElementById("login").addEventListener("click", login);
// document.getElementById("logout").addEventListener("click", logout);
// document.getElementById("btn-schedule").addEventListener("click", schedule);

export function schedule() {

    var totalValue = 0;

    let selectDays = document.querySelectorAll('#day option:checked');
    let selectPlate = document.getElementById("plate").value;

    //console.log(selectDays);
    //console.log(selectPlate);

    let selectPlates = {
        days: [],
        plate: selectPlate,
        total: totalValue
    }

    selectDays.forEach(option => {
        //console.log(option.value);
        selectPlates.days.push(option.value);
    });

    //console.log(selectPlates);

    selectPlates.days.forEach(function (day) {
        //console.log("---> " , day);

        for (let i = 0; i < plates.length; i++) {
            const element = plates[i].Day;

            if (day == plates[i].Day && selectPlates.plate == plates[i].Type) {
                //console.log('dia escolhido' , day);
                //console.log('preco: ' + plates[i].Price);

                totalValue += plates[i].Price;
            }
        }

    });

    document.getElementById('total').innerHTML = 'Total: ' + totalValue;
    selectPlates.total = totalValue;

    localStorage.setItem('plates', JSON.stringify(selectPlates));

}

/**
 * Function to make a popup for asking the username and password
 */
export function login() {

    let isLogged = false;

    var username = prompt("Please enter the username", '');
    if (username == null || username == '') {
        return alert('Username cannot be empty.');
    }

    var password = prompt("Please enter the password", '');
    if (password == null || password == '') {
        return alert('Password cannot be empty.');
    }

    authorizedUsers.logins.forEach(function (index) {

        if (username === index.user && password === index.pass) {
            //console.log('entrei');
            localStorage.setItem('isUserlogged', true);

            isLogged = true;
            isUserValid();

            alert('Welcome ' + username);
        }


    });

    if (isLogged != true) {
        return alert('Invalid Username or password.');
    }

    location.reload();

}

export function register() {

    var username = prompt("Please enter the username", '');
    if (username == null || username == '') {
        return alert('Username cannot be empty.');
    }

    var password = prompt("Please enter the password", '');
    if (password == null || password == '') {
        return alert('Password cannot be empty.');
    }

    authorizedUsers.logins.push(
        {
            user: username,
            pass: password
        }
    );
    
    alert('The user has been registeed.')

    isUserValid();
    console.log("users: ", authorizedUsers);
}

export function logout() {

    localStorage.removeItem('isUserlogged');
    isUserValid();

    location.reload();

}

export function isUserValid() {

    var display = document.getElementById('schedule');

    var isUserlogged = localStorage.getItem('isUserlogged');
    if (isUserlogged == 'true') {
        // display.style.display = 'block';

        return true;
    } else {
        // display.style.display = 'none';
        return false;
    }

}

// function that runs when the page it's loaded
window.onload = function () {
    //isUserValid();
}