$(function(){
  //参数js内部全局变量

  //自定义函数

  /**
  * main
  * 
  * @return false
  */
  function startUp(){
    //初始化菜单
    $(".sidebar-menu").html(getMenuStr());
    highLightMenu('Layout');

    hljs.initHighlightingOnLoad();

    return false;
  }

  //main
  startUp();
});
