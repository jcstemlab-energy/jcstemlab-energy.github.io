# 团队成员信息收集模板

请填写以下信息，用于添加到实验室网站。

---

## 基本信息

**成员ID** (用于内部识别，例如: `phd24-zhangsan`, `faculty-lisi`): 
```
[填写ID]
```

**姓名/标题** (例如: `Prof. ZHANG, San` 或 `Mr. LI, Si`): 
```
[填写完整姓名和称谓]
```

**类别** (请选择一项):
- [ ] Faculty (教职员工)
- [ ] PhD Student (博士生)
- [ ] Postdoc (博士后)
- [ ] Visitor (访问学者)
- [ ] Former Member (前成员)

---

## 职位信息

**主要职位/角色** (第一行，会高亮显示):
```
[例如: Lab Director, Assistant Professor, PhD Student]
```

**其他职位信息** (每行一条，可选):
```
[例如: Department of Computer Science, City University of Hong Kong]
[例如: Fellow of ACM & IEEE]
```

---

## 联系方式

**邮箱地址**: 
```
[例如: name@cityu.edu.hk]
```

**Google Scholar链接** (如果有): 
```
[例如: https://scholar.google.com/citations?user=xxxxx]
```

**个人主页链接** (如果有): 
```
[例如: https://www.example.com]
```

**GitHub链接** (如果有): 
```
[例如: https://github.com/username]
```

**其他社交媒体链接** (可选): 
```
[例如: LinkedIn, Twitter等]
```

---

## 研究兴趣

请列出3-8个研究兴趣领域，每行一个:
```
[例如: Power Systems]
[例如: Smart Grid]
[例如: Renewable Energy Integration]
[例如: Energy Market]
[例如: Load Modeling]
```

---

## 教育背景

**学位1**:
- 学位名称: `[例如: PhD in Electrical Engineering]`
- 学校: `[例如: City University of Hong Kong]`
- 年份: `[例如: 2018 - 2022]`

**学位2** (如果有):
- 学位名称: `[例如: MEng in Electrical Engineering]`
- 学校: `[例如: Tsinghua University]`
- 年份: `[例如: 2016 - 2018]`

**学位3** (如果有):
- 学位名称: `[例如: BEng in Electrical Engineering]`
- 学校: `[例如: Peking University]`
- 年份: `[例如: 2012 - 2016]`

---

## 个人简介

请提供一段个人简介 (建议150-300字):
```
[填写个人简介，可以包括：
- 教育背景
- 研究经历
- 主要成就
- 当前研究方向
- 联系方式（如果需要招收学生/合作）]
```

---

## 头像照片

**头像文件路径** (照片应放在 `data/people/[成员目录]/avatar.jpg` 或 `avatar.png`):
```
[例如: data/people/PhD24_ZhangSan/avatar.jpg]
```

**照片要求**:
- 格式: JPG 或 PNG
- 尺寸: 建议 400x400px 或更大（正方形）
- 文件大小: 建议小于 500KB
- 背景: 建议使用专业背景或纯色背景

---

## 详细信息页面 (可选)

如果有详细的个人页面HTML文件:
```
[例如: data/people/PhD24_ZhangSan/index.html]
```

---

## 示例填写

### 示例1: 博士生

**成员ID**: `phd24-zhangsan`

**姓名/标题**: `Mr. ZHANG, San`

**类别**: PhD Student

**主要职位**: `PhD Student`

**其他职位信息**: 
```
Department of Electrical Engineering, City University of Hong Kong
```

**邮箱地址**: `zhangsan@cityu.edu.hk`

**Google Scholar链接**: `https://scholar.google.com/citations?user=xxxxx`

**研究兴趣**:
```
Power Systems
Smart Grid
Renewable Energy
Load Modeling
```

**教育背景**:
- 学位: `MEng in Electrical Engineering`
- 学校: `Tsinghua University`
- 年份: `2020 - 2022`

**个人简介**:
```
Zhang San is a PhD student in the Department of Electrical Engineering at City University of Hong Kong, supervised by Prof. DONG Zhaoyang. His research focuses on power system stability and smart grid technologies. He received his Master's degree from Tsinghua University in 2022.
```

**头像路径**: `data/people/PhD24_ZhangSan/avatar.jpg`

---

### 示例2: 教职员工

**成员ID**: `faculty-lisi`

**姓名/标题**: `Prof. LI, Si`

**类别**: Faculty

**主要职位**: `Assistant Professor`

**其他职位信息**: 
```
Department of Electrical Engineering, City University of Hong Kong
```

**邮箱地址**: `lisi@cityu.edu.hk`

**Google Scholar链接**: `https://scholar.google.com/citations?user=yyyyy`

**个人主页**: `https://www.example.com/lisi`

**研究兴趣**:
```
System Planning & Operations
Microgrid / Smart Grid
Energy Market
```

**教育背景**:
- 学位: `PhD in Electrical Engineering`
- 学校: `University of Florida`
- 年份: `2015 - 2019`

**个人简介**:
```
Prof. Li Si is an Assistant Professor in the Department of Electrical Engineering at City University of Hong Kong. He received his PhD from University of Florida in 2019. His research interests include system planning, microgrid development, and energy market dynamics.
```

**头像路径**: `data/people/Faculty_LiSi/avatar.png`

---

## 注意事项

1. **文件命名规范**:
   - 教职员工: `Faculty_[姓名]`
   - 博士生: `PhD[年份]_[姓名]` (例如: `PhD24_ZhangSan`)
   - 博士后: `PD[年份]_[姓名]` (例如: `PD24_WangWu`)
   - 访问学者: `Visitor[年份]_[姓名]` (例如: `Visitor24_LiuLiu`)
   - 前成员: `Former[类型]_[姓名]` (例如: `FormerPhD_ZhangSan`)

2. **JSON格式说明**:
   - 所有文本字段使用双引号
   - 数组使用方括号 `[]`
   - 对象使用花括号 `{}`
   - 注意逗号的使用

3. **提交方式**:
   - 填写完成后，将信息发送给网站管理员
   - 或直接按照格式添加到 `data/team-members.json` 文件中

---

## 快速检查清单

在提交前，请确认:
- [ ] 所有必填字段已填写
- [ ] 邮箱地址格式正确
- [ ] 链接地址完整且可访问
- [ ] 头像照片已准备好
- [ ] 个人简介语法正确
- [ ] 研究兴趣数量合适（3-8个）
- [ ] 文件路径格式正确

