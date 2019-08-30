$(document).ready(init);

function init() {
	initSelectButton();
	printGraphs();

	//aggiungi vendita
	$("#newsale-button").click(addSale);
}

function initSelectButton() {
	//prelevo i nomi dei venditori
	$.ajax({
		url: "http://157.230.17.132:4004/sales",
		method: "GET",
		success: function(data) {
			var salesman = [];
			//aggiungo i venditori al mio array (se non già presenti)
			for(var i in data) {
				var vendita = data[i];
				if (salesman.includes(vendita.salesman) == false) {
					salesman.push(vendita.salesman);
				}
			}

			// li aggiungo alle opzioni del selettore
			var target = $("#newsale-salesman");
			for(var i in salesman) {
				var html = '<option value="' + salesman[i] + '">' + salesman[i] + '</option>';
				target.append(html);
			}
		},
		error: function() {
			alert("errore");
		} 
	});
}

function printGraphs() {
	//prendo dati dal server
	$.ajax({
		url: "http://157.230.17.132:4004/sales",
		method: "GET",
		success: function(data) {
			//Stampo i grafici
			printLineGraph(data);
			printPieGraph(data);
			console.log(data);
			console.log("Grafici aggiornati");
		},
		error: function() {
			alert("errore");
		} 
	})
}

function printLineGraph(data) {
	// # # GRAFICO COL FATTURATO TOTALE PER MESE

	// array di 12 posizioni in cui sommo via via gli amount delle vendite
	var monthProfit = new Array(12).fill(0);

	for (var i in data) {
		var vendita = data[i];

		//mese di quella vendita:
		var month = moment(vendita.date, "DD/MM/YYYY").month();

		//la aggiunfo al contatore del fatturato di quel mese
		monthProfit[month] += Number(vendita.amount);
	}

	// - - - - - - - - 
	// Creo il grafico
	// - - - - - - - - 

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
}

function printPieGraph(data) {
	// # # GRAFICO COL FATTURATO PER VENDITORE RAPPORTATO AL FATTURATO TOTALE

	//arrays dei venditori
	var salesmansName = [];
	var salesmansAmount = [];
	var salesmansPercentage = [];
	var salesmanIndex;
	//contatore profitto totale
	var totalProfit = 0;

	for (var i in data) {
		var vendita = data[i];

		//aggiorno profitto totale
		totalProfit += Number(vendita.amount);

		//indice venditore attualmente iterato (-1 se non trovato)
		salesmanIndex = salesmansName.indexOf(vendita.salesman);

		//se non avevo in memoria quel venditore lo aggiungo
		if (salesmanIndex == -1) {
			salesmansName.push(vendita.salesman);
			salesmansAmount.push(Number(vendita.amount));
		}
		// altrimenti aggiungo questa vendita a quelle già registrate 
		else {
			salesmansAmount[salesmanIndex] += Number(vendita.amount);
		}
	}

	//calcolo la percentuale -> fatturato del venditore / fatturato totale
	for (var i in salesmansAmount) {
	    var percentage = Math.round(salesmansAmount[i] / totalProfit * 100);
	    salesmansPercentage.push(percentage);
	}

	// - - - - - - - - 
	// Creo il grafico
	// - - - - - - - - 

	//Init chart.js
	var ctx = document.getElementById('fatturatoPerVenditore').getContext('2d');

	var myChart = new Chart(ctx, {
	    type: 'pie',
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
}

function addSale() {
	//recupero dati vendita
	var salesman = $("#newsale-salesman").val();
	var amount = $("#newsale-amount").val();
	var month = $("#newsale-month").val();

	// aggiungo dati sul server
	$.ajax({
		url: "http://157.230.17.132:4004/sales",
		method: "POST",
		data: {
			salesman: salesman,
			amount: amount,
			date: '01/' + month + '/17'
		},
		success: function(data) {
			//ricarico grafici aggiornati
			printGraphs();
		},
		error: function() {
			alert("errore");
		} 
	});
}


function getMonths() {
	moment.locale('it');
	var months = moment.months();
	return months;
}

// # # # CHIAMATA RAPIDA PER CANCELLARE ULTIMA AGGIUNTA
// $.ajax({
// 	url: "http://157.230.17.132:4004/sales/39",
// 	method: "DELETE",
// 	success: function(data) {
// 		console.log("fatto");
// 	},
// 	error: function() {
// 		console.log("errore");
// 	} 
// });