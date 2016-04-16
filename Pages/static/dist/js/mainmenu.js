/**
* 左侧菜单
* 依赖<ul class="sidebar-menu"></ul>
*/
"use strict";
//变量定义
var jsonMenuUrl = "/jsons/JsonMenusList/";
var LocalMenuAsJson = [
    {
        "typename": "treeview",
        "url": "DashBoard.html",
        "name": "DashBoard",
        "namecn": "仪表盘",
        "idpath": "1",
        "pid": null,
        "id": 1,
        "icon": "dashboard"
    },
    {
        "typename": "treeview",
        "url": "#",
        "name": "LayoutAndWidgets",
        "namecn": "布局及部件",
        "idpath": "3",
        "pid": null,
        "id": 3,
        "icon": "gears"
    },
    {
        "typename": null,
        "url": "Layout.html",
        "name": "Layout",
        "namecn": "布局",
        "idpath": "3>4",
        "pid": 3,
        "id": 4,
        "icon": "files-o"
    },
    {
        "typename": null,
        "url": "Widgets.html",
        "name": "Widgets",
        "namecn": "部件",
        "idpath": "3>5",
        "pid": 3,
        "id": 5,
        "icon": "th"
    },
    {
        "typename": "treeview",
        "url": "#",
        "name": "UIElement",
        "namecn": "UI元素",
        "idpath": "6",
        "pid": null,
        "id": 6,
        "icon": "laptop"
    },
    {
        "typename": null,
        "url": "UIGeneral.html",
        "name": "UIGeneral",
        "namecn": "样式和JS部件",
        "idpath": "3>7",
        "pid": 3,
        "id": 7,
        "icon": "suitcase"
    },
    {
        "typename": null,
        "url": "UIIcon.html",
        "name": "UIIcon",
        "namecn": "图标",
        "idpath": "6>8",
        "pid": 6,
        "id": 8,
        "icon": "flag"
    },
    {
        "typename": null,
        "url": "UIButton.html",
        "name": "UIButton",
        "namecn": "按钮",
        "idpath": "6>9",
        "pid": 6,
        "id": 9,
        "icon": "bullseye"
    },
    {
        "typename": null,
        "url": "UISliderAndModal.html",
        "name": "UISliderAndModal",
        "namecn": "滑动条和模态框",
        "idpath": "6>10",
        "pid": 6,
        "id": 10,
        "icon": "sliders"
    },
    {
        "typename": null,
        "url": "UITimeLine.html",
        "name": "UITimeLine",
        "namecn": "时间线",
        "idpath": "6>11",
        "pid": 6,
        "id": 11,
        "icon": "clock-o"
    },
    {
        "typename": "treeview",
        "url": "#",
        "name": "FormElement",
        "namecn": "表单元素",
        "idpath": "12",
        "pid": null,
        "id": 12,
        "icon": "edit"
    },
    {
        "typename": null,
        "url": "FormGeneral.html",
        "name": "FormGeneral",
        "namecn": "全局表单样式",
        "idpath": "12>13",
        "pid": 12,
        "id": 13,
        "icon": "edit"
    },
    {
        "typename": null,
        "url": "FormEditor.html",
        "name": "FormEditor",
        "namecn": "富文本编辑器",
        "idpath": "12>14",
        "pid": 12,
        "id": 14,
        "icon": "underline"
    },
    {
        "typename": "treeview",
        "url": "Tables.html",
        "name": "Tables",
        "namecn": "表格",
        "idpath": "15",
        "pid": null,
        "id": 15,
        "icon": "table"
    },
    {
        "typename": "treeview",
        "url": "CalendarAndTime.html",
        "name": "CalendarAndTime",
        "namecn": "日历和时间",
        "idpath": "16",
        "pid": null,
        "id": 16,
        "icon": "calendar"
    },
    {
        "typename": "treeview",
        "url": "#",
        "name": "Examples",
        "namecn": "示例页面",
        "idpath": "17",
        "pid": null,
        "id": 17,
        "icon": "folder"
    },
    {
        "typename": null,
        "url": "Examples-WelcomePage.html",
        "name": "Examples-WelcomePage",
        "namecn": "欢迎页",
        "idpath": "17>18",
        "pid": 17,
        "id": 18,
        "icon": null
    },
    {
        "typename": null,
        "url": "Examples-Login.html",
        "name": "Examples-Login",
        "namecn": "登陆页",
        "idpath": "17>19",
        "pid": 17,
        "id": 19,
        "icon": null
    },
    {
        "typename": null,
        "url": "Examples-Empty.html",
        "name": "Examples-Empty",
        "namecn": "空页面",
        "idpath": "17>20",
        "pid": 17,
        "id": 20,
        "icon": null
    },
    {
        "typename": "treeview",
        "url": "Plugins.html",
        "name": "Plugins",
        "namecn": "插件列表",
        "idpath": "22",
        "pid": null,
        "id": 22,
        "icon": "plus"
    },
    {
        "typename": "treeview",
        "url": "Readme.html",
        "name": "Readme",
        "namecn": "一些说明",
        "idpath": "17",
        "pid": null,
        "id": 21,
        "icon": "file-text"
    }
];

