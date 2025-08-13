async function getAllProducts() {
  const res = await fetch("https://dummyjson.com/products/?limit=194", {
    method: "GET",
  });
  const data = await res.json();
  return data.products;
}

const shopCategories = {
  "beauty and health": ["beauty", "fragrances", "skin-care"],
  clothes: [
    "mens-shirts",
    "mens-shoes",
    "mens-watches",
    "sunglasses",
    "womens-bags",
    "womens-dresses",
    "womens-jewellery",
    "womens-shoes",
    "womens-watches",
  ],
  electronics: ["laptops", "mobile-accessories", "smartphones", "tablets"],
  "goods for house": ["furniture", "home-decoration", "kitchen-accessories"],
  transport: ["motorcycle", "vehicle"],
  fresh: ["groceries"],
  sport: ["sports-accessories"],
};

async function checkOtherCategory() {
  const allProducts = await getAllProducts();

  const allCategoriesFromApi = Array.from(
    new Set(allProducts.map((item) => item.category))
  );
  const allSetCategories = Object.values(shopCategories).flat();

  let otherCategory = [];

  for (const item of allCategoriesFromApi) {
    if (!allSetCategories.includes(item)) {
      otherCategory.push(item);
    }
  }
  return otherCategory;
}
checkOtherCategory();

function makeSubCategory(subcategoryName) {
  const newSubcategoriesSpace = document.createElement("li");
  newSubcategoriesSpace.classList.add("product__filters__item");
  newSubcategoriesSpace.innerText = subcategoryName;
  document
    .querySelector(".product__filters__list")
    .appendChild(newSubcategoriesSpace);
  return newSubcategoriesSpace;
}

function makeCategory(categoryName, subcategory) {
  const category = document.createElement("div");
  category.classList.add("product__filters__item__category", "visually-hidden");
  category.innerText = categoryName;
  category.addEventListener("click", filterByCategory);
  subcategory.appendChild(category);
}

async function fillSubcategories() {
  const subcategoriesSet = Object.keys(shopCategories);
  for (const element of subcategoriesSet) {
    makeSubCategory(element);
  }

  const subcategories = document.getElementsByClassName(
    "product__filters__item"
  );
  for (const element of subcategories) {
    const arrOfCategories = shopCategories[element.innerText];
    for (const item of arrOfCategories) {
      makeCategory(item, element);
    }
  }

  const otherSubcategoryArr = await checkOtherCategory();
  if (otherSubcategoryArr.length !== 0) {
    const subCategoryOther = makeSubCategory("other");
    for (const element of otherSubcategoryArr) {
      makeCategory(element, subCategoryOther);
    }
  }

  const subCategories = Array.from(
    document.getElementsByClassName("product__filters__item")
  );

  subCategories.forEach(
    (element) => (element.onclick = dropDownListCategories)
  );
}
fillSubcategories();

function dropDownListCategories(event) {
  if (event.target !== this) return;
  if (this.children.length > 0) {
    if (this.hasAttribute("open")) {
      this.removeAttribute("open");
      this.classList.add("product__filters__item__active");
    } else {
      this.setAttribute("open", "true");
      this.classList.remove("product__filters__item__active");
    }

    Array.from(this.children).forEach((item) =>
      item.classList.toggle("visually-hidden")
    );
  }
}

function sortProductsByRating(products) {
  return products.toSorted((a, b) => b.rating - a.rating);
}

function fillTop20Product(arrOfFilteredProducts) {
  const top20ProductRatingSpace = document.querySelectorAll(".goods__rating");
  const top20ProductTitleSpace = document.querySelectorAll(".goods__title");
  const top20ProductPriceSpace = document.querySelectorAll(".goods__price");
  const top20ProductImgSpace = document.querySelectorAll(".goods__img");
  const top20ProductPreLoaderSpace =
    document.querySelectorAll(".goods__preloader");

  for (let i = 0; i < top20ProductTitleSpace.length; i++) {
    top20ProductRatingSpace[i].innerText = "";
    top20ProductTitleSpace[i].innerText = "";
    top20ProductPriceSpace[i].innerText = "";

    top20ProductImgSpace[i].src = ``;
  }

  for (
    let i = 0;
    i < arrOfFilteredProducts.length && i < top20ProductTitleSpace.length;
    i++
  ) {
    top20ProductRatingSpace[i].innerText = arrOfFilteredProducts[i].rating;
    top20ProductTitleSpace[i].innerText = arrOfFilteredProducts[i].title;
    top20ProductPriceSpace[i].innerText = `${arrOfFilteredProducts[i].price}$`;
    top20ProductImgSpace[i].src = `${arrOfFilteredProducts[i].thumbnail}`;

    top20ProductImgSpace[i].onload = function () {
      top20ProductPreLoaderSpace[i].style.display = "none";
      top20ProductPreLoaderSpace[i].remove();
    };
  }
}

