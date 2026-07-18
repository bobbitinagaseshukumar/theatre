import { Router, Request, Response } from "express";
import { prisma } from "../index";

const router = Router();

// GET /dashboard - HR analytics
router.get("/dashboard", async (_req: Request, res: Response) => {
  res.json({
    totalEmployees: 87,
    presentToday: 72,
    absentToday: 6,
    lateArrivals: 4,
    onLeave: 5,
    morningShift: 32,
    eveningShift: 28,
    nightShift: 12,
    overtimeHours: 48,
    payrollThisMonth: 1842000,
    pendingSalaries: 15,
    avgPerformance: 4.2,
    trainingCompletion: 78,
    satisfaction: 4.5,
    pendingApprovals: 7,
    departments: 12
  });
});

// GET /employees - Employee directory
router.get("/employees", async (_req: Request, res: Response) => {
  const employees = [
    { id: "emp-001", code: "CV-1001", name: "Arjun Kapoor", department: "Management", designation: "Theatre Manager", shift: "MORNING", status: "PRESENT", performance: 4.8, salary: 85000, phone: "+91 9876543210", joinDate: "2023-03-15", type: "PERMANENT" },
    { id: "emp-002", code: "CV-1002", name: "Meera Patel", department: "Kitchen", designation: "Head Chef", shift: "MORNING", status: "PRESENT", performance: 4.6, salary: 55000, phone: "+91 9876543211", joinDate: "2023-06-20", type: "PERMANENT" },
    { id: "emp-003", code: "CV-1003", name: "Ravi Kumar", department: "Technical", designation: "Projection Engineer", shift: "EVENING", status: "PRESENT", performance: 4.3, salary: 48000, phone: "+91 9876543212", joinDate: "2024-01-10", type: "PERMANENT" },
    { id: "emp-004", code: "CV-1004", name: "Sneha Reddy", department: "Customer Support", designation: "Senior Executive", shift: "MORNING", status: "ON_LEAVE", performance: 4.5, salary: 35000, phone: "+91 9876543213", joinDate: "2024-04-01", type: "PERMANENT" },
    { id: "emp-005", code: "CV-1005", name: "Kiran Desai", department: "Food Court", designation: "Service Staff", shift: "EVENING", status: "LATE", performance: 3.8, salary: 22000, phone: "+91 9876543214", joinDate: "2025-02-15", type: "CONTRACT" },
    { id: "emp-006", code: "CV-1006", name: "Priya Nair", department: "Ticket Counter", designation: "Booking Agent", shift: "MORNING", status: "PRESENT", performance: 4.1, salary: 28000, phone: "+91 9876543215", joinDate: "2024-09-01", type: "PERMANENT" },
    { id: "emp-007", code: "CV-1007", name: "Amit Sharma", department: "Security", designation: "Security Supervisor", shift: "NIGHT", status: "PRESENT", performance: 4.4, salary: 32000, phone: "+91 9876543216", joinDate: "2023-11-05", type: "PERMANENT" },
    { id: "emp-008", code: "CV-1008", name: "Divya Joshi", department: "Housekeeping", designation: "Team Lead", shift: "MORNING", status: "ABSENT", performance: 3.9, salary: 26000, phone: "+91 9876543217", joinDate: "2025-06-10", type: "CONTRACT" }
  ];
  res.json(employees);
});

// GET /departments - Department list
router.get("/departments", async (_req: Request, res: Response) => {
  const departments = [
    { id: "dept-1", name: "Management", head: "Arjun Kapoor", employees: 5, budget: 425000 },
    { id: "dept-2", name: "Kitchen", head: "Meera Patel", employees: 12, budget: 360000 },
    { id: "dept-3", name: "Technical", head: "Ravi Kumar", employees: 6, budget: 288000 },
    { id: "dept-4", name: "Customer Support", head: "Sneha Reddy", employees: 8, budget: 280000 },
    { id: "dept-5", name: "Food Court", head: "Kiran Desai", employees: 15, budget: 330000 },
    { id: "dept-6", name: "Ticket Counter", head: "Priya Nair", employees: 10, budget: 280000 },
    { id: "dept-7", name: "Security", head: "Amit Sharma", employees: 14, budget: 448000 },
    { id: "dept-8", name: "Housekeeping", head: "Divya Joshi", employees: 9, budget: 234000 },
    { id: "dept-9", name: "Projection Room", head: "Sanjay Verma", employees: 4, budget: 160000 },
    { id: "dept-10", name: "Marketing", head: "Neha Gupta", employees: 4, budget: 200000 }
  ];
  res.json(departments);
});

