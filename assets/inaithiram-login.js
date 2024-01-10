function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = `expires=${d.toUTCString()}`;
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
  }
  function getCookie(cName) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const splitCookie = decodedCookie.split(';');
    let cookieValue;
    splitCookie.forEach(item => {
      const getName = item.split('=');
      if (getName[0].trim() == cName) {
        cookieValue = getName[1];
      }
    });
    return cookieValue;
  }
  
  function validateLoginMethod(){
    const getMobileLogin = document.querySelector('#mobileOTPLoginSection');
      const actionRow = document.querySelector('.form-action-row');
    if(getMobileLogin.style.display != "none"){
      actionRow.style.display = 'none';
    }else{
      actionRow.style.display = 'block';
    }
  }
  if(!getCookie('redirect_url')){
    setCookie('redirect_url', document.referrer, 1);
  }
  setTimeout(()=>{
    validateLoginMethod();
    const otherLoginMethod = document.querySelectorAll('#otherLoginMethodsDiv button');
    otherLoginMethod.forEach(myButton => {
      myButton.addEventListener('click', ()=>{
      validateLoginMethod();
    });
  });
  const getOTPButton = document.querySelector('#getOTPButton');
  
  getOTPButton.addEventListener('click', ()=>{
    const resendButton = document.querySelector('#resendOTPButton');
    resendButton.setAttribute('disabled', true);
    setTimeout(()=>{
      resendButton.removeAttribute('disabled');
    }, 30000);
  });
    
  const redirectURL = getCookie('redirect_url');
  if(redirectURL){
    const checkoutURL = document.querySelectorAll('input[name="checkout_url"]');
    checkoutURL.forEach(item => {
      item.value = redirectURL;
    });
    document.cookie = "username=redirect_url; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  }, 3000);
