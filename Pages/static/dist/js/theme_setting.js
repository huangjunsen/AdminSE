/**
 * 右侧侧边栏设置菜单
 * ------------------
 */
 /*! theme_setting.js
 * ================
 * 右侧侧边栏菜单设置，包含布局管理、皮肤管理等功能。
 *
 * @Author  sam
 * @Email   <hjs01@lingyun.biz>
 * @version 1.0
 * @Update Note:
 * 2015-10-30 V0.1beta 从AdminLTE中翻译并修复部分bug后适应需求。（已同步min）
 * 2015-11-11 V0.2beta 采用“存储前缀”，避免多个站点公用同一套存储。（已同步min）
 * 2015-11-11 V0.3beta 修复右侧边栏皮肤无法缓存的bug。（已同步min）
 * 2016-04-05 V1.0 大量更新代码，替换所有bootstrapswitch内容为icheck，并且模板化脚本。（已同步min）
 */
(function ($, AdminLTE) {

  /**
   * 列出所有皮肤和色块（一一对应）
   * my_skins 、logo_skins 、 nav_skins
   * @type Array
   */
  var my_skins = [
    "skin-blue",
    "skin-black",
    "skin-purple",
    "skin-green",
    "skin-red",
    "skin-yellow",
    "skin-blue-light",
    "skin-black-light",
    "skin-purple-light",
    "skin-green-light",
    "skin-red-light",
    "skin-yellow-light"
  ];
  var logo_skins = [
    "#367fa9",
    "#fefefe",
    "#555299",
    "#008d4c",
    "#d33724",
    "#db8b0b",
    "#367fa9",
    "#fefefe",
    "#555299",
    "#008d4c",
    "#d33724",
    "#db8b0b"
  ];
  var nav_skins = [
    "#3c8dbc",
    "#fefefe",
    "#605ca8",
    "#00a65a",
    "#dd4b39",
    "#f39c12",
    "#3c8dbc",
    "#fefefe",
    "#605ca8",
    "#00a65a",
    "#dd4b39",
    "#f39c12"
  ];

  /**
  * 定义存储前缀
  */
  var storagePrefix = "AdminSE";

  //创建组合表主体头部
  var tab_pane = $("<div />", {
    "id": "control-sidebar-theme-setting-tab",
    "class": "tab-pane active"
  });

  //产生组合表按钮
  var tab_button = $("<li />", {"class": "active"})
          .html("<a href='#control-sidebar-theme-setting-tab' data-toggle='tab'>"
                  + "<i class='fa fa-wrench'></i>"
                  + "</a>");

  //在home按钮前边放置这个按钮
  $("[href='#control-sidebar-home-tab']")
          .parent()
          .before(tab_button);

  //开始创建主体
  var demo_settings = $("<div />");

  //布局设置
  demo_settings.append(
          "<h4 class='control-sidebar-heading'>"
          + "Layout Options"
          + "</h4>"
          //固定布局
          + "<div class='form-group'>"
          + "<label class='control-sidebar-subheading'>"
          + "启用固定布局"
          + "</label>"
          + "<div class='pull-right' data-toggle='tooltip' title='勾选则启用，否则禁用'>"
          + "<input type='checkbox' data-control='layout'> "
          + "</div>"
          + "<p>启用顶部导航栏跟随页面滚动</p>"
          + "</div>"
          //左侧边栏自动收缩/展开
          + "<div class='form-group'>"
          + "<label class='control-sidebar-subheading'>"
          + "启用左侧边栏自动展开"
          + "</label>"
          + "<div class='pull-right' data-toggle='tooltip' title='勾选则启用，否则禁用'>"
          + "<input type='checkbox' data-control='expandOnHover'> "
          + "</div>"
          + "<p>开启左侧边栏在最小化的状态下鼠标移过会自动展开功能</p>"
          + "</div>"
          //右侧边栏触发
          + "<div class='form-group'>"
          + "<label class='control-sidebar-subheading'>"
          + "浮动右侧边栏"
          + "</label>"
          + "<div class='pull-right' data-toggle='tooltip' title='勾选则浮动，否则固定'>"
          + "<input type='checkbox' data-control='control-sidebar-fixed'> "
          + "</div>"
          + "<p>是否浮动右侧侧边栏。</p>"
          + "</div>"
          //右侧边栏皮肤
          + "<div class='form-group'>"
          + "<label class='control-sidebar-subheading'>"
          + "暗色/明亮右侧边栏"
          + "</label>"
          + "<div class='pull-right' data-toggle='tooltip' title='勾选则使用暗色皮肤，否则使用明亮皮肤'>"
          + "<input type='checkbox' data-control='control-sidebarskin'> "
          + "</div>"
          + "<p>设定右侧边栏皮肤为暗色或者明亮，默认为暗色。</p>"
          + "</div>"
          );
  var skins_list = $("<ul />", {"class": 'list-unstyled clearfix'});

  //暗色主题
  skins_list.append(skin_template( 0,"蓝-暗","dark"));
  skins_list.append(skin_template( 1,"白-暗","dark"));
  skins_list.append(skin_template( 2,"紫-暗","dark"));
  skins_list.append(skin_template( 3,"绿-暗","dark"));
  skins_list.append(skin_template( 4,"红-暗","dark"));
  skins_list.append(skin_template( 5,"橙-暗","dark"));

  //亮色主题
  skins_list.append(skin_template( 6,"蓝-亮","light"));
  skins_list.append(skin_template( 7,"白-亮","light"));
  skins_list.append(skin_template( 8,"蓝-亮","light"));
  skins_list.append(skin_template( 9,"紫-亮","light"));
  skins_list.append(skin_template(10,"绿-亮","light"));
  skins_list.append(skin_template(11,"橙-亮","light"));

  demo_settings.append("<h4 class='control-sidebar-heading'>皮肤</h4>");
  demo_settings.append(skins_list);

  tab_pane.append(demo_settings);
  $("#control-sidebar-home-tab").after(tab_pane);

  //主程序入口
  setup();

  /**
   * 开启/禁用左侧边栏自动收缩
   * 
   * @param state: bool 开启（true），禁用（false）
   * @returns Boolean false to prevent link's default action
   */
  function toggle_hover(state){
    if(state){
      AdminLTE.pushMenu.expandOnHover();
      if(!$('body').hasClass('sidebar-collapse'))
        $("[data-toggle='offcanvas']").click();
    }else{
      AdminLTE.pushMenu.expandOffHover();
      if($('body').hasClass('sidebar-collapse'))
        $("[data-toggle='offcanvas']").click();
    }
    return false;
  }

  /**
   * 皮肤显示模板
   * 
   * @param i: int [0-11] 皮肤序号
   * @param name: string 皮肤名称
   * @param dorl: string [dark|light] 暗色还是明亮
   * @returns 模板html代码
   */
  function skin_template(i,name,dorl){
    var sidebar_color = "#222d32";
    if(dorl == "light"){
      sidebar_color = "#f9fafc";
    }
    return(
      $("<li />", {style: "float:left; width: 33.33333%; padding: 5px;"})
      .append("<a href='javascript:void(0);' data-skin='"+my_skins[i]+"' style='display: block; "
        + "box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'>"
        + "<div>"
        +"<span style='display:block;width:20%;float:left;height:7px;background:"+logo_skins[i]+";'></span>"
        +"<span style='display:block;width:80%;float:left;height:7px;background:"+nav_skins[i]+";'></span>"
        + "</div>"
        + "<div>"
        +"<span style='display:block;width:20%;float:left;height:20px;background:"+sidebar_color+";'></span>"
        +"<span style='display:block;width:80%;float:left;height:20px;background:#f4f5f7;'></span>"
        + "</div>"
        + "</a>"
        + "<p class='text-center no-margin'>" + name + "</p>")
    );
  }

  /**
   * 变更页面布局
   * 
   * @param cls: String fixed 布局模式
   * @returns void
   */
  function change_layout(cls) {
    $("body").toggleClass(cls);
    AdminLTE.layout.fixSidebar();
  }

  /**
   * 变更body皮肤（顶部及左侧边栏）
   * 
   * @param cls: String 皮肤名称，见my_skins变量
   * @returns Boolean false to prevent link's default action
   */
  function change_bodyskin(cls) {
    $.each(my_skins, function (i) {
      $("body").removeClass(my_skins[i]);
    });

    $("body").addClass(cls);
    store(storagePrefix+'_Skin', cls);
    return false;
  }

  /**
   * 变更右侧边栏皮肤
   * 
   * @param cls: String [control-sidebar-dark|control-sidebar-light] 皮肤名称
   * @returns Boolean false to prevent link's default action
   */
  function change_controlsidebarskin(cls) {
    var sidebar = $(".control-sidebar");
    sidebar.removeClass("control-sidebar-dark");
    sidebar.removeClass("control-sidebar-light");
    sidebar.addClass(cls);
    store(storagePrefix+'_CSSkin', cls);
    return false;
  }

  /**
   * 为浏览器设置新的配置（写入cookies）
   * 
   * @param name: String 配置名称
   * @param val: String 配置值
   * @returns void
   */
  function store(name, val) {
    if (typeof (Storage) !== "undefined") {
      localStorage.setItem(name, val);
    } else {
      alert('部署配置失败，请尝试更换浏览器！');
    }
  }

  /**
   * 获取本地配置
   * 
   * @param name: String 配置名
   * @returns 配置值 | null
   */
  function get(name) {
    if (typeof (Storage) !== "undefined") {
      return localStorage.getItem(name);
    } else {
      alert('获取配置失败，请尝试更换浏览器！');
    }
  };

  /**
   * 绑定点击事件
   * 因为ickeck更换样式之后，所有绑定事件需要重新绑定，因此放置到函数中
   * 
   * @param null
   * @returns false
   */
  function bindClickEvent(){
    //添加布局管理器
    //稍微说明一下: 处于 ifChicked 状态的icheck的 :checked状态是反转的，因此需要用 ! 取反，应该是bug
    $('[data-control="layout"]').off();
    $('[data-control="layout"]').on('ifClicked', function () {console.log(!$(this).is(':checked'))
      change_layout('fixed');
      store(storagePrefix+'_Fixed', !$(this).is(':checked'));
    });

    //左侧边栏鼠标悬停控制器
    $("[data-control='expandOnHover']").off();
    $("[data-control='expandOnHover']").on('ifClicked', function () {
      toggle_hover(!$(this).is(':checked'));
      store(storagePrefix+'_ExpandOnHover', !$(this).is(':checked'));
    });

    //右侧边栏浮动触发控制器
    $('[data-control="control-sidebar-fixed"]').off();
    $('[data-control="control-sidebar-fixed"]').on('ifClicked', function () {
      change_layout('control-sidebar-open');
      var slide = !AdminLTE.options.controlSidebarOptions.slide;
      AdminLTE.options.controlSidebarOptions.slide = slide;
      if (!slide)
        $('.control-sidebar').removeClass('control-sidebar-open');
      store(storagePrefix+'_CSSlide', slide);
    });

    //右侧边栏皮肤控制器
    $("[data-control='control-sidebarskin']").off();
    $("[data-control='control-sidebarskin']").on('ifClicked', function () {
      var sidebar = $(".control-sidebar");
      if (!$(this).is(':checked') == false && sidebar.hasClass("control-sidebar-dark")) {
        change_controlsidebarskin("control-sidebar-light");
      };
      if (!$(this).is(':checked') == true && sidebar.hasClass("control-sidebar-light")) {
        change_controlsidebarskin("control-sidebar-dark");
      };
    });
    return false;
  }

  /**
   * 配置默认选项
   * 
   * @returns void
   */
  function setup() {
    //初始化（由于子函数使用了AdminLTE对象，所以必须放在$(function(){})函数中执行）
    $(function(){
      //读取cookies，加载配置参数
      var tmp = '';
      //激活开关美化
      var UserSkin='-blue';    //皮肤样式： blue|square(null)|purple|green|red|yellow|orange|aero|grey|pink
      tmp = get(storagePrefix+'_Skin');
      if(tmp){
        var LS = tmp.split('-')[1];    //返回值可能为： blue|black|purple|green|red|yellow
        switch(LS){
          case 'black':UserSkin = '-grey';break;
          default :UserSkin = '-'+LS;
        }
      }
      $("[data-control]").iCheck({checkboxClass: 'icheckbox_flat'+UserSkin});

      //固定布局开关选项
      tmp = get(storagePrefix+'_Fixed');
      if (tmp=="true"){    // 默认刷新页面nav栏不固定，如果存储的内容为true，则激活固定
        change_layout('fixed');
        $('[data-control="layout"]').iCheck('check');
      }
      //左侧边栏鼠标悬停选项
      tmp = get(storagePrefix+'_ExpandOnHover');
      if (tmp=="true"){
        toggle_hover(true);
        $('[data-control="expandOnHover"]').iCheck('check');
      }
      //右侧边栏浮动固定选项
      tmp = get(storagePrefix+'_CSSlide');
      if (tmp=="true"){
        $('[data-control="control-sidebar-fixed"]').iCheck('check');
        $('.control-sidebar').removeClass('control-sidebar-open');
        $('body').removeClass('control-sidebar-open');
        AdminLTE.options.controlSidebarOptions.slide = true;
      }else{
        AdminLTE.options.controlSidebarOptions.slide = false;
      }
      //右侧边栏皮肤样式
      tmp = get(storagePrefix+'_CSSkin');
      if (!tmp || tmp=='control-sidebar-dark'){
        change_controlsidebarskin('control-sidebar-dark');
        $('[data-control="control-sidebarskin"]').iCheck('check');
      }else{
        change_controlsidebarskin('control-sidebar-light');
        $('[data-control="control-sidebarskin"]').iCheck('uncheck');
      }
      //顶部及左侧边栏皮肤样式
      tmp = get(storagePrefix+'_Skin');
      if (tmp && $.inArray(tmp, my_skins))
        change_bodyskin(tmp);
    });

    //添加更换皮肤监听器
    $("[data-skin]").off();
    $("[data-skin]").on('click', function (e) {
      e.preventDefault();
      var skin = $(this).data('skin');
      var UserSkin='-blue';
      change_bodyskin(skin);
      var LS = skin.split('-')[1];
      switch(LS){
        case 'black':UserSkin = '-grey';break;
        default :UserSkin = '-'+LS;
      }
      $("[data-control]").iCheck({checkboxClass: 'icheckbox_flat'+UserSkin});
      bindClickEvent();
    });

    bindClickEvent();
  }
})(jQuery, $.AdminLTE);