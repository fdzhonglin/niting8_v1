
function cleanOperation () {
    alert("功能正在添加中，请您耐心等待！我们会在第一时间通知您！");
    $("#month-notify-button").hide();
    $("#year-notify-button").hide();
}


Template.SubscriptionPage.events({
    "click #month-notify-button": function () {
        Meteor.call("addNotify", "monthly");
        cleanOperation();
    },
    "click #year_notify-button": function () {
        Meteor.call("addNotify", "yearly");
        cleanOperation();
    }
});


Template.SubscriptionPage.helpers({
    needNotification: function () {
        var user_account = UserAccounts.findOne({user_id: Meteor.userId()});
        if (user_account && user_account.notify_needed) {
            return false;
        }
        return true;
    }
});
