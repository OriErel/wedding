angular.module('webApp').controller('AdminCtrl', function ($scope, $http, localStorageService) {
    $http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';

    var key = 'wedding-admin-token';
    var token = localStorageService.get(key);
    if (token) {
        $http.defaults.headers.common['X-TOKEN'] = token;
        $http.get('/token-validate').then(function () {
            $scope.validated = true;
            $scope.getGuests();
        }, function () {
            $scope.validated = false;
            localStorageService.remove(key);
        });
    }
    else {
        $scope.validated = false;
    }

    $scope.getToken = function () {
        $http.post('/password-validate', { password: $scope.password }).then(function (res) {
            $scope.validated = true;
            token = res.data;
            localStorageService.set(key, token);
            $scope.getGuests();
        }, function () {
            $scope.validated = false;
        });
    };

    $scope.submitKeyDown = function (event) {
        if (event.code === 'Enter') {
            $scope.getToken();
        }
    };

    $scope.getGuests = function () {
        $http.defaults.headers.common['X-TOKEN'] = token;
        $http.get('/guests').then(function (res) {
            $scope.guests = res.data;
        }).catch(function () {
            $scope.validated = false;
        });
    }
});
