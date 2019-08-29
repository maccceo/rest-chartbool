$(document).ready(init);

function init() {
	getMonthProfit();
	getSalesmanProfit();
}


function getMonthProfit() {
	//prendo dati dal server
	$.ajax({
		url: "http://157.230.17.132:4004/sales",
		method: "GET",
		success: function(data) {
			console.log("- DATI RAW -", data);

			// array di 12 posizioni in cui sommo via via gli amount delle vendite
			var monthProfit = new Array(12).fill(0);

			for (var i in data) {
				var vendita = data[i];

				//mese di quella vendita:
				var month = moment(vendita.date, "DD/MM/YYYY").month();

				//la aggiunfo al contatore del fatturato di quel mese
				monthProfit[month] += vendita.amount;
			}
			
			//-----------------
			// CREO IL GRAFICO
			//-----------------

			//Init chart.js
			var ctx = document.getElementById('fatturatoPerMese').getContext('2d');

			//nomi dei mesi
			var months = getMonths();

			var myChart = new Chart(ctx, {
			    type: 'line',
			    data: {
			        labels: months,
			        datasets: [{
			            label: 'Fatturato',
			            data: monthProfit,
			            borderColor: 'rgba(0, 0, 0, 1)',
			            lineTension: 0
			        }]
			    },
			    options: {
			        scales: {
			            yAxes: [{
			                ticks: {
			                    beginAtZero: true
			                }
			            }]
			        }
			    }
			});
		},
		error: function() {
			alert("errore");
		} 
	})
}

function getSalesmanProfit() {
	//prendo dati dal server
	$.ajax({
		url: "http://157.230.17.132:4004/sales",
		method: "GET",
		success: function(data) {
			console.log("- DATI RAW -", data);

			//array dei venditori
			var salesmansName = [];
			var salesmansAmount = [];
			var salesmansPercentage = [];
			var salesmanIndex;
			//contatore profitto totale
			var totalProfit = 0;

			for (var i in data) {
				var vendita = data[i];

				//aggiorno profitto totale
				totalProfit += vendita.amount;

				//indice venditore attualmente iterato (-1 se non trovato)
				salesmanIndex = salesmansName.indexOf(vendita.salesman);

				//se non avevo in memoria quel venditore lo aggiungo
				if (salesmanIndex == -1) {
					salesmansName.push(vendita.salesman);
					salesmansAmount.push(vendita.amount);
				}
				// altrimenti aggiungo questa vendita a quelle già registrate 
				else {
					salesmansAmount[salesmanIndex] += vendita.amount
				}
			}

			//calcolo la percentuale -> fatturato del venditore / fatturato totale
			for (var i in salesmansAmount) {
			    var percentage = Math.round(salesmansAmount[i] / totalProfit * 100);
			    salesmansPercentage.push(percentage);
			}


			console.log('Nome venditore:',salesmansName);
			console.log('Vendite [€]:',salesmansAmount);
			console.log('Percentuale sul totale:',salesmansPercentage);


			//-----------------
			// CREO IL GRAFICO
			//-----------------

			//Init chart.js
			var ctx = document.getElementById('fatturatoPerVenditore').getContext('2d');

			var myChart = new Chart(ctx, {
			    type: 'doughnut',
			    data: {
			        labels: salesmansName,
			        datasets: [{
			            label: 'Fatturato',
			            data: salesmansPercentage,
			            backgroundColor: [
			            	'rgba(255, 147, 79, 1)',
			            	'rgba(194, 232, 18, 1)',
			            	'rgba(145, 245, 173, 1)',
			            	'rgba(191, 203, 194, 1)',
			            ],
			            borderColor: [
			                'rgba(0, 0, 0, 1)',
			                'rgba(0, 0, 0, 1)',
			                'rgba(0, 0, 0, 1)',
			                'rgba(0, 0, 0, 1)',
			            ]
			        }]
			    },
			});
		},
		error: function() {
			alert("errore");
		} 
	})
}

function getMonths() {
	moment.locale('it');
	var months = moment.months();
	return months;
}





// const myArray = [{x:100}, {x:200}, {x:300}];

// myArray.forEach((element, index, array) => {
//     console.log(element.x); // 100, 200, 300
//     console.log(index); // 0, 1, 2
//     console.log(array); // same myArray object 3 times
// });