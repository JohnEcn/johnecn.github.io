{
    function getCoinsData(coinList,currency,dataDaysBefore,interval)
    {
        const promiseArr = [];
        const coinIds = [];
        coinList.forEach(element=>
            {
                coinIds.push(element.coinId)
            })

        //Fetching historical data for each coin
        for(let i = 0; i<coinIds.length; i++)
        {            
            let result = fetchCoinData(coinIds[i],currency,dataDaysBefore,interval);
            promiseArr.push(result);                   
        }
        
        //Fetching current data for all coins with a single request
        let result = fetchCoinCurrentPrice(coinIds,currency);
        promiseArr.push(result);   
        
        
        //When all request are complete combine and format the data
        Promise.all(promiseArr).then(
            (values) =>
            {                       
                //Check for request errors before procceding
                //And get the currentData object in the same loop
                let currentCoinData = null;   
                const errorCodes = [];                
                for(let i=values.length-1; i>=0; i--)
                {
                    if(values[i].requestType == "currentCoinData")
                    {
                        currentCoinData =values[i];
                        values.splice(i, 1);
                        continue;
                    }

                    if(values[i].httpCode != 200)
                    {
                        errorCodes.push(values[i]);
                        values.splice(i, 1);
                    }
                }

                if(currentCoinData != null && currentCoinData.httpCode == 200)
                {
                    launchApp(combineFetchedCoinData(currentCoinData,values),errorCodes);                
                }
                else
                {
                    console.log("Cannot fetch data error");
                }         
            }
        );            
    }
    
    function combineFetchedCoinData(currentCoinData,historicalCoinData)
    {
        const coinFormattedData = [];
        const currentCoinDataArr = JSON.parse(currentCoinData.response);
        const coinsList = Object.keys(currentCoinDataArr);
        
        //Combine current and historical data
        coinsList.forEach(coin => 
        {
            let coinId = coin;
            let currentData = currentCoinDataArr[coin];
            let historicalData = [];
            
            for(let i = 0; i<historicalCoinData.length; i++)
            {
                if(coin == historicalCoinData[i].coinName)
                {                    
                    historicalData = JSON.parse(historicalCoinData[i].response);
                    continue;
                }                
            } 
            
            coinFormattedData.push(
            {
                coinId:coinId,
                currentData:currentData,
                historicalData: historicalData
            });
        });          
        return coinFormattedData;
    }

    function extractCoinData(coinsData,coinsList)
    {
        const formattedData = [];

        //Keys are specific to currency so i can't know the exact key
        //For example: 'eur' and 'eur_market_cap' or 'usd' and 'usd_market_cap'
        //Smallest str is price and biggest is market cap
        let currentDataKeys = Object.keys(coinsData[0].currentData);
        let priceKey = currentDataKeys[0].length < currentDataKeys[1].length ? currentDataKeys.splice(0,1)[0] : currentDataKeys.splice(1,1)[0];
        let mkCapKey = currentDataKeys[0];
        let holdings = 0;
        let coinSymbol= "";
        let coinName = "";
        let coinImg = "";
        
        for(let i = 0; i<coinsData.length; i++)
        {        
            for(let j = 0; j<coinsList.length; j++)
            {
                if(coinsList[j].coinId == coinsData[i].coinId)
                {
                    holdings = coinsList[j].holdings; 
                    coinSymbol = coinsList[j].coinSymbol;  
                    coinName = coinsList[j].coinName; 
                    coinImg = coinsList[j].coinImgUrl;
                } 
            }

            //Find least recent price / max price / min price
            //Only if historical data exists
            //[oldestPrice,minPrice,maxPrice]
            const priceData = extractPriceData(objClone(coinsData[i].historicalData));                       

            formattedData.push(
                {
                    coinName:coinName,
                    coinId:coinsData[i].coinId,
                    coinSymbol:coinSymbol,
                    coinImg:coinImg,
                    holdings:holdings,
                    currentPrice:coinsData[i].currentData[priceKey],
                    mkCap:coinsData[i].currentData[mkCapKey],
                    percChange: ((coinsData[i].currentData[priceKey] - priceData[0]) / priceData[0] ) *100,
                    minPrice:priceData[1],
                    maxPrice:priceData[2],
                    historicalData:coinsData[i].historicalData.prices
                })
         }
         return formattedData;
    }

    function extractPriceData(historicalData)
    {
        if(historicalData.length !=0)
            {
                let coinPriceData = historicalData.prices
                let minUnixTime = coinPriceData[0][0];
                let oldestPrice = coinPriceData[0][1];
                let minPrice = coinPriceData[0][1];
                let maxPrice = coinPriceData[0][1];
            
                for(let k = 0; k<coinPriceData.length; k++)
                {
                    if(coinPriceData[k][0] < minUnixTime)
                    {
                        minUnixTime = coinPriceData[k][0];
                        oldestPrice = coinPriceData[k][1];
                    }                  
                    if(coinPriceData[k][1] < minPrice)
                    {
                        minPrice = coinPriceData[k][1];
                    }
                    if(coinPriceData[k][1] > maxPrice)
                    {
                        maxPrice = coinPriceData[k][1];
                    }                  
                }
                return [oldestPrice,minPrice,maxPrice];  
           } 
        return [NaN,NaN,NaN];                           
    }
    
    function buildPortfolioChartData(coinsData,coinsList)
    {      
        //Extract the holdings to an assoc array 
        let holdingsArr = [];
        coinsList.forEach(element =>
            {
                holdingsArr[element.coinId] = element.holdings;
            })    

        const portfChartData = []; 
        
        //Find the min array size of all historicData arrays
        let minArrSize = Infinity;
        for(let k = 0; k<coinsData.length; k++)
        {
            if(coinsData[k].historicalData.length < minArrSize)
            {
                minArrSize = coinsData[k].historicalData.length
            }
        }
        
        //Calculate historic data
        for(let i = 0; i<minArrSize; i++)
        {
            let holdings = 0;
            let avgDate = 0;
                
            for(let k = 0; k<coinsData.length; k++)
            {
                let coinHolding = holdingsArr[coinsData[k].coinId];
                    
                holdings += coinsData[k].historicalData[i][1] * coinHolding;     
                avgDate +=  coinsData[k].historicalData[i][0];  

            }

            portfChartData.push([new Date(avgDate/coinsData.length).toLocaleString('en-GB'),holdings])
        }
        
        //Calculate current data
        let currentHoldings = 0;
        for(let k = 0; k<coinsData.length; k++)
        {
            let coinHolding = holdingsArr[coinsData[k].coinId];                    
            currentHoldings += coinsData[k].currentPrice * coinHolding;  
        }
        portfChartData.push(["Right now",currentHoldings])
        return portfChartData;
    }
}