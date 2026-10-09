const TAB_MAP = {login:null, home:'home', search:'home', detail:'home', publish:'publish', mine:'mine'};

// 用于暂存用户上传的图片 Base64
let uploadedImageBase64 = null; 

// 页面路由切换
function go(name){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-'+name).classList.add('active');
  const at = TAB_MAP[name];
  document.querySelectorAll('.tab-item').forEach(t=>{
    t.classList.toggle('active', t.dataset.tab === at);
  });
  document.getElementById('tabbar').style.display = (name === 'login') ? 'none' : 'flex';
  document.querySelectorAll('.panel button').forEach(b=>{
    b.classList.toggle('on', b.dataset.p === name);
  });
  if(name === 'search') renderSearch();
  if(name === 'mine') renderMine();
}

// 生成卡片 HTML
function cardHTML(it){
  const cls = it.type === '寻物' ? 'lost' : 'found';
  const telIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
  return `<div class="card" onclick="openDetail(${it.id})">
    <div class="thumb"><img src="${it.img}" alt="${it.name}" onerror="this.src=getGrayPlaceholder()"></div>
    <div class="info">
      <div class="row1"><span class="title">${it.name}</span><span class="badge ${cls}">${it.type}</span></div>
      <div class="meta">${it.place} · ${it.time}</div>
      <div class="tel">${telIcon}${it.tel}</div>
    </div>
  </div>`;
}

// 首页渲染
let homeFilter = '招领';
function setTab(el){
  el.parentNode.querySelectorAll('.s').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  homeFilter = el.textContent.trim().startsWith('招领') ? '招领' : '寻物';
  renderHome();
}

function renderHome(){
  let arr = DATA.filter(i=> i.type === homeFilter);
  const box = document.getElementById('homeList');
  if(!arr.length){
    box.innerHTML = `<div class="empty-card">
      <div class="empty-icon">拾</div>
      <div class="empty-title">暂无${homeFilter}信息</div>
      <div class="empty-desc">如果你刚好捡到物品，可以前往发布页补充线索。</div>
    </div>
    <div class="tip-card">信息由用户自行发布，请自行核实。贵重物品建议优先移交至宿管中心、保卫处或校内服务点。</div>`;
  } else {
    box.innerHTML = arr.map(cardHTML).join('') +
      `<div class="tip-card" style="margin-top:4px">信息由用户自行发布，请自行核实。贵重物品建议优先移交至宿管中心、保卫处或校内服务点。</div>`;
  }
}

// 搜索页渲染
function renderSearch(){
  const kw = document.getElementById('searchInput').value.trim();
  let arr = DATA;
  if(kw) arr = arr.filter(i=> i.name.includes(kw) || i.place.includes(kw) || i.desc.includes(kw));
  document.getElementById('searchList').innerHTML = arr.length
    ? arr.map(cardHTML).join('')
    : '<div class="empty">没有找到相关物品<br><br><span style="color:#8ba888;cursor:pointer" onclick="go(\'publish\')">去发布一条寻物启事</span></div>';
}

// 详情页逻辑
let currentTel = '';
let currentId = null;

function openDetail(id){
  // 调试日志：看看传进来的ID是什么
  console.log("【点击的ID】:", id);
  
  // 用 == 而不是 ===，防止数据类型不一致（数字1和字符串"1"）
  const it = DATA.find(d => d.id == id);
  console.log("【找到的数据】:", it);

  if(!it) {
    console.warn('未找到对应ID的数据');
    return; 
  }

  // 安全更新图片与文字
  const imgEl = document.getElementById('dImg');
  if(imgEl) {
    imgEl.src = it.img;
    imgEl.onerror = function() {
      this.src = getGrayPlaceholder(); // 兜底占位图
      this.onerror = null; 
    };
  }

  const nameEl = document.getElementById('dName');
  if(nameEl) nameEl.textContent = it.name;

  const typeEl = document.getElementById('dType');
  if(typeEl) {
    typeEl.textContent = it.type;
    typeEl.className = 'badge ' + (it.type === '寻物' ? 'lost' : 'found');
  }

  const placeEl = document.getElementById('dPlace');
  if(placeEl) placeEl.textContent = it.place;

  const timeEl = document.getElementById('dTime');
  if(timeEl) timeEl.textContent = it.time;

  const statusEl = document.getElementById('dStatus');
  if(statusEl) statusEl.textContent = it.status;

  const telEl = document.getElementById('dTel');
  if(telEl) telEl.textContent = it.tel;

  const descEl = document.getElementById('dDesc');
  if(descEl) descEl.textContent = it.desc;

  currentTel = it.tel;
  currentId = id;
  
  // 最后才跳转
  go('detail');
}

