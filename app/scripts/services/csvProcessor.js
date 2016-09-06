'use strict';

/**
 * @ngdoc service
 * @name sachinRtApp.apiServices
 * @description
 * # apiServices
 * Service in the sachinRtApp.
 */
angular.module('sachinRtApp')
	.service('csvProcessor', function($http, $q) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		this.readCSV = function() {
			return $http({
				url: '../sachin.csv',
				method: 'GET'
			});
		};

		this.processCSV = function() {
			var deferred = $q.defer();
			this.readCSV().then(function(response) {
				var rows = response.data.split((/\r\n|\n/)),
					headers = rows[0].split(','),
					integerStats = ['wickets', 'runs_conceded', 'catches', 'stumps'],
					stats = [];
				for (var i = 1; i < rows.length - 1; i++) {
					var stat = rows[i].split(',');
					var statObj = {};
					for (var j = 0; j < headers.length; j++) {
						if (headers[j] === 'batting_score') {
							if (stat[j].slice(-1) === '*') {
								statObj.notOut = true;
							}
							statObj[headers[j]] = parseInt(stat[j]);
						} else if (integerStats.indexOf(headers[j]) > -1) {
							statObj[headers[j]] = parseInt(stat[j]);
						} else if (headers[j] === 'opposition') {
							statObj[headers[j]] = stat[j].slice(2, stat[j].length);
						} else {
							statObj[headers[j]] = stat[j];
						}
					}
					stats.push(statObj);
				}
				deferred.resolve(stats);
			}).catch(function(error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};
	});
