/*
// Created: July 29, 2017 12:00 AM
// Author: Jonathan Gryn
// Revisions: Jon (7/29/17) - Added JS
//            Jon (8/22/17) - Changed logic and fixed Firebase issues
*/

// Steps to complete:

// 1. Create Firebase link
// 2. Create initial train data in database
// 3. Create button for adding new trains - then update the html + update the database
// 4. Create a way to retrieve trains from the trainlist.
// 5. Create a way to calculate the time way. Using difference between start and current time.
//    Then take the difference and modulus by frequency. (This step can be complete in either 3 or 4)

// Initialize Firebase
// This is the code we copied and pasted from our app page
  var config = {
    apiKey: "AIzaSyByBFmy7A1vVwXJUwU-DJzOf9WfqAm141w",
    authDomain: "train-scheduler-78a99.firebaseapp.com",
    databaseURL: "https://train-scheduler-78a99.firebaseio.com",
    projectId: "train-scheduler-78a99",
    storageBucket: "train-scheduler-78a99.appspot.com",
    messagingSenderId: "26236221296"
  };

  firebase.initializeApp(config);

  var trainData = firebase.database();

  // 2. Populate Firebase Database with initial data (in this case, I did this via Firebase GUI (What's a GUI? ))
  // 3. Button for adding trains
  $("#add-train-btn").on("click", function() {

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrainUnix = moment($("#first-train-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
    var frequency = $("#frequency-input").val().trim();

    // Creates local "temporary" ojbect for holding train data
    var newTrain = {

      name: trainName,
      destination: destination,
      firstTrain: firstTrainUnix,
      frequency: frequency
    };

    // Uploads train data to the database
    trainData.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(firstTrainUnix);
    console.log(newTrain.frequency);

    // Alert
    alert("train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");

    // Determine when the next train arrives.
    return false;
  });

  // 4. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
  trainData.ref().on("child_added", function(childSnapshot, prevChildkey) {

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrain;

    // Calculate the minutes until arrival using hardcore math
    // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
    // and find the modulus between the difference and the frequency.
    var differenceTimes = moment().diff(moment.unix(tFirstTrain), "minutes");
    var tRemainder = moment().diff(moment.unix(tFirstTrain), "minutes") % tFrequency;
    var tMinutes = tFrequency - tRemainder;

    // To calculate the arrival time, add the tMinutes to the current time
    var tArrival = moment().add(tMinutes, "m").format("hh:mm A");

    console.log(tMinutes);
    console.log(tArrival);
    console.log(moment().format("hh:mm A"));
    console.log(tArrival);
    console.log(moment().format("X"));

    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" + tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
  });

  // Assume the following situations.

  // (TEST 1)
  // First Train of the Day is 3:00 AM
  // Assume Train comes every 3 minutes.
  // Assume the current time is 3:16 AM...
  // What time would the next train be...? ( Let's use our brains first)
  // It would be 3:18 -- 2 minutes away

  // (TEST 2)
  // First Train of the Day is 3:00 AM
  // Assume Train come every 7 miinutes.
  // Assume the current time is 3:16 AM...
  // What time would the next train be...? ( Let's use our brains first)
  // It would be 3:21 -- 5 minutes away

  // ===============================================================

  // Solved Mathematically
  // Test case 1:
  // 16 - 00 = 16
  // 16 % 3 = 1 (Modulus is the remainder)
  // 3 - 1 = 2 minutes away
  // 2 + 3:16 = 3:18

  // Solved Mathematically
  // Test case 2:
  // 16 - 00 = 16
  // 16 % 7 = 2 (Modulus is the remainder)
  // 7 - 2 = 5 minutes away
  // 5 + 3:16 = 3:21

  // Ceate a variable to reference the database
  // var database = firebase.database();
  // var currentTime = moment();

  // database.ref().on("child_added", function(childSnap) {

  //   var name = childSnap.val().name;
  //   var destination = childSnap.val().firstTrain;
  //   var frequency = childSnap.val().frequency;
  //   var min = childSnap.val().min;
  //   var next = childSnap.val().next;

  //   $("#trainTable > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + next + "</td><td>" + min + "</td><tr>"); 
  // });

  // // -------------------------------------------------------------

  // // At the initial load and subsequent value changes, get a snapshot of the local data.
  // // This function allows you to update your page in real-time when the firebase database changes.nam
  // database.ref().on("value", function(snapshot) {

  // });

  // // Grabs information from the form
  // $("#addTrainBtn").on("click", function() {
  //   console.log
  //   var trainName = $("#trainNameInput").val().trim();
  //   var destination = $("#destinationInput").val().trim();
  //   var firstTrain = $("#firstInput").val().trim();
  //   var frequency = $("#frequency").val().trim();

  //   // Ensures that each input has a value
  //   if (trainName == "") {
  //     alert('Enter a train name.');
  //     return false;
  //   }
  //   if (destination == "") {
  //     alert('Enter a destination.');
  //     return false;
  //   }
  //   if (firstTrain == "") {
  //     alert('Enter a first train time.');
  //     return false;
  //   }
  //   if (frequency == "") {
  //     alert('Enter a frequency');
  //     return false;
  //   }

  //   // THE MATH!
  //   // Subtracts the first train time back a year to ensure it's before current time.
  //   var firstTrainConverted = moment(firstTrain, "hh:mm").subtract("1, years");

  //   // The time difference between current time and the first train
  //   var difference = currentTime.diff(moment(firstTrainConverted), "minutes");
  //   var remainder = difference % frequency;
  //   var minUntilTrain = frequency - remainder;
  //   var nextTrain = moment().add(minUntilTrain, "minutes").format("hh:mm a");

  //   var newTrain = {
  //     name: trainName,
  //     destination: destination,
  //     firstTrain: firstTrain,
  //     frequency: frequency,
  //     min: minUntilTrain,
  //     next: nextTrain
  //   }

  //   console.log(newTrain);
  //   database.ref().push(newTrain);

  //   // 
  //   $("#trainNameInput").val("");
  //   $("#destinationInput").val("");
  //   $("#firstInput").val("");
  //   $("#frequencyInput").val("");

  //   return false;
  // });