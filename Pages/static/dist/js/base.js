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
* GooFlow 二次开发
* 将 JsonItems 格式化成 GooFlow 插件识别格式
* 
* @param JsonItems 获取得到的 Json 原始数据，是数据库结构数据
* @param jsondata jsonobject 输出结果可以先含有部分数据
* @return jsondata array 格式化并合并传入的数据后传出
* @return CurrentMaxWidth float 画布的最大宽度
* @return CurrentMaxHeight float 画布的最大高度
*/
function formatToGooFlowData(JsonItems,CurrentProcess,jsondata){
  var Retention = 50;  //预留 Retention 像素宽度/高度
  CurrentMaxWidth = 0;
  CurrentMaxHeight = 0;
  var Items = [];
  if(!jsondata)
    jsondata = {}
  $.each(JsonItems, function(index, val) {
    if(val['ProcessID'] == CurrentProcess['ID'])
      Items[Items.length] = val;
  });
  jsondata.title = CurrentProcess['NameCN'];
  $.each(Items, function(index, val) {
    var ThisVal = val;
    if(ThisVal.ItemType == 'nodes'){  //节点类型
      if(!jsondata.nodes)
        jsondata.nodes = {}
      jsondata.nodes[ThisVal.EleIdentifier] = {
        name:   ThisVal.EleName,
        type:   ThisVal.EleType,
        left:   ThisVal.EleLeft,
        top:    ThisVal.EleTop,
        width:  ThisVal.EleWidth,
        height: ThisVal.EleHeight,
      };
    }else if(ThisVal.ItemType == 'lines'){   //连接线类型
      if(!jsondata.lines)
        jsondata.lines = {}
      jsondata.lines[ThisVal.EleIdentifier] = {
        name:   ThisVal.EleName,
        type:   ThisVal.EleType,
        from:   ThisVal.FromEleIdentifier,
        to:     ThisVal.ToEleIdentifier,
        marked: ThisVal.EleMark,
        M:      ThisVal.EleM,
      };
    }else if(ThisVal.ItemType == 'areas'){   //组合区域类型
      if(!jsondata.areas)
        jsondata.areas = {}
      jsondata.areas[ThisVal.EleIdentifier] = {
        name:   ThisVal.EleName,
        color:  ThisVal.EleColor,
        left:   ThisVal.EleLeft,
        top:    ThisVal.EleTop,
        width:  ThisVal.EleWidth,
        height: ThisVal.EleHeight,
      };
    }
    if(ThisVal.EleLeft){  //如果存在左端点，说明该元素存在宽度，获取最大宽度值
      var ThisMax = ThisVal.EleLeft + ThisVal.EleWidth + Retention;
      if(ThisMax > CurrentMaxWidth)
        CurrentMaxWidth = ThisMax;
    }
    if(ThisVal.EleTop){  //如果存在上端点，说明该元素存在高度，获取最大高度值
      var ThisMax = ThisVal.EleTop + ThisVal.EleHeight + Retention * 2;
      if(ThisMax > CurrentMaxHeight)
        CurrentMaxHeight = ThisMax;
    }
  });
  return [jsondata,CurrentMaxWidth,CurrentMaxHeight];
};

