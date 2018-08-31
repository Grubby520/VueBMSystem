/*
 *依赖d3.min.v3x.js
 *依赖jquery-1.11.0.min.js
 */
let d3 = require('d3');
import $ from 'jquery';

function Bubble(option){
	
	var _defaultOption = {
		width:300,
		height:300,
		bubbleMaxR:25,
		bubbleMinR:10,
		padding:1.5,
		data:'',
		conEle:''
	};
	
	option = $.extend(true, _defaultOption,option);
	
	this.width  = option.width;
	this.height = option.height;
	this.padding= option.padding;
	this.data   = option.data;//数据url或对象,必填
	this.conEle = option.conEle;//svg容器(node或者选择器)，必填
	this.bubbleMaxR = option.bubbleMaxR;
	this.bubbleMinR = option.bubbleMinR;
	this.mouseenter = function(d,node){console.log(node)};
	
	this.mouseleave = function(d,node){console.log(node)}
	
}

Bubble.prototype.init = function(){
	var that = this,
	//1.设置颜色color = d3.scale.category20c(),
	//2.布局
	bubble = d3.layout.pack()
			.sort(null)
			.size([that.width,that.height])
			.padding(that.padding),
	//3.添加svg元素
	svg = d3.select(that.conEle).append("svg")             
            .attr("width", that.width)  
            .attr("height", that.height);
    //4.数据请求及图形绘制
    if(typeStr(that.data)=='[object string]'){
      d3.json(that.data,function(error,data){
        if(error) throw error;
        //1.对数据进行处理
        data = dataHandle(data);
        render(svg,bubble,that,data);
      })
    }else{
      render(svg,bubble,that,dataHandle(that.data));
    }
    
};

function typeStr(obj){
	return Object.prototype.toString.call(obj).toLowerCase();
}

//Returns a flattened hierarchy containing all leaf nodes under the root.  
function classes(root){
	var classes = [];                                                                                        //存储结果的数组  
    /* 
     * 自定义递归函数
     * 第二个参数指传入的json对象 
     */  
    function recurse(name, node) {  
        if (node.children)                                                                                   //如果有孩子结点 （这里的children不是自带的，是json里面有的）  
        {  
            node.children.forEach(function(child) {                                                          //将孩子结点中的每条数据  
                recurse(node.name, child); 
            })
        }  
        else {
          //如果自身是孩子结点的，将内容压入数组
          classes.push({ name: node.name, value: node.size,props:node.props})
        }
    }  
    recurse(null, root);  
    return {children: classes};
}

function render(view,layout,context,data,cb){
	var node = view.selectAll(".node")
          //绑定数据（配置结点）
          .data(layout.nodes(classes(data)) 
          .filter(function(d) {
            //数据过滤，满足条件返回自身（没孩子返回自身，有孩子不返回，这里目的是去除父节点）
            return !d.children;
          }))
          .enter().append("g")  
          .attr("class", "node")
          .attr("transform", function(d) {
            //设定g移动
            return "translate(" + d.x + "," + d.y + ")"; 
          }),
          usingNodes = node.filter(function(d){
            return d.props.using;
          }),
          time = +new Date(),
          duration = 1000,
          strokeWidth =0;
	
	var rLinearCapped = d3.scale.linear()
		.domain([1,Math.min.apply(null,[context.width,context.height])/2])
		.range([context.bubbleMinR,context.bubbleMaxR]);
      
    node.append("circle")  
        .attr("r", function(d) {
          //设置圆的半径
          return rLinearCapped(d.r);
        })                             
        .style("fill", function(d) {
          //为圆形填充颜色
          return d.props.color;
        })
        .style("fill-opacity",0.8);
      
    node.append("text")
        .attr("dy", ".3em")
        //设置文本对齐 
        .style("text-anchor", "middle")
        .style("font-size",'10px')
        .style("fill", "#fff")
        //根据半径的大小来截取对应长度字符串(很重要)
        .text(function(d) { 
          return d.name.substring(0, d.r / 3);
        });
        
    function animate(){
      var nowTime = +new Date();
      if((nowTime-duration) > time) {
        time = nowTime;
        strokeWidth = 0;
      }
  
      strokeWidth += 0.6;
      //strokeWidth >10?strokeWidth=10:strokeWidth += 1;
      usingNodes.select("circle")
      .style("stroke-width",strokeWidth+'px')
      .style("stroke-opacity",'0.3')
      .style("stroke",function(d){
        return d.props.color;
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();

    if(typeof cb === 'function'){
      cb();
    }

    node.on('mouseenter',function(d){
      var node = this;
      context.mouseenter(d,node);
    });
    
    node.on('mouseleave',function(d){
      var node = this;
      context.mouseleave(d,node);
    })
    
    
}

//定义数据处理方法
function dataHandle(data){
	var result = {
		name:"flare",
		children:[]
	};
	data.forEach(function(ele){
    result.children.push({
      name:ele.name,
      size:ele.value,
      props:ele.props
    });
	}); 
	
	/**
	 * 结果数据：
	 * {
	 *  "name": "flare",
	 *  "children": [
	 * 	{"name": "", "size": 50,props:{}},
	 *  {"name": "", "size": 100,props:{}},
	 *  {"name": "", "size": 80,props:{}}
	 *]
	 *}
	 */
	return result;
}

export default Bubble;