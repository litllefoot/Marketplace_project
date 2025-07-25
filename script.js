async function getAllProducts() {
  const res = await fetch("https://dummyjson.com/products/?limit=194", {
    method: "GET",
  });
  const data = await res.json();
  const allProducts = data.products;
  //console.log(allProducts);
  return allProducts;
}

async function sortProductsByRating(products) {
  return products.toSorted((a, b) => b.rating - a.rating);
}

async function fillTop20Product() {
  const allProducts = await getAllProducts();
  const sortedProductsByRating = await sortProductsByRating(allProducts);
  const top20bestRatingProducts = sortedProductsByRating.slice(0, 20);

  const top20ProductRatingSpace = document.querySelectorAll(".goods__rating");
  const top20ProductTitleSpace = document.querySelectorAll(".goods__title");
  const top20ProductPriceSpace = document.querySelectorAll(".goods__price");
  const top20ProductImgSpace = document.querySelectorAll(".goods__img");
  const top20ProductPreLoaderSpace =
    document.querySelectorAll(".goods__preloader");

  for (let i = 0; i < top20bestRatingProducts.length; i++) {
    top20ProductRatingSpace[i].innerText = top20bestRatingProducts[i].rating;
    top20ProductTitleSpace[i].innerText = top20bestRatingProducts[i].title;
    top20ProductPriceSpace[
      i
    ].innerText = `${top20bestRatingProducts[i].price}$`;

    top20ProductImgSpace[i].src = `${top20bestRatingProducts[i].images[0]}`;

    top20ProductImgSpace[i].onload = function () {
      top20ProductPreLoaderSpace[i].style.display = "none";

    };
  }
}
fillTop20Product();

const makeGoodsCard = () => {
  const newProductSpace = document.createElement("li");
  newProductSpace.classList.add("goods__item");

  newProductSpace.innerHTML = `<article class="goods__body">
    <img src="" alt="product" class="goods__img" width="150" height="150" loading="lazy">
    <span class="goods__rating"></span>
    <span class="goods__title"></span>
    <span class="goods__price"></span>
  </article>`;

  return newProductSpace;
};

async function addNext20Products() {
  const allProducts = await getAllProducts();
  const sortedProductsByRating = await sortProductsByRating(allProducts);

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
      nextTopProducts[i].images[0];
  }
}

document
  .querySelector(".product__main__btn-add")
  .addEventListener("click", addNext20Products);

// Функции пролистывания фото при наведении

document.querySelector(".goods__list").onmouseout = (e) => {
  if (e.target.classList.contains("goods__img")) {
    let arr = [...e.target.src];
    arr[arr.length - 6] = 1;
    e.target.src = arr.join("");
  }
};

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
      const secondImage = e.target.src.replace("1.webp", "2.webp");

      const checkImage = await isImageAvailable(secondImage);

      if (checkImage) {
        e.target.dataset.firstImage = firstImage;
        e.target.src = secondImage;
      }
    }
  });

/* const preloader = document.querySelector(".goods__preloader");

window.addEventListener("load", () => {
  setTimeout(() => {
    preloader.remove();
  }, 3000);
});
 */
