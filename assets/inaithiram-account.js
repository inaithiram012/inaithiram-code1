function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
}
function getCookie(cName) {
  const decodedCookie = decodeURIComponent(document.cookie);
  const splitCookie = decodedCookie.split(";");
  let cookieValue;
  splitCookie.forEach((item) => {
    const getName = item.split("=");
    if (getName[0].trim() == cName) {
      cookieValue = getName[1];
    }
  });
  return cookieValue;
}
const redirectURL = getCookie("redirect_url");
if (redirectURL) {
  setCookie("redirect_url", "", 0);
  if (!redirectURL.includes("google") && !redirectURL.includes("facebook")) {
    location.href = redirectURL;
  }
}

const query = new URLSearchParams(document.location.search);
const getType = query.get("type");
const accountSection = document.querySelectorAll(".account-section");
accountSection.forEach((item) => {
  item.style.display = "none";
  switch (getType) {
    case "order":
      const orderSection = document.getElementById("account-orders");
      orderSection.style.display = "block";
      break;
    case "personal-information":
      const accountInfo = document.getElementById("account-information");
      accountInfo.style.display = "block";
      break;
    default:
      const mainSection = document.getElementById("account-main");
      mainSection.style.display = "block";
  }
});