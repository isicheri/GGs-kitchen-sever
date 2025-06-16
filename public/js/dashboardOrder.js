let currentPage = 1;
let currentFilter = 'all';
let currentSearch = '';
let currentOrderIdForEdit = null;

const ordersContainer = document.getElementById('ordersContainer');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('search-order');
const loader = document.getElementById('loader');

const modalOverlay = document.getElementById("modalOverlay");
const modalDetails = document.getElementById("modalDetails");
const closeModal = document.getElementById("closeModal");

const editModalOverlay = document.getElementById("editModalOverlay");
const closeEditModal = document.getElementById("closeEditModal");
const editStatusSelect = document.getElementById("editStatusSelect");
const editStatusForm = document.getElementById("editStatusForm");

searchInput.addEventListener('input', debounce(() => {
  currentSearch = searchInput.value.trim();
  fetchOrders(1, currentFilter, currentSearch);
}, 500));

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

function filterOrders(status) {
  currentFilter = status;
  fetchOrders(1, status, currentSearch);
}

async function fetchOrders(page = 1, status = 'all') {
  currentPage = page;
  currentFilter = status;

  loader.classList.remove('hidden');
  ordersContainer.innerHTML = '';

  const query = new URLSearchParams();
  query.append('page', page);
  if (status !== 'all') query.append('status', status);

  try {
    const res = await fetch(`/user/orders/get-all?${query.toString()}`);
    const data = await res.json();

    renderOrders(data.data);
    renderPagination(data.pagination.totalPages);
  } catch (err) {
    console.error(err);
    showError("Failed to load orders. Please try again later.");
    ordersContainer.innerHTML = '<p style="color:red;">Failed to load orders.</p>';
  } finally {
    loader.classList.add('hidden');
  }
}

function renderOrders(orders) {
  ordersContainer.innerHTML = orders
    .map((order, i) => {
      const index = (currentPage - 1) * 10 + i + 1;
      return `
        <div class="order" data-id="${order.id}">
          <div class="first-order-div"><p>#${index}</p><p>${new Date(order.createAt).toLocaleString()}</p></div>
          <div class="second-order-div"><p>${order.orderBy}</p></div>
          <div class="third-order-div"><p>${order.itemsOrdered.length} Items</p></div>
          <div class="fourth-order-div"><p>₦${order.totalAmount}</p></div>
          <div class="fifth-order-div ${order.paid === 'YES' ? 'paid' : 'unpaid'}">
            <p>${order.paid === 'YES' ? 'Paid' : 'Unpaid'}</p>
          </div>
          <div class="del-vis-holder">
            <div class="order-visibility-btn"><img src="/assets/visibility.svg" alt="view-btn"></div>
            <div class="delete-visibilty-btn"><img src="/assets/delete.svg" alt="delete-btn"></div>
            <div class="edit-visibilty-btn"><img src="/assets/edit.svg" alt="edit-btn"></div>
          </div>
        </div>
      `;
    })
    .join('');
}

function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.innerText = message;
  document.body.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 4000);
}


function renderPagination(totalPages) {
  pagination.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = 'btn-input';
    btn.innerText = i;
    btn.style.width = "20px";
    btn.onclick = () => fetchOrders(i, currentFilter, currentSearch);
    if (i === currentPage) btn.style.backgroundColor = '#7e0926';
    pagination.appendChild(btn);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".btn-input[data-filter]");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("data-filter");
      filterButtons.forEach(btn => btn.classList.remove("active-filter"));
      button.classList.add("active-filter");
      filterOrders(status);
    });
  });
});

function showOrderModal(order) {
  modalDetails.innerHTML = `
    <h2 class="text_deco">Order Details</h2>
    <p><strong>Customer:</strong> ${order.orderBy}</p>
    <p><strong>Items:</strong> ${order.itemsOrdered.map(item => item.name || item).join(", ")}</p>
    <p><strong>Total:₦</strong> ${order.itemsOrdered.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</p>
    <p><strong>Paid:</strong> ${order.paid}</p>
    <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
    <p><strong>Date:</strong> ${new Date(order.createAt).toLocaleString()}</p>
  `;
  modalOverlay.classList.add("show");
  modalOverlay.classList.remove("hidden");
}

closeModal.addEventListener("click", () => {
  modalOverlay.classList.remove("show");
  setTimeout(() => modalOverlay.classList.add("hidden"), 300);
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove("show");
    setTimeout(() => modalOverlay.classList.add("hidden"), 300);
  }
});

ordersContainer.addEventListener("click", async (e) => {
  const target = e.target.closest("img");
  if (!target) return;

  const orderDiv = target.closest(".order");
  const orderId = orderDiv?.dataset?.id;

  if (target.alt === "view-btn") {
     try {
    const res = await fetch(`/user/orders/find-order/${orderId}`);
    if (!res.ok) throw new Error("Order not found");
    const data = await res.json();
    if (data.success) {
      showOrderModal(data.data);
    } else {
      showError("Could not load order details.");
    }
  } catch (err) {
    console.error(err);
    showError("Something went wrong loading the order.");
  }
  }

  if (target.alt === "edit-btn" && target.closest(".edit-visibilty-btn")) {
    currentOrderIdForEdit = orderId;
    const currentStatus = orderDiv?.querySelector(".fifth-order-div p")?.textContent?.trim();
    editStatusSelect.value = currentStatus === "Paid" ? "YES" : "NO";
    editModalOverlay.classList.remove("hidden");
    setTimeout(() => editModalOverlay.classList.add("active"), 10);
  }

  if (target.alt === "delete-btn" && target.closest(".delete-visibilty-btn")) {
     if (confirm("Are you sure you want to delete this order?")) {
    try {
      const res = await fetch(`/user/orders/delete/${orderId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      fetchOrders();
    } catch (err) {
      console.error(err);
      showError("Failed to delete order.");
    }
  }
  }
});


editStatusForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newStatus = editStatusSelect.value;

  if (!currentOrderIdForEdit) {
    showError("No order selected.");
    return;
  }

  try {
    const res = await fetch(`/user/orders/update-order-status/${currentOrderIdForEdit}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paidType: newStatus }),
    });

    if (!res.ok) throw new Error("Update failed");

    editModalOverlay.classList.remove("active");
    setTimeout(() => editModalOverlay.classList.add("hidden"), 300);
    fetchOrders();
  } catch (err) {
    console.error(err);
    showError("Could not update order status.");
  }
});


closeEditModal.addEventListener("click", () => {
  editModalOverlay.classList.remove("active");
  setTimeout(() => editModalOverlay.classList.add("hidden"), 300);
});

editModalOverlay.addEventListener("click", (e) => {
  if (e.target === editModalOverlay) {
    editModalOverlay.classList.remove("active");
    setTimeout(() => editModalOverlay.classList.add("hidden"), 300);
  }
});

// Initial fetch
fetchOrders();
