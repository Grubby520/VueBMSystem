
/**
 * 业务相关工具
 */
export default {
  //echarts 线图数据个数转换
  getEchartLineData(data=[],names=[],valKeys=[],xKey){
    let lineData = {
      xValue:[],
      value:[]
    };

    names.forEach(function(ele,index){
      lineData.value.push({
        _valKey:valKeys[index],
        name:ele,
        data:[]
      })
    });

    data.forEach(function(value){
      lineData.xValue.push(value[xKey]);
      lineData.value.forEach(function(ele){
        ele.data.push(value[ele._valKey])
      });
    });

    return lineData;
  }
}