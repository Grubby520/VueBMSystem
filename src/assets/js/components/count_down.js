/**
    倒计时

**/
function countdown(opts){
        var deadTime = new Date(opts.time);
        setInterval(function(){
            var curTime = new Date();
            if(curTime < deadTime){
                var gapTime = deadTime.getTime() - curTime.getTime() ;
            }else{
                var gapTime = curTime.getTime() - deadTime.getTime() ;
            }
            var day = Math.floor(gapTime/86400000);
            var hour = Math.floor(gapTime%86400000/3600000);
            var minute = Math.floor(gapTime%86400000%3600000/60000);
            var secend = Math.floor(gapTime%86400000%3600000%60000/1000);
            var str = '倒计时: <i>'+  day +'</i> 天 <i>' + hour + '</i> 时 <i>' + minute + '</i> 分 <i>' + secend + '</i>秒'
            var ele = document.getElementById(opts.id)
            ele.innerHTML = str
        }, 1000)

}

