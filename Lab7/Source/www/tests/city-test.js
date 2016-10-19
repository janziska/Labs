

describe('HomeCtrl', function() {
	var scope;
	console.log("hii");
	beforeEach(angular.mock.module('starter.controllers'));
	console.log("hii1");
	beforeEach(angular.mock.inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		$controller('HomeCtrl', {$scope: scope});
	}));

	it("Checks the auto address generation of lat and long", function () {
		// Look for a well formed city
		var city = addr.substring(addr.indexOf(",")+1);
           city = city.trim();
	
		
		// Test basic jasmine to make sure it is working
		var a = null;
		expect(a).toBeNull();

		// See if the city is there
		expect(city).not.toBeNull();
		
	});
});