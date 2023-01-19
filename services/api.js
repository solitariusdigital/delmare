// users api
export const updateUserApi = async (data) => {
  const response = await fetch("/api/users", {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
export const createUserApi = async (data) => {
  const response = await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
export const getUsersApi = async () => {
  const response = await fetch("/api/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
export const getUserApi = async (id) => {
  const response = await fetch(`/api/user?id=${id}`, {
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

// notification api
export const getNotificationsApi = async () => {
  const response = await fetch("/api/notifications", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

// bloggers api
export const getBloggersApi = async () => {
  const response = await fetch("/api/bloggers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
export const updateBloggerApi = async (data) => {
  const response = await fetch("/api/bloggers", {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

// mellat api
export const getMellatApi = async (credit) => {
  const response = await fetch(`/api/mellat?credit=${credit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
export const postMellatApi = async (data) => {
  const response = await fetch("/api/mellat", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
