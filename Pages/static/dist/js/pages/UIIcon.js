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
    highLightMenu('UIIcon');

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

    $('#FontAwesome i.fa').parent('div').hover(function() {
      $(this).addClass('press-hover')
      // $(this).addClass('bg-green-gradient');
      // $(this).children('i').addClass('fa-2x');
    }, function() {
      $(this).removeClass('press-hover')
      // $(this).removeClass('bg-green-gradient');
      // $(this).children('i').removeClass('fa-2x');
    });


    return false;
  }

  //main
  startUp();
});
