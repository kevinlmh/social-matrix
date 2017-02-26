// Entry
$( document ).ready(function() {
    var socket = io.connect("http://localhost:3000");
    var height = 0;
    var keywordCount = 0;

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
            {'keyword': $("#keyword").val()},
            function(data) {
                keywordCount = keywordCount + 1;
                $("#keywordbar").append(
                    $("<span/>").attr("id", "keyword"+keywordCount).addClass("mdl-chip mdl-chip--deletable").append(
                        $("<span/>").addClass("mdl-chip__text").html($("#keyword").val())
                    ).append("<button type=\"button\" class=\"mdl-chip__action delkeyword\"><i class=\"material-icons\">cancel</i></button>")
                )
                $("#keyword").val("");
            }
        )
        e.preventDefault(); // avoid to execute the actual submit of the form.
    });



    $(".delkeyword").click(function(e) {
        console.log("x clicked");
        var url = "http://localhost/keywords";
        $.ajax({
            url: url,
            type: 'DELETE',
            data:  {'keyword': $("#keyword").val()},
            success: function(result) {
                console.log(e);
            }
        });
    });
});
