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

var isOTPValidated = false;
 const gstPattern = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$";
  const distIdPattern = '^[a-zA-Z]{3}[0-9]{7}$';
  const sellerIdPattern = '^[a-zA-Z]{3}[0-9]{7}$';
window.acerillFormBuilderOnFormLoaded = function () {
  setTimeout(() => {
    const productName1 = document.querySelector(
      'input[placeholder="Product Name 1 or SKU"]'
    );
    const productName2 = document.querySelector(
      'input[placeholder="Product Name 2 or SKU"]'
    );
    const productName3 = document.querySelector(
      'input[placeholder="Product Name 3 or SKU"]'
    );
    function hideDropdown(item) {
      const dropContain = item.parentElement;
      const getDropdown = dropContain.querySelector(".dropdown-search");
      if (getDropdown) {
        setTimeout(() => {
          getDropdown.style.display = "none";
        }, 1000);
      }
    }

    if(productName1 && productName2 && productName3){
      productName1.addEventListener("focusout", () => {
      hideDropdown(productName1);
    });
    productName2.addEventListener("focusout", () => {
      hideDropdown(productName2);
    });
    productName3.addEventListener("focusout", () => {
      hideDropdown(productName3);
    });

    productName1.addEventListener("input", () => {
      showDropdown(productName1);
    });
    productName2.addEventListener("input", () => {
      showDropdown(productName2);
    });
    productName3.addEventListener("input", () => {
      showDropdown(productName3);
    });
    }


    function showDropdown(item) {
      fetch(
        window.Shopify.routes.root +
          `search/suggest.json?q=${item.value}&resources[type]=product&resources[options][unavailable_products]=hide&resources[options][fields]=title,variants.sku`
      )
        .then((response) => response.json())
        .then((suggustions) => {
          if (suggustions.resources.results) {
            const productSuggestions = suggustions.resources.results.products;
            // item.value = productSuggestions[0].title;
            if (productSuggestions.length == 0) {
              hideDropdown(item);
            } else {
              const dropdownList = document.createElement("ul");
              dropdownList.setAttribute("class", "dropdown-search");
              var dropdownContent = "";
              productSuggestions.forEach((product) => {
                dropdownContent =
                  dropdownContent +
                  `<li class="searched-item" onclick="selectProduct(this)">${product.title}</li>`;
              });
              dropdownList.innerHTML = dropdownContent;
              const dropdownContainer = item.parentElement;
              const isAvailable =
                dropdownContainer.querySelector(".dropdown-search");
              if (isAvailable) {
                isAvailable.remove();
                dropdownContainer.appendChild(dropdownList);
              } else {
                dropdownContainer.appendChild(dropdownList);
              }
            }
          }
        });
    }
    const getForm = document.querySelectorAll('.ace-cf-panel-body form input');
    getForm.forEach(item => {
      item.addEventListener('input', ()=>{
        var submittedOTP = document.querySelector('input[placeholder="OTP*"]').value;
        const submitButton = document.querySelector('.submit-button-wrapper button');
        if(submittedOTP != "Mobile Number Verified"){
          submitButton.style.pointerEvents = "none";
          submitButton.style.backgroundColor = "grey";
        }else{
          submitButton.style.pointerEvents = "auto";
          submitButton.style.backgroundColor = "#012166";
        }
      })
    })
    
    const getGSTField = document.querySelector('input[placeholder="GSTIN"]');
    const getPINField = document.querySelector('input[placeholder="Postal PIN Code*"]');
    const getDistId = document.querySelector('input[placeholder="Dealer / Distributor Id Number"]');
    const getPhone = document.querySelector('input[placeholder="Mobile Number*"]');
    const getSellerId = document.querySelector('input[placeholder="Seller Id Number*"]');
    const sendOTPButton = document.querySelector('input[placeholder="Send OTP"]');
    const submitOTPButton = document.querySelector('input[placeholder="Submit OTP"]');
    const receivedOTP = document.querySelector('input[placeholder="OTP*"]');

    const customer = getCookie("customer_auth_session_created_at");
    if(customer && receivedOTP){
      window.acerillCustomFormsEventBus.publish({eventType: 'UPDATE_VALUE_COMMAND', fieldPredicate: { placeholder: 'OTP*' }, value: 'Mobile Number Verified'});
      receivedOTP.setAttribute('readonly', true);
    }
    getPhone.addEventListener('change', ()=>{
        window.acerillCustomFormsEventBus.publish({eventType: 'UPDATE_VALUE_COMMAND', fieldPredicate: { placeholder: 'OTP*' }, value: null});
        receivedOTP.removeAttribute('readonly');
      })
    let passwordHash;
    receivedOTP.addEventListener('input', ()=>{
      var textLength = receivedOTP.value;
      if(textLength.length > 6){
        receivedOTP.value = "";
        return;
      }
    });
    async function sendOTP(){
      if(getPhone.value){
        sendOTPButton.style.pointerEvents = 'none';
        window.acerillCustomFormsEventBus.publish({eventType: 'UPDATE_VALUE_COMMAND', fieldPredicate: { placeholder: 'Send OTP' }, value: "Resend OTP"});
        sendOTPButton.style.backgroundColor = "unset";
        sendOTPButton.style.color = "grey";
        const mobileNumber = getPhone.value.replace(/\s+/g,'');
        const hashedPassword = await fetch(`https://inaithiramotp.000webhostapp.com/?mobile_number=${mobileNumber}`);
        const response = await hashedPassword.json();
        passwordHash = await response.hashed_password;
        alert("OTP Sent Successfully");
        setTimeout(()=>{
          sendOTPButton.style.backgroundColor = "#012166";
          sendOTPButton.style.color = "white";
          sendOTPButton.style.pointerEvents = 'auto';
        } ,30000);
      }
    }
    
    async function verifyOTP(){
      if(!receivedOTP.value) return;
        const verifyPassword = await fetch(`https://inaithiramotp.000webhostapp.com/?otp_number=${receivedOTP.value}&hashed_password=${passwordHash}`);
        const response = await verifyPassword.json();
        if(response.message == 'success'){
          alert("OTP Verified Successfully");
          window.acerillCustomFormsEventBus.publish({eventType: 'UPDATE_VALUE_COMMAND', fieldPredicate: { placeholder: 'OTP*' }, value: 'Mobile Number Verified'});
          const submitButton = document.querySelector('.submit-button-wrapper button');
          submitButton.style.pointerEvents = "auto";
          submitButton.style.backgroundColor = "#012166";
          receivedOTP.setAttribute('readonly',true);
          passwordHash = undefined;
        }else{
          alert("Kindly Check OTP or Try again");
          window.acerillCustomFormsEventBus.publish({eventType: 'UPDATE_VALUE_COMMAND', fieldPredicate: { placeholder: 'OTP*' }, value: null });
        }
    }
    
    if(sendOTPButton && submitOTPButton){
      sendOTPButton.setAttribute('readonly',true);
      submitOTPButton.setAttribute('readonly', true);
      sendOTPButton.addEventListener('click', sendOTP);
      submitOTPButton.addEventListener('click', verifyOTP);
    }
       
    getGSTField ? getGSTField.setAttribute('pattern', gstPattern) : "";
    getPINField ? getPINField.setAttribute('pattern', "^[0-9]{6}$") : "";
    getDistId ? getDistId.setAttribute('pattern', distIdPattern ): "";
    getSellerId ? getSellerId.setAttribute('pattern', sellerIdPattern): "";
    receivedOTP ? receivedOTP.setAttribute('pattern', '/Mobile Number Verified/i') : "";
    if(getPhone){
      getPhone.addEventListener('focus', ()=>{
        let typedNumber = getPhone.value;
        if(typedNumber.length <= 3){
          getPhone.value = "+91";
        }
      });
      getPhone.addEventListener('input', ()=>{
        let typedNumber = getPhone.value;
        if(typedNumber.length <= 3){
          getPhone.value = "+91";
        }
      });
    } 
    
  }, 5000);
};

function selectProduct(e) {
  const dropdown = e.parentElement;
  const inputfield = e.parentElement.parentElement;
  const myinput = inputfield.querySelector("input");
  myinput.value = e.innerText;
  myinput.setAttribute("value", e.innerText);
  dropdown.style.display = "none";
  window.acerillCustomFormsEventBus.publish({
    eventType: "UPDATE_VALUE_COMMAND",
    fieldPredicate: { placeholder: myinput.placeholder },
    value: e.innerText,
  });
}