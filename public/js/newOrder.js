const form = document.querySelector('.order-form');
const itemsContainer = document.getElementById('itemsContainer');
const addItemBtn = document.querySelector('.add-item-btn');
const totalCostDisplay = document.querySelector('.total-display');
const statusMessage = document.querySelector('.status-message');
const loader = document.querySelector('.loader');
const loaderWrapper = document.querySelector('#loaderWrapper');

function showLoader() {
  loaderWrapper.classList.remove('hidden');
}

function hideLoader() {
  loaderWrapper.classList.add('hidden');
}

// Helper: Create a new item block
function createItemBlock() {
  const div = document.createElement('div');
  div.className = 'item-block';
  div.innerHTML = `
    <input type="text" name="name" placeholder="Item name" required />
    <input type="number" name="price" placeholder="Price" min="0" required />
    <input type="number" name="quantity" placeholder="Quantity" min="1" required />
    <button type="button" class="remove-item-btn">✖</button>
  `;

  div.querySelector('.remove-item-btn').addEventListener('click', () => {
    div.remove();
    updateTotal();
  });

  div.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateTotal);
  });

  return div;
}

// Prefill today's date on load
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('orderDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }
});


// Add item block initially
addItemBtn.addEventListener('click', () => {
  // console.log("item clicked")
  itemsContainer.appendChild(createItemBlock());
});

// Total cost calculator
function updateTotal() {
  let total = 0;
  const blocks = itemsContainer.querySelectorAll('.item-block');
  blocks.forEach(block => {
    const price = parseFloat(block.querySelector('[name="price"]').value) || 0;
    const qty = parseInt(block.querySelector('[name="quantity"]').value) || 0;
    total += price * qty;
  });
  totalCostDisplay.textContent = `Total Cost: ₦${total}`;
}

// Handle form submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Clear status and show loader
  statusMessage.classList.add('hidden');
  showLoader()

  const orderBy = form.orderBy.value.trim();
  const paymentMethod = form.paymentMethod.value.trim();
  const paidType = form.paidType.value;
  const orderDate = form.orderDate.value;
  
  if (orderDate) {
  const selectedDate = new Date(orderDate);
  selectedDate.setHours(0, 0, 0, 0); 
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate > today) {
    showMessage('Order date cannot be in the future.', 'error');
    hideLoader();
    return;
  }
}


  const items = [];
  let hasError = false;

  itemsContainer.querySelectorAll('.item-block').forEach(block => {
    const name = block.querySelector('[name="name"]').value.trim();
    const price = parseFloat(block.querySelector('[name="price"]').value);
    const quantity = parseInt(block.querySelector('[name="quantity"]').value);

    if (!name || price < 0 || quantity < 1) hasError = true;
    items.push({ name, price, quantity });
  });

  if (!orderBy || hasError || items.length === 0) {
    showMessage('Please fill all fields correctly.', 'error');
    hideLoader()
    return;
  }

  try {
    const response = await fetch('/user/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderBy, paidType,paymentMethod,orderDate,itemOrdered: items })
    });

    const data = await response.json();
    hideLoader()

    if (data.success) {
      showMessage(data.message, 'success');
      form.reset();
      itemsContainer.innerHTML = '';
      updateTotal();
    } else {
      showMessage(data.message || 'Something went wrong.', 'error');
    }
  } catch (err) {
    hideLoader()
    showMessage('Server error. Please try again.', 'error');
  }
});

function showMessage(msg, type) {
const toastContainer = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;

  toastContainer.appendChild(toast);

  // Remove toast after animation ends
  setTimeout(() => {
    toast.remove();
  }, 4000);
}