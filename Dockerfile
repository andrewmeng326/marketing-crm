# ========================================
# 营销CRM系统 - Docker 镜像
# ========================================
# 构建：docker build -t marketing-crm .
# 运行：docker run -d -p 5000:5000 --name crm marketing-crm
# 持久化数据：
#   docker run -d -p 5000:5000 -v $(pwd)/data:/app/data --name crm marketing-crm

FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# 复制源代码
COPY . .

# 创建数据目录
RUN mkdir -p /app/data

# 暴露端口
EXPOSE 5000

# 环境变量
ENV DATABASE_PATH=/app/data/marketing.db
ENV PORT=5000
ENV FLASK_DEBUG=false

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/')" || exit 1

# 启动命令（gunicorn 生产级 WSGI 服务器）
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "120", "--access-logfile", "-"]
