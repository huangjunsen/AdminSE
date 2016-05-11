$(function(){
  //参数js内部全局变量

  //自定义函数
  var sortableUpdate = function(){
    $('[name="sortableGird"]').sortable();
    $('[name="sortableGird"]').sortable('destroy');
    $.each($('[name="sortableGird"]'), function(i, sortableGird) {
      if($(this).children('div.box').length === 1){
        $(this).children('div.box').removeAttr('name');
        $(this).find('.box-title').html('不可拖动的box');
      }else{
        $(this).children('div.box').attr('name', 'dragableBox');
        $(this).find('.box-title').html('可拖动的box');
      }
    });
    $('[name="sortableGird"]').sortable({
      connectWith: '[name="sortableGird"]',
      handle: '.box-header',
      items: '[name="dragableBox"]',
      update: sortableUpdate,
      sort: function(){
        $('#dropzone').removeClass( "dz-active" );
      }
    });
  }
  /**
  * main
  * 
  * @return false
  */
  function startUp(){
    //初始化菜单
    $(".sidebar-menu").html(getMenuStr());
    highLightMenu('DragAndDrop');

    hljs.initHighlightingOnLoad();

    $('button[name="ToggleNext"]').click(function(event) {
      var CodeObj = $(this).next();
      if(CodeObj.is(':hidden')){
        CodeObj.slideDown('slow');
      }else{
        CodeObj.slideUp('slow');
      }
    });
    
    sortableUpdate();
    $('[name="sortableGird"]>div.box').attr('name', 'dragableBox');

    $('#LayoutManager p[name="drag"]').draggable({ 
      appendTo: '#dropzone',
      helper: 'clone'
    });
    $('#dropzone').droppable({
      activeClass: 'dz-active',
      hoverClass: 'dz-hover',
      accept: ':not(.ui-sortable-helper)',
      drop: function(e, ui){
        var ThisStyle = ui.draggable.text().split(' '), GridStr='<div class="row">';
        if(ThisStyle[0] == "自定义"){   //如果拖动是是自定义按钮，添加一整行，让用户自行输入
          GridStr += '<div class="col-xs-12">'
            + '<button type="button" class="btn btn-primary" name="EditLayout">'
            + '<i class="fa fa-plus"></i></button>'
            + '</div>';
        }else{   //否则，就是固定的模板样式，直接生成就好
          $.each(ThisStyle, function(i, gridNum) {
            GridStr += '<div class="col-xs-'+gridNum+'">'
              + '<button type="button" class="btn btn-primary btn-block" name="AddKey"'
              + ' data-toggle="popover" data-placement="bottom">添加内容</button>'
              + '</div>';
          });
        }
        GridStr += '</div>';
        var HtmlStr = '<div class="drop-item">'
          + GridStr
          + '<button type="button" class="btn btn-danger" name="remove">'
          + '<i class="fa fa-trash-o"></i></button></div>',
          HtmlObj = $(HtmlStr);
          HtmlObj.find('button[name="remove"]').click(function(event) {
            $(this).closest('div.drop-item').remove();
          });
        $(this).append(HtmlObj);
      }
    }).sortable({
      items: '.drop-item',
      sort: function(){
        $( this ).removeClass( "dz-active" );
      }
    });

    $('#PreViewBtn').click(function(event) {
      // 添加预览脚本
    });

    return false;
  }

  //main
  startUp();
});
