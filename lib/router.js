
Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.onBeforeAction(function() {
    if (! Meteor.userId()) {
        this.layout('AccountLayout');
        this.render('account');
    } else {
        this.next();
    }
});


Router.route('/basic_setting', {
    waitOn: function () {
        return Meteor.subscribe("account_info");
    },
    action: function () {
        if (UserAccounts.findOne({user_id: Meteor.userId()}).nickname == "") {
            this.layout("InitSetting");
            this.render('SetBasicInfo');
        }
        else {
            Router.go("/");
        }
    }
});


Router.route('/', function () {
    this.render('home');
});

Router.route('/tag', function () {
    this.layout('TagInfo');
    this.render('ChooseTag');
});

Router.route('/video_viewed/:video_id', function () {
    this.layout('HistoryVideo');
    this.render('VideoViewed', {
        data: function () {
            return Videos.findOne({_id: this.params.video_id});
        }
    });
});

Router.route('/congratulation', function () {
    this.render('Congratulation');
});

Router.route('/video_new/:video_id', function () {
    this.layout('VideoInfo', {
        data: function () {
            return {step: this.params.query.step};
        }
    });
    this.render('VideoNew', {
        data: function () {
            return Videos.findOne({_id: this.params.video_id});
        }
    });
});

Router.route('/step_history/:step', function () {
    this.layout('ApplicationLayout', {
        data: function () {
            user_account = UserAccounts.findOne({user_id: Meteor.userId()});
            var history_videos = HistoryList.findOne({
                user_id: Meteor.userId(),
                level: user_account.level,
                step: parseInt(this.params.step),
            });
            return history_videos;
        }
    });
    this.render('StepHistory');
});

Router.route('/history', function () {
    this.render('HistoryList');
});

Router.route('/subscription', function () {
    this.render('SubscriptionPage');
});

Router.route('/setting', function () {
    this.render('setting');
});

