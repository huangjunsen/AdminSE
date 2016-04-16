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
    highLightMenu('Examples-WelcomePage');

    hljs.initHighlightingOnLoad();

    $('.content-header').hide();
    $('#grid').show();

    var HeadingElement = $('#grid #Heading')[0];
    var ContentObj = $('#grid #Content');
    
    var LettersOptions = {
      size : 100,
      weight : 10,
      color: ['#E65454','#4FB3A4','#F5B977','#FDFC7F','#6DD3CE','#C8E9A0','#F7A278','#A13D63'],
      duration: 0.8,
      delay: 0.5,
      fade: 0,
      easing: d3_ease.easeSinOut.ease
    };

    var PDCALetters;
    PDCALetters = new Letters(HeadingElement, LettersOptions);

    ContentObj.hide();

    $('.content-wrapper').click(function(event) {
      ContentObj.fadeOut('slow');
      PDCALetters.hide({
        duration: 1,
        delay: 0,
        fade: 1,
        easing: d3_ease.easeExpOut.ease,
        callback: function() {
          PDCALetters.show({
            callback: function(){
              ContentObj.fadeIn('slow');
            }
          });
        }
      });
    });

    $('.content-wrapper').trigger('click');

    return false;
  }

  //main
  startUp();
});
