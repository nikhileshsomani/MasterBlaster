
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
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
			if (!$rootScope.stats) {
				$rootScope.loadingCSV = true;
				event.preventDefault();
				csvProcessor.processCSV().then(function(response) {
					$rootScope.stats = response;
					$rootScope.loadingCSV = false;
					$state.go(toState.name, toParams);
				}).catch(function() {

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
