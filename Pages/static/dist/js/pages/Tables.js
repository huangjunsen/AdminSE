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
    highLightMenu('Tables');

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

    $('#SimpleTable1').SimpleTable({
      hover: true,
      padding: false,
      border: true,
      color: ''
    });
    $('#SimpleTable2').SimpleTable({
      color:'warning',
      align: 'left',
    });
    $('#SimpleTable2').SimpleTable('addHover');
    

    $('#SimpleTable3').SimpleTable({
      color:'danger',
      padding: 'tiny',
    });
    $('#SimpleTable3').SimpleTable('rowspan','ALL');
    $('#SimpleTable3').SimpleTable('colspan','ALL');

    $('#DataTable1').DataTable();

    $('#DataTable2').DataTable();
    $('#DataTable2').SimpleTable({
      hover: true,
      color: 'success',
      padding: 'tiny'
    });

    return false;
  }

  //main
  startUp();
});
