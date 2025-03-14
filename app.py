from flask import Flask, render_template, send_file, jsonify, request, redirect, url_for
import os
import json
from pathlib import Path

app = Flask(__name__)

# 默认配置
DEFAULT_CONFIG = {
    'hover_play_delay': 2,
    'video_paths': ['videos'],  # 默认视频目录
    'video_extensions': ['.mp4', '.mkv', '.avi', '.mov'],  # 默认支持的视频格式
    'local_sources': [
        {
            'name': '本地视频',
            'path': 'videos',
            'enabled': True
        }
    ],
    'ftp_sources': []
}

# 配置文件路径
CONFIG_FILE = 'config.json'

def load_config():
    try:
        if os.path.exists(CONFIG_FILE):
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        return DEFAULT_CONFIG
    except Exception as e:
        print(f"加载配置文件失败: {str(e)}")
        return DEFAULT_CONFIG

def save_config(config):
    try:
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(config, f, ensure_ascii=False, indent=4)
        return True
    except Exception as e:
        print(f"保存配置文件失败: {str(e)}")
        return False

def get_video_files():
    """获取所有配置的视频目录中的视频文件"""
    videos = []
    config = load_config()
    
    # 确保 video_paths 存在
    if 'video_paths' not in config or not config['video_paths']:
        print("警告: 配置中没有视频路径")
        return videos
        
    # 确保 video_extensions 存在
    if 'video_extensions' not in config or not config['video_extensions']:
        print("警告: 配置中没有视频扩展名")
        return videos
    
    print(f"视频路径: {config['video_paths']}")
    print(f"视频扩展名: {config['video_extensions']}")
    
    for video_dir in config['video_paths']:
        # 确保目录存在
        if not os.path.exists(video_dir):
            print(f"警告: 视频目录不存在: {video_dir}")
            # 尝试创建目录
            try:
                os.makedirs(video_dir, exist_ok=True)
                print(f"已创建视频目录: {video_dir}")
            except Exception as e:
                print(f"创建目录失败: {str(e)}")
            continue
            
        # 获取目录中的所有文件
        try:
            files = os.listdir(video_dir)
            print(f"目录 {video_dir} 中的文件数量: {len(files)}")
            
            for file in files:
                file_path = os.path.join(video_dir, file)
                file_ext = os.path.splitext(file)[1].lower()
                
                if os.path.isfile(file_path) and file_ext in set(config['video_extensions']):
                    # 从文件名中提取标签
                    name_without_ext = os.path.splitext(file)[0]
                    tags = [tag.strip() for tag in name_without_ext.split('_') if tag.strip()]
                    
                    video_info = {
                        'name': file,
                        'path': f'/video/{os.path.basename(video_dir)}/{file}',
                        'directory': os.path.basename(video_dir),
                        'tags': tags
                    }
                    
                    print(f"找到视频: {video_info}")
                    videos.append(video_info)
        except Exception as e:
            print(f"读取目录 {video_dir} 时出错: {str(e)}")
    
    print(f"总共找到 {len(videos)} 个视频文件")
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
    return render_template('config.html')

@app.route('/api/config', methods=['GET', 'POST'])
def handle_config():
    if request.method == 'GET':
        return jsonify(load_config())
    else:
        config = request.json
        if save_config(config):
            return jsonify({'success': True})
        return jsonify({'success': False, 'message': '保存配置失败'})

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
    
    if 'video_paths' not in config or not config['video_paths']:
        return "配置中没有视频路径", 404
    
    # 查找视频文件所在的目录
    for video_dir in config['video_paths']:
        try:
            # 检查目录名是否匹配
            if os.path.basename(video_dir) == directory:
                file_path = os.path.join(video_dir, filename)
                
                # 检查文件是否存在
                if os.path.exists(file_path) and os.path.isfile(file_path):
                    print(f"提供视频文件: {file_path}")
                    return send_file(file_path)
                else:
                    print(f"视频文件不存在: {file_path}")
        except Exception as e:
            print(f"处理视频请求时出错: {str(e)}")
    
    return "视频未找到", 404

if __name__ == '__main__':
    app.run(debug=True) 