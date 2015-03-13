
function playClickSound () {
    var audio_file = "audio/click_menu.mp3";
    if (Meteor.isCordova) {
        var click_sound = new Media(cordova.file.applicationDirectory + 'www/application/' + audio_file);
        click_sound.play();
    }
    else {
        new Audio(audio_file).play();
    }
}

Template.ApplicationLayout.events({
  "click .to-home": function (event, template) {
      event.preventDefault();
      playClickSound();
      Router.go('/');
      $(".pull-left").click();
  },
  "click .to-history": function (event, template) {
      event.preventDefault(); 
      playClickSound();
      Router.go('/history');
      $(".pull-left").click();
  },
  "click .to-subscription": function (event, template) {
      event.preventDefault();
      playClickSound();
      Router.go('/subscription');
      $(".pull-left").click();
  },
  "click .to-setting": function (event, template) {
      event.preventDefault();
      playClickSound();
      Router.go('/setting');
      $(".pull-left").click();
  },
});

Template.ApplicationLayout.helpers({
    avatar_img_url: function () {
        var account_info = UserAccounts.findOne({user_id: Meteor.userId()})
        var level = account_info.level;
        var avatar_str = account_info.avatar;
        return "/images/avatars/level" + level + "/" + avatar_str + "_avatar.png";
    },
});

var is_top_user = false;
Template.LeaderScore.helpers({
    thumbnail_avatar: function (id) {
        var user = UserAccounts.findOne({_id: id});
        return "/images/avatars/level" + user.level + "/" + user.avatar + ".png";
    },
    isCurrentUser: function (id) {
        var account_info = UserAccounts.findOne({user_id: Meteor.userId()})
        is_top_user = true;
        return id == account_info._id;
    },
    heroes: function () {
        return heroes = UserAccounts.find({}, {limit:10});
    },
    isNotTopUser: function () {
        return !is_top_user;
    }
});
