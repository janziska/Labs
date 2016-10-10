describe('HomeCtrl', function() {
	var scope;
	
	beforeEach(angular.mock.module('starter.controllers'));
	beforeEach(angular.mock.inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		$controller('HomeCtrl', {$scope: scope});
	}));

	it("Checks the auto address generation of lat and long", function () {
		// Positions for GPS
		var lat = scope.position.coords.latitude;
		var long = scope.position.coords.longitude;
		
		// Test basic jasmine to make sure it is working
		var a = null;
		expect(a).toBeNull();

		// Look for lat long
		expect(lat).not.toBeNull();
		expect(long).not.toBeNull();
	});
});