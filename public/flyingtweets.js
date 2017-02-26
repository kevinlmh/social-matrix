var keywordCount = 0;
var height, width;
var counter = 0;
var mod = 1;

var lastTime = new Date().getTime();

$(document).ready(function() {
    var socket = io.connect("http://localhost:3000");
    var height = 0;

    var divs = [];
    var bitRowMap = new Array(20).fill(0);
    var divid = 0;
    var rowNum; 

    $.get(
        "http://localhost/keywords", 
        {'keyword': $("#keyword").val()},
        function(keywords) {
            console.log(keywords);
            for (i = 0; i < keywords.length; i++) {
                addKeywordChip(keywords[i]);
            }
        }
    )

    socket.on('tweet', function(tweet){
        if (counter % mod == 0) {
            // do {
            //     rowNum = (Math.round(Math.random() * 20));
            // } while (bitRowMap[rowNum] == 1);
            // $tweetdiv.css("top", Math.round(rowNum * 25)+ "px");
            // bitRowMap[rowNum] = 1;
            // divs.push((divid, rowNum));
            // while (divs.length > 30) {
            //     var divRemoved = divs.shift();
            //     $("#" + divRemoved[0]).remove();
            //     bitRowMap[divRemoved[1]] = 0;
            // }
            height = $(window).height();
            width = $(window).width();

            var $tweetdiv = $("<div/>").attr('id', divid = divid++ % 30).addClass("tweet").append(
                $('<a/>').attr('href', tweet.link).attr('target', "_blank").html(tweet.text));

            $tweetdiv.css("left", width);
            $tweetdiv.css("top", randIntInRange(0, Math.floor((height-160)/25)) * 25 + 80 + "px");
            $tweetdiv.css("color", getRandomColor());
            $("body").append($tweetdiv);

            counter++;
        }

        var newTime = new Date().getTime();
        if (newTime-lastTime > 1000) {
            console.log(newTime-lastTime);
            console.log("counter " + counter);

            if (counter > 5) {
                mod *= 2;
            } else {
                // mod = Math.max(mod-1, 1);
            }
            counter = 0;
            console.log("mod " + mod);
            lastTime = newTime;
        }
        
    });

    $("#keywordform").submit(function(e) {
        // console.log("add keyword");
        var url = "http://localhost/keywords";
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
        // socket.emit('startstream');
    });
    
    $(document).on("click", ".delkeyword", function(e) {
        var url = "http://localhost/keywords";
        $.ajax({
            url: url,
            type: 'DELETE',
            data:  {'keyword': $(".mdl-chip__text", $(this).parent()).html()},
            success: function(result) {
            }
        });
        $(this).parent().remove();
        // socket.emit('startstream');
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

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
