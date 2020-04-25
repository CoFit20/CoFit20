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
    fetch('./static/data/'+workoutFile)
        .then((response) => {
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
                data.elements.unshift(wait);
            }else{
                data.startTime = 'now';
            }

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
    $.each (data['elements'], function(index,elem) {
        $('<div class="carousel-item"><h2 id="name-'+elem.id+'">'+elem.name+'</h2>' +
            '<video onloadeddata="this.play();"  playsinline loop muted preload autoplay>\n' +
            '    <source src="'+elem.gifpath+'" type="video/mp4" />\n' +
            '    Your browser does not support the video tag or the file format of this video.\n' +
            '</video>'+
            '<div id=timer-'+elem.id+'></div>').appendTo('.carousel-inner');
        $('<li data-targe="#carousel" data-slide-to="' + elem.id + '"></li>').appendTo('.carousel-indicators');
    })
    // ------------    SHOW CAROUSEL    -------------
    $('#carousel').carousel();
    $('.carousel-indicators > li').first().addClass('active');
    $('.carousel-item').first().addClass('active');
}




function parseResults(data) {
    var startTime = null;
    if(data.startTime!="now"){
        startTime = dayjs(data.startTime)
    }else{
       startTime = dayjs(Date.now())
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

    startJqueryTimer(data);
}

function startJqueryTimer(startTime) {
    console.log(startTime['elements'].length)
    if(startTime['elements'].length==0){
        $("#content").empty()
        $("#content").html('<h1>!!! Workout over !!!!</h1>')
        return
    }
    var element = startTime['elements'].shift()
    $('#heading').text(element.heading);
    var elemId = uniqId()
    var timer_gui = $("#timer-"+element.id).text("00:00 ").css('font-size', 'xx-large');

    timer_gui.countdown({
        until: new Date((element['timeStamp'])),
        compact: true, format: 'DHMS',
        onExpiry: function expired() {
            $('#heading').text('-');
            $(".carousel.active").empty()
            $('.carousel').carousel('next');
            startJqueryTimer(startTime);
        },
        alwaysExpire: true
    });
}

function uniqId() {
    return Math.round(new Date().getTime() + (Math.random() * 100));
}