

Hooks.onCreateUser = function (userId) { 
    UserAccounts.insert({
        user_id: userId,

        // Basic information can be set
        nickname: "",
        avatar: "",

        like_count: 0,
        dislike_count: 0,
        
        // MONEY related part
        subscription_type: "free",
        start_day: "",

        // Map tracking
        level: 1,
        step: 1,


        score: 0,

        // Tag tracking
        tag: "",
        tag_start_date: new Date(1989, 10, 15),
        ongoing_videos: [],
        video_index: 0,
        video_downloaded: false,
        
        earned_tags: [],
    });
}
