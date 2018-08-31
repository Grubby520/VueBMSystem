//初始化去TOP5元素
/**
 * 渲染TOP5两种值或一种值的情况
 * @param opt
 * opt = {
 *    id: '', //必填
 *    title: 'TOP5',//必填
 *    unit: '个',//数据单位，必填
 *    data: [//必填
 *    	{
 *        name:'',
 *        value:'',
 *        tiplis:[{name:'',value:''}]
 *      }
 *    ]
 * }
 * author:wanglei
 * date:2017-8-30
 */
function initTop5Ele(opt) {
    var data = opt.data?opt.data.concat():[],
    $con = $('#' + opt.id),
    progressHtm = '',
    top5Htm = '',
    i=0,
    addHtml = function(){
        if(opt.title){
                top5Htm = '<div class="top5-plugin">'+
                '<div class="top5-title">'+opt.title+'</div>'+
                '<div class="top5-content">'+progressHtm+'</div></div>';
            }else{
                top5Htm = '<div class="top5-plugin">'+
                '<div class="top5-content">'+progressHtm+'</div></div>';
            }

        $con.html(top5Htm);
    };

    if (!Array.isArray(data) || data.length == 0) {
    	addHtml();
        $con.find(".top5-content").addClass('nodata-info');

    }else{

        data = data.sort(function (a, b) {//降序排列
            return b.value - a.value;
        });

        for (i = 0; i < data.length; i++) {
        	progressHtm += progressPlugin({
    			name:data[i].name,
    			value:data[i].value,
    			totalvalue:data[0].value,
    			unit:opt.unit,
    			subjectClass:'progress-suject-bgcolor-'+(i+1),
    			tiplis:data[i].tiplis
        	});
        }

        if(data.length<5){//当数量不足五个时的处理
        	while(5>data.length){
        		progressHtm += progressPlugin();
        		data.length += 1;
        	}
        }

        addHtml();
        $con.find(".top5-content").removeClass('nodata-info');

        //top5事件
        $con.find(".progress-plugin .progress-container").mouseover(function (e) {
            var $this = $(this);
        	if($this.offset().top+80 > $(window).height()){
        		$this.find(".progress-tip").css({
                    left: e.offsetX + 10,
                    bottom: e.offsetY + 10
                }).show();
            }else{
            	$this.find(".progress-tip").css({
                    left: e.offsetX + 10,
                    top: e.offsetY + 10
                }).show();
            }

        });

        $con.find(".progress-plugin .progress-container").mousemove(function (e) {
            /*$(this).find(".progress-tip").css({
                left: e.offsetX + 10,
                top: e.offsetY + 10
            });*/
        });

        $con.find(".progress-plugin .progress-container").mouseout(function (e) {
            $(this).find(".progress-tip").hide();
        });

    }

}

function progressPlugin(opt){

	var _defOpt = {
		name:null,//进度条标题文本
		value:null,//进度条显示值
		totalvalue:0,//总值
		unit:'',//进度条显示值单位
		subjectClass:'',//进度条主题样式类
		tiplis:null//进度条信息提示框数据列表[{name:'',value:''}]
	},
	_formater = function(value,unit){//格式化值显示
		if(value==null){
			value = '-';
			unit  = '';
		}
		return value+unit;
	},
	p=null,
	i=0,
	progressPluginHtm='',
	progressTextHtm='',
	progressContainerHtm='',
	tipHtm = '',
	styleWidth = 0
	;

	if(!opt){
		opt = _defOpt;
	}else{
		for (p in _defOpt) {
	        if ((opt[p] == null)||(opt[p] == undefined)) {
	            opt[p] = _defOpt[p];
	        }
	    }
	}


	styleWidth = opt.totalvalue==0?0:(new Number(100 * opt.value / opt.totalvalue).toFixed(2)+'%');

	tipHtm = '<li><span class="tip-title-icon '+opt.subjectClass+'"></span>' + (opt.name == null?'-':opt.name) +
    ':'+_formater(opt.value,opt.unit)+'</li>';
	
	if(opt.tiplis instanceof Array){
		if(opt.tiplis.length > 1){
			tipHtm = '<li><span class="tip-title-icon '+opt.subjectClass+'"></span>' + (opt.name == null?'-':opt.name) +'</li>';
			for(i;i<opt.tiplis.length;i++){
				tipHtm += '<li><span class="tip-title-icon"></span>' +
					      opt.tiplis[i].name + ':'+
					      _formater(opt.tiplis[i].value,opt.unit) +'</li>';
			}
		}
	}
	
	progressTextHtm =
	'<div class="progress-text clearfix">'+
    '<span class="text-name">' + (opt.name == null?'-':opt.name) + '</span>'+
    '<span class="text-value">' + _formater(opt.value,opt.unit) + '</span>' +
    '</div>';

	progressContainerHtm = '<div class="progress-container">' +
    '<div class="progress-innercore '+opt.subjectClass+'" style="width:' + styleWidth + ';"></div>' +
    '<div class="progress-tip"><ul>' + tipHtm +'</ul></div></div>';

	progressPluginHtm = '<div class="progress-plugin">'+
	progressTextHtm + progressContainerHtm+
	'</div>';

	return progressPluginHtm;

}

window.initTop5Ele = initTop5Ele;