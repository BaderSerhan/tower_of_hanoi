function isSorted(a) {
    for (var i = 0; i < a.length - 1; i++) {
        if (a[i] > a[i + 1])
            return false;
    }
    return true;
}

//level count starts from 1
//first level has 3 disks
function getMinimumNumberOfMoves(level) {
    var numberOfDisks = level + 2;
    return Math.pow(2, numberOfDisks) - 1;
}

//Pedagogue Global Variables
var MAX_NUM_LEVELS = 5;
//number of retries after which the player gets score 0 on the # of retries 
var MAX_RETRIES = 3;