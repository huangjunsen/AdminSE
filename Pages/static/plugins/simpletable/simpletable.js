/**
* simpletable js
* 
* 修改记录：
* 2016-04-14 sam 1. 重写所有代码，将该js封装成jquery插件
* 
*/
(function ($) {
    'use strict';
    var MethodDict = {
        addHover: function(tableObj){
            tableObj.find('tr').hover(function() {
                $(this).addClass('tr-hover');
            }, function() {
                $(this).removeClass('tr-hover');
            });
        },
        addColumn: function(tableObj, options){    // options 是一系列参数
            var defaultOptions = {
                colCount:1,
                contents: [],
                hasID: false,
                headIDPrefix: 'H',
                lineIDPrefix: 'L',
                startID: 0,
            };
            options = $.extend(true, defaultOptions, options);
            for (var i = 0; i < options.colCount; i++) {
                var colID = options.startID + i;
                tableObj.find('tr').each(function(j, tableline) {
                    if($(this).find('th').length){  //标题行
                        var HtmlStr = '<th'+(options.hasID?' id="'+options.headIDPrefix+colID+'"':'')+'>';
                        HtmlStr += ((options.contents.length>i && options.contents[i].length>j)?options.contents[i][j]:'th')
                        HtmlStr += '</th>';
                        $(this).append(HtmlStr);
                    }else{  //非标题行
                        var HtmlStr = '<td'+(options.hasID?' id="'+options.lineIDPrefix+colID+'"':'')+'>';
                        HtmlStr += ((options.contents.length>i && options.contents[i].length>j)?options.contents[i][j]:'td')
                        HtmlStr += '</td>';
                        $(this).append(HtmlStr);
                    }
                });
            };
        },
        rowspan: function(tableObj, option){    // option 为 all 或数字，指定需要合并的列序号（起始为0）
            if( (option+'').toLowerCase()!='all' && typeof option !== 'number' )
                return false;

            var tableDom = tableObj[0];
            var RowCnt=tableDom.rows.length,ColCnt=tableDom.rows[0].cells.length;
            var _startSpan = function(tableDom, ColIndex){
                var SpanCnt=1,LastVal=null,ThisVal=null;
                for (var i = 0; i < RowCnt; i++) {
                    ThisVal = tableDom.rows[i].cells[ColIndex].innerHTML;
                    if( ThisVal===LastVal ){
                        $(tableDom.rows[i].cells[ColIndex]).hide();
                        tableDom.rows[i-SpanCnt].cells[ColIndex].rowSpan = tableDom.rows[i-SpanCnt].cells[ColIndex].rowSpan+1;
                        SpanCnt++;
                    }else{
                        LastVal = ThisVal;
                        SpanCnt = 1;
                    }
                };
            }
            if( (option+'').toLowerCase()=='all' ){
                for (var i = 0; i < ColCnt; i++) {
                    _startSpan(tableDom,i);
                };
            }else{
                _startSpan(tableDom,option);
            }
        },
        colspan: function(tableObj, option){    // option 为 all 或数字，指定需要合并的行序号（起始为0，含标题）
            if( (option+'').toLowerCase()!='all' && typeof option !== 'number' )
                return false;

            var tableDom = tableObj[0];
            var RowCnt=tableDom.rows.length,ColCnt=tableDom.rows[0].cells.length;
            var _startSpan = function(tableDom, RowIndex){
                var SpanCnt=1,LastVal=null,ThisVal=null;
                for (var i = 0; i < ColCnt; i++) {
                    ThisVal = tableDom.rows[RowIndex].cells[i].innerHTML;
                    if( ThisVal===LastVal ){
                        $(tableDom.rows[RowIndex].cells[i]).hide();
                        tableDom.rows[RowIndex].cells[i-SpanCnt].colSpan = tableDom.rows[RowIndex].cells[i-SpanCnt].colSpan+1;
                        SpanCnt++;
                    }else{
                        LastVal = ThisVal;
                        SpanCnt = 1;
                    }
                };
            }
            if( (option+'').toLowerCase()=='all' ){
                for (var i = 0; i < RowCnt; i++) {
                    _startSpan(tableDom,i);
                };
            }else{
                _startSpan(tableDom,option);
            }
        },
        rowactive: function(tableObj, option){    // option 为 all 或数字，指定需要激活的行序号（起始为0，含标题）
            if( (option+'').toLowerCase()!='all' && typeof option !== 'number' )
                return false;

            if( (option+'').toLowerCase()=='all' ){
                tableObj.find('tr').addClass('tr-active');
            }else{
                tableObj.find('tr').eq(option).addClass('tr-active');
            }
        },
        rowdisable: function(tableObj, option){    // option 为 all 或数字，指定需要禁用的行序号（起始为0，含标题）
            if( (option+'').toLowerCase()!='all' && typeof option !== 'number' )
                return false;

            if( (option+'').toLowerCase()=='all' ){
                tableObj.find('tr').addClass('tr-disable');
            }else{
                tableObj.find('tr').eq(option).addClass('tr-disable');
            }
        }
    };
    $.fn.SimpleTable = function (method, userOptions) {
        if(typeof method === "string") {
            // 传入为字符串，则使用方法列表中的方法
            MethodDict[method](this, userOptions);
        }else{
            // 否则，则传入的是一系列的参数，初始化参数并进行表格的初始化
            userOptions = method;
            var tableObj = this,
                options,
                _startSimpleTable = function(){
                    tableObj.addClass('simpletable');
                    if(options.hover)
                        MethodDict['addHover'](tableObj);
                    if(options.padding)
                        _tightPadding(options.padding);
                    if(!options.border)
                        _noborder();
                    if(options.color)
                        _addColor(options.color);
                    if(options.align)
                        _addAlign(options.align);
                },
                _tightPadding = function(paddingOption){
                    var pname = paddingOption.toLowerCase();
                    if( ('|no|tiny|tight|').indexOf(pname) ){
                        tableObj.addClass(pname+'padding');
                    }
                },
                _noborder = function(){
                    tableObj.addClass('noborder');
                },
                _addColor = function(Color){
                    var cname = Color.toLowerCase();
                    if( ('|primary|success|info|warning|danger|').indexOf(cname) ){
                        tableObj.addClass('tab-'+cname);
                    }
                },
                _addAlign = function(Align){
                    var aname = Align.toLowerCase();
                    if( ('|left|right|').indexOf(aname) ){
                        tableObj.addClass('text-'+aname);
                    }
                };
            options = $.extend({}, $.fn.SimpleTable.defaults, userOptions);
            _startSimpleTable();
        }
    };
    $.fn.SimpleTable.defaults = {
        hover: false,
        padding: false,
        border: true,
        color: '',
        align: 'center',
    };
}(window.jQuery));