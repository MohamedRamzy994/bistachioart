$(function() {
    'use strict';
    var apiKey = null;
    var nativeAgentId = null;
    var nativeDepartmentId = null;
    var nativeDepartmentName = null;
    var sessionId = null;
    var session = null;
    var token = null;
    var tokenJsonObj = null;
    var enableVideo = false;
    var enableAudio = true;
    var isCallDisconnectedByMe = false;
    var isFrontCamera = true;
    var publisher = null;
    var callTimeout = null;
    var w = window;
    var d = document;
    var client;
    var socket = null;
    var recInterval = null;
    var lcAppointmentDate = null;
    var lcAppointmentTime = null;
    var appId = $('#app_id').val();
    var userId = $('#b_uid').val();
    var avatar = $('#avatar').val();
    var botChatBackground = $('#bot_chat_background').val();
    var botChatColor = $('#bot_chat_color').val();
    var userChatBackground = $('#user_chat_background').val();
    var userChatColor = $('#user_chat_color').val();
    var chatHeaderColorLeft = $('#chat_header_color_left').val();
    var chatHeaderColorRight = $('#chat_header_color_right').val();
    var chatSize = $('#chat_size').val();
    var welcomeMessage = $('#welcome_message').val();
    var isWelcomeEventCall = $('#is_welcome_event_call').val();
    var welcomeEventName = $('#welcome_event_name').val();
    var botifyHostName = window.location.hostname;
    var isResetState = false;
    var isAppVideoCall = false;
    var msgDataControlType = null;
    var message = null;
    var spinner = '<div id="overlay"><div class="cv-spinner"><span class="spinner"></span></div></div>';
    var loadHistory = '<div class="lc-load-history"><div id="load-history" class="lc-load-inner">Load History</div></div>';
    var loading = ' <div id="loading" class="lc-message lc-message-received"> ' + ((avatar) ? ' <div class="lc-message-avatar"> <img src="' + avatar + '" alt="Logo" /></div> ' : '') + ' <div class="lc-message-content"><div class="lc-message-bubble"><div class="lc-message-text"><p><span class="lc-etc"><i></i><i></i><i></i></span></p></div></div></div></div>';

    if (appId == null || botifyHostName == null) {
        return;
    }

    $(":root")[0].style.setProperty('--gradient', 'linear-gradient(90deg, ' + chatHeaderColorLeft + ' 0%, ' + chatHeaderColorRight + ' 100%)');
    $(":root")[0].style.setProperty('--botChatBackground', botChatBackground);
    $(":root")[0].style.setProperty('--botChatColor', botChatColor);
    $(":root")[0].style.setProperty('--userChatBackground', userChatBackground);
    $(":root")[0].style.setProperty('--userChatColor', userChatColor);
    $(":root")[0].style.setProperty('--chatHeaderColorLeft', chatHeaderColorLeft);
    $(":root")[0].style.setProperty('--chatHeaderColorRight', chatHeaderColorRight);
    $(":root")[0].style.setProperty('--userChatActive', hexToRgbA(userChatBackground, 0.070));

    $('.lc-start-video-call').click(function() {
        sendMessage('Initiate video call', 'CALL', 'VIDEO_CALL', true);
        isAppVideoCall = true;
        resetStream();
    });

    $('.lc-start-audio-call').click(function() {
        sendMessage('Initiate audio call', 'CALL', 'AUDIO_CALL', true);
    });

 // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        $('.lc-camera-flip').show();
    }

    function hexToRgbA(hex, opacity){
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+opacity+')';
        }
        throw new Error('Bad Hex');
    }

    function startVideoCall() {
        $('#lc-messages-chat-page').hide();
        $('#videos').show();
        $("#lc-connecting").fadeIn();
        initVideoCall();
        playConnectingAudio();
        $("#lc-dealer-name").text(nativeDepartmentName);
    }

    // On/Off Camera
    $(d).on("click", ".lc-video-camera", function() {
        cameraOnOff();
    });

    // On/Off Audio
    $(d).on("click", ".lc-microphone", function() {
        audioOnOff();
    });

    // Disconnect Video Chat
    $(d).on("click", ".lc-phone-disconnect", function() {
        isCallDisconnectedByMe = true;
        updateVideoChatLog('disconnect');
        resetStream();
    });

    $(d).on("click", "#videocall", function() {
        initVideoCall();
    });

    $(d).on("click", ".lc-close-video", function() {
        resetStream();
        if (!isAppVideoCall) {
            lcCloseIframe();
        }
    });

    $(d).on("click", ".lc-close-iframe", function() {
        lcCloseIframe();
    });

    $(d).on("click", ".lc-camera-flip", function() {
        if (publisher != null) {
            publisher.cycleVideo();
        }
    });

    function updateVideoChatLog(event) {
        if (sessionId != null) {
            var disconnectedByUser = "customer";
            if (!isCallDisconnectedByMe) {
                disconnectedByUser = "agent";
            }
            const http = new XMLHttpRequest()
            var url = window.location.protocol + '//' + botifyHostName + '/api/v1/videochat/update-videochat-log?sessionId=' + sessionId + '&event=' + event + '&user=' + disconnectedByUser;
            http.open("GET", url);
            http.send();
        }
    }

    function updateAgentStaus(status) {
        if (nativeAgentId != null) {
            const http = new XMLHttpRequest()
            var url = window.location.protocol + '//' + botifyHostName + '/api/v1/agent/update-videochat-status?native_agent_id=' + nativeAgentId + '&status=' + status;
            http.open("GET", url);
            http.send();
        }
    }

    function handleError(error) {
        if (error) {
            updateAgentStaus('available');
            console.log(error.message);
        }
    }

    function initVideoCall() {
        const http = new XMLHttpRequest()
        var url = window.location.protocol + '//' + botifyHostName + '/api/v1/videochat/gettoken?appId=' + appId + '&uid=' + userId;
        if (nativeDepartmentId) {
            url += '&nativeDepartmentId=' + nativeDepartmentId;
        }
        http.open("GET", url);
        http.send();

        http.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var tokenJsonResponse = http.responseText;
                console.log(tokenJsonResponse)
                tokenJsonObj = JSON.parse(tokenJsonResponse);
                apiKey = tokenJsonObj.result.api_key;
                sessionId = tokenJsonObj.result.session_id;
                token = tokenJsonObj.result.token;
                nativeAgentId = tokenJsonObj.result.native_agent_id;
                initializeSession();
            } else if (this.readyState == 4 && this.status != 200) {
                console.log(http.responseText);
                var responseJson = JSON.parse(http.responseText);
                showAlertMessage(responseJson.error);
            }
        };
    }

    function initializeSession() {
        session = OT.initSession(apiKey, sessionId);
        callTimeout = setTimeout(resetStream, 60000);
        pauseConnectingAudio();
        publisherNotOnCall();
        $(".lc-call-msg").text("ringing…");
        // Subscribe to a newly created stream
        session.on('streamCreated', function(event) {
            clearTimeout(callTimeout);
            publisherOnCall();
            session.subscribe(event.stream, 'subscriber', {
                insertMode: 'append',
                width: '100%',
                height: '100%'
            }, handleError);
        });

        session.on("streamDestroyed", function(event) {
            resetStream();
            console.log("streamDestroyed " + event.stream.name + " ended. " + event.reason);
        });

        session.on("connectionDestroyed", function(event) {
            showAlertMessage('Dealer has disconnected the call. Please try again after some time');
            console.log("connectionDestroyed " + event.reason);
        });

        session.on("sessionDisconnected", function(event) {
            console.log("sessionDisconnected " + event.reason);
            if (event.reason === 'networkDisconnected') {
                showAlertMessage('You have lost your internet connection. Please check your connection and try again.');
            } else {
                resetStream();
            }
        });

        // Create a publisher
        publisher = OT.initPublisher('publisher', {
            insertMode: 'append',
            width: '100%',
            height: '100%',
            publishAudio: true,
            publishVideo: false
        }, handleError);

        session.connect(token, function(error) {
            //If the connection is successful, initialize a publisher and publish to the session
            if (error) {
                handleError(error);
            } else {
                session.publish(publisher, handleError);
                connectToAgent();
            }
        });

    }

    function connectToAgent() {
        playRingAudio();
        const http = new XMLHttpRequest()
        var url = window.location.protocol + '//' + botifyHostName + '/api/v1/videochat/connect-agent';
        http.open("POST", url, true);
        http.setRequestHeader("Content-Type", "application/json");
        console.log(tokenJsonObj.result)
        http.send(JSON.stringify(tokenJsonObj.result));

        http.onreadystatechange = function() {
            if (this.readyState == 4 && this.status != 200) {
                console.log(http.responseText);
                var responseJson = JSON.parse(http.responseText);
                showAlertMessage(responseJson.error);
            }
        };
    }

    function showAlertMessage(msg) {
        $(".lc-alert-text").text(msg);
        $("#lc-alert").show().delay(5000).fadeOut();
        pauseConnectingAudio();
        pauseRingAudio();
        setTimeout(function() {
            resetStream();
        }, 5000);
    }

    function resetStream() {
        updateVideoChatLog('disconnect');
        updateAgentStaus('available');
        if (session != null) {
            if (publisher != null) {
                session.unpublish(publisher);
            }
            session.disconnect();
        }
        $("#lc-connected").hide();
        $('#publisher').fadeOut();
        $('#subscriber').fadeOut();
        $('#videos').hide();
        $('#lc-messages-chat-page').show();
        enableVideo = false;
        enableAudio = true;
        isCallDisconnectedByMe = false;
        pauseConnectingAudio();
        pauseRingAudio();
        disableCamera();
        enableMicrophone();
        apiKey = null;
        nativeAgentId = null;
        nativeDepartmentId = null;
        nativeDepartmentName = null;
        sessionId = null;
        session = null;
        token = null;
        tokenJsonObj = null;
        publisher = null;
        $("#lc-connecting").fadeOut();
        $('#lc-on-call-buttons').fadeOut();
        $(".lc-call-msg").text("calling…");
    }

    function publisherOnCall() {
        pauseRingAudio();
        $('#lc-on-call-buttons').fadeIn();
        $("#lc-connected").show();
        $("#lc-connecting").fadeOut();
        $('#publisher').fadeIn();
        $('#subscriber').fadeIn();
        $("#publisher").removeClass("publisher-not-on-call");
        $("#publisher").addClass("publisher-on-call");
    }

    function publisherNotOnCall() {
        $("#publisher").removeClass("publisher-on-call");
        $("#publisher").addClass("publisher-not-on-call");
    }

    function enableCamera() {
        $('.lc-video-slash-solid').hide();
        $('.lc-video-solid').show();
    }

    function disableCamera() {
        $('.lc-video-solid').hide();
        $('.lc-video-slash-solid').show();
    }

    function enableMicrophone() {
        $('.lc-microphone-slash').hide();
        $('.lc-microphone-solid').show();
    }

    function disableMicrophone() {
        $('.lc-microphone-solid').hide();
        $('.lc-microphone-slash').show();
    }

    function playConnectingAudio() {
        callRingAlert("PLAY_CONNECTING_RING");
    }

    function playRingAudio() {
        callRingAlert("PLAY_RINGING");
    }

    function pauseConnectingAudio() {
        callRingAlert("PAUSE_CONNECTING_RING");
    }

    function pauseRingAudio() {
        callRingAlert("PAUSE_RINGING");
    }

    function cameraOnOff() {
        if (enableVideo) {
            if (publisher != null) {
                publisher.publishVideo(false);
            }
            enableVideo = false;
            disableCamera();
        } else {
            if (publisher != null) {
                publisher.publishVideo(true);
            }
            enableVideo = true;
            enableCamera();
        }
    }

    function audioOnOff() {
        if (enableAudio) {
            if (publisher != null) {
                publisher.publishAudio(false);
            }
            enableAudio = false;
            disableMicrophone();
        } else {
            if (publisher != null) {
                publisher.publishAudio(true);
            }
            enableAudio = true;
            enableMicrophone();
        }
    }

    function showMessage(msg) {
        message = msg;
        msgDataControlType = msg.data_control;
        if (msg.incoming == true) {
            $('#lc-chat-window').append(showTextMessage(msg));
            callAnalytics("Incoming Message");
            scrollHeight();
        } else {
            callAnalytics("Outgoing Message");
            manageTextBox(true);
            hideLoading();
            if (msg.data_control != 'stop') {
                showLoading();
            }
            setTimeout(() => {
                hideLoading();
                showOutgoingMessage(msg);
                scrollHeight();
                if ($.isEmptyObject(msg.data_control)) {
                    manageTextBox(false);
                }
                switch (msg.data_control) {
                    case "button":
                        showButton(msg);
                        break;
                    case "multi-button":
                        showMultiButton(msg);
                        break;
                    case "file-upload":
                        showFileUpload(msg);
                        break;
                    case "multi-select":
                    case "checkbox":
                        showMultiSelectionList(msg);
                        break;
                    case "single-select":
                    case "radio":
                        showSingleSelectionList(msg);
                        break;
                    case "name":
                    case "full-name":
                    	showFullName(msg);
                        break;
                    case "address":
                        showAddress(msg);
                        break;
                    case "password":
                        showPassword(msg);
                        break;
                    case "email":
                        showEmail(msg);
                        break;
                    case "number":
                    case "telephone":
                    case "mobile-number":
                        showMobileNumber(msg);
                        break;
                    case "date":
                        showDate(msg);
                        break;
                    case "time":
                        showTime(msg);
                        break;
                    case "star-rating":
                        showStarRating(msg);
                        break;
                    case "video-call":
                        startVideoCall();
                        break;
                    case "stop":
                        stopWorkflow(msg);
                        break;
                    default:
                }
            }, 2500);
        }
        scrollHeight();
    }

    function showOutgoingMessage(msg) {
        switch (msg.data_control) {
            case "button":
            case "multi-button":
            case "multi-select":
            case "checkbox":
            case "single-select":
            case "radio":
            case "file-upload":
            case "date":
            case "time":
            case "stop":
                break;
            default:
                $('#lc-chat-window').append(showTextMessage(msg));
        }
    }

    function showButton(msg) {
        $('#lc-data-container').append('<div class="lc-welback-box lc-welfixed-bottom lc-fuelbox"><div class="lc-welinner-box"> <div class="lc-title-pop"> <div class="lc-inner-title">'+msg.liveChatMessageInfo.text+'</div></div> <div class="lc-content-body"> <ul id="button-list" class="lc-check-outer data-control-' + msg.data_control + '"></ul></div></div>');
        let list = msg.data_source.list;
        for (let i = 0; i < list.length; i++) {
            $('#button-list').append('<li value="' + list[i].value + '" data-name="' + list[i].dn + '"> <div class="lc-filtertypecheck">  <input class="lc-radiobtn" id="' + list[i].value + '" type="radio" name="' + msg.data_control + '">  <label for="' + list[i].value + '"> ' + list[i].dn + '</label> </div>  </li>');
        }
    }

    function showMultiButton(msg) {
        $('#lc-data-container').append('<div class="lc-welback-box lc-welfixed-bottom lc-suggest-wrap"><div class="lc-welinner-box"> <div class="lc-title-pop"> <div class="lc-inner-title">'+msg.liveChatMessageInfo.text+'</div></div> <div class="lc-content-body"> <ul id="multi-button-list" class="lc-multi-check-outer"></ul><div class="lc-pop-bottom"><button type="button" id="lc-multi-send-button" class="lc-btn lc-send-button lc-fill-btn lc-disable-btn">Submit</button></div></div></div>');
        let list = msg.data_source.list;
        for (let i = 0; i < list.length; i++) {
            $('#multi-button-list').append('<li> <div class="lc-multicheck"> <input class="lc-radiobtn lc-checkboxbtn" id="' + list[i].value + '" type="checkbox" name="chat-checkbox" value="' + list[i].value + '" data-name="' + list[i].dn + '"><label for="' + list[i].value + '"><span class="lc-cricle-check lc-icon-22"></span> ' + list[i].dn + '</label></div> </li>');
        }
    }

    function showSingleSelectionList(msg) {
        $('#lc-data-container').append('<div class="lc-welback-box lc-welfixed-bottom lc-full-card-view lc-choose-options lc-radio-view"><div id="lc-single-select" class="lc-welinner-box"> <div class="lc-search-option"><div class="lc-form-group"> <button class="lc-srch-btn"><i class="lc-icon-35"></i></button><input type="text" placeholder="Search" class="lc-form-control lc-list-search" /></div></div><div class="lc-title-pop"><div class="lc-inner-title">' + msg.liveChatMessageInfo.text + '</div></div><div class="lc-content-body"><ul id="single-selection-list" class="lc-multi-check-outer lc-radio-list lc-data-list">  </ul></div> </div></div>');
        let list = msg.data_source.list;
        for (let i = 0; i < list.length; i++) {
            $('#single-selection-list').append('<li value="' + list[i].value + '" data-name="' + list[i].dn + '"> <div class="lc-multicheck lc-singlecheck"><input name="radiobtn" class="lc-radiobtn" id="' + list[i].value + '" type="radio" value="' + list[i].value + '"><label for="' + list[i].value + '"><span class="lc-cricle-check lc-icon-22"></span> ' + list[i].dn + '</label></div> </li>');
        }
        $('#single-selection-list').append('<span class="lc-list-empty lc-hide">No match found.</span>');
        $('#lc-single-select').css({
            'min-height': $('.lc-full-card-view').height() + 'px'
        });
    }

    function showMultiSelectionList(msg) {
        $('#lc-data-container').append('<div class="lc-welback-box lc-welfixed-bottom lc-full-card-view lc-choose-options"><div id="lc-multi-select" class="lc-welinner-box"> <div class="lc-search-option"><div class="lc-form-group"><button class="lc-srch-btn"><i class="lc-icon-35"></i></button><input type="text" placeholder="Search" class="lc-form-control lc-list-search" /></div></div> <div class="lc-title-pop"><div class="lc-inner-title">' + msg.liveChatMessageInfo.text + '</div></div><div class="lc-content-body"><ul id="multi-selection-list" class="lc-multi-check-outer lc-checkbox-list lc-data-list"> </ul><div class="lc-pop-bottom data-control-list"><button type="button" class="lc-btn lc-fill-btn lc-send-button lc-disable-btn">Submit</button></div> </div></div>');
        let list = msg.data_source.list;
        for (let i = 0; i < list.length; i++) {
            $('#multi-selection-list').append('<li> <div class="lc-multicheck"><input class="lc-radiobtn" id="' + list[i].value + '" type="checkbox" name="chat-checkbox" value="' + list[i].value + '"  data-name="' + list[i].dn + '"><label for="' + list[i].value + '"><span class="lc-cricle-check lc-icon-22"></span> ' + list[i].dn + ' </label></div></li>');
        }
        $('#multi-selection-list').append('<span class="lc-list-empty lc-hide">No match found.</span>');
        $('#lc-multi-select').css({
            'min-height': $('.lc-full-card-view').height() + 'px'
        });
    }

    function showFileUpload(msg) {
        let fileToUpload = {};
        let fileHtml = '<div class="lc-welback-box lc-welfixed-bottom lc-dup-popup">' +
            '           <div class="lc-welinner-box">' +
            '              <form id="fileupload" action="#" method="POST" enctype="multipart/form-data">' +
            '                 <div class="files" id="upload-files">' +
            '                    <div id="lc-file-dashboard">' +
            '                    <div class="lc-title-pop">' +
            '                       <div class="lc-inner-title">Choose your options</div>' +
            '                    </div>' +
            '                    <div class="lc-content-body">' +
            '                       <div class="lc-btn lc-border-btn lc-upload-btn"><input type="file" /> <i class="lc-icon-space lc-icon-30"></i>Choose from Device</div>' +
            '                              <a class="lc-btn lc-border-btn"><i class="lc-icon-space lc-icon-03"></i>Click Photo</a>' +
            '                    </div>' +
            '                    </div>' +
            '                    <div id="lc-file-list" style="display:none;">' +
            '                    <div class="lc-wel-top-head">' +
            '                       <div class="lc-title-pop">' +
            '                          <div class="lc-inner-title">Upload</div>' +
            '                       </div>' +
            '                    </div>' +
            '                    <div class="lc-content-body">' +
            '                       <ul class="lc-upload-process-list upload-file-list"> </ul>' +
            '                       <div class="lc-pop-bottom">' +
            '                          <div class="lc-btn lc-border-btn"><i class="lc-icon-40"></i> Add <input type="file"/></div>' +
            '                             <button type="button" class="lc-btn lc-border-btn file-upload-btn">Send</button>' +
            '                       </div>' +
            '                    </div>' +
            '                    </div>' +
            '                 </div>' +
            '               </div>' +
            '            </form>' +
            '        </div>' +
            '        </div>';

        $('#lc-data-container').append(fileHtml);

        $.fn.fileUploader = function(fileToUpload, fileId) {
            this.closest(".files").change(function(evt) {
                $(".upload-file-list").empty();
                let file = evt.target.files[0];
                fileToUpload.id = fileId;
                fileToUpload.file = file;
                $("#lc-file-dashboard").hide();
                $("#lc-file-list").fadeIn();
                var reader = new FileReader();
                reader.onload = function(e) {
                    $(".upload-file-list").append('<li>' +
                        ' <div class="lc-up-box">' +
                        '        <div class="lc-pic-area"><img src="' + e.target.result + '" alt="img"/></div>' +
                        '        <p>' + escape(file.name) + '</p> <a class="lc-delete-btn file-upload-remove-btn" data-fileid="' + fileId + '"><i class="lc-icon-42"></i></a>' +
                        '        <div class="lc-upload-progress-wrap">' +
                        '           <span class="lc-progress-bar lc-bar-color" style="width: 0%; background-color: #007fff;"></span>' +
                        '        </div>' +
                        '    </div>' +
                        ' </li>');
                };
                reader.readAsDataURL(file);

                // reset the input to null - nice little chrome bug!
                evt.target.value = null;
            });

            $(this).on("click", ".file-upload-remove-btn", function(e) {
                e.preventDefault();
                fileToUpload = {};
                $(this).parent().remove();
            });

            this.clear = function() {
                fileToUpload = {};
                $(".upload-file-list").empty();
            }

            $(".file-upload-btn").click(function(e) {
                e.preventDefault();
                if (jQuery.isEmptyObject(fileToUpload)) {
                    $(".upload-file-list").empty();
                    $(".upload-file-list").append('<li class="lc-file-upload-error"> Please select a file!</li>');
                    return;
                }
                let ext = fileToUpload.file.name.split('.').pop().toLowerCase();
                if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg', 'pdf', 'xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'txt']) == -1) {
                    $(".upload-file-list").empty();
                    $(".upload-file-list").append('<li class="lc-file-upload-error">Unsupported file type!</li>');
                    fileToUpload = {};
                    return;
                }
                var formData = new FormData();
                formData.append("file", fileToUpload.file);

                $.ajax({
                    xhr: function() {
                        var xhr = new window.XMLHttpRequest();
                        xhr.upload.addEventListener("progress", function(evt) {
                            if (evt.lengthComputable) {
                                var percentComplete = ((evt.loaded / evt.total) * 100);
                                setProgressBar(percentComplete - 10);
                            }
                        }, false);
                        return xhr;
                    },
                    type: 'POST',
                    url: w.location.protocol + '//' + botifyHostName + '/api/v1/livechat/file-upload/' + appId + '/' + userId,
                    data: formData,
                    contentType: false,
                    cache: false,
                    processData: false,
                    beforeSend: function() {
                        setProgressBar(0);
                    },
                    error: function(data) {
                        $(".upload-file-list").empty();
                        $(".upload-file-list").append('<li class="lc-file-upload-error"> <div class="lc-up-box lc-retry-box"> <div class="lc-pic-area"></div> <p>' + data.statusText + '</p> <a class="lc-retry-bt file-upload-btn">Retry</a> <div class="lc-upload-progress-wrap"><span class="lc-bar-color" style="width: 0%;"></span></div></div></li>');
                    },
                    success: function(data) {
                        if (data.result != null && data.status == 200) {
                            $('#lc-chat-window').append(showTextMessage(message));
                            sendMessage(createJSON(msgDataControlType, fileToUpload.file.name, data.result), 'TEXT', 'SEND_MESSAGE', false);
                            fileToUpload = {};
                            resetDataControl();
                        } else {
                            $(".upload-file-list").append('<li class="lc-file-upload-error">Please select a valid file to upload.</li>');
                        }
                        setProgressBar(100);
                    }
                });
            });
            return this;
        };

        function setProgressBar(percentage) {
            $('.lc-progress-bar').css({'width': percentage + '%', 'background-color' : (percentage > 60) ? '#007fff;' : '#34c86b;'});
        }

        (function() {
            var filesUploader = $("#upload-files").fileUploader(fileToUpload, "upload-file");
        })()
    }

    function showFullName(msg) {
        $('.lc-text-message').attr("placeholder", "Ex: Adam Williams");
        manageTextBox(false);
        focusTextMessage();
    }

    function showAddress(msg) {
        $('.lc-text-message').attr("placeholder", "Ex: B-14, JTM, Jaipur");
        $('.lc-text-message-outer').addClass("lc-address-bar");
        manageTextBox(false);
        focusTextMessage();
    }

    function showPassword(msg) {
        $('.lc-text-message').attr("placeholder", "Please enter password");
        $('.lc-text-message').addClass("lcNoSpace");
        $('.lc-text-message').addClass("lc-password");
        manageTextBox(false);
        focusTextMessage();
    }

    function showEmail(msg) {
        $('.lc-text-message').attr("placeholder", "Ex: adam@gmail.com");
        $('.lc-text-message').addClass("lcNoSpace");
        manageTextBox(false);
        focusTextMessage();
    }

    function showMobileNumber(msg) {
        $('#lc-text-box').hide();
        $('#lc-tel-box').show();
        $('.lc-text-message').attr("placeholder", "Ex: 8430806595");
        $('.lc-text-message').addClass("lcDigitsOnly");
        manageTextBox(false);
        focusTextMessage();
    }

    function showDate(msg) {
        $('#lc-data-container').append('<div class="lc-welback-box lc-welfixed-bottom lc-calander-wrap lc-calendar"> <div class="lc-welinner-box"><div class="lc-title-pop"><div class="lc-inner-title">' + msg.liveChatMessageInfo.text + ' </div></div><div class="lc-content-body"> <div class="lc-calender-block"> <div data-toggle="datepicker" id="lc-calendar"></div> </div></div></div></div>');
        $('#lc-data-container').append(' <div class="lc-welback-box lc-welfixed-bottom lc-choose-appointment lc-choose-appointment-date" style="display:none;"><div class="lc-welinner-box"><div class="lc-title-pop"><div class="lc-inner-title">' + msg.liveChatMessageInfo.text + '</div></div><div class="lc-content-body"><ul class="lc-time-date-outer"><li><a class="lc-tt-check lc-booking-appointment-date lc-change-my-date"><label>4-April-2019</label><span class="lc-cricle-check lc-icon-22"></span></a></li></ul><div class="lc-pop-bottom"><button type="button" class="lc-btn lc-fill-btn lc-send-button">Submit</button></div></div></div></div>');
        $('[data-toggle="datepicker"]').datepicker({
            container: "div#lc-calendar",
            autoShow: true,
            inline: true,
            pick: function(e) {
                e.preventDefault();
                let month = $(this).datepicker('getMonthName');
                lcAppointmentDate = e.date.getDate() + "-" + month + "-" + e.date.getFullYear();
                $('.lc-booking-appointment-date > label').text(lcAppointmentDate);
                $('.lc-calendar').hide();
                $('.lc-choose-appointment-date').fadeIn();
            }
        });
    }

    function showTime(msg) {
        $('#lc-data-container').append('<div class="lc-welback-box lc-welfixed-bottom lc-time-slot-popup lc-pre-cts"> <div class="lc-welinner-box"><div class="lc-title-pop"> <div class="lc-inner-title">Indicate a suitable time</div></div><div class="lc-content-body"> <div class="lc-time-slote-wrap"><ul id="lc-timepicker-list">  </ul> </div><div class="lc-pop-bottom lc-pre-cts"> <button type="button" class="lc-btn lc-border-btn lc-choose-my-time">Customize Time</button> </div></div></div> </div>');
        $('#lc-timepicker-list').append('<li> <div class="lc-time">12:00 AM</div> </li><li> <div class="lc-time">12:30 AM</div> </li><li> <div class="lc-time">01:00 AM</div> </li><li> <div class="lc-time">01:30 AM</div> </li><li> <div class="lc-time">02:00 AM</div> </li><li> <div class="lc-time">02:30 AM</div> </li><li> <div class="lc-time">03:00 AM</div> </li><li> <div class="lc-time">03:30 AM</div> </li><li> <div class="lc-time">04:00 AM</div> </li><li> <div class="lc-time">04:30 AM</div> </li><li> <div class="lc-time">05:00 AM</div> </li><li> <div class="lc-time">05:30 AM</div> </li><li> <div class="lc-time">06:00 AM</div> </li><li> <div class="lc-time">06:30 AM</div> </li><li> <div class="lc-time">07:00 AM</div> </li><li> <div class="lc-time">07:30 AM</div> </li><li> <div class="lc-time">08:00 AM</div> </li><li> <div class="lc-time">08:30 AM</div> </li><li> <div class="lc-time">09:00 AM</div> </li><li> <div class="lc-time">09:30 AM</div> </li><li> <div class="lc-time">10:00 AM</div> </li><li> <div class="lc-time">10:30 AM</div> </li><li> <div class="lc-time">11:00 AM</div> </li><li> <div class="lc-time">11:30 AM</div> </li><li> <div class="lc-time">12:00 PM</div> </li><li> <div class="lc-time">12:30 PM</div> </li><li> <div class="lc-time">01:00 PM</div> </li><li> <div class="lc-time">01:30 PM</div> </li><li> <div class="lc-time">02:00 PM</div> </li><li> <div class="lc-time">02:30 PM</div> </li><li> <div class="lc-time">03:00 PM</div> </li><li> <div class="lc-time">03:30 PM</div> </li><li> <div class="lc-time">04:00 PM</div> </li><li> <div class="lc-time">04:30 PM</div> </li><li> <div class="lc-time">05:00 PM</div> </li><li> <div class="lc-time">05:30 PM</div> </li><li> <div class="lc-time">06:00 PM</div> </li><li> <div class="lc-time">06:30 PM</div> </li><li> <div class="lc-time">07:00 PM</div> </li><li> <div class="lc-time">07:30 PM</div> </li><li> <div class="lc-time">08:00 PM</div> </li><li> <div class="lc-time">08:30 PM</div> </li><li> <div class="lc-time">09:00 PM</div> </li><li> <div class="lc-time">09:30 PM</div> </li><li> <div class="lc-time">10:00 PM</div> </li><li> <div class="lc-time">10:30 PM</div> </li><li> <div class="lc-time">11:00 PM</div> </li><li> <div class="lc-time">11:30 PM</div> </li>');
        $('#lc-data-container').append('<div class="lc-welback-box lc-welfixed-bottom lc-cts lc-choose-cts" style="display:none;"><div class="lc-welinner-box"><div class="lc-title-pop"><div class="lc-inner-title">Indicate a suitable time</div></div><div class="lc-content-body"><div class="lc-input-row"><div class="lc-input-cell"><div class="lc-input-group lc-active-label lc-time-picker"><label class="lc-label-text">My time (12 hrs. format)</label> <select id="lc-time-hour" class="lc-time-select lc-time-hour"></select> <span class="lc-time-colon">:&nbsp;</span><select id="lc-time-minute" class="lc-time-select lc-time-minute"></select> <span class="lc-time-period">PM</span> </div></div><div class="lc-switch-outer"><label class="lc-switch-btn lc-ap-pm-switch"><input type="checkbox" name="lc-ap-pm-switch" checked="checked"><div class="lc-slider-btn round"></div><span class="texts"></span></label></div></div><div class="lc-pop-bottom"><button type="button" class="lc-btn lc-fill-btn lc-send-button">Submit</button></div></div></div></div>');
        $('#lc-data-container').append(' <div class="lc-welback-box lc-welfixed-bottom lc-choose-appointment lc-choose-appointment-time" style="display:none;"><div class="lc-welinner-box"><div class="lc-title-pop"><div class="lc-inner-title">' + msg.liveChatMessageInfo.text + '</div></div><div class="lc-content-body"><ul class="lc-time-date-outer"><li><a class="lc-tt-check lc-booking-appointment-time lc-change-my-time"><label class="lc-cp">10:00 AM</label><span class="lc-cricle-check lc-icon-22"></span></a></li></ul><div class="lc-pop-bottom"><button type="button" class="lc-btn lc-fill-btn lc-send-button">Submit</button></div></div></div></div>');
        for (let i = 1; i <= 12; i++) {
            $('#lc-time-hour').append('<option value="' + getDateTime(i) + '">' + getDateTime(i) + '</option>');
        }
        for (let i = 0; i < 59; i+=5) {
            $('#lc-time-minute').append('<option value="' + getDateTime(i) + '">' + getDateTime(i) + '</option>');
        }
    }

    function getDateTime(n) {
        return (n <= 9 ? "0" : "") + (n);
    }
 // Time selection
    $(d).on("click", "#lc-timepicker-list > li", function() {
        $("li").not(this).removeClass("lc-active");
        $(this).addClass("lc-active");
        $('.lc-pre-cts').hide();
        $('.lc-choose-appointment-time').fadeIn();
        lcAppointmentTime = $(this).text();
        $('.lc-booking-appointment-time > label').text(lcAppointmentTime);
    });

    $(d).on("click", ".lc-choose-my-time", function() {
        $('.lc-pre-cts').hide();
        $('.lc-choose-cts').fadeIn();
    });

    $(d).on("click", ".lc-change-my-time", function() {
        $('.lc-choose-cts').hide();
        $('.lc-choose-appointment-time').hide();
        $('.lc-pre-cts').fadeIn();
    });

    $(d).on("click", ".lc-ap-pm-switch", function() {
        if ($("input[name=lc-ap-pm-switch]:checked").length > 0) {
            $('.lc-time-period').text('PM');
        } else {
            $('.lc-time-period').text('AM');
        }
        setTime();
    });

    $(d).on("click", ".lc-change-my-date", function() {
        $('.lc-choose-appointment-date').hide();
        $('.lc-calendar').fadeIn();
    });

    $(d).on("change", ".lc-time-select", function() {
        setTime();
    });

    function setTime() {
        let hour = $("#lc-time-hour").children("option:selected").val();
        let minute = $("#lc-time-minute").children("option:selected").val();
        let period = $('.lc-time-period').text();
        lcAppointmentTime = hour + ':' + minute + ' ' + period;
    }

    function showStarRating(msg) {
        $('#lc-data-container').append(' <div class="lc-welback-box lc-welfixed-bottom lc-calander-wrap"><div class="lc-welinner-box"><div class="lc-title-pop"><div class="lc-inner-title">Rate your experience with me </div></div><div class="lc-content-body"><ul id="lc-star-rating-list" class="lc-star-ratint-wrap"> </ul></div></div></div>');
        for (let i = 1; i <= 4; i++) {
            $('#lc-star-rating-list').append('<li class="lc-star lc-active" data-value="' + i + '"> <i class="lc-icon-19"></i></li>');
        }
    }

    function stopWorkflow(msg) {
        $('.lc-text-message').attr("placeholder", "Please start a new conversation");
        manageTextBox(true);
    }

    function showTextMessage(msg) {
        if (msg.liveChatMessageInfo.text == null || msg.liveChatMessageInfo.text.trim() == '') {
            return;
        }
        return '<div class="lc-message ' + ((msg.incoming == true) ? 'lc-message-sent lc-blueclr-msg' : 'lc-message-received') + '"> ' + ((msg.incoming == false && avatar) ? '<div class="lc-message-avatar"><img src="' + avatar + '"></div>' : '') + '<div class="lc-message-content">' + parseIncomeingMessage(msg.liveChatMessageInfo.text) + '<div class="lc-message-footer">3minutes ago</div></div></div>';
    }

    function parseIncomeingMessage(messageText) {
        let text = "";
        if (isJSONValid(messageText)) {
            text = getMessageText(JSON.parse(messageText));
        } else {
            text = '<div class="lc-message-bubble"><div class="lc-message-text"><p>'+messageText+'</p></div></div>';
        }
        return text;
    }

    function isJSONValid(messageText) {
        try {
            if (parseInt(messageText) == messageText) {
                return false;
            }
            JSON.parse(messageText);
            return true;
        } catch (e) {
            return false;
        }
    }

    function getMessageText(messageText) {
        let text = "";
        switch (messageText.control_name) {
            case "multi-button":
            case "multi-select":
            case "checkbox":
                let textInner = "";
                for (let i = 0; i < messageText.selected_values.length; i++) {
                    textInner += messageText.selected_values[i].dn + '\n';
                }
                text += '<div class="lc-message-bubble"><div class="lc-message-text"><p>' + textInner + '</p></div></div>';
                break;
            case "file-upload":
                for (let i = 0; i < messageText.selected_values.length; i++) {
                    if (isImageOnMessage(messageText.selected_values[i].dn)) {
                        text += '<div class="lc-message-bubble lc-message-image"><img src="' + messageText.selected_values[i].value + '"> <div class="lc-file-name">' + messageText.selected_values[i].dn + '</div></div>';
                    } else {
                        text += '<div class="lc-message-bubble"><div class="lc-message-text"><p>' + messageText.selected_values[i].dn + '</p></div></div>';
                    }
                }
                break;
            default:
                text += '<div class="lc-message-bubble"><div class="lc-message-text"><p>' + messageText.selected_values[0].dn + '</p></div></div>';
        }
        return text;
    }

    function isImageOnMessage(messageText) {
        let ext = messageText.split('.').pop().toLowerCase();
        if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
            return false;
        }
        return true;
    }

    function manageTextBox(action) {
        $('.lc-text-message').prop('disabled', action);
    }

    function isEmpty(el) {
        return !$.trim(el.html());
    }

    /**** Star Rating ***/
    $(d).on("mouseover", ".lc-star-ratint-wrap li", function() {
        var onStar = parseInt($(this).data('value'), 10);
        $(this).parent().children('li.lc-star').each(function(e) {
            if (e < onStar) {
                $(this).addClass('lc-hover');
            } else {
                $(this).removeClass('lc-hover');
            }
        });
    }).on('mouseout', function() {
        $(this).parent().children('li.lc-star').each(function(e) {
            $(this).removeClass('lc-hover');
        });
    });

    $(d).on("click", ".lc-star-ratint-wrap li", function() {
        let onStar = parseInt($(this).data('value'), 10);
        let stars = $(this).parent().children('li.lc-star');
        for (let i = 0; i < stars.length; i++) {
            $(stars[i]).removeClass('lc-active');
        }
        for (let i = 0; i < onStar; i++) {
            $(stars[i]).addClass('lc-active');
        }
        let displayName = onStar + " Star rate";
        sendMessage(createJSON(msgDataControlType, displayName, onStar.toString()), 'TEXT', 'SEND_MESSAGE', false);
        resetDataControl();
    });

    $(d).on("keypress", ".lcDigitsOnly", function(e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });

    $(d).on("cut copy paste", ".lcDigitsOnly", function(e) {
        e.preventDefault();
    });

    // Select and reply for single select
    $(d).on("click", "#single-selection-list > li", function() {
        let value = $(this).attr("value");
        let displayName = $(this).attr("data-name");
        $('#lc-chat-window').append(showTextMessage(message));
        sendMessage(createJSON(msgDataControlType, displayName, value), 'TEXT', 'SEND_MESSAGE', false);
        resetDataControl();
    });

 // Multi selection
    $(d).on("click", "#multi-selection-list > li", function() {
        if ($("input[name=chat-checkbox]:checked").length > 0) {
            $(".lc-send-button").removeClass("lc-disable-btn");
        } else {
            $(".lc-send-button").addClass("lc-disable-btn");
        }
    });

    // Restrict space
    $(d).on('keydown', '.lcNoSpace', function(e) {
        if (e.keyCode == 32) return false;
    });

    // Text box keyup
    $(d).on("keyup", ".lc-text-message", function() {
        let value = $(this).val();
        if (value.trim() == '' || value == undefined) {
        	$(".lc-send-button").removeClass("lc-active-send-btn");
        } else {
        	$(".lc-send-button").addClass("lc-active-send-btn");
        }
    });

    // Load history
    $(d).on("click", "#load-history", function() {
        $('.lc-load-history').remove();
        $('#lc-chat-window').removeClass("hidden");
        scrollHeight();
    });

    // Single Chat Button on select and send from here..
    $(d).on("click", ".data-control-button > li", function() {
        let value = $(this).attr('value');
        let displayName = $(this).attr("data-name");
        if (value != undefined) {
            $('#lc-chat-window').append(showTextMessage(message));
            if (isResetState) {
                sendMessage(value, 'TEXT', 'SEND_MESSAGE', true);
            } else {
                sendMessage(createJSON(msgDataControlType, displayName, value), 'TEXT', 'SEND_MESSAGE', false);
            }
            resetDataControl();
        }
    });

 // For Chat Multi-Button on select
    $(d).on("click", "#multi-button-list > li", function() {
        if ($("input[name=chat-checkbox]:checked").length > 0) {
            $('.lc-send-button').removeClass("lc-disable-btn");
        } else {
            $('.lc-send-button').addClass("lc-disable-btn");
        }
    });

    // Sending message on press enter key
    $(d).on("keypress", ".lc-text-message", function(e) {
        if (e.which == 13) {
            let text = $(this).val();
            if (msgDataControlType == 'address') {
                return;
            }
            if (text == null || text.trim() == "") {
                e.preventDefault();
                return;
            }
            replyMessage();
            e.preventDefault();
        }
    });

    $(d).on("keyup", ".lc-list-search", function() {
        let searchText = this.value;
        let searchRegex = new RegExp(searchText, "i");
        let hasFilter = searchText.length > 0;
        let $list = $(".lc-data-list");

        $list.toggleClass("lc-filtered", hasFilter);

        $list.find("li").each(function(i, el) {
            let $el = $(el)
            let elText = $el.text();
            let match = searchRegex.test(elText);

            $el.toggleClass("lc-found", match)
        })
        let found = $(".lc-data-list li.lc-found").length;
        if (found == '0') {
            $('.lc-list-empty').removeClass('lc-hide');
        } else {
            $('.lc-list-empty').addClass('lc-hide');
        }
    });


    $(d).on("click", ".lc-send-button", function() {
        replyMessage();
    });

    function replyMessage() {
        switch (msgDataControlType) {
            case "multi-button":
                replyMultiButtonMessage();
                break;
            case "multi-select":
            case "checkbox":
                replyMultiSelectionMessage();
                break;
            case "single-select":
            case "radio":
                break;
            case "name":
            case "telephone":
            case "address":
            case "password":
            case "email":
            case "number":
            case "mobile-number":
            case "full-name":
            case "age":
            case "star-rating":
                replyDataControlMessage();
                break;
            case "date":
                replyDateMessage();
                break;
            case "time":
                replyTimeMessage();
                break;
            default:
                replyTextMessage();
        }
    }

    function replyMultiButtonMessage() {
        if ($("input[name=chat-checkbox]:checked").length > 0) {
            $('#lc-chat-window').append(showTextMessage(message));
            let values = [];
            let displayNames = [];
            $('.lc-checkboxbtn').each(function() {
                if ($(this).is(":checked") == true) {
                    let value = $(this).attr('value');
                    let displayName = $(this).attr("data-name");

                    if ($.inArray(value, values) == -1) {
                        values.push(value);
                    }
                    if ($.inArray(displayName, displayNames) == -1) {
                        displayNames.push(displayName);
                    }
                }
            });
            sendMessage(createJSON(msgDataControlType, displayNames, values), 'TEXT', 'SEND_MESSAGE', false);
            resetDataControl();
        }
    }

    function replyMultiSelectionMessage() {
        let values = $('input[name=chat-checkbox]:checked');
        let displayName = $('input[name=chat-checkbox]:checked').parent();
        if (values.length > 0) {
            $('#lc-chat-window').append(showTextMessage(message));
            let checkedValues = [];
            values.each(function() {
                checkedValues.push($(this).val());
            });
            let checkedDN = [];
            displayName.each(function() {
                checkedDN.push($(this).text().trim());
            });
            sendMessage(createJSON(msgDataControlType, checkedDN, checkedValues), 'TEXT', 'SEND_MESSAGE', false);
            resetDataControl();
        }
    }

    function replyDateMessage() {
        if (lcAppointmentDate == null) {
            return;
        }
        $('#lc-chat-window').append(showTextMessage(message));
        sendMessage(createJSON(msgDataControlType, lcAppointmentDate, lcAppointmentDate), 'TEXT', 'SEND_MESSAGE', false);
        resetDataControl();
    }

    function replyTimeMessage() {
        if (lcAppointmentTime == null) {
            let hour = $("#lc-time-hour").children("option:selected").val();
            let minute = $("#lc-time-minute").children("option:selected").val();
            let period = $('.lc-time-period').text();
            lcAppointmentTime = hour + ':' + minute + ' ' + period;
        }
        $('#lc-chat-window').append(showTextMessage(message));
        sendMessage(createJSON(msgDataControlType, lcAppointmentTime, lcAppointmentTime), 'TEXT', 'SEND_MESSAGE', false);
        resetDataControl();
    }

    function createJSON(controlName, displayName, value) {
        if ($.isEmptyObject(value)) {
            return;
        }
        var json = {
            "control_name": controlName,
            "selected_values": []
        };
        if ($.isArray(displayName)) {
            for (let i = 0; i < value.length; i++) {
                json.selected_values.push({
                    "dn": getDisplayName(displayName, i),
                    "value": value[i]
                });
            }
        } else {
            json.selected_values.push({
                "dn": (displayName == '' ? value : displayName),
                "value": value
            });
        }
        return JSON.stringify(json);
    }

    function getDisplayName(displayName, index) {
        if ($.isArray(displayName)) {
            return displayName[index];
        }
    }

    function replyDataControlMessage() {
        $('.lc-text-message').each(function() {
            if (msgDataControlType != null) {
                let dn = '';
                let value = $(this).val();
                if (value.trim() == '') {
                    return;
                }
                if (msgDataControlType == 'password') {
                    dn = convertPasswordToStar(value);
                }
                sendMessage(createJSON(msgDataControlType, dn, value.trim()), 'TEXT', 'SEND_MESSAGE', false);
                resetDataControl();
            }
        });
    }

    function replyTextMessage() {
        $('.lc-text-message').each(function() {
            sendMessage($(this).val(), 'TEXT', 'SEND_MESSAGE', false);
            $(this).val("");
            $(".lc-send-button").removeClass("lc-active-send-btn");
        });
    }

    function resetDataControl() {
        $('#lc-tel-box').hide();
        $('#lc-text-box').show();
        $('#lc-data-container').empty();
        $('#lc-data-container').fadeIn();
        $(".lc-text-message").val("");
        $('.lc-text-message').removeClass("lcDigitsOnly");
        $('.lc-text-message').removeClass("lcNoSpace");
        $('.lc-text-message').removeClass("lc-password");
        $('.lc-text-message-outer').removeClass("lc-address-bar");
        $(".lc-send-button").removeClass("lc-active-send-btn");
        $('.lc-text-message').attr("placeholder", "Type message...");
        message = null;
        msgDataControlType = null;
        isResetState = false;
        manageTextBox(false);
        scrollHeight();
    }

    $(w).bind('resize', function() {
        scrollHeight();
    });

    function manageSelectionList() {
        let header_height = $('.data-control-list-header').height();
        if (header_height > 40) {
            $('.data-control-list').css({
                'height': (($('.data-control-list').height()) - (header_height - 40)) + 'px'
            });
        }
    }

    function focusTextMessage() {
        $(".lc-text-message").focus();
    }

    function removeFocusTextMessage() {
        $(".lc-text-message").blur();
    }

    function convertPasswordToStar(pass) {
        let text = "";
        for (let i = 0; i < pass.length; i++) {
            text += "*";
        }
        return text;
    }

    function getURLParameter() {
        let result = {};
        try {
            let parentUrl = new URL(document.referrer);
            let params = new URLSearchParams(parentUrl.search);
            for (let param of params) {
                result[param[0]] = param[1];
            }
        } catch (e) {}
        return result;
    }

    function sendMessage(messageText, messageType, event, resetState) {
        if (!resetState) {
            if (messageText == null || messageText.trim() == "") {
                return;
            }
        }
        if (appId == null || appId == "") {
            return;
        }
        client.send("/app/livechat/" + appId + "-" + userId, {}, JSON.stringify({
            uid: userId,
            appId: appId,
            incoming: true,
            ts: new Date().getTime(),
            event: event,
            reset_state: resetState,
            request_params:  getURLParameter(),
            liveChatMessageInfo: {
                text: messageText,
                type: messageType
            }
        }));
    }

    $('.continue-conversation').click(function() {
        $('.lc-load-history').remove();
        $('#lc-chat-window').removeClass("hidden");
        callAnalytics("Continue Conversation");
        hideDashboard();
        scrollHeight();
    });

    $('.new-conversation').click(function() {
        resetDataControl();
        isResetState = true;
        if ($("#lc-chat-window").find('.lc-message-sent').length > 0) {
            $('.lc-load-history').remove();
            $('#lc-chat-window > div').addClass('history');
            $('#lc-chat-window').addClass("hidden");
            $('#lc-chat-window').append(loadHistory);
        }
        $('#lc-data-container').empty();
        $('#lc-data-container').fadeIn();
        startConversation();
    });

    function startConversation() {
        callAnalytics("New Conversation");
        sendMessage('Start new conversation', 'TEXT', 'CHAT_START', true);
        if (isWelcomeEventCall === 'false') {
            const welcome_msg = {
                "uid": userId,
                "liveChatMessageInfo": {
                    "text": null,
                    "type": "TEXT"
                },
                "incoming": false,
                "appId": appId,
                "ts": new Date(),
                "data_control": null,
                "data_source": null
            }

            let wms = getLcWms();
            if (!$.isEmptyObject(wms)) {
                let i = 0;
                let msg = Object.create(welcome_msg);

                function sendLcWm() {
                    msg.liveChatMessageInfo.text = wms[i];
                    if (i === (wms.length - 1)) {
                        sendLcWmo(msg);
                    } else {
                        showMessage(msg);
                    }
                    setTimeout(function() {
                        i++;
                        if (i < wms.length) {
                            sendLcWm();
                        }
                    }, 3000)
                }
                sendLcWm();
            }
        }
        hideDashboard();
        scrollHeight();
    }

    function sendLcWmo(message) {
        let msg = Object.create(message);
        let wmo = getLcWmo();
        if (!$.isEmptyObject(wmo)) {
            let list = [];
            for (let i in wmo) {
                list.push({
                    "value": wmo[i],
                    "dn": wmo[i]
                })
            }
            msg.data_control = "button";
            msg.data_source = {
                "type": "static",
                "list": list
            };
            showMessage(msg);
        }
    }

    $('.lc-reset').click(function() {
        showDashboard();
    });

    function getLcWmo() {
        let wmo = [];
        $(".welcome_message_options").each(function() {
            wmo.push($(this).val());
        });
        return wmo;
    }

    function getLcWms() {
        let wms = [];
        $(".welcome_messages").each(function() {
            wms.push($(this).val());
        });
        return wms;
    }

    function connectLiveChat() {
        if ($("#lc-chat-window").find('.lc-message-received').length == 0 && $("#lc-chat-window").find('.lc-message-sent').length == 0) {
            isResetState = true;
            hideDashboard();
            startConversation();
        } else {
            showDashboard();
        }
    }

    function showDashboard() {
        $('#lc-chat-textbox').hide();
        $('#lc-data-container').hide();
        $('#lc-message-dashboard').fadeIn();
    }

    function hideDashboard() {
        $('#lc-message-dashboard').hide();
        $('#lc-chat-textbox').fadeIn();
        $('#lc-data-container').show();
    }

    function showLoading() {
        $('#lc-chat-window').append(loading);
        scrollHeight();
    }

    function hideLoading() {
        $('#loading').remove();
        scrollHeight();
    }

    function scrollHeight() {
        $('.lc-messages-content').scrollTop($('#lc-chat-window').height());
    }

    function connectLiveChatForVideoCall(msg) {
        nativeDepartmentId = msg.department_id;
        nativeDepartmentName = msg.department_name;
        connectLiveChat();
        startVideoCall();
        sendMessage('CHAT_OPEN', 'TEXT', 'CHAT_OPEN', true);
        callAnalytics("Video Call");
    }

    function lcCloseIframe() {
        let msg = {
            "action": "CLOSE_IFRAME"
        };
        // Sending message to parent to video call ring
        w.parent.postMessage(JSON.stringify(msg), '*');
    }

    function callRingAlert(type) {
        var msg = {
            "action": type
        };
        // Sending message to parent to video call ring
        w.parent.postMessage(JSON.stringify(msg), '*');
    }

    function callAnalytics(label) {
        var msg = {
            "action": "CALLANALYTICS",
            "data": {
                "category": "BotsDekho",
                "action": "LiveChat",
                "label": label
            }
        };
        // Sending message to parent to call analytics
        w.parent.postMessage(JSON.stringify(msg), '*');
    }

    // addEventListener support for IE8
    function bindEvent(element, eventName, eventHandler) {
        if (element.addEventListener) {
            element.addEventListener(eventName, eventHandler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + eventName, eventHandler);
        }
    }

    // Listen to message from parent
    bindEvent(window, 'message', function(e) {
        var msg = JSON.parse(e.data);
        if (msg == null)
            return;

        switch (msg.action) {
            case 'CONNECT':
                connectLiveChat();
                break;
            case 'VIDEOCALL':
                connectLiveChatForVideoCall(msg);
                break;
            default:
        }
    });

    // localStorage
    function getObject(key) {
        var value = localStorage.getItem(key);
        return value && JSON.parse(value);
    }

});
