/****  i18n (一款轻量级的实现web国际化的jQuery插件 )
   目前java，android实现国际化的方式是加载property文件，jQuery的i18n也是采用这种方式，
  这样如果要在java程序和前端javascript程序中共享语言文件的时候，就特别受用
        i18n有几个接口
        1 . jQuery.i18n.properties({}) 配置插件。包括资源文件地址，使用方式，是否缓存等等
                 jQuery.i18n.properties({
                   name:'strings',// 资源文件名称
                   path:'bundle/',// 资源文件所在目录路径
                   mode:'both',// 模式：变量或 Map
                   language:'pt_PT',// 对应的语言
                   cache:false,
                   encoding: 'UTF-8',
                   callback: function() {// 回调方法
                   }
                });
        2.  jQuery.i18n.prop(key)    根据资源文件中每句文案的key值，取相应语言的value值
                当 key 指定的值含有占位符时，可以使用 jQuery.i18n.prop(key,var1,var2 … ) 的形式，其中 var1,var2 …对各占位符依次进行替换。
                例如"msg_hello= 您好 {0}，今天是 {1}。", 可以用“jQuery.i18n.prop('msg_hello','小明' ,'星期一');”来使用 msg_hello
        3.  jQuery.i18n.browserLang()  获取浏览浏览器的语言信


   jQuery的 i18n 有如下要点：
   1. 使用java标准的.property 文件作为资源文件， 资源文件的命名有以下三种格式：
        1.1  basename.properties
        1.2  basename_language.properties
        1.3  basename_language_country.properties
  2.使用ISO-639作为语言编码标准，使用ISO-3166作为国家名称编码标准
  3.按顺序先加载默认资源文件。再加载特定语言文件，保证默认值始终可用不会为空
  4.没有指定语言文件时，使用浏览器提供的语言
  5.可以在资源字符串里使用占位符 比如hello=你好，{0}!
  6.资源文件中的key支持命名空间  例如：com.company.msgs.hello =hello!
  7.支持跨行的值
  8.可以用Javascript(或函数)或者Map的方式使用资源文件中的Key
 */
function cookie_get(cookie_name) {
    if(!cookie_name){
        return null;
    }
    var reg = new RegExp("(^| )" + cookie_name + "=([^;]*)(;|$)");
    var arr = document.cookie.match(reg);
    if(arr){
        return arr[2];
    }else{
        return null;
    }
}
function cookie_set(cookie_name,cookie_value,time){
    var time = 24 * 60 * 60 * 1000;
    if(!cookie_name){
        return;
    }
    if(time>0){
        var time = new Date();
        time.setTime(time.getTime()+time) ;
    }
    var cookie_str = cookie_name+'='+cookie_value+';expires='+ time.toUTCString();
    document.cookie = cookie_str;
}
function getLanguage(){
    var language = cookie_get('locale');
    if(!language){
        language = (navigator.language || navigator.userLanguage).substr(0,2).toLowerCase();
        cookie_set('locale',language);
    }
    return language;
}

$.i18n.properties({
    name:'language',// 资源文件名称
    path:pjPath + 'i18n/',// 资源文件所在目录路径
    mode:'both',// 模式：变量或 Map
    language:getLanguage(),// 对应的语言
    cache:true,
    encoding: 'UTF-8',
    callback: function() {// 回调方法
        $('#welcome').html($.i18n.prop('Welcome','晓明'));
        $('#home').html($.i18n.prop('Home'));
}});