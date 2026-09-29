import { useParams } from 'react-router-dom';
import { CheckCircle2, QrCode, Link as LinkIcon, CalendarClock, Receipt, BellRing, CalendarCheck } from 'lucide-react';
import cashAppQr from '../assets/cashapp-qr.svg';

const CASHTAG = 'Doominater1902';

/** A monthly dues price, in effect from `from`'s month onward. */
export type Rate = {
  /** YYYY-MM-DD — first month this price is charged. */
  from: string;
  amount: number;
};

/**
 * Monthly dues history, oldest first, posted on the 1st of every month.
 * When the price changes, add a row — never edit an old one, or past months get re-priced.
 */
const DUES_RATES: Rate[] = [
  { from: '2026-01-01', amount: 16 },
  { from: '2026-09-01', amount: 18.75 },
];

/** The yearly fee, due on the 1st of `month` (1 = January). What it costs depends on the member's `feePlan`. */
const ANNUAL_FEE = {
  month: 2,
  /** Paid in one lump each February. */
  yearly: 20,
  /** Spread over 12 monthly installments — includes a convenience fee for paying over time. */
  installments: 24,
};

/** 'yearly' pays the annual fee in one go each February; 'installments' adds 1/12 of it to every month's dues. */
export type FeePlan = 'yearly' | 'installments';

/** Colour disposition for a row in Payment history. Omit for a normal on-time payment. */
export type PaymentStatus = 'paid' | 'late' | 'waived';

export type Payment = {
  /** YYYY-MM-DD */
  date: string;
  amount: number;
  note?: string;
  /** 'paid' (default) shows green, 'late' red, 'waived' grey. Display only. */
  status?: PaymentStatus;
};

/** A one-off change to what someone owes. Positive adds a charge, negative is a credit (e.g. a waived month). */
export type Adjustment = {
  /** YYYY-MM-DD — takes effect once this date has passed. */
  date: string;
  amount: number;
  note: string;
};

export type Member = {
  name: string;
  /** YYYY-MM-DD — first month they're charged dues for. Installment years run in 12-month cycles from here. */
  since: string;
  feePlan: FeePlan;
  /** Every payment received. The balance is computed from these, so log every payment here. */
  payments: Payment[];
  adjustments?: Adjustment[];
  /** Per-person price schedule, replacing DUES_RATES for this member only. */
  rates?: Rate[];
};

