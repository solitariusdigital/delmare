import { calculatePercentage } from "./utility";
import {
  createInvoiceApiServer,
  updateCareApiServer,
  getCareApiServer,
  updateProductApiServer,
  getProductApiServer,
} from "./api";

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
      color: product.group === "clothing" ? product.color : "ffffff",
      size: product.size,
      image: product.image,
      deliveryType: product.deliveryType,
      bloggerDelmareId: product.bloggerDelmareId,
      posted: false,
    };
  }

  async function updateProductCount(product) {
    try {
      let getProduct =
        (await getProductApiServer(product["_id"])) ||
        (await getCareApiServer(product["_id"]));
      switch (getProduct.group) {
        case "clothing":
          if (getProduct.size[product.size].colors[product.color] > 0) {
            getProduct.size[product.size].colors[product.color]--;
            if (
              Object.keys(getProduct.size).length === 1 &&
              Object.keys(getProduct.size[product.size].colors).length === 1 &&
              getProduct.size[product.size].colors[product.color] === 0
            ) {
              getProduct.activate = false;
            }
            await updateProductApiServer(getProduct);
          }
          break;
        case "care":
          if (getProduct.count > 0) {
            getProduct.count--;
            if (getProduct.count === 0) {
              getProduct.activate = false;
            }
            await updateCareApiServer(getProduct);
          }
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateProductData(product) {
    const invoice = createInvoiceObject(product);
    await createInvoiceApiServer(invoice);
    await updateProductCount(product);
  }
};
