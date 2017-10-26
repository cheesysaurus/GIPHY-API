// Residual questions/issues
// 1) How to pause all GIFs when you click a reset button

// giphy object to store all variables and functions
var giphy = {

    // VARIABLES
    // ====================================================================================
    // themes & topics for each theme
    themes: ["Food", "Fall", "Lazy", "Paradise", "User"],
    topics: [
        ["cookies", "pasta", "pizza", "ice cream", "donuts", "pumpkin pie"],
        ["autumn", "cozy", "hot cocoa", "halloween", "thanksgiving"],
        ["pajamas", "lazy", "sleepy"],
        ["hawaii", "sunset", "surf"],
        []
    ],

    // FUNCTIONS
    // ====================================================================================
    // dynamically create a div for each theme
    makeDivs: function() {
        for (var i = 0; i < giphy.themes.length; i++) {
            var div = $("<div>");
            div.attr("id", giphy.themes[i]); // add an id to each div that is the name of its specific theme so that we can use this id to append the appropriate buttons to the appropriate div on line 44
            $("#buttons").append(giphy.themes[i] + ": ");
            $("#buttons").append(div);
        }
    },

    // dynamically create a button for each topic and append it to its appropriate theme
    makeButtons: function() {

        // clear out all the buttons first & make divs
        $("#buttons").empty();
        giphy.makeDivs();

        for (var i = 0; i < giphy.topics.length; i++) {
            for (var j = 0; j < giphy.topics[i].length; j++) {
                var button = $("<button>");
                button.addClass("topic"); // add same class to each of the buttons so that we can use this class to display the appropriate GIFs
                button.attr("data-topic", giphy.topics[i][j]); // for good measure
                button.text(giphy.topics[i][j]);
                $("#" + giphy.themes[i]).append(button);
            }

        }

    },

    // use selected topic to display appropriate GIFS to HTML
    displayGIFs: function() {
        
        // empty the div that contains all the GIFs
        $("#gifs").empty();
        
        // capture the specific topic that we're going to query
        var topic = $(this).attr("data-topic");
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=c0za4GZUEsfOnGCSpbJedEHtSy7K2KEV&limit=10&offset=0&lang=en";

        // console insight
        console.log(topic);

        // HTTP GET request to GIPHY API
        $.get(queryURL).done(function(response) {

            // console insight
            // console.log(response);

            // for each GIF object
            for (var i = 0; i < response.data.length; i++) {

                // make a container div to hold image & rating
                var container = $("<div>");
                
                // capture GIF URL
                var gif = $("<img>");
                gif.addClass("gif"); // add same class to each of the buttons so that we can use this class to display the appropriate GIFs

                // add all of these attributes so that we can toggle the play/pause of each GIF
                gif.attr("src", response.data[i].images.fixed_height_still.url);
                gif.attr("data-still", response.data[i].images.fixed_height_still.url);
                gif.attr("data-animate", response.data[i].images.fixed_height.url);
                gif.attr("data-state", "still");

                // capture GIF rating
                var rating = $("<p>");
                rating.text("Rated: " + response.data[i].rating);

                // prepend image & rating to container div
                container.prepend(gif);
                container.prepend(rating);

                // prepend container to HTML
                $("#gifs").prepend(container);

            }

        });
    },

    // toggle play/pause of GIF on click
    toggleGIF: function() {

        // capture the current data state of the GIF
        var state = $(this).attr("data-state");

        // if the state is still
        if (state === "still") {

            // change the src of the GIF to the animated URL
            $(this).attr("src", $(this).attr("data-animate"));

            // change the state to animate
            $(this).attr("data-state", "animate");

        }

        // if the state is animate
        else {

            // change the src of the GIF to the animated URL
            $(this).attr("src", $(this).attr("data-still"));

            // change the state to still
            $(this).attr("data-state", "still");

        }

    },

    // when a user enters a topic
    renderUserTopic: function() {
    
        // capture the user's input
        var newTopic = $("#user-topic").val();
        console.log("New topic: " + newTopic);

        // push the new topic to the user array
        giphy.topics[4].push(newTopic);
        console.log("User's topics: " + giphy.topics[4]);

        // refresh button div to include new button
        giphy.makeButtons();

        // clear out text box
        $("#user-topic").val("");

    },

    // clear all user topics
    clearUserTopics: function() {

        // clear out user array
        giphy.topics[4] = [];
        console.log("User's topics: " + giphy.topics[4]);

        // refresh button div
        giphy.makeButtons();

    }
            
};

// MAIN PROCESS
// ====================================================================================
$(window).on("load", function() {

    // render the buttons!
    giphy.makeButtons();

    // when any button is clicked, display its appropriate GIFs & ratings
    $(document).on("click", ".topic", giphy.displayGIFs);

    // when any GIF is clicked, toggle whether it is playing or paused
    $(document).on("click", ".gif", giphy.toggleGIF);

    // when user clicks submit
    $("#submit").on("click", function(e) {

         // prevent form from refreshing automatically upon submission
         e.preventDefault();

         // add the new button to the button div
         giphy.renderUserTopic();

    });

    // when user clicks reset
    $("#reset").on("click", function(e) {

        // prevent form from refreshing automatically upon submission
        e.preventDefault();

        // clear out all of the user's topics
        giphy.clearUserTopics();

    });

    // when user clicks clear GIFs
    $("#clear-gifs").on("click", function() {
        $("#gifs").empty();
    })

});

