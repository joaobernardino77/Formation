//vars
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
    img:"https://cdn.pixabay.com/photo/2015/05/27/18/53/spaghetti-787048_960_720.jpg"
    },
    {
    Name:"Chicken",
    Day:"Friday",
    Type:"Fish",
    Price:6,
    img:"https://cdn.pixabay.com/photo/2016/11/18/17/42/barbecue-1836053_960_720.jpg"
    },
    {
    Name:"Fish Soup",
    Day:"Friday",
    Type:"Meat",
    Price:7,
    img:"https://cdn.pixabay.com/photo/2018/01/01/17/57/fish-soup-3054627_960_720.jpg"
    }
];

/*functions display menu in html*/
function menuDays () {
    var plateDay ='';
    plates.forEach(days => {
    var menu = document.querySelector('.menu');
    var div = document.createElement('div');
    var menuDay = document.createElement('h2');
    var menuName = document.createElement('li');
    var menuPrice = document.createElement('li');
    var menuImg = document.createElement('img');
    
    if (plateDay != days.Day ) {
        plateDay = days.Day
        menuDay.textContent = plateDay;
        menuDay.setAttribute("class", "nameDay")
        menu.appendChild(menuDay)
    } else {
        plateDay = ''
    }
    
    menuImg.src = days.img;
    menuName.textContent = days.Name;
    menuPrice.textContent = days.Price+'€';
    div.setAttribute("class","menuDay")
    menu.append(div);
    
    div.appendChild(menuImg);
    div.appendChild(menuName);
    div.appendChild(menuPrice);
    })
}
menuDays()

/*LocalStorage*/
//register
var btnLogin = document.getElementById('login');
var btnLogout = document.getElementById('logout');

function hiddenLoginBtn() {
    btnLogin.style.display = "none";
    btnLogout.style.display= "block";
}
function hiddenLogoutBtn() {
    btnLogin.style.display = "block";
    btnLogout.style.display= "none";
}

function store(){
    var email = document.getElementById('registerEmail');
    var pw = document.getElementById('registerPassword');
    
    //save into localStorage
    localStorage.setItem('email', email.value);
    localStorage.setItem('pw', pw.value);
    alert('Your account has been created');
    document.getElementById('modalRegister').style.display='none';
    document.getElementById('login').style.display = 'none';
    //hiddenLoginBtn();
    document.getElementById('modalBooking').style.display='block'
    }   

//checking
function check(){
    var storedEmail = localStorage.getItem('email');
    var storedPw = localStorage.getItem('pw');
    var userEm = document.getElementById('userEmail');
    var userPw = document.getElementById('userPassword');
    console.log(userEm.value)
    if(userEm.value == storedEmail && userPw.value == storedPw){
        alert('You are logged in.');
        document.getElementById('modalLogin').style.display='none';
        hiddenLoginBtn()
        document.getElementById('modalBooking').style.display='block'
        
    }else{
        alert('user not register or logged');
        document.getElementById('modalLogout').style.display='none';
        hiddenLogoutBtn()
    }
}

//exit login
function clearStorage(){
    localStorage.clear();
    btnLogin.style.display = "block"
    btnLogout.style.display= "none"
}

/*RESERVE TABLE*/
var reserve = {};
var selectPlate = [];
function bookingTable() {
plates.forEach(item, index, array =>{
        //Reference the div.
        var divDays = document.getElementById("checkDays");
        //Reference all the CheckBoxes in div.
        var chks = divDays.getElementsByTagName("input");
        // Loop and push the checked CheckBox value in Array.
        for (var i = 0; i < chks.length; i++) {
            if (chks[i].cheched && chks[i].value === item.Day) {
                reserve.Day =(chks[i].value);
                console.log(reserve)
            }
        }
        
        var divPlates = document.getElementById("checkPlates");
        //Reference all the CheckBoxes in div.
        var chks = divPlates.getElementsByTagName("input");
        // Loop and push the checked CheckBox value in Array.
        for (var i = 0; i < chks.length; i++) {
            if (chks[i].value === item.Type) {
                console.log(chks[i])
                selectPlate.push(chks[i].value);
                console.log(selectPlate)
            }
        }
        
    });console.log(reserve)

}






// function bookingTable() {
//     getSelectedDays()
//     getSelectedPlates()
//     var reserve = {}
//     var days = []
//     if(checkBox === true) {
//         plates.forEach(plates => {
//             reserve.day = plates.Day
//             reserve.plate = plates.Name
//         })
//     }
// }
