//EXAMPLE
//in this case is the client who emits the event
//the server listen for this event
// socket.emit("createEmail",{
//     to:"anestiandoni@gmail.com",
//     text:"hey whats up"
// });
//listen to a custom event
//first argument specifie the name of the event
//second is a callback function
//this functions takes a parameter,its an object and has the data that server will
//pass to frontent
// socket.on('newEmail',function(email){
//     console.log("New email",email);
// });

let Module = (function(){
    
    var locationButton = $("#send-location");
    var message_form = $("#message-form");
    var messageTextbox = $("[name=message]");
    message_form.on('submit',createMessage);
    locationButton.on('click',sendLocation);

    var socket = io();
    //on(event,callback) -> listen for an event
    socket.on('connect',function(){
        var params = $.deparam(window.location.search);
        socket.emit('join',params,function(err){
            if(err){
                alert(err);
                window.location.href = '/';
            }
            else{
                console.log("No error");
            }
        });
    });
    socket.on('disconnect',function(){
        console.log("Disconnected from Server");
    });

    socket.on('updateUserList',function(users){
        var ol = $('<ol></ol>');
        users.forEach(function(user){
            var li = $('<li>'+user+'</li>');
            ol.append(li);
        });
        $("#users").html(ol);
    });

    //CHAT APP EVENT (client listen for this event)
    socket.on("newMessage",function(message){
        var formattedTime = moment(message.createdAt).format('h:mm a');
        var template = $("#message-template").html();
        var html = Mustache.render(template,{
            text: message.text,
            from: message.from,
            createdAt: formattedTime
        });
        $('#messages').append(html)
        scroollToBottom();
        // var formattedTime = moment(message.createdAt).format('h:mm a');
        // var li = $("<li></li>");
        // li.text(`${message.from} ${formattedTime}: ${message.text}`);
        // $("#messages").append(li);
    });

    socket.on('newLocationMessage',function(message){
        var formattedTime = moment(message.createdAt).format('h:mm a');
        var template = $("#location-message-template").html();
        var html = Mustache.render(template,{
            url:message.url,
            from:message.from,
            createdAt: formattedTime
        })
        $("#messages").append(html);
        scroollToBottom();
        // var li = $("<li></li>");
        // var a = $("<a target='_blank'>My Current location</a>");
        // li.text(`${message.from}: ${formattedTime} `);
        // a.attr('href',message.url);
        // li.append(a);
        // $("#messages").append(li);
    });

    function createMessage(event){
        event.preventDefault();
        socket.emit("createMessage",{
            text: messageTextbox.val()
        },function(){
            messageTextbox.val("");
        });
    }

    function sendLocation(){
        if(!navigator.geolocation){
            return alert('Geolocation not supported by your browser');
        }
        locationButton.attr("disabled","disabled").text('Send location...');
        navigator.geolocation.getCurrentPosition(function(position){
            locationButton.removeAttr("disabled").text('Send location');
            socket.emit('createLocationMessage',{
                latitude: position.coords.latitude,
                longtitude: position.coords.longitude
            });
        },function(){
            locationButton.removeAttr("disabled").text('Send location');
            alert('Unable to fetch location');
        });
    }

    function scroollToBottom(){
        // Selectors
        var messages = $('#messages');
        var newMessage = messages.children('li:last-child');
        // Heights
        var clientHeight = messages.prop('clientHeight');
        var scrollTop = messages.prop('scrollTop');
        var scrollHeight = messages.prop('scrollHeight');
        var newMessageHeight = newMessage.innerHeight();
        var lastMessageHeight = newMessage.prev().innerHeight();

        if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
            messages.scrollTop(scrollHeight)
        }

    }
})();