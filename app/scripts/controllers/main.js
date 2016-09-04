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

		$scope.totalRuns = null;
		$scope.totalMatches = stats.length;
		$scope.totalWickets = null;
		$scope.totalCatches = null;
		$scope.totalHundreds = null;
		$scope.totalFifties = null;

		$scope.sachinQuotes = ['There are two kind of batsmen in the world. One Sachin Tendulkar. Two all the others. - Andy Flower',
			'I have seen God, he bats at no. 4 for India - Mathew Hayden',
			'He can play that leg glance with a walking stick also. - Waqar Younis'
		];

		var countriesObject = [],
			runsPerYear = [],
			runsPerInnings = [{
				'label': 'Runs while chasing',
				'value': 0,
				'displayValue': "0"
			}, {
				'label': 'Runs while batting first',
				'value': 0,
				'displayValue': "0"
			}],
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
					'label': el.opposition,
					// 'displayValue': '0'
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
			if (!isNaN(el.batting_score)) {
				// countriesObject[countryIdx].displayValue = (parseInt(countriesObject[countryIdx].displayValue) + 1).toString() + " Matches";
				if (el.batting_score < 50) {
					scoreByRest[countryIdx].value += el.batting_score;
				} else if (el.batting_score >= 50 && el.batting_score < 100) {
					$scope.totalFifties++;
					scoreByFifties[countryIdx].value += el.batting_score;
				} else if (el.batting_score >= 100 && el.batting_score < 200) {
					$scope.totalHundreds++;
					scoreByHundreds[countryIdx].value += el.batting_score;
				} else {
					$scope.totalHundreds++;
					scoreByTwoHundreds[countryIdx].value += el.batting_score;
				}
			}
		};

		var setRunsPerInning = function(el) {
			if (!isNaN(el.batting_score)) {
				if (el.batting_innings === "2nd") {
					runsPerInnings[0].value += el.batting_score;
					runsPerInnings[0].displayValue = (parseInt(runsPerInnings[0].displayValue) + 1).toString() + " Matches while chasing";
				} else {
					runsPerInnings[1].value += el.batting_score;
					runsPerInnings[1].displayValue = (parseInt(runsPerInnings[1].displayValue) + 1).toString() + " Matches while batting first";
				}
			}
		};

		stats.forEach(function(el) {
			if (!isNaN(el.batting_score)) {
				$scope.totalRuns += el.batting_score;
			}
			if (!isNaN(el.wickets)) {
				$scope.totalWickets += el.wickets;
			}
			setRunsPerYear(el);
			setRunsPerCountry(el);
			setRunsPerInning(el);
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
				"subcaption": "(Batting)",
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

		$scope.scorePerInnings = {
			"chart": {
				"caption": "Runs scored per innings",
				"paletteColors": "#0075c2,#1aaf5d,#f2c500,#f45b00,#8e0000",
				"bgColor": "#ffffff",
				"showBorder": "0",
				"use3DLighting": "0",
				"showShadow": "0",
				"enableSmartLabels": "0",
				"startingAngle": "0",
				"showPercentValues": "1",
				"showPercentInTooltip": "0",
				"decimals": "1",
				"captionFontSize": "14",
				"subcaptionFontSize": "14",
				"subcaptionFontBold": "0",
				"toolTipColor": "#ffffff",
				"toolTipBorderThickness": "0",
				"toolTipBgColor": "#000000",
				"toolTipBgAlpha": "80",
				"toolTipBorderRadius": "2",
				"toolTipPadding": "5",
				"showHoverEffect": "1",
				"showLegend": "1",
				"legendBgColor": "#ffffff",
				"legendBorderAlpha": "0",
				"legendShadow": "0",
				"legendItemFontSize": "10",
				"legendItemFontColor": "#666666",
				"useDataPlotColorForLabels": "1"
			},
			"data": runsPerInnings
		};

	});