/**
* GooFlow 二次开发
* 将已经预先格式化后的 treeview 数据转化成为 GooFlow 数据
* 采用递归深度优先遍历
* 
* @param id string GooFlow容器的id
* @param JsonList treeviewdict array
* @param jsondata dict 传入的 GooFlow 数据，用于在里面添加元素后返回
* @return jsondata dict 合并后的 GooFlow 数据
*/
function JsonListToGooFlowData(id,JsonList,jsondata){
  var MarginLeft = 20,MarginTop = 20;    //定义左侧和顶端的盈余
  var W = 50,H = 100;    //定义宽度和高度间隔标准量
  var UnitWidth = 86,UnitHeight = 24;
  var RelativeLeft;        //这个是每一个子层级的相对左端点
  var AbsoluteLeft;        //这个是每一个子层级的绝对左端点
  if(!jsondata)
    jsondata = {};
  $.each(JsonList, function(index, AMBInfo) {
    if(!jsondata.nodes)    //初始化节点子对象
      jsondata.nodes = {};
    if(!jsondata.lines)    //初始化连接线子对象
      jsondata.lines = {};
    if(!jsondata.sizes)    //初始化大小子对象
      jsondata.sizes = {};
    var PathArr = AMBInfo['IDPath'].split('>');    //通过分割，知道上几层的所有节点的左端点
    if(PathArr.length>1){    //如果是子级的情况下，进行遍历
      RelativeLeft = MarginLeft;
      for (var i = 0; i < PathArr.length-1; i++) {
        if( jsondata.nodes[id+'_node_'+PathArr[i]] )
          RelativeLeft += jsondata.nodes[id+'_node_'+PathArr[i]].left - MarginLeft;    //遍历所有父级元素的左顶端，排除盈余量
        else
          RelativeLeft = MarginLeft
      };
    }else{    //如果这个是根，直接计算盈余即可
      RelativeLeft = MarginLeft;
    }
    AbsoluteLeft = RelativeLeft + (W+UnitWidth)*(index);
    if(index>0){    //非第一个遍历到的元素的情况下，左端需要进行画布大小偏移
      if( jsondata.sizes['MaxWidth'] && jsondata.sizes['MaxWidth']>AbsoluteLeft )
        AbsoluteLeft = jsondata.sizes['MaxWidth'];
    }
    //产生节点数据
    jsondata.nodes[id+'_node_'+AMBInfo['ID']] = {
      name:   AMBInfo['text'],
      type:   'task',
      left:   AbsoluteLeft,
      top:    MarginTop + H*(PathArr.length-1),
      width:  UnitWidth,
      height: UnitHeight,
    };
    if(PathArr.length>1 && jsondata.nodes[id+'_node_'+AMBInfo['pid']]){    //如果非根节点需要将上级节点与自己相连，所以需要产生连接线
      var ThisM = (jsondata.nodes[id+'_node_'+AMBInfo['pid']].top + jsondata.nodes[id+'_node_'+AMBInfo['ID']].top)/2;
      jsondata.lines[id+'_line_'+AMBInfo['ID']] = {
        name:   '',
        type:   'tb',
        from:   id+'_node_'+AMBInfo['pid'],
        to:     id+'_node_'+AMBInfo['ID'],
        marked: false,
        M:      ThisM,
      };
    }
    
    var ThisRight = AbsoluteLeft + UnitWidth + W;    //本次增加的这个元素后，得到最右端
    if( !jsondata.sizes['MaxWidth'] || ThisRight>jsondata.sizes['MaxWidth'] ){    //画布最大宽度
      jsondata.sizes['MaxWidth'] = ThisRight;
    }
    var ThisBottom = MarginTop + H*(PathArr.length-1) + UnitHeight + H;    //本次增加的这个元素后，得到最底端
    if( !jsondata.sizes['MaxHeigth'] || ThisBottom>jsondata.sizes['MaxHeigth'] ){    //画布最大高度
      jsondata.sizes['MaxHeigth'] = ThisBottom;
    }

    if( AMBInfo['nodes'] && AMBInfo['nodes'].length>0 ){    //存在子级，则进行遍历（深度优先）
      jsondata = JsonListToGooFlowData(id,AMBInfo['nodes'],jsondata);
    }
  });
  return jsondata
};

/**
* GooFlow 二次开发
* 将已经预先格式化后的 treeview 数据转化成为 GooFlow 图表
* 
* @param id string GooFlow容器的id
* @param JsonList treeviewdict array
* @return false
*/
function setGooFlowFigure(id,JsonList){
  var ContenerObj = $('#'+id);
  var CurrentMaxWidth = 0,CurrentMaxHeight = 0;
  var jsondata = {};
  jsondata = JsonListToGooFlowData(id,JsonList,jsondata);
  CurrentMaxWidth = jsondata.sizes['MaxWidth'];
  CurrentMaxHeight = jsondata.sizes['MaxHeigth'];
  delete(jsondata.sizes);
  var property={
    haveHead:false,      //是否显示头部工具栏
    haveTool:false,      //是否显示左侧工具栏，如果不显示，则画布不可编辑
  };
  var width = ContenerObj.width();   //获取容器的宽度，用来自适应大小
  if(CurrentMaxWidth == 0){
    property.width = width;
    property.height = '300';
  }else{    //大概就是说：画布宽度自适应容器大小，画布高度与实际图大小一致，但是如果高度超过500就产生滚动条
    if(CurrentMaxWidth > width){
      property.width = width;
      property.workWidth = CurrentMaxWidth;
    }else{
      property.width = CurrentMaxWidth;
    }
    if(CurrentMaxHeight > 500){
      property.height = 500;
      property.workHeight = CurrentMaxHeight;
    }else{
      property.height = CurrentMaxHeight;
    }
  };
  var GooFlowFigure=$.createGooFlow(ContenerObj,property);  // 产生流程图
  GooFlowFigure.loadData(jsondata);    //加载数据
  return jsondata;
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

