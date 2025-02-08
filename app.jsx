import React, { useState } from "react";

const ReservationApp = () => {
  const TOTAL_SEATS = 100; // Total available seats
  const [seatsLeft, setSeatsLeft] = useState(TOTAL_SEATS);
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({ name: "", phone: "", guests: "" });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle reservation submission
  const handleReserve = (e) => {
    e.preventDefault();
    const { name, phone, guests } = formData;
    const guestCount = parseInt(guests, 10);

    if (!name || !phone || isNaN(guestCount) || guestCount <= 0) {
      alert("Please enter valid details!");
      return;
    }

    if (guestCount > seatsLeft) {
      alert("Not enough seats available!");
      return;
    }

    const newReservation = {
      id: Date.now(),
      name,
      phone,
      guests: guestCount,
      checkInTime: new Date().toLocaleTimeString(),
      checkedOut: false,
      checkOutTime: null,
    };

    setReservations([...reservations, newReservation]);
    setSeatsLeft(seatsLeft - guestCount);
    setFormData({ name: "", phone: "", guests: "" });
  };

  // Handle checkout
  const handleCheckout = (id) => {
    setReservations(
      reservations.map((res) =>
        res.id === id
          ? { ...res, checkedOut: true, checkOutTime: new Date().toLocaleTimeString() }
          : res
      )
    );
    const checkedOutRes = reservations.find((res) => res.id === id);
    if (checkedOutRes) setSeatsLeft(seatsLeft + checkedOutRes.guests);
  };

  // Handle delete reservation
  const handleDelete = (id) => {
    const deletedRes = reservations.find((res) => res.id === id);
    if (!deletedRes) return;

    if (!deletedRes.checkedOut) setSeatsLeft(seatsLeft + deletedRes.guests);
    setReservations(reservations.filter((res) => res.id !== id));
  };

  return (
    <div className="container">
      <h1>Restaurant Reservation System</h1>
      <p>Seats Left: {seatsLeft} / {TOTAL_SEATS}</p>

      {/* Reservation Form */}
      <form onSubmit={handleReserve}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        <input type="number" name="guests" placeholder="Guest Count" value={formData.guests} onChange={handleChange} required />
        <button type="submit">Reserve Table</button>
      </form>

      {/* Reservations Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Guest Count</th>
            <th>Check-in Time</th>
            <th>Checkout Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res.id}>
              <td>{res.name}</td>
              <td>{res.phone}</td>
              <td>{res.guests}</td>
              <td>{res.checkInTime}</td>
              <td>
                {res.checkedOut ? `Checked Out at ${res.checkOutTime}` : (
                  <button onClick={() => handleCheckout(res.id)}>Click to Checkout</button>
                )}
              </td>
              <td>
                <button onClick={() => handleDelete(res.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationApp;
