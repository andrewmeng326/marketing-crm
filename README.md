# 营销人员信息管理系统

> 工程营销数字化管理平台 - 基于 Flask + SQLite 的轻量级 CRM 系统

## 系统简介

本系统是面向工程领域营销人员的客户关系管理（CRM）平台，参照《营销人员信息统计表》设计，涵盖业主单位、设计咨询、施工监理、供应商、运营方等全链条客户管理，支持多用户协作、跟进记录追踪、数据统计可视化等功能。

## 核心功能

| 模块 | 功能说明 |
|------|----------|
| **用户登录** | 支持管理员/营销员双角色，密码加密存储，Session会话管理 |
| **工作台** | 数据统计概览：联系人总数、本月新增、待跟进提醒、客户分布、维系等级、营销人员排名 |
| **联系人管理** | 增删改查，按5大类/子类分组，支持关键词搜索和多条件筛选 |
| **跟进记录** | 记录每次电话/拜访/微信/邮件/会议跟进，支持设置下次跟进提醒 |
| **用户管理** | 管理员专属功能：新增/编辑/删除用户，分配角色，启用/禁用账号 |
| **个人中心** | 修改个人信息、修改密码 |
| **数据导出** | 一键导出 Excel，维系等级自动着色 |

## 客户分类体系

```
├── 业主单位
│   ├── 政府部门（发改委、住建厅/局、交投等）
│   ├── 主管单位
│   ├── 投资方
│   └── 学校
├── 设计及咨询单位
├── 施工单位及监理
├── 供应商
└── 运营方
```

## 维系等级

| 等级 | 说明 |
|------|------|
| **A** | 核心客户，高频维系 |
| **B** | 重要客户，定期维系 |
| **C** | 一般客户，适时维系 |
| **D** | 潜在客户，观望维系 |

## 默认账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | `admin` | `admin123` |
| 营销员 | `sales01` | `sales123` |

> 首次使用请及时修改默认密码！

## 技术栈

- **后端**：Python 3.11 + Flask 3.0
- **数据库**：SQLite（轻量级，无需额外安装）
- **前端**：原生 HTML5 + CSS3 + JavaScript（响应式设计，支持移动端）
- **依赖**：Flask、Werkzeug、openpyxl

## 快速启动（本地开发）

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 初始化数据库

```bash
python init_db.py
```

### 3. 启动应用

```bash
# 方式一：直接启动
python app.py

# 方式二：使用启动脚本（推荐）
bash start.sh init
```

### 4. 访问系统

浏览器打开 `http://localhost:5000`，使用默认账号登录。

---

## ☁️ 云部署指南

### 方案一：Docker 一键部署（推荐）

适用于任何支持 Docker 的云平台（阿里云、腾讯云、AWS 等）。

```bash
# 1. 构建镜像
docker build -t marketing-crm .

# 2. 启动容器（数据持久化）
docker run -d \
  --name crm \
  --restart always \
  -p 5000:5000 \
  -v $(pwd)/data:/app/data \
  -e SECRET_KEY=$(python -c "import secrets; print(secrets.token_hex(32))") \
  marketing-crm

# 3. 初始化数据库
docker exec crm python init_db.py
```

或使用 Docker Compose：

```bash
docker-compose up -d
```

### 方案二：腾讯云轻量应用服务器

1. 购买「腾讯云轻量应用服务器」，镜像选 **宝塔面板**
2. 登录宝塔面板，安装 **Python 项目管理器**
3. 上传项目代码到 `/www/wwwroot/marketing_crm/`
4. 在 Python 项目管理器中添加项目：
   - 项目路径：`/www/wwwroot/marketing_crm`
   - 启动文件：`app.py`
   - 端口：`5000`
5. 在防火墙/安全组中放行 5000 端口
6. 访问 `http://服务器IP:5000`

### 方案三：阿里云 ECS

