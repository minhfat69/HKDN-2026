/*==================================================
                LOGIN PAGE
==================================================*/


const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");

loginTab.onclick = showLogin;
registerTab.onclick = showRegister;


/*==================================================
                INIT
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        if(isLogin()){

            location.href="index.html";

        }

    }

);


/*==================================================
            SHOW REGISTER
==================================================*/

function showRegister(){

    loginBox.classList.add("hidden");
    registerBox.classList.remove("hidden");

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

}


/*==================================================
            SHOW LOGIN
==================================================*/

function showLogin(){

    loginBox.classList.remove("hidden");
    registerBox.classList.add("hidden");

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

}


/*==================================================
                LOGIN
==================================================*/

if(loginForm){

loginForm.addEventListener(

"submit",

async function(e){

    e.preventDefault();

    const account =

    document.getElementById(

        "account"

    ).value.trim();

    const password =

    document.getElementById(

        "password"

    ).value;

    if(!account||!password){

        showToast(

            "Vui lòng nhập đầy đủ thông tin."

        );

        return;

    }

    await login(

        account,

        password

    );

});

}


/*==================================================
                REGISTER
==================================================*/

if(registerForm){

registerForm.addEventListener(

"submit",

async function(e){

    e.preventDefault();

    const data={

        fullName:

        document.getElementById(

            "fullName"

        ).value.trim(),

        email:

        document.getElementById(

            "email"

        ).value.trim(),

        phone:

        document.getElementById(

            "phone"

        ).value.trim(),

        username:

        document.getElementById(

            "username"

        ).value.trim(),

        password:

        document.getElementById(

            "registerPassword"

        ).value

    };

    if(

        !data.fullName ||

        !data.phone ||

        !data.username ||

        !data.password

    ){

        showToast(

            "Vui lòng nhập đầy đủ thông tin."

        );

        return;

    }

    await register(data);

});

}