// ── Edit these per person, then commit and push. ──────────────────────────────
// The balance is worked out automatically: every monthly charge since `since` (at
// whatever DUES_RATES price applied that month), plus the annual fee (each February
// on the 'yearly' plan, or $2 a month on 'installments'), plus any `adjustments`,
// minus every entry in `payments`. To record a payment, just add
// it to `payments`. To waive a month, add an adjustment with a negative amount.
// Add `status: 'late'` to colour a row red, or `status: 'waived'` for grey. Default is green.
const MEMBERS: Record<string, Member> = {
  'john-28ffb5f882': {
    name: 'John',
    since: '2026-08-01',
    feePlan: 'yearly',
    payments: [
      { date: '2026-09-01', amount: 0, note: 'Cash App', status: 'waived' },
      { date: '2026-08-01', amount: 180, note: 'Cash App' }
    ],
  },
  'jesse-b754903054': {
    name: 'Jesse',
    since: '2026-01-01',
    feePlan: 'yearly',
    payments: [
      { date: '2026-09-01', amount: 19, note: 'Cash App' },
      { date: '2026-08-01', amount: 16, note: 'Cash App' },
      { date: '2026-07-01', amount: 16, note: 'Cash App' },
      { date: '2026-06-01', amount: 18, note: 'Cash App' },
      { date: '2026-05-01', amount: 20, note: 'Yearly fee' },
      { date: '2026-05-01', amount: 16, note: 'Cash App' },
      { date: '2026-04-01', amount: 16, note: 'Cash App' },
      { date: '2026-03-01', amount: 16, note: 'Cash App' },
      { date: '2026-02-01', amount: 18, note: 'Cash App' },
      { date: '2026-01-01', amount: 16, note: 'Cash App' }
    ],
  },
  'sarah-65e9f848a6': {
    name: 'Sarah',
    since: '2026-01-01',
    feePlan: 'installments',
    payments: [
      { date: '2026-09-01', amount: 18.75, note: 'Cash App' },
      { date: '2026-08-01', amount: 18, note: 'Cash App' },
      { date: '2026-07-01', amount: 18, note: 'Cash App' },
      { date: '2026-06-01', amount: 18, note: 'Cash App' },
      { date: '2026-05-01', amount: 18, note: 'Monthly+Yearly(Covered by 18 instead of 16)' },
      { date: '2026-04-01', amount: 18, note: 'Cash App' },
      { date: '2026-03-01', amount: 18, note: 'Cash App' },
      { date: '2026-02-01', amount: 0, note: 'Waived via SS Promo', status: 'waived' },
      { date: '2026-01-01', amount: 18, note: 'Cash App' }
    ],
    adjustments: [{ date: '2026-02-01', amount: -18, note: 'February waived (SS Promo)' }],
  },
  'michael-b999124566': {
    name: 'Michael',
    since: '2026-01-01',
    feePlan: 'yearly',
    payments: [
      { date: '2026-09-01', amount: 19, note: 'Cash App' },
      { date: '2026-08-01', amount: 15, note: 'Cash App' },
      { date: '2026-07-01', amount: 15, note: 'Cash App' },
      { date: '2026-06-01', amount: 15, note: 'Cash App' },
      { date: '2026-05-01', amount: 20, note: 'Yearly fee' },
      { date: '2026-05-01', amount: 15, note: 'Cash App' },
      { date: '2026-04-01', amount: 15, note: 'Cash App' },
      { date: '2026-03-01', amount: 15, note: 'Cash App' },
      { date: '2026-02-01', amount: 16, note: 'Cash App' },
      { date: '2026-01-01', amount: 16, note: 'Cash App' }
    ],
    adjustments: [{ date: '2026-09-01', amount: -5.75, note: 'Credit given for allowing cheaper rate of 15' }],
  },
  'austin-669736a1f9': {
    name: 'Austin',
    since: '2026-01-01',
    feePlan: 'yearly',
    payments: [
      { date: '2026-09-01', amount: 0, note: 'Missed', status: 'late' },
      { date: '2026-08-01', amount: 32, note: 'Apple Pay' },
      { date: '2026-07-01', amount: 16, note: 'Apple Pay' },
      { date: '2026-06-01', amount: 16, note: 'Apple Pay' },
      { date: '2026-05-01', amount: 20, note: 'Yearly fee' },
      { date: '2026-05-01', amount: 16, note: 'Apple Pay' },
      { date: '2026-04-01', amount: 16, note: 'Apple Pay' },
      { date: '2026-03-01', amount: 16, note: 'Apple Pay' },
      { date: '2026-02-01', amount: 16, note: 'Apple Pay' },
      { date: '2026-01-01', amount: 16, note: 'Apple Pay' }
    ],
  },
  'thomas-aab9e0b9d4': {
    name: 'Thomas',
    since: '2026-01-01',
    feePlan: 'installments',
    payments: [
      { date: '2026-09-28', amount: 21, note: 'Cash App' },
      { date: '2026-09-01', amount: 20.75, note: 'Cash App' },
      { date: '2026-08-01', amount: 18, note: 'Cash App' },
      { date: '2026-07-01', amount: 18, note: 'Cash App' },
      { date: '2026-06-01', amount: 18, note: 'Cash App' },
      { date: '2026-05-01', amount: 18, note: 'Monthly+Yearly(Covered by 18 instead of 16)' },
      { date: '2026-04-01', amount: 18, note: 'Cash App' },
      { date: '2026-03-01', amount: 18, note: 'Cash App' },
      { date: '2026-02-01', amount: 18, note: 'Cash App' },
      { date: '2026-01-01', amount: 18, note: 'Cash App' }
    ],
  },
};
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<PaymentStatus, string> = {
  paid: 'text-emerald-600',
  late: 'text-red-600',
  waived: 'text-slate-400',
};

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const longDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const monthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' });

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Parse YYYY-MM-DD as a *local* date. `new Date('2026-09-01')` parses as UTC and can shift a day. */
function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Months since year 0 — lets us count 1st-of-month charge dates with plain arithmetic. */
const monthIndex = (d: Date) => d.getFullYear() * 12 + d.getMonth();

