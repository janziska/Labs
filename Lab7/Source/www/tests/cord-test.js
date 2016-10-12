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
		// Positions for a gecode
		var lat = scope.position.coords.latitude;
		var long = scope.position.coords.longitude;
		
		// Test basic jasmine to make sure it is working
		var a = null;
		expect(a).toBeNull();

		// Look for geocode
		expect(lat).not.toBeNull();
		expect(long).not.toBeNull();
	});
});