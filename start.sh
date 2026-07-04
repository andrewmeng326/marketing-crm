#!/bin/bash
# ========================================
# 营销CRM系统 - 生产环境启动脚本
# ========================================
# 用法：
#   首次运行: bash start.sh init     （初始化数据库 + 启动）
#   日常启动: bash start.sh           （直接启动）
#   停止服务: bash start.sh stop
#   查看状态: bash start.sh status
# ========================================

set -e

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$APP_DIR/app.pid"
LOG_FILE="$APP_DIR/app.log"
PORT=${PORT:-5000}

# 加载 .env 文件（如果存在）
if [ -f "$APP_DIR/.env" ]; then
    export $(grep -v '^#' "$APP_DIR/.env" | xargs)
fi

stop_server() {
    echo "正在停止服务..."
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            kill "$PID"
            sleep 2
            if kill -0 "$PID" 2>/dev/null; then
                kill -9 "$PID"
            fi
            echo "服务已停止 (PID: $PID)"
        fi
        rm -f "$PID_FILE"
    else
        # 尝试通过端口查找并停止
        lsof -ti:$PORT 2>/dev/null | xargs -r kill 2>/dev/null
        echo "已清理端口 $PORT"
    fi
}

start_server() {
    cd "$APP_DIR"

    # 检查数据库是否存在
    if [ ! -f "$APP_DIR/marketing.db" ] && [ -z "$DATABASE_PATH" ]; then
        echo "数据库不存在，正在初始化..."
        python3 init_db.py
    fi

    # 优先使用 gunicorn（生产级），否则使用 Flask 内置服务器
    if command -v gunicorn &> /dev/null; then
        echo "使用 gunicorn 启动（生产模式）..."
        nohup gunicorn app:app \
            --bind 0.0.0.0:$PORT \
            --workers 2 \
            --timeout 120 \
            --access-logfile "$LOG_FILE" \
            --error-logfile "$LOG_FILE" \
            --pid "$PID_FILE" \
            --daemon
    else
        echo "使用 Flask 内置服务器启动（开发模式）..."
        echo "提示：生产环境建议安装 gunicorn: pip install gunicorn"
        nohup python3 app.py > "$LOG_FILE" 2>&1 &
        echo $! > "$PID_FILE"
    fi

    sleep 2
    echo "服务已启动，端口: $PORT"
    echo "日志文件: $LOG_FILE"
}

status_server() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            echo "服务运行中 (PID: $PID, 端口: $PORT)"
            return 0
        fi
    fi
    echo "服务未运行"
    return 1
}

case "${1:-start}" in
    init)
        echo "初始化数据库..."
        cd "$APP_DIR"
        python3 init_db.py
        echo "数据库初始化完成"
        start_server
        ;;
    stop)
        stop_server
        ;;
    status)
        status_server
        ;;
    restart)
        stop_server
        sleep 1
        start_server
        ;;
    start)
        start_server
        ;;
    *)
        echo "用法: bash start.sh {start|init|stop|restart|status}"
        exit 1
        ;;
esac
