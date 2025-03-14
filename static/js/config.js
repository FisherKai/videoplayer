document.addEventListener('DOMContentLoaded', function() {
    // 获取所有按钮和表单元素
    const addLocalBtn = document.getElementById('addLocalBtn');
    const addFtpBtn = document.getElementById('addFtpBtn');
    const saveConfigBtn = document.getElementById('saveConfigBtn');
    const localSourcesContainer = document.getElementById('localSources');
    const ftpSourcesContainer = document.getElementById('ftpSources');
    const hoverDelayInput = document.getElementById('hoverDelay');

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
            local_sources: [],
            ftp_sources: []
        };

        // 收集本地视频源配置
        document.querySelectorAll('#localSources .source-item').forEach(item => {
            config.local_sources.push({
                name: item.querySelector('input[name="local_name[]"]').value,
                path: item.querySelector('input[name="local_path[]"]').value,
                enabled: item.querySelector('input[name="local_enabled[]"]').checked
            });
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
            // 设置悬浮播放延迟
            hoverDelayInput.value = config.hover_play_delay || 2;

            // 加载本地视频源
            if (config.local_sources) {
                config.local_sources.forEach(source => {
                    const sourceDiv = document.createElement('div');
                    sourceDiv.className = 'source-item';
                    sourceDiv.innerHTML = `
                        <div class="source-header">
                            <h3>本地视频源</h3>
                            <button type="button" class="remove-source"><i class="fas fa-trash"></i></button>
                        </div>
                        <div class="form-group">
                            <label>名称：</label>
                            <input type="text" name="local_name[]" value="${source.name}" required>
                        </div>
                        <div class="form-group">
                            <label>路径：</label>
                            <input type="text" name="local_path[]" value="${source.path}" required>
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