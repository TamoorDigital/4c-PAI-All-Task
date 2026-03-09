document.getElementById("getSignal").onclick=async()=>{

let [tab]=await chrome.tabs.query({active:true,currentWindow:true})

chrome.tabs.sendMessage(tab.id,{type:"GET_SYMBOL"},async(response)=>{

let symbol=response.symbol

let res=await fetch("http://localhost:5000/generate-signal",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
symbol:symbol
})

})

let data=await res.json()

document.getElementById("result").innerText=
JSON.stringify(data,null,2)

})

}