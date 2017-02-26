var keywordCount = 0;
var height, width;

var baseUrl = "http://twitterdanmaku.heroku.com";

$(document).ready(function() {
    var socket = io.connect(baseUrl);
    var height = 0;

    // get previous keywords
    $.get(
        baseUrl + "/keywords", 
        {'keyword': $("#keyword").val()},
        function(keywords) {
            console.log(keywords);
            for (i = 0; i < keywords.length; i++) {
                addKeywordChip(keywords[i]);
            }
        }
    )

    // get trending keywords
    // $.get(
    //     baseUrl + "/trends",
    //     {},
    //     function(keywords) {
    //         for (i = 0; i < 10; i++) {
    //             addTrending(keywords[i]);
    //         }
    //     }
    // )

    socket.on('tweet', function(tweet){
        console.log(tweet);
            height = $(window).height();
            width = $(window).width();

            var $tweetdiv = $("<div/>").attr('id', divid = divid++ % 30).addClass("tweet").append(
                $('<a/>').attr('href', tweet.link).attr('target', "_blank").html(tweet.text));

            $tweetdiv.css("left", width);
            // $tweetdiv.css("top", randIntInRange(0, Math.floor((height-100)/25)) * 25 + 80 + "px");
            $tweetdiv.css("top", Math.round(Math.random()*(height-100) + 80) + "px");
            $tweetdiv.css("color", tweet.color);
            $("body").append($tweetdiv);
        
    });

    $("#keywordform").submit(function(e) {
        // console.log("add keyword");
        var url = baseUrl + "/keywords";
        $.post(
            url, 
            {'keyword': $("#keyword").val()},
            function(data) {
                keywordCount = keywordCount + 1;
                addKeywordChip($("#keyword").val());
                $("#keyword").val("");
            }
        )
        e.preventDefault(); // avoid to execute the actual submit of the form.
    });
    
    $(document).on("click", ".delkeyword", function(e) {
        var url = baseUrl + "/keywords";
        $.ajax({
            url: url,
            type: 'DELETE',
            data:  {'keyword': $(".mdl-chip__text", $(this).parent()).html()},
            success: function(result) {
            }
        });
        $(this).parent().remove();
    });

});

var randIntInRange = function(s, e) {
    return Math.round(Math.random() * (e - s)) + s;
}

var addKeywordChip = function(keyword) {
    $("#keywordbar").append(
        $("<span/>").attr("id", "keyword"+keywordCount).addClass("mdl-chip mdl-chip--deletable").append(
            $("<span/>").addClass("mdl-chip__text").html(keyword)
        ).append("<button type=\"button\" class=\"mdl-chip__action delkeyword\"><i class=\"material-icons\">cancel</i></button>")
    )
}

var addTrending = function(keyword) {
    $("#bottom").append(
        $("<span/>").attr("id", "trend"+keywordCount).addClass("mdl-chip").append(
            $("<span/>").addClass("mdl-chip__text").html(keyword)
        ).append("<button type=\"button\" class=\"mdl-chip__action\"><i class=\"material-icons\">cancel</i></button>")
    )
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
