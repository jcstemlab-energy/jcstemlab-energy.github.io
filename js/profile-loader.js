/**
 * Profile Loader
 * 用于动态加载团队成员档案页面
 */

// 主函数
document.addEventListener('DOMContentLoaded', function() {
    loadMemberProfile();
});

/**
 * 从URL获取成员ID
 * @returns {string|null} 成员ID或null（如果未找到）
 */
function getMemberIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

/**
 * 加载成员档案
 */
function loadMemberProfile() {
    const memberId = getMemberIdFromUrl();
    
    if (!memberId) {
        showError('No member ID specified. Please return to homepage.');
        return;
    }
    
    // 加载团队数据
    fetch('../../data/team-members.json')
        .then(response => response.json())
        .then(data => {
            const member = findMemberById(data, memberId);
            
            if (member) {
                renderMemberProfile(member);
            } else {
                showError(`Member with ID "${memberId}" not found.`);
            }
        })
        .catch(error => {
            console.error('Error loading team data:', error);
            showError('Failed to load member data. Please try again later.');
        });
}

/**
 * 在团队数据中查找成员
 * @param {Object} data - 团队数据
 * @param {string} memberId - 成员ID
 * @returns {Object|null} 成员对象或null（如果未找到）
 */
function findMemberById(data, memberId) {
    for (const category of data.categories) {
        for (const subcategory of category.subcategories) {
            const member = subcategory.members.find(m => m.id === memberId);
            if (member) {
                return member;
            }
        }
    }
    return null;
}

/**
 * 渲染成员档案
 * @param {Object} member - 成员数据
 */
function renderMemberProfile(member) {
    // 隐藏加载动画
    document.getElementById('loading').style.display = 'none';
    
    // 显示内容容器
    const contentContainer = document.getElementById('profile-content');
    contentContainer.style.display = 'block';
    
    // 更新页面标题
    document.title = `${member.title} | JC STEM Lab of Future Energy Systems`;
    
    // 创建档案内容
    let html = `
        <div class="profile-header">
            <div class="profile-avatar-container">
                <img src="../../${member.avatar}" alt="${member.title}" class="profile-avatar">
                ${renderSocialLinks(member.socialLinks)}
            </div>
            <div class="profile-main-info">
                <h1>${processChinese(member.title)}</h1>
                <div class="profile-role">
                    ${renderRoles(member.role)}
                </div>
            </div>
        </div>
    `;
    
    // 研究兴趣
    if (member.interests && member.interests.length > 0) {
        html += `
            <div class="profile-section">
                <h2><i class="fas fa-lightbulb"></i> Research Interests</h2>
                <div class="interests-grid">
                    ${member.interests.map(interest => 
                        `<span class="interest-badge">${processChinese(interest)}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    // 教育经历
    if (member.education && member.education.length > 0) {
        html += `
            <div class="profile-section">
                <h2><i class="fas fa-graduation-cap"></i> Education</h2>
                <div class="education-timeline">
                    ${renderEducation(member.education)}
                </div>
            </div>
        `;
    }
    
    // 个人简历
    if (member.biography) {
        html += `
            <div class="profile-section">
                <h2><i class="fas fa-user"></i> Biography</h2>
                <div class="biography-content">
                    ${formatBiography(member.biography)}
                </div>
            </div>
        `;
    }
    
    // 设置HTML内容
    contentContainer.innerHTML = html;
}

/**
 * 渲染角色信息
 * @param {Array} roles - 角色数组
 * @returns {string} HTML字符串
 */
function renderRoles(roles) {
    if (!roles || roles.length === 0) return '';
    
    return roles.map(role => {
        const processedText = processChinese(role.text);
        const isLabDirector = role.text === 'Lab Director';
        if (role.highlighted) {
            if (isLabDirector) {
                return `<p><b style="color: var(--primary, #2563EB);">${processedText}</b></p>`;
            }
            return `<p><b>${processedText}</b></p>`;
        } else {
            return `<p>${processedText}</p>`;
        }
    }).join('');
}

/**
 * 渲染社交链接
 * @param {Array} links - 链接数组
 * @returns {string} HTML字符串
 */
function renderSocialLinks(links) {
    if (!links || links.length === 0) return '';
    
    const linksHtml = links.map(link => {
        const target = link.url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${link.url}" title="${link.title}"${target}><i class="${link.icon}"></i></a>`;
    }).join('');
    
    return `<div class="profile-social-links">${linksHtml}</div>`;
}

/**
 * 渲染教育经历
 * @param {Array} education - 教育经历数组
 * @returns {string} HTML字符串
 */
function renderEducation(education) {
    return education.map(edu => `
        <div class="education-item">
            <h3>${processChinese(edu.degree)}</h3>
            <p>${processChinese(edu.institution)}</p>
            <p>${processChinese(edu.year)}</p>
        </div>
    `).join('');
}

/**
 * 检测文本中是否包含中文
 * @param {string} text - 要检查的文本
 * @returns {boolean} 是否包含中文
 */
function containsChinese(text) {
    if (!text) return false;
    return /[\u4e00-\u9fa5]+/.test(text);
}

/**
 * 处理文本，将中文部分用span包裹
 * @param {string} text - 要处理的文本
 * @returns {string} 处理后的HTML
 */
function processChinese(text) {
    if (!text || !containsChinese(text)) return text;
    return text.replace(/([\u4e00-\u9fa5]+)/g, '<span class="chinese-text">$1</span>');
}

/**
 * 格式化传记文本
 * @param {string} biography - 传记文本
 * @returns {string} 格式化的HTML
 */
function formatBiography(biography) {
    if (!biography) return '';
    
    // 分段处理
    let html = biography
        .split(/\n\n+/)
        .filter(p => p.trim().length > 0)
        .map(p => `<p>${processChinese(p.trim())}</p>`)
        .join('');
    
    // 处理 HTML 链接
    html = html.replace(/<a\s+href="([^"]+)"([^>]*)>(.*?)<\/a>/g, (match, url, attrs, text) => {
        if (attrs.indexOf('target=') === -1) {
            return `<a href="${url}" target="_blank"${attrs}>${text}</a>`;
        }
        return match;
    });
    
    // 处理强调
    html = html.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');
    html = html.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');
    
    return html;
}

/**
 * 显示错误信息
 * @param {string} message - 错误消息
 */
function showError(message) {
    document.getElementById('loading').style.display = 'none';
    
    const contentContainer = document.getElementById('profile-content');
    contentContainer.style.display = 'block';
    
    contentContainer.innerHTML = `
        <div class="error-message">
            <h2>Error</h2>
            <p>${message}</p>
            <p style="margin-top: 1.5rem;">
                <a href="../../index.html" class="btn btn-primary">
                    <i class="fas fa-home"></i> Back to Homepage
                </a>
            </p>
        </div>
    `;
}
