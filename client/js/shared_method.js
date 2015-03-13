
getAvatarImgUrl = function (avatar_str) {
    return "/images/avatars/" + avatar_str + ".png";
}

getTagPicUrl = function (tag_str) {
    var file_name = tag_str.toLowerCase();
    file_name = file_name.replace(" ", "_");
    return "/images/tags/" + file_name + ".png";
}