//函数定义
/**
* 读取json数据
* 
* @param Null
* returns [] array json数据
*/
function getMenuJson(){
    var jsonData;
    $.ajaxSettings.async = false;  //阻塞页面元素
    $.getJSON(jsonMenuUrl, function(json, textStatus) {
        jsonData = json;
    });
    $.ajaxSettings.async = true;
    if(jsonData)
        return jsonData;
    else
        return undefined;
};

/**
* 根据json数据格式化成层级结构，并且将子层级的数据生成html往顶层传递，最后可以通过遍历顶层产生 treeview 菜单
* 采用递归循环，可以支持无限层级
* 
* @param data array 其实就是从数据库读取的原始行式数据
* @param pid int 父ID
* returns [] array 包含dict的json数据（每个dict包含 htmlStr key-value对）
*/
function fromatMenu(data,pid){
    var result=[],temp;
    for(var i in data){
        if(data[i]['pid']==pid){
            var icon = 'circle-o';    //默认图标
            if(data[i]['icon'])
                icon = data[i]['icon'];
            data[i]['htmlStr']  = '<li data-menuname="'+data[i]['name']+'">';
            data[i]['htmlStr'] += '<a href="'+data[i]['url']+'">';
            data[i]['htmlStr'] += '<i class="fa fa-'+icon+'"></i> ';
            data[i]['htmlStr'] += data[i]['namecn']+'</a></li>';
            result[result.length]=data[i];
            temp = fromatMenu(data,data[i]['id']);
            if(temp.length>0){    //存在子菜单
                var IsTop = '',icon = 'circle-o',tmpStr='';
                if(pid == null)    //是否是顶层
                    IsTop = 'class="treeview"';
                if(data[i]['icon'])
                    icon = data[i]['icon'];
                $.each(temp, function(index, val) {
                    tmpStr += val['htmlStr'];
                });
                data[i]['htmlStr']  = '<li '+IsTop+' data-menuname="'+data[i]['name']+'">';
                data[i]['htmlStr'] += '<a href="'+data[i]['url']+'">';
                data[i]['htmlStr'] += '<i class="fa fa-'+icon+'"></i> <span>'+data[i]['namecn']+'</span>';
                data[i]['htmlStr'] += '<i class="fa fa-angle-left pull-right"></i>';
                data[i]['htmlStr'] += '</a><ul class="treeview-menu">'+tmpStr+'</ul></li>';
                data[i]['nodes'] = temp;    //子菜单放入顶层的nodes里面
            }else if(pid == null){    //没有子菜单，而且是顶层菜单的情况下
                data[i]['htmlStr']  = '<li data-menuname="'+data[i]['name']+'">';
                data[i]['htmlStr'] += '<a href="'+data[i]['url']+'">';
                data[i]['htmlStr'] += '<i class="fa fa-'+icon+'"></i> <span>'+data[i]['namecn']+'</span>';
                data[i]['htmlStr'] += '</a></li>';
            }
        }
    }
    return result;
}

/**
* 根据菜单序号、json数据返回菜单html代码
* 
* @param MenuName string 需要高亮的菜单名字
* returns htmlStr string 菜单的html代码
*/
function getMenuStr(){
    // var jm = getMenuJson();
    var jm = LocalMenuAsJson;
    var fjm = fromatMenu(jm,null);
    var htmlStr = '<li class="header">功能菜单</li>';
    $.each(fjm, function(index, val) {
        htmlStr += val['htmlStr'];
    });
    return htmlStr;
};

/**
* 根据菜单名称，高亮菜单
* 采用递归循环，可以支持无限层级
* 
* @param MenuName string 需要高亮的菜单名字
* returns false
*/
function highLightMenu(MenuName){
    var ThisNemu = $('[data-menuname="'+MenuName+'"]');
    ThisNemu.addClass('active');
    if(ThisNemu.parent('ul')){
        var UpperLevelName = ThisNemu.parent('ul').parent('li').data('menuname');
        if(UpperLevelName){
            highLightMenu(UpperLevelName);
        }
    }
    return false;
}

//初始化菜单  ——  目前采用各个js分别调用的方式
// $(".sidebar-menu").html(getMenuStr());