// getProduct Informations
const productUrl = document.querySelector("h2[data-inaithiram-produrl]");
const price = document.querySelectorAll("h3[data-inaithiram-price]");
const sku = document.querySelector("span[data-inaithiram-sku]");
const model = document.querySelectorAll("span[data-inaithiram-model]");
const compare = document.querySelectorAll("span[data-inaithiram-compare]");
const unitPrice = document.querySelectorAll("span[data-inaithiram-unitprice]");
const percentage = document.querySelectorAll(
  "span[data-inaithiram-percentage]"
);
const tax = document.querySelectorAll("span[data-inaithiram-gst]");
const offerRupees = document.querySelectorAll("span[data-inaithiram-rupees]");
const stock = document.querySelectorAll("span[data-inaithiram-variantid]");
const cartCount = document.querySelector("span[data-header-cart-count]");
const addToCart = document.querySelectorAll("button.inaithiram_cart_add");
const buyNow = document.querySelectorAll("button.inaithiram_cart_buy");
const qty = document.getElementById("quantity_selector");
const qtyPlus = document.querySelector(".quantityPlus");
const qtyMinus = document.querySelector(".quantityMinus");
let quantity = parseInt(qty.value);
let productId = defaultVariant.id;

qtyPlus.addEventListener("click", () => {
  if (parseInt(qty.value) >= max_qty) {
    return false;
  } else {
    let quants = parseInt(qty.value) + 1;
    quantity = quants;
    qty.value = quants;
    qty.setAttribute("value", quants);
  }
});
qtyMinus.addEventListener("click", () => {
  if (parseInt(qty.value) <= min_qty) {
    return false;
  } else {
    let quants = parseInt(qty.value) - 1;
    quantity = quants;
    qty.value = quants;
    qty.setAttribute("value", quants);
  }
});
qty.addEventListener("change", () => {
  if (qty.value < min_qty) {
    qty.value = min_qty;
    quantity = min_qty;
    qty.setAttribute("value", min_qty);
  }
  if (qty.value > max_qty) {
    qty.value = max_qty;
    quantity = max_qty;
    qty.setAttribute("value", max_qty);
  }
});
// Set Model Number
model.forEach((item) => {
  item.style.display = "none";
  const modelsku = item.getAttribute("data-inaithiram-model");
  if (modelsku == sku.innerText) {
    item.style.display = "block";
  }
});
/* Color Swatch Start */
const activeColor = document.querySelectorAll(".is_active");
const actDown = document.querySelectorAll(".is_active_container span");
const listColor = document.querySelectorAll(".is_list-item");
const listContainer = document.querySelectorAll(".is_list");

// Common Dropdown
const dropList = document.querySelectorAll("select[data-dropdown]");

// Set Default Color
activeColor.forEach((item) => {
  const colSpell = item.getAttribute("data-option");
  item.setAttribute("data-color", defOptions[`${colSpell}`]);
});

// Set Default Selected Variant
dropList.forEach((item, index) => {
  const selectedDrop = item.getAttribute("data-dropdown");
  if (selectedDrop == defOptions[`${index}`]) {
    item.value = defOptions[`${index}`];
  }
});

actDown.forEach((arrow, index) => {
  arrow.addEventListener("click", () => {
    listContainer[index].classList.toggle("show-colors");
  });
});

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

listColor.forEach((color) => {
  color.addEventListener("click", () => {
    curColor = color.getAttribute("data-color");

    activeColor.forEach((item) => {
      const colSpell = item.getAttribute("data-option");
      item.setAttribute("data-color", curColor);
      item.style.backgroundColor = curColor;
      defOptions[`${colSpell}`] = curColor;
    });
    listContainer.forEach((list) => {
      if (list.classList.contains("show-colors")) {
        list.classList.remove("show-colors");
      }
    });
    setVariant();
  });
});
/* Color Swatch End */

/* Creating dropdown menu  */
function selectDropdown(e) {
  let value = e.value;
  let dropValue = e.getAttribute("data-dropdown");
  const dropDown = document.querySelectorAll(
    `select[data-dropdown="${dropValue}"`
  );
  dropDown.forEach((item) => {
    defOptions[`${dropValue}`] = value;
  });
  setVariant();
}

qty.addEventListener("input", (e) => {
  quantity = parseInt(e.target.value);
});

async function checkMyCart(productId) {
  const getCart = await fetch(`${window.Theme.routes.cart_url}.js`).then(
    (res) => res.json()
  );
  const myCartQty = getCart.items.find((product) => {
    return product.variant_id == productId;
  });
  if (myCartQty) {
    return myCartQty.quantity;
  } else {
    return 0;
  }
}

