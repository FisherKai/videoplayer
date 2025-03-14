document.addEventListener('DOMContentLoaded', function() {
    // 菜单切换
    const menuItems = document.querySelectorAll('.sidebar-menu li a');
    
    // 根据当前hash显示对应页面
    function showPageFromHash() {
        // 只在首页处理hash
        if (window.location.pathname === '/') {
            const hash = window.location.hash.slice(1) || 'home';
            
            // 显示对应页面内容
            document.querySelectorAll('.page-content').forEach(content => {
                if (content.id === hash) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
            
            // 更新菜单激活状态
            menuItems.forEach(item => {
                const itemHref = item.getAttribute('href');
                const itemHash = itemHref.includes('#') ? '#' + itemHref.split('#')[1] : '';
                
                if (hash === 'home' && itemHref === '/') {
                    // 首页特殊处理
                    item.parentElement.classList.add('active');
                } else if (itemHash && itemHash === window.location.hash) {
                    // 分类和推荐页面
                    item.parentElement.classList.add('active');
                } else {
                    item.parentElement.classList.remove('active');
                }
            });
        }
    }
    
    // 监听hash变化
    window.addEventListener('hashchange', showPageFromHash);
    
    // 初始化显示
    if (window.location.pathname === '/') {
        showPageFromHash();
    }
    
    // 处理菜单点击
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 如果是完整URL（比如设置页面），让它正常跳转
            if (href.indexOf('http') === 0 || (href.indexOf('/') === 0 && !href.includes('#'))) {
                return;
            }
            
            // 否则阻止默认行为，手动处理hash
            e.preventDefault();
            const hash = href.split('#')[1] || 'home';
            window.location.hash = hash;
        });
    });

    // 视频播放模态框
    const videoModal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const modalVideoTitle = document.getElementById('modalVideoTitle');
    const closeButton = document.querySelector('.close-button');

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

    // 视频播放功能
    function playVideo(videoPath, videoName) {
        videoPlayer.src = videoPath;
        modalVideoTitle.textContent = videoName;
        videoModal.style.display = 'flex';
        videoPlayer.play();
    }

    // 关闭模态框
    function closeVideoModal() {
        videoModal.style.display = 'none';
        videoPlayer.pause();
        videoPlayer.src = '';
    }

    // 关闭按钮点击事件
    closeButton.addEventListener('click', closeVideoModal);

    // 点击模态框外部关闭
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });

    // 禁用键盘快捷键
    document.addEventListener('keydown', function(e) {
        if (videoModal.style.display === 'flex') {
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
            // ESC键关闭模态框
            if (e.keyCode === 27) {
                closeVideoModal();
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

    // 视频卡片点击事件
    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', function() {
            const videoPath = this.dataset.videoPath;
            const videoName = this.querySelector('h4').textContent;
            playVideo(videoPath, videoName);
        });
    });

    // 标签过滤
    document.querySelectorAll('.tag-button').forEach(button => {
        button.addEventListener('click', function() {
            const tag = this.dataset.tag;
            filterVideosByTag(tag);
        });
    });

    // 标签过滤功能
    function filterVideosByTag(tag) {
        fetch(`/api/videos/filter?tag=${encodeURIComponent(tag)}`)
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('category-videos');
                container.innerHTML = '';
                
                data.videos.forEach(video => {
                    const card = createVideoCard(video);
                    container.appendChild(card);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // 创建视频卡片
    function createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.dataset.videoPath = video.path;
        
        card.innerHTML = `
            <div class="video-thumbnail">
                <video src="${video.path}" preload="metadata">
                <img src="/static/images/placeholder.jpg" alt="${video.name}">
                <div class="play-button">▶</div>
            </div>
            <div class="video-info">
                <h4>${video.name}</h4>
                <div class="video-tags">
                    ${video.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        // 为新创建的卡片添加点击事件
        card.addEventListener('click', function() {
            playVideo(video.path, video.name);
        });
        
        return card;
    }
}); 