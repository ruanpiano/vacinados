d3.csv("https://raw.githubusercontent.com/wcota/covid19br/master/cases-brazil-states.csv")
.then(makeChart);

function makeChart(data) {
    if (window.innerHeight <= 800 || window.devicePixelRatio>=2) {
        var altura = window.innerHeight - window.innerHeight*0.3;
        document.getElementById('vacinasPorEstado').height = altura;
        document.getElementById('totalVacinas').height = altura;
    }
    var generalData = data.map(function(d) {return [d.date, d.vaccinated, d.state];});    
    var usefulData = [];
    var stateData = [];    
    var latestData = generalData[generalData.length-1][0];    
    
    generalData.forEach(function(row, i) {
        if ((parseInt(row[1]) > 0) && (row[1] != "")) 
        {
            row[1] = parseInt(row[1]);
            if (row[2] == "TOTAL")
            {            
                var dataVar = new Date(row[0]);
                var dataFormatada = dataVar.getDate()+1+'/'+(dataVar.getUTCMonth()+1)+'/'+dataVar.getFullYear();            
                row[0] = dataFormatada;                
                usefulData.push(row);            
            }
            else
            {
                if (row[0] == latestData)
                stateData.push(row);
            }
        } 
    });    

    var datasUnicas = usefulData.map(function(d) {return d[0];});

    var dadosVacinas = usefulData.map(function(d) {return d[1];});

    var ultimas24Horas = dadosVacinas[dadosVacinas.length-1]-dadosVacinas[dadosVacinas.length-2];

    document.getElementById('24horas').innerText = "+" + ultimas24Horas + " pessoas vacinadas.";

    

    stateData.sort(function (a, b) {
        if (a[1] > b[1]) {            
          return -1;
        }
        if (a[1] < b[1]) {
          return 1;
        }        
        return 0;
      });    
    
    var totalVacinas = new Chart(document.getElementById('totalVacinas').getContext('2d'), {
        type: 'line',    
        data: {
            labels: datasUnicas,
            datasets: [
                {
                    label: "Quantidade de pessoas vacinadas no país",
                    backgroundColor: "#0000FF55",
                    data: dadosVacinas,
                }
            ],
        },
        options: {         
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        // Abbreviate the millions
                        callback: function(value, index, values) {
                            return value / 1e6 + ' milhões';
                        }
                    }
                }]
            }
        }
    });

    var vacinasPorEstado = new Chart(document.getElementById('vacinasPorEstado').getContext('2d'), {
        type: 'horizontalBar',    
        data: {
            labels: stateData.map(function(d) {return d[2];}),
            datasets: [
                {
                    label: "Quantidade de pessoas vacinadas por estado",
                    backgroundColor: "#0000FF55",
                    data: stateData.map(function(d) {return d[1];})                                    
                }
            ],
        },      
        options: {       
            legend: {
                display: false
            },     
            scales: {
                xAxes: [{
                    ticks: {
                        // Abbreviate the millions
                        callback: function(value, index, values) {
                            return value / 1e3 + ' mil';
                        }
                    }
                }]
            }
        } 
    });
}
