
    let host = "https://api.coingecko.com/api/v3";

    async function fetchCoinData(coinName,currency,days,interval)
    {
        const currencyParam = "vs_currency=" + currency;
        const daysBefore = "days=" + days;
        const intervalParam = "interval=" + interval;         

        const path = "/coins/"+ coinName + "/market_chart";
        const queryStr = "?" + currencyParam + "&" + daysBefore + "&" + intervalParam;
        const url = host + path + queryStr;

        const response = await new Promise(
            resolve => 
            {
                const requestHandler = new XMLHttpRequest();
                requestHandler.open("GET",url);                
                requestHandler.onload = function() 
                {          
                    if(requestHandler.readyState == 4)   
                    {
                        resolve({requestType:"historicCoinData",coinName:coinName,httpCode:requestHandler.status,response:requestHandler.response});
                    }                      
                }
                requestHandler.send();
            }); 

        return response;
    }

    async function fetchCoinCurrentPrice(coinNamesArr,currency)
    {
        const currencyParam = "vs_currencies=" + currency;
        const coinNamesStr = "ids=" + coinNamesArr.join(",");        
        const mkCapParam = "include_market_cap=true";
        
        const path = "/simple/price";
        const queryStr = "?" + coinNamesStr + "&" + currencyParam + "&" + mkCapParam;
        const url = host + path + queryStr;

        let response = await new Promise(
            resolve => 
            {
                const requestHandler = new XMLHttpRequest();
                requestHandler.open("GET",url);   
                requestHandler.setRequestHeader('Cache-Control', 'no-cache');             
                requestHandler.onload = function() 
                {          
                    if(requestHandler.readyState == 4)   
                    {
                        resolve({requestType:"currentCoinData",httpCode:requestHandler.status,response:requestHandler.response});
                    }                             
                }
                requestHandler.send();
            }); 

        return response;
    }

