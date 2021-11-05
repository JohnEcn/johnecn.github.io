    let coinList = null;
    let timeOutId = null;

    async function openUserDataPopup()
    {   
        blurBg(8);
        document.getElementById('fullPageovelay').style.display = "initial";
        
        if(coinList == null)
        {
            await fetch('https://api.coingecko.com/api/v3/coins/list')
        .then(response => response.text())
        .then(text => coinList = JSON.parse(text));
        }        

        if(coinList.length != 0)
        {
            document.getElementById('insert-editDataPopup').style.display = "flex";
            document.getElementById('fullPageovelay').style.display = "initial";
        }
        else
        {
           closeUserDataPopup();    
            alert("error");
        }
    }
   
    function closeUserDataPopup()
    {
        //Reset to initial state
        document.getElementById("coinNameSearch").value = "";
        document.getElementById("newCoinHoldings").value = "";
        document.getElementById("coinImg").src = "";
        document.getElementById("coinName").innerText = "";
        document.getElementById("coinId").innerText = "";
        document.getElementById("coinImg").style.visibility = "hidden";
        document.getElementById("saveButton").disabled = true;
        document.getElementById("coinNameSearch").disabled = false; 
        document.getElementById("deleteCoinBtn").style.display = "none";
        
        document.getElementById('insert-editDataPopup').style.display = "none";
        document.getElementById('fullPageovelay').style.display = "none";
           
        blurBg(0);
    }

    function coinSymbolInput()
    {
        clearTimeout(timeOutId);
        timeOutId = setTimeout(() =>
        {
            let searchQuery = document.getElementById("coinNameSearch").value.toLowerCase();
            let coinData = searchForCoin(searchQuery);
            if(coinData.length == 1 || coinData.length == 0)
            {
                coinData.length == 1 ? setCoinData(coinData[0]) : setCoinData(["","",""]) ;
            }
            else
            {
                console.log(coinData);
                coinDropDown(coinData);
            }

        },460)
    }

    function searchForCoin(coinSymbol)
    {
       const coinData = [];
       for(let i=0;i<coinList.length;i++)
        {
            if(coinList[i].symbol.toLowerCase() == coinSymbol)
            {
                const temp = ["","",""];
                temp[2] = coinList[i].symbol;
                temp[1] = coinList[i].name; 
                temp[0] = coinList[i].id;     
                coinData.push(temp)                                        
            }
        }
        return coinData;
    }

    async function coinDropDown(coinData)
    {          
        let container = document.getElementById("dropDownContent");
        container.innerHTML = "";
        for(let i=0; i<coinData.length; i++)
        {
            const newDiv = document.createElement("div");
            newDiv.innerHTML = '<div class="dropDownCoin">'
                    +  '<img class="dropDownImg" src="'+await getCoinImgUrl(coinData[i][0])+'" alt="">'
                    +   '<span> - </span>'     
                    +    '<span class="dropDownName">'+coinData[i][1]+'</span>'
                + '</div>';
               newDiv.addEventListener("click", function() 
               {
                   setCoinData(coinData[i]);
               });
            container.appendChild(newDiv);
        }
    }

    async function setCoinData(coinData)
    {
        let imgElement = document.getElementById("coinImg");
        let nameElement = document.getElementById("coinName");
        let idElement = document.getElementById("coinId");
        let errorLabel = document.getElementById("coinErrorLabel");
        document.getElementById("dropDownContent").innerHTML = "";        

        const coinSymbol = coinData[2];
        const coinName = coinData[1];  
        const coinId = coinData[0];   
    
        if(coinSymbol != "")
        {
            imgElement.src = await getCoinImgUrl(coinId);  
            imgElement.style.visibility = "initial";
            nameElement.innerText = coinName;
            idElement.innerText = coinId;
            errorLabel.innerText = "";
            document.getElementById("saveButton").disabled = false;
        }
        else
        {
            //Reset  to initial state
            imgElement.src = "";  
            imgElement.onerror = function(){};
            imgElement.style.visibility = "hidden";
            nameElement.innerText = coinName;
            errorLabel.innerText = "-Nothing found-";
            document.getElementById("saveButton").disabled = true;
        }  
    }

    function addNewCoin()
    {
        let coinSymbol = document.getElementById("coinNameSearch").value;
        let coinId = document.getElementById("coinId").innerText;
        let coinName = document.getElementById("coinName").innerText;
        let coinImgUrl = document.getElementById("coinImg").src;
        let holdings = document.getElementById("newCoinHoldings").value;

        if(!Number.isInteger(Number.parseInt(holdings)))
        {
            holdings = 0;
        }
        addNewPortfCoin(coinName,coinId,coinSymbol,coinImgUrl,holdings);
        closeUserDataPopup();
        loadData(); 
    }
    async function getCoinImgUrl(coinId)
    {
        let imgUrl = "";
        await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids='+coinId)
        .then(response => response.text())
        .then(text => imgUrl = JSON.parse(text)[0].image);
        return imgUrl;
    }
    async function editCoin(coinSymbol,coinName,coinId,holdings,imgUrl)
    {
        await openUserDataPopup();
        
        //set values
        document.getElementById("coinNameSearch").value = coinSymbol;
        document.getElementById("newCoinHoldings").value = holdings;
        document.getElementById("coinImg").src = imgUrl;
        document.getElementById("coinName").innerText = coinName;
        document.getElementById("coinId").innerText = coinId;
        document.getElementById("coinImg").style.visibility = "initial";
        document.getElementById("saveButton").disabled = false;

        //Disable the symbol textfield
        document.getElementById("coinNameSearch").disabled = true;

        //Display delete button
        document.getElementById("deleteCoinBtn").style.display = "initial";

        //Clone the delete button to remove existing eventListeners 
        let deleteBtn = document.getElementById("deleteCoinBtn");
        let delBtnParent = deleteBtn.parentNode;
        delBtnParent.removeChild(deleteBtn);
        delBtnParent.appendChild(deleteBtn.cloneNode(true));    
        document.getElementById("deleteCoinBtn").addEventListener("click",function()
        {
            removePortfCoin(coinId);
            closeUserDataPopup();
            loadData();
        })
    }