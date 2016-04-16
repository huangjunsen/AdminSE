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
    highLightMenu('CalendarAndTime');

    hljs.initHighlightingOnLoad();

    // bind button
    $('button[name="ToggleNext"]').click(function(event) {
      var CodeObj = $(this).next();
      if(CodeObj.is(':hidden')){
        CodeObj.slideDown('slow');
      }else{
        CodeObj.slideUp('slow');
      }
    });

    $('#DateTimePicker').datetimepicker({
      language: 'zh-CN'
    });

    return false;
  }

  //main
  startUp();
});
