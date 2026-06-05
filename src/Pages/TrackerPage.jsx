import { useState, useMemo } from 'react';

const EMIT = {
  car:       { gasoline: 0.000404, hybrid: 0.000201, electric: 0.000100 },
  shortFlight: 0.255,
  medFlight:   0.700,
  longFlight:  1.500,
  electricity: 0.000386,  // tonnes CO₂ per kWh
  naturalGas:  0.0053,    // tonnes CO₂ per therm
  diet:      { vegan: 1.5, vegetarian: 2.5, mixed: 3.3, heavy: 4.5 },
};

// Monthly baseline electricity (kWh) and gas (therms) by home type and occupant count
// Index = occupants - 1, capped at index 4 (5+ people)
const HOME_BASE = {
  apartment: { elec: [450, 580, 680, 750, 850],   gas: [8,  12, 15, 18, 22] },
  condo:     { elec: [520, 650, 750, 830, 950],   gas: [10, 15, 18, 22, 26] },
  house:     { elec: [800, 1050, 1250, 1450, 1700], gas: [40, 55, 65, 75, 90] },
  mobile:    { elec: [600, 780,  920, 1050, 1200], gas: [30, 40, 50, 58, 68] },
};

function computeEnergyCO2(homeType, occupants, heatingFuel, hasAC) {
  const idx = Math.min(occupants - 1, 4);
  const b = HOME_BASE[homeType];

  // Base electricity with A/C uplift
  const kwhMonth = b.elec[idx] * (hasAC ? 1.12 : 1.0);
  const elecCO2  = kwhMonth * 12 * EMIT.electricity;

  // Heating source
  const baseGas = b.gas[idx];
  let heatCO2 = 0;
  if (heatingFuel === 'electric') {
    // ~40% more electricity for electric resistance or heat pump heat
    heatCO2 = b.elec[idx] * 0.40 * 12 * EMIT.electricity;
  } else if (heatingFuel === 'gas') {
    heatCO2 = baseGas * 12 * EMIT.naturalGas;
  } else if (heatingFuel === 'oil') {
    // Heating oil is ~38% more CO₂-intensive per BTU than natural gas
    heatCO2 = baseGas * 12 * EMIT.naturalGas * 1.38;
  } else if (heatingFuel === 'propane') {
    heatCO2 = baseGas * 12 * EMIT.naturalGas * 1.15;
  }
  // 'none' → heatCO2 stays 0

  return elecCO2 + heatCO2;
}

const BENCHMARKS = [
  { label: 'World Avg', value: 4.0  },
  { label: 'EU Avg',    value: 8.0  },
  { label: 'US Avg',    value: 14.5 },
];

const MAX_SCALE = 30;

function getLevel(value) {
  if (value < 8)    return { label: 'Excellent',  color: '#16a34a', ring: 'ring-green-500'  };
  if (value < 14.5) return { label: 'Average',    color: '#d97706', ring: 'ring-amber-500'  };
  if (value < 20)   return { label: 'Above Avg',  color: '#ea580c', ring: 'ring-orange-500' };
  return              { label: 'High Impact', color: '#dc2626', ring: 'ring-red-500'    };
}

function Gauge({ value }) {
  const r     = 64;
  const circ  = 2 * Math.PI * r;
  const pct   = Math.min(value / MAX_SCALE, 1);
  const offset = circ * (1 - pct);
  const level = getLevel(value);

  return (
    <svg viewBox="0 0 160 160" className="w-44 h-44 drop-shadow-sm">
      <circle cx="80" cy="80" r={r} fill="none" stroke="#f3f4f6" strokeWidth="14" />
      <circle
        cx="80" cy="80" r={r}
        fill="none"
        stroke={level.color}
        strokeWidth="14"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 80 80)"
        style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease' }}
      />
      <text x="80" y="68" textAnchor="middle" style={{ fontSize: '26px', fontWeight: 700, fill: level.color, fontFamily: 'Inter, sans-serif' }}>
        {value.toFixed(1)}
      </text>
      <text x="80" y="87" textAnchor="middle" style={{ fontSize: '11px', fill: '#9ca3af', fontFamily: 'Inter, sans-serif' }}>
        tonnes CO₂/yr
      </text>
      <text x="80" y="107" textAnchor="middle" style={{ fontSize: '11px', fontWeight: 600, fill: level.color, fontFamily: 'Inter, sans-serif' }}>
        {level.label}
      </text>
    </svg>
  );
}

