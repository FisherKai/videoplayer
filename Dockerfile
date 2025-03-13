# 使用Python 3.9作为基础镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# 复制项目文件
COPY requirements.txt .
COPY app.py .
COPY config.py .
COPY static/ static/
COPY templates/ templates/

# 安装Python依赖
RUN pip install --no-cache-dir -r requirements.txt

# 创建视频目录
RUN mkdir -p /videos

# 设置环境变量
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# 暴露端口
EXPOSE 5000

# 启动命令
CMD ["flask", "run", "--host=0.0.0.0"] 