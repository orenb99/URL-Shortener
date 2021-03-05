
const qs=require("qs");
const utils=require("../utils");
const reqInput=document.getElementById("url_input");
const custom=document.getElementById("custom-url");
const resInput=document.getElementById('result-input');
const copyButton=document.getElementById('copy-link');
const deleteButton=document.getElementById('delete-button');
const submit=document.getElementById('submit');
const link=document.getElementById('old-url');
const errorP=document.getElementById("error-message");
function getData() {
  let dataURL=reqInput.value;
  let customURL=custom.value;
  let characters = /^[0-9a-zA-Z]+$/;
    if(Number(customURL)<0||customURL.match(characters)===null)
      customURL="";
    axios({
        method:"post",
        url: 'http://localhost:3000/api/shorturl/new',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({
            url:dataURL,
            custom: customURL,
        })
    })
    .then(res=>{
        showOutput(res)
        errorP.innerHTML="";
    }
    )
    .catch(err=>
      errorP.innerText=utils.checkError(dataURL)
)}
  function clearCache(){
    axios({
      method:"delete",
      url: 'api/clearCache/all',
    }).then(()=>{
      errorP.innerText="Data cleared!"
    })
  }

  function showOutput(res) {
    let data=JSON.parse(JSON.stringify(res.data));
    resInput.value = data.shortUrl;
    link.innerText= data.originalUrl;
    link.href=data.shortUrl;
  }
  
  // Event listeners
  copyButton.addEventListener("click",()=>{
    resInput.select();
    resInput.setSelectionRange(0, 99999)
    document.execCommand("copy");
});


submit.addEventListener("click",getData);
deleteButton.addEventListener("click",clearCache);