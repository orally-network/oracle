import { Unit } from "Interfaces/subscription";

export const BREAK_POINT_MOBILE = 640;
export const BREAK_POINT_DESKTOP_LARGE = 1440;
export const STROKE_DASHARRAY_PROGRESS_BAR = 372;
export const FREQUENCY_UNITS: Unit[] = ['min', 'hour', 'day', 'week', 'month'];
export const MAX_FREQUENCY = 110678400; // 6 month in seconds
export const MIN_FREQUENCY = 1800;

export const MIN_BALANCE = 0.1;
export const EMPTY_BALANCE = 0.001;

export const DEFAULT_SUBSCRIPTIONS = 30;
export const DEFAULT_FEEDS_SIZE = 30;
export const DEFAULT_TOP_UP_AMOUNT = 0.01;
export const DEFAULT_SUBSCRIPTIONS_SIZE = 10;
export const MAX_SOURCES = 10;