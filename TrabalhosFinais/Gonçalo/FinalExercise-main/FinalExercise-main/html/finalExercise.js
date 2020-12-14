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

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
      });
  });
});
//
// Logged
//
function checkLogged() {
  var btnLogin = document.getElementById('login')
  var btnSchedule = document.getElementById('schedule')
  var btnLogout = document.getElementById('logout')
  if(localStorage.getItem('login') === 'true'){
    btnLogin.style.display = 'none'
    btnSchedule.style.display = ''
    btnLogout.style.display = ''
  }
}
checkLogged()

var btnLogout = document.getElementById('logout') 

btnLogout.addEventListener('click',(event)=> {
  event.preventDefault()
  localStorage.removeItem('login')
  localStorage.removeItem('schedule')
  showNotification('green','Bye bye')
  setTimeout(()=> {
    window.location.reload()
  },1500)
})

//
// Menu 
//
var addMenu = document.getElementById('addMenu')

var platesMapped = plates.map(plate => {
    
    var article = document.createElement('article')
    article.classList.add('menu')
    var divImgContainer = document.createElement('div')
    divImgContainer.classList.add('img-container')
    var image = document.createElement('img')
    image.setAttribute('src', plate.img)
    image.setAttribute('alt', plate.Name)
    divImgContainer.appendChild(image)
    article.appendChild(divImgContainer)
    var menuFooter = document.createElement('div')
    menuFooter.classList.add('menu-footer')
    var menuTitle = document.createElement('p')
    menuTitle.classList.add('menu-title')
    menuTitle.textContent = plate.Name
    var menuPrice = document.createElement('p')
    menuPrice.classList.add('menu-price')
    menuPrice.textContent = plate.Price + '€'
    var menuDay = document.createElement('p')
    menuDay.classList.add('menu-day')
    menuDay.textContent = plate.Day
    menuFooter.appendChild(menuTitle)
    menuFooter.appendChild(menuPrice)
    menuFooter.appendChild(menuDay)
    article.appendChild(menuFooter)
    addMenu.appendChild(article)
})
//
//  Login
//
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("login");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

var loginBtn = document.getElementById('loginBtn')
var loginInput = document.getElementById('loginInput')
var passwordInput = document.getElementById('passwordInput')
var pWarning = document.getElementById('pWarning')

loginInput.addEventListener('input', () => {
  if(loginInput.value && passwordInput.value){
    loginBtn.disabled = false
    pWarning.style.display= "none"
  } else {
    loginBtn.disabled = true
    pWarning.style.display= ""
  }
})

passwordInput.addEventListener('input', () => {
  if(loginInput.value && passwordInput.value){
    loginBtn.disabled = false
    pWarning.style.display= "none"
  } else {
    loginBtn.disabled = true
    pWarning.style.display= ""
  }
})

loginBtn.addEventListener('click', (event) => {
  event.preventDefault()
  var allRegister = JSON.parse(localStorage.getItem('allRegistered'))
  console.log(allRegister)
  for(var i = 0; i < allRegister.length; i++){
    if(allRegister[i].username === loginInput.value && allRegister[i].password === passwordInput.value){
      modal.style.display = "none";
      showNotification('green','Login was successfull')
      localStorage.setItem('login', 'true')
      setTimeout(()=> {
        window.location.reload()
        return false;
      }, 3100)
      return;
    }
  }
  showNotification('red','Wrong credentials')
})

//
//  Register
//

var modalRegister = document.getElementById("myModalRegister");

// Get the button that opens the modal
var btnRegister = document.getElementById("registerBtn");

// Get the <span> element that closes the modal
var spanRegister = document.getElementsByClassName("close")[1];

// When the user clicks on the button, open the modal
btnRegister.onclick = function() {
  modal.style.display = "none"
  modalRegister.style.display = "block";
  loginInput.value = ""
  passwordInput.value = ""
}

// When the user clicks on <span> (x), close the modal
spanRegister.onclick = function() {
  modalRegister.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modalRegister) {
    modalRegister.style.display = "none";
  }
}

var registerLoginInput = document.getElementById('registerLoginInput')
var registerPasswordInput = document.getElementById('registerPasswordInput')
var registerPWarning = document.getElementById('registerPWarning')
var confirmRegisterBtn = document.getElementById('confirmRegisterBtn')


registerLoginInput.addEventListener('input', () => {
  if(registerLoginInput.value && registerPasswordInput.value){
    confirmRegisterBtn.disabled = false
    registerPWarning.style.display= "none"
  } else {
    confirmRegisterBtn.disabled = true
    registerPWarning.style.display= ""
  }
})

