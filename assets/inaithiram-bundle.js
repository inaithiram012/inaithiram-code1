const bundleForm = document.getElementById('inaithiram-bundle');
const productBundle = bundleForm.querySelectorAll('.product-bundle');
var bundleBox = bundleForm.querySelectorAll('.bundle_checkbox:checked');
const bundleButton = bundleForm.querySelector('.bundle-button');
const minQty = bundleForm.querySelector('input[name="min-qty"]').value;
const discount = bundleForm.querySelector('input[name="discount"]');


productBundle.forEach((bundle) => {
  const checkBox = bundle.querySelector('.bundle_checkbox');
  const selectedVariant = bundle.querySelector('select');
  const qty = bundle.querySelector('input[name="quantity"]');

  checkBox.addEventListener('change', () => {
    calculatePrice();
  });

  if (selectedVariant) {
    selectedVariant.addEventListener('change', () => {
      const variantId = selectedVariant.value;
      const bundlePrice = bundle.querySelectorAll('.bundle-price');
      bundlePrice.forEach(price => {
        const isVisible = price.classList.contains('current-price');
        const matchVariant = price.getAttribute('data-bundle-productid') == variantId;
        if (matchVariant) {
          !isVisible ? price.classList.add('current-price') : '';
          price = parseInt(price.getAttribute('data-bundle-price'));
          calculatePrice();
        } else {
          isVisible ? price.classList.remove('current-price') : '';
        }
      });
    });
  }

  qty.addEventListener('change', () => {
    quantity = qty.value;
    calculatePrice();
  });
});


function calculatePrice(){
  const priceList = [];
  bundleBox = bundleForm.querySelectorAll('.bundle_checkbox:checked');
  productBundle.forEach(bundle => {
    const checkBox = bundle.querySelector('.bundle_checkbox');
    const selectedVariant = bundle.querySelector('select');
    const qty = bundle.querySelector('input[name="quantity"]');
    const price = bundle.querySelector('.current-price');
    if(checkBox.checked){
      const currentPrice = parseFloat(price.getAttribute('data-bundle-price')) * parseFloat(qty.value);
      priceList.push(currentPrice);
    }
  });
  if(priceList.length > 0){
    const totalPrice = priceList.reduce((cum, price) => {
      return cum  + price;
    });
    const bundleTotal = bundleForm.querySelector('.bundle-total');
    const availDiscount = parseFloat(discount.value);
    bundleTotal.innerText = formatMoney(totalPrice-availDiscount);
  }
  

  const isDisabled = bundleButton.hasAttribute('disabled');
  if(bundleBox.length >= minQty){
    isDisabled ? bundleButton.removeAttribute('disabled') : '';
  }else{
    !isDisabled ? bundleButton.setAttribute('disabled', '') : '';
  }
  console.log(bundleBox);
}

function formatMoney(num){
  const [integerPart, decimalPart] = num.toString().split(".");
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const formattedNum = "₹" + formattedIntegerPart + (decimalPart ? "." + decimalPart : "");
  return formattedNum;
}


bundleForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const items = [];

  productBundle.forEach(product => {
    const selectBunlde = product.querySelector('.bundle_checkbox');
    const productId = product.querySelector('[name="id"]').value;
    const qty = product.querySelector('[name="quantity"]').value;
    if (selectBunlde.checked) {
      items.push({
        quantity: qty,
        id: productId
      });
    }
  });

  let formData = {
    'items': items,
  }

  const customer = getCookie("customer_auth_session_created_at");
  if (!customer) {
    location.href = "/account/login";
    return;
  } else {
    addCart(formData);
  }

});

