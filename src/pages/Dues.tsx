import { useParams } from 'react-router-dom';
import { CheckCircle2, QrCode, Link as LinkIcon, CalendarClock, Receipt } from 'lucide-react';
import cashAppQr from '../assets/cashapp-qr.svg';

const CASHTAG = 'Doominater1902';

/** Dues posted on the 1st of every month. */
const MONTHLY_DUES = 18.75;

/** Colour disposition for a row in Payment history. Omit for a normal on-time payment. */
export type PaymentStatus = 'paid' | 'late' | 'waived';

export type Payment = {
  /** YYYY-MM-DD */
  date: string;
  amount: number;
  note?: string;
  /** 'paid' (default) shows green, 'late' red, 'waived' grey. */
  status?: PaymentStatus;
};

export type Member = {
  name: string;
  /** What they owed on `asOf`. Negative means they paid ahead (a credit). */
  balance: number;
  /** YYYY-MM-DD — the date you last checked this balance. Accrual starts from here. */
  asOf: string;
  /** Payments received. The page shows the last 6 months; older entries are kept but hidden. */
  payments: Payment[];
};

// ── Edit these per person, then commit and push. ──────────────────────────────
// `balance` is what they owed on `asOf`; the page adds $18.75 for every 1st of
// the month that has passed since, so these numbers stay correct on their own.
// `payments` is the record shown under "Payment history" — it is display only and
// does not affect `balance`, so log a payment AND adjust `balance`/`asOf` together.
// Add `status: 'late'` to colour a row red, or `status: 'waived'` for grey. Default is green.
const MEMBERS: Record<string, Member> = {
  'john-28ffb5f882': {
    name: 'John',
    balance: -145.25,
    asOf: '2026-09-01',
    payments: [
      { date: '2026-09-01', amount: 0, note: 'Cash App', status: 'waived' },
      { date: '2026-08-01', amount: 180, note: 'Cash App' }
    ],
  },
  'jesse-b754903054': {
    name: 'Jesse',
    balance: 0,
    asOf: '2026-09-01',
    payments: [
      { date: '2026-09-01', amount: 19, note: 'Cash App' },
      { date: '2026-08-01', amount: 16, note: 'Cash App' },
      { date: '2026-07-01', amount: 16, note: 'Cash App' },
      { date: '2026-06-01', amount: 18, note: 'Cash App' },
      { date: '2026-05-01', amount: 36, note: 'Monthly+Yearly' },
      { date: '2026-04-01', amount: 16, note: 'Cash App' },
      { date: '2026-03-01', amount: 16, note: 'Cash App' },
      { date: '2026-02-01', amount: 18, note: 'Cash App' },
      { date: '2026-01-01', amount: 16, note: 'Cash App' }
    ],
  },
  'sarah-65e9f848a6': {
    name: 'Sarah',
    balance: 0,
    asOf: '2026-09-01',
    payments: [
      { date: '2026-09-01', amount: 18, note: 'Cash App' },
      { date: '2026-08-01', amount: 18, note: 'Cash App' },
      { date: '2026-07-01', amount: 18, note: 'Cash App' },
      { date: '2026-06-01', amount: 18, note: 'Cash App' },
      { date: '2026-05-01', amount: 18, note: 'Monthly+Yearly(Covered by 18 instead of 16)' },
      { date: '2026-04-01', amount: 18, note: 'Cash App' },
      { date: '2026-03-01', amount: 18, note: 'Cash App' },
      { date: '2026-02-01', amount: 0, note: 'Waived via SS Promo', status: 'waived' },
      { date: '2026-01-01', amount: 18, note: 'Cash App' }
    ],
  },
  'michael-b999124566': {
    name: 'Michael',
    balance: 0,
    asOf: '2026-09-01',
    payments: [
      { date: '2026-09-01', amount: 19, note: 'Cash App' },
      { date: '2026-08-01', amount: 15, note: 'Cash App' },
      { date: '2026-07-01', amount: 15, note: 'Cash App' },
      { date: '2026-06-01', amount: 15, note: 'Cash App' },
      { date: '2026-05-01', amount: 35, note: 'Monthly+Yearly' },
      { date: '2026-04-01', amount: 15, note: 'Cash App' },
      { date: '2026-03-01', amount: 15, note: 'Cash App' },
      { date: '2026-02-01', amount: 16, note: 'Cash App' },
      { date: '2026-01-01', amount: 16, note: 'Cash App' }
    ],
  },
  'austin-669736a1f9': {
    name: 'Austin',
    balance: 5.5,
    asOf: '2026-09-01',
    payments: [
      { date: '2026-09-01', amount: 0, note: 'Missed', status: 'late' },
      { date: '2026-08-01', amount: 32, note: 'Apple Pay' },
      { date: '2026-07-01', amount: 16, note: 'Apple Pay' },
      { date: '2026-06-01', amount: 16, note: 'Apple Pay' },
      { date: '2026-05-01', amount: 36, note: 'Monthly+Yearly' },
      { date: '2026-04-01', amount: 16, note: 'Apple Pay' },
      { date: '2026-03-01', amount: 16, note: 'Apple Pay' },
      { date: '2026-02-01', amount: 16, note: 'Apple Pay' },
      { date: '2026-01-01', amount: 16, note: 'Apple Pay' }
    ],
  },
  'thomas-aab9e0b9d4': {
    name: 'Thomas',
    balance: 0,
    asOf: '2026-09-01',
    payments: [
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

/** Payments in the rolling 6 months up to `today`, newest first, plus their total. */
export function recentPayments(member: Member, today: Date) {
  const cutoff = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
  const list = member.payments
    .map((pmt) => ({ ...pmt, on: parseLocalDate(pmt.date) }))
    .filter((pmt) => pmt.on >= cutoff && pmt.on <= today)
    .sort((a, b) => b.on.getTime() - a.on.getTime());
  return { list, total: round2(list.reduce((sum, pmt) => sum + pmt.amount, 0)), cutoff };
}

export function computeDues(member: Member, today: Date) {
  const asOf = parseLocalDate(member.asOf);

  // Charges land on the 1st. The 1st of any date's own month is always <= that date,
  // so the 1sts falling in (asOf, today] are exactly those of months
  // monthIndex(asOf)+1 through monthIndex(today).
  const monthsAccrued = Math.max(0, monthIndex(today) - monthIndex(asOf));
  const owed = round2(member.balance + monthsAccrued * MONTHLY_DUES);

  // A credit pays forward: each whole $18.75 covers one upcoming charge.
  const credit = owed < 0 ? -owed : 0;
  const monthsCovered = Math.floor(credit / MONTHLY_DUES);
  const leftoverCredit = round2(credit - monthsCovered * MONTHLY_DUES);

  const nextChargeDate = firstOfMonth(monthIndex(today) + 1 + monthsCovered);
  // Day before the next charge — setDate(0) on the 1st rolls back to the previous month's end.
  const paidThrough = new Date(nextChargeDate);
  paidThrough.setDate(0);

  return {
    owed,
    asOf,
    monthsAccrued,
    accrued: round2(monthsAccrued * MONTHLY_DUES),
    credit,
    leftoverCredit,
    nextChargeDate,
    nextChargeAmount: round2(MONTHLY_DUES - leftoverCredit),
    paidThrough,
  };
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
  const history = recentPayments(member, today);
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
        {owesMoney ? (
          /* ── Owes money ─────────────────────────────────────────────── */
          <div className="bg-white rounded-2xl p-10 text-center shadow-lg border border-slate-100">
            <p className="text-slate-500 font-medium uppercase tracking-wide text-sm mb-3">Balance due</p>
            <div className="text-6xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              {amount}
            </div>
            <p className="text-slate-600">Gym dues</p>

            {d.monthsAccrued > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100 text-sm text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Balance on {longDate.format(d.asOf)}</span>
                  <span className="font-medium text-slate-700">{currency.format(member.balance)}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    Monthly dues since then ({d.monthsAccrued} × {currency.format(MONTHLY_DUES)})
                  </span>
                  <span className="font-medium text-slate-700">+{currency.format(d.accrued)}</span>
                </div>
              </div>
            )}
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
          </div>
        )}

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
            <span className="text-slate-500 text-sm">Last 6 months</span>
          </div>

          {history.list.length === 0 ? (
            <div className="flex items-start gap-3 text-slate-500">
              <Receipt className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>No payments recorded in the last 6 months.</p>
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
          Balance last updated {longDate.format(d.asOf)} · Dues are {currency.format(MONTHLY_DUES)} on the 1st of
          each month
        </p>
      </div>
    </div>
  );
}
