$(function(){
  //参数js内部全局变量
  var vivus1;

  //自定义函数
  function resetVivus(){
    var options = {
      type: $('button[name="vivus-type"].btn-primary').html(),
      pathTimingFunction: Vivus[$('button[name="vivus-path"].btn-primary').html()],
      animTimingFunction: Vivus[$('button[name="vivus-anim"].btn-primary').html()],
    }

    vivus1 && vivus1.stop().destroy();
    vivus1 = new Vivus('ex-vivus1', options);
    return false;
  };

  /**
  * main
  * 
  * @return false
  */
  function startUp(){
    //初始化菜单
    $(".sidebar-menu").html(getMenuStr());
    highLightMenu('Plugins');

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

    $('[name^="iCheck"]').iCheck({
      checkboxClass:'icheckbox_flat-blue',
      radioClass:'iradio_flat-blue',
    });

    // $('img[src="image_origin.png"]')[0].src = placeholder.getData();

    var LettersOptions = {
      size : 100,
      weight : 10,
      color: ['#E65454','#4FB3A4','#F5B977','#FDFC7F','#6DD3CE','#C8E9A0','#F7A278','#A13D63'],
      duration: 0.8,
      delay: 0.5,
      fade: 0,
      easing: d3_ease.easeSinOut.ease,
      rounded: true
    };
    LetterObj = new Letters($('#Letters')[0], LettersOptions);
    LetterObj.show({callback:function(){console.log('Letter Done')}});

    $('#Letters').click(function(event) {
      LetterObj.hide({
        duration: 1,
        delay: 0,
        fade: 1,
        easing: d3_ease.easeExpOut.ease,
        callback: function() {
          LetterObj.show();
        }
      });
    });

    $('button[name="vivus-type"]').click(function(event) {
      $('button[name="vivus-type"]').removeClass('btn-primary').addClass('btn-default');
      $(this).removeClass('btn-default').addClass('btn-primary');
      resetVivus();
    });
    $('button[name="vivus-path"]').click(function(event) {
      $('button[name="vivus-path"]').removeClass('btn-primary').addClass('btn-default');
      $(this).removeClass('btn-default').addClass('btn-primary');
      resetVivus();
    });
    $('button[name="vivus-anim"]').click(function(event) {
      $('button[name="vivus-anim"]').removeClass('btn-primary').addClass('btn-default');
      $(this).removeClass('btn-default').addClass('btn-primary');
      resetVivus();
    });

    vivus1 = new Vivus('ex-vivus1');

    $('#ex-Scroll').slimScroll({height:'100px'});

    return false;
  }

  //main
  startUp();
});
