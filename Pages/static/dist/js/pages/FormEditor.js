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
    highLightMenu('FormEditor');

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

    $('#wysiwygEditor').wysiwyg({
      insertImage: function(){console.log('click insertImage button')}
    });

    $('#Write').click(function(event) {
      $('#wysiwygEditor').html('<h1>Hello World！</h1>');
    });
    $('#Read').click(function(event) {
      alert($('#wysiwygEditor').html());
    });

    return false;
  }

  //main
  startUp();
});