/* ===== 拨打中 ===== */
let callingTimer;
function callPhone(){
  if(currentTel === '未填写' || !currentTel) {
    toast('发布者未留下联系电话');
    return;
  }
  document.getElementById('callingTel').textContent = currentTel;
  document.getElementById('callingMask').classList.add('show');
  clearTimeout(callingTimer);
  // 8 秒后自动挂断（模拟对方未接听）
  callingTimer = setTimeout(()=>{
    hangUp();
    toast('对方暂时无法接听');
  }, 8000);
}
function hangUp(){
  clearTimeout(callingTimer);
  document.getElementById('callingMask').classList.remove('show');
}

// 发布页逻辑
let currentType = 'lost';
function setType(t){
  currentType = t;
  document.getElementById('typeLost').className = 'type-btn' + (t==='lost' ? ' active-lost' : '');
  document.getElementById('typeFound').className = 'type-btn' + (t==='found' ? ' active-found' : '');
}

// 新增：处理图片上传
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // 限制图片大小在 2MB 以内，防止 LocalStorage 爆满
  if (file.size > 2 * 1024 * 1024) {
    toast('图片不能超过 2MB');
    event.target.value = ''; // 清空选择
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    uploadedImageBase64 = e.target.result; // 获取 Base64 字符串
    
    // 更新界面预览
    const previewBox = document.getElementById('uploadPreviewBox');
    const uploadText = document.getElementById('uploadText');
    uploadText.style.display = 'none'; // 隐藏“点击上传”的文字
    
    let img = previewBox.querySelector('img');
    if (!img) {
      img = document.createElement('img');
      img.style.height = '34px';
      img.style.borderRadius = '6px';
      img.style.objectFit = 'cover';
      previewBox.appendChild(img);
    }
    img.src = uploadedImageBase64;
  };
  reader.readAsDataURL(file);
}

// 【新增】智能匹配算法
function findMatchNotice(newItem) {
  // 只有在发布“寻物”时才去匹配“招领”
  if (newItem.type !== '寻物') return null;
  
  const matches = DATA.filter(item => {
    // 排除自己，只匹配“招领”信息
    if (item.type !== '招领' || item.id === newItem.id) return false;
    
    // 匹配规则：名称包含或分类相同（简单模糊匹配）
    const nameMatch = item.name.includes(newItem.name) || newItem.name.includes(item.name);
    const categoryMatch = item.category && newItem.category && item.category === newItem.category;
    
    return nameMatch || categoryMatch;
  });

  // 返回匹配结果中最新的一条
  return matches.length > 0 ? matches[0] : null;
}

// 【修改】发布函数（整体替换原来的 publish）
function publish(){
  const name = document.getElementById('fName').value.trim();
  const category = document.getElementById('fCategory').value.trim();
  const placeType = document.getElementById('fPlaceType').value.trim();
  const placeDetail = document.getElementById('fPlaceDetail').value.trim();
  const desc = document.getElementById('fDesc').value.trim();
  const timeInput = document.getElementById('fTime').value.trim();
  const telInput = document.getElementById('fTel').value.trim();

  // 表单验证
  if(!name){ toast('请填写物品名称'); return; }
  if(!category){ toast('请选择物品分类'); return; }
  if(!placeType){ toast('请选择地点类型'); return; }
  if(!placeDetail){ toast('请填写具体地点'); return; }

  const type = currentType === 'lost' ? '寻物' : '招领';
  const place = placeType + ' ' + placeDetail;
  const time = timeInput || getNow();
  const tel = telInput || '未填写';
  const descText = desc || '暂无更多描述。';
  
  // 核心逻辑修改：优先用上传的图片，没有就用灰色占位图
  const img = uploadedImageBase64 || getGrayPlaceholder();
  const id = Date.now();
  const date = getDate();

  // 将当前物品封装成一个对象，方便后续匹配
  const newItem = {
    id, img, name, type, place, time,
    status: type === '寻物' ? '寻找中' : '待认领',
    tel, desc: descText,
    category: category // 存入分类，方便智能匹配算法调用
  };

  // 更新 DATA
  DATA.unshift(newItem);

  // 更新 MY_POSTS
  MY_POSTS.unshift({
    id, name, type, category, place, date, status: 'showing'
  });

  // 持久化保存！
  saveData();

  // 重新渲染
  renderHome();
  renderSearch();
  renderMine();

  // 清空表单
  ['fName','fCategory','fColor','fPlaceType','fPlaceDetail','fDesc','fTime','fTel'].forEach(id=>{
    const el = document.getElementById(id);
    el.value = '';
    el.style.color = '';
  });
  setType('lost');
  
  // 清空图片上传状态
  uploadedImageBase64 = null;
  const previewBox = document.getElementById('uploadPreviewBox');
  const uploadText = document.getElementById('uploadText');
  if (uploadText) uploadText.style.display = 'inline';
  const previewImg = previewBox ? previewBox.querySelector('img') : null;
  if (previewImg) previewImg.remove();
  const fileInput = document.getElementById('fImgFile');
  if (fileInput) fileInput.value = '';

  // 【核心变化】触发智能匹配推送
  const matchedItem = findMatchNotice(newItem);

  if (matchedItem) {
    // 如果匹配到了，弹出“发现疑似匹配”的特别提示框
    showSuccess({
      color:'', // 保持默认绿色
      title:'🎉 发现疑似匹配的招领信息！',
      desc:`系统发现一条疑似你丢失的【${matchedItem.name}】<br>发布于：${matchedItem.place}`,
      btns:`<button class="go-mine" onclick="closeSuccess();openDetail(${matchedItem.id})">去查看匹配信息</button>
            <button class="go-home" onclick="closeSuccess();go('home')">先返回首页</button>`
    });
  } else {
    // 如果没匹配到，走原来的普通发布成功逻辑
    showPublishSuccess();
  }
}




