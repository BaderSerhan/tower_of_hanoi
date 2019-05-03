//CONTRIBUTION - LET'SeGA LEBANON
(function () {
    'use strict';
    angular.module('demo.home', []).controller('HomeCtrl', ['$scope', function ($scope) {
        $scope.level = 0;
        $scope.message = "Hello world";
        $scope.gameStatus = "START";

        //Pedagogue defines maximum number of levels that can be played in this specific game before submitting the entire game's score to the backend
        $scope.maxLevel = MAX_NUM_LEVELS;
        //number of retries per level
        $scope.retries = 0;
        //number of moves per level
        $scope.moves_count = 0;
        //calculated level score in percentage
        $scope.score = 0;

        $scope.templatePeg = [];
        $scope.peg = {
            A: [],
            B: [],
            C: []
        };
        $scope.source = '';
        $scope.destination = '';
        //Method declaration
        $scope.createTemplatePeg = function () {
            for (var i = 0; i < $scope.maxLevel + 4; i++) {
                $scope.templatePeg[i] = -1;
            }
        }
        $scope.changeLevel = function (restart) {
            //BADER//
            //if restarting, stay on the same level
            if (!restart)
                $scope.level = $scope.level + 1;

            //reset disks
            var diskNum = $scope.level + 2;
            $scope.peg.A = angular.copy($scope.templatePeg);
            $scope.peg.B = angular.copy($scope.templatePeg);
            $scope.peg.C = angular.copy($scope.templatePeg);
            for (var i = 0; i < $scope.level + 2; i++) {
                $scope.peg.A[$scope.templatePeg.length - i - 1] = angular.copy(diskNum);
                diskNum--;
            }
            $scope.gameStatus = 'GO';
        }

        function checkEmpty(disk) {
            return disk == -1;
        }

        $scope.checkResult = function () {
            console.log("# of moves: " + $scope.moves_count);
            console.log("# of retries: " + $scope.retries);
            //Check for game over
            if (!isSorted($scope.peg.A)) {
                // $scope.retries++;
                $scope.gameStatus = 'GAME OVER';
            } else if (!isSorted($scope.peg.B)) {
                // $scope.retries++;
                $scope.gameStatus = 'GAME OVER';
            } else if (!isSorted($scope.peg.C)) {
                // $scope.retries++;
                $scope.gameStatus = 'GAME OVER';
            }
            //Check for win
            if ($scope.gameStatus == 'GO') {
                if ($scope.peg.A.every(checkEmpty) && $scope.peg.B.every(checkEmpty) && isSorted($scope.peg.C)) {
                    $scope.gameStatus = "WIN";
                    //FATIMA// hold the move_count number after finishing the level
                    //BADER// calculation for the score
                    $scope.calculateScore();
                }
            }
        }

        //BADER//
        //According to the rules, minimum number of moves required to solve a Tower of Hanoi puzzle is  2^n − 1, where n is the number of disks
        $scope.calculateScore = function () {
            //50% of the score is based on number of moves
            var winningNumberOfMoves = getMinimumNumberOfMoves($scope.level);
            var extraMoves = $scope.moves_count - winningNumberOfMoves;
            var movesPercentage = 50 - (extraMoves * 50 / winningNumberOfMoves);

            //50% of the score is based on retries
            //based on pedagogue ruling
            var weight = 50;
            switch ($scope.retries) {
                case 0:
                    //no  retries => got full 50%
                    $scope.weight = 50;
                    break;
                case 1:
                    //1 retry => got 30%
                    weight = 30;
                    break;
                case 2:
                    //2 retries => got 10%
                    weight = 10;
                    break;
                    //if the user retried 3 or more times he will automatically lose 50% of the score
                default:
                    weight = 0;
                    break;
            }
            $scope.score = movesPercentage + weight;
            //HAITHAM//YOU MUST SEND THE SCORE PER LEVEL TO AN API HERE
        }

        $scope.restartGame = function () {
            $scope.moves_count = 0;
            $scope.retries++;
            $scope.changeLevel(true);
        }

        $scope.playNextLevel = function () {
            //FATIMA//
            $scope.retries = 0;
            $scope.moves_count = 0;
            $scope.changeLevel();
        }

        $scope.moveDisk = function () {
            console.log('From Peg:' + $scope.source + " to Peg:" + $scope.destination);
            //FATIMA//
            $scope.moves_count++;
            console.log("Level: " + $scope.level + "\n" + "Moves: " + $scope.moves_count);
            //Modify source peg
            var diskToMove = -1;
            for (var i = $scope.peg[$scope.source].length; i > 1; i--) {
                if ($scope.peg[$scope.source][i - 1] == -1 && $scope.peg[$scope.source][i]) {
                    diskToMove = $scope.peg[$scope.source][i];
                    $scope.peg[$scope.source][i] = -1;
                    break;
                }
            }
            for (var i = $scope.peg[$scope.destination].length - 1; i > 1; i--) {
                if ($scope.peg[$scope.destination][i] == -1 && diskToMove) {
                    $scope.peg[$scope.destination][i] = diskToMove;
                    break;
                }
            }
            //Modify destination peg
            $scope.source = $scope.destination = '';
            $scope.checkResult();
        }

        $scope.clickPeg = function (peg) {
            if ($scope.source != '' && $scope.source == peg) {
                $scope.source = '';
            } else if ($scope.source == '') {
                $scope.source = peg;
            }
            if ($scope.source != '' && $scope.source != peg) {
                $scope.destination = peg;
            }
            if ($scope.source != '' && $scope.destination != '')
                $scope.moveDisk();
        }

        $scope.startGame = function () {
            $scope.changeLevel();
        }

        $scope.showCredit = function () {
            $scope.gameStatus = 'CREDIT';
        }

        $scope.showHelp = function () {
            $scope.gameStatus = 'HELP';
        }

        $scope.gotoHome = function () {
            $scope.gameStatus = 'START';
        }
        //Method declaration
        $scope.createTemplatePeg();
    }]);
}());