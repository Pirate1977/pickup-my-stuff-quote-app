export default function JunkPricingApp() {
  const { useMemo, useState } = React;

  const LOAD_PRICES = {
    quarter: 250,
    half: 500,
    threeQuarter: 750,
    full: 1000,
  };

  const ITEM_ADDERS = {
    mattress: 40,
    appliance: 75,
    tire: 25,
    tv: 35,
    paint: 50,
    construction: 100,
    yardWaste: 50,
    hotTub: 400,
    piano: 300,
  };

  const [image, setImage] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [city, setCity] = useState("");
  const [distance, setDistance] = useState(20);
  const [loadEstimate, setLoadEstimate] = useState("half");
  const [laborHours, setLaborHours] = useState(2);
  const [crewSize, setCrewSize] = useState(1);
  const [stairs, setStairs] = useState(0);
  const [insideCarry, setInsideCarry] = useState(false);
  const [dumpFee, setDumpFee] = useState(150);
  const [urgent, setUrgent] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [notes, setNotes] = useState("");

  function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
  }

  function toggleItem(key) {
    setSelectedItems((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
  }

  const quote = useMemo(() => {
    const base = LOAD_PRICES[loadEstimate];
    const distanceFee = distance <= 30 ? 0 : distance <= 60 ? 75 : distance <= 90 ? 150 : 250;
    const laborFee = Math.max(0, laborHours - 1) * 50 * crewSize;
    const stairsFee = stairs * 25;
    const carryFee = insideCarry ? 75 : 0;
    const urgentFee = urgent ? 100 : 0;
    const itemFees = selectedItems.reduce((sum, key) => sum + (ITEM_ADDERS[key] || 0), 0);

    const recommended = base + distanceFee + laborFee + stairsFee + carryFee + urgentFee + itemFees;
    const low = Math.max(base, recommended - 100);
    const high = recommended + 100;

    return {
      base,
      distanceFee,
      laborFee,
      stairsFee,
      carryFee,
      urgentFee,
      itemFees,
      dumpFee,
      low,
      recommended,
      high,
      estimatedMarginNote:
        recommended - dumpFee > 0
          ? `Estimated room after dump/disposal: $${recommended - dumpFee}`
          : "Dump/disposal may eat most of this quote."
    };
  }, [loadEstimate, distance, laborHours, crewSize, stairs, insideCarry, urgent, selectedItems, dumpFee]);

  const quickText = useMemo(() => {
    const name = customerName ? `${customerName}, ` : "";
    return `Hi ${name}based on the photos and details, your estimated junk removal quote is $${quote.recommended}. Expected range: $${quote.low}-$${quote.high}. Call or text 217-556-9919 to lock in scheduling.`;
  }, [customerName, quote]);

  const badge = (load) => {
    const map = {
      quarter: "1/4 Load",
      half: "1/2 Load",
      threeQuarter: "3/4 Load",
      full: "Full Load",
    };
    return map[load];
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">PickUP My Stuff</h1>
                <p className="text-green-400 font-semibold mt-1">Junk Photo Quote Builder</p>
              </div>
              <div className="text-right text-sm text-zinc-400">
                <div>Phone</div>
                <div className="text-white font-bold">217-556-9919</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-xl font-bold mb-4">1. Upload junk pile photo</h2>
            <input type="file" accept="image/*" onChange={onUpload} className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-xl file:border-0 file:bg-green-500 file:px-4 file:py-2 file:font-semibold file:text-black hover:file:bg-green-400" />
            <p className="text-sm text-zinc-400 mt-3">This prototype uses your pricing rules and field inputs to produce a fast quote. It does not automatically identify objects yet — but it is built so a vision model can be plugged in later.</p>
            {image && (
              <div className="mt-4 rounded-2xl overflow-hidden border border-zinc-800">
                <img src={image} alt="Uploaded junk pile" className="w-full object-cover max-h-[420px]" />
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
            <h2 className="text-xl font-bold">2. Job details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-sm text-zinc-300">Customer</span>
                <input value={customerName} onChange={(e)=>setCustomerName(e.target.value)} className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2" />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-zinc-300">City</span>
                <input value={city} onChange={(e)=>setCity(e.target.value)} className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2" />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-zinc-300">Load estimate</span>
                <select value={loadEstimate} onChange={(e)=>setLoadEstimate(e.target.value)} className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2">
                  <option value="quarter">1/4 Load — $250</option>
                  <option value="half">1/2 Load — $500</option>
                  <option value="threeQuarter">3/4 Load — $750</option>
                  <option value="full">Full Load — $1000</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm text-zinc-300">Round trip miles</span>
                <input type="number" value={distance} onChange={(e)=>setDistance(Number(e.target.value))} className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2" />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-zinc-300">Labor hours</span>
                <input type="number" value={laborHours} onChange={(e)=>setLaborHours(Number(e.target.value))} className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2" />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-zinc-300">Crew size</span>
                <select value={crewSize} onChange={(e)=>setCrewSize(Number(e.target.value))} className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2">
                  <option value={1}>1 person</option>
                  <option value={2}>2 people</option>
                  <option value={3}>3 people</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm text-zinc-300">Flights of stairs</span>
                <input type="number" value={stairs} onChange={(e)=>setStairs(Number(e.target.value))} className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2" />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-zinc-300">Estimated dump/disposal</span>
                <input type="number" value={dumpFee} onChange={(e)=>setDumpFee(Number(e.target.value))} className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2" />
              </label>
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={insideCarry} onChange={(e)=>setInsideCarry(e.target.checked)} /> Inside carry-out</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={urgent} onChange={(e)=>setUrgent(e.target.checked)} /> Same-day / urgent</label>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-xl font-bold mb-4">3. Item adders</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries({
                mattress: 'Mattress +$40',
                appliance: 'Appliance +$75',
                tire: 'Tire +$25',
                tv: 'TV +$35',
                paint: 'Paint/Chemical +$50',
                construction: 'Construction debris +$100',
                yardWaste: 'Yard waste +$50',
                hotTub: 'Hot tub +$400',
                piano: 'Piano +$300',
              }).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => toggleItem(key)}
                  className={`rounded-2xl border px-3 py-3 text-sm font-semibold text-left ${selectedItems.includes(key) ? 'bg-green-500 text-black border-green-400' : 'bg-zinc-950 border-zinc-800 text-zinc-200'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Extra notes about the pile, access, or special items..." className="mt-4 w-full rounded-2xl bg-zinc-950 border border-zinc-800 px-3 py-3 min-h-[100px]" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-6 shadow-2xl sticky top-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-zinc-400">Recommended quote</div>
                <div className="text-5xl font-black text-green-400 mt-2">${quote.recommended}</div>
              </div>
              <div className="rounded-2xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-right">
                <div className="text-xs text-zinc-400">Load</div>
                <div className="font-bold text-white">{badge(loadEstimate)}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-3">
                <div className="text-xs text-zinc-500">Low</div>
                <div className="text-xl font-bold">${quote.low}</div>
              </div>
              <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-3">
                <div className="text-xs text-zinc-500">Target</div>
                <div className="text-xl font-bold">${quote.recommended}</div>
              </div>
              <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-3">
                <div className="text-xs text-zinc-500">High</div>
                <div className="text-xl font-bold">${quote.high}</div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden">
              {[
                ['Base load', quote.base],
                ['Distance adder', quote.distanceFee],
                ['Labor adder', quote.laborFee],
                ['Stairs adder', quote.stairsFee],
                ['Inside carry adder', quote.carryFee],
                ['Urgent adder', quote.urgentFee],
                ['Item adders', quote.itemFees],
                ['Estimated disposal', quote.dumpFee],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 last:border-b-0">
                  <span className="text-zinc-300">{label}</span>
                  <span className="font-bold">${value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl bg-green-500/10 border border-green-500/20 p-4 text-sm text-green-300">
              {quote.estimatedMarginNote}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-xl font-bold mb-3">Customer text</h2>
            <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4 text-sm leading-6 whitespace-pre-wrap">{quickText}</div>
            <button
              onClick={() => navigator.clipboard.writeText(quickText)}
              className="mt-4 rounded-2xl bg-green-500 px-4 py-3 font-bold text-black hover:bg-green-400"
            >
              Copy Text
            </button>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-xl font-bold mb-3">How to make this smarter later</h2>
            <div className="text-sm text-zinc-300 space-y-2">
              <p>This app is ready for a future vision upgrade:</p>
              <p>• Upload photo → AI estimates volume</p>
              <p>• Detect mattresses, appliances, TVs, tires, hot tubs</p>
              <p>• Suggest 1/4, 1/2, 3/4, or full load automatically</p>
              <p>• Push approved quote into your worksheet or CRM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
