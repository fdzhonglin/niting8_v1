

Template.VideoViewed.helpers({
    isRightChoice: function (option, answer) {
        return option == answer;
    },
    isCordova: function () {
        return Meteor.isCordova;
    }
});

function insertVideoContent() {
    var video = Template.instance().data;
    //var video = Videos.findOne({_id: video_id});

    $('#video-view-div').append('<video id="example_video_1" class="video-js vjs-default-skin" controls preload="auto" width="100%" height="200px"          poster="' + video.cover + '">     <source src="' + video.link + '" type="video/mp4" />     <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>   </video>  ');
}

Template.VideoViewed.rendered = function () {
    insertVideoContent();
}

Template.VideoViewed.events({
    "click #question-submit-button": function () {
        $(".submit-button-div").hide();
        $("#video-answers").show();
    },
    "click #video-share": function () {
        var video = Template.instance().data;
        window.plugins.socialsharing.share('我在“你听吧”上看到了一段非常有趣的视频，你也来看看吧！<video src="' + video.link + '" controls></video>',
                                          null,
                                          null,
                                          video.link);
    }
});
