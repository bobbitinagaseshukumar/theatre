import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FoodCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface BookingState {
  movie: {
    id: string;
    title: string;
    posterUrl: string;
    ageRestriction: string;
  } | null;
  showtime: {
    id: string;
    screenName: string;
    startTime: string;
    basePrice: number;
  } | null;
  selectedSeats: {
    id: string;
    seatNumber: string;
    type: "STANDARD" | "PREMIUM" | "VIP";
    price: number;
  }[];
  foodItems: FoodCartItem[];
  appliedCoupon: {
    id: string;
    code: string;
    discountValue: number;
    isPercentage: boolean;
  } | null;
}

const initialState: BookingState = {
  movie: null,
  showtime: null,
  selectedSeats: [],
  foodItems: [],
  appliedCoupon: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingMovie: (state, action: PayloadAction<BookingState["movie"]>) => {
      state.movie = action.payload;
    },
    setBookingShowtime: (state, action: PayloadAction<BookingState["showtime"]>) => {
      state.showtime = action.payload;
    },
    toggleSeatSelection: (
      state,
      action: PayloadAction<{ id: string; seatNumber: string; type: "STANDARD" | "PREMIUM" | "VIP"; price: number }>
    ) => {
      const exists = state.selectedSeats.find((seat) => seat.id === action.payload.id);
      if (exists) {
        state.selectedSeats = state.selectedSeats.filter((seat) => seat.id !== action.payload.id);
      } else {
        state.selectedSeats.push(action.payload);
      }
    },
    clearSelectedSeats: (state) => {
      state.selectedSeats = [];
    },
    addFoodItem: (state, action: PayloadAction<Omit<FoodCartItem, "quantity">>) => {
      const existing = state.foodItems.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.foodItems.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFoodItem: (state, action: PayloadAction<string>) => {
      const existing = state.foodItems.find((item) => item.id === action.payload);
      if (existing) {
        if (existing.quantity > 1) {
          existing.quantity -= 1;
        } else {
          state.foodItems = state.foodItems.filter((item) => item.id !== action.payload);
        }
      }
    },
    applyCoupon: (state, action: PayloadAction<BookingState["appliedCoupon"]>) => {
      state.appliedCoupon = action.payload;
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
    },
    resetBooking: (state) => {
      state.movie = null;
      state.showtime = null;
      state.selectedSeats = [];
      state.foodItems = [];
      state.appliedCoupon = null;
    },
  },
});

export const {
  setBookingMovie,
  setBookingShowtime,
  toggleSeatSelection,
  clearSelectedSeats,
  addFoodItem,
  removeFoodItem,
  applyCoupon,
  removeCoupon,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
export type { BookingState, FoodCartItem };