const firstOfMonth = (mi: number) => new Date(Math.floor(mi / 12), mi % 12, 1);

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Every recorded payment, newest first, plus the total and the oldest date covered. */
export function paymentHistory(member: Member) {
  const list = member.payments
    .map((pmt) => ({ ...pmt, on: parseLocalDate(pmt.date) }))
    .sort((a, b) => b.on.getTime() - a.on.getTime());
  return {
    list,
    total: round2(list.reduce((sum, pmt) => sum + pmt.amount, 0)),
    oldest: list.length ? list[list.length - 1].on : undefined,
  };
}

/** The monthly price in effect for month `mi` — the latest rate whose `from` month is on or before it. */
function rateFor(rates: Rate[], mi: number): number {
  let amount = 0;
  for (const rate of rates) {
    if (monthIndex(parseLocalDate(rate.from)) <= mi) amount = rate.amount;
  }
  return amount;
}

const FEE_MONTH = ANNUAL_FEE.month - 1;
const INSTALLMENT = round2(ANNUAL_FEE.installments / 12);

/** The annual-fee part of month `mi`'s charge: a lump each February, or one installment every month. */
function annualFeeFor(plan: FeePlan, mi: number): number {
  if (plan === 'installments') return INSTALLMENT;
  return mi % 12 === FEE_MONTH ? ANNUAL_FEE.yearly : 0;
}

/** Where the member stands on the annual fee, for the notice under their balance. */
function annualFeeStatus(plan: FeePlan, firstMonth: number, thisMonth: number) {
  if (plan === 'installments') {
    if (thisMonth < firstMonth) return undefined;
    // Installment years run in 12-month cycles from the member's first month.
    const installmentsMade = ((thisMonth - firstMonth) % 12) + 1;
    return {
      plan,
      installmentsMade,
      paidOffWith: firstOfMonth(thisMonth + 12 - installmentsMade),
    } as const;
  }
  let dueMonth = Math.max(thisMonth + 1, firstMonth);
  while (dueMonth % 12 !== FEE_MONTH) dueMonth++;
  return {
    plan,
    dueDate: firstOfMonth(dueMonth),
    dueNextMonth: dueMonth === thisMonth + 1,
  } as const;
}

export function computeDues(member: Member, today: Date) {
  const rates = member.rates ?? DUES_RATES;
  const since = parseLocalDate(member.since);
  const firstMonth = monthIndex(since);
  const thisMonth = monthIndex(today);

  // Charges land on the 1st, and the 1st of today's month has always passed, so every
  // month from `since` through this one has been charged at that month's price.
  let dues = 0;
  let fees = 0;
  for (let mi = firstMonth; mi <= thisMonth; mi++) {
    dues += rateFor(rates, mi);
    fees += annualFeeFor(member.feePlan, mi);
  }
  dues = round2(dues);
  fees = round2(fees);
  const monthsCharged = Math.max(0, thisMonth - firstMonth + 1);

  const adjustments = round2(
    (member.adjustments ?? [])
      .filter((adj) => parseLocalDate(adj.date) <= today)
      .reduce((sum, adj) => sum + adj.amount, 0),
  );
  const paid = round2(member.payments.reduce((sum, pmt) => sum + pmt.amount, 0));
  const owed = round2(dues + fees + adjustments - paid);

  // A credit pays forward, month by month, at whatever each upcoming month will cost.
  const credit = owed < 0 ? -owed : 0;
  const chargeFor = (mi: number) => round2(rateFor(rates, mi) + annualFeeFor(member.feePlan, mi));
  let leftoverCredit = credit;
  let nextMonth = Math.max(thisMonth + 1, firstMonth);
  // Capped so a zero-price month can't spin forever.
  for (let i = 0; i < 120 && chargeFor(nextMonth) > 0 && leftoverCredit >= chargeFor(nextMonth); i++) {
    leftoverCredit = round2(leftoverCredit - chargeFor(nextMonth));
    nextMonth++;
  }

  const nextChargeDate = firstOfMonth(nextMonth);
  // Day before the next charge — setDate(0) on the 1st rolls back to the previous month's end.
  const paidThrough = new Date(nextChargeDate);
  paidThrough.setDate(0);

  return {
    owed,
    since,
    monthsCharged,
    dues,
    fees,
    adjustments,
    paid,
    currentRate: rateFor(rates, thisMonth),
    credit,
    leftoverCredit,
    nextChargeDate,
    nextChargeAmount: round2(chargeFor(nextMonth) - leftoverCredit),
    paidThrough,
    annualFee: annualFeeStatus(member.feePlan, firstMonth, thisMonth),
  };
}

