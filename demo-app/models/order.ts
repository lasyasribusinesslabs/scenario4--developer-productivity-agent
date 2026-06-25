export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ORDER STATUS STATE MACHINE
 *
 * Valid transitions:
 *   pending    → confirmed | cancelled
 *   confirmed  → shipped   | cancelled
 *   shipped    → delivered
 *   delivered  → (terminal — no further transitions)
 *   cancelled  → (terminal — no further transitions)
 */
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped:   ['delivered'],
  delivered: [],
  cancelled: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

/**
 * calculateTotal — sums all line items to produce the order total.
 * Does NOT apply discounts or taxes (handled at checkout layer).
 */
export function calculateTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}
