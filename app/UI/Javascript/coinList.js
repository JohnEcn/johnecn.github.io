blurBg(8);
function displayCoinList(coinData,currencyStr)
{
    //Get the parent element of coinsList
    const coinList = document.getElementById("coinListContainer");    

    //Get the prototype row and remove the id
    const coinRowDiv = document.getElementById("coinRowPrototype");
    const labels = document.getElementById("coinLabelsRow");

    //Empty the list and repopulate it to make possible to restart the app
    //with the load() funtion;
    coinList.innerHTML = "";
    coinList.appendChild(labels);
    coinList.appendChild(coinRowDiv);

    for(let i=0;i<coinData.length;i++)
    {
        let newRow = coinRowDiv.cloneNode(true);

        //CoinName
        newRow.childNodes[1].childNodes[3].childNodes[3].innerHTML = coinData[i].coinName   ;
        //Coin Image
        newRow.childNodes[1].childNodes[3].childNodes[1].src=coinData[i].coinImg.replace("/large/", "/small/");;
        //Coin price
        newRow.childNodes[3].childNodes[3].childNodes[1].innerHTML = currencyStr + formatPrices(coinData[i].currentPrice);
        //Coin percentage change
        setPerc(coinData[i].percChange,newRow.childNodes[3].childNodes[5].childNodes[1]);
        //Coin Holdings price
        newRow.childNodes[5].childNodes[3].childNodes[1].innerHTML = currencyStr + formatPrices(coinData[i].holdings * coinData[i].currentPrice);
        //Coin holdings count
        newRow.childNodes[5].childNodes[5].childNodes[1].innerHTML = coinData[i].holdings;
        //Edit coin eventListener
        newRow.childNodes[7].addEventListener("click",function()
        {
            editCoin(coinData[i].coinSymbol,coinData[i].coinName,coinData[i].coinId,coinData[i].holdings,coinData[i].coinImg)
        });

        newRow.id = "";
        newRow.style = "display:flex";
        coinList.appendChild(newRow);
        blurBg(0);
    }     
}

function formatPrices(number)
{
    if(number < 1)
    {
        return number.toFixed(5);
    }
    return (Math.round(number * 100) / 100).toFixed(2);

}
function formatName(str) {
  return str[0].toUpperCase() + str.slice(1).replace("-"," ").replace("-"," ")  ;;
}
function setPerc(number,node) {

    let red = 200;
    let green = 200;
    let blue = 200;    

    if(number > 0)
    {
        red = red - (red * (number/100))*2.5;
        blue = blue - (blue * (number/100))*2.5;
    }
    else if(number < 0)
    {
        green = green - (green * ((number*-1)/100))*2.5;
        blue = blue - (blue * ((number*-1)/100))*2.5;
    }

    let color = "rgb("+red+","+green+","+blue+")";
    node.style.color = color;
    node.innerHTML = (Math.round(number * 100) / 100).toFixed(2) + "%";
}
