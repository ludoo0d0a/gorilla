//
// Gorilla console to paste data
// 

/*
<style type="text/css"> 
  .test { background: #ff0000; font-family: "Verdana"; }
</style> 
*/
const cssStyle = ' \
    .gorilla-console {  \
        position:absolute;  \
        top:0; left:0; \
        width: 600px; height: 50px; \
        background: #dedede; font-family: "Verdana";  \
    } \
    .gorilla-console textarea{  \
        width: 550px; height: 50px; \
    } \
    .gorilla-console button{  \
        width: 50px; height: 50px; \
    } \
';

var style = document.createElement("style"); 
style.setAttribute("type","text/css")
style.append(cssStyle);

var head = document.querySelector('head')
head.appendChild(style);

var div=document.createElement("div"); 
div.className = "gorilla-console"
document.body.appendChild(div); 

var t=document.createElement("textarea"); 
div.appendChild(t);

var btn=document.createElement("button"); 
btn.append("ok");
btn.addEventListener('click', event => {
    alert ( `Clicked : ${event.detail}` + t.value) 
});
div.appendChild(btn);

