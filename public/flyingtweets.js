// Entry

// $( document ).ready(function() {
//     var socket = io.connect("http://localhost:3000");

//     var divs = [];
//     var bitRowMap = new Array(20).fill(0);
//     var divid = 0;
//     var rowNum; 

//     socket.on('tweet', function(data){
//         console.log(data);
//         if (Math.random() > 0.97) {

//             var div = document.createElement("div");
//             div.setAttribute("class", "tweet");
//             div.setAttribute("id", divid = divid++ % 30);

//             div.appendChild(document.createTextNode(data.message));

//             do {
//                 rowNum = (Math.round(Math.random() * 20));
//             } while (bitRowMap[rowNum] == 1);

//             div.style.top = Math.round(rowNum * 5)+ "%";
//             bitRowMap[rowNum] = 1;
//             divs.push((divid, rowNum));
//             console.log(bitRowMap);

//             div.style.left = (Math.round(Math.random() * 100)) + "%";
//             $("canvas mdl-grid").append(div);

//             while (divs.length > 30) {
//                 var divRemoved = divs.shift();
//                 $("#" + divRemoved[0]).remove();
//                 bitRowMap[divRemoved[1]] = 0;
//             }
//         }
//     }); 

var keywordCount = 0;

$(document).ready(function() {
    var socket = io.connect("http://localhost:3000");
    var height = 0;

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
        console.log(tweet);
        var height = $(window).height();
        var width = $(window).width();

        var $newbutton = $("<div/>").addClass("tweet").append(
            $('<a/>').attr('href', tweet.link).attr('target', "_blank").html(tweet.text));

        $newbutton.css("left", width);
        $newbutton.css("top", randIntInRange(0, Math.floor(height-200/10)) * 10 + 100 + "px");

        // var div = document.createElement("button");
        // div.appendChild(document.createTextNode(tweet.message));
        // div.style.left = "1200px";
        // // div.style.top = Math.round(Math.random() * 60) * 10 + "px";
        // $newbutton.style.left = "1200px";
        // $newbutton.style.top = randIntInRange(0, Math.floor(height/10)) * 10 + "px";
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