// GET /attendance - Today's attendance board
router.get("/attendance", async (_req: Request, res: Response) => {
  const attendance = [
    { employeeId: "emp-001", name: "Arjun Kapoor", department: "Management", checkIn: "08:55", checkOut: null, status: "PRESENT", hoursWorked: 4.2, method: "FACE_ID" },
    { employeeId: "emp-002", name: "Meera Patel", department: "Kitchen", checkIn: "06:30", checkOut: null, status: "PRESENT", hoursWorked: 6.5, method: "RFID" },
    { employeeId: "emp-003", name: "Ravi Kumar", department: "Technical", checkIn: "14:00", checkOut: null, status: "PRESENT", hoursWorked: 0, method: "QR_SCAN" },
    { employeeId: "emp-004", name: "Sneha Reddy", department: "Customer Support", checkIn: null, checkOut: null, status: "ON_LEAVE", hoursWorked: 0, method: "—" },
    { employeeId: "emp-005", name: "Kiran Desai", department: "Food Court", checkIn: "14:22", checkOut: null, status: "LATE", hoursWorked: 0, method: "GPS" },
    { employeeId: "emp-006", name: "Priya Nair", department: "Ticket Counter", checkIn: "08:58", checkOut: null, status: "PRESENT", hoursWorked: 4.1, method: "FINGERPRINT" },
    { employeeId: "emp-007", name: "Amit Sharma", department: "Security", checkIn: "22:00", checkOut: null, status: "PRESENT", hoursWorked: 2, method: "NFC" },
    { employeeId: "emp-008", name: "Divya Joshi", department: "Housekeeping", checkIn: null, checkOut: null, status: "ABSENT", hoursWorked: 0, method: "—" }
  ];
  res.json(attendance);
});

// GET /shifts - Shift schedules
router.get("/shifts", async (_req: Request, res: Response) => {
  const shifts = [
    { id: "sh-1", name: "Morning Shift", type: "MORNING", startTime: "06:00", endTime: "14:00", grace: 15, breakMins: 30, maxHours: 8, assigned: 32 },
    { id: "sh-2", name: "Afternoon Shift", type: "AFTERNOON", startTime: "14:00", endTime: "22:00", grace: 15, breakMins: 30, maxHours: 8, assigned: 28 },
    { id: "sh-3", name: "Night Shift", type: "NIGHT", startTime: "22:00", endTime: "06:00", grace: 10, breakMins: 45, maxHours: 8, assigned: 12 },
    { id: "sh-4", name: "Weekend Special", type: "WEEKEND", startTime: "10:00", endTime: "23:00", grace: 20, breakMins: 60, maxHours: 12, assigned: 45 }
  ];
  res.json(shifts);
});

// GET /leaves - Leave requests
router.get("/leaves", async (_req: Request, res: Response) => {
  const leaves = [
    { id: "lv-1", employeeName: "Sneha Reddy", department: "Customer Support", type: "CASUAL", startDate: "2026-07-18", endDate: "2026-07-19", days: 2, reason: "Family function", status: "APPROVED" },
    { id: "lv-2", employeeName: "Kiran Desai", department: "Food Court", type: "SICK", startDate: "2026-07-20", endDate: "2026-07-20", days: 1, reason: "Fever", status: "PENDING" },
    { id: "lv-3", employeeName: "Divya Joshi", department: "Housekeeping", type: "EARNED", startDate: "2026-07-22", endDate: "2026-07-25", days: 4, reason: "Vacation", status: "PENDING" },
    { id: "lv-4", employeeName: "Amit Sharma", department: "Security", type: "COMP_OFF", startDate: "2026-07-19", endDate: "2026-07-19", days: 1, reason: "Worked on holiday", status: "APPROVED" }
  ];
  res.json(leaves);
});

// PATCH /leaves/:id - Approve/reject leave
router.patch("/leaves/:id", async (req: Request, res: Response) => {
  const { status } = req.body;
  res.json({ success: true, leaveId: req.params.id, newStatus: status || "APPROVED" });
});