registerPasswordInput.addEventListener('input', () => {
  if(registerLoginInput.value && registerPasswordInput.value){
    confirmRegisterBtn.disabled = false
    registerPWarning.style.display= "none"
  } else {
    confirmRegisterBtn.disabled = true
    registerPWarning.style.display= ""
  }
})

confirmRegisterBtn.addEventListener('click', (event) => {
  event.preventDefault()
  const username = registerLoginInput.value
  const password = registerPasswordInput.value
  var allRegistered = localStorage.getItem('allRegistered') ? JSON.parse(localStorage.getItem('allRegistered')) : []
  localStorage.setItem('allRegistered', JSON.stringify([...allRegistered, {username, password}]))
  modalRegister.style.display = "none";
  showNotification('green','Register was successfull')
})

//
// Notification
// 

function showNotification(color,text) {
  document.getElementById('notification').style.display='block'
  document.getElementById('notification').style.color=color 
  document.getElementById('notification-message').innerText=text
  setTimeout(() => {
    document.getElementById('notification').style.display='none'
  }, 3000)
  
}

//
// Schedule
//

var modalSchedule = document.getElementById("scheduleModal");

// Get the button that opens the modal
var btnSchedule = document.getElementById("schedule");

// Get the <span> element that closes the modal
var spanSchedule = document.getElementsByClassName("close")[2];

// When the user clicks on the button, open the modal
btnSchedule.onclick = function() {
  modalSchedule.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanSchedule.onclick = function() {
  modalSchedule.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modalSchedule) {
    modalSchedule.style.display = "none";
  }
}

function addOptions(arrayPlates, select) {
  arrayPlates.forEach(plate => {
    var option = document.createElement('option')
    option.innerText = plate.Name
    option.value = plate.Price
    select.appendChild(option)
  })
}  

var mondayMeals = plates.filter(plate => plate.Day === 'Monday')
var mondaySelect = document.getElementById('monday')
var tuesdayMeals = plates.filter(plate => plate.Day === 'Tuesday')
var tuesdaySelect = document.getElementById('tuesday')
var wednesdayMeals = plates.filter(plate => plate.Day === 'Wednesday')
var wednesdaySelect = document.getElementById('wednesday')
var thursdayMeals = plates.filter(plate => plate.Day === 'Thursday')
var thursdaySelect = document.getElementById('thursday')
var fridayMeals = plates.filter(plate => plate.Day === 'Friday')
var fridaySelect = document.getElementById('friday')


addOptions(mondayMeals, mondaySelect)
addOptions(tuesdayMeals, tuesdaySelect)
addOptions(wednesdayMeals, wednesdaySelect)
addOptions(thursdayMeals, thursdaySelect)
addOptions(fridayMeals, fridaySelect)

var totalPrice = document.getElementById('totalPrice')

mondaySelect.addEventListener('change', updateTotalPrice)
tuesdaySelect.addEventListener('change', updateTotalPrice)
wednesdaySelect.addEventListener('change', updateTotalPrice)
thursdaySelect.addEventListener('change', updateTotalPrice)
fridaySelect.addEventListener('change', updateTotalPrice)

function updateTotalPrice() {
  totalPrice.innerText ='Total: ' + (parseInt(mondaySelect.value) + parseInt(tuesdaySelect.value) + parseInt(wednesdaySelect.value) + parseInt(thursdaySelect.value) + parseInt(fridaySelect.value)) + '€'
}

var submitSchedule = document.getElementById('scheduleBtn')
submitSchedule.addEventListener('click', () => {
  
  var choicesSchedule = {
    monday: mondaySelect.options[mondaySelect.selectedIndex].text === 'Select' ? '' : mondaySelect.options[mondaySelect.selectedIndex].text,
    tuesday: tuesdaySelect.options[tuesdaySelect.selectedIndex].text === 'Select' ? '' : tuesdaySelect.options[tuesdaySelect.selectedIndex].text,
    wednesday: wednesdaySelect.options[wednesdaySelect.selectedIndex].text === 'Select' ? '' : wednesdaySelect.options[wednesdaySelect.selectedIndex].text,
    thursday: thursdaySelect.options[thursdaySelect.selectedIndex].text === 'Select' ? '' : thursdaySelect.options[thursdaySelect.selectedIndex].text,
    friday: fridaySelect.options[fridaySelect.selectedIndex].text === 'Select' ? '' : fridaySelect.options[fridaySelect.selectedIndex].text,
  }
  
  localStorage.setItem('schedule', JSON.stringify(choicesSchedule))
  modalSchedule.style.display = "none";
  showNotification('green','Choices saved!')
  setTimeout(()=> {
    window.location.reload()
    return false;
  }, 3100)
})