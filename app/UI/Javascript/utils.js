function blurBg(px)
{
    document.getElementById("mainContainer").style.filter = "blur("+px+"px)";
    if(px == 0)
    {
        document.getElementById("loadingGif").style.display =  "none";
    }
    else
    {
        document.getElementById("loadingGif").style.display =  "initial";
    }
}
function displayErrorMsg(msg,duration = null)
{
    let msgSpan = document.getElementById("errorMsg");
    let msgDiv = document.getElementById("errorMsgPanel");
    
    msgSpan.innerText = msg;
    msgSpan.style.display = "initial";
    msgDiv.style.display = "flex";
    msgDiv.style.height = "4vh";

    if(duration != null)
    {
        setTimeout(function()
        {
            hideErrorMsg();
        },duration*1000)
    }
}
function hideErrorMsg()
{
    let msgSpan = document.getElementById("errorMsg");
    let msgDiv = document.getElementById("errorMsgPanel");
    
    msgSpan.innerText = "";
    msgSpan.style.display = "none";
    msgDiv.style.display = "none";
    msgDiv.style.height = "0px";    
    
}
    