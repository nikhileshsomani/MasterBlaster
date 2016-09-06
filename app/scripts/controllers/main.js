'use strict';

/**
 * @ngdoc function
 * @name sachinRtApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sachinRtApp
 */
angular.module('sachinRtApp')
	.controller('MainCtrl', function($scope, $rootScope, $timeout) {

		var stats = $rootScope.stats;

		var countries = [],
			years = [],
			venues = [];

		$scope.runsPerYear = {};
		$scope.totalRuns = null;
		$scope.totalMatches = stats.length;
		$scope.totalWickets = null;
		$scope.totalCatches = null;
		$scope.totalHundreds = null;
		$scope.totalFifties = null;
		$scope.runsType = 'Yearly';
		$scope.year = {
			min: 1995,
			max: 2005
		};

		$scope.sachinQuotes = ['There are two kind of batsmen in the world. One Sachin Tendulkar. Two all the others. - Andy Flower',
			'I have seen God, he bats at no. 4 for India. - Mathew Hayden',
			'He can play that leg glance with a walking stick also. - Waqar Younis',
			'Gentelmen,he is the best batsman I have seen in my life.And unlike most of you, I have seen Bradman bat. - John Woodcock'
		];


		var countriesObject = [],
			venueObject = [],
			runsPerYear = [],
			cumulativeRunsPerYear = [],
			scoreByTwoHundreds = [],
			scoresPerVenue = [],
			hScorePerVenue = [],
			hundredsPerVenue = [],
			wicketsPerYear = [],
			scoreByHundreds = [],
			scoreByFifties = [],
			scoreByRest = [];

		var setRunsPerYear = function(el) {
			var yearIdx = years.indexOf(el.date.slice(-4));
			if (yearIdx < 0) {
				years.push(el.date.slice(-4));
				runsPerYear.push({
					'label': el.date.slice(-4),
					'value': null,
					'displayValue': '0'
				});
				if (years.length === 1) {
					cumulativeRunsPerYear.push({
						'label': el.date.slice(-4),
						'value': 0,
						'displayValue': '0'
					});
				} else {
					cumulativeRunsPerYear.push({
						'label': el.date.slice(-4),
						'value': cumulativeRunsPerYear[years.length - 2].value,
						'displayValue': (parseInt(cumulativeRunsPerYear[years.length - 2].displayValue)).toString()
					});
				}
				yearIdx = years.length - 1;
			}
			if (!isNaN(el.batting_score)) {
				runsPerYear[yearIdx].value += el.batting_score;
				cumulativeRunsPerYear[yearIdx].value += el.batting_score;
				runsPerYear[yearIdx].displayValue = (parseInt(runsPerYear[yearIdx].displayValue) + 1).toString() + ' Innings';
				cumulativeRunsPerYear[yearIdx].displayValue = (parseInt(cumulativeRunsPerYear[yearIdx].displayValue) + 1).toString() + ' Innings';
			}
		};

		var setRunsPerCountry = function(el) {
			var countryIdx = countries.indexOf(el.opposition);
			if (countryIdx < 0) {
				countries.push(el.opposition);
				countriesObject.push({
					'label': el.opposition,
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

		var setWickets = function(el) {
			if (!isNaN(el.wickets)) {
				wicketsPerYear.push({
					'label': el.date.slice(-4),
					'value': el.wickets,
					'toolText': el.wickets + '/' + el.runs_conceded + '{br}' + 'v ' + el.opposition + '{br}' + el.ground + '{br}' + el.date
				});
			}
		};

		var setRunsByVenue = function(el) {
			var year = el.date.slice(-4);
			if (year >= $scope.year.min && year <= $scope.year.max) {
				var venueIdx = venues.indexOf(el.ground);
				if (venueIdx < 0) {
					venues.push(el.ground);
					venueObject.push({
						'label': el.ground
					});
					scoresPerVenue.push({
						'value': 0
					});
					hScorePerVenue.push({
						'value': 0
					});
					hundredsPerVenue.push({
						'value': 0
					});
					venueIdx = venues.length - 1;
				}
				if (!isNaN(el.batting_score)) {
					var score = el.batting_score;
					scoresPerVenue[venueIdx].value += score;
					if (score >= 100) {
						hundredsPerVenue[venueIdx].value += 1;
					}
					if (hScorePerVenue[venueIdx].value < score) {
						hScorePerVenue[venueIdx].value = score;
					}
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
			if (!isNaN(el.catches)) {
				$scope.totalCatches += el.catches;
			}
			setRunsPerYear(el);
			setRunsPerCountry(el);
			setWickets(el);
			setRunsByVenue(el);
			$timeout(function() {
				$scope.runsByVenue.categories = [{
					'category': venueObject,
				}];
				$scope.runsByVenue.dataset = [{
					'seriesname': 'Runs',
					'data': scoresPerVenue
				}, {
					'seriesname': 'Highest Score',
					'data': hScorePerVenue
				}];
			}, 0);
		});

		$scope.changeScoreBasis = function(type) {
			if (type === 'overall') {
				$scope.runsPerYear.chart.subcaption = 'Overall';
				$scope.runsPerYear.data = cumulativeRunsPerYear;
			} else {
				$scope.runsPerYear.chart.subcaption = 'Yearly';
				$scope.runsPerYear.data = runsPerYear;
			}
		};

		$scope.rangeChange = function() {
			venues = [];
			venueObject = [];
			scoresPerVenue = [];
			hScorePerVenue = [];
			stats.forEach(function(el) {
				setRunsByVenue(el);
			});
			$timeout(function() {
				$scope.runsByVenue.categories = [{
					'category': venueObject,
				}];
				$scope.runsByVenue.dataset = [{
					'seriesname': 'Runs',
					'data': scoresPerVenue
				}, {
					'seriesname': 'Highest Score',
					'data': hScorePerVenue
				}];
			}, 0);
		};

		$scope.countryWiseScore = {
			'chart': {
				'caption': 'Sachin\'s Score against different countries',
				'xaxisname': 'Countries',
				'yaxisname': 'Runs',
				'paletteColors': '#E53935,#D81B60,#5C6BC0,#D4E157',
				'plotToolText': 'Country: $label <br> Total Runs: $unformattedSum',
				'toolTipBgColor': '#000',
				'toolTipColor': '#fff',
				'toolTipBorderAlpha': '10',
				'showToolTipShadow': '1',
				'adjustDiv': 0,
				'yAxisMinValue': 0,
				'yAxisMaxValue': 3200,
				'formatNumberScale': 0,
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
			'chart': {
				'caption': 'SACHIN TENDULKAR\'S ODI CAREER(Batting)',
				'subcaption': 'Yearly',
				'xAxisName': 'Years',
				'yAxisName': 'Runs',
				'lineThickness': '2',
				'formatNumber': false,
				'formatNumberScale': 0,
				'paletteColors': '#0075c2',
				'baseFontColor': '#333333',
				'baseFont': 'Helvetica Neue,Arial',
				'plotToolText': 'Year: $label <br> Runs: $value <br> Played : $displayValue',
				'toolTipBgColor': '#000',
				'toolTipColor': '#fff',
				'toolTipBorderAlpha': '10',
				'showToolTipShadow': '1',
				'captionFontSize': '14',
				'subcaptionFontSize': '14',
				'subcaptionFontBold': '0',
				'showBorder': '0',
				'bgColor': '#ffffff',
				'showShadow': '0',
				'canvasBgColor': '#ffffff',
				'canvasBorderAlpha': '0',
				'divlineAlpha': '100',
				'divlineColor': '#999999',
				'divlineThickness': '1',
				'divLineDashed': '1',
				'divLineDashLen': '1',
				'showXAxisLine': '1',
				'xAxisLineThickness': '1',
				'xAxisLineColor': '#999999',
				'showAlternateHGridColor': '0'
			},
			'data': runsPerYear,
		};

		$scope.wickets = {
			'chart': {
				'caption': 'SACHIN TENDULKAR\'S ODI CAREER(Bowling)',
				'xAxisName': 'Matches',
				'yAxisName': 'Wickets',
				'paletteColors': '#0075c2',
				'adjustDiv': 0,
				'yAxisMinValue': 0,
				'yAxisMaxValue': 5,
				'formatNumberScale': 0,
				'toolTipBgColor': '#000',
				'toolTipColor': '#fff',
				'toolTipBorderAlpha': '10',
				'showToolTipShadow': '1',
				'bgColor': '#ffffff',
				'borderAlpha': '20',
				'canvasBorderAlpha': '0',
				'usePlotGradientColor': '0',
				'plotBorderAlpha': '10',
				'rotatevalues': '1',
				'showValues': '0',
				'showXAxisLine': '1',
				'xAxisLineColor': '#999999',
				'divlineColor': '#999999',
				'divLineDashed': '1',
				'showAlternateHGridColor': '0',
				'subcaptionFontBold': '0',
				'subcaptionFontSize': '14'
			},
			'data': wicketsPerYear
		};

		$scope.runsByVenue = {
			'chart': {
				'caption': 'Batting statistics by venue',
				'xAxisName': 'Venue',
				'yAxisName': 'Runs',
				'adjustDiv': 0,
				'showLimits': 0,
				'formatNumberScale': 0,
				'showBorder': '0',
				'showShadow': '0',
				'bgColor': '#ffffff',
				'paletteColors': '#f96331,#48CB92',
				'scrollPadding': 10,
				'showCanvasBorder': '0',
				'showAlternateHGridColor': '0',
				'lineThickness': '3',
				'flatScrollBars': '1',
				'scrollheight': '10',
				'numVisiblePlot': '12',
				'showHoverEffect': '1',
				// 'loadMessage': 'loading...'
			}
		};

		// $scope.rangeChange();

	});
