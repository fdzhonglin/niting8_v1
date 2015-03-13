
Template.setting.helpers({
    current_nickname: function () {
        var account_info = UserAccounts.findOne({user_id: Meteor.userId()});
        return account_info.nickname;
    }
});

Template.setting.events({
    "click #confirmation-button": function (event, template) {
        var nickname = $("#nickname").val();

        if (nickname == "") {
            alert("昵称不能为空!");
        }

        Meteor.call("saveNewNickname", nickname);
        Router.go("/");
    },
});
