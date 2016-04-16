/* http://github.com/mindmup/bootstrap-wysiwyg */
/*global jQuery, $, FileReader*/
/*jslint browser:true*/
/**
* 更新记录
* 2016-04-13 sam 1. 添加 createToolBar 方法，自动生成工具栏，并且定义工具栏按钮的方法
*                2. 添加 fontItems 选项，使得字体列表可以定制化
*                3. 添加 toolbarItems 选项，使得工具栏可以定制化
*                4. 由于原来的 bindHotkeys 方法有问题，所以重新改写了这个方法
*                5. 添加更改前景色和背景色按钮
* 2016-04-14 sam 1. 删除工具条的 btn-toolbar 类，避免因为 float:left 产生的工具栏分行错位
*                2. 针对 execCommand 加入快捷键命令校验，避免未知的命令产生异常
*                3. dragAndDropImages 参数失效化
*                4. 定义版本号为 V1.0sam
*/
(function ($) {
    'use strict';
    var readFileIntoDataUrl = function (fileInfo) {
        var loader = $.Deferred(),
            fReader = new FileReader();
        fReader.onload = function (e) {
            loader.resolve(e.target.result);
        };
        fReader.onerror = loader.reject;
        fReader.onprogress = loader.notify;
        fReader.readAsDataURL(fileInfo);
        return loader.promise();
    };
    $.fn.cleanHtml = function () {
        var html = $(this).html();
        return html && html.replace(/(<br>|\s|<div><br><\/div>|&nbsp;)*$/, '');
    };
    $.fn.wysiwyg = function (userOptions) {
        var editor = this,
            selectedRange,
            options,
            toolbarBtnSelector,
            updateToolbar = function () {
                if (options.activeToolbarClass) {
                    $(options.toolbarSelector).find(toolbarBtnSelector).each(function () {
                        var command = $(this).data(options.commandRole);
                        if (document.queryCommandState(command)) {
                            $(this).addClass(options.activeToolbarClass);
                        } else {
                            $(this).removeClass(options.activeToolbarClass);
                        }
                    });
                }
            },
            execCommand = function (commandWithArgs, valueArg) {
                var commandArr = commandWithArgs.split(' '),
                    command = commandArr.shift(),
                    args = commandArr.join(' ') + (valueArg || '');
                if( ('|bold|italic|underline|undo|redo|justifyleft|justifyright|justifycenter|justifyfull|outdent|indent|').indexOf(command.toLowerCase())>0 ||
                ('|fontsize|fontname|forecolor|backcolor|strikethrough|insertunorderedlist|insertorderedlist|createlink|unlink|removeformat|').indexOf(command.toLowerCase())>0 ){
	                document.execCommand(command, 0, args);
	                updateToolbar();
	            }
            },
            bindHotkeys = function (hotKeys) {
            	editor.keydown(function(event) {
            		if( editor.attr('contenteditable') && editor.is(':visible') ){
	            		var KeyStr='', ThisHotKey=null, ThisCommand=null;
	            		if( event.ctrlKey )
	        				KeyStr += 'ctrl+';
	        			if( event.shiftKey )
	        				KeyStr += 'shift+';
	        			if( event.altKey )
	        				KeyStr += 'alt+';
	        			switch(event.which){
	        				case 9: KeyStr += 'tab'; break;
	        				default: KeyStr += String.fromCharCode(event.which).toLowerCase();break;
	        			}
	        			if( !KeyStr )
	        				return false;
	            		$.each(hotKeys, function (hotkey, command) {
	            			if( hotkey.toLowerCase() === KeyStr ){
	            				ThisHotKey = KeyStr;
	            				ThisCommand = command;
	            				return false;
	            			}
	            		});
	            		if( ThisHotKey && ThisCommand ){
	            			event.preventDefault();
		                	event.stopPropagation();
	            			execCommand(ThisCommand);
	            		}
	            	}
				})
				.keyup(function(event) {
					if( editor.attr('contenteditable') && editor.is(':visible') ){
            			event.preventDefault();
                		event.stopPropagation();
            		}
				});
            },
            getCurrentRange = function () {
                var sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    return sel.getRangeAt(0);
                }
            },
            saveSelection = function () {
                selectedRange = getCurrentRange();
            },
            restoreSelection = function () {
                var selection = window.getSelection();
                if (selectedRange) {
                    try {
                        selection.removeAllRanges();
                    } catch (ex) {
                        document.body.createTextRange().select();
                        document.selection.empty();
                    }

                    selection.addRange(selectedRange);
                }
            },
            insertFiles = function (files) {
                editor.focus();
                $.each(files, function (idx, fileInfo) {
                    if (/^image\//.test(fileInfo.type)) {
                        $.when(readFileIntoDataUrl(fileInfo)).done(function (dataUrl) {
                            execCommand('insertimage', dataUrl);
                        }).fail(function (e) {
                            options.fileUploadError("file-reader", e);
                        });
                    } else {
                        options.fileUploadError("unsupported-file-type", fileInfo.type);
                    }
                });
            },
            markSelection = function (input, color) {
                restoreSelection();
                if (document.queryCommandSupported('hiliteColor')) {
                    document.execCommand('hiliteColor', 0, color || 'transparent');
                }
                saveSelection();
                input.data(options.selectionMarker, color);
            },
            bindToolbar = function (toolbar, options) {
                toolbar.find(toolbarBtnSelector).click(function () {
                    restoreSelection();
                    editor.focus();
                    execCommand($(this).data(options.commandRole));
                    saveSelection();
                });
                toolbar.find('[data-toggle=dropdown]').click(restoreSelection);

                toolbar.find('input[type=text][data-' + options.commandRole + ']').on('webkitspeechchange change', function () {
                    var newValue = this.value; /* ugly but prevents fake double-calls due to selection restoration */
                    this.value = '';
                    restoreSelection();
                    if (newValue) {
                        editor.focus();
                        execCommand($(this).data(options.commandRole), newValue);
                    }
                    saveSelection();
                }).on('focus', function () {
                    var input = $(this);
                    if (!input.data(options.selectionMarker)) {
                        markSelection(input, options.selectionColor);
                        input.focus();
                    }
                }).on('blur', function () {
                    var input = $(this);
                    if (input.data(options.selectionMarker)) {
                        markSelection(input, false);
                    }
                });
                toolbar.find('input[type=file][data-' + options.commandRole + ']').change(function () {
                    restoreSelection();
                    if (this.type === 'file' && this.files && this.files.length > 0) {
                        insertFiles(this.files);
                    }
                    saveSelection();
                    this.value = '';
                });
            },
            initFileDrops = function () {
                editor.on('dragenter dragover', false)
                    .on('drop', function (e) {
                        var dataTransfer = e.originalEvent.dataTransfer;
                        e.stopPropagation();
                        e.preventDefault();
                        if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
                            insertFiles(dataTransfer.files);
                        }
                    });
            },
            createToolBar = function () {
                // 自动生成工具栏
                var FontListStr = '';
                $.each(options.fontItems, function (idx, fontName) {
                    FontListStr += '<li><a data-edit="fontName '+fontName+'" style="font-family:\''+fontName+'\'">'+fontName+'</a></li>';
                });
                var HtmlStr = '<div name="wysiwygEditor">';
                if( $.inArray('undo', options.toolbarItems)>=0 || $.inArray('redo', options.toolbarItems)>=0 ){
                    // 历史记录
                    HtmlStr += '<div class="btn-group">';
                    if( $.inArray('undo', options.toolbarItems)>=0 )
                        HtmlStr += '<a class="btn" data-edit="undo" title="撤销(Ctrl+Z)"><i class="fa fa-undo"></i></a>';
                    if( $.inArray('redo', options.toolbarItems)>=0 )
                        HtmlStr += '<a class="btn" data-edit="redo" title="重做(Ctrl+Y)"><i class="fa fa-repeat"></i></a>';
                    HtmlStr += '</div>'
                    + '<div class="btn-group"><div class="breaker"></div></div>';
                }
                if( $.inArray('font', options.toolbarItems)>=0 ){
                    // 字体
                    HtmlStr += '<div class="btn-group">'
                    + '<a class="btn dropdown-toggle" name="ChangeFont" data-toggle="dropdown" title="字体"><i class="fa fa-font"></i><b class="caret"></b></a>'
                    + '<ul class="dropdown-menu">';
                    HtmlStr += FontListStr;
                    HtmlStr += '</ul>'
                    + '</div>';
                }
                if( $.inArray('fontsize', options.toolbarItems)>=0 ){
                    // 字号
                    HtmlStr += '<div class="btn-group">'
                    + '<a class="btn dropdown-toggle" name="ChangeFontSize" data-toggle="dropdown" title="字号"><i class="fa fa-text-height"></i><b class="caret"></b></a>'
                    + '<ul class="dropdown-menu">'
                    + '<li><a data-edit="fontSize 7"><font size="7">特大</font></a></li>'
                    + '<li><a data-edit="fontSize 6"><font size="6">巨大</font></a></li>'
                    + '<li><a data-edit="fontSize 5"><font size="5">大号</font></a></li>'
                    + '<li><a data-edit="fontSize 4"><font size="4">较大</font></a></li>'
                    + '<li><a data-edit="fontSize 3"><font size="3">稍大</font></a></li>'
                    + '<li><a data-edit="fontSize 2"><font size="2">常规</font></a></li>'
                    + '<li><a data-edit="fontSize 1"><font size="1">最小</font></a></li>'
                    + '</ul>'
                    + '</div>';
                }
                if( $.inArray('frontcolor', options.toolbarItems)>=0 ){
                    // 前景颜色
                    HtmlStr += '<div class="btn-group">'
                    + '<a class="btn dropdown-toggle" name="ChangeFrontColor" data-toggle="dropdown" title="前景颜色"><span class="text-red"><i class="fa fa-object-ungroup"></i><b class="caret"></b></span></a>'
                    + '<ul class="dropdown-menu">'
                    + '<li class="bg-red"><a data-edit="foreColor red"><span class="text-white">红</span></a></li>'
                    + '<li class="bg-orange"><a data-edit="foreColor orange"><span class="text-white">橙</span></a></li>'
                    + '<li class="bg-yellow"><a data-edit="foreColor yellow"><span class="text-white">黄</span></a></li>'
                    + '<li class="bg-green"><a data-edit="foreColor green"><span class="text-white">绿</span></a></li>'
                    + '<li class="bg-teal"><a data-edit="foreColor teal"><span class="text-white">青</span></a></li>'
                    + '<li class="bg-blue"><a data-edit="foreColor blue"><span class="text-white">蓝</span></a></li>'
                    + '<li class="bg-purple"><a data-edit="foreColor purple"><span class="text-white">紫</span></a></li>'
                    + '<li class="bg-black"><a data-edit="foreColor black"><span class="text-white">黑</span></a></li>'
                    + '<li class="bg-gray"><a data-edit="foreColor gray"><span class="text-black">灰</span></a></li>'
                    + '<li><a data-edit="foreColor white"><span class="text-black">白</span></a></li>'
                    + '</ul>'
                    + '</div>';
                }
                if( $.inArray('backcolor', options.toolbarItems)>=0 ){
                    // 背景颜色
                    HtmlStr += '<div class="btn-group">'
                    + '<a class="btn dropdown-toggle" name="ChangeBackColor" data-toggle="dropdown" title="背景颜色"><span class="text-green"><i class="fa fa-object-group"></i><b class="caret"></b></span></a>'
                    + '<ul class="dropdown-menu">'
                    + '<li class="bg-red"><a data-edit="backColor red"><span class="text-white">红</span></a></li>'
                    + '<li class="bg-orange"><a data-edit="backColor orange"><span class="text-white">橙</span></a></li>'
                    + '<li class="bg-yellow"><a data-edit="backColor yellow"><span class="text-white">黄</span></a></li>'
                    + '<li class="bg-green"><a data-edit="backColor green"><span class="text-white">绿</span></a></li>'
                    + '<li class="bg-teal"><a data-edit="backColor teal"><span class="text-white">青</span></a></li>'
                    + '<li class="bg-blue"><a data-edit="backColor blue"><span class="text-white">蓝</span></a></li>'
                    + '<li class="bg-purple"><a data-edit="backColor purple"><span class="text-white">紫</span></a></li>'
                    + '<li class="bg-black"><a data-edit="backColor black"><span class="text-white">黑</span></a></li>'
                    + '<li class="bg-gray"><a data-edit="backColor gray"><span class="text-black">灰</span></a></li>'
                    + '<li><a data-edit="backColor white"><span class="text-black">白</span></a></li>'
                    + '</ul>'
                    + '</div>';
                }
                if( $.inArray('font', options.toolbarItems)>=0 || $.inArray('font', options.toolbarItems)>=0 )
                    HtmlStr += '<div class="btn-group"><div class="breaker"></div></div>';
                if( $.inArray('bold', options.toolbarItems)>=0 || $.inArray('italic', options.toolbarItems)>=0 ||
                $.inArray('strikethrough', options.toolbarItems)>=0 || $.inArray('underline', options.toolbarItems)>=0 ){
                    // 文字编辑
                    HtmlStr += '<div class="btn-group">';
                    if( $.inArray('bold', options.toolbarItems)>=0 )
                        HtmlStr += '<a class="btn" data-edit="bold" title="粗体(Ctrl+B)"><i class="fa fa-bold"></i></a>';
                    if( $.inArray('italic', options.toolbarItems)>=0 )
                        HtmlStr += '<a class="btn" data-edit="italic" title="斜体(Ctrl+I)"><i class="fa fa-italic"></i></a>';
                    if( $.inArray('strikethrough', options.toolbarItems)>=0 )
                        HtmlStr += '<a class="btn" data-edit="strikethrough" title="删除线"><i class="fa fa-strikethrough"></i></a>';
                    if( $.inArray('underline', options.toolbarItems)>=0 )
                        HtmlStr += '<a class="btn" data-edit="underline" title="下划线(Ctrl+U)"><i class="fa fa-underline"></i></a>';
                    HtmlStr += '</div>'
                    + '<div class="btn-group"><div class="breaker"></div></div>';
                }
                if( $.inArray('unorderedlist', options.toolbarItems)>=0 || $.inArray('orderedlist', options.toolbarItems)>=0 ||
                $.inArray('outdent', options.toolbarItems)>=0 || $.inArray('indent', options.toolbarItems)>=0 ){
                    // 列表及缩进
                    HtmlStr += '<div class="btn-group">';
                    if( $.inArray('unorderedlist', options.toolbarItems)>=0 )
                        HtmlStr += '<a class="btn" data-edit="insertunorderedlist" title="无序列表"><i class="fa fa-list-ul"></i></a>';
                    if( $.inArray('orderedlist', options.toolbarItems)>=0 )
                        HtmlStr += '<a class="btn" data-edit="insertorderedlist" title="有序列表"><i class="fa fa-list-ol"></i></a>';
                    if( $.inArray('outdent', options.toolbarItems)>=0 )
                        HtmlStr += '<a class="btn" data-edit="outdent" title="减少缩进(Shift+Tab)"><i class="fa fa-outdent"></i></a>';
                    if( $.inArray('indent', options.toolbarItems)>=0 )
                        HtmlStr += '<a class="btn" data-edit="indent" title="增加缩进(Tab)"><i class="fa fa-indent"></i></a>';
                    HtmlStr += '</div>'
                    + '<div class="btn-group"><div class="breaker"></div></div>';
                }
                if( $.inArray('alignleft', options.toolbarItems)>=0 || $.inArray('aligncenter', options.toolbarItems)>=0 ||
                $.inArray('alignright', options.toolbarItems)>=0 || $.inArray('alignjustify', options.toolbarItems)>=0 ){
                    // 对齐
                    HtmlStr += '<div class="btn-group">';
                    if( $.inArray('alignleft', options.toolbarItems)>=0 )
                        HtmlStr += '<a class="btn" data-edit="justifyleft" title="左对齐"><i class="fa fa-align-left"></i></a>';
                    if( $.inArray('aligncenter', options.toolbarItems)>=0 )
                        HtmlStr += '<a class="btn" data-edit="justifycenter" title="居中"><i class="fa fa-align-center"></i></a>';
                    if( $.inArray('alignright', options.toolbarItems)>=0 )
                        HtmlStr += '<a class="btn" data-edit="justifyright" title="右对齐"><i class="fa fa-align-right"></i></a>';
                    if( $.inArray('alignjustify', options.toolbarItems)>=0 )
                        HtmlStr += '<a class="btn" data-edit="justifyfull" title="两端对齐"><i class="fa fa-align-justify"></i></a>';
                    HtmlStr += '</div>'
                    + '<div class="btn-group"><div class="breaker"></div></div>';
                }
                // 高级功能
                if( $.inArray('addlink', options.toolbarItems)>=0 || $.inArray('unlink', options.toolbarItems)>=0 ){
                    HtmlStr += '<div class="btn-group">'
                    if( $.inArray('unlink', options.toolbarItems)>=0 ){
                        HtmlStr += '<a class="btn dropdown-toggle" name="AddLink" data-toggle="dropdown" title="添加链接"><i class="fa fa-link"></i></a>'
                        + '<div class="dropdown-menu">'
                        + '<div class="input-group">'
                        + '<input class="form-control" placeholder="URL" type="text" data-edit="createLink"/>'
                        + '<span class="input-group-btn">'
                        + '<button class="btn btn-primary" type="button">添加</button>'
                        + '</span>'
                        + '</div>'
                        + '</div>';
                    }
                    if( $.inArray('unlink', options.toolbarItems)>=0 )
                        HtmlStr += '<a class="btn" data-edit="unlink" title="移除链接"><i class="fa fa-unlink"></i></a>';
                    HtmlStr += '</div>';
                }
                if( $.inArray('insertimage', options.toolbarItems)>=0 ){
                    HtmlStr += '<div class="btn-group">'
                    + '<a class="btn" name="InsertImage" title="插入图片"><i class="fa fa-picture-o"></i></a>'
                    + '</div>';
                }
                if( $.inArray('unformat', options.toolbarItems)>=0 ){
                    HtmlStr += '<div class="btn-group">'
                    + '<a class="btn" data-edit="removeformat" title="清除格式"><i class="fa fa-paint-brush"></i></a>'
                    + '</div>'
                }
                if( $.inArray('source', options.toolbarItems)>=0 ){
                    HtmlStr += '<div class="btn-group">'
                    + '<a class="btn" name="ToggleSource" title="源码"><i class="fa fa-code"></i></a>'
                    + '</div>'
                }
                HtmlStr += '</div>';
                // 初始化并美化
                editor.before(HtmlStr);
                $(options.toolbarSelector).find('a.btn').tooltip();
                // 定义一些方法
                // 1. 查看源码 按钮 name="ToggleSource"
                $(options.toolbarSelector).find('[name="ToggleSource"]').click(function(event) {
                  if( !editor.is(':hidden') ){
                    var HtmlStr = '<textarea name="wysiwygEditor-TempSource" class="form-control" rows="15">';
                    var HtmlArr = editor.cleanHtml().split('\n');
                    $.each(HtmlArr, function(i, line) {
                      HtmlStr += line.replace(/^\s+/,'')+'\n';
                    });
                    HtmlStr += '</textarea>';
                    editor.after(HtmlStr);
                    editor.hide();
                    $(options.toolbarSelector).find('.btn-group').hide();
                    $(this).parent('div.btn-group').show();
                  }else{
                    var HtmlStr = $('textarea[name="wysiwygEditor-TempSource"]').val();
                    editor.html(HtmlStr);
                    $('textarea[name="wysiwygEditor-TempSource"]').remove();
                    editor.show();
                    $(options.toolbarSelector).find('.btn-group').show('slow');
                  }
                });
                // 2. 绑定上传图片按钮为回调函数
                $(options.toolbarSelector).find('[name="InsertImage"]').click(function(event) {
                    if( options.insertImage )
                        options.insertImage();
                });
            };
        options = $.extend({}, $.fn.wysiwyg.defaults, userOptions);
        createToolBar();
        toolbarBtnSelector = 'a[data-' + options.commandRole + '],button[data-' + options.commandRole + '],input[type=button][data-' + options.commandRole + ']';
        bindHotkeys(options.hotKeys);
        // if (options.dragAndDropImages) {
        //     initFileDrops();
        // }
        bindToolbar($(options.toolbarSelector), options);
        editor.attr('contenteditable', true)
            .on('mouseup keyup mouseout', function () {
                saveSelection();
                updateToolbar();
            });
        $(window).bind('touchend', function (e) {
            var isInside = (editor.is(e.target) || editor.has(e.target).length > 0),
                currentRange = getCurrentRange(),
                clear = currentRange && (currentRange.startContainer === currentRange.endContainer && currentRange.startOffset === currentRange.endOffset);
            if (!clear || isInside) {
                saveSelection();
                updateToolbar();
            }
        });
        return this;
    };
    $.fn.wysiwyg.defaults = {
        hotKeys: {
            'ctrl+b': 'bold',
            'ctrl+i': 'italic',
            'ctrl+u': 'underline',
            'ctrl+z': 'undo',
            'ctrl+y': 'redo',
            'ctrl+l': 'justifyleft',
            'ctrl+r': 'justifyright',
            'ctrl+e': 'justifycenter',
            'ctrl+j': 'justifyfull',
            'shift+tab': 'outdent',
            'tab': 'indent'
        },
        toolbarSelector: '[name="wysiwygEditor"]',
        toolbarItems: ['undo','redo','font','fontsize','frontcolor','backcolor','bold','italic','strikethrough','underline','unorderedlist','orderedlist',
        'outdent','indent','alignleft','aligncenter','alignright','alignjustify','addlink','unlink','insertimage','unformat','source'],
        commandRole: 'edit',
        activeToolbarClass: 'btn-info',
        selectionMarker: 'edit-focus-marker',
        selectionColor: 'darkgrey',
        dragAndDropImages: true,
        fontItems: ['宋体', '幼圆', '黑体', '楷体', '隶书',  '华文彩云', '华文细黑', '华文行楷',
        'Sans', 'Arial', 'Arial Black', 'Courier New', 'Comic Sans MS', 'Helvetica', 'Tahoma', 'Times New Roman', 'Verdana'],
        insertImage: null,
        fileUploadError: function (reason, detail) { console.log("File upload error", reason, detail); }
    };
}(window.jQuery));