function Breakdown({ d }: { d: ReturnType<typeof computeDues> }) {
  const row = (label: string, value: string) => (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <span className="font-medium text-slate-700 whitespace-nowrap">{value}</span>
    </div>
  );
  return (
    <div className="mt-8 pt-6 border-t border-slate-200/70 text-sm text-slate-500 space-y-1 text-left">
      {row(
        `Monthly dues since ${monthYear.format(d.since)} (${d.monthsCharged} month${d.monthsCharged === 1 ? '' : 's'})`,
        `+${currency.format(d.dues)}`,
      )}
      {d.fees > 0 &&
        row(
          d.annualFee?.plan === 'installments' ? 'Annual fee installments' : 'Annual fees',
          `+${currency.format(d.fees)}`,
        )}
      {d.adjustments !== 0 &&
        row('Adjustments', `${d.adjustments > 0 ? '+' : '−'}${currency.format(Math.abs(d.adjustments))}`)}
      {row('Payments received', `−${currency.format(d.paid)}`)}
    </div>
  );
}

/** Heads-up shown to yearly-plan members during the month before the annual fee is due. */
function AnnualFeeReminder({ fee }: { fee: ReturnType<typeof computeDues>['annualFee'] }) {
  if (fee?.plan !== 'yearly' || !fee.dueNextMonth) return null;
  return (
    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 flex items-start gap-4">
      <BellRing className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-amber-900">Your annual fee is due next month</p>
        <p className="text-amber-800 text-sm mt-1">
          The {currency.format(ANNUAL_FEE.yearly)} yearly fee will be added on {longDate.format(fee.dueDate)}, along
          with that month's dues.
        </p>
      </div>
    </div>
  );
}

function AnnualFeeCard({ fee }: { fee: ReturnType<typeof computeDues>['annualFee'] }) {
  if (!fee) return null;
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 flex items-start gap-4">
      <CalendarCheck className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Annual fee</h2>
        {fee.plan === 'installments' ? (
          <>
            <p className="text-slate-600">
              Paying over 12 months — {currency.format(INSTALLMENT)} a month toward the{' '}
              {currency.format(ANNUAL_FEE.installments)} fee. Paid off with your{' '}
              <span className="font-semibold text-slate-900">{monthYear.format(fee.paidOffWith)}</span> dues.
            </p>
            <div className="mt-4">
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-500"
                  style={{ width: `${(fee.installmentsMade / 12) * 100}%` }}
                />
              </div>
              <p className="text-slate-500 text-sm mt-2">{fee.installmentsMade} of 12 installments</p>
            </div>
          </>
        ) : (
          <p className="text-slate-600">
            Paid yearly — next {currency.format(ANNUAL_FEE.yearly)} due{' '}
            <span className="font-semibold text-slate-900">{longDate.format(fee.dueDate)}</span>.
          </p>
        )}
      </div>
    </div>
  );
}

