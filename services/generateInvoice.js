import { calculatePercentage } from "./utility";

export const generateInvoice = async (
  currentUser,
  shoppingCart,
  saleReferenceId
) => {
  try {
    await Promise.all(shoppingCart.map(updateProductData));
    return 200;
  } catch (error) {
    console.error(error);
  }

  function createInvoiceObject(product) {
    return {
      name: currentUser.name,
      phone: currentUser.phone,
      address: currentUser.address,
      post: currentUser.post,
      userId: currentUser["_id"],
      productId: product["_id"],
      delmareId: product.delmareId,
      refId: saleReferenceId,
      title: product.title,
      originalPrice: product.price,
      price:
        currentUser.discount && currentUser.discount !== ""
          ? product.price -
            calculatePercentage(currentUser.discount, product.price)
          : product.price,
      color: product.color,
      size: product.size,
      image: product.image,
      deliveryType: product.deliveryType,
      bloggerDelmareId: product.bloggerDelmareId,
      posted: false,
    };
  }

  async function updateProductCount(product) {
    try {
      let response = await fetch(
        `https://delmareh.com/api/product?id=${product["_id"]}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let getProduct = await response.json();
      if (getProduct.size[product.size].colors[product.color] > 0) {
        getProduct.size[product.size].colors[product.color]--;
        if (
          Object.keys(getProduct.size).length === 1 &&
          Object.keys(getProduct.size[product.size].colors).length === 1 &&
          getProduct.size[product.size].colors[product.color] === 0
        ) {
          getProduct.activate = false;
        }
        let response = await fetch("https://delmareh.com/api/product", {
          method: "PUT",
          body: JSON.stringify(getProduct),
          headers: {
            "Content-Type": "application/json",
          },
        });
        await response.json();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateProductData(product) {
    const invoice = createInvoiceObject(product);
    let response = await fetch("https://delmareh.com/api/invoice", {
      method: "POST",
      body: JSON.stringify(invoice),
      headers: {
        "Content-Type": "application/json",
      },
    });
    await response.json();
    await updateProductCount(product);
  }
};
