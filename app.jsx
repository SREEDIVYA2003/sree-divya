import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [seatsLeft, setSeatsLeft] = useState(20); // Initial seats available
  const [reservations, setReservations] = useState([]); // Array of reservations
  const [guestCount, setGuestCount] = useState(1); // Guest count input state
  const [name, setName] = useState(""); // Name input state
  const [phone, setPhone] = useState(""); // Phone input state
  const [duplicateNameAlert, setDuplicateNameAlert] = useState(false); // Duplicate name alert state
  const [searchQuery, setSearchQuery] = useState(""); // Search query for reservations

  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Burger", price: 10 },
    { id: 2, name: "Pizza", price: 12 },
    { id: 3, name: "Pasta", price: 8 },
    { id: 4, name: "Salad", price: 5 },
    { id: 5, name: "Soda", price: 2 },
  ]); // Menu items

  const [selectedItems, setSelectedItems] = useState([]); // Selected menu items for each reservation

  const handleReservationSubmit = (e) => {
    e.preventDefault();

    // Check for duplicate names
    const duplicateReservation = reservations.find(
      (reservation) => reservation.name === name
    );
    if (duplicateReservation) {
      setDuplicateNameAlert(true);
      return;
    }

    if (guestCount <= seatsLeft) {
      setReservations([
        ...reservations,
        {
          name,
          phone,
          guestCount,
          checkInTime: new Date().toLocaleTimeString(),
          checkOutTime: "",
          checkedOut: false,
          orderedItems: selectedItems, // Store ordered menu items
        },
      ]);
      setSeatsLeft(seatsLeft - guestCount);
      setName("");
      setPhone("");
      setGuestCount(1);
      setSelectedItems([]); // Clear selected menu items
    } else {
      alert("Not enough seats available!");
    }
  };

  // Handle checkout for a reservation
  const handleCheckout = (index) => {
    const updatedReservations = [...reservations];
    updatedReservations[index].checkOutTime = new Date().toLocaleTimeString();
    updatedReservations[index].checkedOut = true;
    setReservations(updatedReservations);
    setSeatsLeft(seatsLeft + updatedReservations[index].guestCount);
  };

  // Handle deletion of a reservation
  const handleDelete = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this reservation?");
    if (confirmDelete) {
      const updatedReservations = [...reservations];
      if (!updatedReservations[index].checkedOut) {
        setSeatsLeft(seatsLeft + updatedReservations[index].guestCount);
      }
      updatedReservations.splice(index, 1);
      setReservations(updatedReservations);
    }
  };

  // Filter reservations based on the search query
  const filterReservations = (query) => {
    setSearchQuery(query);
  };

  // Filtered reservations based on search query
  const filteredReservations = reservations.filter((reservation) =>
    reservation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reservation.phone.includes(searchQuery)
  );

  // Handle item selection in the menu
  const handleMenuSelect = (item) => {
    setSelectedItems([...selectedItems, item]);
  };

  return (
    <div className="App">
      <h1>Restaurant Reservation System</h1>

      {/* Reservation Form */}
      <div className="reservation-form">
        <h2>Make a Reservation</h2>
        <form onSubmit={handleReservationSubmit}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <label>Guest Count:</label>
          <input
            type="number"
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            min="1"
            max={seatsLeft}
            required
          />
          <button type="submit">Reserve</button>
        </form>
        {duplicateNameAlert && (
          <div className="alert error">
            <p>Reservation with this name already exists!</p>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <h4>Search Reservations</h4>
        <input
          type="text"
          className="search-bar"
          placeholder="Search by Name or Phone"
          onChange={(e) => filterReservations(e.target.value)}
        />
      </div>

      {/* Menu Section */}
      <div className="menu-section">
        <h2>Menu</h2>
        <div className="menu-items-container">
          {menuItems.map((item) => (
            <div key={item.id} className="menu-item">
              <span className="menu-item-name">{item.name} - ${item.price}</span>
              <button className="add-to-order" onClick={() => handleMenuSelect(item)}>
                Add to Order
              </button>
            </div>
          ))}
        </div>

        <h3>Selected Items:</h3>
        <ul className="selected-items">
          {selectedItems.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price}
            </li>
          ))}
        </ul>
      </div>

      {/* Seats Information */}
      <div className="seats-info">
        <h3>Seats Left: {seatsLeft}</h3>
      </div>

      {/* Reservation List */}
      <div className="reservation-list">
        <h2>Reservations</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Check-in Time</th>
              <th>Checkout Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((reservation, index) => (
              <tr key={index}>
                <td>{reservation.name}</td>
                <td>{reservation.phone}</td>
                <td className="green-text">{reservation.checkInTime}</td>
                <td className="green-text">
                  {reservation.checkedOut
                    ? `Checked Out at ${reservation.checkOutTime}`
                    : "Not Checked Out"}
                </td>
                <td>
                  {!reservation.checkedOut && (
                    <button onClick={() => handleCheckout(index)}>
                      Click to Checkout
                    </button>
                  )}
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Finish Button */}
      <button className="finish-button" onClick={() => alert("Reservation System Finished!")}>
        Finish
      </button>
    </div>
  );
};

export default App;
