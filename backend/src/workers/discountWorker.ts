import cron from 'node-cron';
import {
  cleanupExpiredDiscounts,
  activateScheduledDiscounts,
} from '../services/discount.service.js';

/**
 * Discount Cron Worker
 *
 * Runs every 15 minutes to:
 * 1. Activate scheduled discounts whose startDate has arrived
 * 2. Expire active discounts whose endDate has passed
 *
 * This ensures product salePrice and activeDiscount stay in sync
 * without manual admin intervention.
 */
export const startDiscountWorker = () => {
  // Run every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    const timestamp = new Date().toISOString();

    try {
      // 1. Activate discounts that should now be live
      const activated = await activateScheduledDiscounts();
      if (activated > 0) {
        console.log(
          `[${timestamp}] 🟢 Discount Worker: Activated scheduled discounts — ${activated} product(s) synced`,
        );
      }

      // 2. Expire discounts that have ended
      const expired = await cleanupExpiredDiscounts();
      if (expired > 0) {
        console.log(
          `[${timestamp}] 🔴 Discount Worker: Expired discounts cleaned up — ${expired} product(s) reverted`,
        );
      }
    } catch (error) {
      console.error(`[${timestamp}] ❌ Discount Worker error:`, error);
    }
  });

  console.log('⏰ Discount cron worker started (runs every 15 minutes)');
};
