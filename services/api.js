// users api
export const updateUserApi = async (data) => {
  const response = await fetch("/api/user", {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
export const createUserApi = async (data) => {
  const response = await fetch("/api/user", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
export const getUsersApi = async () => {
  const response = await fetch("/api/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

// products api
export const getProductApi = async (id) => {
  const response = await fetch(`/api/product?id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
export const getProducstApi = async () => {
  const response = await fetch("/api/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
export const updateProductApi = async (data) => {
  const response = await fetch("/api/product", {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

// invoices api
export const createInvoiceApi = async (data) => {
  const response = await fetch("/api/invoice", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
export const getInvoiceApi = async () => {
  const response = await fetch("/api/invoice", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
export const updateInvoiceApi = async (data) => {
  const response = await fetch("/api/invoice", {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

// brands api
export const getBrandApi = async (id) => {
  const response = await fetch(`/api/brand?id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
export const getBrandsApi = async () => {
  const response = await fetch("/api/brands", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
export const updateBrandApi = async (data) => {
  const response = await fetch("/api/brands", {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

// mellat api
export const mellatApi = async (credit) => {
  const response = await fetch(`/api/mellat?credit=${credit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
