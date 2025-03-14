document.addEventListener('DOMContentLoaded', function() {
    // 获取所有按钮和表单元素
    const addLocalBtn = document.getElementById('addLocalBtn');
    const addFtpBtn = document.getElementById('addFtpBtn');
    const saveConfigBtn = document.getElementById('saveConfigBtn');
    const localSourcesContainer = document.getElementById('localSources');
    const ftpSourcesContainer = document.getElementById('ftpSources');
    const hoverDelayInput = document.getElementById('hoverDelay');
    const videoExtensionsContainer = document.getElementById('videoExtensions');
    const newExtensionInput = document.getElementById('newExtension');
    const addExtensionBtn = document.getElementById('addExtension');
    const videoPathsContainer = document.getElementById('videoPaths');
    const newPathInput = document.getElementById('newPath');
    const addPathBtn = document.getElementById('addPath');

    // 添加视频格式
    function addVideoExtension(extension) {
        // 确保扩展名有效
        if (!extension || typeof extension !== 'string') {
            console.warn('尝试添加无效的视频格式:', extension);
            return;
        }
        
        // 规范化扩展名
        let cleanExtension = extension.trim();
        if (!cleanExtension.startsWith('.')) {
            cleanExtension = '.' + cleanExtension;
        }
        
        // 检查是否已存在
        const existingExtensions = Array.from(videoExtensionsContainer.children).map(
            item => item.textContent.replace('×', '').trim()
        );
        if (existingExtensions.includes(cleanExtension)) {
            console.warn('视频格式已存在:', cleanExtension);
            return;
        }
        
        const extensionDiv = document.createElement('div');
        extensionDiv.className = 'tag-item';
        extensionDiv.innerHTML = `
            ${cleanExtension}
            <i class="fas fa-times remove-tag"></i>
        `;
        videoExtensionsContainer.appendChild(extensionDiv);

        // 添加删除事件
        extensionDiv.querySelector('.remove-tag').addEventListener('click', function() {
            extensionDiv.remove();
        });
    }

    // 处理添加视频格式按钮点击
    addExtensionBtn.addEventListener('click', function() {
        const extension = newExtensionInput.value.trim();
        if (extension) {
            addVideoExtension(extension);
            newExtensionInput.value = '';
        }
    });

    // 处理视频格式输入框回车事件
    newExtensionInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addExtensionBtn.click();
        }
    });

    // 添加视频路径
    function addVideoPath(path) {
        // 确保路径有效
        if (!path || typeof path !== 'string') {
            console.warn('尝试添加无效的视频路径:', path);
            return;
        }
        
        // 规范化路径
        const cleanPath = path.trim();
        if (cleanPath === '') {
            console.warn('视频路径不能为空');
            return;
        }
        
        // 检查是否已存在
        const existingPaths = Array.from(videoPathsContainer.children).map(
            item => item.textContent.replace(/[×\s]/g, '').trim()
        );
        if (existingPaths.includes(cleanPath)) {
            console.warn('视频路径已存在:', cleanPath);
            return;
        }
        
        const pathDiv = document.createElement('div');
        pathDiv.className = 'tag-item';
        pathDiv.innerHTML = `
            ${cleanPath}
            <i class="fas fa-times remove-tag"></i>
        `;
        videoPathsContainer.appendChild(pathDiv);

        // 添加删除事件
        pathDiv.querySelector('.remove-tag').addEventListener('click', function() {
            pathDiv.remove();
        });
    }

    // 处理添加视频路径按钮点击
    addPathBtn.addEventListener('click', function() {
        const path = newPathInput.value.trim();
        if (path) {
            addVideoPath(path);
            newPathInput.value = '';
        }
    });

    // 处理视频路径输入框回车事件
    newPathInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addPathBtn.click();
        }
    });

    // 添加本地视频源
    addLocalBtn.addEventListener('click', function() {
        const sourceDiv = document.createElement('div');
        sourceDiv.className = 'source-item';
        sourceDiv.innerHTML = `
            <div class="source-header">
                <h3>本地视频源</h3>
                <button type="button" class="remove-source"><i class="fas fa-trash"></i></button>
            </div>
            <div class="form-group">
                <label>名称：</label>
                <input type="text" name="local_name[]" required>
            </div>
            <div class="form-group">
                <label>路径：</label>
                <input type="text" name="local_path[]" required>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" name="local_enabled[]" checked>
                    启用
                </label>
            </div>
        `;
        localSourcesContainer.appendChild(sourceDiv);
    });

    // 添加FTP视频源
    addFtpBtn.addEventListener('click', function() {
        const sourceDiv = document.createElement('div');
        sourceDiv.className = 'source-item';
        sourceDiv.innerHTML = `
            <div class="source-header">
                <h3>FTP视频源</h3>
                <button type="button" class="remove-source"><i class="fas fa-trash"></i></button>
            </div>
            <div class="form-group">
                <label>名称：</label>
                <input type="text" name="ftp_name[]" required>
            </div>
            <div class="form-group">
                <label>主机：</label>
                <input type="text" name="ftp_host[]" required>
            </div>
            <div class="form-group">
                <label>端口：</label>
                <input type="number" name="ftp_port[]" value="21" required>
            </div>
            <div class="form-group">
                <label>用户名：</label>
                <input type="text" name="ftp_username[]" required>
            </div>
            <div class="form-group">
                <label>密码：</label>
                <input type="password" name="ftp_password[]" required>
            </div>
            <div class="form-group">
                <label>基础路径：</label>
                <input type="text" name="ftp_base_path[]" required>
            </div>
            <div class="form-group">
                <label>超时时间（秒）：</label>
                <input type="number" name="ftp_timeout[]" value="30" required>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" name="ftp_enabled[]" checked>
                    启用
                </label>
            </div>
        `;
        ftpSourcesContainer.appendChild(sourceDiv);
    });

    // 删除视频源
    document.addEventListener('click', function(e) {
        if (e.target.closest('.remove-source')) {
            const sourceItem = e.target.closest('.source-item');
            if (sourceItem) {
                sourceItem.remove();
            }
        }
    });

    // 保存配置
    saveConfigBtn.addEventListener('click', function() {
        const config = {
            hover_play_delay: parseInt(hoverDelayInput.value) || 2,
            video_paths: [],
            video_extensions: [],
            local_sources: [],
            ftp_sources: []
        };

        // 收集视频路径
        Array.from(videoPathsContainer.children).forEach(item => {
            // 获取文本内容并移除删除按钮的文本
            const pathText = item.textContent.replace(/[×\s]/g, '').trim();
            if (pathText) {
                config.video_paths.push(pathText);
            }
        });

        // 如果没有手动添加的路径，则使用启用的本地视频源路径
        if (config.video_paths.length === 0) {
            // 先收集本地视频源
            document.querySelectorAll('#localSources .source-item').forEach(item => {
                const name = item.querySelector('input[name="local_name[]"]').value;
                const path = item.querySelector('input[name="local_path[]"]').value;
                const enabled = item.querySelector('input[name="local_enabled[]"]').checked;
                
                config.local_sources.push({
                    name: name,
                    path: path,
                    enabled: enabled
                });
                
                // 如果启用，添加到视频路径
                if (enabled && path) {
                    config.video_paths.push(path);
                }
            });
        } else {
            // 收集本地视频源配置
            document.querySelectorAll('#localSources .source-item').forEach(item => {
                config.local_sources.push({
                    name: item.querySelector('input[name="local_name[]"]').value,
                    path: item.querySelector('input[name="local_path[]"]').value,
                    enabled: item.querySelector('input[name="local_enabled[]"]').checked
                });
            });
        }

        // 收集视频格式
        Array.from(videoExtensionsContainer.children).forEach(item => {
            // 获取文本内容并移除删除按钮的文本
            const extText = item.textContent.replace(/[×\s]/g, '').trim();
            if (extText) {
                config.video_extensions.push(extText);
            }
        });

        // 收集FTP视频源配置
        document.querySelectorAll('#ftpSources .source-item').forEach(item => {
            config.ftp_sources.push({
                name: item.querySelector('input[name="ftp_name[]"]').value,
                host: item.querySelector('input[name="ftp_host[]"]').value,
                port: parseInt(item.querySelector('input[name="ftp_port[]"]').value),
                username: item.querySelector('input[name="ftp_username[]"]').value,
                password: item.querySelector('input[name="ftp_password[]"]').value,
                base_path: item.querySelector('input[name="ftp_base_path[]"]').value,
                timeout: parseInt(item.querySelector('input[name="ftp_timeout[]"]').value),
                enabled: item.querySelector('input[name="ftp_enabled[]"]').checked
            });
        });

        // 发送配置到服务器
        fetch('/api/config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(config)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('配置保存成功！');
            } else {
                alert('配置保存失败：' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('配置保存失败，请检查网络连接');
        });
    });

    // 加载现有配置
    fetch('/api/config')
        .then(response => response.json())
        .then(config => {
            console.log('加载的配置:', JSON.stringify(config)); // 调试用，完整输出配置
            
            // 设置悬浮播放延迟
            hoverDelayInput.value = config.hover_play_delay || 2;

            // 清空现有容器
            videoPathsContainer.innerHTML = '';
            videoExtensionsContainer.innerHTML = '';
            localSourcesContainer.innerHTML = '';
            ftpSourcesContainer.innerHTML = '';

            // 加载视频路径
            if (config.video_paths && Array.isArray(config.video_paths)) {
                config.video_paths.forEach(path => {
                    if (path && typeof path === 'string') {
                        console.log('添加视频路径:', path); // 调试用
                        addVideoPath(path);
                    }
                });
            } else {
                console.warn('配置中没有有效的视频路径');
            }

            // 加载视频格式
            if (config.video_extensions && Array.isArray(config.video_extensions)) {
                config.video_extensions.forEach(extension => {
                    if (extension && typeof extension === 'string') {
                        console.log('添加视频格式:', extension); // 调试用
                        addVideoExtension(extension);
                    }
                });
            } else {
                console.warn('配置中没有有效的视频格式');
            }

            // 加载本地视频源
            if (config.local_sources && Array.isArray(config.local_sources)) {
                config.local_sources.forEach(source => {
                    if (!source) return;
                    
                    console.log('添加本地视频源:', source); // 调试用
                    
                    const sourceDiv = document.createElement('div');
                    sourceDiv.className = 'source-item';
                    sourceDiv.innerHTML = `
                        <div class="source-header">
                            <h3>本地视频源</h3>
                            <button type="button" class="remove-source"><i class="fas fa-trash"></i></button>
                        </div>
                        <div class="form-group">
                            <label>名称：</label>
                            <input type="text" name="local_name[]" value="${source.name || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>路径：</label>
                            <input type="text" name="local_path[]" value="${source.path || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" name="local_enabled[]" ${source.enabled ? 'checked' : ''}>
                                启用
                            </label>
                        </div>
                    `;
                    localSourcesContainer.appendChild(sourceDiv);
                });
            }

            // 加载FTP视频源
            if (config.ftp_sources) {
                config.ftp_sources.forEach(source => {
                    const sourceDiv = document.createElement('div');
                    sourceDiv.className = 'source-item';
                    sourceDiv.innerHTML = `
                        <div class="source-header">
                            <h3>FTP视频源</h3>
                            <button type="button" class="remove-source"><i class="fas fa-trash"></i></button>
                        </div>
                        <div class="form-group">
                            <label>名称：</label>
                            <input type="text" name="ftp_name[]" value="${source.name}" required>
                        </div>
                        <div class="form-group">
                            <label>主机：</label>
                            <input type="text" name="ftp_host[]" value="${source.host}" required>
                        </div>
                        <div class="form-group">
                            <label>端口：</label>
                            <input type="number" name="ftp_port[]" value="${source.port}" required>
                        </div>
                        <div class="form-group">
                            <label>用户名：</label>
                            <input type="text" name="ftp_username[]" value="${source.username}" required>
                        </div>
                        <div class="form-group">
                            <label>密码：</label>
                            <input type="password" name="ftp_password[]" value="${source.password}" required>
                        </div>
                        <div class="form-group">
                            <label>基础路径：</label>
                            <input type="text" name="ftp_base_path[]" value="${source.base_path}" required>
                        </div>
                        <div class="form-group">
                            <label>超时时间（秒）：</label>
                            <input type="number" name="ftp_timeout[]" value="${source.timeout}" required>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" name="ftp_enabled[]" ${source.enabled ? 'checked' : ''}>
                                启用
                            </label>
                        </div>
                    `;
                    ftpSourcesContainer.appendChild(sourceDiv);
                });
            }
        })
        .catch(error => console.error('Error:', error));
}); 