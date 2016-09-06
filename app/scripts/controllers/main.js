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

		$rootScope.loadingCSV = true;
		$scope.runsScored = {};
		$scope.totalRuns = null;
		$scope.totalMatches = stats.length;
		$scope.totalWickets = null;
		$scope.totalCatches = null;
		$scope.totalHundreds = null;
		$scope.totalFifties = null;
		$scope.average = null;
		$scope.notOutCount = null;
		$scope.totalInnings = null;
		$scope.runsType = 'Yearly';
		$scope.year = {
			min: 1995,
			max: 2005
		};

		//external library fusion chart is being used for graphical analysis. The page will be load once the fusion is done generating charts.
		$timeout(function() {
			$rootScope.loadingCSV = false;
		}, 3000);

		$scope.sachinQuotes = ['There are two kind of batsmen in the world. One Sachin Tendulkar. Two all the others. - Andy Flower',
			'I have seen God, he bats at no. 4 for India. - Mathew Hayden',
			'He can play that leg glance with a walking stick also. - Waqar Younis',
			'Gentelmen,he is the best batsman I have seen in my life.And unlike most of you, I have seen Bradman bat. - John Woodcock'
		];

		var countries = [],
			years = [],
			venues = [],
			countriesObject = [],
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

		// creating data for fusionchart -- runs scored per year and cumulative scoring throught career
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
				if (el.notOut) {
					$scope.notOutCount++;
				}
				$scope.totalInnings++;
				runsPerYear[yearIdx].value += el.batting_score;
				cumulativeRunsPerYear[yearIdx].value += el.batting_score;
				runsPerYear[yearIdx].displayValue = (parseInt(runsPerYear[yearIdx].displayValue) + 1).toString() + ' Innings';
				cumulativeRunsPerYear[yearIdx].displayValue = (parseInt(cumulativeRunsPerYear[yearIdx].displayValue) + 1).toString() + ' Innings';
			}
		};

		// creating data for fusionchart -- runs scored against each country
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

		// creating data for fusionchart -- wickets taken
		var setWickets = function(el) {
			if (!isNaN(el.wickets)) {
				wicketsPerYear.push({
					'label': el.date.slice(-4),
					'value': el.wickets,
					'toolText': el.wickets + '/' + el.runs_conceded + '{br}' + 'v ' + el.opposition + '{br}' + el.ground + '{br}' + el.date
				});
			}
		};

		// creating data for fusionchart -- runs scored on each venue
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

		// looping thorough the stats to set data for the chart
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
				$scope.average = ($scope.totalRuns / ($scope.totalInnings - $scope.notOutCount)).toFixed(2);
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

		//scope function to change runs showed - yealy or cumulative
		$scope.changeScoreBasis = function(type) {
			if (type === 'overall') {
				$scope.runsScored.chart.subcaption = 'Overall';
				$scope.runsScored.data = cumulativeRunsPerYear;
			} else {
				$scope.runsScored.chart.subcaption = 'Yearly';
				$scope.runsScored.data = runsPerYear;
			}
		};

		// scope function which show runs scored in each venue according to the selected year-range
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

		// fusion chart object to show runs scored against each country
		$scope.countryWiseScore = {
			'chart': {
				'caption': 'Sachin\'s Score against different countries',
				'xaxisname': 'Countries',
				'yaxisname': 'Runs',
				'paletteColors': '#3D348B,#7678ED,#F7B801,#F18701',
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

		// fusion chart object to show runs scored (yearly and cumulative)
		$scope.runsScored = {
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

		// fusion chart object to show wickets stats
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

		// fusion chart object for showing runs by venue
		$scope.runsByVenue = {
			'chart': {
				'caption': 'Batting statistics by venue',
				'xAxisName': 'Venue',
				'yAxisName': 'Runs',
				'adjustDiv': 0,
				'showLimits': 0,
				'formatNumberScale': 0,
				'showBorder': '0',
				'bgColor': '#ffffff',
				'paletteColors': '#42F2F7,#46ACC2',
				'showShadow': '0',
				'scrollPadding': 10,
				'showCanvasBorder': '0',
				'plotFillAlpha' :'100',
				'showAlternateHGridColor': '0',
				'lineThickness': '3',
				'flatScrollBars': '1',
				'scrollheight': '10',
				'numVisiblePlot': '12',
				'showHoverEffect': '1',
				'toolTipBgColor': '#000',
				'toolTipColor': '#fff',
				'toolTipBorderAlpha': '10',
				'showToolTipShadow': '1'
			}
		};
	});
