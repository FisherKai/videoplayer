import os

# 视频目录配置
VIDEO_PATHS = [
    '/videos',  # Docker容器中的视频目录
]

# 支持的视频格式
VIDEO_EXTENSIONS = {
    '.mp4',
    '.avi',
    '.mkv',
    '.mov',
    '.wmv',
    '.flv',
    '.webm'
} 