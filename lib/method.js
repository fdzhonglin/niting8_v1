
function filterArray(src, filt) {
    var temp = {}, i, result = [];
    // load contents of filt into object keys for faster lookup
    for (i = 0; i < filt.length; i++) {
        temp[filt[i]] = true;
    }

    // go through src
    for (i = 0; i < src.length; i++) {
        if (!(src[i] in temp)) {
            result.push(src[i]);
        }
    }
    return(result);
}

Meteor.methods({
    isNextTagAvailable: function () {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var user_account = UserAccounts.findOne({user_id: Meteor.userId()});
        var last_tag_start_date = user_account.tag_start_date;
        var current_time = new Date();

        if (user_account.subscription_type == "free") {
            if (((current_time - last_tag_start_date)/1000) > 24 * 60 * 60) {
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    },
    setOngoingVideos: function (tag_str) {
        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        var result = Meteor.call('isNextTagAvailable');
        if (!result) {
            throw new Meteor.Error("not now");
        }

        var video_ids = [];
        Videos.find({tag: tag_str}, 
                    {fields: {_id: 1}}).forEach(function (video) {
                        video_ids.push(video._id);
                    });
        var history_video_ids = [];
        HistoryList.find({tag: tag_str, user_id: Meteor.userId()}, 
                         {fields: {video_ids: 1}}).forEach(function (history) {
                             history_video_ids = history_video_ids.concat(history.video_ids);
                         });
        var available_ids = filterArray(video_ids, history_video_ids);
        var ongoing_ids = [];
        var max_count = Math.min(available_ids.length, g_VIDEOS_PER_STEP);
        for (var i=0; i < max_count; i++) {
            ongoing_ids.push(available_ids[i]);
        }

        var level = UserAccounts.findOne({user_id: Meteor.userId()}).level;
        var step = UserAccounts.findOne({user_id: Meteor.userId()}).step;

        UserAccounts.update({user_id: Meteor.userId()},
                            {$set: {
                                ongoing_videos: ongoing_ids,
                                level: level,
                                step: step,
                                video_index: 0,
                                tag: tag_str,
                                tag_start_date: new Date(),
                            }});
    },
    nextStep: function (avatar_arg, nickname_arg) {
        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        var user_account = UserAccounts.findOne({user_id: Meteor.userId()});
        var next_step = user_account.step + 1;
        var level = user_account.level;

        HistoryList.insert({
            user_id: Meteor.userId(),
            level: user_account.level,
            step: user_account.step,
            tag: user_account.tag,
            video_ids: user_account.ongoing_videos,
        });

        if (next_step > g_LEVEL_STEPS[level - 1]) {
            UserAccounts.update({user_id: Meteor.userId()}, 
                                { $set: { 
                                    level: level + 1,
                                    step: 1,
                                    ongoing_videos: [],
                                    video_index: 0,
                                }
                                });
        }
        else {
            UserAccounts.update({user_id: Meteor.userId()}, 
                                { $inc: { 
                                    step: 1,
                                },
                                  $set: {
                                      ongoing_videos: [],
                                      video_index: 0,
                                  }
                                });
        }
    },
    addNotify: function (notify_option) {
        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        UserAccounts.update({user_id: Meteor.userId()}, 
                            { $set: { 
                                notify_needed: notify_option,
                            }
                            });
    },
    saveBasicInfo: function (avatar_arg, nickname_arg) {
        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        UserAccounts.update({user_id: Meteor.userId()}, 
                            { $set: { 
                                avatar: avatar_arg,
                                nickname: nickname_arg,
                            }
                            });
    },
    saveNewNickname: function (nickname_arg) {
        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        UserAccounts.update({user_id: Meteor.userId()}, 
                            { $set: { 
                                nickname: nickname_arg,
                            }
                            });
    },
    addComment: function (comment) {
        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        var user_account = UserAccounts.findOne({user_id: Meteor.userId()});
        var video_id = user_account.ongoing_videos[user_account.video_index - 1];

        Comments.insert({
            user_id: Meteor.userId(), 
            comment: comment,
            video_id: video_id,
        });
    },
    finishNewVideo: function (more_score, like_it) {
        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        var user_account = UserAccounts.findOne({user_id: Meteor.userId()});
        var video_id = user_account.ongoing_videos[user_account.video_index];

        if ("true" == like_it) {
            Videos.update({_id: video_id}, 
                          { $inc: { 
                              like_count: 1,
                          }
                          });

            UserAccounts.update({user_id: Meteor.userId()}, 
                                { $inc: { 
                                    score: more_score,
                                    video_index: 1,
                                    like_count: 1,
                                }
                                });
        }
        else {
            Videos.update({_id: video_id}, 
                          { $inc: { 
                              dislike_count: 1,
                          }
                          });

            UserAccounts.update({user_id: Meteor.userId()}, 
                                { $inc: { 
                                    score: more_score,
                                    video_index: 1,
                                    dislike_count: 1,
                                }
                                });
        }

        var user_account = UserAccounts.findOne({user_id: Meteor.userId()});
        if (user_account.video_index == user_account.ongoing_videos.length) {
            Meteor.call("nextStep");
        }
    },
});

UI.registerHelper('indexedArray', function(context, options) {
	if (context) {
		return context.map(function(item, index) {
			item._index = index + 1;
			return item;
		});
	}
});

