
const qs=require("qs");
const body=document.getElementById("body");
const resInput=document.getElementById('result-input');
const copyButton=document.getElementById('copy-link');
const submit=document.getElementById('submit');
const link=document.getElementById('old-url');
function getData() {
    console.log("entered");
    axios({
        method:"post",
        url: 'http://localhost:3000/api/shorturl/new',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({
            url:"https://www.youtube.com",
        })
    })
    .then(res=>showOutput(res));
  }
  
  function showOutput(res) {
    console.log(res);
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
body.addEventListener("load",getData());