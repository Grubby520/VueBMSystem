import $ from 'jquery'
import Charts from './charts_v2.js'
//import '../lib/echarts-liquid.js'
var cloneDeep = require('lodash/cloneDeep')

// 对option进行扩展不建议另外使用变量
Charts.prototype.isNoData = function isNoData(data){
    // 新的判断 无数据 nodata\[]\{}\string\undefind\null
    if((typeof data == "string" && data == 'nodata') ||(data == undefined)||(data == 'null')||(data == null)||(data == '')|| (data.length==0) || (JSON.stringify(data) == "{}")){
      return this.noDataFun(this.id);
    }
};

// 总数饼图
// 王雷
// Charts.initTotalPie({
//     id: 'evt-status',
//     title:"XX总数",
//     radius:[],
//     textFontSize:16,
//     subTextFontSize:16,
//     colors:['#2196f3','#f28172'] ,
//     showLabel: true,
//     data: [{"name":"服务","value":0},{"name":"应用程序","value":0}]
// })
Charts.initTotalPie = function initTotalPie(opts){
    var testData = [
            {"name":"异常","value":10},
            {"name":"删除","value":166},
            {"name":"冷门","value":59},
            {"name":"正常","value":0}
        ]
    if(arguments.length = 1){
        //新的判断 无数据
        //this.isNoData(opts.data)
        if(Charts(opts.id).isNoData(opts.data) == false){
    		return;
    	}
        var id = opts.id;
        var data = '';
        if(opts.data == 'test'){
            data = testData
        }else{
            data = typeof opts.data == "string"?JSON.parse(opts.data):opts.data;
        }
        var title = opts.title;
        var colors = opts.colors;
    }

    var totalNum = 0,i,legendData=[];
    for(i=0;i<data.length;i++){
        legendData.push(data[i].name);
        totalNum += Number(data[i].value);
    }

    var option = {
         color:colors||['#FFC001','#F28271','#682F97'],
         title : {
                text : totalNum,
                subtext : title,
                left:'center',
                top:'40%',
                textStyle:{
                	color:'#333',
                    fontSize:opts.textFontSize || 24,
                    fontWeight:'bolder'
                },
                subtextStyle:{
                	color:'#333',
                    fontSize:opts.subTextFontSize || 16,
                    fontWeight:'normal'
                }
            },
         tooltip: {
             trigger: 'item',
             formatter: "{b}: {c} ({d}%)"
         },
         legend: {
             orient: 'horizontal',
             left: 'center',
             bottom:'1%',
             itemGap:20,
             formatter:function(name){
              return name;
             },
             data:legendData
         },
         series: [
             {
                 name:'访问来源',
                 type:'pie',
                 radius: opts.radius || ['50%', '70%'],
                 avoidLabelOverlap: false,
                 hoverAnimation : false,
                 label:{
                     normal:{
                         show: opts.showLabel || false,
                     }
                 },
                 itemStyle : {
                  normal:{
                   borderColor : '#fff',
                         borderWidth : 2
                  }
                 },
                 data:data
             }
         ]
     };

    $.extend( true,option, opts.options||opts.option ); //覆盖
    Charts(id).sector(option);
}

// 饼图蛋糕型
// 王雷
//Charts.initCake({
//  id: 'evt-status',
//  radius:[],
//  colors:['#2196f3','#f28172'] ,
//  hideLabel: true,
//  data: [{"name":"服务","value":0},{"name":"应用程序","value":0}]
//})
Charts.initCake = function initCake(opts){
    if(arguments.length = 1){
        //this.isNoData(opts.data)
        if(Charts(opts.id).isNoData(opts.data) == false){
    		return;
    	}
        var id = opts.id;
        var data = opts.data == 'test'? [{"name":"服务","value":0},{"name":"应用程序","value":0}]:opts.data;
        var colors = opts.colors;
    }

  var i,legendData=[];
  for(i=0;i<data.length;i++){
   legendData.push(data[i].name);
  }
  var option = {
         color:colors||['#FFC001','#F28271','#682F97'],
         tooltip: {
             trigger: 'item',
             formatter: "{b}: {c} ({d}%)"
         },
         legend: {
            show:true,
             orient: 'horizontal',
             left: 'center',
             bottom:'1%',
             itemGap:20,
             formatter:function(name){
              return name;
             },
             data:legendData
         },
         series: [
             {
                 name:'访问来源',
                 type:'pie',
                 radius: opts.radius || ['1.5%', '70%'],
                 avoidLabelOverlap: false,
                 hoverAnimation : false,
                 label:{
                     normal : {
                         show : opts.hideLabel == true?false:true
                     }
                 },
                 itemStyle : {
                  normal:{
                   borderColor : '#fff',
                         borderWidth : 2
                  }
                 },
                 data:data
             }
         ]
    };

   $.extend( true,option, opts.options ); //覆盖
   return Charts(id).initGraph(option);
 }

