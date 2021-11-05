const userCoinsKey = "demo-coinData";
function addNewPortfCoin(coinName,coinId,coinSymbol,coinImgUrl,holdings)
{
    removePortfCoin(coinId);  
    let coinData = JSON.parse(fetchUserCoins());      
    coinData.push({
        coinName:coinName,
        coinId:coinId,
        coinSymbol:coinSymbol,
        coinImgUrl:coinImgUrl,
        holdings:holdings
    })
    localStorage.setItem(userCoinsKey,JSON.stringify(coinData));
}

function removePortfCoin(coinId)
{
    let coinData = JSON.parse(fetchUserCoins()); 
    for(let i=0;i<coinData.length;i++)
    {
        if(coinData[i].coinId == coinId)
        {
            coinData.splice(i,1);
            localStorage.setItem(userCoinsKey,JSON.stringify(coinData));
            break;
        }
    }    
}

function fetchUserCoins()
{
    let data = localStorage.getItem(userCoinsKey);
    if(data == null){data = "[]";}
    return data;
}
    