function LinkNotFound() {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 py-24 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Link not found</h1>
          <p className="text-lg text-white/80 leading-relaxed">
            This balance link isn't valid. Double-check the link you were sent, or ask for a new one.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 flex items-start gap-4">
          <LinkIcon className="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-slate-600 leading-relaxed">
            Balance pages are private to each person, so they're only reachable through the exact link you were
            given. Links are easy to break by copying them with a trailing character or a missing piece on the end.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Dues() {
  const { token } = useParams();
  const member = token ? MEMBERS[token] : undefined;

  if (!member) return <LinkNotFound />;

  const today = startOfToday();
  const d = computeDues(member, today);
  const history = paymentHistory(member);
  const owesMoney = d.owed > 0;
  const amount = currency.format(d.owed);
  const payUrl = `https://cash.app/$${CASHTAG}/${d.owed.toFixed(2)}`;

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 py-24 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Hello, {member.name}</h1>
          <p className="text-xl text-white/90 leading-relaxed">
            {owesMoney ? 'Here’s your current gym dues balance.' : 'Your gym dues are settled.'}
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">
        <AnnualFeeReminder fee={d.annualFee} />

        {owesMoney ? (
          /* ── Owes money ─────────────────────────────────────────────── */
          <div className="bg-white rounded-2xl p-10 text-center shadow-lg border border-slate-100">
            <p className="text-slate-500 font-medium uppercase tracking-wide text-sm mb-3">Balance due</p>
            <div className="text-6xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              {amount}
            </div>
            <p className="text-slate-600">Gym dues</p>

            <Breakdown d={d} />
          </div>
        ) : (
          /* ── Paid up, possibly with credit ───────────────────────────── */
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-10 text-center border border-emerald-100">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 mb-2">You're all paid up</h2>

            {d.credit > 0 ? (
              <>
                <p className="text-slate-600 mb-6">
                  You're <span className="font-semibold text-emerald-700">{currency.format(d.credit)}</span> ahead.
                </p>
                <div className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2.5 border border-emerald-100 shadow-sm">
                  <CalendarClock className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700 font-semibold">
                    Paid through {monthYear.format(d.paidThrough)}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-slate-600">Nothing owed right now — thanks!</p>
            )}

            <p className="text-slate-500 text-sm mt-6">
              Next {currency.format(d.nextChargeAmount)} due {longDate.format(d.nextChargeDate)}
              {d.leftoverCredit > 0 && ` (${currency.format(d.leftoverCredit)} credit applied)`}
            </p>

            <Breakdown d={d} />
          </div>
        )}

        <AnnualFeeCard fee={d.annualFee} />

        {/* Pay */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {owesMoney ? 'Pay with Cash App' : 'Want to pay ahead?'}
          </h2>
          <p className="text-slate-600 mb-8">
            Tap the button on your phone, or scan the code from another device.
          </p>

          <a
            href={owesMoney ? payUrl : `https://cash.app/$${CASHTAG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {owesMoney ? `Pay ${amount} on Cash App` : 'Open Cash App'}
          </a>

          <div className="mt-10">
            <img
              src={cashAppQr}
              alt={`Cash App QR code for $${CASHTAG}`}
              className="w-56 h-56 mx-auto rounded-2xl overflow-hidden shadow-md"
            />
            <p className="flex items-center justify-center gap-2 text-slate-500 text-sm mt-4">
              <QrCode className="w-4 h-4" />
              <span>${CASHTAG}</span>
            </p>
          </div>
        </div>

        {/* Payment history */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Payment history</h2>
            {history.oldest && (
              <span className="text-slate-500 text-sm">Since {monthYear.format(history.oldest)}</span>
            )}
          </div>

          {history.list.length === 0 ? (
            <div className="flex items-start gap-3 text-slate-500">
              <Receipt className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>No payments recorded yet.</p>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-slate-100">
                {history.list.map((pmt, i) => (
                  <li key={`${pmt.date}-${i}`} className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium text-slate-900">{longDate.format(pmt.on)}</div>
                      {pmt.note && <div className="text-slate-500 text-sm">{pmt.note}</div>}
                    </div>
                    <div
                      className={`font-semibold whitespace-nowrap ${STATUS_COLOR[pmt.status ?? 'paid']}`}
                    >
                      {currency.format(pmt.amount)}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-slate-100">
                <span className="font-semibold text-slate-900">
                  Total paid ({history.list.length} payment{history.list.length === 1 ? '' : 's'})
                </span>
                <span className="font-bold text-slate-900">{currency.format(history.total)}</span>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-slate-400 text-sm">
          Dues are {currency.format(d.currentRate)} on the 1st of each month
          {member.feePlan === 'installments'
            ? `, plus ${currency.format(INSTALLMENT)} toward the annual fee`
            : `, plus a ${currency.format(ANNUAL_FEE.yearly)} annual fee each ${monthName.format(firstOfMonth(FEE_MONTH))}`}
        </p>
      </div>
    </div>
  );
}
