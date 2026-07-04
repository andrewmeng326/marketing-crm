#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据库初始化脚本 - 导入预置分类数据
运行: python3 init_db.py
"""

import sqlite3
import os
from werkzeug.security import generate_password_hash
from app import app, init_db, CATEGORIES

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'marketing.db')


def seed_data():
    """导入预置数据"""
    init_db()
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row

    # 预置的单位数据（来自Excel模板）
    seed_contacts = [
        # 业主单位 - 政府部门
        ('业主单位', '政府部门', '湖北省发改委', '', '', '', '', '', '', '', 'A', '', '省级发改主管部门'),
        ('业主单位', '政府部门', '武汉市发改委', '', '', '', '', '', '', '', 'A', '', '市级发改主管部门'),
        ('业主单位', '政府部门', '湖北省住建厅', '', '', '', '', '', '', '', 'A', '', '省级住建主管部门'),
        ('业主单位', '政府部门', '武汉市住建局', '', '', '', '', '', '', '', 'A', '', '市级住建主管部门'),
        ('业主单位', '政府部门', '湖北省交投', '', '', '', '', '', '', '', 'A', '', '省级交通投资平台'),
        ('业主单位', '政府部门', '武汉市交投', '', '', '', '', '', '', '', 'A', '', '市级交通投资平台'),
    ]

    # 检查是否已有数据
    existing = db.execute('SELECT COUNT(*) as c FROM contacts').fetchone()['c']
    if existing > 0:
        print(f'[提示] 数据库已有 {existing} 条联系人数据，跳过预置数据导入')
    else:
        admin_id = db.execute('SELECT id FROM users WHERE role="admin" LIMIT 1').fetchone()
        owner = admin_id['id'] if admin_id else 1
        for c in seed_contacts:
            db.execute('''INSERT INTO contacts
                (category, subcategory, unit_name, department, position, name, phone,
                 main_project, office_address, delivery_address, maintenance_level,
                 maintenance_person, remark, status, owner_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '活跃', ?)''', (*c, owner))
        db.commit()
        print(f'[成功] 已导入 {len(seed_contacts)} 条预置联系人数据')

    # 统计
    total_users = db.execute('SELECT COUNT(*) as c FROM users').fetchone()['c']
    total_contacts = db.execute('SELECT COUNT(*) as c FROM contacts').fetchone()['c']
    print(f'\n数据库统计:')
    print(f'  用户数: {total_users}')
    print(f'  联系人数: {total_contacts}')
    print(f'\n默认账号:')
    print(f'  管理员: admin / admin123')
    print(f'  营销员: sales01 / sales123')
    db.close()


if __name__ == '__main__':
    seed_data()
