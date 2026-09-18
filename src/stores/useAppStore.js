import { useThemeStore } from "./useThemeStore";
import {
  useAppointmentsStore,
  isPendingOrUpcoming,
  isCancelled,
  isCompleted,
} from "./useAppointmentsStore";

export {
  useThemeStore,
  useAppointmentsStore,
  isPendingOrUpcoming,
  isCancelled,
  isCompleted,
};

export const useAppStore = useThemeStore;
export default useThemeStore;
