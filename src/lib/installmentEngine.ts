import { InstallmentPlan, InstallmentCalculationResult, Product } from '@/types';

/**
 * Calculates total number of payment periods based on months and frequency
 */
export function calculateTotalPeriods(durationMonths: number, frequency: 'daily' | 'weekly' | 'monthly'): number {
  switch (frequency) {
    case 'daily':
      return durationMonths * 30; // 30 days per month (e.g. 6M = 180 days)
    case 'weekly':
      // 6 months = 26 weeks (52 / 2), 3 months = 13 weeks, 2 months = 9 weeks
      if (durationMonths === 6) return 26;
      if (durationMonths === 3) return 13;
      if (durationMonths === 2) return 9;
      if (durationMonths === 12) return 52;
      return Math.round(durationMonths * 4.3333);
    case 'monthly':
      return durationMonths;
    default:
      return durationMonths;
  }
}

/**
 * Frequency label in English for copy text
 */
export function getFrequencyConditionLabel(frequency: 'daily' | 'weekly' | 'monthly'): string {
  switch (frequency) {
    case 'daily':
      return 'Daily';
    case 'weekly':
      return 'Weekly';
    case 'monthly':
      return 'Monthly';
  }
}

/**
 * Period unit label in English
 */
export function getPeriodUnitLabel(frequency: 'daily' | 'weekly' | 'monthly'): string {
  switch (frequency) {
    case 'daily':
      return 'THB / day';
    case 'weekly':
      return 'THB / week';
    case 'monthly':
      return 'THB / month';
  }
}

/**
 * Thai label for frequency
 */
export function getFrequencyThaiLabel(frequency: 'daily' | 'weekly' | 'monthly'): string {
  switch (frequency) {
    case 'daily':
      return 'รายวัน';
    case 'weekly':
      return 'รายสัปดาห์';
    case 'monthly':
      return 'รายเดือน';
  }
}

/**
 * Calculates installment breakdown with exact rounding and last period balance
 */
export function calculateInstallment(
  originalPrice: number,
  plan: InstallmentPlan,
  productInfo?: { sku: string; name: string }
): InstallmentCalculationResult {
  const totalPeriods = calculateTotalPeriods(plan.duration_months, plan.frequency);
  
  // Calculate Markup Amount
  let markupAmount = 0;
  if (plan.markup_type === 'percentage') {
    markupAmount = Math.round((originalPrice * (plan.markup_value / 100)) * 100) / 100;
  } else {
    markupAmount = plan.markup_value;
  }

  const totalInstallmentPrice = Math.round((originalPrice + markupAmount) * 100) / 100;

  // Calculate per period amount rounded to 2 decimal places
  const rawPerPeriod = totalInstallmentPrice / totalPeriods;
  const regularPerPeriod = Math.round(rawPerPeriod * 100) / 100;
  
  // Last installment absorbs any fractional difference to ensure exact sum
  const sumRegularPeriods = regularPerPeriod * (totalPeriods - 1);
  const lastInstallmentAmount = Math.round((totalInstallmentPrice - sumRegularPeriods) * 100) / 100;

  const periodLabel = getPeriodUnitLabel(plan.frequency);
  const freqCondition = getFrequencyConditionLabel(plan.frequency);
  const freqThai = getFrequencyThaiLabel(plan.frequency);

  const sku = productInfo?.sku || 'SKU';
  const name = productInfo?.name || 'Product';
  
  // Generate copy text matching the exact layout in user's image
  const copyText = [
    `Code: ${sku}`,
    `Name: ${name}`,
    `Price: ${originalPrice.toLocaleString()}.-`,
    `Condition: ${freqCondition} duration ${plan.duration_months} Months`,
    `Installment total: ${totalInstallmentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} THB`,
    `Installment: ${regularPerPeriod.toFixed(2)} ${periodLabel}`,
    `Number of payments: ${totalPeriods} (illustrative, final installment adjusted)`
  ].join('\n');

  // Build full payment schedule breakdown
  const schedule: Array<{ period: number; amount: number; remaining: number }> = [];
  let remaining = totalInstallmentPrice;

  for (let i = 1; i <= totalPeriods; i++) {
    const isLast = i === totalPeriods;
    const amount = isLast ? lastInstallmentAmount : regularPerPeriod;
    remaining = Math.max(0, Math.round((remaining - amount) * 100) / 100);
    
    schedule.push({
      period: i,
      amount,
      remaining
    });
  }

  return {
    plan_id: plan.id,
    plan_name: plan.name,
    duration_months: plan.duration_months,
    frequency: plan.frequency,
    total_periods: totalPeriods,
    original_price: originalPrice,
    markup_amount: markupAmount,
    total_installment_price: totalInstallmentPrice,
    installment_per_period: regularPerPeriod,
    last_installment_amount: lastInstallmentAmount,
    period_label: periodLabel,
    frequency_th: freqThai,
    copy_text: copyText,
    schedule
  };
}

/**
 * Finds the starting/lowest daily or monthly installment amount for a product
 */
export function getStartingInstallment(
  product: Product,
  availablePlans: InstallmentPlan[]
): {
  lowestDaily: number | null;
  lowestMonthly: number | null;
  lowestPeriodText: string;
  bestPlan: InstallmentPlan | null;
} {
  const plans = getApplicablePlans(product, availablePlans);
  if (!plans.length) {
    return { lowestDaily: null, lowestMonthly: null, lowestPeriodText: '', bestPlan: null };
  }

  let lowestDaily: number | null = null;
  let lowestMonthly: number | null = null;
  let bestPlan: InstallmentPlan | null = null;
  let minDailyRate = Infinity;

  plans.forEach(plan => {
    const calc = calculateInstallment(product.original_price, plan, { sku: product.sku, name: product.name });
    if (plan.frequency === 'daily') {
      if (calc.installment_per_period < minDailyRate) {
        minDailyRate = calc.installment_per_period;
        lowestDaily = calc.installment_per_period;
        bestPlan = plan;
      }
    } else if (plan.frequency === 'monthly') {
      if (!lowestMonthly || calc.installment_per_period < lowestMonthly) {
        lowestMonthly = calc.installment_per_period;
      }
    }
  });

  const dailyText = typeof lowestDaily === 'number' && lowestDaily > 0 
    ? `ผ่อนเริ่มต้น ฿${Number(lowestDaily).toFixed(2)}/วัน` 
    : '';

  return {
    lowestDaily,
    lowestMonthly,
    lowestPeriodText: dailyText,
    bestPlan
  };
}

/**
 * Resolves applicable plans for a given product
 */
export function getApplicablePlans(product: Product, allGlobalPlans: InstallmentPlan[]): InstallmentPlan[] {
  if (product.installment_mode === 'override' && product.override_plans && product.override_plans.length > 0) {
    return product.override_plans.filter(p => p.is_active);
  }

  if (product.installment_mode === 'custom' && product.custom_plan_ids && product.custom_plan_ids.length > 0) {
    const idSet = new Set(product.custom_plan_ids);
    return allGlobalPlans.filter(p => p.is_active && idSet.has(p.id));
  }

  // Default: use default active global plans
  return allGlobalPlans.filter(p => p.is_active && p.is_default);
}
