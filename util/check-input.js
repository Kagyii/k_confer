
module.exports.validateArray = (input)=>{
   if(input.length>0 && typeof input != "undefined" && input.length != null && input != null){
       return true
   }else{
       false
   }
}

