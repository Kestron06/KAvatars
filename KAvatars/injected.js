let done=false;
let t;
let supported;
async function launch(){
    console.log("Launched");
    if(!location.href.includes("profile")){
        let userAva=document.body.getElementsByClassName("_1732g80e")[0].getElementsByClassName("_9phhti")[0];
        for(var i=0;i<supported.length;i++){
            if(userAva.alt.toLowerCase().endsWith(supported[i].toLowerCase())){
                userAva.src="https://kavatars-backend.kestron.repl.co/"+supported[i]+".png";
            }
        }
        var comments=document.body.getElementsByClassName("_1t544yo9");
        if(comments.length>0){
            for(var i=0;i<comments.length;i++){
                let comm=comments[i];
                let user=comm.getElementsByClassName("_dwmetq")[0].href.split("/profile/")[1].split("/")[0];
                console.log(user+" | "+i);
                for(var j=0;j<supported.length;j++){
                    if(supported[j].toLowerCase()===user.toLowerCase()){
                        comm.getElementsByClassName("_9phhti")[0].src="https://kavatars-backend.kestron.repl.co/"+user+".png";
                    }
                }
            }
        }
        comments=document.body.getElementsByClassName("_1lyzktz3");
        if(comments.length>0){
            for(var i=0;i<comments.length;i++){
                let comm=comments[i];
                let user=comm.getElementsByClassName("_dwmetq")[0].href.split("/profile/")[1].split("/")[0];
                console.log(user+" | "+i);
                for(var j=0;j<supported.length;j++){
                    if(supported[j].toLowerCase()===user.toLowerCase()){
                        comm.getElementsByClassName("_9phhti")[0].src="https://kavatars-backend.kestron.repl.co/"+user+".png";
                    }
                }
            }
        }
    }
    else{
        var profile=document.body.getElementsByClassName('basic-user-info');
        if(profile.length>0){
            profile=profile[0];
            let username;
            try{
                username=profile.getElementsByClassName("_19lfck2n")[0].getElementsByTagName("span")[0].textContent.split("@")[1];
            }
            catch(e){
                username=location.href.split("/profile/")[1];
                if(username.includes("/")){
                    username=username.split("/")[0];
                }
            }
            for(var i=0;i<supported.length;i++){
                if(supported[i].toLowerCase()===username.toLowerCase()){
                    if(!profile.getElementsByClassName("avatar-pic")[0].src.includes("repl")){
                        profile.getElementsByClassName("avatar-pic")[0].src="https://KAvatars-Backend.kestron.repl.co/"+username+".png";
                        done=true;
                    }
                }
            }
        }
    }
    if(done){
        clearInterval(t);
    }
}
async function doIt(){
    await fetch("https://kavatars-backend.kestron.repl.co/get").then(d=>d.json()).then(d=>{
        supported=d.users;
    });
    t=setInterval(launch,1000);
}
doIt();