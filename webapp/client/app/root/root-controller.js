angular.module('webApp').controller('RootCtrl', function ($scope, $timeout, $http, $stateParams) {

    var token = $stateParams.token;
    if (!token) {
        return;
    }

    $scope.loading = true;
    $http.get([ '/guest?token=', token ].join('')).then(function (res) {
        $scope.guest = res.data;
        $scope.guest.num_of_attendees = $scope.guest.num_of_attendees || 1;
        $scope.savedState = $scope.guest.arriving !== null;
        $scope.loading = false;

        if ($scope.guest.comment = 'null') {
            $scope.guest.comment = '';
        }
    });

    $scope.doneOpacity = true;

    var MAX_GUESTS = 9;
    $scope.increaseGuests = function () {
        if ($scope.guest.num_of_attendees === MAX_GUESTS) {
            return;
        }

        $scope.guest.num_of_attendees++;
    };

    $scope.decreaseGuests = function () {
        if ($scope.guest.num_of_attendees === 1) {
            return;
        }

        $scope.guest.num_of_attendees--;
    };

    $scope.submit = function (arriving) {
        $scope.guest.arriving = arriving;

        $http.post([ '/guest?token=', token ].join(''), $scope.guest);

        $scope.savedState = true;
        $scope.doneOpacity = false;
        $timeout(function () {
            $scope.doneOpacity = true;
        }, 500);
    };

    $scope.changeRsvp = function () {
        $scope.savedState = false;
        $scope.guest.arriving = null;
        $scope.doneOpacity = false;
        $timeout(function () {
            $scope.doneOpacity = true;
        }, 500);
    }
});
