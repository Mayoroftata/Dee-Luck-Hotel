import Booking from "../../model/booking.model.js";
import { requireAdmin } from "../../utils/auth.js";

export const bookingResolvers = {
  Query: {
    getAllBookings: async (_, __, { user }) => {
      requireAdmin(user); // Only admins can access all bookings
      return await Booking.find().populate("room", "user");
    },

    getBookingById: async (_, { id }, { user }) => {
      const booking = await Booking.findById(id).populate("room", "user");
      if (!booking) throw new Error("Booking not found");

      const isOwner = booking.user?.toString() === user?.id;
      const isAdmin = user?.role === "admin";

      if (!isOwner && !isAdmin) {
        throw new Error("Unauthorized to view this booking");
      }

      return booking;
    },
  },

  Mutation: {
    createBooking: async (_, { input }, { user }) => {
      try {
        const checkIn = new Date(input.checkIn);
        const checkOut = new Date(input.checkOut);

        if (checkIn >= checkOut) {
          throw new Error("Check-out date must be after check-in date");
        }

        if (checkIn < new Date().setHours(0, 0, 0, 0)) {
          throw new Error("Check-in date cannot be in the past");
        }

        const existingBooking = await Booking.findOne({
          room: input.room,
          status: { $ne: "CANCELLED" },
          $or: [
            { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } },
          ],
        });

        if (existingBooking) {
          throw new Error("Room is already booked for these dates");
        }

        const booking = new Booking({
          ...input,
          user: user.id,
          status: "CONFIRMED",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const savedBooking = await booking.save();
        return await Booking.populate(savedBooking, "room");
      } catch (error) {
        if (error.name === "ValidationError") {
          const messages = Object.values(error.errors).map((e) => e.message);
          throw new Error(`Validation failed: ${messages.join(", ")}`);
        }
        throw new Error(error.message || "Booking creation failed");
      }
    },

    updateBooking: async (_, { id, input }, { user }) => {
      const booking = await Booking.findById(id);
      if (!booking) throw new Error("Booking not found");

      const isOwner = booking.user?.toString() === user?.id;
      const isAdmin = user?.role === "admin";

      if (!isOwner && !isAdmin) {
        throw new Error("Unauthorized to update this booking");
      }

      const updatedBooking = await Booking.findByIdAndUpdate(id, input, {
        new: true,
      }).populate("room");

      return updatedBooking;
    },

    deleteBooking: async (_, { id }, { user }) => {
      requireAdmin(user); // Only admin can delete bookings

      const deletedBooking = await Booking.findByIdAndDelete(id);
      if (!deletedBooking) throw new Error("Booking not found");

      return {
        success: true,
        message: "Booking deleted successfully",
        id: deletedBooking._id.toString(),
      };
    },

    cancelBooking: async (_, { id }, { user }) => {
      const booking = await Booking.findById(id);
      if (!booking) throw new Error("Booking not found");

      if (booking.status === "CANCELLED") {
        throw new Error("Booking is already cancelled");
      }

      const isOwner = booking.user?.toString() === user?.id;
      const isAdmin = user?.role === "admin";

      if (!isOwner && !isAdmin) {
        throw new Error("Unauthorized to cancel this booking");
      }

      const cancelledBooking = await Booking.findByIdAndUpdate(
        id,
        {
          status: "CANCELLED",
          updatedAt: new Date().toISOString(),
        },
        { new: true }
      ).populate("room");

      return cancelledBooking;
    },
  },

  Booking: {
    id: (booking) => booking._id.toString(),
  },
};
