import $ from 'jquery'
let echarts = require('echarts')

function Charts(id){
    return new Charts.prototype.init(id);
}

var init = Charts.prototype.init = function(id){
    if(!id){
        throw new Error("require id");
    }
    this.id = id;
    var ele = document.getElementById(id);
    this.resize();
    this.echartObj = echarts.init(ele);
}

init.prototype = Charts.prototype;

// loading
Charts.loading = Charts.prototype.loading = function(){
    this.echartObj.showLoading()
}
Charts.loading = Charts.prototype.hideLoading = function(){
    this.echartObj.hideLoading()
}

// 没有数据
Charts.noDataFun = Charts.prototype.noDataFun = function(id){
    var id = this.id||id;
    var getId = $('#'+id);
    getId.addClass("nodata-all");
    return false;
}

Charts.prototype.initGraph = function(opts){
    $('#'+this.id).removeClass('nodata-all')
    if(arguments.length == 0 || !opts){
        this.noDataFun(this.id);
    }else{
        const CHART_DEFAULT = {
            legend : {
                // textStyle:{
                //     color:'#999',
                //     fontSize:'12'
                // },
                itemWidth:14,
                itemHeight:10,
            },
            title:{
                textStyle : {
                    fontSize : 30,
                    fontWeight : 'bold',
                    color : '#25a4f6'
                },
                subtextStyle : {
                    fontSize : 14,
                    color : '#666',
                    fontFamily : '微软雅黑'
                }
            }
        }
        var options = $.extend( true,{}, CHART_DEFAULT, opts ) //覆盖
        this.echartObj.setOption(options)
        return this.echartObj
    }
}

Charts.prototype.resize = function(){
    var _this = this;
    $(window).resize(function(){
        _this.echartObj.resize();
    })

    // 点击展开
    $(document).on("click", (".zhankai, .home-lefts"), function() {
        setTimeout(function(){
            _this.echartObj.resize();
        },100)
    })
}

Charts.prototype.sector = Charts.prototype.bar
                        = Charts.prototype.line
                        = Charts.prototype.pie
                        = Charts.prototype.heatmap
                        = Charts.prototype.radar
                        = Charts.prototype.sankey
                        = Charts.prototype.initGraph

// window.Charts = Charts

export default Charts
