

Template.ChooseTag.rendered = function () {
    $('#coverflow').coverflow();
};

Template.ChooseTag.helpers({
    avatar_img_url: function () {
        var account_info = UserAccounts.findOne({user_id: Meteor.userId()})
        var level = account_info.level;
        var avatar_str = account_info.avatar;
        return "/images/avatars/level" + level + "/" + avatar_str + "_avatar.png";
    },
    tag_list: function () {
        var tag = g_TAG_LIST;
        var tag_list = [];

        _.each(tag, function (tag_str) {
            if ((Videos.find({tag: tag_str}).count() - HistoryList.find({tag: tag_str}).count() * g_VIDEOS_PER_STEP) > 0) {
                tag_list.push(
                    {title: tag_str, 
                     cn_title:g_CN_TAG_MAP[tag_str], 
                     tag_pic: getTagPicUrl(tag_str)});
            }
        });
        
        return tag_list;
    }
});

Template.TagInfo.events({
    "click .back-to-map": function(e) {
        e.preventDefault();
        Router.go('/');
    }
});

Template.VideoInfo.events({
    "click .back-to-map": function(e) {
        e.preventDefault();
        Router.go('/');
    }
});

Template.HistoryVideo.events({
    "click .back-to-map": function(e) {
        e.preventDefault();
        var return_url = Session.get("last_page");
        Router.go(return_url);
    }
});

Template.ChooseTag.events({
    "click .button-tag": function(event) {
        event.preventDefault();
        Meteor.call("setOngoingVideos", $(event.target).data("tag-str"), 
                    function (error, run_ok) {
                        if (!error) {
                            var video_id = UserAccounts.findOne({user_id: Meteor.userId()})
                                                       .ongoing_videos[0];
                            Router.go('/video_new/' + video_id);
                        }
                    });
    }
});