// GET /payroll - Payroll summary
router.get("/payroll", async (_req: Request, res: Response) => {
  const payroll = [
    { employeeId: "emp-001", name: "Arjun Kapoor", department: "Management", basic: 50000, hra: 20000, da: 5000, allowances: 10000, gross: 85000, pf: 6000, esi: 1275, tds: 5000, deductions: 12275, net: 72725, status: "PAID" },
    { employeeId: "emp-002", name: "Meera Patel", department: "Kitchen", basic: 32000, hra: 12000, da: 3000, allowances: 8000, gross: 55000, pf: 3840, esi: 825, tds: 2000, deductions: 6665, net: 48335, status: "PAID" },
    { employeeId: "emp-003", name: "Ravi Kumar", department: "Technical", basic: 28000, hra: 10000, da: 3000, allowances: 7000, gross: 48000, pf: 3360, esi: 720, tds: 1500, deductions: 5580, net: 42420, status: "PENDING" },
    { employeeId: "emp-005", name: "Kiran Desai", department: "Food Court", basic: 14000, hra: 4000, da: 1500, allowances: 2500, gross: 22000, pf: 1680, esi: 330, tds: 0, deductions: 2010, net: 19990, status: "PENDING" }
  ];
  res.json(payroll);
});

// GET /performance - Performance reviews
router.get("/performance", async (_req: Request, res: Response) => {
  const reviews = [
    { employeeId: "emp-001", name: "Arjun Kapoor", department: "Management", attendance: 98, punctuality: 95, customerRating: 4.8, managerRating: 4.9, overall: 4.8, recommendation: "Eligible for annual bonus" },
    { employeeId: "emp-002", name: "Meera Patel", department: "Kitchen", attendance: 96, punctuality: 92, customerRating: 4.7, managerRating: 4.6, overall: 4.6, recommendation: "Consider for Head Chef promotion" },
    { employeeId: "emp-005", name: "Kiran Desai", department: "Food Court", attendance: 82, punctuality: 75, customerRating: 3.9, managerRating: 3.8, overall: 3.8, recommendation: "Needs punctuality training" },
    { employeeId: "emp-007", name: "Amit Sharma", department: "Security", attendance: 97, punctuality: 99, customerRating: 4.5, managerRating: 4.4, overall: 4.4, recommendation: "Recommend recognition award" }
  ];
  res.json(reviews);
});

// GET /announcements - Announcements
router.get("/announcements", async (_req: Request, res: Response) => {
  const announcements = [
    { id: "ann-1", title: "Monthly Staff Meeting", message: "All department heads report to Conference Room at 10 AM on July 20th.", category: "Meeting", priority: "HIGH", createdAt: "2026-07-18T08:00:00Z" },
    { id: "ann-2", title: "Fire Safety Drill", message: "Mandatory fire drill scheduled for July 22nd. All floors will participate.", category: "Emergency", priority: "CRITICAL", createdAt: "2026-07-17T14:00:00Z" },
    { id: "ann-3", title: "Salary Credit Notice", message: "July salaries will be credited by 25th July. Contact HR for queries.", category: "General", priority: "NORMAL", createdAt: "2026-07-16T10:00:00Z" }
  ];
  res.json(announcements);
});

// POST /employee - Hiring new staff
router.post("/employee", async (req: Request, res: Response) => {
  try {
    const { employeeCode, firstName, lastName, email, phone, designation, departmentName, baseSalary } = req.body;
    if (!employeeCode || !firstName || !lastName || !email) {
      return res.status(400).json({ message: "Required parameters are missing." });
    }
    
    // Find or create department
    const deptName = departmentName || "General Staff";
    let dept = await prisma.department.findUnique({
      where: { name: deptName }
    });
    if (!dept) {
      dept = await prisma.department.create({
        data: { name: deptName, description: `${deptName} Department` }
      });
    }

    const employee = await prisma.employee.create({
      data: {
        employeeCode,
        firstName,
        lastName,
        email,
        phone: phone || "",
        designation: designation || "Staff",
        baseSalary: parseFloat(baseSalary) || 25000,
        departmentId: dept.id,
        employmentType: "PERMANENT",
        currentShift: "MORNING"
      }
    });

    return res.status(201).json({ success: true, employee });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to create employee profile.", error: error.message });
  }
});

