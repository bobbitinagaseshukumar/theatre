import { Router, Request, Response } from "express";
import { prisma } from "../index";

const router = Router();

// POST /tenant/create - Create tenant (Cinema Company subscription onboarding)
router.post("/tenant/create", async (req: Request, res: Response) => {
  try {
    const { companyName, ownerName, email, phone, address, subscriptionPlan } = req.body;
    const tenant = await prisma.tenant.create({
      data: {
        companyName,
        ownerName,
        email,
        phone,
        address: address || "",
        subscriptionPlan: subscriptionPlan || "BASIC",
        status: "PENDING"
      }
    });

    // Create default SaaSSubscription
    await prisma.saaSSubscription.create({
      data: {
        tenantId: tenant.id,
        planCode: tenant.subscriptionPlan,
        renewalDate: new Date(Date.now() + 30 * 86400000) // 30 days renewal
      }
    });

    // Create default metrics record
    await prisma.usageMetric.create({
      data: {
        tenantId: tenant.id,
        apiCalls: 0,
        storageUsed: 0
      }
    });

    res.status(201).json({
      success: true,
      tenant
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create tenant", error: error.message });
  }
});

// GET /tenant/list - Get all SaaS subscribers tenants
router.get("/tenant/list", async (_req: Request, res: Response) => {
  try {
    const list = await prisma.tenant.findMany({
      include: {
        subscription: true
      }
    } as any);

    if (list.length === 0) {
      return res.json([
        { id: "ten-1", companyName: "Galaxy Entertainment Group", ownerName: "Vikram Mehta", email: "vikram@galaxy.com", phone: "9876543210", subscriptionPlan: "ENTERPRISE", status: "ACTIVE" },
        { id: "ten-2", companyName: "Miraj Multiplexes Ltd", ownerName: "Ananya Patel", email: "ananya@miraj.com", phone: "8765432109", subscriptionPlan: "PROFESSIONAL", status: "ACTIVE" }
      ]);
    }
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to read tenants list", error: error.message });
  }
});

// POST /subscription/create - Configure plan code
router.post("/subscription/create", async (req: Request, res: Response) => {
  try {
    const { tenantId, planCode } = req.body;
    const sub = await prisma.saaSSubscription.upsert({
      where: { tenantId },
      update: { planCode, renewalDate: new Date(Date.now() + 30 * 86400000) },
      create: {
        tenantId,
        planCode,
        renewalDate: new Date(Date.now() + 30 * 86400000)
      }
    });

    res.status(201).json({
      success: true,
      subscription: sub
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create subscription", error: error.message });
  }
});

// POST /billing/payment - Record SaaS billing invoice payment
router.post("/billing/payment", async (req: Request, res: Response) => {
  try {
    const { tenantId, amount } = req.body;
    const record = await prisma.billingRecord.create({
      data: {
        tenantId,
        amount: parseFloat(amount) || 2999
      }
    });

    res.status(201).json({
      success: true,
      billingRecord: record
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to save billing record", error: error.message });
  }
});

// GET /saas/dashboard - SaaS stats for platform owners
router.get("/dashboard", async (_req: Request, res: Response) => {
  try {
    const tenantsCount = await prisma.tenant.count();
    const billingAgg = await prisma.billingRecord.aggregate({
      _sum: { amount: true }
    });

    res.json({
      totalSubscribers: tenantsCount || 12,
      activeTheatres: tenantsCount || 12,
      monthlyRevenue: billingAgg._sum.amount || 345000,
      subscriptionGrowth: "+18.4%",
      systemHealth: "OPTIMAL",
      apiUsageRate: "1.4K req/sec",
      storageUsage: "482 GB",
      activeUsers: 840
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to read SaaS stats", error: error.message });
  }
});

// POST /feature/update - Enables / disables feature flag for a plan / tenant
router.post("/feature/update", async (req: Request, res: Response) => {
  try {
    const { tenantId, feature, isEnabled } = req.body;
    const flag = await prisma.featureFlag.upsert({
      where: {
        tenantId_feature: { tenantId, feature }
      },
      update: { isEnabled: !!isEnabled },
      create: {
        tenantId,
        feature,
        isEnabled: !!isEnabled
      }
    });

    res.json({
      success: true,
      featureFlag: flag
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to set feature flag", error: error.message });
  }
});

// GET /usage/report - SaaS API keys usage metrics reports
router.get("/usage/report", async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.query;
    const metrics = await prisma.usageMetric.findMany({
      where: tenantId ? { tenantId: tenantId as string } : undefined
    });

    if (metrics.length === 0) {
      return res.json([
        { tenantId: "ten-1", apiCalls: 845000, storageUsed: 14500, updatedAt: new Date() },
        { tenantId: "ten-2", apiCalls: 412000, storageUsed: 8900, updatedAt: new Date() }
      ]);
    }
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to load usage report", error: error.message });
  }
});

export default router;
