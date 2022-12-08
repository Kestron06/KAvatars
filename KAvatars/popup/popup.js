chrome.cookies.get({url:"https://www.khanacademy.org/",name:"KAAS"},cookie=>{
    if(cookie){
        document.getElementById("kaas").value=cookie.value;
        document.getElementById("delete").onclick=function(){
            if(confirm("This will remove your custom avatar for all users. Continue?")){
                fetch("https://kavatars-backend.kestron.repl.co/delete?kaas="+cookie.value);
            }
        };
    }
    else{
        document.body.innerHTML="Whoops! Log in to Khan Academy!";
    }
});
fetch("https://kavatars-backend.kestron.repl.co/get").then(d=>d.json()).then(d=>{
    chrome.storage.local.set({"d":d},()=>{});
    console.log(d);
});
document.getElementById("toggle").onclick=function(){
    if(document.getElementById("toggle").innerHTML==="Instructions"){
        document.getElementById("toggle").innerHTML="Main";
        document.getElementById("main").style.display="none";
        document.getElementById("instr").style.display="block";
    }
    else{
        document.getElementById("toggle").innerHTML="Instructions";
        document.getElementById("main").style.display="block";
        document.getElementById("instr").style.display="none";
    }
};
var uploadField = document.getElementById("avatar");

uploadField.onchange = function() {
    if(this.files[0].size > 2000000){
       alert("File is too big!");
       this.value = "";
    };
};