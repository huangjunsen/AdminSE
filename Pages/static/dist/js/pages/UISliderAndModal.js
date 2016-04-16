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
    highLightMenu('UISliderAndModal');

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

    // JquerySlider
    $('#JquerySlider1').slider({
      range: "min",
      max: 10,
      value: 1,
    });
    $('#JquerySlider2').slider({
      range: "min",
      max: 10,
      value: 2,
      step: 2,
      change: function(){
        console.log('change:',$(this).slider('value'));
      },
      slide: function(){
        console.log('slide:',$(this).slider('value'));
      },
      start: function(){
        console.log('start:',$(this).slider('value'));
      },
      stop: function(){
        console.log('stop:',$(this).slider('value'));
      },
    });
    $('#JquerySlider3').slider({
      range: "min",
      max: 10,
      range: true,
      values: [3,5],
    });
    var aa=$('#JquerySlider4').slider({
      range: "min",
      max: 10,
      value: 3,
      orientation: "vertical",
    });
    $('#JquerySlider5').slider({
      range: "min",
      max: 10,
      value: 4,
      step: 2,
      orientation: "vertical",
    });
    $('#JquerySlider6').slider({
      range: "min",
      max: 10,
      range: true,
      values: [3,7],
      orientation: "vertical",
    });


    // bootstrapSlider
    $('.slider').bootstrapSlider();
    $('#BootstrapSlider1').bootstrapSlider({
      id: 'primary',
      max: 100,
      value: 20,
      tooltip: 'hide',
    });
    $('#BootstrapSlider2').bootstrapSlider({
      id: 'success',
      max: 100,
      value: 30,
      tooltip: 'show',
      handle: 'triangle',
    });
    $('#BootstrapSlider3').bootstrapSlider({
      id: 'info',
      max: 100,
      value: 40,
      step: 10,
      tooltip: 'show',
      handle: 'square',
    });
    $('#BootstrapSlider4').bootstrapSlider({
      id: 'warning',
      min: -200,
      max: 200,
      range: true,
      value: [-100,100],
      step: 10,
      tooltip: 'show',
      handle: 'custom',
      tooltip_split: true
    });
    $('#BootstrapSlider5').bootstrapSlider({
      id: 'danger',
      max: 100,
      value: 20,
      tooltip: 'hide',
      orientation: 'vertical'
    });
    $('#BootstrapSlider6').bootstrapSlider({
      max: 100,
      value: 30,
      tooltip: 'show',
      orientation: 'vertical'
    });
    $('#BootstrapSlider7').bootstrapSlider({
      id: 'purple',
      max: 100,
      value: 40,
      step: 10,
      tooltip: 'show',
      orientation: 'vertical'
    });
    $('#BootstrapSlider8').bootstrapSlider({
      id: 'success',
      min: -200,
      max: 200,
      range: true,
      value: [-100,100],
      step: 10,
      tooltip: 'always',
      tooltip_split: true,
      orientation: 'vertical'
    });

    $('#ShowModal').click(function(event) {
      $('#myModal').modal('show');
    });


    return false;
  }

  //main
  startUp();
});
