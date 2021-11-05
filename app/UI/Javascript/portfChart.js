function totalHoldings(data,currency)
{
    document.getElementById("totalHoldings").innerHTML = currency + formatPrices(data[data.length-1][1]);
    const percentChange = ( (data[data.length-1][1] - data[0][1]) / data[0][1] ) *100;
    setPerc(percentChange,document.getElementById("percentChanges"));
    setContainerColor(percentChange);
}
function setContainerColor(percentage)
{
    let colorGrad = "linear-gradient(180.14deg,rgba(182, 22, 22, 0)3.77%,rgb(38, 34, 53) 32.44%,rgb(38, 34, 53) 99.88%);";
    let opacity = Math.abs(percentage)*0.015;

    if(percentage > 0)
    {
        colorGrad = "linear-gradient(180.14deg,rgba(27, 182, 22,"+ opacity +")3.77%,rgb(38, 34, 53) 32.44%,rgb(38, 34, 53) 99.88%)"; 
    }
    else if(percentage < 0)
    {
        colorGrad = "linear-gradient(180.14deg,rgba(182, 22, 22,"+ opacity +")3.77%,rgb(38, 34, 53) 32.44%,rgb(38, 34, 53) 99.88%)"; 
    }
    document.getElementById("portfChartContainer").style.background = colorGrad;
}
function buildChart(dataset)
{
    const labels = [];
    const values = [];
    dataset.forEach(element => {
        labels.push(element[0])  
        values.push(element[1])       
    });

    const data = 
    {
        labels: labels,
        datasets: [
        {
            label: '',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderColor: 'rgb(0, 255, 0)',
            color:'rgb(0, 255, 0)',
            data: values,
        }]
    };

    const config = 
    {
        type: 'line',
        data: data,
        options: 
        {
            scales: {
                x: {display:false},
                y: {display:false}       
            },
            plugins: {
                legend: {display: false}
            },
            elements:{
                point:{
                    radius:0,
                    pointStyle:'crossRot'
                }
            },
            tooltips: {},
            Animation:false
        }
    }; 
    
    //Attempt to destroy chart if it exists
    if(Chart.getChart('myChart') !=null)
    {
        Chart.getChart('myChart').destroy();
    }
    
    var myChart = new Chart(document.getElementById('myChart'),config);
}

