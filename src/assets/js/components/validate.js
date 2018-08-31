
// opts 参数
// $('#data_capacity:visible').bindValidate({
//     form:form, // 表单 可选
//     rule:function(){
//         if($(this).val() != '' || $('#data_disk_type').val()){
//             return  regexpFuns.isNumber($(this).val()) && regexpFuns.isntEmpty($('#data_disk_type').val())
//         }else{
//             return  true
//         }
//     },
//     success:function(){
//         $(this).parents('.form-row').find('.tip').hide()
//     },
//     error:function(){
//         $(this).parents('.form-row').find('.tip').show().html('<i class="Icon Icon-tip-error"></i> 请选择、填写数据盘')
//     }
// })
$.fn.bindValidate = function(opts){
    var $ele = this
    var isvalid = true
    return this.each(function(){
        // 用于 表单验证
        if(opts.form){
            opts.form.formItem.push(this)  // 默认验证状态
        }

        // 初始化状态 将状态保存到dom
        this.isvalid = false
        this.msg = ''

        // 没有传递form参数
        if(this.tagName == 'INPUT'){
            $(this).blur(function(){
                excuteRule.call(opts, $(this))
            })
        }else{
            $(this).change(function(){
                excuteRule.call(opts, $(this))
            })
        }

        $(this).on('validate',function(){
            excuteRule.call(opts, $(this))
        })
    })
}


// target 被绑定验证的元素
function excuteRule(target){
    let _this = this
    if(this.rule.call(target, $(target).val()) == true){
        this.success.apply(target)
        target[0].isvalid = true
    }else{
        this.error.apply(target, [_this.rule.call(target, $(target).val())])
        target[0].isvalid = false
        target[0].msg = _this.rule.call(target, $(target).val())
    }
}

// submitBtn:'#add' 触发验证
function FormValidate(opts){
    return new init(opts)
}

function init(opts){
    this.submitBtn = opts.submitBtn
    this.formItem = []  // 所有需要验证的元素 dom 对象
    // this.bindFuns = null
}
init.prototype = FormValidate.prototype

// 执行验证
FormValidate.prototype.bindValidate = function(bindFuns){
    bindFuns(this)
    // this.bindFuns = bindFuns
    return this
}

// 提交进行验证
FormValidate.prototype.bindSubmit = function(opts){
    var _this = this
    $(document).off('click.'+_this.submitBtn).on('click.'+_this.submitBtn, _this.submitBtn,  function(){

            // 触发验证 是否有错
            var isvalid = true
            _this.formItem.map(function(item, index){
                $(item).trigger('validate')
                if(item.isvalid != true){
                    typeof item.isvalid == 'string'? opts.error(item.isvalid):opts.error(item)
                    isvalid = false
                }

            })
            // 验证通过
            if(isvalid){
                opts.success()
            }
    })
}

module.exports = FormValidate
