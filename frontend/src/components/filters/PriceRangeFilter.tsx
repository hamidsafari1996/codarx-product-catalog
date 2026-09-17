"use client";

import { useMemo, useState } from "react";

export const PRICE_SLIDER_MIN = 0;
export const PRICE_SLIDER_MAX = 3500;
export const PRICE_SLIDER_STEP = 10;

type PriceRangeFilterProps = {
  initialMin?: string;
  initialMax?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function parseInitial(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? clamp(parsed, PRICE_SLIDER_MIN, PRICE_SLIDER_MAX)
    : fallback;
}

export default function PriceRangeFilter({
  initialMin,
  initialMax,
}: PriceRangeFilterProps) {
  const [minValue, setMinValue] = useState(() =>
    parseInitial(initialMin, 200),
  );
  const [maxValue, setMaxValue] = useState(() =>
    parseInitial(initialMax, PRICE_SLIDER_MAX),
  );

  const minPercent = useMemo(
    () =>
      ((minValue - PRICE_SLIDER_MIN) /
        (PRICE_SLIDER_MAX - PRICE_SLIDER_MIN)) *
      100,
    [minValue],
  );

  const maxPercent = useMemo(
    () =>
      ((maxValue - PRICE_SLIDER_MIN) /
        (PRICE_SLIDER_MAX - PRICE_SLIDER_MIN)) *
      100,
    [maxValue],
  );

  return (
    <div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        <label className="sr-only" htmlFor="min_price">
          Minimum price
        </label>
        <div className="flex items-center gap-1 rounded-xl bg-muted-bg px-3 py-2.5 text-sm text-muted">
          <span>$</span>
          <input
            id="min_price"
            name="min_price"
            type="number"
            min={PRICE_SLIDER_MIN}
            max={PRICE_SLIDER_MAX}
            step={PRICE_SLIDER_STEP}
            value={minValue}
            onChange={(event) => {
              const next = clamp(
                Number(event.target.value) || PRICE_SLIDER_MIN,
                PRICE_SLIDER_MIN,
                maxValue - PRICE_SLIDER_STEP,
              );
              setMinValue(next);
            }}
            className="w-full bg-transparent text-foreground outline-none"
          />
        </div>
        <label className="sr-only" htmlFor="max_price">
          Maximum price
        </label>
        <div className="flex items-center gap-1 rounded-xl bg-muted-bg px-3 py-2.5 text-sm text-muted">
          <span>$</span>
          <input
            id="max_price"
            name="max_price"
            type="number"
            min={PRICE_SLIDER_MIN}
            max={PRICE_SLIDER_MAX}
            step={PRICE_SLIDER_STEP}
            value={maxValue}
            onChange={(event) => {
              const next = clamp(
                Number(event.target.value) || PRICE_SLIDER_MAX,
                minValue + PRICE_SLIDER_STEP,
                PRICE_SLIDER_MAX,
              );
              setMaxValue(next);
            }}
            className="w-full bg-transparent text-foreground outline-none"
          />
        </div>
      </div>

      <div className="price-range px-1">
        <div className="relative h-6">
          <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-border" />
          <div
            className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }}
          />
          <input
            type="range"
            min={PRICE_SLIDER_MIN}
            max={PRICE_SLIDER_MAX}
            step={PRICE_SLIDER_STEP}
            value={minValue}
            aria-label="Minimum price"
            onChange={(event) => {
              const next = Math.min(
                Number(event.target.value),
                maxValue - PRICE_SLIDER_STEP,
              );
              setMinValue(next);
            }}
            className="price-range-thumb price-range-thumb-min"
            style={{ zIndex: minValue > PRICE_SLIDER_MAX - 100 ? 5 : 3 }}
          />
          <input
            type="range"
            min={PRICE_SLIDER_MIN}
            max={PRICE_SLIDER_MAX}
            step={PRICE_SLIDER_STEP}
            value={maxValue}
            aria-label="Maximum price"
            onChange={(event) => {
              const next = Math.max(
                Number(event.target.value),
                minValue + PRICE_SLIDER_STEP,
              );
              setMaxValue(next);
            }}
            className="price-range-thumb price-range-thumb-max"
            style={{ zIndex: 4 }}
          />
        </div>
      </div>
    </div>
  );
}