/**
id:"rate-trend"
data:'test', // 显示默认值 查看效果
totalLine:true,//是否加一条总线
totalName:'总数',//系列名
symbol:'emptyCircle',//线节点形状
unit:'' //单位，
smooth:false,//折线
legendIcon:'',//legend图标
options:{
    legend:{
        show:false
    }
}
唐铨晟
**/

Charts.initLine = function initLine(opts){
    //无数据处理
	if(Charts(opts.id).isNoData(opts.data) == false){
		return;
	}
    // 默认的data
    var lineData = {
        xValue:['32','00:00','02:00','04:00','06:00','08:00','10:00','12:00','3','7','45','34','67'],
        value:[
            {
                name:'移动出口流量',
                data:['120', '132', '101', 134, 90, 230, 210,222,133,213,543,645,756]
            },
            {
                name:'电信出口流量',
                data:[220, 182, 191, 234, 290, 330, 310,222,133,213,543,645,756]
            }
        ]
    };
    var option = {
        tooltip : {
            trigger: 'axis',
        },
        legend: {
            textStyle: {
                color: '#999'
            },
            bottom:10,
            data: [{
                name: '移动出口流量',
                // 强制设置图形为圆。
                icon: 'rect'
            }, {
                name: '电信出口流量',
                // 强制设置图形为圆。
                icon: 'rect'
            }, {
                name: '联通出口流量',
                // 强制设置图形为圆。
                icon: 'rect'
            }]
        },
        grid: {
            left: '3%',
            right: '6%',
            bottom: '32%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                axisLabel:{

                    textStyle: {
                        color: '#c1c1c1'  // 横坐标线颜色
                    }
                },
                axisLine: {
                    show:false,
                    lineStyle: {
                        color: '#34a9dd'
                    }
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                data : [] // 横坐标数组
            }
        ],
        yAxis :[
            {
                type : 'value',
                nameTextStyle: {
                    color: '#c1c1c1'
                },
                axisLine: {
                    show:false,
                    lineStyle: {
                        color: '#c1c1c1'
                    }
                },
                axisLabel: {
                    formatter: '{value} '+(opts.unit || 'ms'),
                    textStyle: {
                        color: '#c1c1c1'  // 横坐标线颜色
                    }
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
            }
        ],
        series : [],
        color: opts.colors?opts.colors:["#03aaf4","#b9a1e8","#f28271","#ffb438","#8bc44a"]
    };
    function lineOptExtend(data, opt,opacity){
        if(!data) return;
        if(typeof data=='string'){
            data = JSON.parse(data);
        }
        var arrName = [],arrseries = [],totalData = [],xData = [];
        for(var i =0; i<data.value.length; i++){
            arrName.push({
                name:data.value[i].name?data.value[i].name:'',
                icon: opts.legendIcon?opts.legendIcon:'roundRect'
            });
            arrseries.push({
                name:data.value[i].name?data.value[i].name:'',
                data:data.value[i].data,
                type:'line',
                smooth:opts.smooth?opts.smooth:true,
                areaStyle: {
                    normal: {
                        opacity: opacity == undefined ? 0.4 : opacity
                    }
                },
                symbol: opts.symbol || 'none'
            });

        }

        for(var j = 0; j<data.xValue.length; j++){
        	xData.push({
                value:data.xValue[j],
                textStyle:{
                    color:'#c1c1c1'
                }
            });

        	if(opts.totalLine){
        		for(var k=0;k<data.value.length;k++){
        			if(totalData[j]){
        				totalData[j] += data.value[k].data[j];
        			}else{
        				totalData[j] = data.value[k].data[j];
        			}
        		}
        	}
        }

        if(opts.totalLine){
        	arrName.unshift({
                name:opts.totalName || ''
            });
            arrseries.unshift({
                name:opts.totalName || '',
                data:totalData,
                type:'line',
                smooth:true,
                areaStyle: {
                    normal: {
                        opacity: 0
                    }
                },
                symbol: opts.symbol || 'none'
            });
        }

        opt.series = arrseries;
        opt.legend.data = arrName;
        opt.xAxis[0].data = xData;
        return opt;
    }
    // 如果没有传data 使用默认data 查看示意图
    var extendOpt = lineOptExtend(opts.data=='test'?lineData:opts.data, option, opts.opacity);
    $.extend( true,extendOpt, opts.options ); //覆盖
    return Charts(opts.id).line((cloneDeep(extendOpt)));
};

