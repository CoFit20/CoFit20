var sequence = []
var counter = 0;
$(document).ready(function(){
    var workoutFile = "";
    let searchParams = new URLSearchParams(window.location.search)
    if(searchParams.has('workout')) {
        workoutFile = searchParams.get('workout');
    }else{
        console.log("Could not find workout in URL Use default workout1.json")
        workoutFile = "workout1.json"
    }
    //console.log(jsonObject);
    fetch('./static/data/'+workoutFile,{cache: "no-store"})
        .then((response) => {
            var date_str = response.headers.get('Date');
            calcOffset(date_str)

            return response.json();
        })
        .then((data) => {

            let searchParams = new URLSearchParams(window.location.search)
            if(searchParams.has('timestamp')) {
                let timestamp = searchParams.get('timestamp')

                var wait = {
                    "id": 0,
                    "heading": "Wait for Group Session",
                    "name": "Session will start soon",
                    "duration": 10,
                    "gifpath": "static/movie/Crunches.mp4"
};
                console.log("Timestamp found!!")
                data.startTime = dayjs(timestamp);
                //data.elements.unshift(wait);
            }else{
                data.startTime = 'now';
            }

            var startTime = null;
            if(data.startTime!="now"){
                startTime = dayjs(data.startTime)
            }else{
                startTime = dayjs(getServerTime())
            }
            data.elements.sort(function(a, b){
                return a.id - b.id;
            });

            var time_list = [startTime]
            var old_time = startTime;
            data['elements'].forEach(function (item, index) {
                item.timeStamp = old_time.add(item.duration,'seconds')
                old_time = item.timeStamp
            });

            createCarousel(data);
            parseResults(data);

        });

    $("#wo_bar").hide()

    $('#start').on('click', function(event) {
        event.preventDefault(); // To prevent following the link (optional)
        var fiveMinutes = 60 * 0.1,
            display = document.querySelector('#time');
        startTimer(fiveMinutes, display);
        $(this).hide();
        $("#wo_bar").show();
    });

});

function createCarousel(data) {
    var expired_count = 0;
    $.each (data['elements'], function(index,elem) {
        if(dayjs(elem.timeStamp).isBefore(dayjs(getServerTime()))) {
            console.log("expired");
            elem.expired = true;
            expired_count = expired_count +1;
            return;
        }
        elem.expired = false;
        elem.carousel_index = index-expired_count;

        var content = null;
        if(elem.gifpath==""){
            var wrapper = $('<div class="carousel-item"></div>');
            var ol = $("<ol class='list-group'></ol>")
            var lst = elem.name;
            $.each (lst, function(index,elem) {
                ol.append("<li style='background-color: #555 ' class=\"list-group-item\"><b>"+elem+"</b></li>");

            });
            wrapper.append(ol)
            wrapper.append('<div id=timer-'+elem.id+'></div>')
            content = wrapper;
        }else {
           content = $('<div class="carousel-item"><h2 id="name-'+elem.id+'">'+elem.name+'</h2>' +
                '<video onloadeddata="this.play();"  playsinline loop muted preload autoplay>\n' +
                '    <source src="'+elem.gifpath+'" type="video/mp4" />\n' +
                '    Your browser does not support the video tag or the file format of this video.\n' +
                '</video>'+
                '<div id=timer-'+elem.id+'></div>')
        }

            content.appendTo('.carousel-inner');
        $('<li data-targe="#carousel" data-slide-to="' + elem.id + '"></li>').appendTo('.carousel-indicators');
    })
    // ------------    SHOW CAROUSEL    -------------
    $('#carousel').carousel();
    $('.carousel-indicators > li').first().addClass('active');
    $('.carousel-item').first().addClass('active');
}




function parseResults(data) {
    startJqueryTimer(data);
}

function startJqueryTimer(startTime) {
    console.log(startTime);
    if(startTime['elements'].length==0){
        $("#content").empty()
        $("#content").html('<h1>!!! Workout over !!!!</h1>')
        return
    }

    var element = startTime['elements'].shift()
    if(element.expired){
        console.log("Element is expired. Dont start timer")
        $(".carousel.active").empty()
        $('.carousel').carousel(element.carousel_index)
        startJqueryTimer(startTime);
        return;
    }
    $('#heading').text(element.heading);
    var elemId = uniqId()
    var timer_gui = $("#timer-"+element.id).text("00:00").css('font-size', 'xx-large');

    timer_gui.countdown({
        until: new Date((element['timeStamp'])),
        compact: true, format: 'dhMS',
        onExpiry: function expired() {
            console.log("expired"+element.id)
            $('#heading').text('-');
            $(".carousel.active").empty()
            $('.carousel').carousel(element.carousel_index+1);
            console.log('carousel go to next')
            startJqueryTimer(startTime);
        },
        alwaysExpire: true
    });
}
var offset = 0;
function calcOffset(dateStr) {
    offset = dayjs(Date.now()).diff(dayjs(dateStr))
    console.log("Offset Server->local "+offset)
}

function getServerTime() {
    var date = new Date();

    date.setTime(date.getTime() + offset);

    return date;
}

function uniqId() {
    return Math.round(new Date().getTime() + (Math.random() * 100));
}