//PRATOS
var plates=[ {
    Name:"Salmon",
    Day:"Monday",
    Type:"Fish",
    Price:8, img:"https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_960_720.jpg"
    }, {
    Name:"Lasagna",
    Day:"Monday",
    Type:"Meat",
    Price:7, img:"https://cdn.pixabay.com/photo/2016/12/11/22/41/lasagna-1900529_960_720.jpg"
    }, {
    Name:"Sardines",
    Day:"Tuesday",
    Type:"Fish",
    Price:9, img:"https://cdn.pixabay.com/photo/2016/06/30/18/49/sardines-1489626_960_720.jpg"
    }, {
    Name:"Chicken",
    Day:"Tuesday",
    Type:"Meat",
    Price:5, img:"https://cdn.pixabay.com/photo/2016/11/18/17/42/barbecue-1836053_960_720.jpg"
    }, {
    Name:"Fish And Chips", Day:"Wednesday",
    Type:"Fish",
    Price:5,
    img:"https://cdn.pixabay.com/photo/2017/12/26/04/51/fish-and-chip-3039746_960_720.jpg"
    }, {
    Name:"Hamburguer",
    Day:"Wednesday",
    Type:"Meat",
    Price:4, img:"https://cdn.pixabay.com/photo/2016/03/05/19/37/appetite-1238459_960_720.jpg"
    }, {
    Name:"Sushi", Day:"Thursday",
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
    }, {
    Name:"Chicken", Day:"Friday",
    
    Type:"Meat",
    Price:6,
    img:"https://cdn.pixabay.com/photo/2016/11/18/17/42/barbecue-1836053_960_720.jpg" },
    {
    Name:"Fish Soup",
    Day:"Friday",
    Type:"Fish",
    Price:7, img:"https://cdn.pixabay.com/photo/2018/01/01/17/57/fish-soup-3054627_960_720.jpg"
    } ];

//Display PRATOS
var carta = document.querySelector(".carta");

//PARA NAO DAR ERRO NA PAGINA DE LOGIN, VISTO QUE A CARTA SÓ É DIFERENTE DE NULL NA INDEX PAGE
if(carta!=null){
    //PERCORRER O ARRAY
    for (var i = 0; i < plates.length; i++){
        //var carta = document.querySelector(".carta");

        //CRIAR UM DIV PARA CADA OBJECTO DO ARRAY
        var lista = document.createElement("div");
        //ADICIONAR UMA CLASS
        lista.classList.add("elemento");
        carta.append(lista);

        //CRIAR OS ELEMENTOS DA LISTA 
        var titulo = document.createElement("h2");
        var dia = document.createElement("h3");
        var tipo = document.createElement("h4");
        var preco = document.createElement("p");
        var imagem = document.createElement("img");
        //DEFINIR O CONTEUDO DE CADA ELEMENTO ACIMA CRIADO
        titulo.textContent = plates[i].Name;
        dia.textContent = plates[i].Day;
        tipo.textContent = `type: ${plates[i].Type}`;
        preco.textContent = `price: ${plates[i].Price}$`;
        imagem.src = plates[i].img;
        //ADICIONAR OS ELEMENTOS À LISTA
        lista.append(titulo);
        lista.append(dia);
        lista.append(tipo);
        lista.append(preco);
        lista.append(imagem);
    }
}
//FIM DA CRIAÇÃO DA SECÇÃO MENU

//FORM------------------------------------------------------------------------------------------
//variáveis
var login_form = document.querySelector("form"); 
var login = document.querySelector(".login-button"); 
var tituloForm = document.getElementById("form-title");
var paragrafo = document.querySelector(".login-paragraph");
var submit = document.getElementById("submit");
var username = document.querySelector(".username");
var email = document.querySelector(".email")

//FUNÇÃO QUE MUDA DE LOGIN PARA REGISTER E VICE VERSA
function functionLoginRegister(){    
    //SE ESTIVERMOS NA PAGINA DE REGISTRO       
    if(tituloForm.textContent == "Register"){
        tituloForm.textContent = "Login";
        login.textContent = "Register";
        paragrafo.textContent = "If you don't have an account please";
        submit.value = "Login";
        email.style.display ="none";
    }
    //SE ESTIVERMOS NA PAGINA DE LOGIN
    else{ 
        tituloForm.textContent = "Register";
        login.textContent = "Login";
        paragrafo.textContent = "If you already have an account please";
        submit.value = "Register";
        email.style.display ="block";
    }
}



