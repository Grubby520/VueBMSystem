/**
    table 伸缩插件
    $('.Table-toggle').toggleContent({
        toogleContentClass:'Table-wrapper',
        icon:'glyphicon',
        hideClass:'glyphicon-menu-up', // 隐藏
        showClass:'glyphicon-menu-down' // 显示
    })
**/

(function(factory){
    if( typeof module === "object" && typeof module.exports === "object"){
        module.exports = factory()
    }else{
        factory()
    }
})(function(){

    $.fn.toggleContent = function(opts){

        // 默认参数
        var defaults = {
            nameSpace:'Table', // 组件 容器
            toogleContentClass:'Table-wrapper', // 显示隐藏的内容
            icon:'Icon', // 图标
            showClass:'Icon-arrow-down',
            hideClass:'Icon-arrow-up' // 图标状态
        }

        var options = $.extend({}, defaults, opts); // 合并参数

        return this.each(function(){
            var $toggleContent = $(this).parents('.'+options.nameSpace).find('.'+options.toogleContentClass)
            var $icon = $(this).parents('.'+options.nameSpace).find('.'+options.icon)
            $(this).off('click').click(function(){
                // 显示
                if(!$icon.hasClass(options.hideClass)){
                    $toggleContent.slideUp()
                    $icon.addClass(options.hideClass)
                }else{
                    $toggleContent.slideDown()
                    $icon.removeClass(options.hideClass)
                }

            })

        });

    }
})
