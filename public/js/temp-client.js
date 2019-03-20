//Client JS


$(document).ready(()=>{
    const socket = io.connect();
    // let currentUser;
    // socket.emit('get online users');
    //Each user should be in the general channel by default.
    // socket.emit('user changed channel', "General");




    //Users can change the channel by clicking on its name.
    $(document).on('click', '.channel', (e)=>{
      let newChannel = e.target.id;
      console.log("New Channel:", newChannel);
      console.log("Emitting to: 'user changed channel'");
      socket.emit('user changed channel', newChannel);
    });


//TODO: Select "Make a bid" button to emit 'new channel' event
//NOTE: Problem I'm facing is that I can't emit an event from the button because its not in connection

  //
  // $('#createUserBtn').click((e)=>{
  //   e.preventDefault();
  //   if($('#usernameInput').val().length > 0){
  //     socket.emit('new user', $('#usernameInput').val());
  //     // Save the current user when created
  //     currentUser = $('#usernameInput').val();
  //     $('.usernameForm').remove();
  //     $('.mainContainer').css('display', 'flex');
  //   }
  // });

  $('#sendChatBtn').click((e) => {
    e.preventDefault();
    let channel = $('.channel-current').attr('id');
    console.log("Send Chat to CHANNEL:", channel); //NOTE: Currently logging undefined
    let message = $('#chatInput').val();
    if(message.length > 0){
      socket.emit('new message', {
        sender : "User 1", //NOTE: Cannot utilze req.use on client side
        message : message,
        //Send the channel over to the server
        channel : channel
      });
      $('#chatInput').val("");
    }
  });

//NOTE: Not using this new channel button
  // $('#newChannelBtn').click( () => {
  //   let newChannel = $('#newChannelInput').val();
  //
  //   if(newChannel.length > 0){
  //     // Emit the new channel to the server
  //     socket.emit('new channel', newChannel);
  //     $('#newChannelInput').val("");
  //   }
  // })


  // socket listeners
  // socket.on('new user', (username) => {
  //   console.log(`${username} has joined the chat`);
  //   // Add the new user to the online users div
  //   $('.usersOnline').append(`<div class="userOnline">${username}</div>`);
  // })

  // Output the new message
  socket.on('new message', (data) => {
    //Only append the message if the user is currently in that channel
    let currentChannel = $('.channel-current').text();
    if(currentChannel == data.channel){
      $('.messageContainer').append(`
        <div class="message">
          <p class="messageUser">${data.sender}: </p>
          <p class="messageText">${data.message}</p>
        </div>
      `);
    }
  })

// NOTE: Probably not going to use, but will keep for reference
  // socket.on('get online users', (onlineUsers) => {
  //   //You may have not have seen this for loop before. It's syntax is for(key in obj)
  //   //Our usernames are keys in the object of onlineUsers.
  //   for(username in onlineUsers){
  //     $('.usersOnline').append(`<p class="userOnline">${username}</p>`);
  //   }
  // })

  //Refresh the online user list
  // socket.on('user has left', (onlineUsers) => {
  //   $('.usersOnline').empty();
  //   for(username in onlineUsers){
  //     $('.usersOnline').append(`<p>${username}</p>`);
  //   }
  // });


//TODO: Passing in userChatrooms which is an array, I want to iterate over each chatroom and append a div to the .channels class
//TODO: The "Make a bid" button probably needs to emit the "new channel" event
// Add the new channel to the channels list (Fires for all clients)
//NOTE: If I am iterating over req.user's chatrooms then I shouldn't be listening for a new channel event
  socket.on('new channel', (newChannel) => {
      console.log("New Channel event triggered");
  });


  // Make the channel joined the current channel. Then load the messages.
  // This only fires for the client who made the channel

  socket.on('user changed channel', (data) => {
    $('.channel-current').addClass('channel');
    $('.channel-current').removeClass('channel-current');
    $(`#${data.channel}`).addClass('channel-current');
    $('.channel-current').removeClass('channel');
    $('.message').remove();
    data.messages.forEach((message) => {
      $('.messageContainer').append(`
        <div class="message">
          <p class="messageUser">${message.sender}: </p>
          <p class="messageText">${message.message}</p>
        </div>
      `);
    });
  })




})
