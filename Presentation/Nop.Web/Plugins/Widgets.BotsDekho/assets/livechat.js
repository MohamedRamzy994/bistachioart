(function() {
    var w = window;
    var d = document;
    var iframeEl;
    var userId = getObject("b_uid");
    var config = null;

    function createButtons() {
        let lcConnectChat = document.getElementById("lc-connect-chat");
        iframeEl = document.getElementById("botify-iframe");
        lcConnectChat.addEventListener("click", function() {
            var json = {
                "action": "CONNECT"
            };
            iframeEl.contentWindow.postMessage(JSON.stringify(json), '*');
            iframeEl.style.display = "block";
            d.getElementById("lc-connect").style.display = "none";
            if (window.innerWidth < 767) {
                parent.document.body.classList.add("stop-scrolling");
            }
            closePopupMessage();
        });

        let lcClosePopup = document.getElementById("lc-close-popup");
        lcClosePopup.addEventListener("click", function() {
            closePopupMessage();
        });
    }
    createButtons();

    function closePopupMessage() {
        d.getElementById("lc-text-window").style.display = "none";
        setCookie("lc_is_auto_popup_message", false, 30);
    }

    function disconnectLC() {
        setCookie("lc_is_auto_popup", false, 30);
        iframeEl.style.display = "none";
        d.getElementById("lc-connect").style.display = "block";
        parent.document.body.classList.remove("stop-scrolling");
    }

    function lcCloseIframe() {
        disconnectLC();
    }

    // addEventListener support for IE8
    function bindEvent(element, eventName, eventHandler) {
        if (element.addEventListener) {
            element.addEventListener(eventName, eventHandler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + eventName, eventHandler);
        }
    }

    // Listen to message from child iframe
    bindEvent(window, 'message', function(e) {
        try {
            if (e.data != undefined) {
                var msg = JSON.parse(e.data);
                if (msg == null)
                    return;

                switch (msg.action) {
                    case 'ADDUSERANDSTARTCHAT':
                        setObject("b_uid", msg.userId);
                        break;
                    case 'CLOSE_IFRAME':
                        lcCloseIframe();
                        break;
                    default:
                }
            }
        } catch (err) {
            console.log("Error on bindEvent");
        }
    });

    // localStorage
    function setObject(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function getObject(key) {
        var value = localStorage.getItem(key);
        return value && JSON.parse(value);
    }

    // cookie Info
    function setCookie(cname, cvalue, exmins) {
        if (exmins) {
            var date = new Date();
            date.setTime(date.getTime() + exmins * 60 * 1000);
            var expires = "; expires=" + date.toGMTString();
        } else {
            var expires = "";
        }
        d.cookie = cname + "=" + cvalue + expires + ";path=/";
    }

})();
