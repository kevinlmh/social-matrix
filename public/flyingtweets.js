// Entry

$( document ).ready(function() {
    var socket = io.connect("http://localhost:3000");
    
    httpGetAsync('/trending', )

    var divs = [];
    var bitRowMap = new Array(20).fill(0);
    var divid = 0;
    var rowNum; 

    socket.on('tweet', function(data){
        console.log(data);
        if (Math.random() > 0.97) {

            var div = document.createElement("div");
            div.setAttribute("class", "tweet");
            div.setAttribute("id", divid = divid++ % 30);

            div.appendChild(document.createTextNode(data.message));

            do {
                rowNum = (Math.round(Math.random() * 20));
            } while (bitRowMap[rowNum] == 1);

            div.style.top = Math.round(rowNum * 5)+ "%";
            bitRowMap[rowNum] = 1;
            divs.push((divid, rowNum));
            console.log(bitRowMap);

            div.style.left = (Math.round(Math.random() * 100)) + "%";
            $("canvas mdl-grid").append(div);

            while (divs.length > 30) {
                var divRemoved = divs.shift();
                $("#" + divRemoved[0]).remove();
                bitRowMap[divRemoved[1]] = 0;
            }
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