//VARIAVEL STORAGEUSERS QUE CONTEM A INFORMAÇÃO DOS UTILIZADORES QUE FIZEREM REGISTRO
var storageUsers = JSON.parse(localStorage.getItem("users"));

function Submit(){
   
    //INPUTS
    var input_username = document.getElementById("input_username").value;
    var input_mail = document.getElementById("input_mail").value;
    var input_password = document.getElementById("input_password").value;
    //USER NÃO ESTÁ REGISTADO
    var registado = false;

    //SE ESTIVERMOS NA PAGINA DE REGISTO--------------------------------------------------------------
    if(tituloForm.textContent == "Register"){
        //SE JA HOUVER ALGUM UTILIZADOR REGISTADO

        //SE TODOS OS CAMPOS DE REGISTRO ESTIVEREM PREENCHIDOS
        if(input_mail!="" && input_password!="" && input_password!= ""){
            //SE JÁ HOUVEREM UTILIZADORES REGISTADOS
            if(storageUsers){
            
                //VER SE HÁ ALGUM USER JA COM O MESMO USERNAME OU EMAIL
                for(var i =0; i< storageUsers.length; i++){
                    if(input_username == storageUsers[i].name || input_mail == storageUsers[i].mail){
                        //UTILIZADOR JA REGISTADO
                        registado = true;
                        //RESET OS INPUTS
                        input_username = "";
                        input_password = "";
                        input_mail = "";
                        //MENSAGEM DE ALERTA QUE JÁ EXISTE UM UTILIZADOR COM AQUELE USERNAME OU EMAIL
                        return alert("Username|Email already taken");
                
                    } 
                }
                //SE AINDA NÃO HOUVER UTILIZADORES COM AQUELE USERNAME E EMAIL
                if(registado == false){
                    //REGISTADO
                    alert("Register with success");
                    //ADICIONAR À LOCALSTORE O USER
                    storageUsers.push({name: input_username,mail: input_mail, password: input_password });
                    localStorage.setItem("users", JSON.stringify(storageUsers));
                    //IR PARA A PAGINA DE LOGIN
                    document.actionName.action = "./login.html";
                    //RESET OS INPUTS
                    input_username = "";
                    input_password = "";
                    input_mail = "";
                }
            }
            //SE NAO HOUVER UTILIZADORES REGISTADOS
            else{ 
                //REGISTADO
                alert("Register with success"); 
                //ADICIONAR NA LOCALSTORE O USER     
                localStorage.setItem("users", JSON.stringify([{name: input_username,mail: input_mail, password: input_password}]));
                //IR PARA A LOGIN PAGE
                document.actionName.action = "./login.html";
                //RESET OS INPUTS
                input_username = "";
                input_password = "";
                input_mail = "";
            } 
        } //SE ALGUM CAMPO DE REGISTRO NÃO ESTIVER PREENCHIDO        
        else{
            alert("pleasee fill all the fields");
        }
        
    }//SE ESTIVERMOS NA PAGINA DE LOGIN-----------------------------------------------------------------
    else{
        //SE HOUVER JA UTILIZADORES REGISTADOS
        if(storageUsers){
            //PERCORRER OS USERS
            for(var i =0; i< storageUsers.length; i++){
                //SE O INPUT DE USERNAME E PASSWORD CORRESPONDEREM COM ALGUM DOS REGISTADOS
                if(input_username == storageUsers[i].name && input_password == storageUsers[i].password){      
                   
                    //VAI PARA O INDEX
                    document.actionName.action = "./index.html";
                    //ADICIONA UMA "CHAVE" PARA SABER QUE AQUELE USER FEZ LOGIN
                    localStorage.setItem("loggedUser", i);
                    //addPlateToStorage();
                    //MENSAGEM DE ALERTA QUE FEZ LOGIN
                    return alert(`Hi! ${storageUsers[i].name}`);
                    
                
                } 

                
                    
                
            }
            //QUANDO HÁ ENGANO A COLOCAR A PASSWORD OU USERNAME OU NAO TIVER REGISTADO APESAR DE JA HAVEREM OUTROS REGISTADOS
           return alert("incorrect password/username")
        }
        //SE FIZER LOGIN E NÃO HOUVER UTILIZADORES REGISTADOS DÁ ERRO
        else {
            return alert("error!!!!!");
        }

  
}
} //END OF FORM------------------------------------------------------------------------------------------