// PUT /employee/:id - Update details
router.put("/employee/:id", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, designation, baseSalary, isActive } = req.body;
    const employee = await prisma.employee.update({
      where: { id: req.params.id },
      data: {
        firstName,
        lastName,
        designation,
        baseSalary: baseSalary ? parseFloat(baseSalary) : undefined,
        isActive: isActive !== undefined ? isActive : undefined
      }
    });
    return res.json({ success: true, employee });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to update employee details.", error: error.message });
  }
});

// POST /attendance/checkin - GPS / Face recognition / Counter login clockin
router.post("/attendance/checkin", async (req: Request, res: Response) => {
  try {
    const { employeeId, method } = req.body;
    if (!employeeId) {
      return res.status(400).json({ message: "employeeId is required." });
    }
    const attendance = await prisma.attendanceRecord.upsert({
      where: {
        employeeId_date: {
          employeeId,
          date: new Date(new Date().setHours(0,0,0,0))
        }
      },
      update: {
        checkIn: new Date(),
        method: method || "MANUAL",
        status: "PRESENT"
      },
      create: {
        employeeId,
        date: new Date(new Date().setHours(0,0,0,0)),
        checkIn: new Date(),
        method: method || "MANUAL",
        status: "PRESENT"
      }
    });
    return res.status(201).json({ success: true, attendance });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to log checkin.", error: error.message });
  }
});

// POST /attendance/checkout - Clockout
router.post("/attendance/checkout", async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) {
      return res.status(400).json({ message: "employeeId is required." });
    }
    const record = await prisma.attendanceRecord.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: new Date(new Date().setHours(0,0,0,0))
        }
      }
    });
    if (!record || !record.checkIn) {
      return res.status(400).json({ message: "No checkin record found for today." });
    }

    const checkOutTime = new Date();
    const diffMs = checkOutTime.getTime() - record.checkIn.getTime();
    const hoursWorked = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

    const attendance = await prisma.attendanceRecord.update({
      where: { id: record.id },
      data: {
        checkOut: checkOutTime,
        hoursWorked
      }
    });
    return res.json({ success: true, attendance });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to log checkout.", error: error.message });
  }
});

// POST /shift/create - Shift manager scheduling
router.post("/shift/create", async (req: Request, res: Response) => {
  try {
    const { name, shiftType, startTime, endTime, breakMinutes } = req.body;
    if (!name || !startTime || !endTime) {
      return res.status(400).json({ message: "name, startTime, and endTime are required." });
    }
    const shift = await prisma.shiftSchedule.create({
      data: {
        name,
        shiftType: shiftType || "MORNING",
        startTime,
        endTime,
        breakMinutes: parseInt(breakMinutes) || 30
      }
    });
    return res.status(201).json({ success: true, shift });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to create shift.", error: error.message });
  }
});

// POST /leave/request - Apply leaves
router.post("/leave/request", async (req: Request, res: Response) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;
    if (!employeeId || !startDate || !endDate) {
      return res.status(400).json({ message: "employeeId, startDate, and endDate are required." });
    }
    const leave = await prisma.leaveRequest.create({
      data: {
        employeeId,
        leaveType: leaveType || "CASUAL",
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason: reason || "",
        status: "PENDING"
      }
    });
    return res.status(201).json({ success: true, leave });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to request leave.", error: error.message });
  }
});

// POST /payroll/generate - Payslip generator
router.post("/payroll/generate", async (req: Request, res: Response) => {
  try {
    const { employeeId, month, basicPay, bonus } = req.body;
    if (!employeeId || !month || !basicPay) {
      return res.status(400).json({ message: "employeeId, month, and basicPay are required." });
    }
    const basic = parseFloat(basicPay);
    const bonusVal = parseFloat(bonus) || 0;
    const pf = basic * 0.12;
    const esi = basic * 0.0075;
    const tds = basic * 0.05;
    const deductions = pf + esi + tds;
    const gross = basic + bonusVal;
    const net = gross - deductions;

    const payslip = await prisma.payslip.create({
      data: {
        employeeId,
        month,
        basicPay: basic,
        bonus: bonusVal,
        grossPay: gross,
        pfDeduction: pf,
        esiDeduction: esi,
        tdsDeduction: tds,
        netPay: net,
        isPaid: true,
        paidAt: new Date()
      }
    });
    return res.status(201).json({ success: true, payslip });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to generate payroll.", error: error.message });
  }
});

export default router;
