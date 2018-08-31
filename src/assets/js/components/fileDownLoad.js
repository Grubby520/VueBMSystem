
function fileDownLoad(url){
    if(!!window.ActiveXObject || "ActiveXObject" in window){ // IE

           var form = document.createElement('form')//定义form表单,通过表单发送请求
               form.setAttribute("style","display:none")//设置为不显示
               form.setAttribute("target","")
               form.setAttribute("method","get")//设置请求类型
               form.setAttribute("action",url)//设置请求路径
               document.getElementsByTagName('body')[0].appendChild(form)//添加表单到页面(body)中
               form.submit()//表单提交
    }else{

        // 谷歌支持
        // var a = document.createElement('a')
        // a.setAttribute('href', url)
        // a.setAttribute('download', '')
        // a.click()

        // 火狐谷歌
        window.open(url)
    }


}

export default fileDownLoad