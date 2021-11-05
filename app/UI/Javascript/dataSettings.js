function initSettings()
{
    let currency = JSON.parse(localStorage.getItem("currency"));
    let daysRange = JSON.parse(localStorage.getItem("daysRange"));

    if(currency == null || daysRange == null)
    {
        localStorage.setItem("currency",JSON.stringify(["usd","$"]));
        localStorage.setItem("daysRange",JSON.stringify(7));
        initSettings();
    }

    document.getElementById("currency").innerText = currency[0] +" - "+ currency[1];
    document.getElementById("daysRange").innerText = daysRange == 1 ? "24 Hours" : daysRange + " Days";
}
initSettings();
function currencySelect()
{
    const supportedCur = [
        ["eur","€"],
        ["usd","$"]
    ];

    let nextCurrency = function()
    {
        let currentCurrency = document.getElementById("currency").innerText;

        for(let i=0; i< supportedCur.length; i++)
        {
            if(currentCurrency == supportedCur[i][0] +" - "+ supportedCur[i][1])
            {
                if(i == supportedCur.length-1)
                {
                    document.getElementById("currency").innerText =  supportedCur[0][0] +" - "+ supportedCur[0][1];
                    localStorage.setItem("currency",JSON.stringify(supportedCur[0]));
                }
                else
                {
                    document.getElementById("currency").innerText =  supportedCur[i+1][0] +" - "+ supportedCur[i+1][1];
                    localStorage.setItem("currency",JSON.stringify(supportedCur[i+1]));
                }               
            }
        }
    }
    return nextCurrency;
}
function rangeSelect()
{
    const supportedRange = [
        ["24 Hours",1],
        ["4 Days",4],
        ["7 Days",7],
        ["14 Days",14],
        ["30 Days",30],
        ["90 Days",90],
        ["180 Days",180],
        ["365 Days",365],
    ];

    let nextRange = function()
    {
        let currentRange = JSON.parse(localStorage.getItem("daysRange"));

        for(let i=0; i< supportedRange.length; i++)
        {
            if(currentRange == supportedRange[i][1])
            {
                if(i == supportedRange.length-1)
                {
                    document.getElementById("daysRange").innerText =  supportedRange[0][0];
                    localStorage.setItem("daysRange",JSON.stringify(supportedRange[0][1]));
                }
                else
                {
                    document.getElementById("daysRange").innerText =  supportedRange[i+1][0];
                    localStorage.setItem("daysRange",JSON.stringify(supportedRange[i+1][1]));
                }               
            }
        }
    }
    return nextRange;
}