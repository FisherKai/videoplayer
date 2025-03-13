document.addEventListener('DOMContentLoaded', function() {
    const videoPaths = document.getElementById('videoPaths');
    const videoExtensions = document.getElementById('videoExtensions');
    const addPathBtn = document.getElementById('addPath');
    const addExtensionBtn = document.getElementById('addExtension');
    const saveConfigBtn = document.getElementById('saveConfig');
    const refreshListBtn = document.getElementById('refreshList');
    const hoverPlayDelay = document.getElementById('hoverPlayDelay');

    // 添加视频目录
    addPathBtn.addEventListener('click', function() {
        const pathItem = document.createElement('div');
        pathItem.className = 'path-item';
        pathItem.innerHTML = `
            <input type="text" class="path-input" placeholder="输入视频目录路径">
            <button class="remove-path">删除</button>
        `;
        videoPaths.appendChild(pathItem);
    });

    // 添加视频格式
    addExtensionBtn.addEventListener('click', function() {
        const extensionItem = document.createElement('div');
        extensionItem.className = 'extension-item';
        extensionItem.innerHTML = `
            <input type="text" class="extension-input" placeholder="输入视频格式（如：mp4）">
            <button class="remove-extension">删除</button>
        `;
        videoExtensions.appendChild(extensionItem);
    });

    // 删除视频目录
    videoPaths.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-path')) {
            e.target.parentElement.remove();
        }
    });

    // 删除视频格式
    videoExtensions.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-extension')) {
            e.target.parentElement.remove();
        }
    });

    // 保存配置
    saveConfigBtn.addEventListener('click', function() {
        const config = {
            video_paths: Array.from(videoPaths.querySelectorAll('.path-input'))
                .map(input => input.value.trim())
                .filter(value => value),
            video_extensions: Array.from(videoExtensions.querySelectorAll('.extension-input'))
                .map(input => input.value.trim())
                .filter(value => value),
            hover_play_delay: parseFloat(hoverPlayDelay.value) || 2
        };

        fetch('/api/config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(config)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('配置保存成功！');
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('保存配置失败，请重试！');
        });
    });

    // 刷新列表
    refreshListBtn.addEventListener('click', function() {
        window.location.reload();
    });
}); 