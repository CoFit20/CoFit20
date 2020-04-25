var sequence = []
var counter = 0;
$(document).ready(function(){

    //console.log(jsonObject);
    fetch('./static//data/workout1.json')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
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
        $('<div class="carousel-item"><h2>'+elem.name+'</h2>' +
            '<video onloadeddata="this.play();"  width="320" height="240" playsinline loop muted preload>\n' +
            '    <source src="./static//movie/test.webm" type="video/webm" />\n' +
            '    Your browser does not support the video tag or the file format of this video.\n' +
            '</video>'+
            '<div id=timer-'+elem.id+'></div>').appendTo('.carousel-inner');
        $('<li data-targe="#carousel" data-slide-to="' + index + '"></li>').appendTo('.carousel-indicators');
    })
    // ------------    SHOW CAROUSEL    -------------
    $('#carousel').carousel();
    $('.carousel-indicators > li').first().addClass('active');
    $('.carousel-item').first().addClass('active');
}




function parseResults(data) {
    var startTime = null;
    if(data['startTime'] == "now"){
        startTime = dayjs(Date.now())}
    else{
        startTime = dayjs(data['startTime']);
    }
    data.elements.sort(function(a, b){
        return a.id - b.id;
    });
    var time_list = [startTime]
    var old_time = startTime;
    data['elements'].forEach(function (item, index) {
        item.timeStamp = old_time.add(item.duration,'seconds')
        old_time = item.timeStamp
        console.log(item)
    });
    console.log(data);

    console.log(time_list.sort((a, b) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1)))

    startJqueryTimer(data);
}

function startJqueryTimer(startTime) {


    var element = startTime['elements'].shift()
    $('#heading').text(element.heading);
    var elemId = uniqId()
    var timer_name = $("<div></div>").text(element.name);
    var timer_gui = $("#timer-"+element.id).text("00:00 ").css('font-size', 'xx-large');

    //console.log("Elements2",(['timeStamp'])
    timer_gui.countdown({
        until: new Date((element['timeStamp'])),
        compact: true, format: 'MS',
        onExpiry: function expired() {
            $('.carousel').carousel("next");
            console.log('Bla')
            startJqueryTimer(startTime)
        },
        alwaysExpire: true
    });
}

function uniqId() {
    return Math.round(new Date().getTime() + (Math.random() * 100));
}