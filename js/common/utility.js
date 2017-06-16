define(function(require,exports,module){
    var exports = {
        'Language':{
            'isArray':function(source){
                return '[object Array]' == Object.prototype.toString.call(source);
            },
            'isString':function(source){
                return '[object String]' == Object.prototype.toString.call(source);
            }
        },
        'String':{

        },
        /*   AJAX的jsonp方式实现跨域： 只要是jsonp方式都需要和服务器端约定和配合
            $.ajax({
                url:'',
                type:'get| post',
                datatype:'jsonp'
                data:{},
                async:true | false ，//都可以，对jsonp无影响
                jsonp:'callbackParam',
                jsonpCallback: CallbackFunction,
                success:function(){},
                error:function(){}
            });
            客户端在window下一个全局方法： function CallbackFunction(){....}

            服务器端接收到的请求是： url + data + &callbackParam=CallbackFunction
            服务器端响应客户端： CallbackFunction({json数据})
        * */
        'DateTime':{

        },
        'URL':{

        }

    };
    module.exports = exports;
});