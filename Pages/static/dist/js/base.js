/**
* 基础函数及全局变量设置
* 
* 2015-12-23
*/

/**
* 全局变量设置（作用范围：当前页面全局）
*/
var LoadingStr = '<div class="text-center"><i class="fa fa-spinner fa-5x fa-pulse"></i></div>';
var MyTimer;  //定时器
var TimeOutMillisecond = 500;  //超时设置(定时器启动间隔)
var TimeOutMax = 1000 * 60 * 3;//总超时时间，超过这段时间就会自动提示出错
var TimeOutTimes = TimeOutMax / TimeOutMillisecond ;  //折算次数
var CurrentTimes = 1;  //定时器当前运行次数
var storagePrefix = "PDCA";

/**
* 函数定义部分
*/
function inputErrorToggle(id,isError){
  var Obj = $('#'+id);
  if(isError == 1 || isError == true || isError == 'Y' || isError == 'y'){
    for (var i = 1; i <= 12; i++) {
      //此循环用于修复 Bootstrap 响应式布局 col-sm- 存在 padding导致覆盖层图标错位的 Bug
      if(Obj.parent('div').hasClass('col-sm-'+i))
        Obj.next('span').css('text-align', 'left');
    };
    Obj.parent('div').addClass('has-error');
    Obj.next('span').show(); 
  }else{
    Obj.parent('div').removeClass('has-error');
    Obj.next('span').hide();
  }
  return false;
};

function optionErrorToggle(id,isError){
  var Obj = $('#'+id);
  if(isError == 1 || isError == true || isError == 'Y' || isError == 'y'){
    Obj.prev('label').addClass('text-red');
    Obj.parent('div').addClass('has-error');
  }else{
    Obj.prev('label').removeClass('text-red');
    Obj.parent('div').removeClass('has-error');
  }
  return false;
};

function divErrorToggle(id,isError){
  var Obj = $('#'+id);
  if(isError == 1 || isError == true || isError == 'Y' || isError == 'y'){
    Obj.addClass('border-red');
  }else{
    Obj.removeClass('border-red');
  }
  return false;
};

function isPass(Arr){
  var Res = true;
  for (var i = 0; i < Arr.length; i++) {
    if(Arr[i]==1){
      Res = false;
      break;
    }
  };
  return Res;
};

/**
* 当 getjson 或者 post 方法出错的时候，产生提示页面，5秒后刷新
* 
* @param Null
* @return false
*/
function setUpAjaxError(){
  $.ajaxSetup({
    error:function(x,e){
      var HtmlStr = '<p>数据未能正常获取，请刷新页面。<br/>错误代码：' + x.status + '<br/>错误信息：' + x.statusText + '</p>';
      $('#ErrorModalBody').html(HtmlStr);
      $('#ErrorModal').modal('show');
      // setInterval(function(){location.href=window.location.pathname}, 1000*5);
      return false;
    }
  });
};

/**
* 显示错误对话框，5秒后刷新
* 
* @param Null
* @return false
*/
function showErrorModal(Info){
  var HtmlStr = '<p>'+Info+'</p>';
  $('#ErrorModalBody').html(HtmlStr);
  $('#ErrorModal').modal('show');
  // setInterval(function(){location.href=window.location.pathname}, 1000*5);
};

/**
* 动态设置模态框样式
* 
* @param Domid string
* @param style string [default|primary|info|warning|success|danger]
* @param size string [nor|lg|sm]
* @return false
*/
function setModalStyle(Domid,style,size){
  var obj = $('#'+Domid);
  if(style==undefined){
    style = 'default';
    size = 'nor';
  }
  if(size==undefined)
    size = 'nor';
  if(obj){
    //修改样式
    var ThisFoot = $('#'+Domid+' .modal-footer');
    $.each(['default','primary','info','warning','success','danger','outline'], function(index, val) {
      //清除所有样式
      obj.removeClass('modal-'+val);
      ThisFoot.children('button').removeClass('btn-'+val);
    });
    if( ("|primary|info|warning|success|danger|").indexOf('|'+(style.toLowerCase())+'|') >= 0 ){
      //命中除 默认 外的样式
      obj.addClass('modal-'+(style.toLowerCase()));
      ThisFoot.children('button').addClass('btn-outline');
    }else{
      //没有命中，或者是默认样式，就只添加按钮样式就可以了。
      ThisFoot.children('button').addClass('btn-primary');
    }

    //调整大小
    $.each(['lg','sm'], function(index, val) {
      //清除所有样式
      obj.children('.modal-dialog').removeClass('modal-'+val);
    });
    if( ("|lg|sm|").indexOf('|'+(size.toLowerCase())+'|') >= 0 )
      obj.children('.modal-dialog').addClass('modal-'+(size.toLowerCase()));
  }
  return false;
};

