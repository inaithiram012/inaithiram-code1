const collectionFilterGroup = document.querySelectorAll(
  ".collection-filters__filter-group"
);
collectionFilterGroup.forEach((group) => {
  const filterSearchBar = group.querySelector(".filter-search-bar");
  const filterValues = group.querySelectorAll("li[data-search-value]");
  if(filterSearchBar){
   filterSearchBar.addEventListener("input", (e) => {
    var searchValue = e.target.value.toLowerCase().replaceAll(' ','');
    filterValues.forEach((item) => {
      var getValues = item
        .getAttribute("data-search-value")
        .toLowerCase().replaceAll(' ','');
      if (!getValues.includes(searchValue)) {
        item.style.display = "none";
      } else {
        item.style.display = "block";
      }
    });
  }); 
  }
});
