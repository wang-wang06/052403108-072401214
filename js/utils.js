// Toast 提示
let toastTimer;
function toast(msg){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>el.classList.remove('show'), 1500);
}

// 时间格式化
function pad(n){ return n<10 ? '0'+n : ''+n; }
function getNow(){
  const d = new Date();
  return `${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function getDate(){
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

// 根据分类智能匹配图片（这里的图片路径根据实际情况调整）
function pickImg(category, name = ''){ // 增加 name 参数
  // 优先判断具体的物品名称
  if(name.includes('身份证')) return 'img/身份证.png';
  if(name.includes('校园卡')) return 'img/学生卡.png';
  
  // 然后按分类兜底
  if(category.includes('证件') || category.includes('校园卡')) return 'img/学生卡.png';
  if(category.includes('数码')) return 'img/蓝牙耳机.png';
  if(category.includes('钥匙')) return 'img/钥匙串.png';
  if(category.includes('雨伞')) return 'img/雨伞.png';
  return 'img/黑色双肩包.png'; 
}
// 底部选择器逻辑
let pickerOptions = [];
let pickerCallback = null;

function openPicker(title, options, cb){
  pickerOptions = options;
  pickerCallback = cb;
  document.getElementById('pickerTitle').textContent = title;
  document.getElementById('pickerOpts').innerHTML = options.map((o,i)=>
    `<div class="picker-opt" onclick="pickOne(${i}, this)">${o}</div>`
  ).join('');
  document.getElementById('pickerMask').classList.add('show');
}

function pickOne(i, el){
  el.parentNode.querySelectorAll('.picker-opt').forEach(o=>o.classList.remove('on'));
  el.classList.add('on');
  const v = pickerOptions[i];
  setTimeout(()=>{
    pickerCallback && pickerCallback(v);
    closePicker();
  }, 150);
}

function closePicker(){
  document.getElementById('pickerMask').classList.remove('show');
}

function setField(id, v){
  const el = document.getElementById(id);
  el.value = v;
  el.style.color = '#2c3e2e';
}

// 成功弹窗逻辑
function showSuccess(opt){
  document.getElementById('successIcon').className = 'success-circle ' + (opt.color || '');
  document.getElementById('successTitle').textContent = opt.title;
  document.getElementById('successDesc').innerHTML = opt.desc;
  document.getElementById('successBtns').innerHTML = opt.btns;
  document.getElementById('successMask').classList.add('show');
}

function closeSuccess(){
  document.getElementById('successMask').classList.remove('show');
}

// 生成灰色占位图（纯代码生成，无需真实图片文件）
function getGrayPlaceholder() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#e0e0e0"/>
    <text x="50%" y="50%" font-family="sans-serif" font-size="16" fill="#999999" dominant-baseline="middle" text-anchor="middle">暂无图片</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}