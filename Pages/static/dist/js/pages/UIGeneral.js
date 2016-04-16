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
    highLightMenu('UIGeneral');

    hljs.initHighlightingOnLoad();

    // bind button
    $('button[name="ShowCode"]').click(function(event) {
      var CodeObj = $(this).next('pre');
      if(CodeObj.is(':hidden')){
        CodeObj.slideDown('slow');
      }else{
        CodeObj.slideUp('slow');
      }
    });

    // $('#myTabs2').tab;
    $('#myTabs2 a').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    });

    $('[data-toggle="popover"]').popover();

    var HtmlStr = '<p>段落1</p><button class="btn btn-danger">按钮1</button>';
    $('#popover3').popover('destroy');
    $('#popover3').popover({
      html: true,
      title: '<h3>标题</h3>',
      content: HtmlStr
    });


    return false;
  }

  //main
  startUp();
});