//LOGIN LOGOUT BUTTON ----- HOMEPAGE

//VARIAVEIS
var Userhaslogged = document.querySelector(".login-index");
var centeredInformation = document.querySelector(".centerLogged");
var nameoftheUser = document.getElementById("UsernameLogged");

var schedule = document.getElementById("schedule");

//PARA NAO HAVER ERROS NA PAGINA DE LOGIN VISTO QUE A CARTA SÓ APARECE NA INDEXPAGE

if(carta!=null){

//SE TIVER SIDO FEITO LOGIN
if (localStorage.getItem("loggedUser") != null){
    Userhaslogged.textContent = "LOGOUT";
    centeredInformation.style.display="block";
    //FAZER DISPLAY DO USERNAME DE QUEM FEZ LOGIN
    nameoftheUser.textContent = `Welcome ${storageUsers[localStorage.getItem("loggedUser")].name}`;
    Userhaslogged.href = "./index.html";
    //MOSTRAR A SECÇÃO SCHEDULE
    schedule.style.display = "block";

    //FAZER LOGOUT
    var logout = document.querySelector(".login-index");
    logout.onclick = function(){
    //REMOVER A CHAVE QUE INDICA QUEM FEZ LOGIN
    localStorage.removeItem("loggedUser");
    //ALERTA DE QUE FEZ LOGOUT
    alert("Thanks for your visit!");
    }

}
//SE NINGUEM FEZ LOGIN
else {   
    //BOTAO == LOGIN
    Userhaslogged.textContent = "LOGIN";
    Userhaslogged.href = "./login.html";
    //NAO FAZ DISPLAY DO WELCOME USERNAME
    centeredInformation.style.display="none";
    //NAO FAZ DISPLAY DA SECÇÃO SCHEDULE
    schedule.style.display = "none";
}


//CRIAR A SECÇÃO SCHEDULE------------------------------------------------------------------------
var schedule_choose = document.querySelector(".schedule-plate");

// i+=2 PARA QUE OS PRATOS DE CADA DIA QUE SAO DOIS FIQUEM JUNTOS E ASSIM SÓ CRIA 5 TITULOS 
for (var i = 0; i < plates.length; i+=2){

//CRIAR UM DIV PARA CADA DIA DA SEMANA
var diaDaSemana = document.createElement("div");
diaDaSemana.classList.add("diaDaSemana");
schedule_choose.append(diaDaSemana);
//CRIAR OS TITULOS (DIA DA SEMANA)
var tituloSemana = document.createElement("h2");
tituloSemana.classList.add("tituloSemana");
tituloSemana.textContent = `${plates[i].Day} |`;
diaDaSemana.append(tituloSemana);

//PRATO DE FISH
var prato = document.createElement("div");
prato.classList.add("prato-book");

var prato_tipo = document.createElement("h4");
prato_tipo.textContent = `${plates[i].Type} |`

var titulo_prato = document.createElement("h3");
titulo_prato.textContent = plates[i].Name;

var botao = document.createElement("input");
botao.setAttribute("id",`botaoelem${i}`);
botao.classList.add("checkbox-botao");
botao.type = "checkbox";
botao.name = plates[i].Day;
botao.value = plates[i].Price;

//PRATO DE MEAT
var prato2 = document.createElement("div");
prato2.classList.add("prato-book");

var prato2_tipo = document.createElement("h4");
prato2_tipo.textContent = `${plates[i+1].Type} |`

var titulo_prato2 = document.createElement("h3");
titulo_prato2.textContent = plates[i+1].Name;

var botao2 = document.createElement("input");
botao2.setAttribute("id",`botaoelem${i+1}`);
botao2.classList.add("checkbox-botao");
botao2.type = "checkbox";
botao2.name = plates[i].Day;
botao2.value = plates[i+1].Price;

diaDaSemana.append(prato);
prato.append(prato_tipo);
prato.append(titulo_prato);
prato.append(botao);

diaDaSemana.append(prato2);
prato2.append(prato2_tipo);
prato2.append(titulo_prato2);
prato2.append(botao2);



}
//FIM DA SECÇÃO SCHEDULE---------------------------------------------------------------


//CHECH AND UNCHEK BOTOES--------------------------------------------------------------------------------------
//VARIAVEIS DE CADA BOTAO, PARA SE PODER FAZER UNCHECK DO PRATO DE CARNE SE PEIXE ESTIVER CHECK E VICE VERSA
var botao0 = document.getElementById(`botaoelem0`);
var botao1 = document.getElementById(`botaoelem1`);
var botao2 = document.getElementById(`botaoelem2`);
var botao3 = document.getElementById(`botaoelem3`);
var botao4 = document.getElementById(`botaoelem4`);
var botao5 = document.getElementById(`botaoelem5`);
var botao6 = document.getElementById(`botaoelem6`);
var botao7 = document.getElementById(`botaoelem7`);
var botao8 = document.getElementById(`botaoelem8`);
var botao9 = document.getElementById(`botaoelem9`);

//CADA VEZ QUE SE CLICA NUM BOTAO É CHAMADA A FUNÇÃO updateCost() CRIADA A SEGUIR PARA FAZER UPDATE DO TOTAL (PREÇO)
botao0.onclick = function(){
        if(botao0.checked){  
            botao1.checked = false;
              
        }
        updateCost();
    }
botao1.onclick = function(){
        if(botao1.checked){
            botao0.checked = false;
          
        }
        updateCost();
    }
botao2.onclick = function(){
    if(botao2.checked){
        
        botao3.checked = false;
    }
    updateCost();
}
botao3.onclick = function(){
    if(botao3.checked){

        botao2.checked = false;
    }
    updateCost();
}

botao4.onclick = function(){
    if(botao4.checked){
       
        botao5.checked = false;
    }
    updateCost();
}
botao5.onclick = function(){
    if(botao5.checked){
        
        botao4.checked = false;
    }
    updateCost();
}
botao6.onclick = function(){
if(botao6.checked){
    
    botao7.checked = false;
}
updateCost();
}
botao7.onclick = function(){
if(botao7.checked){
   
    botao6.checked = false;
}
updateCost();
}
botao8.onclick = function(){
    if(botao8.checked){
       
        botao9.checked = false;
}
updateCost();
}
botao9.onclick = function(){
    if(botao9.checked){
        
        botao8.checked = false;
    }
    updateCost();
}
//FIM CHECH AND UNCHEK BOTOES--------------------------------------------------------------------------------------

//FUNÇAO QUE FAZ O UPDATE DO CUSTO -> TOTAL
function updateCost(){

    //INICIALMENTE TOTAL=0
    var total = 0;
    //ADICIONA-SE AO TOTAL O VALOR DO BOTAO QUE É O PREÇO DO PRATO, SE NENHUM DE CADA PAR DE PRATOS ESTIVER CHECK ENTAO É ADICIONADO 0 AO TOTAL
    if(botao0.checked)
        total+= parseFloat(botao0.value);
    else if(botao1.checked)
        total+= parseFloat(botao1.value);
    else{
        total+=0; 
    }

    if(botao2.checked)
        total+= parseFloat(botao2.value);
    else if(botao3.checked)
        total+= parseFloat(botao3.value);
    else{
        total+=0; 
    }

    if(botao4.checked)
        total+= parseFloat(botao4.value);
    else if(botao5.checked)
        total+= parseFloat(botao5.value);
    else{
        total+=0; 
    }

    if(botao6.checked)
        total+= parseFloat(botao6.value);
    else if(botao7.checked)
        total+= parseFloat(botao7.value);
    else{
        total+=0; 
    }

    if(botao8.checked)
        total+= parseFloat(botao8.value);
    else if(botao9.checked)
        total+= parseFloat(botao9.value);
    else{
        total+=0; 
    }

    //TOTAL QUE É DISPLAY NO ECRÃ
    var totalContainer = document.querySelector(".total");
    totalContainer.textContent = `Total: ${total} $`;

    //É FEITO O UPDATE PARA A LOCALSTORAGE E ASSIM SABER QUE PRATO FOI CHECKED OU NÃO
    addPlateToStorage();
  
}

//LOCALSTORAGE
//USERS
var storageUsers = JSON.parse(localStorage.getItem("users"));
//USER QUE FEZ LOGIN
var userLogged = localStorage.getItem("loggedUser");
//PRATOS DE CADA DDIA DA SEMANA
var arrayMonday = JSON.parse(localStorage.getItem("plateMonday"));
var arrayTuesday = JSON.parse(localStorage.getItem("plateTuesday"));
var arrayWednesday = JSON.parse(localStorage.getItem("plateWednesday"));
var arrayThursday = JSON.parse(localStorage.getItem("plateThursday"));
var arrayFriday = JSON.parse(localStorage.getItem("plateFriday"));

//VARIAVEL CONTA, QUE SERVE PARA SABER SE JÁ EXISTEM PRATOS NO UTILIZADOR QUE FEZ LOGIN
var conta = 0;
//NO INICIO NÃO TEM PRATOS ESCOLHIDOS
var semPratos = true;


//FUNÇÃO QUE ADICIONA OS PRATOS À LOCALSTORAGE
function addPlateToStorage(){
    //SE JA HOUVER PRATOS ADICIONADOS POR ALGUM UTILIZADOR 
    if(arrayMonday != null){
        //PERCORRER OS OBJECTOS DO ARRAY
        for(var i=0; i < arrayMonday.length; i++){
            //VER SE JÁ SE ENCONTRA NA LOCALSTORAGE OS PRATOS CORRESPONDENTES AO USER QUE FEZ LOGIN, SE NÃO ENTAO conta+=1; 
            if(storageUsers[userLogged].name != arrayMonday[i].user){
                //console.log(storageUsers[userLogged].name)
                //console.log(arrayMonday[i].user);
                conta+=1;    
            } 
            
        }
        //SE ESSA VARIAVEL conta FOR IGUAL AO COMPRIMENTO DO ARRAY QUER DIZER QUE AINDA NÃO HA PRATOS ADICIONADOS
        if(conta == arrayMonday.length && arrayMonday.length>=1){
            
            //alert("nao tem pratos adicionadso");
            //VAI ENTAO ADICIONAR OS PRATOS AO USER CORRESPONDENTE
            semPratos = false;
           
            
        }
        conta=0;
        
        if(!semPratos){
            //ADICIONA OS PRATOS
            arrayMonday.push({user: storageUsers[localStorage.getItem("loggedUser")].name, fish: botao0.checked,meat: botao1.checked});
            arrayTuesday.push({user: storageUsers[localStorage.getItem("loggedUser")].name, fish: botao2.checked,meat: botao3.checked});
            arrayWednesday.push({user: storageUsers[localStorage.getItem("loggedUser")].name, fish: botao4.checked,meat: botao5.checked});
            arrayThursday.push({user: storageUsers[localStorage.getItem("loggedUser")].name, fish: botao6.checked,meat: botao7.checked});
            arrayFriday.push({user: storageUsers[localStorage.getItem("loggedUser")].name, fish: botao9.checked,meat: botao8.checked});
   
            localStorage.setItem("plateMonday", JSON.stringify(arrayMonday));
            localStorage.setItem("plateTuesday", JSON.stringify(arrayTuesday));
            localStorage.setItem("plateWednesday", JSON.stringify(arrayWednesday));
            localStorage.setItem("plateThursday", JSON.stringify(arrayThursday));
            localStorage.setItem("plateFriday", JSON.stringify(arrayFriday));
            //FAZ RESET DA VARIAVEL SEMPRATOS
            semPratos = true;

        } else{
            //SE JA TIVER PRATOS ENTAO VAI FAZER EDIT
            //alert("edit");
            editPlate();
        }
    } //SE AINDA NINGUEM ADICIONOU PRATOS
    else{
        //alert("ninguem fez antes");
        editPlate();
    }
    
 
    
}

//FUNÇÃO EDIT DOS PRATOS-----------------------------------------------------------------------------------------
function editPlate(){

//SE FOR O PRIMEIRO USER A ADICIONAR PRATOS
if(arrayMonday==null){
    arrayMonday = [{user: storageUsers[userLogged].name, fish: botao0.checked,meat: botao1.checked}];
    arrayTuesday = [{user: storageUsers[userLogged].name, fish: botao2.checked,meat: botao3.checked}];
    arrayWednesday =[{user: storageUsers[userLogged].name, fish: botao4.checked,meat: botao5.checked}];
    arrayThursday =[{user: storageUsers[userLogged].name, fish: botao6.checked,meat: botao7.checked}];
    arrayFriday=[{user: storageUsers[userLogged].name, fish: botao9.checked,meat: botao8.checked}];
    localStorage.setItem("plateMonday", JSON.stringify(arrayMonday));
    localStorage.setItem("plateTuesday", JSON.stringify(arrayTuesday));
    localStorage.setItem("plateWednesday", JSON.stringify(arrayWednesday));
    localStorage.setItem("plateThursday", JSON.stringify(arrayThursday));
    localStorage.setItem("plateFriday", JSON.stringify(arrayFriday));
}
//SE JA HOUVER PRATOS ADICIONADOS POR OUTROS USERS
else{
//PERCORRE O ARRAY À PROCURA DAQUELE EM QUE O USER CORRESPONDE AO USER QUE FEZ LOGIN (USERLOGGED)
    for(var i=0; i< arrayMonday.length;i++){
      if(storageUsers[userLogged].name == arrayMonday[i].user){
    arrayMonday[i] = {user: storageUsers[userLogged].name, fish: botao0.checked,meat: botao1.checked};
    arrayTuesday[i] = {user: storageUsers[userLogged].name, fish: botao2.checked,meat: botao3.checked};
    arrayWednesday[i] ={user: storageUsers[userLogged].name, fish: botao4.checked,meat: botao5.checked};
    arrayThursday[i] ={user: storageUsers[userLogged].name, fish: botao6.checked,meat: botao7.checked};
    arrayFriday[i] ={user: storageUsers[userLogged].name, fish: botao9.checked,meat: botao8.checked};
    localStorage.setItem("plateMonday", JSON.stringify(arrayMonday));
    localStorage.setItem("plateTuesday", JSON.stringify(arrayTuesday));
    localStorage.setItem("plateWednesday", JSON.stringify(arrayWednesday));
    localStorage.setItem("plateThursday", JSON.stringify(arrayThursday));
    localStorage.setItem("plateFriday", JSON.stringify(arrayFriday));

   }
    }
}
} //FIM DA FUNÇÃO EDIT LOCALSTORAGE

//FUNÇÃO QUE VAI BUSCAR OS PRATOS ADICIONADOS | VERIFICA PRIMEIRO QUAL O USER QUE FEZ LOGIN PARA SABER QUAL IR BUSCAR
function storageCheckPlates(){

    
for(var i=0; i< arrayMonday.length;i++){
//se o nome corresponde ao que ta login     
if(storageUsers[userLogged].name == arrayMonday[i].user){
//var plateMonday = JSON.parse(localStorage.getItem("plateMonday")); //comentei pq a criei abaixo da função

if(arrayMonday[i].fish == true){
    botao0.checked =true;
}
else if(arrayMonday[i].meat == true){
    botao1.checked =true;
}

var plateTuesday = JSON.parse(localStorage.getItem("plateTuesday"));
if(plateTuesday[i].fish == true){
    botao2.checked =true;
}
else if(plateTuesday[i].meat == true){
    botao3.checked =true;
}

var plateWednesday = JSON.parse(localStorage.getItem("plateWednesday"));
if(plateWednesday[i].fish == true){
    botao4.checked =true;
}
else if(plateWednesday[i].meat == true){
    botao5.checked =true;
}

var plateThursday = JSON.parse(localStorage.getItem("plateThursday"));
if(plateThursday[i].fish == true){
    botao6.checked =true;
}
else if(plateThursday[i].meat == true){
    botao7.checked =true;
}

var plateFriday = JSON.parse(localStorage.getItem("plateFriday"));
if(plateFriday[i].fish == true){
    botao9.checked =true;
}
else if(plateFriday[i].meat == true){
    botao8.checked =true;
}
        }

    }
    //FAZ UM UPDATE DO TOTAL
    updateCost();
}

//CHAMA A FUNÇÃO QUE VÊ OS PRATOS QUE TINHAM SIDO ADICIONADOS NA LOCALSTORAGE, SE HOUVER LOGIN E SE HOUVER PRATOS ADICIONADOS
var plateMonday = JSON.parse(localStorage.getItem("plateMonday"));
if(userLogged!= null && arrayMonday!= null){
    
        storageCheckPlates();
    
 }
}























 


   



   
    

 

