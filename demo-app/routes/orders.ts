import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../auth/middleware';
import { Order, OrderStatus, canTransition, calculateTotal } from '../models/order';

const router = Router();

// Mock in-memory store
const orders: Order[] = [];

/**
 * GET /orders — returns all orders for the authenticated user.
 */
router.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userOrders = orders.filter(o => o.userId === req.user!.id);
  return res.json(userOrders);
});

/**
 * POST /orders — creates a new order.
 * Calculates total automatically from items array.
 */
router.post('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items array is required and must not be empty' });
  }

  const newOrder: Order = {
    id: `order_${Date.now()}`,
    userId: req.user!.id,
    items,
    status: 'pending',
    totalAmount: calculateTotal(items),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  orders.push(newOrder);
  return res.status(201).json(newOrder);
});

/**
 * PATCH /orders/:id/status — transitions an order to a new status.
 * Validates the transition using the OrderStatus state machine.
 */
router.patch('/:id/status', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const order = orders.find(o => o.id === req.params.id && o.userId === req.user!.id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const newStatus: OrderStatus = req.body.status;

  if (!canTransition(order.status, newStatus)) {
    return res.status(400).json({
      error: `Cannot transition from '${order.status}' to '${newStatus}'`,
    });
  }

  order.status = newStatus;
  order.updatedAt = new Date();

  return res.json(order);
});

export default router;
