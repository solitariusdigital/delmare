import {
  createInvoiceApi,
  getProductApi,
  updateProductApi,
  getUserApi,
  updateUserApi,
} from "./api";

import { calculatePercentage } from "./utility";

export const generateInvoice = async (
  currentUser,
  shoppingCart,
  saleReferenceId
) => {
  console.log(currentUser, shoppingCart, saleReferenceId, "zzz");

  try {
    await Promise.all(shoppingCart.map(updateProductData));
    await updateUserDiscount();
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
      let getProduct = await getProductApi(product["_id"]);
      if (getProduct.size[product.size].colors[product.color] > 0) {
        getProduct.size[product.size].colors[product.color]--;
        if (
          Object.keys(getProduct.size).length === 1 &&
          Object.keys(getProduct.size[product.size].colors).length === 1 &&
          getProduct.size[product.size].colors[product.color] === 0
        ) {
          getProduct.activate = false;
        }
        await updateProductApi(getProduct);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateProductData(product) {
    const invoice = createInvoiceObject(product);
    await createInvoiceApi(invoice);
    await updateProductCount(product);
  }

  async function updateUserDiscount() {
    try {
      const user = await getUserApi(currentUser["_id"]);
      user.discount = "";
      await updateUserApi(user);
    } catch (error) {
      console.error(error);
    }
  }
};
