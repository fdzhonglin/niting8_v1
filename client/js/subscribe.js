


Meteor.subscribe("account_info");
Meteor.subscribe("all_videos");
Meteor.subscribe("video_history");

Meteor.subscribe("top_heroes");

Hooks.onLoggedIn = function () {
    Router.go("/basic_setting");
}
