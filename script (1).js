//old js

// Data
const rooms = [
   { id: 1, number: '101', type: 'Standard (AC, TV, WiFi)', price: 150, status: 'available' },
    { id: 2, number: '102', type: 'Standard (AC, TV, WiFi)', price: 150, status: 'available' },
    { id: 3, number: '103', type: 'Standard (AC, TV, WiFi)', price: 150, status: 'available' },
    { id: 4, number: '201', type: 'Deluxe (AC, TV, WiFi,Swimming pool)', price: 250, status: 'available'},
    { id: 5, number: '202', type: 'Deluxe (AC, TV, WiFi,Swimming pool)', price: 250, status: 'available'},
    { id: 6, number: '203', type: 'Deluxe (AC, TV, WiFi,Swimming pool)', price: 250, status: 'available' },
    { id: 7, number: '301', type: 'Suite (AC, TV, WiFi,Swimming pool,Jacuzzi)', price: 400, status: 'available' },
    { id: 8, number: '302', type: 'Suite (AC, TV, WiFi,Swimming pool,Jacuzzi)', price: 400, status: 'available' },
    { id: 9, number: '303', type: 'Suite (AC, TV, WiFi,Swimming pool,Jacuzzi)', price: 400, status: 'available'}

  ];
  
  const foodMenu = [
    { id: 1, name: 'Breakfast', price: 15 },
    { id: 2, name: 'Lunch', price: 25 },
    { id: 3, name: 'Dinner', price: 30 },
    { id: 4, name: 'Coffee', price: 5 },
    {id: 5, name: 'Juice', price: 40 },
    {id: 6, name: '10Y old wine', price: 200 },
    {id: 7, name: ' vodka', price: 100 },
    { id: 8, name: 'Dessert', price: 10 }

  ];
  
  let bookings = [];
  let orders = [];
  let currentOrder = [];
  let selectedRoom = null;
  let selectedBooking = null;
  
  // DOM Elements
  const loginScreen = document.getElementById('login-screen');
  const app = document.getElementById('app');
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginError = document.getElementById('login-error');
  
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Room Booking Elements
  const availableRoomsContainer = document.getElementById('available-rooms');
  const roomBookingForm = document.getElementById('room-booking-form');
  const roomNumberSpan = document.getElementById('room-number');
  const guestNameInput = document.getElementById('guest-name');
  const guestEmailInput = document.getElementById('guest-email');
  const checkInDateInput = document.getElementById('check-in-date');
  const checkOutDateInput = document.getElementById('check-out-date');
  const cancelBookingBtn = document.getElementById('cancel-booking-btn');
  const confirmBookingBtn = document.getElementById('confirm-booking-btn');
  
  // Food Ordering Elements
  const activeBookingsContainer = document.getElementById('active-bookings');
  const foodOrderSection = document.getElementById('food-order-section');
  const selectBookingSection = document.getElementById('select-booking-section');
  const foodMenuContainer = document.getElementById('food-menu');
  const orderItemsContainer = document.getElementById('order-items');
  const orderRoomNumberSpan = document.getElementById('order-room-number');
  const orderTotalSpan = document.getElementById('order-total');
  const cancelOrderBtn = document.getElementById('cancel-order-btn');
  const submitOrderBtn = document.getElementById('submit-order-btn');
  
  // Bill Generation Elements
  const billingBookingsContainer = document.getElementById('billing-bookings');
  
  // Bookings Elements
  const allBookingsContainer = document.getElementById('all-bookings');
  
  // Event Listeners
  loginBtn.addEventListener('click', handleLogin);
  logoutBtn.addEventListener('click', handleLogout);
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      showTab(tab);
    });
  });
  
  cancelBookingBtn.addEventListener('click', () => {
    roomBookingForm.classList.add('hidden');
    selectedRoom = null;
  });
  
  confirmBookingBtn.addEventListener('click', handleBookRoom);
  
  cancelOrderBtn.addEventListener('click', () => {
    foodOrderSection.classList.add('hidden');
    selectBookingSection.classList.remove('hidden');
    selectedBooking = null;
    currentOrder = [];
    renderCurrentOrder();
  });
  
  submitOrderBtn.addEventListener('click', submitOrder);
  
  // Functions
  function handleLogin() {
    const username = usernameInput.value;
    const password = passwordInput.value;
  
    if (username === 'admin' && password === 'admin123') {
      loginError.classList.add('hidden');
      loginScreen.classList.add('hidden');
      app.classList.remove('hidden');
      showTab('rooms');
      renderAvailableRooms();
      renderActiveBookings();
      renderAllBookings();
      renderBillingBookings();
    } else {
      loginError.classList.remove('hidden');
    }
  }
  
  function handleLogout() {
    loginScreen.classList.remove('hidden');
    app.classList.add('hidden');
    usernameInput.value = '';
    passwordInput.value = '';
    loginError.classList.add('hidden');
    resetForm();
  }
  
  function showTab(tab) {
    // Update active tab button
    tabBtns.forEach(btn => {
      if (btn.dataset.tab === tab) {
        btn.classList.add('active');
        btn.classList.remove('text-gray-500', 'border-transparent');
        btn.classList.add('text-indigo-600', 'border-indigo-500');
      } else {
        btn.classList.remove('active');
        btn.classList.remove('text-indigo-600', 'border-indigo-500');
        btn.classList.add('text-gray-500', 'border-transparent');
      }
    });
  
    // Show corresponding tab content
    tabContents.forEach(content => {
      if (content.id === `${tab}-tab`) {
        content.classList.remove('hidden');
      } else {
        content.classList.add('hidden');
      }
    });
  
    // Reset any open forms
    if (tab !== 'food') {
      foodOrderSection.classList.add('hidden');
      selectBookingSection.classList.remove('hidden');
      selectedBooking = null;
      currentOrder = [];
      renderCurrentOrder();
    }
  
    if (tab !== 'rooms') {
      roomBookingForm.classList.add('hidden');
      selectedRoom = null;
    }
  }
  
  function renderAvailableRooms() {
    availableRoomsContainer.innerHTML = '';
    
    const availableRooms = rooms.filter(room => room.status === 'available');
    
    if (availableRooms.length === 0) {
      availableRoomsContainer.innerHTML = '<p class="text-gray-500">No available rooms</p>';
      return;
    }
  
    availableRooms.forEach(room => {
      const roomCard = document.createElement('div');
      roomCard.className = 'bg-white rounded-lg shadow-md p-6 room-card';
      roomCard.innerHTML = `
        <h3 class="text-lg font-semibold">Room ${room.number}</h3>
        <p class="text-gray-600">Type: ${room.type}</p>
        <p class="text-gray-600">Price: $${room.price}/night</p>
        <p class="text-gray-600">Status: ${room.status}</p>
        <button 
          data-room-id="${room.id}" 
          class="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 book-room-btn"
        >
          Book Now
        </button>
      `;
      availableRoomsContainer.appendChild(roomCard);
    });
  
    // Add event listeners to book buttons
    document.querySelectorAll('.book-room-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const roomId = parseInt(btn.dataset.roomId);
        selectedRoom = rooms.find(room => room.id === roomId);
        roomNumberSpan.textContent = selectedRoom.number;
        roomBookingForm.classList.remove('hidden');
      });
    });
  }
  
  function handleBookRoom() {
    if (!selectedRoom || !guestNameInput.value || !guestEmailInput.value || !checkInDateInput.value || !checkOutDateInput.value) {
      alert('Please fill in all fields');
      return;
    }
  
    const newBooking = {
      id: bookings.length + 1,
      roomId: selectedRoom.id,
      guestName: guestNameInput.value,
      guestEmail: guestEmailInput.value,
      checkInDate: checkInDateInput.value,
      checkOutDate: checkOutDateInput.value,
      status: 'active'
    };
  
    bookings.push(newBooking);
  
    // Update room status
    const roomIndex = rooms.findIndex(room => room.id === selectedRoom.id);
    if (roomIndex !== -1) {
      rooms[roomIndex].status = 'booked';
    }
  
    // Reset form
    roomBookingForm.classList.add('hidden');
    selectedRoom = null;
    guestNameInput.value = '';
    guestEmailInput.value = '';
    checkInDateInput.value = '';
    checkOutDateInput.value = '';
  
    // Update UI
    renderAvailableRooms();
    renderActiveBookings();
    renderAllBookings();
    renderBillingBookings();
  
    // Switch to bookings tab
    showTab('bookings');
  }
  
  function renderActiveBookings() {
    activeBookingsContainer.innerHTML = '';
    
    const activeBookings = bookings.filter(booking => booking.status === 'active');
    
    if (activeBookings.length === 0) {
      activeBookingsContainer.innerHTML = '<p class="text-gray-500">No active bookings</p>';
      return;
    }
  
    activeBookings.forEach(booking => {
      const room = rooms.find(r => r.id === booking.roomId);
      const bookingCard = document.createElement('div');
      bookingCard.className = 'bg-white rounded-lg shadow-md p-6 booking-card';
      bookingCard.innerHTML = `
        <h3 class="text-lg font-semibold">Room ${room.number}</h3>
        <p class="text-gray-600">Guest: ${booking.guestName}</p>
        <p class="text-gray-600">Check-in: ${booking.checkInDate}</p>
        <p class="text-gray-600">Check-out: ${booking.checkOutDate}</p>
        <button 
          data-booking-id="${booking.id}" 
          class="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 select-booking-btn"
        >
          Order Food
        </button>
      `;
      activeBookingsContainer.appendChild(bookingCard);
    });
  
    // Add event listeners to select booking buttons
    document.querySelectorAll('.select-booking-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookingId = parseInt(btn.dataset.bookingId);
        selectedBooking = bookings.find(booking => booking.id === bookingId);
        const room = rooms.find(r => r.id === selectedBooking.roomId);
        orderRoomNumberSpan.textContent = room.number;
        selectBookingSection.classList.add('hidden');
        foodOrderSection.classList.remove('hidden');
        renderFoodMenu();
        renderCurrentOrder();
      });
    });
  }
  
  function renderFoodMenu() {
    foodMenuContainer.innerHTML = '';
    
    foodMenu.forEach(item => {
      const foodItemCard = document.createElement('div');
      foodItemCard.className = 'bg-white rounded-lg shadow-md p-6 food-item-card';
      foodItemCard.innerHTML = `
        <h3 class="text-lg font-semibold">${item.name}</h3>
        <p class="text-gray-600">Price: $${item.price}</p>
        <button 
          data-food-id="${item.id}" 
          class="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 add-food-btn"
        >
          Add to Order
        </button>
      `;
      foodMenuContainer.appendChild(foodItemCard);
    });
  
    // Add event listeners to add food buttons
    document.querySelectorAll('.add-food-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const foodId = parseInt(btn.dataset.foodId);
        const foodItem = foodMenu.find(item => item.id === foodId);
        
        // Check if item already exists in order
        const existingItem = currentOrder.find(item => item.foodItem.id === foodId);
        
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          currentOrder.push({ foodItem, quantity: 1 });
        }
        
        renderCurrentOrder();
      });
    });
  }
  
  function renderCurrentOrder() {
    orderItemsContainer.innerHTML = '';
    
    if (currentOrder.length === 0) {
      orderItemsContainer.innerHTML = '<p class="text-gray-500">No items in order</p>';
      orderTotalSpan.textContent = '0';
      return;
    }
  
    let total = 0;
    
    currentOrder.forEach(item => {
      const itemTotal = item.foodItem.price * item.quantity;
      total += itemTotal;
      
      const orderItem = document.createElement('div');
      orderItem.className = 'flex justify-between items-center order-item p-2 rounded';
      orderItem.innerHTML = `
        <div>
          <p>${item.foodItem.name}</p>
          <p class="text-sm text-gray-500">$${item.foodItem.price} x ${item.quantity}</p>
        </div>
        <div class="flex items-center space-x-2">
          <p>$${itemTotal}</p>
          <button 
            data-food-id="${item.foodItem.id}" 
            class="text-red-500 hover:text-red-700 remove-item-btn"
          >
            Remove
          </button>
        </div>
      `;
      orderItemsContainer.appendChild(orderItem);
    });
  
    orderTotalSpan.textContent = total.toFixed(2);
  
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const foodId = parseInt(btn.dataset.foodId);
        currentOrder = currentOrder.filter(item => item.foodItem.id !== foodId);
        renderCurrentOrder();
      });
    });
  }
  
  function submitOrder() {
    if (!selectedBooking || currentOrder.length === 0) {
      alert('Please add items to the order');
      return;
    }
  
    const total = currentOrder.reduce((sum, item) => sum + (item.foodItem.price * item.quantity), 0);
    
    const newOrder = {
      id: orders.length + 1,
      bookingId: selectedBooking.id,
      items: [...currentOrder],
      total
    };
  
    orders.push(newOrder);
    
    // Reset order
    currentOrder = [];
    selectedBooking = null;
    foodOrderSection.classList.add('hidden');
    selectBookingSection.classList.remove('hidden');
    
    // Update UI
    renderCurrentOrder();
    renderBillingBookings();
    renderAllBookings();
  }
  
  function renderBillingBookings() {
    billingBookingsContainer.innerHTML = '';
    
    const activeBookings = bookings.filter(booking => booking.status === 'active');
    
    if (activeBookings.length === 0) {
      billingBookingsContainer.innerHTML = '<p class="text-gray-500">No active bookings</p>';
      return;
    }
  
    activeBookings.forEach(booking => {
      const room = rooms.find(r => r.id === booking.roomId);
      const bookingOrders = orders.filter(order => order.bookingId === booking.id);
      const foodTotal = bookingOrders.reduce((sum, order) => sum + order.total, 0);
      const total = room.price + foodTotal;
      
      const bookingCard = document.createElement('div');
      bookingCard.className = 'bg-white rounded-lg shadow-md p-6 booking-card';
      bookingCard.innerHTML = `
        <h3 class="text-lg font-semibold">Room ${room.number}</h3>
        <div class="mt-4">
          <p class="font-semibold">Guest Details</p>
          <p class="text-gray-600">${booking.guestName}</p>
          <p class="text-gray-600">${booking.guestEmail}</p>
        </div>
        <div class="mt-4">
          <p class="font-semibold">Booking Details</p>
          <p class="text-gray-600">Check-in: ${booking.checkInDate}</p>
          <p class="text-gray-600">Check-out: ${booking.checkOutDate}</p>
        </div>
        <div class="mt-4">
          <p class="font-semibold">Charges</p>
          <p class="text-gray-600">Room: $${room.price}</p>
          <p class="text-gray-600">Food: $${foodTotal.toFixed(2)}</p>
          <p class="font-semibold mt-2">Total: $${total.toFixed(2)}</p>
        </div>
        <button 
          data-booking-id="${booking.id}" 
          class="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 checkout-btn"
        >
          Checkout
        </button>
      `;
      billingBookingsContainer.appendChild(bookingCard);
    });
  
    // Add event listeners to checkout buttons
    document.querySelectorAll('.checkout-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookingId = parseInt(btn.dataset.bookingId);
        handleCheckout(bookingId);
      });
    });
  }
  
  function handleCheckout(bookingId) {
    const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);
    if (bookingIndex !== -1) {
      bookings[bookingIndex].status = 'checked-out';
      
      // Update room status
      const roomId = bookings[bookingIndex].roomId;
      const roomIndex = rooms.findIndex(room => room.id === roomId);
      if (roomIndex !== -1) {
        rooms[roomIndex].status = 'available';
      }
      
      // Update UI
      renderAvailableRooms();
      renderActiveBookings();
      renderAllBookings();
      renderBillingBookings();
    }
  }
  
  function renderAllBookings() {
    allBookingsContainer.innerHTML = '';
    
    if (bookings.length === 0) {
      allBookingsContainer.innerHTML = '<p class="text-gray-500">No bookings yet</p>';
      return;
    }
  
    bookings.forEach(booking => {
      const room = rooms.find(r => r.id === booking.roomId);
      const bookingCard = document.createElement('div');
      bookingCard.className = 'bg-white rounded-lg shadow-md p-6 booking-card';
      
      let checkoutButton = '';
      if (booking.status === 'active') {
        checkoutButton = `
          <button 
            data-booking-id="${booking.id}" 
            class="mt-4 w-full bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 checkout-btn"
          >
            Checkout
          </button>
        `;
      }
      
      bookingCard.innerHTML = `
        <h3 class="text-lg font-semibold">Room ${room.number}</h3>
        <p class="text-gray-600">Guest: ${booking.guestName}</p>
        <p class="text-gray-600">Status: ${booking.status}</p>
        <p class="text-gray-600">Check-in: ${booking.checkInDate}</p>
        <p class="text-gray-600">Check-out: ${booking.checkOutDate}</p>
        ${checkoutButton}
      `;
      allBookingsContainer.appendChild(bookingCard);
    });
  
    // Add event listeners to checkout buttons
    document.querySelectorAll('.checkout-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookingId = parseInt(btn.dataset.bookingId);
        handleCheckout(bookingId);
      });
    });
  }
  
  function resetForm() {
    // Reset all form fields and selections
    selectedRoom = null;
    selectedBooking = null;
    currentOrder = [];
    guestNameInput.value = '';
    guestEmailInput.value = '';
    checkInDateInput.value = '';
    checkOutDateInput.value = '';
    roomBookingForm.classList.add('hidden');
    foodOrderSection.classList.add('hidden');
    selectBookingSection.classList.remove('hidden');
    renderCurrentOrder();
  }
  
  // Initialize the app
  showTab('rooms');