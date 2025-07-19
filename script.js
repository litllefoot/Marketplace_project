async function getAllProducts() {
  const res = await fetch("https://dummyjson.com/products/?limit=194", {
    method: "GET",
  });
  const data = await res.json();
  const allProducts = data.products;
  //console.log(allProducts);
  return allProducts;
}

async function bestRatingProduct() {
  const allProducts = await getAllProducts();

  let bestRatingProduct = allProducts.toSorted((a, b) => b.rating - a.rating);

  return bestRatingProduct;
}

async function fillTop20Product() {
  const bestRatingProducts = await bestRatingProduct();
  const top20bestRatingProducts = bestRatingProducts.slice(0, 20);

  const top20ProductRatingSpace = document.querySelectorAll(".goods__rating");
  const top20ProductTitleSpace = document.querySelectorAll(".goods__title");
  const top20ProductPriceSpace = document.querySelectorAll(".goods__price");
  const top20ProductImgSpace = document.querySelectorAll(".goods__img");

  for (let i = 0; i < top20bestRatingProducts.length; i++) {
    top20ProductRatingSpace[i].innerText = top20bestRatingProducts[i].rating;
    top20ProductTitleSpace[i].innerText = top20bestRatingProducts[i].title;
    top20ProductPriceSpace[
      i
    ].innerText = `${top20bestRatingProducts[i].price}$`;
    top20ProductImgSpace[i].src = top20bestRatingProducts[i].images[0];
  }
}
fillTop20Product();

async function addNext20Products() {
  const bestRatingProducts = await bestRatingProduct();

  let count = 20;
  let start = document.querySelectorAll(".goods__body").length;
  let nextTopProducts = bestRatingProducts.slice(start, start + count);

  for (let i = 0; i < count; i++) {
    let newProductSpace = document.createElement("li");
    newProductSpace.classList.add("goods__item");
    newProductSpace.innerHTML = `
  <article class="goods__body">
    <img src="${nextTopProducts[i].images[0]}" alt="product" class="goods__img" width="150" height="150" loading="lazy">
    <span class="goods__rating">${nextTopProducts[i].rating}</span>
    <span class="goods__title">${nextTopProducts[i].title}</span>
    <span class="goods__price">${nextTopProducts[i].price}$</span>
  </article>
`;
    document.querySelector(".goods__list").appendChild(newProductSpace);
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
