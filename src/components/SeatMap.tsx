import React, { useRef } from 'react';
import { TicketCategory } from '../types';
import { TICKET_PRICING } from '../data/movies';
import { Info, Sparkles, Check, Clock, X, Accessibility } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

interface SeatMapProps {
  selectedSeats: string[];
  bookedSeats: Set<string>;
  heldSeats?: Set<string>;
  onToggleSeat: (seatId: string, category: TicketCategory) => void;
  maxSeats?: number;
  recommendedSeats?: string[];
  onOpenSmartSeat?: () => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  selectedSeats,
  bookedSeats,
  heldSeats = new Set(),
  onToggleSeat,
  maxSeats = 8,
  recommendedSeats = [],
  onOpenSmartSeat
}) => {
  const { settings, announce } = useAccessibility();

  const rows: { row: string; category: TicketCategory; price: number }[] = [
    { row: 'A', category: 'Premium', price: TICKET_PRICING.Premium },
    { row: 'B', category: 'Premium', price: TICKET_PRICING.Premium },
    { row: 'C', category: 'Regular', price: TICKET_PRICING.Regular },
    { row: 'D', category: 'Regular', price: TICKET_PRICING.Regular },
    { row: 'E', category: 'Regular', price: TICKET_PRICING.Regular },
    { row: 'F', category: 'Regular', price: TICKET_PRICING.Regular },
    { row: 'G', category: 'Regular', price: TICKET_PRICING.Regular },
    { row: 'H', category: 'Regular', price: TICKET_PRICING.Regular },
  ];

  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  // 14 columns split into: Left (1-4), Center (5-10), Right (11-14)
  const leftCols = [1, 2, 3, 4];
  const centerCols = [5, 6, 7, 8, 9, 10];
  const rightCols = [11, 12, 13, 14];

  // Designated Wheelchair Accessible seats in Row C (level floor aisle entrance)
  const isWheelchairSeat = (row: string, colNum: number) => {
    return row === 'C' && (colNum === 1 || colNum === 8);
  };

  // Keyboard 2D Grid Arrow Navigation
  const handleSeatKeyDown = (e: React.KeyboardEvent, row: string, colNum: number, category: TicketCategory) => {
    const currentRowIdx = rowLetters.indexOf(row);
    let targetRow = row;
    let targetCol = colNum;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (colNum < 14) targetCol = colNum + 1;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (colNum > 1) targetCol = colNum - 1;
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentRowIdx < rowLetters.length - 1) {
        targetRow = rowLetters[currentRowIdx + 1];
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentRowIdx > 0) {
        targetRow = rowLetters[currentRowIdx - 1];
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const seatId = `${row}${colNum}`;
      const isBooked = bookedSeats.has(seatId);
      const isHeld = !isBooked && heldSeats.has(seatId);
      if (!isBooked && !isHeld) {
        onToggleSeat(seatId, category);
        const nextState = selectedSeats.includes(seatId) ? 'deselected' : 'selected';
        announce(`Seat ${seatId} ${nextState}.`);
      }
      return;
    }

    if (targetRow !== row || targetCol !== colNum) {
      const nextBtn = document.getElementById(`seat-${targetRow}${targetCol}`);
      nextBtn?.focus();
    }
  };

  const renderSeat = (row: string, colNum: number, category: TicketCategory) => {
    const seatId = `${row}${colNum}`;
    const isBooked = bookedSeats.has(seatId);
    const isHeld = !isBooked && heldSeats.has(seatId);
    const isUnavailable = isBooked || isHeld;
    const isSelected = selectedSeats.includes(seatId);
    const isRecommended = recommendedSeats.includes(seatId);
    const isWheelchair = isWheelchairSeat(row, colNum);
    const price = category === 'Premium' ? TICKET_PRICING.Premium : TICKET_PRICING.Regular;

    let statusText = 'Available';
    if (isBooked) statusText = 'Sold Out';
    else if (isHeld) statusText = 'Temporarily Reserved in Checkout';
    else if (isSelected) statusText = 'Selected';

    const accessibleLabel = `Seat ${row}${colNum}, ${
      isWheelchair ? 'Wheelchair Accessible Space, ' : ''
    }${category} Recliner ₹${price}, ${statusText}. ${
      !isUnavailable ? 'Press Enter or Space to toggle selection.' : ''
    }`;

    return (
      <button
        key={seatId}
        id={`seat-${seatId}`}
        type="button"
        role="gridcell"
        disabled={isUnavailable}
        onClick={() => {
          onToggleSeat(seatId, category);
          announce(`Seat ${seatId} ${isSelected ? 'removed' : 'selected'}.`);
        }}
        onKeyDown={(e) => handleSeatKeyDown(e, row, colNum, category)}
        aria-label={accessibleLabel}
        aria-pressed={isSelected}
        aria-disabled={isUnavailable}
        title={
          isWheelchair
            ? `Seat ${seatId} - Wheelchair Accessible Space (₹${price})`
            : isHeld
            ? `Seat ${seatId} is temporarily reserved by another guest`
            : `Seat ${seatId} (${category} ₹${price})`
        }
        className={`seat-btn group relative w-7 h-7 sm:w-8 sm:h-8 rounded-t-lg rounded-b-sm text-[11px] font-bold flex items-center justify-center transition-all select-none cursor-pointer focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${
          isBooked
            ? 'seat-booked bg-zinc-800/60 text-zinc-600 border border-zinc-800 cursor-not-allowed opacity-40'
            : isHeld
            ? 'seat-held bg-amber-950/40 text-amber-500/80 border border-dashed border-amber-600 cursor-not-allowed ring-1 ring-amber-500/30'
            : isSelected
            ? 'seat-selected bg-amber-400 text-zinc-950 font-extrabold shadow-lg shadow-amber-400/30 ring-2 ring-amber-300 scale-105 border-2 border-white'
            : isRecommended
            ? 'seat-recommended bg-amber-500/20 text-amber-300 border-2 border-amber-400 ring-2 ring-amber-400/50 shadow-md shadow-amber-500/30 animate-pulse hover:bg-amber-400 hover:text-zinc-950'
            : isWheelchair
            ? 'seat-available bg-sky-950/40 text-sky-300 border-2 border-sky-500 hover:bg-sky-500 hover:text-zinc-950'
            : category === 'Premium'
            ? 'seat-available bg-purple-950/40 text-purple-200 border border-purple-700/50 hover:bg-purple-700 hover:text-white hover:border-purple-400'
            : 'seat-available bg-zinc-900 text-zinc-300 border border-zinc-700/80 hover:bg-zinc-700 hover:text-white hover:border-zinc-500'
        }`}
      >
        {/* Non-color symbol cue for accessibility */}
        {isSelected ? (
          <Check className="w-3.5 h-3.5 text-zinc-950 stroke-[3]" />
        ) : isHeld ? (
          <Clock className="w-3 h-3 text-amber-500" />
        ) : isBooked ? (
          <X className="w-3 h-3 text-zinc-600" />
        ) : isWheelchair ? (
          <Accessibility className="w-3.5 h-3.5 text-sky-400" />
        ) : (
          <span className="tabular-nums">{colNum}</span>
        )}

        {/* Subtle seat backrest styling */}
        <div
          className={`absolute -top-1 w-4 h-1 rounded-t-sm ${
            isSelected
              ? 'bg-amber-300'
              : isRecommended
              ? 'bg-amber-400'
              : isHeld
              ? 'bg-amber-600/50'
              : isWheelchair
              ? 'bg-sky-400'
              : isBooked
              ? 'bg-zinc-700/40'
              : 'bg-zinc-600/40'
          }`}
          aria-hidden="true"
        />

        {/* Small recommended indicator dot */}
        {isRecommended && !isSelected && !isUnavailable && (
          <div className="absolute -top-1.5 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-zinc-950 flex items-center justify-center" aria-hidden="true">
            <span className="w-1 h-1 rounded-full bg-zinc-950" />
          </div>
        )}
      </button>
    );
  };

  return (
    <div
      className="w-full bg-zinc-950/70 border border-zinc-800 rounded-2xl p-4 sm:p-6 overflow-hidden"
      role="region"
      aria-label="Interactive Cinema Seating Map"
    >
      {/* Instructions for Keyboard & Screen Reader Users */}
      <div className="sr-only">
        Use Arrow keys to navigate between rows and seat columns. Press Space or Enter to select or deselect a seat. Maximum {maxSeats} seats can be selected.
      </div>

      {/* Cinema Screen Indicator & Find My Best Seat Trigger */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-full max-w-lg h-7 flex items-center justify-center">
          {/* Glowing curved line */}
          <div className="w-full h-2.5 border-t-4 border-amber-400/80 rounded-[50%] shadow-[0_-8px_20px_rgba(245,158,11,0.35)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-amber-400/10 to-transparent pointer-events-none rounded-[50%]" />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-lg mt-2 gap-2">
          <span className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
            All Eyes This Way · Screen
          </span>

          {onOpenSmartSeat && (
            <button
              type="button"
              onClick={onOpenSmartSeat}
              className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 to-amber-400/15 border border-amber-500/40 text-amber-300 hover:text-white hover:bg-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>✨ Find My Best Seat</span>
            </button>
          )}
        </div>
      </div>

      {/* Accessible Legend with Shapes, Symbols and Text */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-zinc-300 mb-8 pb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400 font-bold">
            1
          </div>
          <span>Regular (₹{TICKET_PRICING.Regular})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-purple-950/50 border border-purple-700 flex items-center justify-center text-[10px] text-purple-300 font-bold">
            ★
          </div>
          <span>Premium Recliner · ★ (₹{TICKET_PRICING.Premium})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-sky-950/60 border-2 border-sky-500 flex items-center justify-center text-sky-400 font-bold">
            <Accessibility className="w-3.5 h-3.5" />
          </div>
          <span>Wheelchair Space · ♿ (₹{TICKET_PRICING.Regular})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-amber-400 text-zinc-950 font-bold flex items-center justify-center text-[10px] border border-white">
            ✓
          </div>
          <span className="font-semibold text-amber-400">Selected (✓)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-amber-950/40 border border-dashed border-amber-600 text-amber-500/80 flex items-center justify-center text-[9px] font-bold">
            ⏳
          </div>
          <span className="text-amber-500/80">In Checkout (⏳)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-zinc-800/60 border border-zinc-800 text-zinc-600 flex items-center justify-center text-[10px]">
            ✕
          </div>
          <span className="text-zinc-500">Sold Out (✕)</span>
        </div>
      </div>

      {/* Seating Grid with Horizontal Scroll on small screens */}
      <div className="overflow-x-auto pb-4 scrollbar-thin" tabIndex={0} aria-label="Seating rows grid scroll area">
        <div className="min-w-[640px] max-w-2xl mx-auto flex flex-col gap-3" role="grid" aria-label="Cinema auditorium seating arrangement">
          {rows.map(({ row, category, price }, rIndex) => {
            const isCategoryDivider = rIndex === 2; // Divider between Premium (A,B) and Regular (C-H)

            return (
              <React.Fragment key={row}>
                {isCategoryDivider && (
                  <div className="flex items-center gap-3 my-2 text-xs text-zinc-500 font-semibold tracking-wider uppercase">
                    <div className="h-px flex-1 bg-zinc-800" />
                    <span>Regular Section · ₹{TICKET_PRICING.Regular} (Wheelchair Space in Row C)</span>
                    <div className="h-px flex-1 bg-zinc-800" />
                  </div>
                )}
                {rIndex === 0 && (
                  <div className="flex items-center gap-3 mb-1 text-xs text-purple-400/90 font-semibold tracking-wider uppercase">
                    <div className="h-px flex-1 bg-purple-900/40" />
                    <span>Premium Recliner Section · ₹{TICKET_PRICING.Premium}</span>
                    <div className="h-px flex-1 bg-purple-900/40" />
                  </div>
                )}

                <div className="flex items-center justify-between gap-3" role="row">
                  {/* Left Row Indicator */}
                  <span className="w-6 text-center text-xs font-bold text-zinc-400" aria-hidden="true">
                    {row}
                  </span>

                  {/* Left Block (Seats 1-4) */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {leftCols.map((c) => renderSeat(row, c, category))}
                  </div>

                  {/* Aisle Spacer */}
                  <div className="w-6 sm:w-8 text-center text-[10px] text-zinc-700 select-none" aria-hidden="true">
                    │
                  </div>

                  {/* Center Block (Seats 5-10) */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {centerCols.map((c) => renderSeat(row, c, category))}
                  </div>

                  {/* Aisle Spacer */}
                  <div className="w-6 sm:w-8 text-center text-[10px] text-zinc-700 select-none" aria-hidden="true">
                    │
                  </div>

                  {/* Right Block (Seats 11-14) */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {rightCols.map((c) => renderSeat(row, c, category))}
                  </div>

                  {/* Right Row Indicator */}
                  <span className="w-6 text-center text-xs font-bold text-zinc-400" aria-hidden="true">
                    {row}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Seat Selection Limit Alert & Summary */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Maximum {maxSeats} seats can be selected per reservation. Arrow keys supported.</span>
        </div>
        {selectedSeats.length > 0 && (
          <span className="text-amber-400 font-semibold">
            {selectedSeats.length} of {maxSeats} seats selected ({selectedSeats.join(', ')})
          </span>
        )}
      </div>
    </div>
  );
};