function BarRow({ label, value, total, colorClass }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-stone-600">{label}</span>
        <span className="font-semibold text-stone-800">{value.toFixed(2)}t &nbsp;<span className="text-stone-400 font-normal">({pct}%)</span></span>
      </div>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function getTips(vals, results) {
  const tips = [];
  if (vals.carMiles > 8000 && vals.carType === 'gasoline') {
    tips.push({ icon: '🚗', title: 'Switch to an EV or hybrid', body: 'Switching from gasoline to an EV can save up to 2.3 tonnes CO₂/year — one of the highest-impact transport changes you can make.' });
  }
  if (vals.longFlights + vals.medFlights > 2) {
    tips.push({ icon: '✈️', title: 'Rethink your flights', body: 'One transatlantic flight emits ~1.5 tonnes CO₂. Choosing economy over business cuts that by 70%. Can any trips go by train?' });
  }
  if (vals.heatingFuel === 'oil') {
    tips.push({ icon: '🔥', title: 'Consider switching from oil heat', body: 'Heating oil produces 38% more CO₂ per BTU than natural gas. A heat pump can cut your heating emissions by 50–70% and often qualifies for tax credits.' });
  }
  if (results.energy > 5) {
    tips.push({ icon: '⚡', title: 'Switch to renewable electricity', body: 'Green energy providers often match or beat standard rates while eliminating most of your home electricity emissions.' });
  }
  if (results.energy > 3 && vals.heatingFuel !== 'oil') {
    tips.push({ icon: '🏠', title: 'Improve home insulation', body: 'A smart thermostat + proper insulation can reduce heating and cooling energy by 15–30%.' });
  }
  if (vals.diet === 'heavy') {
    tips.push({ icon: '🥗', title: 'Try Meatless Mondays', body: 'Beef produces 20× more CO₂ per gram of protein than beans. Cutting it once a week saves ~150 kg CO₂/year.' });
  }
  if (vals.diet === 'mixed') {
    tips.push({ icon: '🌿', title: 'Shift toward plant-based meals', body: 'Replacing beef and dairy with plant protein just 2–3 days/week reduces your food footprint by up to 30%.' });
  }
  tips.push({ icon: '♻️', title: 'Reduce consumption & waste', body: 'Consumer goods and food waste account for ~10% of personal emissions. Buying second-hand and planning meals are easy wins.' });
  return tips.slice(0, 4);
}

const SECTION_HEADER = 'flex items-center gap-3 mb-5';
const SECTION_TITLE  = 'font-serif text-lg font-bold text-stone-800';
const LABEL          = 'block text-sm font-medium text-stone-700 mb-1.5';
const INPUT          = 'w-full px-4 py-2.5 border border-stone-200 rounded-xl bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm transition-all';
const selectAll      = (e) => e.target.select();
const SELECT         = INPUT;

// Pill button used for occupant count and quick toggles
function PillGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
            value === opt.value
              ? 'bg-green-700 text-white border-green-700 shadow-sm'
              : 'bg-white text-stone-600 border-stone-200 hover:border-green-400 hover:text-green-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// Large icon radio card
function IconCard({ icon, label, sub, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
        selected
          ? 'border-green-500 bg-green-50 shadow-sm'
          : 'border-stone-100 bg-stone-50 hover:border-stone-300'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className={`text-sm font-semibold ${selected ? 'text-green-800' : 'text-stone-700'}`}>{label}</span>
      {sub && <span className="text-xs text-stone-400">{sub}</span>}
    </button>
  );
}

export default function TrackerPage() {
  const [vals, setVals] = useState({
    // Transport
    carType:      'gasoline',
    carMiles:     12000,
    shortFlights: 0,
    medFlights:   0,
    longFlights:  0,
    // Home energy (approachable questions)
    homeType:     'apartment',
    occupants:    2,
    heatingFuel:  'gas',
    hasAC:        false,
    // Diet
    diet: 'mixed',
  });

  const set = (key) => (val) =>
    setVals((v) => ({ ...v, [key]: val }));
  const setE = (key) => (e) =>
    setVals((v) => ({ ...v, [key]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }));

  const results = useMemo(() => {
    const transport =
      vals.carMiles * EMIT.car[vals.carType] +
      vals.shortFlights * EMIT.shortFlight +
      vals.medFlights   * EMIT.medFlight +
      vals.longFlights  * EMIT.longFlight;
    const energy = computeEnergyCO2(vals.homeType, vals.occupants, vals.heatingFuel, vals.hasAC);
    const diet   = EMIT.diet[vals.diet];
    const total  = transport + energy + diet;
    return { transport, energy, diet, total };
  }, [vals]);

  const level = getLevel(results.total);
  const tips  = getTips(vals, results);

  return (
    <div className="page-wrapper bg-stone-50">
      <div className="section-container py-12">
        <div className="mb-10">
          <span className="section-label">Environmental Tool</span>
          <h1 className="font-serif text-4xl font-bold text-stone-900 mt-2">CO₂ Footprint Calculator</h1>
          <p className="text-stone-500 mt-2 max-w-xl">
            Estimate your personal carbon emissions. Results update in real time.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* ── Form ── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Transport */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
              <div className={SECTION_HEADER}>
                <span className="text-2xl">🚗</span>
                <h2 className={SECTION_TITLE}>Transportation</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Car type</label>
                  <select className={SELECT} value={vals.carType} onChange={setE('carType')}>
                    <option value="gasoline">Gasoline</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="electric">Electric (grid avg)</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Miles driven per year</label>
                  <input type="number" className={INPUT} min="0" step="500" value={vals.carMiles} onChange={setE('carMiles')} onFocus={selectAll} />
                </div>
              </div>

              <div className="mt-5">
                <p className={LABEL}>Flights per year</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { key: 'shortFlights', label: 'Short (<3 hrs)',    eg: '~0.26t each' },
                    { key: 'medFlights',   label: 'Medium (3–6 hrs)',  eg: '~0.7t each'  },
                    { key: 'longFlights',  label: 'Long (>6 hrs)',     eg: '~1.5t each'  },
                  ].map(({ key, label, eg }) => (
                    <div key={key}>
                      <label className="block text-xs text-stone-600 mb-1">{label}</label>
                      <input type="number" className={INPUT} min="0" max="50" value={vals[key]} onChange={setE(key)} onFocus={selectAll} />
                      <p className="text-xs text-stone-400 mt-1">{eg}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Home Energy — approachable questions */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
              <div className={SECTION_HEADER}>
                <span className="text-2xl">🏠</span>
                <h2 className={SECTION_TITLE}>Home Energy</h2>
              </div>

              {/* Home type */}
              <div className="mb-5">
                <p className={LABEL}>What type of home do you live in?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { value: 'apartment', icon: '🏢', label: 'Apartment' },
                    { value: 'condo',     icon: '🏘️', label: 'Condo / Townhouse' },
                    { value: 'house',     icon: '🏠', label: 'Single-family house' },
                    { value: 'mobile',    icon: '🚐', label: 'Mobile home' },
                  ].map((opt) => (
                    <IconCard
                      key={opt.value}
                      icon={opt.icon}
                      label={opt.label}
                      selected={vals.homeType === opt.value}
                      onClick={() => set('homeType')(opt.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Occupants */}
              <div className="mb-5">
                <p className={LABEL}>How many people live in your home?</p>
                <PillGroup
                  value={vals.occupants}
                  onChange={set('occupants')}
                  options={[
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                    { value: 3, label: '3' },
                    { value: 4, label: '4' },
                    { value: 5, label: '5+' },
                  ]}
                />
              </div>

              {/* Heating fuel */}
              <div className="mb-5">
                <p className={LABEL}>What heats your home?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { value: 'electric',  icon: '⚡', label: 'Electric',         sub: 'Baseboard / heat pump' },
                    { value: 'gas',       icon: '🔥', label: 'Natural gas',       sub: 'Furnace / boiler'      },
                    { value: 'oil',       icon: '🛢️', label: 'Oil or propane',   sub: 'Fuel delivery'         },
                    { value: 'none',      icon: '🌡️', label: 'None / Other',      sub: 'Mild climate'          },
                  ].map((opt) => (
                    <IconCard
                      key={opt.value}
                      icon={opt.icon}
                      label={opt.label}
                      sub={opt.sub}
                      selected={vals.heatingFuel === opt.value}
                      onClick={() => set('heatingFuel')(opt.value)}
                    />
                  ))}
                </div>
              </div>

              {/* A/C */}
              <div>
                <p className={LABEL}>Do you have central air conditioning?</p>
                <PillGroup
                  value={vals.hasAC}
                  onChange={set('hasAC')}
                  options={[
                    { value: false, label: 'No A/C' },
                    { value: true,  label: 'Yes, I have A/C' },
                  ]}
                />
              </div>
            </div>

            {/* Diet */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
              <div className={SECTION_HEADER}>
                <span className="text-2xl">🥦</span>
                <h2 className={SECTION_TITLE}>Diet</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { value: 'vegan',       label: 'Vegan',          sub: '~1.5 tonnes/yr', color: 'border-green-400 bg-green-50'  },
                  { value: 'vegetarian',  label: 'Vegetarian',     sub: '~2.5 tonnes/yr', color: 'border-lime-400 bg-lime-50'    },
                  { value: 'mixed',       label: 'Mixed / Average',sub: '~3.3 tonnes/yr', color: 'border-amber-400 bg-amber-50'  },
                  { value: 'heavy',       label: 'Meat-heavy',     sub: '~4.5 tonnes/yr', color: 'border-orange-400 bg-orange-50'},
                ].map(({ value, label, sub, color }) => (
                  <label
                    key={value}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      vals.diet === value ? color : 'border-stone-100 bg-stone-50 hover:border-stone-200'
                    }`}
                  >
                    <input type="radio" name="diet" value={value} checked={vals.diet === value} onChange={setE('diet')} className="mt-0.5 accent-green-600" />
                    <div>
                      <div className="font-medium text-stone-800 text-sm">{label}</div>
                      <div className="text-xs text-stone-500 mt-0.5">{sub}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── Results ── */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-5">
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                <h2 className="font-serif text-lg font-bold text-stone-800 mb-6">Your Footprint</h2>

                <div className="flex justify-center mb-6">
                  <Gauge value={results.total} />
                </div>

                <div className="space-y-4 mb-6">
                  <BarRow label="🚗 Transport"   value={results.transport} total={results.total} colorClass="bg-blue-400"   />
                  <BarRow label="⚡ Home Energy" value={results.energy}    total={results.total} colorClass="bg-amber-400"  />
                  <BarRow label="🥦 Diet"         value={results.diet}      total={results.total} colorClass="bg-green-500" />
                </div>

                <div className="border-t border-stone-100 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">How You Compare</p>
                  <div className="space-y-3">
                    {[...BENCHMARKS, { label: 'You', value: results.total }].map(({ label, value }) => (
                      <div key={label} className="flex items-center gap-3 text-sm">
                        <span className="w-20 text-stone-500 shrink-0">{label}</span>
                        <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              label === 'You'       ? 'bg-green-600' :
                              label === 'World Avg' ? 'bg-green-400' :
                              label === 'EU Avg'    ? 'bg-amber-400' : 'bg-orange-400'
                            }`}
                            style={{ width: `${Math.min((value / MAX_SCALE) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="w-12 text-right text-stone-600 font-medium shrink-0">{value.toFixed(1)}t</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-green-50 rounded-2xl border border-green-100 p-6">
                <h3 className="font-serif text-base font-bold text-green-900 mb-4">💡 How to Reduce</h3>
                <div className="space-y-4">
                  {tips.map((tip, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-lg shrink-0">{tip.icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-green-900">{tip.title}</div>
                        <p className="text-xs text-green-800/70 mt-0.5 leading-relaxed">{tip.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-stone-400 text-center mt-10">
          Emission factors from EPA, IPCC, and Our World in Data. Energy estimates based on US EIA household survey data. Results are estimates for educational purposes.
        </p>
      </div>
    </div>
  );
}
