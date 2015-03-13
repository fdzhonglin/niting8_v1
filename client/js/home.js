
var s_step_index = 0;
var s_current_step = 0;

var non_tag_list = ["blank", "blank25", "blank20", "blank10", 
                    "footprint_down_light_right", "footprint_down_light_left",
                    "footprint_light_right", "footprint_light_left", 
                    "footprint_down_dark_right", "footprint_down_dark_left",
                    "footprint_dark_right", "footprint_dark_left", 
                    "active", "inactive"];

function my_strncmp(str1, str2, n) {
  str1 = str1.substring(0, n);
  str2 = str2.substring(0, n);
  return ( ( str1 == str2 ) ? 0 :
           (( str1 > str2 ) ? 1 : -1 ));
}

function isertStepDown(dest, is_original_order, step_per_row) {
    var row = []
    var elem_per_row = Math.ceil(step_per_row * 1.5);
    for (var i=0; i < elem_per_row; i++) {
        if (is_original_order) {
            if (i == 0) {
                if (s_step_index < s_current_step) {
                    row.push({icon: "footprint_down_dark_left"});
                }
                else {
                    row.push({icon: "footprint_down_light_left"});
                }
            }
            else {
                if (i == 1) {
                    row.push({icon: "blank"});
                }
                else {
                    row.push({icon: "blank25"});
                }
            }
        }
        else {
            if (i == elem_per_row - 2) {
                if (s_step_index < s_current_step) {
                    row.push({icon: "footprint_down_dark_right"});
                }
                else {
                    row.push({icon: "footprint_down_light_right"});
                }
            }
            else {
                if (i == elem_per_row - 1) {
                    row.push({icon: "blank"});
                }
                else {
                    row.push({icon: "blank25"});
                }
            }
        }
    }
    dest.push(row);
}

function alignRow(row, count) {
    for (var i=0; i < count/2; i++) {
        row.push({icon: "blank"});
        row.push({icon: "blank25"});
    }
}

function insertToArray(src, dest, index, count, is_original_order, step_per_row) {
    var row = []

    var blank_elem = (step_per_row - count) * 2;
    if (!is_original_order) {
        alignRow(row, blank_elem);
    }

    for (var i=0; i < count; i++) {
        ++s_step_index;
        if (is_original_order) {
            var real_index = index + i;
            row.push({icon:src[real_index], step: real_index + 1});
            if (i != count - 1) {
                if (s_step_index < s_current_step) {
                    row.push({icon: "footprint_dark_right"});
                }
                else {
                    row.push({icon: "footprint_light_right"});
                }
            }
        }
        else {
            var real_index = index + count - i - 1;
            row.push({icon:src[real_index], step: real_index + 1});
            if (i != count - 1) {
                if (s_step_index < s_current_step) {
                    row.push({icon: "footprint_dark_left"});
                }
                else {
                    row.push({icon: "footprint_light_left"});
                }
            }
        }
    }

    if (is_original_order) {
        alignRow(row, blank_elem);
    }

    dest.push(row);
}


function getFinishedResult (user_id, level, step) {
    tag_list = [];
    HistoryList.find(
        {
            user_id: user_id,
            level: level,
            step: {$lt: step},
        }, 
        {fields: {tag:1}}).forEach(function (history) {
            tag_list.push(history.tag);
        });
    return tag_list;
}

Template.home.events({
    "click .active-avatar": function (event, template) {
        event.preventDefault();
        var account_info = UserAccounts.findOne({user_id: Meteor.userId()})
        var level = account_info.level;
        var step = account_info.step;
        var tag = account_info.tag;
        var ongoing_videos = account_info.ongoing_videos;
        
        
        if (tag == "" || ongoing_videos.length == 0) {
            Meteor.call("isNextTagAvailable", function (error, result) {
                if (!error) {
                    if (result) {
                        Router.go('/tag');  
                    }
                    else {
                        $("#free-subscription-modal").trigger("click");
                    }
                }
            });
        }
        else {
            var video_index = account_info.video_index;
            var video_id = ongoing_videos[video_index];
            Router.go('/video_new/' + video_id);
        }
    },
    "click .map-tag": function (event, template) {
        var step = $(event.target).data("step");
        Session.set("last_page", '/step_history/' + step);
        Router.go(Session.get("last_page"));
    },
});

Template.home.helpers({
    level_pic_url: function () {
        var level = UserAccounts.findOne({user_id: Meteor.userId()}).level;
        return "/images/map_related/level_" + level + ".png";
    },
    map_info: function () {
        var user_account = UserAccounts.findOne({user_id: Meteor.userId()});
        var level = user_account.level;
        var s_current_step = user_account.step;

        s_step_index = 0;
        var steps = g_LEVEL_STEPS[level - 1];
        var step_per_row = 3;

        var final_result = getFinishedResult(user_account.user_id, level, s_current_step);
        final_result.push("active");
        for (var i = 0; i < steps - s_current_step; i++) {
            final_result.push("inactive");
        }

        var real_result = [];
        var max_rows = Math.ceil(steps / step_per_row);

        for (var i = 0; i < max_rows; i++) {
            var count = step_per_row;
            if (i == max_rows - 1) {
                count = steps - (step_per_row * i);
            }

            var is_original_order = true;
            if (i % 2) {
                is_original_order = false;
            }

            if (i != 0) {
                isertStepDown(real_result, is_original_order, step_per_row);
            }
            insertToArray(final_result, real_result, 
                          i * step_per_row, count, is_original_order, step_per_row);

        }
        return real_result;
    },
    isActive: function (str) {
        return str=="active";
    },
    isInactive: function (str) {
        return str=="inactive";
    },
    isBlank25: function (str) {
        return str=="blank25";
    },
    isBlank20: function (str) {
        return str=="blank20";
    },
    isBlank10: function (str) {
        return str=="blank10";
    },
    isBlank: function (str) {
        return str=="blank";
    },
    isFootprint: function (str) {
        return str.length < 22 && my_strncmp(str, "footprint", 9) == 0;
    },
    isFootprintDown: function (str) {
        return my_strncmp(str, "footprint_down", 14) == 0;
    },
    isTag: function (str) {
        for (var i=0; i < non_tag_list.length; i++) {
            if (str == non_tag_list[i]) {
                return false;
            }
        }
        return true;
    },
    tagUrl: function (tag_str) {
        return getTagPicUrl(tag_str);
    },
    footprintUrl: function (footprint_str) {
        var avatar_str = UserAccounts.findOne({user_id: Meteor.userId()}).avatar;
        return "/images/map_related/" + avatar_str + "/" + footprint_str + ".png";
    },
    avatar_img_url: function () {
        var account_info = UserAccounts.findOne({user_id: Meteor.userId()})
        var level = account_info.level;
        var avatar_str = account_info.avatar;
        return "/images/avatars/level" + level + "/" + avatar_str + ".png";
    },
    inactive_img_url: function () {
        var avatar_str = UserAccounts.findOne({user_id: Meteor.userId()}).avatar;
        return "/images/map_related/" + avatar_str + "/gray.png";
    }
});
