
Template.ShowVideo.helpers({
    isAndroid: function () {
        return device.platform=="Android";
    }
});

Template.ShowVideo.events({
    "click .question-submit-button": function (event, template) {
        event.preventDefault();
        $(".submit-button-div").hide();
        $(".comment-div").show();
        $(".next-video-div").show();
    },
    "click .video-pic": function (event, template) {
        event.preventDefault();

        var myFilename = "test.mp4";
        var myUrl = "http://10.10.24.163:3000/video/" + myFilename;
        var fileTransfer = new FileTransfer();
        var filePath = cordova.file.dataDirectory + "leve1_3/" + myFilename;

        console.log(encodeURI(myUrl));
        console.log(filePath);
        fileTransfer.download(encodeURI(myUrl), filePath, (function(entry) {
            console.log("downloaded");
            console.log(filePath);
            var video_test_file = filePath;
            window.plugins.vitamio.playVideo(video_test_file);
            //vid.loop = true;
        }), (function(error) {
//            alert("Video download error: source " + error.source);
//            alert("Video download error: target " + error.target);
//            alert("Video download error code" + error.code);
//            alert("Video download error code" + error.http_status);
//            alert("Video download error code" + error.body);
//            alert("Video download error code" + error.exception);
        }), true);
    }
});

