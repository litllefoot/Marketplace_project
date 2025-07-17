async function getAllProducts() {
  const res = await fetch("https://dummyjson.com/products/?limit=194", {
    method: "GET",
  });
  const data = await res.json();
  const allProducts = data.products;
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
    <img src="" alt="product" class="goods__img" width="150" height="150" loading="lazy">
    <span class="goods__rating">4.9</span>
    <span class="goods__title">Платье летнее длинное</span>
    <span class="goods__price">$499.00</span>
  </article>
`;
    document.querySelector(".goods__list").appendChild(newProductSpace);
  }
}

document
  .querySelector(".product__main__btn-add")
  .addEventListener("click", addNext20Products);
