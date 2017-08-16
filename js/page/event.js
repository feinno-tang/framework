var client=function() {
    var engine={
        ie:0,
        gecko:0,
        webkit:0,
        khtml:0,
        opera:0,
        ver:null//保存具体的浏览器版本
    };
    return {
        engine:engine
    };
}();
var engine=client.engine;
var ua=navigator.userAgent;
var EventUtil = {
    addHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    removeHandler: function (element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    },
    getEvent: function (event) {
        return event ? event : window.event;
    },
    getTarget: function (event) {
        return event.target || event.srcElement;
    },
    preventDefault: function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    stopPropagation: function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },
    /**
     *mouseover,mouseout  失去光标元素和获得光标元素
     * @param event
     * @returns
     */
    getRelatedTarget: function(event){
        if (event.relatedTarget){
            return event.relatedTarget;
        } else if (event.toElement){
            return event.toElement;
        } else if (event.fromElement){
            return event.fromElement;
        } else {
            return null;
        }
    },
    /**
     * 获得键盘的ASCII码，可通过String.fromCharCode();转换成实际的字符
     */
    getCharCode: function(event){
        if (typeof event.charCode == "number"){
            return event.charCode;
        } else {
            return event.keyCode;
        }
    },
    /**
     * DOM中 0==鼠标左键 1==鼠标中间的滑轮 2==鼠标右键
     * IE中要对8中按钮属性值进行规范处理
     * @param event
     * @returns
     */
    getButton: function(event){
        if (document.implementation.hasFeature("MouseEvents", "2.0")){ //DOM
            return event.button;
        } else { //ie
            switch(event.button){
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4:
                    return 1;
            }
        }
    },
    /***
     * 获得鼠标滚轮的增量值 默认120
     */
    getWheelDelta: function(event){
        if (event.wheelDelta){
            return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
        } else { //FF
            return -event.detail * 40;
        }
    },
    /**
     * element仅限于哪些可以用鼠标选择文本的 textarea ,input之类的控件.获得选择的文本内容
     * @param element
     */
    getSelectedText:function(element){
        if(document.selection){//IE
            return document.selection.createRange().text;
        }else{
            return element.value.substring(element.selectionStart,element.selectionEnd);
        }
    },
    /**
     * 设置选择文本
     * @param textbox
     * @param startIndex
     * @param stopIndex
     */
    setSelectText:function(textbox,startIndex,stopIndex){
        if(textbox.setSelectionRange){
            textbox.setSelectionRange(startIndex,stopIndex);
        }else if(textbox.createTextRange){
            var range=textbox.createTextRange();
            range.collapse();
            range.moveStart("character",startIndex);
            range.moveEnd("character",stopIndex-startIndex);
            range.select();
        }
        textbox.focus();
    },
    /**
     * 屏蔽键盘上输入非数值字符 firefox 非字符键触发的keypress时间对于字符编码0，ksafari3，则对于8
     * @param event
     */
    preventNotNumber:function(event){
        event=this.getEvent(event);
        var target=this.getTarget(event);
        var charCode=this.getCharCode(event);
        if(!/\d/.test(String.fromCharCode(charCode))&&charCode>9&&!event.ctrlKey){
            this.preventDefault(event);
        }

    },
    /**
     * 获得粘贴板内容
     * @param event
     * @returns
     */
    getClipboardText:function(event){
        var clipboardData=(event.clipboardData || window.clipboardData);
        return clipboardData.getData("text");
    },
    /**
     * 设置粘贴板内容
     * @param event
     * @returns
     */
    setClipboardText:function(event){
        if(event.clipboardData){//safari,chrome
            return event.clipboardData.setData("text/plain",value);
        }else if(window.clipboardData){//IE
            return window.clipboardData.setData("text");
        }
    },
    /**
     * 自动切换焦点,<input type="text" id="textTel1" maxlength="3"/>
     * EventUtil.addHandler("textbox1","keyup",tabForward)
     */
    tabForward:function(event){
        event=this.getEvent(event);
        var target=this.getTarget(event);
        if(target.value.length == target.maxLength){
            var form = target.form;
            for(var i=0,len=form.elements.length;i<len;i++){
                if(form.elements[i]==target){
                    form.elements[i+1].foucs();
                    return;
                }
            }
        }
    },
    /**
     * 序列化form表单
     */
    serializeForm:function(form){
        var parts=new Array();
        var field=null;
        for(var i=0,len=form.elements.length;i<len;i++){
            field=form.elements[i];
            switch(field.type){
                case "select-one":
                case "select-multiple":
                    for(var j=0,oplen=field.options.length;j<oplen;j++){
                        var option=field.options[j];
                        if(option.selected){
                            var optValue="";
                            if(option.hasAttribute){
                                optValue=option.hasAttribute("value")?option.value:option.text;
                            }else{
                                optValue=option.attributes["value"].specified?option.value:option.text;
                            }
                            parts.push(encodeURIComponent(field.name)+"="+encodeURIComponent(optValue));
                        }
                    }
                    break;

                case undefined:
                case "file":
                case "submit":
                case "reset":
                case "button":
                    break;
                case "radio":
                case "checkbox":
                    if(!field.checked){
                        break;
                    }
                default:
                    parts.push(encodeURIComponent(field.name)+"="+encodeURIComponent(field.value));
            }
        }
        return parts.join("&");
    },
    contains:function(refNode,otherNode){
        if(typeof refNode.contains == "function" && (!client.engine.webkit||client.engine.webkit>=522)){
            return refNode.contains(otherNode);
        }else if(typeof refNode.compareDocumentPostion=="function"){
            return !!(refNode.compareDocumentPostion(otherNode)&16);
        }else{
            var node=otherNode.parentNode;
            do{
                if(node==refNode){
                    return true;
                }else{
                    node=node.parentNode;
                }
            }while(node!==null)
            return false;
        }
    }

};
(function(){
    function handleMouseWheel(event){
        event = EventUtil.getEvent(event);
        var delta = EventUtil.getWheelDelta(event);
        alert(delta);
    }
    EventUtil.addHandler(document, "mousewheel", handleMouseWheel);
    EventUtil.addHandler(document, "DOMMouseScroll", handleMouseWheel);
})();
/**

var textbox = document.getElementById("myText");
EventUtil.addHandler(textbox, "keyup", function(event){
    event = EventUtil.getEvent(event);
    //alert(event.keyCode);
});

//插入事件
EventUtil.addHandler(window, "load", function(event){
    var list = document.getElementById("myList");
    var item = document.createElement("li");
    item.appendChild(document.createTextNode("Item 4"));
    EventUtil.addHandler(document, "DOMSubtreeModified", function(event){
        // alert(event.type);
        // alert(event.target);
    });
    EventUtil.addHandler(document, "DOMNodeInserted", function(event){
        // alert(event.type);
        // alert(event.target);
        // alert(event.relatedNode);
    });
    EventUtil.addHandler(item, "DOMNodeInsertedIntoDocument", function(event){
        // alert(event.type);
        // alert(event.target);
    });
    list.appendChild(item);
});

EventUtil.addHandler(document, "DOMContentLoaded", function(event){
    alert("Content loaded");
});

EventUtil.addHandler(document, "readystatechange", function(event){
    if (document.readyState == "interactive"){
        alert("Content loaded");
    }
});

// 加载外部JAVASCRIPT代码
EventUtil.addHandler(window, "load", function(){
    var script = document.createElement("script");
    EventUtil.addHandler(script, "readystatechange", function(event){
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        // uninitialized（未初始化）：对象存在但尚未初始化。
        // loading（正在加载）：对象正在加载数据。
        //loaded（加载完毕）：对象加载数据完成。
        // interactive（交互）：可以操作对象了，但还没有完全加载。
        // complete（完成）：对象已经加载完毕。
        if (target.readyState == "loaded" || target.readyState == "complete"){
            EventUtil.removeHandler(target, "readystatechange", arguments. callee);
            alert("Script Loaded");
        }
    });
    script.src = "lazyload.js";
    document.body.appendChild(script);
});


//右键菜单 contextmenu
EventUtil.addHandler(window, "load", function(event){
    var div = document.getElementById("myDiv");
    EventUtil.addHandler(div, "contextmenu", function(event){
        event = EventUtil.getEvent(event);
        EventUtil.preventDefault(event);
        var menu = document.getElementById("myMenu");
        menu.style.left = event.clientX + "px";
        menu.style.top = event.clientY + "px";
        menu.style.visibility = "visible";
    });
    EventUtil.addHandler(document, "click", function(event){
        document.getElementById("myMenu").style.visibility = "hidden";
    });
});

// 离开页面
EventUtil.addHandler(window, "beforeunload", function(event){
    event = EventUtil.getEvent(event);
    var message = "I'm really going to miss you if you go.";
    event.returnValue = message;
    return message;
});

//触摸屏事件
function handleTouchEvent(event){
//只跟踪一次触摸
    if (event.touches.length == 1){
        var output = document.getElementById("output");
        switch(event.type){
            case "touchstart":
                output.innerHTML = "Touch started (" + event.touches[0].clientX +
                    "," + event.touches[0].clientY + ")";
                break;
            case "touchend":
                output.innerHTML += "<br>Touch ended (" +
                    event.changedTouches[0].clientX + "," +
                    event.changedTouches[0].clientY + ")";
                break;
            case "touchmove":
                event.preventDefault(); //阻止滚动
                output.innerHTML += "<br>Touch moved (" +
                    event.changedTouches[0].clientX + "," +
                    event.changedTouches[0].clientY + ")";
                break;
        }
    }
}
EventUtil.addHandler(document, "touchstart", handleTouchEvent);
EventUtil.addHandler(document, "touchend", handleTouchEvent);
EventUtil.addHandler(document, "touchmove", handleTouchEvent);

// 手势
function handleGestureEvent(event){
    var output = document.getElementById("output");
    switch(event.type){
        case "gesturestart":
            output.innerHTML = "Gesture started (rotation=" + event.rotation +
                ",scale=" + event.scale + ")";
            break;
        case "gestureend":
            output.innerHTML += "<br>Gesture ended (rotation=" + event.rotation +
                ",scale=" + event.scale + ")";
            break;
        case "gesturechange":
            output.innerHTML += "<br>Gesture changed (rotation=" + event.rotation +
                ",scale=" + event.scale + ")";
            break;
    }
}
document.addEventListener("gesturestart", handleGestureEvent, false);
document.addEventListener("gestureend", handleGestureEvent, false);
document.addEventListener("gesturechange", handleGestureEvent, false);

 */