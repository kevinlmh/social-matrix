// Entry
$( document ).ready(function() {
    var socket = io.connect("http://localhost:3000");
    var height = 0;

    socket.on('tweet', function(data){
        console.log(data);
        var $newbutton = $("<div/>")   // creates a div element
                .addClass("tweet")
                .html(data.message);
        $newbutton.css("left", "1200px");
        $newbutton.css("top", Math.round(Math.random() * 60) * 10 + "px");

        // var div = document.createElement("button");
        // div.appendChild(document.createTextNode(data.message));
        // div.style.left = "1200px";
        // // div.style.top = Math.round(Math.random() * 60) * 10 + "px";
        // newbutton.style.left = "1200px";
        // newbutton.style.top = Math.round(Math.random() * 60) * 10 + "px";
        $("body").append($newbutton);
    });

    $("#keywordform").submit(function(e) {
        // console.log("add keyword");
        var url = "http://localhost/keywords";
        $.post(
            url, 
            "{ 'keyword': '" + $("#keyword").val() + "'}",
            function(data) {
                $("#keyword").val("");
            }
        )
        e.preventDefault(); // avoid to execute the actual submit of the form.
    });

});
