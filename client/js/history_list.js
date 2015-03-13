


Template.HistoryList.helpers({
    video_list: function () {
        var video_ids = [];
        HistoryList.find({user_id: Meteor.userId()}, {sort: [["level", "desc"], 
                                                              ["step", "desc"]]})
            .forEach(function (history) {
                video_ids = video_ids.concat(history.video_ids);
            });
        return Videos.find({_id: {$in: video_ids}});
    }
});


Template.HistoryList.events({
    "click .history-video-item": function (event, template) {
        event.preventDefault();
        var video_id;
        if ($(event.target).is("div")) {
            video_id = $(event.target).data("video-id");
        }
        else {
            video_id = $(event.target).parent().data("video-id");
        }
        Session.set("last_page", "/history");
        Router.go("/video_viewed/" + video_id);
    }
});