addToCart.forEach((item) => {
  item.addEventListener("click", async (e) => {
    e.preventDefault();
    let formData = {
      items: [
        {
          id: productId,
          quantity: quantity,
        },
      ],
    };
    const inCartQty = await checkMyCart(productId);
    if (quantity + inCartQty > max_qty) {
      const max_msg = `Maximum Order Quantity of ${max_qty} is Successfully Added to Cart.`;
      const toastContainer = document.getElementById("toast-msg-container");
      toastContainer.innerText = max_msg;
      const getToast = document.getElementById("liveToast");
      const toast = new bootstrap.Toast(getToast);
      toast.show();
      return false;
    } else {
      if (!customer) {
        location.href = "/account/login";
        return;
      } else {
        addCart(formData);
      }
    }
  });
});


buyNow.forEach((item) => {
  item.addEventListener("click", async (e) => {
    e.preventDefault();
    let formData = {
      items: [
        {
          id: productId,
          quantity: quantity,
        },
      ]
    };
    const inCartQty = await checkMyCart(productId);
    if (quantity + inCartQty > max_qty) {
      const max_msg = `Maximum Order Quantity of ${max_qty} is Successfully Added to Cart.`;
      const toastContainer = document.getElementById("toast-msg-container");
      toastContainer.innerText = max_msg;
      const getToast = document.getElementById("liveToast");
      const toast = new bootstrap.Toast(getToast);
      toast.show();
      return false;
    } else {
      if (!customer) {
        location.href = "/account/login";
        return;
      } else {
        try {
          addCart(formData);
          location.href=`https://inaithiram01.myshopify.com/cart/${productId}:${quantity}`;
        } catch (error) {
          console.log(error);
        }
      }
    }
  });
});

