$(document).ready(function() {

    var socket = io.connect();

    socket.on('tweetTweeted', function(tweet){
        if($('#tweets')) {//TODO: Pull styling and sizing out to css
            var listEntry = '<li>';
            if(tweet.user) {
                listEntry += '<img width="20px" style="margin:5px;" src="'+tweet.user.profile_image_url+'"/>';
            }
            listEntry += tweet.text + '</li>';
            $('#tweets').append(listEntry);
        }
    });
});