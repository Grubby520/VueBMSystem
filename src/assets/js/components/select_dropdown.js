
$.fn.extend({
    select: function(opts){
        var opts = opts || {}
        return this.each(function(){
            var $this = $(this)
            var select = $this.data('select')
            if( !(select instanceof Select)){
                opts.ele = $this
                $this.data('select', new Select(opts))
            }
        })
    }
})

function Select(opts){
    this.ele = opts.ele
    this.callback = opts.callback
    this.init(opts)
}

Select.prototype.init = function(opts){
    this.builtHtml(opts)
    this.bindEvt(opts)
}

Select.prototype.builtHtml = function(opts){

    var li = ''

    opts.ele.find('option').each(function(index, item){
        li += '<li title="'+item.innerText+'" class="DropDown-list-item">'+item.innerText+'</li>'
    })
    // 显示的提示
    var placeholder = ''
    if(opts.placeholder){
        placeholder = opts.placeholder
    }else{
        // 没有提示
        placeholder = opts.ele.find('option[selected]').length?opts.ele.find('option[selected]').text():opts.ele.find('option').eq(0).text()
    }
    var htmlstr = '<div class="DropDown">'+
                        '<a class="DropDown-info default" href="javascript:;">'+placeholder+'</a>'+
                        '<ul class="DropDown-list">'+
                            li
                        '</ul>'+
                    '</div>'
    this.dropdown = $(htmlstr)
    this.ele.after(this.dropdown)
    // this.dropdown.width(this.ele.width())
}

Select.prototype.bindEvt = function(opts){
    var _this = this
    // 点击下拉框
    this.dropdown.on('click','.DropDown-info', function(e){
        e.stopPropagation()
        var $dropDown = $(this).parents('.DropDown')
        dropDownToggle($dropDown)
    })

    // 点击选择
    this.dropdown.on('click', '.DropDown-list-item', function(e){
        e.stopPropagation()
        var $dropDown = $(this).parents('.DropDown');
        dropDownToggle($dropDown)
        $dropDown.find('.DropDown-info').text($(this).text())
        var index = $(this).index()
        _this.ele.find('option').eq(index).prop('selected','selected')
        if(index == 0){
            $dropDown.find('.DropDown-info').addClass('default')
        }else{
            $dropDown.find('.DropDown-info').removeClass('default')
        }
        if(_this.callback){ _this.callback()}
    })

    $(document).on('click', function(){
        $('.DropDown').removeClass('active')
    })

    function dropDownToggle($dropDown){
        var isActive = $dropDown.hasClass('active')
        // 隐藏其他的下拉框
        $('.DropDown').removeClass('active')
        if(!isActive){
            $dropDown.addClass('active')
        }else{
            $dropDown.removeClass('active')
        }
    }
}