async function fillTopXProductByRating(x = 20) {
  const allProducts = await getAllProducts();
  const sortedProductsByRating = sortProductsByRating(allProducts);
  const top20bestRatingProducts = sortedProductsByRating.slice(0, x);
  fillTop20Product(top20bestRatingProducts);
}
fillTopXProductByRating();

async function filterByCategory(e) {
  const allProducts = await getAllProducts();
  const sortedProductsByRating = sortProductsByRating(allProducts);
  if (e.target.classList.contains("product__filters__item__category")) {
    let selectedСategory = e.target.innerText;

    let result = sortedProductsByRating.filter(
      (item) => item.category === selectedСategory
    );

    let allArticle = document.querySelectorAll(".goods__body");
    for (const element of allArticle) {
      element.innerHTML = `<div class="goods__preloader">
      <div class="goods__preloader__spinner"></div>
    </div>
    <img src="" alt="product" class="goods__img" width="150" height="150" loading="lazy">
    <span class="goods__rating"></span>
    <span class="goods__title"></span>
    <span class="goods__price"></span>`;
    }

    fillTop20Product(result);

    document.querySelectorAll(".product__main__filter_btn")[1].innerText =
      selectedСategory;
    document.querySelectorAll(".product__main__filter_btn")[0].innerText =
      e.target.parentElement.childNodes[0].textContent;
  }
}

const makeGoodsCard = () => {
  const newProductSpace = document.createElement("li");
  newProductSpace.classList.add("goods__item");

  newProductSpace.innerHTML = `<article class="goods__body">
    <div class="goods__preloader">
      <div class="goods__preloader__spinner"></div>
    </div>
    <img src="" alt="product" class="goods__img" width="150" height="150" loading="lazy">
    <span class="goods__rating"></span>
    <span class="goods__title"></span>
    <span class="goods__price"></span>
  </article>`;

  return newProductSpace;
};

async function addNext20Products() {
  const allProducts = await getAllProducts();
  const sortedProductsByRating = sortProductsByRating(allProducts);

  let count = 20;
  let start = document.querySelectorAll(".goods__body").length;
  let nextTopProducts = sortedProductsByRating.slice(start, start + count);

  for (let i = 0; i < count; i++) {
    const newGoodsCard = makeGoodsCard();
    document.querySelector(".goods__list").appendChild(newGoodsCard);

    newGoodsCard.querySelector(".goods__rating").innerText =
      nextTopProducts[i].rating;
    newGoodsCard.querySelector(".goods__title").innerText =
      nextTopProducts[i].title;
    newGoodsCard.querySelector(
      ".goods__price"
    ).innerText = `${nextTopProducts[i].price}$`;

    newGoodsCard.querySelector(".goods__img").src =
      nextTopProducts[i].thumbnail;

    newGoodsCard.querySelector(".goods__img").onload = function () {
      newGoodsCard.querySelector(".goods__preloader").style.display = "none";
      newGoodsCard.querySelector(".goods__preloader").remove();
    };
  }
}

document
  .querySelector(".product__main__btn-add")
  .addEventListener("click", addNext20Products);

document
  .querySelectorAll(".product__main__filter_btn")[2]
  .addEventListener("click", () => {
    fillTopXProductByRating();
  });
// Функции пролистывания фото при наведении

async function isImageAvailable(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
    });
    return res.ok;
  } catch {
    return false;
  }
}

document
  .querySelector(".goods__list")
  .addEventListener("mouseover", async (e) => {
    if (e.target.className === "goods__img") {
      const firstImage = e.target.src;
      const secondImage = e.target.src.replace("thumbnail.webp", "2.webp");

      const checkImage = await isImageAvailable(secondImage);

      if (checkImage) {
        e.target.dataset.firstImage = firstImage;
        e.target.src = secondImage;
      }
    }
  });

document.querySelector(".goods__list").addEventListener("mouseout", (e) => {
  if (e.target.classList.contains("goods__img")) {
    if (e.target.dataset.firstImage) {
      e.target.src = e.target.dataset.firstImage;
    }
  }
});
