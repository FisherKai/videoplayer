function playVideo(videoPath, videoName) {
    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.src = videoPath;
    videoPlayer.play();
} 