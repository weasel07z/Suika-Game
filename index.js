import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getDatabase, ref, set, onValue, get, child, query, orderByChild } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

const app = initializeApp({
    apiKey: "AIzaSyCKpPX16VugJCe-9fp3hd5_dmv-OVutti0",
    authDomain: "suika-game-d42de.firebaseapp.com",
    projectId: "suika-game-d42de",
    storageBucket: "suika-game-d42de.appspot.com",
    messagingSenderId: "223708951716",
    appId: "1:223708951716:web:bfb5c68568373bc2ea6231",
    measurementId: "G-QTL5K3VVRP",
    databaseURL: "https://suika-game-d42de-default-rtdb.firebaseio.com/"
});

var namesArray = ["Jack", "Jo", "Bob", "Ben", "Logu", "nerd", "Jill", "LOSER", "LOSER2", "KILLYOURSLEF"];

const db = getDatabase(app);
// Reference to the leaderboard data in Firebase
var leaderboardRef = ref(db, 'scores/');
const topScores = query(ref(db, 'scores'), orderByChild('points'));
// console.log("POINTS: " + points);
// function retrieveLeaderboard() {
//     console.log("dsfsdf");
//     topScores = query(ref(db, 'scores/'), orderByChild('points'));
//     console.log(topScores);
//     //leaderboardRef.orderByChild('points').limitToLast(10).once('scores', function(snapshot) {
//     //   var leaderboardList = document.getElementById('leaderboardList');
//     //   leaderboardList.innerHTML = '';
  
//     //   snapshot.forEach(function(childSnapshot) {
//     //     var data = childSnapshot.val();
//     //     var playerName = data.name;
//     //     var playerPoints = data.points;
  
//     //     var li = document.createElement('li');
//     //     li.innerHTML = '<span>' + playerName + '</span><span>' + playerPoints + ' points</span>';
//     //     leaderboardList.appendChild(li);
//     //   });
//     // });
// }
// retrieveLeaderboard();

document.getElementById('submitButton').addEventListener("mousedown", function (e) {
    var data;
    e.preventDefault();
    var element = document.getElementById("name")
    if(element.value !== null && element.value !== "" && element.value !== " "){
        var scoreRef = ref(db, 'scores/' + element.value + '/points')
        onValue(scoreRef, (snapshot) => {
            data = parseInt(snapshot.val());
            //console.log(parseInt(document.getElementById('totalPoints').innerHTML));
          });
        if(data > points){
            document.getElementById('lowerThanNeeded').style.visibility = "visible";
        } else {
            addScore(element.value, points)
            document.getElementById('submitForm').style.visibility = "hidden";
            document.getElementById('lowerThanNeeded').style.visibility = "hidden";
            document.getElementById("submitText").style.visibility = "hidden";
            document.getElementById("scoreSubmit").style.visibility = "visible";
        }
    }
    document.getElementById('submitForm').reset();  

});
export function printLeaderboard(){
    onValue(topScores, function(snapshot) {
        //console.log(snapshot.val());
        var leaderboardList = document.getElementById('leaderboardList');
        leaderboardList.innerHTML = '';

        snapshot.forEach(function(childSnapshot) {
            console.log(childSnapshot.val());
            var data = childSnapshot.val();
            var playerName = data.username;
            var playerPoints = data.points;
            playerName = playerName.substring(0,30);
            var li = document.createElement('li');
            li.innerHTML = '<span id="words">' + playerName + '</span><span>' + playerPoints + ' points</span>';
            leaderboardList.prepend(li);
        });
    });
}
printLeaderboard();

function addScore(_name,_points){
    var name = _name;
    var points = _points;
    if(kayalMode){
        set(ref(db, 'scores/' + name), {
            username: name + "🇮🇳",
            points: points,
        });
    } else {
        set(ref(db, 'scores/' + name), {
            username: name,
            points: points,
        });
    }
    
}


//document.getElementById('b2').onclick = function() {randomScore()};



// onValue(ref(db, 'scores'), function(snapshot){
//     console.log(snapshot.val());
// })


// function writeUserData(name, points) {
//     set(ref(db, 'scores/' + name), {
//       username: name,
//       points: Math.floor(Math.random() * (1000 - 1 + 1) + 1)+1,
//     });
// }
// const scoresRef = ref(db, 'scores/John')
// writeUserData("John", Math.floor(Math.random() * (1000 - 1 + 1) + 1));
// onValue(scoresRef, (snapshot) => {
//     const data = snapshot.val()
//     console.log(data)
// })
// function makeRandom(){
    
// }
document.getElementById('b1').onclick = function() { printLeaderboard() };