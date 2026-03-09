function detectSymbol(){

let url=window.location.href

if(url.includes("tradingview")){

let match=url.match(/symbol=([A-Z]+):([A-Z]+)/)

if(match) return match[2]

}

if(url.includes("binance")){

let match=url.match(/trade\/([A-Z]+)_([A-Z]+)/)

if(match) return match[1]+match[2]

}

return "BTCUSDT"

}

chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{

if(request.type==="GET_SYMBOL"){

sendResponse({
symbol:detectSymbol()
})

}

})