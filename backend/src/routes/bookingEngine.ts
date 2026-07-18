import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { protect, restrictTo } from "../middleware/auth";
import { Role } from "@prisma/client";

const router = Router();

// GET all auditoriums / halls
router.get("/halls", async (req: Request, res: Response) => {
  const halls = [
    { id: "hall-1", name: "Audi 1 - Dolby Atmos Luxe", totalSeats: 160, screenType: "Dolby" },
    { id: "hall-2", name: "IMAX Laser Dome", totalSeats: 200, screenType: "IMAX" }
  ];
  res.status(200).json(halls);
});

// POST calculate best available seat group
router.post("/best-seats", async (req: Request, res: Response) => {
  const { groupSize, seatLayout, bookedSeats } = req.body;
  const size = parseInt(groupSize) || 2;

  // Rows A-K (where A is premium top recliner, K is bottom couple)
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"];
  const columnsCount = 16;
  
  let bestGroup: string[] = [];
  let bestScore = -Infinity;

  // Scoring weights: center rows (D, E, F) and center columns (7-10) get the highest scores
  for (const row of rows) {
    const rowIdx = rows.indexOf(row);
    // Row score: middle rows get higher base score
    const rowScore = 10 - Math.abs(rowIdx - 4.5) * 1.5;

    for (let startCol = 1; startCol <= columnsCount - size + 1; startCol++) {
      let groupPossible = true;
      const currentGroup: string[] = [];
      let groupColScore = 0;

      for (let offset = 0; offset < size; offset++) {
        const col = startCol + offset;
        const seatId = `${row}-${col}`;

        // Check if seat is booked, blocked, or a couple/wheelchair seat (keep standard/VIP)
        const isBooked = bookedSeats?.includes(seatId);
        if (isBooked || row === "K" || (row === "H" && [1, 16].includes(col))) {
          groupPossible = false;
          break;
        }

        currentGroup.push(seatId);
        // Column score: center columns get higher base score
        const colScore = 8 - Math.abs(col - 8.5);
        groupColScore += colScore;
      }

      if (groupPossible) {
        const totalScore = rowScore * 10 + groupColScore;
        if (totalScore > bestScore) {
          bestScore = totalScore;
          bestGroup = currentGroup;
        }
      }
    }
  }

  res.status(200).json({ bestGroup, score: bestScore });
});

// POST validate seat selection (Isolated Seat Prevention checks)
router.post("/validate-selection", async (req: Request, res: Response) => {
  const { selectedSeats, bookedSeats, blockedSeats } = req.body;
  
  // Group selected seats by row
  const rowGroups: Record<string, number[]> = {};
  selectedSeats.forEach((seatId: string) => {
    const [row, colStr] = seatId.split("-");
    const col = parseInt(colStr);
    if (!rowGroups[row]) rowGroups[row] = [];
    rowGroups[row].push(col);
  });

  let createsIsolatedSeat = false;
  let isolatedSeatId = "";

  for (const row in rowGroups) {
    const cols = rowGroups[row].sort((a, b) => a - b);
    
    // Check gaps of exactly 1 seat between selected seats in the same row
    for (let i = 0; i < cols.length - 1; i++) {
      const current = cols[i];
      const next = cols[i + 1];
      
      if (next - current === 2) {
        const gapCol = current + 1;
        const gapSeatId = `${row}-${gapCol}`;
        
        // If the gap seat is not booked or blocked, it becomes isolated!
        const isUnavailable = bookedSeats?.includes(gapSeatId) || blockedSeats?.includes(gapSeatId);
        if (!isUnavailable) {
          createsIsolatedSeat = true;
          isolatedSeatId = gapSeatId;
          break;
        }
      }
    }

    if (createsIsolatedSeat) break;
  }

  res.status(200).json({
    valid: !createsIsolatedSeat,
    isolatedSeatId,
    warning: createsIsolatedSeat ? `This selection leaves seat ${isolatedSeatId.replace("-", "")} isolated. Would you like to select it too?` : null
  });
});

export default router;
