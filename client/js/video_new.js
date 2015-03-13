
var orig_level;

function changeToQuestionMode() {
    $(".submit-button-div").show();

    $(".comment-div").hide();
    $(".next-video-div").hide();

    var q_count = $(".question-div").length;
    for (var i=0; i<q_count; i++) {
        $("input[name=question"+(i+1)+"]").prop("checked", false);
    }

    $(".item-content").css("background-color", "white");
}

function changeToCommentMode() {
    $(".submit-button-div").hide();
    $("#comment-text").val("");

    $(".comment-div").show();
    $(".next-video-div").show();
    $(".right-answer").parent().children(".item-content").css("background-color", 
                                                                  "LightGreen");
}

function insertVideoContent() {
    var user_account = UserAccounts.findOne({user_id: Meteor.userId()});
    var video_id = user_account.ongoing_videos[user_account.video_index];
    var video = Videos.findOne({_id: video_id});

    $('#video-view-div').append('<video id="example_video_1" class="video-js vjs-default-skin" controls preload="auto" width="100%" height="200px"          poster="' + video.cover + '">     <source src="' + video.link + '" type="video/mp4" />     <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>   </video>  ');
}

Template.VideoNew.rendered = function () {
    var user_account = UserAccounts.findOne({user_id: Meteor.userId()});
    orig_level = user_account.level;
    insertVideoContent();
}

Template.VideoNew.helpers({
    isCordova: function () {
        return Meteor.isCordova;
    },
    isAndroid: function () {
        return false;
        if (Meteor.isCordova) {
            return device.platform=="Android";
        }
    },
    isRightChoice: function (option, answer) {
        return option == answer;
    },
});

Template.VideoNew.events({
    "click .ion-heart": function (event, template) {
        event.preventDefault();
        if ($("input[name=like_it]:checked").val() != "true") {
            $("input[name=like_it]").val("true");
            $(".ion-heart").css("color", "#009fda");
            $(".ion-heart-broken").css("color", "black");
        }
    },
    "click .ion-heart-broken": function (event, template) {
        event.preventDefault();
        if ($("input[name=like_it]:checked").val() != "false") {
            $("input[name=like_it]").val("false");
            $(".ion-heart-broken").css("color", "#009fda");
            $(".ion-heart").css("color", "black");
         }
    },
    "click #question-submit-button": function (event, template) {
        event.preventDefault();
        var q_count = $(".question-div").length;

        var score = 0;
        for (var i=0; i<q_count; i++) {
            var class_str = $("input[name=question"+(i+1)+"]:checked").attr("class");
            if (class_str == "right-answer") {
                ++score;
            }
        }

        changeToCommentMode();
        Meteor.call("finishNewVideo", score, $("input[name=like_it]:checked").val());
    },
    "click .next-video-button": function (event, template) {
        event.preventDefault();
        changeToQuestionMode();

        if ($("#comment-text").val() != "") {
            Meteor.call("addComment", $("#comment-text").val());
        }

        var oldPlayer = document.getElementById('example_video_1');
        videojs(oldPlayer).dispose();
          
        $(".ion-heart").trigger( "click" );

        var user_account = UserAccounts.findOne({user_id: Meteor.userId()});
        if (0 == user_account.ongoing_videos.length) {
            user_account = UserAccounts.findOne({user_id: Meteor.userId()});
            var new_level = user_account.level;
            if (orig_level == new_level) {
                Router.go("/");
            }
            else {
                Router.go("/congratulation");
            }
        }
        else {
            var video_id = user_account.ongoing_videos[user_account.video_index];
            Router.go('/video_new/' + video_id);
            insertVideoContent();
        }
    },
    "click #video-share": function () {
        var video = Template.instance().data;
        window.plugins.socialsharing.share('我在“你听吧”上看到了一段非常有趣的视频，你也来看看吧！<video src="' + video.link + '" controls></video>',
                                          null,
                                          null,
                                          video.link);
    }
});


