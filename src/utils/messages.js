const generatemessage=(username,text)=>{
    return {
        username:username,
        text:text,
        createdAt:new Date().getTime() 
    }
    }
    const generatelocationmessage=(username ,url)=>{
        return {
            username:username,
            url:url,
            createdAt:new Date().getTime()
        }
    }
    module.exports={
        generatemessage,
        generatelocationmessage
    }