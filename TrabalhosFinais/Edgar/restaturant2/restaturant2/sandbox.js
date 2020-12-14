
if (day === currentDay) {
    var menuDay = document.getElementById('day2')
    var menuName = document.createElement('p')
    menuDay.textContent = days.Name;
    menuDay.appendChild(menuName);
}
if (day === 'Wednesday') {
    var menuDay = document.getElementById('day3')
    var menuName = document.createElement('p')
    menuName.textContent = days.Name;
    menuDay.appendChild(menuName);
}
if (day === 'Thursday') {
    var menuDay = document.getElementById('day4')
    var menuName = document.createElement('p')
    menuName.textContent = days.Name;
    menuDay.appendChild(menuName);
}
if (day === 'Friday') {
    var menuDay = document.getElementById('day5')
    var menuName = document.createElement('p')
    menuName.textContent = days.Name && days.Name;
    menuDay.appendChild(menuName);
}


function menuDays () {
    plates.forEach(days => {
    var day = days.Day;
    var f = new Date()
    var arrDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    var currentDay = arrDays[f.getDay()];
    //console.log(currentDay);
    var menuDay = document.getElementById('day')
    var menuName = document.createElement('p')
        if (day === currentDay) {
            menuName.textContent = days.Name;
            menuDay.appendChild(menuName);
        }
    })
}
menuDays()