async function addCart(formData) {
  await fetch(`${window.Theme.routes.cart_add_url}.js`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then(async (response) => {
      const getCart = await fetch(window.Shopify.routes.root + "cart.js").then(
        (res) => res.json()
      );
      cartCount.style.opacity = 1;
      cartCount.setAttribute("data-header-cart-count", getCart.item_count);
      const getToast = document.getElementById("added_to_cart");
      const toast = new bootstrap.Toast(getToast);
      toast.show();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function setVariant() {
  variants.forEach((product) => {
    let createOrder = true;
    let currentValue = Object.values(defOptions);
    currentValue.forEach((item) => {
      createOrder = createOrder && product.options.includes(item);
    });
    if (createOrder) {
      productId = product.id;
      const unitvalue = (product.price / gst_percent).toFixed(2);
      const gstvalue = (product.price / 100 - unitvalue).toFixed(2);
      price.forEach((item) => (item.innerText = product.price / 100));
      sku.innerText = product.sku;
      model.forEach((item) => {
        item.style.display = "none";
        const modelsku = item.getAttribute("data-inaithiram-model");
        if (modelsku == product.sku) {
          item.style.display = "block";
        } else {
          console.log(modelsku);
        }
      });
      compare.forEach(
        (item) => (item.innerText = product.compare_at_price / 100)
      );
      unitPrice.forEach((item) => (item.innerText = unitvalue));
      percentage.forEach(
        (item) =>
          (item.innerText = Math.round(
            ((product.compare_at_price - product.price) * 100) /
              product.compare_at_price
          ))
      );
      offerRupees.forEach(
        (item) =>
          (item.innerText = (product.compare_at_price - product.price) / 100)
      );
      tax.forEach((item) => (item.innerText = gstvalue));
      stock.forEach((item) => {
        if (item.getAttribute("data-inaithiram-variantId") == product.id) {
          item.style.display = "block";
          const children = item.children[0];
          if (children.classList.contains("text-danger")) {
            const buyButton = document.querySelectorAll(".inaithiram_cart_buy");
            const addCartButton = document.querySelectorAll(
              ".inaithiram_cart_add"
            );
            const stopDel = document.querySelector("p[data-deliver-message]");
            stopDel.style.display = "none";
            buyButton.forEach((button) => {
              button.setAttribute("disabled", true);
              button.innerHTML = "Sold Out";
            });
            addCartButton.forEach((button) => {
              button.setAttribute("disabled", true);
            });
          } else {
            const buyButton = document.querySelectorAll(".inaithiram_cart_buy");
            buyButton.forEach((button) => {
              button.removeAttribute("disabled");
            });
            const stopDel = document.querySelector("p[data-deliver-message]");
            stopDel.style.display = "block";
          }
        } else {
          item.style.display = "none";
        }
      });
    }
  });
}

window.onscroll = () => {
  const stickyFooter = document.getElementById("sticky-footer");
  if (window.scrollY < 600) {
    stickyFooter.style.display = "none";
  } else {
    stickyFooter.style.display = "flex";
  }
};

// Scripts for See More Options
const moreBtn = document.querySelectorAll(".ism-button");
moreBtn.forEach((item) => {
  if (item.parentElement.clientHeight < 250) {
    item.style.display = "none";
  }
  item.addEventListener("click", () => {
    const moreContainer = item.parentElement;
    const moreIcon = item.querySelector("i");
    const moreContent = moreContainer.querySelector(".more-enabled");
    const moreText = item.querySelector("span");
    moreContent.classList.toggle("more-disable");
    if (moreIcon.classList.contains("bi-chevron-down")) {
      moreText.innerText = "See less";
      moreIcon.classList.add("bi-chevron-up");
      moreIcon.classList.remove("bi-chevron-down");
    } else {
      moreText.innerText = "See more";
      moreIcon.classList.remove("bi-chevron-up");
      moreIcon.classList.add("bi-chevron-down");
    }
  });
});

// Social Share Sections
const socialBtn = document.querySelector(".social-share");
socialBtn.addEventListener("click", () => {
  const socialMedia = document.querySelector(".social-media_list");
  socialMedia.classList.toggle("show-social");
});

const shareSocial = document.querySelectorAll(".social-media_list li");
shareSocial.forEach((item) => {
  item.addEventListener("click", executeToggle);
});

function executeToggle() {
  setTimeout(() => {
    const socialMedia = document.querySelector(".social-media_list");
    socialMedia.classList.toggle("show-social");
  }, 1000);
}

// Inaithiram Product gallery
const tinyMedia = document.querySelectorAll(
  ".inaithiram-gallery .product_media"
);
const detailMedia = document.querySelectorAll(
  ".inaithiram-gallery .detailed_media"
);
const zoomTiny = document.querySelectorAll(
  ".inaithiram-product-zoom .product-media"
);
const zoomDetail = document.querySelectorAll(
  ".inaithiram-product-zoom .detailed_media"
);
const zoomArea = document.querySelector(".inaithiram-product-zoom");
const closebtn = document.querySelector(".gallery-close-button");
const makeZoom = document.querySelector(".make-expand");

// While clicking on product image, Image need to be dipslay in Expand view.
var zoomIndex = 0;
let posPrev;
let posLast;
zoomArea.addEventListener("touchstart", (e) => {
  posPrev = e.touches[0].clientX;
});

zoomArea.addEventListener("touchmove", (e) => {
  posLast = e.touches[0].clientX;
});

zoomArea.addEventListener("touchend", () => {
  var posDiffer = posPrev - posLast;
  let slideTo;
  if (posDiffer > 0) {
    slideTo = zoomIndex - 1;
    if (slideTo < 0) {
      slideTo = detailMedia.length - 1;
    }
    displayZoom(slideTo);
    zoomIndex = slideTo;
  } else {
    if (posDiffer < 0) {
      slideTo = zoomIndex + 1;
      if (slideTo > detailMedia.length - 1) {
        slideTo = 0;
      }
      displayZoom(slideTo);
      zoomIndex = slideTo;
    }
  }
});

function makeExpand() {
  zoomArea.classList.toggle("inaithiram-zoom-active");
}
makeZoom.addEventListener("click", () => {
  makeExpand();
  displayZoom(zoomIndex);
});
closebtn.addEventListener("click", makeExpand);
function displayZoom(index) {
  zoomDetail.forEach((item) => {
    item.style.display = "none";
  });
  zoomDetail[index].style.display = "block";
}

detailMedia.forEach((image, index) => {
  image.addEventListener("click", () => {
    makeExpand();
    displayZoom(index);
  });
});

zoomTiny.forEach((image, index) => {
  image.addEventListener("click", () => {
    displayZoom(index);
    zoomIndex = index;
  });
});

tinyMedia.forEach((tiny, index) => {
  tiny.addEventListener("click", () => {
    showFullImage(index);
    zoomIndex = index;
  });
});

function showFullImage(index) {
  detailMedia.forEach((item) => {
    item.style.display = "none";
  });
  detailMedia[index].style.display = "block";
}

showFullImage(0);