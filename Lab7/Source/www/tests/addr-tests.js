describe('HomeCtrl', function() {
	var scope;
	
	beforeEach(angular.mock.module('starter.controllers'));
	
	beforeEach(angular.mock.inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		$controller('HomeCtrl', {$scope: scope});
	}));

	it("Checks the auto address generation of lat and long", function () {
		// Positions for GPS
		var addr = data[0].formatted_address;
	
		
		// Test basic jasmine to make sure it is working
		var a = null;
		expect(a).toBeNull();

		// Look for lat long
		expect(addr).not.toBeNull();
		
	});
});