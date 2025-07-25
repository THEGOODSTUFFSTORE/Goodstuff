# 🧪 TESTING MODE - 1 KES Delivery Fee

## Current Status: TESTING MODE ACTIVE ⚠️

All delivery locations now charge **1 KES** regardless of distance for payment testing.

### What's Changed:
- ✅ All delivery fees = **1 KES** 
- ✅ Distance calculation still works (for future use)
- ✅ Map interface works normally
- ✅ Payment testing is affordable

### Files Modified:
- `lib/geocoding.ts` - `calculateDeliveryFee()` function returns 1

## 🔄 To Restore Normal Delivery Fees Later:

When you're done testing payments, restore normal fees in `lib/geocoding.ts`:

```typescript
export function calculateDeliveryFee(distance: number, tiers: DeliveryTier[] = DEFAULT_DELIVERY_TIERS): number {
  // Remove this line:
  // return 1;
  
  // Uncomment these lines:
  const tier = tiers.find(tier => distance <= tier.maxDistance);
  return tier ? tier.fee : tiers[tiers.length - 1].fee;
}
```

## 💰 Normal Delivery Fee Structure:
- Within 5km: Ksh 200
- 5-10km: Ksh 400  
- 10-20km: Ksh 600
- 20-50km: Ksh 1000
- Beyond 50km: Ksh 1500

---
**Perfect for testing payments without worrying about high delivery costs!** 🚀 