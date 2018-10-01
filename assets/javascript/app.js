  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCkqKnotITX5rOXBMoUMowVyrvYOJqqTrc",
    authDomain: "trainscheduler-59ab5.firebaseapp.com",
    databaseURL: "https://trainscheduler-59ab5.firebaseio.com",
    projectId: "trainscheduler-59ab5",
    storageBucket: "trainscheduler-59ab5.appspot.com",
    messagingSenderId: "54356198956"
  };
  firebase.initializeApp(config);

var database = firebase.database();
//========================VARIABLES=========================
var trainName = '';
var trainDestination = '';
var trainFirstDeparture = '';
var trainFrequency = 0;

//========================FUNCTIONS=========================

firebase.database().ref().on('child_added',function(childSnapshot){
    console.log(childSnapshot.val());
    
    trainName = childSnapshot.val().name;
    trainDestination = childSnapshot.val().destination;
    trainFirstDeparture = childSnapshot.val().time;
    trainFrequency = childSnapshot.val().frequency;

    console.log('Train Name: '+trainName);
    console.log('Destination: '+trainDestination);
    console.log('Train First Departure: '+trainFirstDeparture);
    console.log('Frequency: '+trainFrequency);
    
    // Update current time 
    function currentTime() {
        var current = moment().format('LTS');
        $("#currentTime").html(current);
        setTimeout(currentTime, 1000);
    };

    // Update current date
    function currentDate() {
        var current = moment().format('L');
        $("#currentDate").html(current);
        setTimeout(currentDate, 1000);
    };

    // Execute function for current date and time and update HTML element
    currentDate();
    currentTime();

    // Example: First departure time is 14:00 and interval is 30 minutes
    // Current time at the station is 14:40
    // Time difference from the first departure time: 40min
    // Time remainder(the amount of time (minutes) passed since the last train arrival) 
    // Time remainder = time difference(40min) % frequency(30min) = 10min 
    // Next train will be arriving in frequency(30min) - time remainder(10min) = 20min
    
    // Convert first departure time (push back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(trainFirstDeparture, "HH:mm").subtract(1, "years");
	console.log('First Time Converted: '+firstTimeConverted.format())

	// Difference between the first departure time and the current time
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	console.log('Time Difference: '+diffTime)

	// Time remainder (the amount of time (minutes) passed since the last train arrival)
    var timeRemainder = diffTime % trainFrequency;
    console.log('Time remainder: '+timeRemainder)

    // Minute until next train arrival
    var minutesAway = trainFrequency - timeRemainder
    console.log('Minutes Away: ' + minutesAway);
	
    // Next train arrival time
    var nextArrival = moment().add(minutesAway, "minutes");
    var nextArrivalConverted = moment(nextArrival).format("hh:mm a");
    console.log('Next Arrival (unconverted): '+nextArrival);
    console.log ('Next Arrival: '+nextArrivalConverted);

    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(nextArrivalConverted),
        $("<td>").text(minutesAway)
    );

    // Append the new row to the table
    $("#train-schedule > tbody").append(newRow);
})

//========================EVENT LISTENERS=========================

// When the submit button is clicked after filling out user's input
$('#addTrain').on("click", function(){
    trainName = $('#trainNameInput').val().trim();
    trainDestination = $('#destinationInput').val().trim();
    trainFirstDeparture = $('#firstDepartureInput').val().trim();
    trainFrequency = $('#frequencyInput').val().trim();

    // push data into Firebase
    database.ref().push({
        name: trainName,
        destination: trainDestination,
        time: trainFirstDeparture,
        frequency: trainFrequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    // Clears all of the text-boxes
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstDepartureInput").val("");
    $("#frequencyInput").val("");
})