1. 购买 ECS 实例（CentOS 7+ 或 Ubuntu 20.04+）
2. SSH 登录，安装 Python 3.11+
3. 上传代码，执行：
   ```bash
   pip install -r requirements.txt
   python init_db.py
   bash start.sh
   ```
4. 在安全组中放行 5000 端口

### 方案四：Railway 免费部署

1. 将代码上传到 GitHub 仓库
2. 登录 [railway.app](https://railway.app)，导入仓库
3. Railway 自动检测 Python 项目并部署
4. 设置环境变量 `SECRET_KEY`（随机生成）
5. 自动分配 `xxx.railway.app` 域名

> ⚠️ 免费额度有限，适合测试使用。

### 云部署安全建议

| 项目 | 建议 |
|------|------|
| SECRET_KEY | 务必修改为随机字符串，不要使用默认值 |
| 密码 | 首次登录后立即修改 admin 和 sales 账号密码 |
| HTTPS | 建议配置 Nginx 反向代理 + SSL 证书 |
| 防火墙 | 只开放必要端口（5000），限制来源 IP |
| 备份 | 定期备份 `marketing.db` 数据库文件 |
| 日志 | 监控 `app.log` 异常访问记录 |

## 目录结构

```
marketing_crm/
├── app.py                # Flask 主应用（路由、API、认证）
├── init_db.py            # 数据库初始化脚本（建表+预置数据）
├── requirements.txt      # Python 依赖
├── marketing.db          # SQLite 数据库（运行后自动生成）
├── README.md             # 说明文档
├── static/
│   ├── css/style.css     # 全局样式（响应式）
│   └── js/app.js         # 交互逻辑
└── templates/
    ├── base.html         # 基础布局模板
    ├── login.html        # 登录页面
    ├── dashboard.html    # 工作台/仪表盘
    ├── contacts.html     # 联系人列表
    ├── contact_form.html # 联系人表单（新增/编辑）
    ├── followups.html    # 跟进记录列表
    ├── users.html        # 用户管理（管理员）
    ├── profile.html      # 个人中心
    └── error.html        # 错误页面
```

## 数据库表结构

### users（用户表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| username | TEXT | 用户名（唯一） |
| password_hash | TEXT | 密码哈希 |
| name | TEXT | 姓名 |
| role | TEXT | 角色（admin/staff） |
| phone | TEXT | 手机号 |
| email | TEXT | 邮箱 |
| status | INTEGER | 状态（1启用/0禁用） |
| created_at | TEXT | 创建时间 |
| last_login | TEXT | 最近登录 |

### contacts（联系人表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| category | TEXT | 大类 |
| subcategory | TEXT | 子类 |
| unit_name | TEXT | 单位名称 |
| department | TEXT | 部门 |
| position | TEXT | 职务 |
| name | TEXT | 姓名 |
| phone | TEXT | 联系方式 |
| main_project | TEXT | 主要跟踪项目/目标 |
| office_address | TEXT | 办公地址 |
| delivery_address | TEXT | 快递地址 |
| maintenance_level | TEXT | 维系等级（A/B/C/D） |
| maintenance_person | TEXT | 维系人 |
| remark | TEXT | 备注 |
| status | TEXT | 客户状态（活跃/潜在/沉睡） |
| created_by | INTEGER | 创建人ID |
| created_at | TEXT | 创建时间 |
| updated_at | TEXT | 更新时间 |

### followups（跟进记录表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| contact_id | INTEGER | 关联联系人ID |
| follow_date | TEXT | 跟进日期 |
| follow_type | TEXT | 跟进方式 |
| content | TEXT | 跟进内容 |
| next_follow_date | TEXT | 下次跟进日期 |
| created_by | INTEGER | 记录人ID |
| created_at | TEXT | 创建时间 |

## 快捷键

- `Ctrl/Cmd + K`：快速聚焦搜索框

## 浏览器兼容性

支持 Chrome、Edge、Firefox、Safari 等现代浏览器，适配桌面端和移动端。
