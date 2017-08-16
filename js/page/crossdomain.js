/**
 * 跨域背景： 浏览器的同源策略(same-origin policy)，试想一下，如果没有同源策略，在浏览器中打开的多个窗口a，窗口b,
 * 窗口b可以执行窗口a里的方法，或者操作页面a的cookie等信息，甚至获得页面a的用户敏感信息，这显然是不合理的
 * 何为跨域： 协议，域名，端口，三者有一个不同  即视为跨域了


   (下面以 example.com/a.html 页面，跨域请求 example2.com/b.html (b.php 等等)页面为例)

   跨域的几种情况。总结：
   0. server端代理
      前端不能跨域，但是服务器端可以啊，（有安全隐患么？）
      所以可以用服务器端做个代理，前端请求server,server通过curl_url之类的方法去第三方服务器取数据，取回来返给前端即可

   1.jsonp （与服务器页面配合）
      jsonp是一种非官方协议，基本原理是 js的script标签的src属性。不受跨域的限制，能够加载不同域名的url地址
      方法： a页面创建<script>标签,设置src属性为b.html + 参数 + callback ,b页面根据获取的参数，查询数据，然后
        调用callback function + （结果），然后然后new Function()或者eval

      应用： jquery的jsonp
            $.ajax({
                url:'',
                datatype:'jsonp',
                jsonp:'callback',
                jsonpCallback:'callbackFunctionName'
            });

       !!! 注意；jquery.getJSON()并不能跨域 ,只是便于加载json文件的 ！！！


   2. CORS   "跨域资源共享"（Cross-origin resource sharing）
            新版本的XHR  即：XHR2 (html5 推出，IE11开始支持 )里有CORS新特性，支持通过设置HTTP header，允许符合条件的域进行请求
            服务器端设置如下：

             （1）Access-Control-Allow-Origin
             该字段是必须的。它的值要么是请求时Origin字段的值，要么是一个*，表示接受任意域名的请求。
             （2）Access-Control-Allow-Credentials
            该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。
            默认情况下，Cookie不包括在CORS请求之中。设为true，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。这个值也只能设为true，如果服务器不要浏览器发送Cookie，删除该字段即可。
             （3）Access-Control-Expose-Headers
             该字段可选。CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想拿到其他字段，就必须在Access-Control-Expose-Headers里面指定。上面的例子指定，getResponseHeader('FooBar')可以返回FooBar字段的值。

             引： http://www.ruanyifeng.com/blog/2016/04/cors.html


   3. HTML5的 window.postMessage方法 (IE8+ 支持 )

     *****  a.html
                 <script>
                 function getData(){
                        var iframe = document.createElement('iframe');
                        iframe.src = 'b.html';
                        document.body.appendChild(iframe);

                        iframe.onload = function(){
                            window.frames[0].postMessage('gggg','*');
                        };

                        window.addEventListener('message',function(e){
                            var color = e.data;
                            document.body.style.backgroundColor = color;
                        })
                    }
                 </script>
                 </head>
                 <body onload="getData()">


     ******* b.html
                 <script>
                 window.addEventListener('message',function(e){
                            alert(e);
                            if(e.source != window.parent) return;
                        });

                 window.addEventListener('click',function(e){
                            var a = document.body.style.backgroundColor == 'red' ? 'yellow': 'red';
                            document.body.style.backgroundColor = a;
                            window.parent.postMessage(a,'*');
                        });
                 </script>


   5.window.name  (与服务器页面配合：服务器页面给window.name 赋值或取值)
         window.name (兼容性好，不同浏览器window.name能设置, 但数据量有差异，且数据量不大 都不超过2m )
         应用：例如 a.html里一个iframe引用到b.html（在b.html里设置window.name ） 等iframe加载完成后，再操作window.name值

        *** a.html:
        <html>
            <head>
                <script>
                     function getData(){
                            var iframe = document.createElement('iframe');
                            iframe.src = 'test.html';
                            iframe.style.display = 'none';
                            iframe.onload = function(){
                                var data = iframe.contentWindow.name; //获取iframe的window
                                alert(data);//获取到了数据

                                //iframe 销毁
                                iframe.contentWindow.document.write(''); //清空内容
                                iframe.contentWindow.close(); //释放内存
                                iframe.remove();//删除iframe
                            };
                            document.body.appendChild(iframe);
                     }
                </script>
            </head>
            <body>
                <!-- html代码里写iframe的onload事件  不准成 -->
                <!----<iframe id="proxy" display="none;" src="example2.com/b.html" onload="getData()">---->
            </body>
        </html>

        **** b.html
             <!DOCTYPE html>
             <html lang="en">
                 <head>
                     <meta charset="UTF-8">
                     <title>Title</title>
                     <script>
                         window.name='22222222';
                         if(window.parent != window){alert(window.parent);}
                     </script>
                 </head>
                 <body>
                 </body>
             </html>



 5. document.domain  ( 只适用于两个页面域名是 父子域名，或者同级域名 ) 因为document.domain属性如果手动设置，值只能等于域名或者是其一部分（子集）
     不同的框架之间（父子或同辈），是能够获取到彼此的window对象的

 ****** a.html
     <script>
            document.domain = 'example.com' ;
            function onload(){
                var iframe = document.createElement('iframe');
                iframe.src = 'test.html';
                document.body.appendChild(iframe);
                iframe.onload = function(){
                    var win = iframe.contentWindow;
                    alert(win.color);
                }
            }
      </script>



 *******b.html
 　　document.domain = 'example.com' ;
      window.color = 'blue';
*/