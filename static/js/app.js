/* ============================================================
   营销人员信息管理系统 - 交互逻辑
   ============================================================ */

// ---------- 侧边栏切换（移动端） ----------
function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
    }
}

// 关闭侧边栏（点击导航项时，移动端自动收起）
document.addEventListener('DOMContentLoaded', function() {
    var navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(function(item) {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                setTimeout(function() {
                    var sidebar = document.getElementById('sidebar');
                    var overlay = document.getElementById('sidebarOverlay');
                    if (sidebar) sidebar.classList.remove('show');
                    if (overlay) overlay.classList.remove('show');
                }, 100);
            }
        });
    });
});

// ---------- 模态框 ----------
function openModal(id) {
    var modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(id) {
    var modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// 点击遮罩关闭模态框
document.addEventListener('click', function(e) {
    if (e.target.classList && e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('show');
        document.body.style.overflow = '';
    }
});

// ESC关闭模态框
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        var modals = document.querySelectorAll('.modal-overlay.show');
        modals.forEach(function(m) {
            m.classList.remove('show');
        });
        document.body.style.overflow = '';
    }
});

// ---------- 确认删除 ----------
function confirmDelete(message) {
    return confirm(message || '确定要删除吗？此操作不可撤销。');
}

// ---------- 自动关闭消息提示 ----------
document.addEventListener('DOMContentLoaded', function() {
    var flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(function(msg) {
        setTimeout(function() {
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(-10px)';
            msg.style.transition = 'all .3s ease';
            setTimeout(function() {
                msg.remove();
            }, 300);
        }, 4000);
    });
});

// ---------- 表单验证 ----------
document.addEventListener('DOMContentLoaded', function() {
    // 密码确认验证
    var profileForm = document.querySelector('.profile-page form');
    if (profileForm) {
        var actionInput = profileForm.querySelector('input[name="action"]');
        if (actionInput && actionInput.value === 'change_password') {
            profileForm.addEventListener('submit', function(e) {
                var newPwd = profileForm.querySelector('input[name="new_password"]').value;
                var confirmPwd = profileForm.querySelector('input[name="confirm_password"]').value;
                if (newPwd !== confirmPwd) {
                    e.preventDefault();
                    alert('两次输入的新密码不一致');
                    return false;
                }
                if (newPwd.length < 6) {
                    e.preventDefault();
                    alert('新密码长度不能少于6位');
                    return false;
                }
            });
        }
    }

    // 联系人表单验证
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            var unitName = contactForm.querySelector('input[name="unit_name"]').value.trim();
            var category = contactForm.querySelector('select[name="category"]').value;
            if (!unitName) {
                e.preventDefault();
                alert('请填写单位名称');
                return false;
            }
            if (!category) {
                e.preventDefault();
                alert('请选择大类');
                return false;
            }
        });
    }
});

// ---------- 表格行点击高亮 ----------
document.addEventListener('DOMContentLoaded', function() {
    var rows = document.querySelectorAll('.data-table tbody tr');
    rows.forEach(function(row) {
        row.addEventListener('click', function(e) {
            // 如果点击的是按钮或表单，不处理
            if (e.target.closest('button') || e.target.closest('a') || e.target.closest('form')) {
                return;
            }
        });
    });
});

// ---------- 数字滚动动画 ----------
document.addEventListener('DOMContentLoaded', function() {
    var statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(function(el) {
        var target = parseInt(el.textContent) || 0;
        if (target === 0) return;
        var current = 0;
        var step = Math.max(1, Math.ceil(target / 30));
        var timer = setInterval(function() {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = current;
        }, 30);
    });
});

// ---------- 防抖搜索（可选增强） ----------
function debounce(fn, delay) {
    var timer = null;
    return function() {
        var context = this;
        var args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            fn.apply(context, args);
        }, delay);
    };
}

// ---------- 快捷键支持 ----------
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        var searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
});
