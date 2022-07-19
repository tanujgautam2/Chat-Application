const socket = io()

 //countupdatedapp//

// socket.on('countupdated',(count)=>
// {
//      console.log("count has been updated ", count)
// })

// let inc = document.querySelector('#increment')
// inc.addEventListener('click', ()=>
// {
//     console.log('clicked')
//     socket.emit('increment')
// })

// Elements//

const $messageform= document.querySelector('#message-form')
const $messageforminput= $messageform.querySelector('input')
const $messageformbutton=$messageform.querySelector('button')
const $locationbutton=document.querySelector('#send-location')
const $messages= document.querySelector('#messages')
// templates
const messagetemplate=document.querySelector('#message-template').innerHTML
const locationmessagetemplate =document.querySelector('#location-message-location').innerHTML
const {username,room }=Qs.parse(location.search,{ignoreQueryPrefix:true})
const sidebartemplate= document.querySelector('#sidebar-template').innerHTML

const autoscroll=()=>
{
  // var scroll = setInterval(function(){ window.scrollBy(1000,0); }, 2000);
  $messages.scrollTop=$messages.scrollHeight
}
socket.on('message',(message)=>
{
    console.log(message)
    const html= Mustache.render(messagetemplate,{
      username: message.username,
      message: message.text,
      createdAt: moment(message.createdAt).format('h:mm a')   
      
    })
      $messages.insertAdjacentHTML('beforeend',html)
 autoscroll()
})

socket.on('messagelocation',(message)=>
{
  console.log(message)

  const html=Mustache.render(locationmessagetemplate,
  {
    username:message.username,
    url: message.url,
    createdAt:moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend',html)

  autoscroll()
})

socket.on('roomdata',({room ,users})=>
  {
     const html = Mustache.render(sidebartemplate ,{
      room,
      users
     })
     document.querySelector('#sidebar').innerHTML=html
  })

$messageform.addEventListener('submit', (e)=>
{
  // disable 
  $messageformbutton.setAttribute('disabled','disabled')

  e.preventDefault()
  // if($messageforminput.value='')
  // {
  //   return console.log('message cannot be empty')
  // }
//   const message =document.querySelector('input').value

 const message=e.target.elements.text.value
// const message = $messageforminput.value

 // here the acknoledgement and sending message takesplace 
  socket.emit('sendmessage', message ,(error) =>
  {
    // enable 
    $messageformbutton.removeAttribute('disabled','disabled')
    $messageforminput.value=(" ")
    $messageforminput.focus()

    if(error)
    {
        return console.log(error)
    }
    console.log('message delivered')
  })
})

document.querySelector('#send-location').addEventListener('click', ()=>
{
  if(!navigator.geolocation)
  {
    return alert('geolocation is not supported by your browser ')
  }
      $locationbutton.setAttribute('disabled','disabled')
      navigator.geolocation.getCurrentPosition((position)=>{
        //    console.log(position)

        socket.emit('sendlocation',{ latitude: position.coords.latitude, longitude: position.coords.longitude},()=>
        {
          $locationbutton.removeAttribute('disabled','disabled')
          console.log("location shared")
        })

      })
})

socket.emit('join',{username,room},(error)=>
{

})
