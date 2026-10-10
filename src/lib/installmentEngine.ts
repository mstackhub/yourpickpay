import { InstallmentPlan, InstallmentCalculationResult, Product, DownPaymentMode, DownPaymentType, WebsiteSettings } from '@/types';

/**
 * Calculates total number of payment periods based on months and frequency
 */
export function calculateTotalPeriods(durationMonths: number, frequency: 'daily' | 'weekly' | 'monthly'): number {
  switch (frequency) {
    case 'daily':
      return durationMonths * 30; // 30 days per month (e.g. 6M = 180 days)
    case 'weekly':
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
 * Resolves down payment details for a product based on product settings and global defaults
 */
export function resolveProductDownPayment(
  product?: Product,
  settings?: WebsiteSettings
): { mode: DownPaymentMode; type: DownPaymentType; value: number; amount: number } {
  if (!product) {
    const type = settings?.default_down_payment_type || 'percentage';
    const value = Number(settings?.default_down_payment_value) || 0;
    return { mode: 'default', type, value, amount: 0 };
  }

  if (product.down_payment_mode === 'none') {
    return { mode: 'none', type: 'percentage', value: 0, amount: 0 };
  }

  if (product.down_payment_mode === 'custom') {
    const type = product.down_payment_type || 'percentage';
    const value = Number(product.down_payment_value) || 0;
    const amount = type === 'percentage' 
      ? Math.round(product.original_price * (value / 100) * 100) / 100
      : Math.min(product.original_price, value);
    return { mode: 'custom', type, value, amount };
  }

  // Default mode: use website settings if enabled
  if (settings?.enable_down_payment && (settings.default_down_payment_value || 0) > 0) {
    const type = settings.default_down_payment_type || 'percentage';
    const value = Number(settings.default_down_payment_value) || 0;
    const amount = type === 'percentage'
      ? Math.round(product.original_price * (value / 100) * 100) / 100
      : Math.min(product.original_price, value);
    return { mode: 'default', type, value, amount };
  }

  return { mode: 'none', type: 'percentage', value: 0, amount: 0 };
}

/**
 * Calculates installment breakdown with exact rounding, down payment, and last period balance
 */
export function calculateInstallment(
  originalPrice: number,
  plan: InstallmentPlan,
  productInfo?: { sku: string; name: string },
  downPaymentOption?: {
    mode?: DownPaymentMode;
    type?: DownPaymentType;
    value?: number;
  }
): InstallmentCalculationResult {
  const totalPeriods = calculateTotalPeriods(plan.duration_months, plan.frequency);
  
  // Calculate Down Payment
  let downPaymentAmount = 0;
  if (downPaymentOption && downPaymentOption.mode !== 'none') {
    const dpType = downPaymentOption.type || 'percentage';
    const dpVal = Number(downPaymentOption.value) || 0;
    if (dpVal > 0) {
      if (dpType === 'percentage') {
        downPaymentAmount = Math.round((originalPrice * (dpVal / 100)) * 100) / 100;
      } else {
        downPaymentAmount = Math.min(originalPrice, dpVal);
      }
    }
  }

  // Financed Principal after deducting down payment
  const financedAmount = Math.max(0, originalPrice - downPaymentAmount);

  // Calculate Markup Amount on Financed Amount
  let markupAmount = 0;
  if (plan.markup_type === 'percentage') {
    markupAmount = Math.round((financedAmount * (plan.markup_value / 100)) * 100) / 100;
  } else {
    markupAmount = plan.markup_value;
  }

  const totalInstallmentPrice = Math.round((financedAmount + markupAmount) * 100) / 100;

  // Calculate per period amount rounded to 2 decimal places
  const rawPerPeriod = totalPeriods > 0 ? totalInstallmentPrice / totalPeriods : 0;
  const regularPerPeriod = Math.round(rawPerPeriod * 100) / 100;
  
  // Last installment absorbs any fractional difference to ensure exact sum
  const sumRegularPeriods = regularPerPeriod * (totalPeriods - 1);
  const lastInstallmentAmount = Math.round((totalInstallmentPrice - sumRegularPeriods) * 100) / 100;

  const periodLabel = getPeriodUnitLabel(plan.frequency);
  const freqThai = getFrequencyThaiLabel(plan.frequency);
  const unitTh = plan.frequency === 'daily' ? 'บาท / วัน' : plan.frequency === 'weekly' ? 'บาท / สัปดาห์' : 'บาท / เดือน';
  const periodTypeTh = plan.frequency === 'daily' ? 'วัน' : plan.frequency === 'weekly' ? 'สัปดาห์' : 'งวด';

  const sku = productInfo?.sku || 'SKU';
  const name = productInfo?.name || 'Product';
  
  // Generate copy text in clean Thai language
  const copyLines = [
    `รหัสสินค้า: ${sku}`,
    `ชื่อสินค้า: ${name}`,
    `ราคาสด: ${originalPrice.toLocaleString()} บาท`,
  ];

  if (downPaymentAmount > 0) {
    const dpLabel = downPaymentOption?.type === 'percentage' ? ` (${downPaymentOption.value}%)` : '';
    copyLines.push(`เงินดาวน์: ${downPaymentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท${dpLabel}`);
    copyLines.push(`ยอดจัดผ่อน: ${financedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท`);
  }

  copyLines.push(`เงื่อนไขการผ่อน: ผ่อน${freqThai} ระยะเวลา ${plan.duration_months} เดือน`);
  copyLines.push(`ยอดผ่อนรวมทั้งหมด: ${totalInstallmentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท`);
  copyLines.push(`ยอดชำระต่องวด: ${regularPerPeriod.toFixed(2)} ${unitTh}`);
  copyLines.push(`จำนวนงวดชำระ: ${totalPeriods} ${periodTypeTh} (คำนวณโดยประมาณ งวดสุดท้ายอาจมีการปรับเศษสตางค์)`);

  const copyText = copyLines.join('\n');

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
    down_payment_amount: downPaymentAmount,
    financed_amount: financedAmount,
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

/**
 * Gets starting / lowest installment info for a product
 */
export function getStartingInstallment(
  product: Product,
  allGlobalPlans: InstallmentPlan[],
  settings?: WebsiteSettings
): { lowestPeriodText: string; lowestAmount: number; planName: string } {
  const plans = getApplicablePlans(product, allGlobalPlans);
  if (!plans || plans.length === 0) {
    return { lowestPeriodText: '-', lowestAmount: 0, planName: '-' };
  }

  const downPayment = resolveProductDownPayment(product, settings);

  let best: { lowestPeriodText: string; lowestAmount: number; planName: string } = {
    lowestPeriodText: '-',
    lowestAmount: Infinity,
    planName: '-'
  };

  const dailyPlans = plans.filter(p => p.frequency === 'daily');
  const targetPlans = dailyPlans.length > 0 ? dailyPlans : plans;

  for (const plan of targetPlans) {
    const calc = calculateInstallment(product.original_price, plan, { sku: product.sku, name: product.name }, downPayment);
    if (calc.installment_per_period < best.lowestAmount && calc.installment_per_period > 0) {
      const unit = plan.frequency === 'daily' ? 'วัน' : plan.frequency === 'weekly' ? 'สัปดาห์' : 'เดือน';
      best = {
        lowestPeriodText: `฿${calc.installment_per_period.toFixed(2)} / ${unit}`,
        lowestAmount: calc.installment_per_period,
        planName: plan.name
      };
    }
  }

  if (best.lowestAmount === Infinity) {
    return { lowestPeriodText: '-', lowestAmount: 0, planName: '-' };
  }

  return best;
}