// 橫向柱狀圖
// opts{
//     id:"",
//	   unit:"GB",
//     data:{}
// }
// 唐铨晟
Charts.initYbar = function initYbar(opts){
    var option = {
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow"
            },
            formatter: '{b}<br />{a0}: {c0}'+(opts.unit?opts.unit:'')+'<br />{a1}: {c1}'+(opts.unit?opts.unit:'')
        },
        legend: {
            data: [
                "未申请",
                "提出申请",
                "现场对接",
            ],
            bottom: "4%"
        },
        grid: {
            left: "3%",
            right: "4%",
            bottom: "12%",
            top: "6%",
            containLabel: true
        },
        itemStyle: {
            normal: {
                borderColor: "#fff",
                borderWidth: 2
            },
            emphasis: {
                "borderColor": "#fff",
                "borderWidth": 2
            }
        },
        xAxis: {
            type: "value",
            show: false
        },
        yAxis: {
            type: "category",
            data: [
                "计划迁移",
                "新建迁移",
                "取消迁移"
            ],
            axisLine: {
                show: false
            },
            inverse: true
        },
        series: [
            {
                name: "未申请",
                type: "bar",
                stack: "总量",
                center: [
                    "50%",
                    "50%"
                ],
                data: [
                    45,
                    1,
                    46
                ]
            },
            {
                name: "提出申请",
                type: "bar",
                stack: "总量",
                center: [
                    "50%",
                    "50%"
                ],
                data: [
                    16,
                    1,
                    1
                ]
            },
        ],
        color: [
            "#03aaf4",
            "#b9a1e8",
            "#c38dbf",
            "#95da85",
            "#82cbc7",
            "#faaf4d",
            "#92d1fa",
            "#f7881f",
            "#fc5f9e",
            "#6ec870"
        ]
    }
    function barOptExtend(barData, opt){
        if(!barData) return;
        if(typeof barData=='string'){
            barData = JSON.parse(data)
        }
        // 不够5条
        var dataLength = barData.barYvalue.length
        if(dataLength < 5){
            for(var i = 0; i < barData.barValue.length; i++){
                for(var k = 0; k < (5-dataLength); k++){
                    if(i == 0){barData.barYvalue.push("---")}
                    barData.barValue[i].data.push("---")
                }
            }
        }
        opt.yAxis.data = barData.barYvalue;
        var series = [];
        var legend = [];
        for(var i = 0; i < barData.barValue.length; i++){
            series.push({
                "name": barData.barValue[i].name,
                "type": "bar",
                "stack": "总量",
                "center": [
                    "50%",
                    "50%"
                ],
                "data": barData.barValue[i].data
            })

            legend.push({
                name:barData.barValue[i].name,
                icon: 'rect'
            })
        }
        opt.legend.data = legend;
        opt.series = series;

        return JSON.parse(JSON.stringify(opt));
    }
    var barData = {
        barYvalue: ["aaa","bbb","ccc"],
        barValue:[
            {
                name:"已使用",
                data:[10,3,2]
            },
            {
                name:"未使用",
                data:[3,13,2]
            }
        ]
    }
    //this.isNoData(opts.data)
    if(Charts(opts.id).isNoData(opts.data) == false){
		return;
	}
    var extendOpt = barOptExtend(opts.data == 'test'?barData:opts.data, option)
    $.extend( true,extendOpt, opts.options ); //覆盖
    Charts(opts.id).bar(JSON.parse(JSON.stringify(extendOpt)));
}

/**
 * 随机方块渲染
 * opt = {
 *   id:'',//容器ID
 *   title:'运行状态气象图',
 *   columns:[0,1,2],//列数组
 *   rows:[0,1,2],//行数组
 *   data:[{
 *      name:'故障',
 *	    type:'1',
 *	    num:5
 *	 },{
 *	    name:'告警',
 *	    type:'2',
 *	    num:10
 *	 },{
 *      name:'正常',
 *      type:'3',
 *      num:85
 *   }],
 *   types:{
 *	    '_1':'#F28172',//故障
 *	    '_2':'#FFB339',//警告
 *	    '_3':'#93C62D'//正常
 *	 }
 *
 * }
 * 王雷
 */
