

var mySwiper;

Template.SetBasicInfo.rendered = function () {
    mySwiper = new Swiper('.swiper-container');
    $('#confirmation-button').attr('disabled','disabled');
}

// in a JavaScript file
Template.SetBasicInfo.helpers({
    avatars: function () {
        var avatar_option = [];
        _.each(g_AVATAR_LIST, function (element) {
            avatar_option.push({img_url: getAvatarImgUrl(element)});
        });
        return avatar_option;
    },
});

Template.SetBasicInfo.events({
    "keyup #nickname": function (event, template) {
        event.preventDefault();
        var nickname = $("#nickname").val();
        if(nickname != '') {
           $('#confirmation-button').removeAttr('disabled');
        }
        else {
            $('#confirmation-button').attr('disabled','disabled');
        }
    },
    "click #confirmation-button": function (event, template) {
        event.preventDefault();

        var avatar_chosen = g_AVATAR_LIST[mySwiper.activeIndex];
        var nickname = $("#nickname").val();

        if (nickname == "" || avatar_chosen ==  "") {
            alert("昵称不能为空!");
        }
        else {
            Meteor.call("saveBasicInfo", avatar_chosen, nickname);
            Router.go("/");
        }
    }
});
