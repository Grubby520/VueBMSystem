/**
    page 分页
    page({
        url:publicObj.rootPath+"/security/loophole_scan_manage/getScanListData/"+ID,
        id:'vulnScan_manage_scanList_table',
        method:'get'
    })
**/

(function(factory){
    if( typeof module === "object" && typeof module.exports === "object"){
        module.exports = factory()
    }else{
        factory()
    }
})(function(){

    var page = function(opts){
        // 默认参数
        var defaults = {
            id:'', // 内容id
            pageItemClass:'Page-item', // 页码class
            preClass:'pre', // 上一页
            nextClass:'next', // 上一页
            lastClass:'last', // 最后一页
            firstClass:'first', // 最后一页
        }

        var options = $.extend({}, defaults, opts); // 合并参数

        // 设置获取页码的参数
        function setNbr(target){
            if(options.params){
                options.params.currentPage = target
            }else{
                options.params={}
                options.params.currentPage = target
            }
        }

        $('#'+options.id).off('click').on('click','.'+options.pageItemClass+':not(.cur)',function(e){
            var  getTableList = require('@/js/componet/get_table_list.js').getTableList
            var target = $(e.target).text()
            var targetClass = $(e.target).attr('class')
            var cur = $('#'+options.id+' .cur').text()
            var total = $('#'+options.id+' .total').text()

            if(!isNaN(Number(target))){ // 是数字
                setNbr(target)
            }else{
                if(targetClass.indexOf(preClass)>=0){
                    cur --
                    if( cur <= 0) return
                    setNbr(cur)
                }else if(targetClass.indexOf(nextClass)>=0){
                    cur ++
                    if( cur > total) return
                    setNbr(cur)
                }else if(targetClass.indexOf(firstClass)>=0){
                    setNbr(1)
                }else if(targetClass.indexOf(lastClass)>=0){
                    setNbr(total)
                }
            }

            getTableList(options)
        })


        $('#'+options.id).off('change').on('change', '.Page-select', function(){
             var target = $(this).val()
             setNbr(target)
             getTableList(options)
        })

    }

    return {
        page
    }
})
