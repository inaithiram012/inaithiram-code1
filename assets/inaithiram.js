const selectGrid = document.querySelectorAll('.productgrid--item');
let slideIndex = 1;
selectGrid.forEach(item => {
  const imagesection1 = item.querySelectorAll('.productitem--image-hover');
  const circles1 = item.querySelectorAll('.navigation-circle');
  if(imagesection1.length > 1){
  imagesection1[slideIndex - 1].classList.add('showimage');
  circles1[slideIndex - 1].classList.add('current-circle');  
  }
  

  item.addEventListener('mouseenter', () => {
    const imageSection = item.querySelectorAll('.productitem--image-hover');
    const circles = item.querySelectorAll('.navigation-circle');
    activator = setInterval(() => {

      // Images of Product
      imageSection.forEach((item) => {
        if (item.classList.contains("showimage")) {
          item.classList.remove('showimage');
        }
      });
      if (slideIndex > imageSection.length) {
        slideIndex = 1;
      }
      imageSection[slideIndex - 1].classList.add('showimage');

      // Image Count
      circles.forEach((circle, index) => {
        if (circle.classList.contains('current-circle')) {
          circle.classList.remove('current-circle');
        }
      });

      circles[slideIndex - 1].classList.add('current-circle');

      slideIndex++;
    }, 2000);

    circles.forEach((circle, index) => {
      circle.addEventListener('click', () => {
        imageSection.forEach(image => {
          if (image.classList.contains('showimage')) {
            image.classList.remove('showimage');
          }
        });
        imageSection[index].classList.add('showimage');
        circles[slideIndex - 1].classList.add('current-circle');
        slideIndex = index + 1;
      });
    });


  });

  item.addEventListener('mouseleave', () => {
    clearInterval(activator);
  });

});

const compareBox = document.querySelector('.header-compare-option');
const qtyCompare = document.querySelector("span[data-item-compare]");
var qtyItems = JSON.parse(localStorage.getItem("compProducts"));
if (qtyItems) {
  qtyCompare.setAttribute("data-item-compare", qtyItems.length);
  var baseURL = compareBox.getAttribute('href');
  qtyItems.forEach((item, index) => {
    if (index == 0) {
      baseURL = baseURL + "/products/" + item + "?view=compare&compare=";
    } else {
      baseURL = baseURL + item + ",";
    }
  });
  compareBox.setAttribute('href', baseURL);
  qtyCompare.innerText = qtyItems.length;
} else {
  qtyCompare.setAttribute("data-item-compare", 0);
  qtyCompare.innerText = 0;
}


let getComparekey = 'pxuProductCompareV3';

function getCompareLink(){
  const InaithiramCompareList = JSON.parse(sessionStorage.getItem(getComparekey));
  const headerCompareOption = document.querySelector('.header-compare-option');
  const compareCount = headerCompareOption.querySelector('.item-compare');
  const getCompareLink = document.querySelector('[data-product-compare-drawer-link]');
  if(getCompareLink){
    const compareLink = getCompareLink.getAttribute('href');
    headerCompareOption.setAttribute('href', compareLink);
  } 
  if(InaithiramCompareList){
    compareCount.innerHTML = InaithiramCompareList.products.length;
    compareCount.setAttribute('data-item-compare', InaithiramCompareList.products.length);
  }
  

}
getCompareLink();
setTimeout(()=> {
  const  chatIcon = document.querySelector('.inaithiram-chat-icon');
  const messengerIcon = document.getElementById('dummy-chat-button-iframe');
  const shopifyChat = document.getElementById('ShopifyChat');
  if(shopifyChat){
     shopifyChat.addEventListener('click', ()=>{
    shopifyChat.classList.toggle('chat-closed');
  });
  }
 
  chatIcon.addEventListener('click', ()=>{
    window.Tawk_API.toggleVisibility();
    const whatsappIcon = document.querySelector('.inaithiram-whatsapp');
    whatsappIcon.classList.toggle('chat-active');
    chatIcon.classList.toggle('chat-active');
    if(messengerIcon){
      messengerIcon.classList.toggle('chat-active');
    }
    if(shopifyChat){
      shopifyChat.classList.toggle('chat-active');
    }
  });
}, 4000);

function proceedOut(){
   document.cookie = "cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