Charts.initRandomBlocks = function(opt){
	if(Charts(opt.id).isNoData(opt.data) == false){
		return;
	}
	//产生指定长度的随机下标数组
	function randomArr(length){
		var arr = [],indexArr=[];
		if(typeof length == 'number'){

			while(arr.length<length){
				if(arr.length==0){
					arr.push(0);
				}else{
					arr.push(arr[arr.length-1]+1);
				}
			}
			while(arr.length>0){
				indexArr.push(arr.splice(random(0,arr.length-1),1)[0]);
			}

		}
		return indexArr;
	}

	//获取指定两数之间的随机数
	function random(startNum,endNum){
		return startNum+Math.round(Math.random()*(endNum-startNum));
	}


	var blocks= [],
	randomIndex100 = randomArr(opt.columns.length*opt.rows.length),
	i=0,
	j=0,
	m=0,
	n=0,
	data=[],
	catogries=[],
	colors = [],
	valueMap = {};
	for(i=0;i<opt.columns.length;i++){
	    for(j=0;j<opt.rows.length;j++){
	    	blocks.push([i,j]);
	    }
	}

	for(m=0;m<opt.data.length;m++){
		catogries.push(opt.data[m].name);
		colors.push(opt.types['_'+opt.data[m].type]);
		valueMap[opt.data[m].name] = opt.data[m].num;
		for(n = 0;n<opt.data[m].num;n++){
			var tempArr = randomIndex100.splice(0,1)[0];
			blocks[tempArr][2] = opt.data[m].type;
			blocks[tempArr][3] = opt.data[m].name;
			data.push({
				name:'',
				value:blocks[tempArr],
				itemStyle:{
		            normal:{
		                color:opt.types['_'+blocks[tempArr][2]]
		            }
		        }
			});


		}
	}
	//data数量小于指定数量，用默认方块补齐
	if(data.length<opt.columns.length*opt.rows.length){
		var tempos;
		catogries.push('--');
		colors.push('#eee');
		while(data.length<opt.columns.length*opt.rows.length){
			tempos = randomIndex100.splice(0,1)[0];
			blocks[tempos][2] = 0;
			blocks[tempos][3] = '--';
			data.push({
				name:'',
				value:blocks[tempos],
				itemStyle:{
		            normal:{
		                color:'#eee'
		            }
		        }
			});
		}

	}


	var option = {
		title:{
			text:opt.title,
			top:'15%',
			left:'35%',
			textStyle:{
				fontStyle:'normal',
				fontWeight:500,
				align:'center',
				color:'#333',
				fontSize:14
			}
		},
	    tooltip: {
	        position: 'top',
	        tigger:'none',
	        show:false
	    },
	    animation: false,
	    grid:{
	    	height:100,
	    	bottom:'30%'
	    },
	    xAxis:{
	        show:false,
	        type: 'category',
	        data: opt.columns,
	        splitNumber:opt.columns.length,
	        splitArea: {
	            show: true,
	            areaStyle:{
	                show: true
	            }
	        }
	    },
	    yAxis:{
	        show:false,
	        type: 'category',
	        data: opt.rows,
	        splitNumber:opt.rows.length,
	        splitArea: {
	            show: true
	        }
	    },
	    visualMap: {
	        type: 'piecewise',
	        orient: 'horizontal',
	        x:'center',
	        //left:'25%',
	        bottom:'15%',
	        dimension: 3,//索引,指定按data中的哪一个数据进行统计
	        categories: catogries,
	        inRange: {
	            color: colors
	        },
	        itemWidth:10,
	        itemHeight:10,
	        formatter:function(value){
	        	if("--" == value){
	        		return '空';
	        	}
	        	return value +':'+valueMap[value]+'%';
	        },
	        textStyle:{
	            color:'#999'
	        }
	    },
	    series: [{
	        name: 'Punch Card',
	        type: 'heatmap',
	        data: data,
	        label: {
	            normal: {
	                show: false
	            }
	        },
	        itemStyle: {
	            normal:{
	                color:'#93C62D',
	                borderColor:'#fff',
	                borderWidth:5
	            }
	        }
	    }]
	};

    Charts(opt.id).heatmap(option);
};


/*
 * 雷达图
 *
 * opt:{
 *   id:'',
 *   title:'工作负载',
 *   opts:{},
 *   data:[{
 *     name:'',
 *     value:''
 *   }]
 * }
 */

