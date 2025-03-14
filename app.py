from flask import Flask, render_template, send_file, jsonify, request, redirect, url_for
import os
import json
from pathlib import Path
from config import VIDEO_PATHS, VIDEO_EXTENSIONS

app = Flask(__name__)

# 配置文件路径
CONFIG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.json')

def load_config():
    """加载配置文件"""
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {
        'video_paths': VIDEO_PATHS,
        'video_extensions': list(VIDEO_EXTENSIONS),
        'hover_play_delay': 2  # 默认2秒
    }

def save_config(config):
    """保存配置文件"""
    with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
        json.dump(config, f, ensure_ascii=False, indent=4)

def get_video_files():
    """获取所有配置的视频目录中的视频文件"""
    videos = []
    config = load_config()
    
    for video_dir in config['video_paths']:
        # 确保目录存在
        if not os.path.exists(video_dir):
            continue
            
        # 获取目录中的所有文件
        for file in os.listdir(video_dir):
            file_path = os.path.join(video_dir, file)
            if os.path.isfile(file_path) and Path(file).suffix.lower() in set(config['video_extensions']):
                # 从文件名中提取标签
                name_without_ext = os.path.splitext(file)[0]
                tags = [tag.strip() for tag in name_without_ext.split('_') if tag.strip()]
                
                videos.append({
                    'name': file,
                    'path': f'/video/{os.path.basename(video_dir)}/{file}',
                    'directory': os.path.basename(video_dir),
                    'tags': tags
                })
    
    return videos

def get_all_tags():
    """获取所有视频的标签"""
    videos = get_video_files()
    tags = set()
    for video in videos:
        tags.update(video['tags'])
    return sorted(list(tags))

@app.route('/')
def index():
    try:
        # 获取所有视频文件
        videos = get_video_files()
        
        # 按目录分组视频
        video_groups = {}
        for video in videos:
            directory = video.get('directory', '未分类')
            if directory not in video_groups:
                video_groups[directory] = []
            video_groups[directory].append(video)
        
        # 获取所有标签
        all_tags = set()
        for video in videos:
            all_tags.update(video.get('tags', []))
        
        return render_template('index.html', 
                             video_groups=video_groups,
                             all_tags=sorted(all_tags))
    except Exception as e:
        print(f"Error loading index page: {str(e)}")
        # 发生错误时返回空数据
        return render_template('index.html', 
                             video_groups={},
                             all_tags=[])

@app.route('/config')
def config_page():
    """配置页面"""
    config = load_config()
    return render_template('config.html', config=config)

@app.route('/api/config', methods=['GET'])
def get_config():
    """获取配置API"""
    return jsonify(load_config())

@app.route('/api/config', methods=['POST'])
def update_config():
    """更新配置API"""
    config = request.json
    save_config(config)
    return jsonify({'status': 'success'})

@app.route('/api/videos/filter')
def filter_videos():
    """按标签筛选视频"""
    tag = request.args.get('tag', '').strip()
    if not tag:
        return jsonify({'videos': []})
    
    videos = get_video_files()
    filtered_videos = [video for video in videos if tag in video['tags']]
    return jsonify({'videos': filtered_videos})

@app.route('/video/<directory>/<filename>')
def serve_video(directory, filename):
    """提供视频文件"""
    config = load_config()
    # 查找视频文件所在的目录
    for video_dir in config['video_paths']:
        if os.path.basename(video_dir) == directory:
            return send_file(os.path.join(video_dir, filename))
    return "Video not found", 404

if __name__ == '__main__':
    app.run(debug=True) 