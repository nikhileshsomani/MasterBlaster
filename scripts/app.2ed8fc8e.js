/**
 * @ngdoc overview
 * @name sachinRtApp
 * @description
 * # sachinRtApp
 *
 * Main module of the application.
 */
angular
	.module('sachinRtApp', [
		'ngAnimate',
		'ui.router',
		'ng-fusioncharts',
		'ui-rangeSlider'
	])
	.run(function($rootScope, $state, csvProcessor) {
		// although this application has only one state, but making sure that we have our csv file loaded before going to any state.
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
			if (!$rootScope.stats) {
				$rootScope.loadingCSV = true;
				event.preventDefault();
				csvProcessor.processCSV().then(function(response) {
					$rootScope.stats = response;
					$rootScope.loadingCSV = false;
					$state.go(toState.name, toParams);
				}).catch(function() {
					alert('error! loading csv');
				});
			}
		});
	})
	.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			});
	});