/**
* 格式化输出 Date 对象
* 使用方法： var now = new Date();
*            now.Format("yyyy-MM-dd");
* 参考文献： http://blog.sina.com.cn/s/blog_6819fa800100jun3.html
*
* @params fmt string 格式字符串，用于正则匹配
* returns fmt string 格式化后的日期字符串
*/
Date.prototype.Format = function(fmt)
{
  var o =
   {
    "M+" : this.getMonth() + 1, //月份
    "d+" : this.getDate(), //日
    "h+" : this.getHours(), //小时
    "m+" : this.getMinutes(), //分
    "s+" : this.getSeconds(), //秒
    "q+" : Math.floor((this.getMonth() + 3) / 3), //季度
    "S" : this.getMilliseconds() //毫秒
   };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

/**
* 将数字转换成 Date 对象并加上 n 天
* 
* @params DateStr string/int 日期，可以接受 2016/201601/20160106 2016-01/2016-01-06 几种类型的输入
* @params n int 想要加的天数，可以是负数
* @returns DateObj Date 加了 n 天之后的 Date 对象
*/
function addDay(DateStr,n){
  var DateObj;
  DateStr = ''+DateStr+'';    //强制转换为字符串
  DateStr = DateStr.replace(/-/g,'');    //去除连接符
  switch(DateStr.length){
    case 4:DateObj = new Date(DateStr,0);break;
    case 6:DateObj = new Date(DateStr.slice(0,4),DateStr.slice(4,6)-1);break;
    case 8:DateObj = new Date(DateStr.slice(0,4),DateStr.slice(4,6)-1,DateStr.slice(6,8));break;
    default: console.log('Error DateStr: '+DateStr);break;
  }
  if(DateObj)
    DateObj.setDate(DateObj.getDate() + n*1);
  return DateObj;
}

/**
* 将数字转换成 Date 对象并加上 n 个月
* 
* @params DateStr string/int 日期，可以接受 2016/201601/20160106 三种类型的输入
* @params n int 想要加的月数，可以是负数
* @returns DateObj Date 加了 n 个月之后的 Date 对象
*/
function addMonth(DateStr,n){
  var DateObj;
  DateStr = ''+DateStr+'';    //强制转换为字符串
  DateStr = DateStr.replace(/-/g,'');    //去除连接符
  switch(DateStr.length){
    case 4:DateObj = new Date(DateStr,0);break;
    case 6:DateObj = new Date(DateStr.slice(0,4),DateStr.slice(4,6)-1);break;
    case 8:DateObj = new Date(DateStr.slice(0,4),DateStr.slice(4,6)-1,DateStr.slice(6,8));break;
    default: console.log('Error DateStr: '+DateStr);break;
  }
  DateObj.setMonth(DateObj.getMonth() + n*1);
  return DateObj;
}

/**
* 判断传入参数类型
*/
function isArray(obj){    //数组类型
  return (typeof obj=='object')&&obj.constructor==Array; 
};
function isString(obj){    //字符串类型
  return (typeof obj=='string')&&obj.constructor==String; 
};
function isNumber(obj){    //数值类型
  return (typeof obj=='number')&&obj.constructor==Number; 
};
function isDate(obj){    //日期类型
  return (typeof obj=='object')&&obj.constructor==Date; 
};

/**
* 数据排序去重
*/
function arrUniq(ThisArr){
  if(ThisArr){
    ThisArr.sort();
    var re=[ThisArr[0]];
    for(var i = 1; i < ThisArr.length; i++){
      if( ThisArr[i] !== re[re.length-1])
        re.push(ThisArr[i]);
    }
    return re;
  }
}

function addLoading(DomID){
  var HtmlStr = '<div class="loading"><div class="loading-center"><div class="loading-center-absolute">';
  HtmlStr += '<div class="object object_four"></div><div class="object object_three"></div>';
  HtmlStr += '<div class="object object_two"></div><div class="object object_one"></div>';
  HtmlStr += '</div></div></div>';
  $('#'+DomID).html(HtmlStr);
  return false;
};

function convertCanvasToImage(canvas) {
  var image = new Image();
  image.src = canvas.toDataURL("image/png");
  return image;
}

/**
* 防反跳，暂时仅用于响应页面 window.onresize 方法，防止resize方法多次运行
* 
* @params func function 需要执行的callback函数
* @params threshold int [可选][默认 100]debouce 的时间间隔(毫秒)
* @returns execAsap bool [可选][1|0 默认 0]在时间段的开始还是结束执行函数
*/
var debounce = function (func, threshold, execAsap) { 
  var timeout; 
  return function debounced () {
    var obj = this, args = arguments;
    function delayed () {
      if(!execAsap)
        func.apply(obj, args);
      timeout = null;
    };
    if (timeout)
      clearTimeout(timeout);
    else if (execAsap)
      func.apply(obj, args);
    timeout = setTimeout(delayed, threshold || 100);
  };
};

/**
* 重新定义trim函数，避免错误的情况
*/
function trim(StringObj){
  if(!StringObj)
    return StringObj;
  return StringObj.trim();
};

/**
* 为附加导航添加操作按钮
* @param AffixSelectorString string 导航的选择器
* @param FooterSelectorString string 页面脚部选择器
*/
function activeAffix(AffixSelectorString,FooterSelectorString){
  var SelectorString = AffixSelectorString;
  // 先启用 Bootstrap 插件
  $(SelectorString).affix({
    offset: {
      top: 100,
      bottom: function () {
        return (this.bottom = $(FooterSelectorString).outerHeight(true))
      }
    }
  });

  var HtmlStr = '<div class="nav-control">';
  HtmlStr += '<div class="nav-expand" title="展开/收缩">';
  HtmlStr += '<i class="fa fa-arrow-circle-left"></i><br /><br />导<br />航<br />';
  HtmlStr += '</div><br />';
  HtmlStr += '<div class="nav-totop" title="回到顶部" data-control="ToTop"><i class="fa fa-angle-double-up"></i></div>';
  HtmlStr += '</div>';

  //删除导航控制并重新插入导航控制
  $(SelectorString+'>.nav-control').remove();
  $(SelectorString).children().eq(0).before(HtmlStr);
  // 为每一个a标签添加 onclick="return false;"
  $(SelectorString+' ul>li>a').attr('onclick','return false;');

  bindAffixClick(SelectorString);
  // 使用 滚动监听 辅助
  $('body').scrollspy({ target: '.Affix' });

  // 页面大小变化
  $(window).resize(function(event) {
    $(SelectorString+'>.nav-control>.nav-expand>i').removeClass('fa-arrow-circle-right').addClass('fa-arrow-circle-left');
    bindAffixClick(SelectorString);
  });
  return false;
};

/**
* 为附加导航添加点击事件
*/
function bindAffixClick(SelectorString){
  // 定义基础位置变量
  var WindowWidth = $(window).width();
  // var NavWidth = $(SelectorString+' ul').width();
  var NavWidth = 140;
  var FoldLeft = WindowWidth-15;
  var ExpandLeft = FoldLeft-NavWidth;
  
  // 定位附加导航--默认为收缩
  $(SelectorString).css('left',FoldLeft);
  $(SelectorString+' ul').hide();
  $(SelectorString).attr('data-status','fold');

  // 绑定点击事件--展开/收缩
  $(SelectorString+'>.nav-control>.nav-expand').unbind('click');
  $(SelectorString+'>.nav-control>.nav-expand').click(function(event) {
    if( $(SelectorString).attr('data-status')=='fold' ){
      $(SelectorString).animate({'left': ExpandLeft}, 'slow', function(){
        $(SelectorString).attr('data-status','expand');
        $(SelectorString+'>.nav-control>.nav-expand>i').removeClass('fa-arrow-circle-left').addClass('fa-arrow-circle-right');
      });
      $(SelectorString+' ul').fadeIn('slow');
      var WindowHeight = $(window).height()
      var NavHeight = $(SelectorString+' ul').height();
      if( WindowHeight-150<NavHeight ){
        $(SelectorString+' ul').slimScroll({
          height: (WindowHeight-150)+'px'
        });
        $(SelectorString+' div.slimScrollDiv').css('left','-26px');
      }
    }else{
      $(SelectorString).animate({'left': FoldLeft}, 'slow', function(){
        $(SelectorString).attr('data-status','fold');
        $(SelectorString+'>.nav-control>.nav-expand>i').removeClass('fa-arrow-circle-right').addClass('fa-arrow-circle-left');
      });
      $(SelectorString+' ul').fadeOut('slow');
    }
  });

  // 绑定点击事件--激活状态
  $(SelectorString+' ul>li').unbind('click');
  $(SelectorString+' ul>li').click(function(event) {
    // 采用滚动的方式进行页面转跳
    var ThisID = $(this).children('a').attr('href');
    $("html,body").stop(true);
    $("html,body").animate({scrollTop: $(ThisID).offset().top}, 1000);
  });


  // 绑定点击事件--滚动至顶部
  $('[data-control="ToTop"]').unbind('click');
  $('[data-control="ToTop"]').click(function(event) {
    $('html, body').animate({scrollTop:0}, 1000);
  });
  return false;
}

/**
* 执行部分
*/
/**
* 使用 fastclick 消除延迟
*/
FastClick.attach(document.body);

/*为box的 header添加手型鼠标，并且响应点击收缩的效果*/
$('.box>.box-header').addClass('press');
$('.box>.box-header,.box>.box-header>div').click(function(event) {
  if($(this)[0] == event.target)
    $(this).find('button[data-widget="collapse"]').trigger('click');
});

/*全局吐司效果参数，每个js可以自定义并覆盖该参数*/
toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-center",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

/**
* 启用附加导航
*/
activeAffix('.Affix','.main-footer');

