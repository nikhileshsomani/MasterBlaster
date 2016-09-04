'use strict';

/**
 * @ngdoc function
 * @name sachinRtApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sachinRtApp
 */
angular.module('sachinRtApp')
	.controller('MainCtrl', function($scope, $rootScope) {

		var stats = $rootScope.stats;

		var countries = [],
			years = [];

		$scope.sachinQuotes = ['There are two kind of batsmen in the world. One Sachin Tendulkar. Two all the others. - Andy Flower',
			'I have seen God, he bats at no. 4 for India - Mathew Hayden',
			'He can play that leg glance with a walking stick also. - Waqar Younis'
		];

		var countriesObject = [],
			runsPerYear = [],
			scoreByTwoHundreds = [],
			scoreByHundreds = [],
			scoreByFifties = [],
			scoreByRest = [];

		var setRunsPerYear = function(el) {
			var yearIdx = years.indexOf(el.date.slice(-4));
			if (yearIdx < 0) {
				years.push(el.date.slice(-4));
				runsPerYear.push({
					"label": el.date.slice(-4),
					"value": null,
					"displayValue": "0"
				});
				yearIdx = years.length - 1;
			}
			if (!isNaN(el.batting_score)) {
				runsPerYear[yearIdx].value += el.batting_score;
				runsPerYear[yearIdx].displayValue = (parseInt(runsPerYear[yearIdx].displayValue) + 1).toString() + " Matches";
			}
		};

		var setRunsPerCountry = function(el) {
			var countryIdx = countries.indexOf(el.opposition);
			if (countryIdx < 0) {
				countries.push(el.opposition);
				countriesObject.push({
					'label': el.opposition
				});
				scoreByTwoHundreds.push({
					'value': null
				});
				scoreByHundreds.push({
					'value': null
				});
				scoreByFifties.push({
					'value': null
				});
				scoreByRest.push({
					'value': null
				});
				countryIdx = countriesObject.length - 1;
			}
			if (el.batting_score) {
				if (el.batting_score < 50) {
					scoreByRest[countryIdx].value += el.batting_score;
				} else if (el.batting_score >= 50 && el.batting_score < 100) {
					scoreByFifties[countryIdx].value += el.batting_score;
				} else if (el.batting_score >= 100 && el.batting_score < 200) {
					scoreByHundreds[countryIdx].value += el.batting_score;
				} else {
					scoreByTwoHundreds[countryIdx].value += el.batting_score;
				}
			}
		};

		stats.forEach(function(el) {
			setRunsPerYear(el);
			setRunsPerCountry(el);
		});

		$scope.countryWiseScore = {
			'chart': {
				'caption': 'Sachin\'s Score against different contries',
				'xaxisname': 'Countries',
				'yaxisname': 'Runs',
				'paletteColors': '#0075c2,#45AFF5,#2C8A56,#1aaf5d,#50DE90',
				'plotToolText': 'Country: $label <br> Total Runs: $unformattedSum',
				'toolTipBgColor': '#000',
				'toolTipColor': '#fff',
				'toolTipBorderAlpha': '10',
				'showToolTipShadow': '1',
				'bgColor': '#ffffff',
				'borderAlpha': '20',
				'showCanvasBorder': '0',
				'usePlotGradientColor': '0',
				'plotBorderAlpha': '10',
				'legendBorderAlpha': '0',
				'valueFontColor': '#ffffff',
				'showXAxisLine': '1',
				'xAxisLineColor': '#999999',
				'divlineColor': '#999999',
				'divLineDashed': '1',
				'showAlternateHGridColor': '0',
				'subcaptionFontBold': '0',
				'subcaptionFontSize': '14'
			},
			'categories': [{
				'category': countriesObject
			}],
			'dataset': [{
				'dataset': [{
					'seriesname': 'Rest',
					'data': scoreByRest
				}, {
					'seriesname': 'Fifties',
					'data': scoreByFifties
				}, {
					'seriesname': 'Hundreds',
					'data': scoreByHundreds
				}, {
					'seriesname': 'Two-Hundreds',
					'data': scoreByTwoHundreds
				}]
			}]
		};

		$scope.runsPerYear = {
			"chart": {
				"caption": "SACHIN TENDULKAR'S ODI CAREER",
				"subcaption": "(Yearly)",
				"xAxisName": "Years",
				"yAxisName": "Runs",
				"lineThickness": "2",
				"paletteColors": "#0075c2",
				"baseFontColor": "#333333",
				"baseFont": "Helvetica Neue,Arial",
				'plotToolText': 'Year: $label <br> Runs: $value <br> Played : $displayValue',
				'toolTipBgColor': '#000',
				'toolTipColor': '#fff',
				'toolTipBorderAlpha': '10',
				'showToolTipShadow': '1',
				"captionFontSize": "14",
				"subcaptionFontSize": "14",
				"subcaptionFontBold": "0",
				"showBorder": "0",
				"bgColor": "#ffffff",
				"showShadow": "0",
				"canvasBgColor": "#ffffff",
				"canvasBorderAlpha": "0",
				"divlineAlpha": "100",
				"divlineColor": "#999999",
				"divlineThickness": "1",
				"divLineDashed": "1",
				"divLineDashLen": "1",
				"showXAxisLine": "1",
				"xAxisLineThickness": "1",
				"xAxisLineColor": "#999999",
				"showAlternateHGridColor": "0"
			},
			"data": runsPerYear,

		};


	});
