document.addEventListener('DOMContentLoaded', function() {
    // 菜单切换
    const menuItems = document.querySelectorAll('.menu-item');
    const pages = document.querySelectorAll('.page-content');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            
            // 更新菜单激活状态
            menuItems.forEach(mi => mi.classList.remove('active'));
            this.classList.add('active');
            
            // 显示对应页面
            pages.forEach(page => {
                if (page.id === targetPage + '-page') {
                    page.classList.remove('hidden');
                } else {
                    page.classList.add('hidden');
                }
            });
        });
    });

    // 视频播放弹窗
    const videoModal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const modalVideoTitle = document.getElementById('modalVideoTitle');
    const closeModal = document.querySelector('.close-modal');

    // 禁用视频右键菜单和下载
    videoPlayer.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // 禁用视频拖拽
    videoPlayer.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });

    // 禁用视频选择
    videoPlayer.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });

    // 禁用视频复制
    videoPlayer.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    });

    window.playVideo = function(videoPath, videoName) {
        videoPlayer.src = videoPath;
        modalVideoTitle.textContent = videoName;
        videoModal.classList.remove('hidden');
        videoPlayer.play();
    };

    closeModal.addEventListener('click', function() {
        videoModal.classList.add('hidden');
        videoPlayer.pause();
        videoPlayer.src = '';
    });

    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            videoModal.classList.add('hidden');
            videoPlayer.pause();
            videoPlayer.src = '';
        }
    });

    // 禁用键盘快捷键
    document.addEventListener('keydown', function(e) {
        if (!videoModal.classList.contains('hidden')) {
            // 禁用F12
            if (e.keyCode === 123) {
                e.preventDefault();
                return false;
            }
            // 禁用Ctrl+Shift+I
            if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                e.preventDefault();
                return false;
            }
            // 禁用Ctrl+Shift+J
            if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
                e.preventDefault();
                return false;
            }
            // 禁用Ctrl+Shift+C
            if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
                e.preventDefault();
                return false;
            }
            // 禁用Ctrl+U
            if (e.ctrlKey && e.keyCode === 85) {
                e.preventDefault();
                return false;
            }
        }
    });

    // 悬浮播放功能
    let hoverPlayDelay = 2; // 默认延迟时间
    let hoverTimer = null;
    let currentHoverVideo = null;

    // 获取配置的悬浮播放延迟时间
    fetch('/api/config')
        .then(response => response.json())
        .then(config => {
            hoverPlayDelay = config.hover_play_delay || 2;
        });

    // 为所有视频卡片添加悬浮事件
    document.querySelectorAll('.video-card').forEach(card => {
        const video = card.querySelector('video');
        
        card.addEventListener('mouseenter', function(e) {
            // 如果鼠标在播放按钮上，不触发悬浮播放
            if (e.target.closest('.play-button')) {
                return;
            }
            
            if (currentHoverVideo && currentHoverVideo !== video) {
                currentHoverVideo.pause();
                currentHoverVideo.currentTime = 0;
            }
            
            hoverTimer = setTimeout(() => {
                video.play();
                currentHoverVideo = video;
            }, hoverPlayDelay * 1000);
        });

        card.addEventListener('mouseleave', function() {
            if (hoverTimer) {
                clearTimeout(hoverTimer);
                hoverTimer = null;
            }
            video.pause();
            video.currentTime = 0;
            if (currentHoverVideo === video) {
                currentHoverVideo = null;
            }
        });

        // 点击事件处理
        card.addEventListener('click', function(e) {
            // 如果点击的是播放按钮，不触发卡片的点击事件
            if (e.target.closest('.play-button')) {
                e.stopPropagation();
                return;
            }
        });
    });

    // 分类页面的标签筛选
    window.filterByTag = function(tag) {
        fetch(`/api/videos/filter?tag=${encodeURIComponent(tag)}`)
            .then(response => response.json())
            .then(data => {
                const filteredGrid = document.getElementById('filtered-video-grid');
                filteredGrid.innerHTML = data.videos.map(video => `
                    <div class="video-card" onclick="playVideo('${video.path}', '${video.name}')">
                        <div class="video-preview">
                            <video src="${video.path}" preload="metadata"></video>
                            <div class="play-button">▶</div>
                        </div>
                        <div class="video-info">
                            <h3 class="video-title">${video.name}</h3>
                            <div class="video-tags">
                                ${video.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                `).join('');

                // 为新加载的视频卡片添加悬浮事件
                filteredGrid.querySelectorAll('.video-card').forEach(card => {
                    const video = card.querySelector('video');
                    
                    card.addEventListener('mouseenter', function(e) {
                        // 如果鼠标在播放按钮上，不触发悬浮播放
                        if (e.target.closest('.play-button')) {
                            return;
                        }
                        
                        if (currentHoverVideo && currentHoverVideo !== video) {
                            currentHoverVideo.pause();
                            currentHoverVideo.currentTime = 0;
                        }
                        
                        hoverTimer = setTimeout(() => {
                            video.play();
                            currentHoverVideo = video;
                        }, hoverPlayDelay * 1000);
                    });

                    card.addEventListener('mouseleave', function() {
                        if (hoverTimer) {
                            clearTimeout(hoverTimer);
                            hoverTimer = null;
                        }
                        video.pause();
                        video.currentTime = 0;
                        if (currentHoverVideo === video) {
                            currentHoverVideo = null;
                        }
                    });

                    // 点击事件处理
                    card.addEventListener('click', function(e) {
                        // 如果点击的是播放按钮，不触发卡片的点击事件
                        if (e.target.closest('.play-button')) {
                            e.stopPropagation();
                            return;
                        }
                    });
                });
            });
    };
}); 