Charts.initRadar = function(opt){
	if(Charts(opt.id).isNoData(opt.data) == false){
		return;
	}
	var indicatorArr = [],
		val = [],
		i=0;
    var defaultData = [
        {
            name:'dfs',
            value:'5'
        },
        {
            name:'drrrrs',
            value:'9'
        },
        {
            name:'o',
            value:'9'
        }
    ]
    opt.data = opt.data == 'test'?defaultData: opt.data
	for(;i<opt.data.length;i++){
		indicatorArr.push({
			text:opt.data[i].name,
			max:opt.data[i].value>100?opt.data[i].value:100
		});
		val.push(opt.data[i].value);
	}
	var option = {
	    tooltip: {
	        trigger: 'axis'
	    },
	    textStyle:{
	    	color:'#333'
	    },
	    radar: [
	        {
	            indicator:indicatorArr,
	            center: ['50%','50%'],
                radius: 80
	        }
	    ],
	    series: [
	        {
	            type: 'radar',
	            tooltip: {
	                trigger: 'item'
	            },
	            itemStyle: {
	                normal: {
	                    borderColor:'#D53A35',
	                }
	            },
	            lineStyle:{
	                normal:{
	                    color:'#D53A35'
	                }
	            },
	            areaStyle: {
	                normal:{
	                   color:'#D53A35'
	                }
	            },
	            data: [
	                {
	                    value: val,
	                    name: opt.title
	                }
	            ]
	        }
	    ]
	};

    if(opt.opts){
        $.extend( true, option, opt.opts );
    }
	Charts(opt.id).radar(option);
};

/**
 * opt = {
 *   id:'',
 *   colors:[],
 *   data:[{name:'',value:''}],
 *   showLabel:false,
 *   labelPos:'inner',
 *   showLegend:'',
 *   showLabelLine:true,
 *   formatter:'',//string或fn
 *   eCenter:'',//圆心
 *   radius:'',//半径
 *   legendX:'',
 *   legendY:''
 *   options:{}
 * }
 */
Charts.initPie = function(opt) {
    if(Charts(opt.id).isNoData(opt.data) == false){
		return;
	}
    var i, legendData = [],zeroNum=0;
    var defaultData = [
            {name:'fdsa',value:'9'},
            {name:'lll',value:'9'}
        ]
    opt.data = opt.data=='test'?defaultData:opt.data
    for (i = 0; i < opt.data.length; i++) {
        legendData.push({
        	name:opt.data[i].name,
        	icon:'roundRect'
        });
        if(Number(opt.data[i].value) == 0){
        	zeroNum++;
        }
    }

    var option = {
        color: opt.colors || ['#93c62d','#f28172','#baa0e9'],
        tooltip: {
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
        },
        legend: {
            show: opt.showLegend || false,
            orient:  opt.legend|| 'horizontal',
            // left: 'center',
            x: opt.legendX || 'center',
            // bottom: '5%',
            y: opt.legendY || '5%',
            itemWidth:10,
            itemHeight:10,
            itemGap: 20,
            formatter: function (name) {
                if(opt.legendShowNandV){
                    var index = 0;
                    var myData = opt.data;
                    myData.forEach(function(value,i){
                      if(value.name == name ){
                          index = i;
                      }
                    });
                    return "  "+name+"  "+myData[index].value;
                }else{
                    return name;
                }
            },
            textStyle:{
        		color:'#999'
        	},
            data: legendData
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: opt.radius || ['50%', '70%'],
                center: opt.eCenter || ['50%','50%'],
                avoidLabelOverlap: false,
                hoverAnimation: false,
                silent:opt.silent || false,
                itemStyle : {
                    normal : {
                        label : {
                            show : opt.showLabel || false,
                            position: opt.labelPos || 'inner',
                            formatter:opt.formatter || '{c}'
                        },
                        labelLine : {
                            show : opt.showLabelLine || false
                        }
                    },
                    emphasis : {
                        label : {
                            show : false
                        },
                        labelLine : {
                            show : false
                        }
                    }
                },
                data: opt.data
            }
        ]
    };

    option = $.extend(true,{},option,opt.options);

    return Charts(opt.id).pie(option);
}

