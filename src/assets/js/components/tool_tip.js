/**
    提示框
    $('.tbody .tr').tooltip({tooltipClassName:"Tooltip"})
**/

(function(factory){
    if( typeof module === "object" && typeof module.exports === "object"){
        module.exports = factory()
    }else{
        factory()
    }
})(function(){
    $.fn.tooltip = function(opts){

        // 默认参数
        var defaults = {
            tooltipClassName:"Tooltip",
            delt:4 // 鼠标离 弹窗的间隙
        }

        var options = $.extend({}, defaults, opts); // 合并参数



        return this.each(function(){
            var $this = $(this)
            var $tooltip = $this.find('.'+options.tooltipClassName)
            var maxX = $this.width() - $tooltip.width() - options.delt
            $this.mouseenter(function(e){
                $tooltip.show()
            })
            $this.mousemove(function(e){
                e.stopPropagation()
                window.requestAnimationFrame(function(){
                    var x = e.pageX - $this.offset().left + options.delt
                    var y = e.pageY - $this.offset().top + options.delt
                    if(x > maxX) x = maxX
                    console.log('X----'+x)
                    $tooltip.css({
                        left:x+'px',
                        top:y+'px'
                    })
                });
            })
            $this.mouseleave(function(e){
                $this.find('.'+options.tooltipClassName).hide()
            })
        });

    }
})
