/*
// Created: July 29, 2017 12:00 AM
// Author: Jonathan Gryn
// Revisions: Jon (7/29/17) - Added JS
*/

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyByBFmy7A1vVwXJUwU-DJzOf9WfqAm141w",
    authDomain: "train-scheduler-78a99.firebaseapp.com",
    databaseURL: "https://train-scheduler-78a99.firebaseio.com",
    projectId: "train-scheduler-78a99",
    storageBucket: "train-scheduler-78a99.appspot.com",
    messagingSenderId: "26236221296"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var currentTime = moment();

  database.ref().on("child_added", function(childSnap) {

    var name = childSnap.val().name;
    var destination = childSnap.val().firstTrain;
    var frequency = childSnap.val().frequency;
    var min = childSnap.val().min;
    var next = childSnap.val().next;

    $("#trainTable > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + next + "</td><td>" + min + "</td><tr>"); 
  });

  database.ref().on("value", function(snapshot) {

  });

  // Grabs information from the form
  $("#addTrainBtn").on("click", function() {
    var trainName = $("#trainNameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrain = $("#firstInput").val().trim();
    var frequency = $("#frequency").val().trim();

    // Ensures that each input has a value
    if (trainName == "") {
      alert('Enter a train name.');
      return false;
    }
    if (destination == "") {
      alert('Enter a destination.');
      return false;
    }
    if (firstTrain == "") {
      alert('Enter a first train time.');
      return false;
    }
    if (frequency == "") {
      alert('Enter a frequency');
      return false;
    }

    // THE MATH!
    // Subtracts the first train time back a year to ensure it's before current time.
    var firstTrainConverted = moment(firstTrain, "hh:mm").subtract("1, years");

    // The time difference between current time and the first train
    var difference = currentTime.diff(moment(firstTrainConverted), "minutes");
    var remainder = difference % frequency;
    var minUntilTrain = frequency - remainder;
    var nextTrain = moment().add(minUntilTrain, "minutes").format("hh:mm a");

    var newTrain = {
      name: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency,
      min: minUntilTrain,
      next: nextTrain
    }

    console.log(newTrain);
    database.ref().push(newTrain);

    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstInput").val("");
    $("#frequencyInput").val("");

    return false;
  });