// Global JavaScript functions
class CartRemoveButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', (event) => {
      event.preventDefault();
      const cartItems = this.closest('cart-items') || this.closest('cart-drawer-items');
      cartItems.updateQuantity(this.dataset.index, 0);
    });
  }
}

customElements.define('cart-remove-button', CartRemoveButton);

class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input');
    this.changeEvent = new Event('change', { bubbles: true })

    this.querySelectorAll('button').forEach(
      (button) => button.addEventListener('click', this.onButtonClick.bind(this))
    );
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    event.target.name === 'plus' ? this.input.stepUp() : this.input.stepDown();
    if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
  }
}

customElements.define('quantity-input', QuantityInput);

// Utility functions
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
  };
}

// Cart functionality
function addToCart(formData) {
  return fetch(window.routes.cart_add_url, {
    ...fetchConfig(),
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .catch((error) => {
    console.error('Error:', error);
  });
}

function changeCart(lineItem, quantity) {
  return fetch(window.routes.cart_change_url, {
    ...fetchConfig(),
    body: JSON.stringify({ line: lineItem, quantity: quantity })
  })
  .then(response => response.json())
  .catch((error) => {
    console.error('Error:', error);
  });
}

// Product variant selection
function updateVariantInput(variantId) {
  const input = document.querySelector('input[name="id"]');
  if (input) {
    input.value = variantId;
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  // Add any initialization code here
  console.log('Theme loaded');
}
