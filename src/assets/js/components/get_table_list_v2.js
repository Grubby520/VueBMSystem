/**
    获取table
    getTableList({
        url:publicObj.rootPath+"/security/loophole_scan_manage/getAffectedAssetsTable/"+ID,
        id:'vulnScan_manage_affectedAssets_table',
        params:{
            type:0
        },
        method:'get'
    })
**/

(function(fn){
    if(typeof module === "object" && typeof module.exports === "object"){
        module.exports = fn()
    }else{
        fn()
    }
})(function(){
    function getTableAjax(opts){
        return $.ajax({
            method:opts.method?opts.method:'get',
            url:opts.url,
            data:opts.params_concatPageNbr? opts.params_concatPageNbr:opts.params
        }).done(function(data){
            $('#'+opts.id).html(data)
            $('#'+opts.id+' tbody td').each(function(){
                if($.trim($(this).html()) == ''){
                    $(this).text('-')
                }
            })
            page(opts)
        })
    }

    var getTableList = function(opts){

        // 点击搜索
        $(document).on('click','#search', function(e){
            e.preventDefault()
            Object.assign(opts,{params:$("form").serialize()})
            getTableAjax(opts).then(function(){})
        })

        $(document).on('keyup', function(e){
            e.preventDefault()
            if (e.keyCode == 13) {//按键信息对象以参数的形式传递进来了
                Object.assign(opts,{params:$("form").serialize()})
                getTableAjax(opts).then(function(){})
            }
        })

        return getTableAjax(opts)
    }

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

            // if(options.method == 'get'){
            //     options.params+='&currentPage='+target
            // }else{

            // }
            if(options.params){
                options.params_concatPageNbr = options.params+'&currentPage='+target
            }else{
                options.params={}
                options.params_concatPageNbr = options.params+'&currentPage='+target
            }
        }

        $('#'+options.id).off('click').on('click','.'+options.pageItemClass+':not(.cur)',function(e){
            var target = $(e.target).text()
            var targetClass = $(e.target).attr('class')
            var cur = $('#'+options.id+' .cur').text()
            var total = $('#'+options.id+' .total').text()

            if(!isNaN(Number(target))){ // 是数字
                setNbr(target)
            }else{
                if(targetClass.indexOf(options.preClass)>=0){
                    cur --
                    if( cur <= 0) return
                    setNbr(cur)
                }else if(targetClass.indexOf(options.nextClass)>=0){
                    cur ++
                    if( cur > total) return
                    setNbr(cur)
                }else if(targetClass.indexOf(options.firstClass)>=0){
                    setNbr(1)
                }else if(targetClass.indexOf(options.lastClass)>=0){
                    setNbr(total)
                }
            }

            getTableAjax(options)
        })


        $('#'+options.id).off('change').on('change', '.Page-select', function(){
             var target = $(this).val()
             setNbr(target)
             getTableAjax(options)
        })

    }

    return getTableList
})



