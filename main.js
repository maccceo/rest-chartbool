$(document).ready(init);

function init() {
	// getMonthProfit();
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
			            backgroundColor: [
			            	'lightskyblue',
			            	'lightskyblue',
			            	'lightskyblue',
			            	'lightskyblue',
			            	'lightskyblue',
			            	'lightskyblue',
			            	'lightskyblue',
			            	'lightskyblue',
			            	'lightskyblue',
			            	'lightskyblue',
			            	'lightskyblue',
			            	'lightskyblue',
			            ],
			            borderColor: [
			                'rgba(0, 0, 0, 1)',
			                'rgba(0, 0, 0, 1)',
			                'rgba(0, 0, 0, 1)',
			                'rgba(0, 0, 0, 1)',
			                'rgba(0, 0, 0, 1)',
			                'rgba(0, 0, 0, 1)',
			                'rgba(0, 0, 0, 1)',
			                'rgba(0, 0, 0, 1)',
			                'rgba(0, 0, 0, 1)',
			                'rgba(0, 0, 0, 1)',
			                'rgba(0, 0, 0, 1)',
			                'rgba(0, 0, 0, 1)',
			            ],
			            borderWidth: 1
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

			//array con oggetti venditori (name + amount)
			var salesmans = [];
			//contatore profitto totale
			var totalProfit = 0;

			for (var i in data) {
				var vendita = data[i];

				//aggiorno profitto totale
				totalProfit += vendita.amount;

				//cerco il nome nel mio array locale
				var found = false, index;
				for (var i in salesmans) {
					if (salesmans[i].name == vendita.salesman) {
						found = true;
						index = i;
					}
				}
				// se non c'è già in elenco lo aggiungo
				if (found == false) {
					var newElement = {
						name: vendita.salesman,
						amount: vendita.amount
					}
					salesmans.push(newElement);
					console.log(vendita.salesman,"aggiunto");
				} else {
					//aggiungo questa vendita
					salesmans[index].amount += vendita.amount;
				}
				found = false;
			}
			
			//aggiungo la voce fatturato_del venditore / fatturato_totale
			for (var i in salesmans) {
				var percentage = Math.round(salesmans[i].amount / totalProfit * 100);
				salesmans[i].percentage = percentage;
			}

			console.log(salesmans);

			//-----------------
			// CREO IL GRAFICO
			//-----------------

			//Init chart.js
			var ctx = document.getElementById('fatturatoPerVenditore').getContext('2d');

			var names = [...salesmans.name];
			var profits = [...salesmans.percentage];

			var myChart = new Chart(ctx, {
			    type: 'doughnut',
			    data: {
			        labels: names,
			        datasets: [{
			            label: 'Fatturato',
			            data: profits,
			            backgroundColor: [
			            	'lightskyblue',
			            	'green',
			            	'red',
			            	'yellow',
			            ],
			            borderColor: [
			                'rgba(0, 0, 0, 1)',
			                'rgba(0, 0, 0, 1)',
			                'rgba(0, 0, 0, 1)',
			                'rgba(0, 0, 0, 1)',

			            ],
			            borderWidth: 1
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