$(document).ready(function(){msg=document.getElementById("messages");var e=document.createElement("span");e.appendChild(document.createTextNode("X"));for(var t=0;t<msg.children.length;t++){console.log(t);j=e.cloneNode(!0);j.addEventListener("click",function(){this.parentNode.parentNode.removeChild(this.parentNode)},!1);msg.children[t].appendChild(j)}});