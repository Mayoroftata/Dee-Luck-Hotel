import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  guestFirstName: {
    type: String,
    required: [true, "Guest First name is required"],
  },
  guestLastName:{
    type: String,
    require: [true, "Guest Last Name is required"]
  },
  guestEmail: {
    type: String,
    required: [true, "Email is required"],
    match: [/.+\@.+\..+/, "Please enter a valid email"],
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: [true, "Room reference is required"],
  },
  checkIn: {
    type: Date,
    required: [true, "Check-in date is required"],
    validate: {
      validator: function (value) {
        return value >= new Date();
      },
      message: "Check-in date cannot be in the past",
    },
  },
  checkOut: {
    type: Date,
    required: [true, "Check-out date is required"],
    validate: {
      validator: function (value) {
        return value > this.checkIn;
      },
      message: "Check-out date must be after check-in date",
    },
  },
  status: {
    type: String,
    enum: ["CONFIRMED", "CANCELLED", "COMPLETED"],
    default: "CONFIRMED",
  },
  specialRequests: String,

  // 🔐 Ownership field
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt field before saving
bookingSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for faster room availability lookups
bookingSchema.index({ room: 1, checkIn: 1, checkOut: 1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
