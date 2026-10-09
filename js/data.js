// 基础选项配置
const CATEGORIES = ['校园卡/证件','数码产品','衣物','书籍','水杯','钥匙','雨伞','背包','其他'];
const PLACES = ['图书馆','食堂','教学楼','宿舍区','体育场','校园道路','其他'];

// LocalStorage 的 Key
const STORAGE_KEY_DATA = 'campus_lost_found_data';
const STORAGE_KEY_MINE = 'campus_lost_found_mine';

// 默认数据（当 LocalStorage 为空时使用）
const DEFAULT_DATA = [
  {id:1, img:'img/黑色双肩包.png', name:'黑色双肩包', type:'寻物', place:'图书馆三楼自习区', time:'10-21 15:40',
   status:'寻找中', tel:'138****8888',
   desc:'黑色双肩包，侧面有一个银色水杯袋，内有《数据结构》教材和一副眼镜，如有拾到请联系我，非常感谢！'},
  {id:2, img:'img/学生卡.png', name:'校园卡（厦门大学）', type:'招领', place:'第二食堂一楼', time:'10-19 10:25',
   status:'待认领', tel:'159****6666',
   desc:'在第二食堂一楼靠窗座位捡到一张厦门大学校园卡，已交至食堂服务台，请失主尽快认领。'},
  {id:3, img:'img/蓝牙耳机.png', name:'白色蓝牙耳机（华为）', type:'寻物', place:'体育场看台', time:'10-20 20:15',
   status:'寻找中', tel:'137****1234',
   desc:'白色华为无线蓝牙耳机，充电盒背面有一道划痕，昨晚在体育场看台看比赛时丢失。'},
  {id:4, img:'img/钥匙串.png', name:'钥匙串（5把）', type:'招领', place:'3号宿舍楼下', time:'10-20 08:50',
   status:'待认领', tel:'150****9999',
   desc:'3号宿舍楼下花坛边捡到一串钥匙，共5把，钥匙圈上有一个银色小挂件，失主请联系。'},
  {id:5, img:'img/雨伞.png', name:'深蓝色雨伞', type:'寻物', place:'教学楼B栋302', time:'10-18 17:20',
   status:'已找到', tel:'138****8888',
   desc:'深蓝色折叠伞，伞柄有磨损，已找到，感谢帮忙转发的同学。'},
  {id:6, img:'img/身份证.png', name:'身份证', type:'招领', place:'图书馆 图书馆二楼', time:'05-05 09:00',
 status:'待认领', tel:'未填写',
 desc:'在图书馆二楼自习区捡到一张身份证，已交至图书馆服务台。'}];

const DEFAULT_MY_POSTS = [
  {id:6, name:'身份证', type:'招领', category:'校园卡/证件', place:'图书馆 图书馆二楼', date:'2026-05-05', status:'hidden'},
  {id:1, name:'黑色双肩包', type:'寻物', category:'背包', place:'图书馆 图书馆三楼', date:'2026-05-05', status:'showing'}
];

// 初始化数据：优先从 LocalStorage 读取
let DATA = JSON.parse(localStorage.getItem(STORAGE_KEY_DATA));
if (!DATA || DATA.length === 0) {
  DATA = [...DEFAULT_DATA];
}

let MY_POSTS = JSON.parse(localStorage.getItem(STORAGE_KEY_MINE));
if (!MY_POSTS || MY_POSTS.length === 0) {
  MY_POSTS = [...DEFAULT_MY_POSTS];
}

// 保存数据到 LocalStorage
function saveData() {
  localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(DATA));
  localStorage.setItem(STORAGE_KEY_MINE, JSON.stringify(MY_POSTS));
}