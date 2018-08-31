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

    $.fn.extend({
        showLoading : function(){
            const $this = $(this);
            const $html = $('<div class="loading-box">\n' +
                '    <div class="loading-inner">\n' +
                '        <div class="loading">\n' +
                '            <div class="loading-center">\n' +
                '                <div class="loading-center-absolute">\n' +
                '                    <div class="object object_one"></div>\n' +
                '                    <div class="object object_two"></div>\n' +
                '                    <div class="object object_three"></div>\n' +
                '                    <div class="object object_four"></div>\n' +
                '                </div>\n' +
                '            </div>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '</div>');
            $this.append($html);
        }

    });

    var getTableList = function(opts){

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


            //新增兼容回调函数的调用,由属性fallbackFn存储
            if(opts.fallbackFn && Object.prototype.toString.call(opts.fallbackFn) == '[object Function]'){
                opts.fallbackFn();
            }
        })
    };

    var page = function(opts){
        // 默认参数
        var defaults = {
            id:'', // 内容id
            pageItemClass:'Page-item', // 页码class
            preClass:'pre', // 上一页
            nextClass:'next', // 上一页
            lastClass:'last', // 最后一页
            firstClass:'first', // 最后一页
        };

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
        const $table = $('#'+options.id);
        $table.off('click').on('click','.'+options.pageItemClass+':not(.cur)',function(e){
            $table.showLoading();
            var target = $(e.target).text();
            var targetClass = $(e.target).attr('class');
            var cur = $('#'+options.id+' .cur').text();
            var total = $('#'+options.id+' .total').text();

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
                }else if(targetClass.indexOf('Page-disabled')>=0){
                    // 如果是disabled
                    return
                }
            }

            getTableList(options)
        });

        $table.off('change').on('change', '.Page-select', function(){
            $table.showLoading();
             var target = $(this).val();
             setNbr(target)
             getTableList(options)
        });

    }

    return getTableList
})



