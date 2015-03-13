

// Publish the logged in user's posts
Meteor.publish("account_info", function () {
    return UserAccounts.find({ user_id: this.userId });
});

Meteor.publish("all_videos", function () {
    return Videos.find();
});

Meteor.publish("video_history", function () {
    return HistoryList.find({ user_id: this.userId });
});

Meteor.publish("top_heroes", function () {
    return UserAccounts.find({}, {
        sort: {score: -1},
        limit: 10, 
        fields: {nickname: 1, avatar: 1, score:1, level: 1},
    });
});