// 我的发布渲染
function renderMine(){
  const box = document.getElementById('mineList');
  if(!MY_POSTS.length){
    box.innerHTML = `<div class="empty-card">
      <div class="empty-icon">空</div>
      <div class="empty-title">还没有发布</div>
      <div class="empty-desc">去发布页发布第一条信息吧。</div>
    </div>`;
    return;
  }
  box.innerHTML = MY_POSTS.map(p=>{
    const cls = p.type === '寻物' ? 'lost' : 'found';
    const statusCls = p.status === 'showing' ? 'showing' : 'hidden';
    const statusTxt = p.status === 'showing' ? '展示中' : '已隐藏';
    const resolveBtn = p.status === 'showing'
      ? `<button class="post-btn resolve" onclick="resolvePost(${p.id})">标记已找回 / 已认领</button>`
      : '';
    return `<div class="post-card">
      <div class="post-head">
        <div class="post-tag ${cls}">${p.type}</div>
        <div class="post-name">${p.name}</div>
        <div class="post-status ${statusCls}">${statusTxt}</div>
      </div>
      <div class="post-meta">
        <span class="left">${p.category} · ${p.place}</span>
        <span>${p.date}</span>
      </div>
      <div class="post-btns">
        ${resolveBtn}
        <button class="post-btn delete" onclick="deletePost(${p.id})">删除</button>
      </div>
    </div>`;
  }).join('');
}

// 标记为已解决
function resolvePost(id){
  const p = MY_POSTS.find(x=>x.id===id);
  if(!p) return;
  p.status = 'hidden';
  const di = DATA.findIndex(x=>x.id===id);
  if(di >= 0) DATA.splice(di, 1); // 从主页数据中移除或隐藏
  
  saveData(); // 保存！
  
  renderMine(); renderHome(); renderSearch();
  toast('已标记为已找回 / 已认领');
}

// 删除帖子
function deletePost(id){
  const i = MY_POSTS.findIndex(x=>x.id===id);
  if(i < 0) return;
  MY_POSTS.splice(i, 1);
  const di = DATA.findIndex(x=>x.id===id);
  if(di >= 0) DATA.splice(di, 1);
  
  saveData(); // 保存！
  
  renderMine(); renderHome(); renderSearch();
  toast('已删除');
}

function showPublishSuccess(){
  showSuccess({
    color:'',
    title:'发布成功',
    desc:'你的信息已发布<br>同学们可以浏览和搜索到啦',
    btns:`<button class="go-mine" onclick="closeSuccess();go('mine')">查看我的发布</button>
          <button class="go-home" onclick="closeSuccess();go('home')">返回首页</button>`
  });
}

function showResolved(){
  if(currentId !== null){
    const di = DATA.findIndex(x=>x.id===currentId);
    if(di >= 0) DATA.splice(di, 1);
    const mp = MY_POSTS.find(x=>x.id===currentId);
    if(mp) mp.status = 'hidden';
    
    saveData(); // 保存！
    
    renderHome(); renderSearch(); renderMine();
  }
  showSuccess({
    color:'blue',
    title:'已标记为已解决',
    desc:'物品状态已更新为「已解决」<br>其他同学将不再看到此信息',
    btns:`<button class="go-mine" onclick="closeSuccess();go('home')">返回首页</button>
          <button class="go-home" onclick="closeSuccess();go('mine')">查看我的发布</button>`
  });
}

// 初始化渲染
renderHome();
renderSearch();
renderMine();
document.getElementById('tabbar').style.display = 'none';