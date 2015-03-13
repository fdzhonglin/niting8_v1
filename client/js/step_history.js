

Template.StepHistory.events({
    "click .history-video-item": function (event, template) {
        event.preventDefault();
        var video_id;
        if ($(event.target).is("div")) {
            video_id = $(event.target).data("video-id");
        }
        else {
            video_id = $(event.target).parent().data("video-id");
        }
        Router.go("/video_viewed/" + video_id);
    }
});


Template.StepHistory.helpers({
    cn_tag: function () {
        return g_CN_TAG_MAP[Template.instance().data.tag];
    },
    video_list: function () {
        var video_ids = Template.instance().data.video_ids;
        return Videos.find({_id: {$in: video_ids}});
    }
});