/**
    {
        id:id,
        data:[
            {
                name:'可用性（%）',
                val:parseInt(rate)
            },
            {
                name:'总数',
                val:100
            }
        ],
        color:''
    }
**/
Charts.initRatePie = function(opts){
    // 无数据特殊处理
    if((Charts(opts.id).isNoData(opts.data) == false)){
		return;
	}

    var data = opts.data == 'test'?[{name:'已使用', val:30},{name:'总数',val:100}]:opts.data; // 已使用， 总数

    var option = {
        // tooltip: { // 鼠标hover提示信息
        //         trigger: 'item',
        //         formatter: "{a} <br/>{b}: {c} ({d}%)"
        // },
        title:{
            text:data[0].name,
            bottom:'0',
            left:'center',
            textStyle:{
                align:'center',
                color:'#333',
                fontSize:12,
                fontWeight:'lighter'
            }
        },
        series: [
            {
                type: 'liquidFill',
                data:[0.6],
                radius: '50%',
                name:'',
                center:opts.center || ['50%','40%'],
                backgroundStyle: {
                            color: 'rgba(255, 255, 255, 0.5)'
                        },
                outline: {
                            show: false
                        },
                label: {
                            normal: {
                                textStyle: {
                                    fontSize: 14,
                                    color: opts.color
                                }
                            }
                        }
            },
            {
                type:'pie',
                radius: ['60%', '70%'],
                center:opts.center || ['50%','40%'],
                name:'CPU',
                label:{
                    normal: {
                        show: false
                    }
                },
                labelLine: { // 牵引线
                    normal: {
                        show: false
                    }
                },
                silent: true, // 不响应鼠标事件
                data:[]
            }
        ]
    }

    option.series[0].data = [{
        value: (data[0].val/100).toFixed(2),
        direction: 'left',
        itemStyle: {
           normal: {
               color: opts.color
           }
        }
    }];
    option.series[1].data[0] = {
                                    value:data[0].val,
                                    name:data[0].name,
                                    itemStyle:{
                                        normal:{
                                            color:opts.color
                                        }
                                    },
                                };
    option.series[1].data[1] = {
                                    value:data[1].val-data[0].val,
                                    name:'',
                                    itemStyle:{
                                        normal:{
                                            color:'rgba(227, 228, 231, 0.5)'
                                        }
                                    },
                                }

    opts.callback && opts.callback(option)
    $.extend( true, option, opts.option )
    Charts(opts.id).pie(JSON.parse(JSON.stringify(option)))
};

/**
 * id:'',
 * value:50,
 * unit:'%',
 * outerColor:[],
 * innerColor:'',
 * textColor:'#fff',
 * textSize:14,
 * center:['50%','50%'],
 * innerR:['0%', '70%'],
 * outerR:['85%', '95%']
 */
Charts.initPecentPie = function(opts){

    opts.value = Number(opts.value).toFixed(2);
    var option = {
        series: [
            {
                type: 'pie',
                radius: opts.innerR,
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: { // 文字
                    normal: {
                        position: 'center',
                        show: true,
                        textStyle: {
                            fontSize: opts.textSize,
                            fontWeight: 'bold',
                            color: opts.textColor
                        }
                    }
                },
                itemStyle:{
                    normal:{ // 中间颜色
                        color:opts.innerColor
                    }
                },
                silent: true,
                data:[
                    {
                        value:0,
                        name:opts.value+opts.unit
                    }
                ]
            },
            {
                type:'pie',
                radius: opts.outerR,
                name:'',
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                silent: true, // 不响应鼠标事件
                data:[]
            }
        ]
    };
    option.series[1].data.push({
        value:opts.value,
        name:'',
        itemStyle:{
            normal:{
                color:opts.unit === '%'?opts.outerColor[0]:opts.outerColor[1]
            }
        }
    });
    option.series[1].data.push({
        value:opts.unit === '%'?(100-opts.value):0,
        name:'',
        itemStyle:{
            normal:{
                color:opts.outerColor[1]
            }
        }
    });

    $.extend( true, option, opts.option)
    Charts(opts.id).pie(option);

}

/**
    id:id,
    data:[
        xValue: ['周一','周二','周三','周四','周五','周六','周日'],
        value:[
            {
                name:'最紧急消息',
                value:[1,1,2,4,5,6,7]
            },
            {
                name:'紧急消息',
                value:[6,2,3,4,5,6,7]
            }
        ]
    ],
    color:[],//颜色
    unit:'个',//单位
	stack:true,//是否堆叠
	barWidth:''//柱状宽度
**/
Charts.initXbar = function(opts){
    //无数据处理
    if((Charts(opts.id).isNoData(opts.data) == false)){
        return;
    }
    var dataDefault = {
        xValue: ['周一','周二','周三','周四','周五','周六','周日'],
        value:[
            {
                name:'最紧急消息',
                value:[1,1,2,4,5,6,7]
            },
            {
                name:'紧急消息',
                value:[6,2,3,4,5,6,7]
            }
        ]
    }
    var option = {
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            textStyle:{
                color:'#d5d7da'
            },
            bottom:'4%',
            data: []
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '22%',
            top:'10%',
            containLabel: true
        },
        itemStyle: {
            normal: {
                borderColor: "#fff",
                borderWidth: 2
            },
            emphasis: {
                borderColor: "#fff",
                borderWidth: 2
            }
        },
        yAxis:  {
            type: 'value',
            nameTextStyle: {
                color: '#c1c1c1'
            },
            axisLine: {
                show:true,
                lineStyle: {
                    color: '#c1c1c1'
                }
            },
            axisLabel: {
                formatter: '{value} '+(opts.unit || 'ms'),
                textStyle: {
                    color: '#c1c1c1'  // 横坐标线颜色
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
        },
        xAxis: {
            type : 'category',
            // boundaryGap : false,
            z:2,
            axisLine: {
                show:true,
                lineStyle: {
                    color: '#c1c1c1'
                }
            },
            axisTick: {
                alignWithLabel: true
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
            data: []
        },
        series: [],
        color:opts.color?opts.color : ['#93c62d','#baa0e9','#2196f3','#f76e5d']
    };

    function optExtend(data){
        option.xAxis.data = data.xValue
        var total = []
        for(var i = 0; i < data.value.length; i++){
            var color = '';
            option.legend.data.push(data.value[i].name);
            option.series.push({
                name: data.value[i].name,
                type: 'bar',
                stack: opts.stack?'':'总量', // 默认是总量
                barWidth:opts.barWidth || '30%',
                data: data.value[i].value || data.value[i].data,
                // itemStyle:{
                //     normal:{
                //         color:color
                //     }
                // }
            })
            if(opts.stack){
            	var isValue = data.value[i].value,
            	valueLength;
            	if(isValue){
            		valueLength = data.value[i].value.length;
            	}else{
            		valueLength = data.value[i].data.length;
            	}
                for(var j = 0; j < valueLength; j++){
                	if(isValue){
                		if(total[j]){
                            total[j] = total[j] + data.value[i].value[j]
                        }else{
                            total[j] = data.value[i].value[j]
                        }
                	}else{
                		if(total[j]){
                            total[j] = total[j] + data.value[i].data[j]
                        }else{
                            total[j] = data.value[i].data[j]
                        }
                	}

                }
            }
        }
        if(opts.stack){
            option.legend.data.unshift({
            	name:'总数',
            });
            option.series.unshift({
                name:'总数',
                type:'line',
                symbol:'emptyCircle',
                itemStyle:{
                    normal:{
                        barBorderRadius:0,
                        borderColor:opts.color[0], // 节点颜色
                        label:{
                            show:true,
                            position:'top',
                            formatter:function(p){
                             return p.value > 0 ? (p.value) : '';
                            }
                        }
                    },
                    emphasis: {
                        borderColor: opts.color[0]
                    }
                },
                data:total
            })
        }

    }
    optExtend(opts.data=='test'?dataDefault:opts.data)
    $.extend( true,option, opts.options );
    return Charts(opts.id).bar(JSON.parse(JSON.stringify(option)))
}

/**
 * 功能：桑葚图
 * developer:wanglei
 * @param opts
 */
Charts.initSankeyDiagram = function(opts){
	//无数据处理
    if((Charts(opts.id).isNoData(opts.data) == false)){
        return;
    }

    var data = opts.data;
    var option = {
		title: {
            text: ''
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [
            {
                type: 'sankey',
                layout:'none',
                left:'center',
                width:'90%',
                data: data.nodes,
                links: data.links,
                itemStyle: {
                    normal: {
                        borderWidth: 1,
                        borderColor: '#aaa'
                    }
                },
                lineStyle: {
                    normal: {
                        curveness: 0.5
                    }
                }
            }
        ],
        color:opts.color
    };

    return Charts(opts.id).sankey(JSON.parse(JSON.stringify(option)));

};

/**


**/
Charts.initHotGraph = function(opts){
    //无数据处理
    if((Charts(opts.id).isNoData(opts.data) == false)){
        return;
    }
    var option = {
            title: {
                text: '',
                subtext: '',
                top: '',
                left: ''
            },
            tooltip:{
            },

            legend: [{
                // selectedMode: 'single',
                // data: categories.map(function (a) {
                //     return a.name;
                // })
            }],

            animationDuration: 1500,
            animationEasingUpdate: 'quinticInOut',
            series : [
                {
                    name: 'Les Miserables',
                    type: 'graph',
                    layout:'force',
                    force:{
                        edgeLength:[60, 160],
                        gravity:0.06,
                        repulsion: 120 // 节点之间的距离
                    },
                    data: opts.data.nodes,
                    links: opts.data.links,
                    draggable:true,
                    focusNodeAdjacency:true, // 鼠标移上去显示相关
                    // categories: categories,
                    roam: true,
                    label: {
                        normal: {
                            position: 'right',
                            formatter: '{b}'
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#333',
                            curveness: 0.3
                        }
                    }
                }
            ]
        }
    $.extend( true,option, opts.option )
    return Charts(opts.id).initGraph(option)
}

// data
// colors
// options
Charts.initSunburst = function(opts){
    //无数据处理
    if((Charts(opts.id).isNoData(opts.data) == false)){
        return;
    }
    var option = {
        series: {
            type: 'sunburst',
            highlightPolicy: 'ancestor',
            data: opts.data,
            highlightPolicy: 'descendant',
            radius: [0, '95%'],
            sort: null,
            levels: [{}, {
                r0: '15%',
                r: '35%',
                itemStyle: {
                    borderWidth: 2
                },
                label: {
                    rotate: 'tangential'
                }
            }, {
                r0: '35%',
                r: '70%',
                label: {
                    align: 'right'
                }
            }, {
                r0: '70%',
                r: '72%',
                label: {
                    position: 'outside',
                    padding: 3,
                    silent: false
                },
                itemStyle: {
                    borderWidth: 3
                }
            }],
            itemStyle: {
                // color: 'yellow',
                // borderWidth: 2
            },
            emphasis: {
                itemStyle: {
                    color: 'red'
                }
            },
            highlight: {
                itemStyle: {
                    color: 'orange'
                }
            },
            downplay: {
                itemStyle: {
                    color: '#142734'
                }
            }
        }
    }
    $.extend( true,option, opts.options )
    return Charts(opts.id).sector(JSON.parse(JSON.stringify(option)))
}

/**
 * 基于initXbar，干掉stack重叠效果
 id:id,
 data:[
 xValue: ['周一','周二','周三','周四','周五','周六','周日'],
 value:[
 {
     name:'最紧急消息',
     value:[1,1,2,4,5,6,7]
 },
 {
     name:'紧急消息',
     value:[6,2,3,4,5,6,7]
 }
 ]
 ],
 color:[],//颜色
 unit:'个',//单位
 barWidth:''//柱状宽度
 **/
Charts.initBar = function(opts){
    //无数据处理
    if((Charts(opts.id).isNoData(opts.data) == false)){
        return;
    }
    var dataDefault = {
        xValue: ['周一','周二','周三','周四','周五','周六','周日'],
        value:[
            {
                name:'最紧急消息',
                value:[1,1,2,4,5,6,7]
            },
            {
                name:'紧急消息',
                value:[6,2,3,4,5,6,7]
            }
        ]
    }
    var option = {
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            textStyle:{
                color:'#d5d7da'
            },
            bottom:'4%',
            data: []
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '22%',
            top:'10%',
            containLabel: true
        },
        itemStyle: {
            normal: {
                borderColor: "#fff",
                borderWidth: 2
            },
            emphasis: {
                borderColor: "#fff",
                borderWidth: 2
            }
        },
        yAxis:  {
            type: 'value',
            nameTextStyle: {
                color: '#c1c1c1'
            },
            axisLine: {
                show:true,
                lineStyle: {
                    color: '#c1c1c1'
                }
            },
            axisLabel: {
                formatter: '{value} '+(opts.unit || 'ms'),
                textStyle: {
                    color: '#c1c1c1'  // 横坐标线颜色
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
        },
        xAxis: {
            type : 'category',
            // boundaryGap : false,
            z:2,
            axisLine: {
                show:true,
                lineStyle: {
                    color: '#c1c1c1'
                }
            },
            axisTick: {
                alignWithLabel: true
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
            data: []
        },
        series: [],
        color:opts.color?opts.color : ['#93c62d','#baa0e9','#2196f3','#f76e5d']
    };

    function optExtend(data){
        option.xAxis.data = data.xValue
        var total = []
        for(var i = 0; i < data.value.length; i++){
            var color = '';
            option.legend.data.push(data.value[i].name);
            option.series.push({
                name: data.value[i].name,
                type: 'bar',
                barWidth:opts.barWidth || '30%',
                data: data.value[i].value || data.value[i].data,
                // itemStyle:{
                //     normal:{
                //         color:color
                //     }
                // }
            })
        }

    }
    optExtend(opts.data=='test'?dataDefault:opts.data)
    //$.extend( true,option, opts.options );
    //return Charts(opts.id).bar(JSON.parse(JSON.stringify(option)))
    return Charts(opts.id).bar($.extend( true,{},option, opts.options ));
}
export default Charts
