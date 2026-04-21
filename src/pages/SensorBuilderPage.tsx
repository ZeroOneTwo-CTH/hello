import { useState, useCallback, useMemo } from 'react';
import {
  Circle, Lightbulb, Sun, Settings, Bell, Thermometer, Power, Activity,
  Link2, Star, CheckCircle2, CloudUpload, ArrowRight, Plus, X, AlertTriangle,
  FileText, Zap
} from 'lucide-react';

// ── Types ──
interface TriggerDef {
  id: string;
  label: string;
  hasValue?: boolean;
  hasTwoValues?: boolean;
  unit?: string;
  placeholder?: string;
  placeholder2?: string;
  hint?: string;
  inputType?: 'text' | 'number';
}

interface ActionDef {
  id: string;
  label: string;
  hasValue?: boolean;
  unit?: string;
  placeholder?: string;
  hint?: string;
  inputType?: 'text' | 'number';
}

interface SensorDef {
  id: string;
  name: string;
  type: string;
  icon: React.ElementType;
  desc: string;
  tags: string[];
  pinType: 'digital' | 'analog' | 'none';
  triggers: TriggerDef[];
  actions: ActionDef[];
}

interface RuleState {
  id: number;
  triggerId: string;
  triggerValue: string;
  triggerValue2: string;
  actionId: string;
  actionValue: string;
  modifierId: string;
  modifierValue: string;
}

interface TimingOption {
  id: string;
  label: string;
  hasValue?: boolean;
  unit?: string;
  placeholder?: string;
  hint?: string;
}

// ── Data ──
const SENSORS: SensorDef[] = [
  {
    id: 'button', name: 'Grove Button', type: 'Digital Input',
    icon: Circle, desc: 'Momentary push button. Detects press, release, hold, and double-press events.',
    tags: ['DIGITAL', 'INPUT'], pinType: 'digital',
    triggers: [
      { id: 'button_pressed', label: 'Is Pressed' },
      { id: 'button_released', label: 'Is Released' },
      { id: 'button_held', label: 'Is Held For', hasValue: true, unit: 'ms', placeholder: '1000', hint: 'Triggers after holding for this duration' },
      { id: 'button_double', label: 'Double Pressed', hint: 'Two presses within 400ms' },
    ],
    actions: []
  },
  {
    id: 'led', name: 'Grove LED', type: 'Digital / PWM Output',
    icon: Lightbulb, desc: 'LED module with on/off, toggle, brightness control, and blink patterns.',
    tags: ['DIGITAL', 'PWM', 'OUTPUT'], pinType: 'digital',
    triggers: [],
    actions: [
      { id: 'led_on', label: 'Turn On' },
      { id: 'led_off', label: 'Turn Off' },
      { id: 'led_toggle', label: 'Toggle' },
      { id: 'led_brightness', label: 'Set Brightness', hasValue: true, unit: '%', placeholder: '75', hint: '0 to 100 percent' },
      { id: 'led_blink', label: 'Blink', hasValue: true, unit: 'ms', placeholder: '500', hint: 'Blink interval in milliseconds' },
      { id: 'led_pulse', label: 'Fade Pulse', hint: 'Smooth breathing effect' },
    ]
  },
  {
    id: 'ldr', name: 'Grove Light Sensor', type: 'Analog Input',
    icon: Sun, desc: 'Light-dependent resistor. Reads ambient light from 0 to 4095.',
    tags: ['ANALOG', 'INPUT'], pinType: 'analog',
    triggers: [
      { id: 'ldr_above', label: 'Level Above', hasValue: true, placeholder: '2000' },
      { id: 'ldr_below', label: 'Level Below', hasValue: true, placeholder: '1000' },
      { id: 'ldr_between', label: 'Level Between', hasValue: true, hasTwoValues: true, placeholder: '800', placeholder2: '2000', hint: 'Low and high range' },
      { id: 'ldr_change', label: 'Changes By More Than', hasValue: true, placeholder: '200', hint: 'Sudden change in reading' },
    ],
    actions: []
  },
  {
    id: 'servo', name: 'Grove Servo', type: 'PWM Output',
    icon: Settings, desc: 'Servo motor. Set angle, sweep, or move at a controlled speed.',
    tags: ['PWM', 'OUTPUT'], pinType: 'digital',
    triggers: [],
    actions: [
      { id: 'servo_move', label: 'Move to Angle', hasValue: true, unit: 'deg', placeholder: '90', hint: '0 to 180 degrees' },
      { id: 'servo_sweep', label: 'Sweep (0 to 180 to 0)' },
      { id: 'servo_move_slow', label: 'Move Slowly to Angle', hasValue: true, unit: 'deg', placeholder: '90', hint: 'Gradual movement' },
      { id: 'servo_centre', label: 'Return to Centre (90)' },
      { id: 'servo_increment', label: 'Increment By', hasValue: true, unit: 'deg', placeholder: '10' },
      { id: 'servo_decrement', label: 'Decrement By', hasValue: true, unit: 'deg', placeholder: '10' },
    ]
  },
  {
    id: 'buzzer', name: 'Grove Buzzer', type: 'Digital / PWM Output',
    icon: Bell, desc: 'Piezo buzzer. Tones, beeps, patterns, and melodies.',
    tags: ['DIGITAL', 'PWM', 'OUTPUT'], pinType: 'digital',
    triggers: [],
    actions: [
      { id: 'buzzer_on', label: 'Turn On' },
      { id: 'buzzer_off', label: 'Turn Off' },
      { id: 'buzzer_beep', label: 'Short Beep' },
      { id: 'buzzer_tone', label: 'Play Tone', hasValue: true, unit: 'Hz', placeholder: '1000' },
      { id: 'buzzer_beep_pattern', label: 'Beep Pattern', hasValue: true, unit: 'x', placeholder: '3', hint: 'Number of beeps' },
      { id: 'buzzer_siren', label: 'Siren Effect', hint: 'Rising and falling tone' },
      { id: 'buzzer_melody', label: 'Play Startup Melody' },
    ]
  },
  {
    id: 'temp', name: 'Grove Temperature', type: 'Analog Input',
    icon: Thermometer, desc: 'NTC thermistor. Reads temperature in degrees Celsius.',
    tags: ['ANALOG', 'INPUT'], pinType: 'analog',
    triggers: [
      { id: 'temp_above', label: 'Above', hasValue: true, unit: 'C', placeholder: '25' },
      { id: 'temp_below', label: 'Below', hasValue: true, unit: 'C', placeholder: '18' },
      { id: 'temp_between', label: 'Between', hasValue: true, hasTwoValues: true, unit: 'C', placeholder: '18', placeholder2: '25', hint: 'Comfortable range' },
      { id: 'temp_change', label: 'Changes By More Than', hasValue: true, unit: 'C', placeholder: '2', hint: 'Sudden temperature shift' },
    ],
    actions: []
  },
  {
    id: 'relay', name: 'Grove Relay', type: 'Digital Output',
    icon: Power, desc: 'Mechanical relay. Switches external circuits with optional timed pulse.',
    tags: ['DIGITAL', 'OUTPUT', 'HIGH CURRENT'], pinType: 'digital',
    triggers: [],
    actions: [
      { id: 'relay_on', label: 'Turn On' },
      { id: 'relay_off', label: 'Turn Off' },
      { id: 'relay_toggle', label: 'Toggle' },
      { id: 'relay_pulse', label: 'Pulse On For', hasValue: true, unit: 'ms', placeholder: '2000', hint: 'Turn on then auto off' },
    ]
  },
  {
    id: 'serial', name: 'Serial Communication', type: 'Input / Output',
    icon: Activity, desc: 'USB serial. Receive commands, print readings, or log sensor data.',
    tags: ['SERIAL', 'INPUT', 'OUTPUT', 'USB'], pinType: 'none',
    triggers: [
      { id: 'serial_receive', label: 'Receives Matching Text', hasValue: true, placeholder: 'ON', inputType: 'text', hint: 'Exact text match' },
      { id: 'serial_receive_any', label: 'Receives Any Data' },
      { id: 'serial_receive_number', label: 'Receives Number Above', hasValue: true, placeholder: '50', hint: 'Parses incoming number' },
    ],
    actions: [
      { id: 'serial_print', label: 'Print Text', hasValue: true, placeholder: 'Hello', inputType: 'text' },
      { id: 'serial_println', label: 'Print Line', hasValue: true, placeholder: 'Status: OK', inputType: 'text' },
      { id: 'serial_print_sensor', label: 'Print Sensor Reading', hint: 'Outputs trigger sensor value' },
      { id: 'serial_print_all', label: 'Print All Readings', hint: 'All connected sensor values' },
      { id: 'serial_print_json', label: 'Print as JSON', hint: 'Sensor data in JSON format' },
    ]
  }
];

const TIMING_OPTIONS: TimingOption[] = [
  { id: 'none', label: 'No modifier' },
  { id: 'delay', label: 'After delay', hasValue: true, unit: 'ms', placeholder: '500' },
  { id: 'for_duration', label: 'For duration', hasValue: true, unit: 'ms', placeholder: '2000', hint: 'Action runs then stops' },
  { id: 'repeat', label: 'Repeat every', hasValue: true, unit: 'ms', placeholder: '1000', hint: 'While trigger is true' },
  { id: 'once', label: 'Only once', hint: 'Fires once until trigger resets' },
  { id: 'cooldown', label: 'Cooldown', hasValue: true, unit: 'ms', placeholder: '3000', hint: 'Minimum time between triggers' },
];

const PINS = {
  digital: [
    { id: 'D0', label: 'D0 (GPIO1)' }, { id: 'D1', label: 'D1 (GPIO2)' },
    { id: 'D2', label: 'D2 (GPIO3)' }, { id: 'D3', label: 'D3 (GPIO4)' },
    { id: 'D6', label: 'D6 (GPIO43)' }, { id: 'D7', label: 'D7 (GPIO44)' },
  ],
  analog: [
    { id: 'A0', label: 'A0 (GPIO1)' }, { id: 'A1', label: 'A1 (GPIO2)' },
  ],
  none: [
    { id: 'USB', label: 'USB Serial (115200 baud)' },
  ],
};

// ── Component ──
export default function SensorBuilderPage() {
  const [step, setStep] = useState(1);
  const [selectedSensors, setSelectedSensors] = useState<Record<string, { pin: string }>>({});
  const [rules, setRules] = useState<RuleState[]>([]);
  const [ruleCounter, setRuleCounter] = useState(0);
  const [uploadState, setUploadState] = useState<'ready' | 'connecting' | 'done' | 'sent' | 'error'>('ready');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<{ msg: string; type: string }[]>([]);

  const allTriggers = useMemo(() => {
    const out: (TriggerDef & { sensorId: string; sensorName: string })[] = [];
    Object.keys(selectedSensors).forEach(sid => {
      const s = SENSORS.find(x => x.id === sid);
      s?.triggers.forEach(t => out.push({ ...t, sensorId: sid, sensorName: s.name }));
    });
    return out;
  }, [selectedSensors]);

  const allActions = useMemo(() => {
    const out: (ActionDef & { sensorId: string; sensorName: string })[] = [];
    Object.keys(selectedSensors).forEach(sid => {
      const s = SENSORS.find(x => x.id === sid);
      s?.actions.forEach(a => out.push({ ...a, sensorId: sid, sensorName: s.name }));
    });
    return out;
  }, [selectedSensors]);

  const webSerialSupported = typeof navigator !== 'undefined' && 'serial' in navigator;

  // ── Handlers ──
  const toggleSensor = useCallback((id: string) => {
    setSelectedSensors(prev => {
      const next = { ...prev };
      if (id in next) {
        delete next[id];
        setRules(r => r.filter(rule => {
          const t = SENSORS.flatMap(s => s.triggers.map(tr => ({ ...tr, sensorId: s.id }))).find(x => x.id === rule.triggerId);
          const a = SENSORS.flatMap(s => s.actions.map(ac => ({ ...ac, sensorId: s.id }))).find(x => x.id === rule.actionId);
          return !(t?.sensorId === id) && !(a?.sensorId === id);
        }));
      } else {
        const sensor = SENSORS.find(s => s.id === id)!;
        const pins = PINS[sensor.pinType];
        next[id] = { pin: pins[0]?.id || 'D0' };
      }
      return next;
    });
  }, []);

  const setPin = useCallback((sensorId: string, pin: string) => {
    setSelectedSensors(prev => ({ ...prev, [sensorId]: { ...prev[sensorId], pin } }));
  }, []);

  const addRule = useCallback(() => {
    if (!allTriggers.length || !allActions.length) return;
    const newId = ruleCounter + 1;
    setRuleCounter(newId);
    setRules(prev => [...prev, {
      id: newId, triggerId: allTriggers[0].id, triggerValue: '', triggerValue2: '',
      actionId: allActions[0].id, actionValue: '', modifierId: 'none', modifierValue: ''
    }]);
  }, [allTriggers, allActions, ruleCounter]);

  const removeRule = useCallback((id: number) => {
    setRules(prev => prev.filter(r => r.id !== id));
  }, []);

  const updateRule = useCallback((id: number, field: keyof RuleState, value: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  }, []);

  const generateConfig = useCallback(() => {
    const config: Record<string, unknown> = { board: 'xiao_esp32s3', sensors: {} as Record<string, unknown>, rules: [] as unknown[] };
    const sensors = config.sensors as Record<string, unknown>;
    for (const [sid, data] of Object.entries(selectedSensors)) {
      const s = SENSORS.find(x => x.id === sid)!;
      sensors[sid] = { type: s.type.toLowerCase().replace(/[\s/]+/g, '_'), pin: data.pin };
    }
    const rulesList = config.rules as Record<string, unknown>[];
    rules.forEach(rule => {
      const t = allTriggers.find(x => x.id === rule.triggerId);
      const a = allActions.find(x => x.id === rule.actionId);
      if (!t || !a) return;
      const obj: Record<string, unknown> = {
        when: { sensor: t.sensorId, condition: rule.triggerId, ...(rule.triggerValue ? { value: t.inputType === 'text' ? rule.triggerValue : Number(rule.triggerValue) } : {}), ...(rule.triggerValue2 ? { value2: Number(rule.triggerValue2) } : {}) },
        then: { sensor: a.sensorId, action: rule.actionId, ...(rule.actionValue ? { value: a.inputType === 'text' ? rule.actionValue : Number(rule.actionValue) } : {}) },
      };
      if (rule.modifierId !== 'none') {
        obj.modifier = { type: rule.modifierId, ...(rule.modifierValue ? { value: Number(rule.modifierValue) } : {}) };
      }
      rulesList.push(obj);
    });
    return config;
  }, [selectedSensors, rules, allTriggers, allActions]);

  const goToStep = (s: number) => {
    if (s === 2 && !Object.keys(selectedSensors).length) return;
    if (s === 3 && !rules.length) return;
    setStep(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addLog = (msg: string, type: string) => {
    setLogs(prev => [...prev, { msg, type }]);
  };

  const startUpload = async () => {
    if (!webSerialSupported) { addLog('Web Serial not available.', 'error'); return; }
    setLogs([]); setUploadState('connecting'); setProgress(0);
    try {
      addLog('Requesting serial port...', 'info');
      const port = await (navigator as any).serial.requestPort();
      addLog('Opening at 115200 baud...', 'info');
      await port.open({ baudRate: 115200 }); setProgress(20);
      addLog('Connected.', 'success'); setProgress(40);
      const enc = new TextEncoder();
      const w = port.writable.getWriter();
      addLog('Sending configuration...', 'info'); setProgress(60);
      await w.write(enc.encode('>>>CONFIG_START<<<\n'));
      await w.write(enc.encode(JSON.stringify(generateConfig()) + '\n'));
      await w.write(enc.encode('>>>CONFIG_END<<<\n'));
      setProgress(80); addLog('Waiting for acknowledgement...', 'info');
      const r = port.readable.getReader();
      const dec = new TextDecoder();
      let resp = '';
      const to = setTimeout(() => { try { r.releaseLock(); } catch {} }, 5000);
      try {
        while (true) {
          const { value, done } = await r.read();
          if (done) break;
          resp += dec.decode(value);
          if (resp.includes('CONFIG_OK') || resp.includes('ERROR')) break;
        }
      } catch {}
      clearTimeout(to);
      if (resp.includes('CONFIG_OK')) {
        setProgress(100); addLog('Applied successfully.', 'success'); setUploadState('done');
      } else if (resp.includes('ERROR')) {
        addLog('Error: ' + resp, 'error'); setUploadState('error');
      } else {
        setProgress(100); addLog('Sent. Ensure interpreter firmware is installed.', 'info'); setUploadState('sent');
      }
      r.releaseLock(); w.releaseLock(); await port.close();
    } catch (err: any) {
      addLog(err.name === 'NotFoundError' ? 'No port selected.' : 'Error: ' + err.message, 'error');
      setUploadState('error'); setProgress(0);
    }
  };

  const copyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(generateConfig(), null, 2));
  };

  const hasSensors = Object.keys(selectedSensors).length > 0;
  const hasRules = rules.length > 0;

  // ── Render helpers ──
  const renderSensorGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
      {SENSORS.map(s => {
        const selected = s.id in selectedSensors;
        const pins = PINS[s.pinType];
        const curPin = selected ? selectedSensors[s.id].pin : pins[0]?.id;
        const Icon = s.icon;
        return (
          <div
            key={s.id}
            onClick={() => toggleSensor(s.id)}
            className={`relative p-6 rounded-xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
              selected
                ? 'border-accent bg-accent/10'
                : 'border-[#2a2a2a] bg-[#1e1e1e] hover:bg-[#252525] hover:border-[#333]'
            }`}
          >
            {selected && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
            )}
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${selected ? 'bg-accent/20' : 'bg-[#2a2a2a]'}`}>
              <Icon className={`w-5 h-5 ${selected ? 'text-accent' : 'text-[#999]'}`} />
            </div>
            <h3 className="font-display text-base mb-0.5">{s.name}</h3>
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#666] mb-3">{s.type}</p>
            <p className="text-sm text-[#999] leading-relaxed mb-3">{s.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {s.tags.map(t => (
                <span key={t} className={`font-mono text-[10px] uppercase tracking-[0.06em] px-2.5 py-1 rounded border ${
                  selected ? 'bg-accent/5 border-accent/25 text-accent/70' : 'bg-[#141414] border-[#2a2a2a] text-[#666]'
                }`}>{t}</span>
              ))}
            </div>
            {selected && (
              <div className="mt-3" onClick={e => e.stopPropagation()}>
                <label className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#666] block mb-1.5">
                  {s.pinType === 'none' ? 'Connection' : 'Grove Port / Pin'}
                </label>
                <select
                  value={curPin}
                  onChange={e => setPin(s.id, e.target.value)}
                  className="w-full bg-[#141414] text-[#f0f0f0] border border-[#2a2a2a] rounded-md px-3 py-2 font-mono text-xs focus:border-accent focus:outline-none"
                >
                  {pins.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderRules = () => {
    if (!allTriggers.length || !allActions.length) {
      return (
        <div className="text-center py-16 text-[#666]">
          <Link2 className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-sm max-w-xs mx-auto">You need at least one input sensor and one output sensor selected to create rules.</p>
        </div>
      );
    }
    if (!rules.length) {
      return (
        <div className="text-center py-16 text-[#666]">
          <Star className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-sm max-w-xs mx-auto">No rules yet. Click "Add a Rule" below to define how your sensors interact.</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-5 mb-6">
        {rules.map(rule => {
          const ct = allTriggers.find(t => t.id === rule.triggerId) || allTriggers[0];
          const ca = allActions.find(a => a.id === rule.actionId) || allActions[0];
          const cm = TIMING_OPTIONS.find(m => m.id === rule.modifierId) || TIMING_OPTIONS[0];
          return (
            <div key={rule.id} className="relative bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl overflow-hidden">
              <button onClick={() => removeRule(rule.id)} className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#666] hover:text-accent hover:border-accent hover:bg-accent/10 transition-colors">
                <X className="w-4 h-4" />
              </button>

              {/* Two-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* WHEN */}
                <div className="p-6 md:border-r border-b md:border-b-0 border-[#2a2a2a]">
                  <span className="inline-block font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-accent bg-accent/15 px-3 py-1 rounded mb-4">When</span>
                  <div className="mb-3.5">
                    <label className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#666] block mb-1.5">Trigger</label>
                    <select value={rule.triggerId} onChange={e => updateRule(rule.id, 'triggerId', e.target.value)} className="w-full bg-[#141414] text-[#f0f0f0] border border-[#2a2a2a] rounded-md px-3 py-2.5 font-mono text-[13px] focus:border-accent focus:outline-none">
                      {allTriggers.map(t => <option key={t.id} value={t.id}>{t.sensorName}: {t.label}</option>)}
                    </select>
                  </div>
                  {ct?.hasValue && (
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#666] block mb-1.5">Value</label>
                      <div className="flex items-center gap-2">
                        <input type={ct.inputType === 'text' ? 'text' : 'number'} placeholder={ct.placeholder} value={rule.triggerValue} onChange={e => updateRule(rule.id, 'triggerValue', e.target.value)} className="flex-1 bg-[#141414] text-[#f0f0f0] border border-[#2a2a2a] rounded-md px-3 py-2.5 font-mono text-[13px] focus:border-accent focus:outline-none" />
                        {ct.hasTwoValues && (<><span className="font-mono text-xs text-[#666]">to</span><input type="number" placeholder={ct.placeholder2} value={rule.triggerValue2} onChange={e => updateRule(rule.id, 'triggerValue2', e.target.value)} className="flex-1 bg-[#141414] text-[#f0f0f0] border border-[#2a2a2a] rounded-md px-3 py-2.5 font-mono text-[13px] focus:border-accent focus:outline-none" /></>)}
                        {ct.unit && <span className="font-mono text-xs text-[#666]">{ct.unit}</span>}
                      </div>
                      {ct.hint && <p className="text-xs text-[#666] mt-1">{ct.hint}</p>}
                    </div>
                  )}
                  {!ct?.hasValue && ct?.hint && <p className="text-xs text-[#666]">{ct.hint}</p>}
                </div>

                {/* Arrow (desktop only) */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#141414] border border-[#2a2a2a] items-center justify-center z-10 pointer-events-none">
                  <ArrowRight className="w-4 h-4 text-[#666]" />
                </div>

                {/* THEN */}
                <div className="p-6">
                  <span className="inline-block font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4ade80] bg-[#4ade80]/15 px-3 py-1 rounded mb-4">Then</span>
                  <div className="mb-3.5">
                    <label className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#666] block mb-1.5">Action</label>
                    <select value={rule.actionId} onChange={e => updateRule(rule.id, 'actionId', e.target.value)} className="w-full bg-[#141414] text-[#f0f0f0] border border-[#2a2a2a] rounded-md px-3 py-2.5 font-mono text-[13px] focus:border-accent focus:outline-none">
                      {allActions.map(a => <option key={a.id} value={a.id}>{a.sensorName}: {a.label}</option>)}
                    </select>
                  </div>
                  {ca?.hasValue && (
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#666] block mb-1.5">Value</label>
                      <div className="flex items-center gap-2">
                        <input type={ca.inputType === 'text' ? 'text' : 'number'} placeholder={ca.placeholder} value={rule.actionValue} onChange={e => updateRule(rule.id, 'actionValue', e.target.value)} className="flex-1 bg-[#141414] text-[#f0f0f0] border border-[#2a2a2a] rounded-md px-3 py-2.5 font-mono text-[13px] focus:border-accent focus:outline-none" />
                        {ca.unit && <span className="font-mono text-xs text-[#666]">{ca.unit}</span>}
                      </div>
                      {ca.hint && <p className="text-xs text-[#666] mt-1">{ca.hint}</p>}
                    </div>
                  )}
                  {!ca?.hasValue && ca?.hint && <p className="text-xs text-[#666]">{ca.hint}</p>}
                </div>
              </div>

              {/* Timing modifier */}
              <div className="bg-[#141414] border-t border-[#2a2a2a] px-6 py-3.5 flex items-center gap-4 flex-wrap">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#60a5fa] bg-[#60a5fa]/15 px-2.5 py-1 rounded flex-shrink-0">Timing</span>
                <select value={rule.modifierId} onChange={e => updateRule(rule.id, 'modifierId', e.target.value)} className="bg-[#1e1e1e] text-[#f0f0f0] border border-[#2a2a2a] rounded-md px-3 py-1.5 font-mono text-xs focus:border-[#60a5fa] focus:outline-none min-w-[140px]">
                  {TIMING_OPTIONS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
                {cm?.hasValue && (
                  <>
                    <input type="number" placeholder={cm.placeholder} value={rule.modifierValue} onChange={e => updateRule(rule.id, 'modifierValue', e.target.value)} className="w-20 bg-[#1e1e1e] text-[#f0f0f0] border border-[#2a2a2a] rounded-md px-3 py-1.5 font-mono text-xs focus:border-[#60a5fa] focus:outline-none" />
                    <span className="font-mono text-[11px] text-[#666]">{cm.unit}</span>
                  </>
                )}
                {cm?.hint && <span className="font-mono text-[11px] text-[#666]">{cm.hint}</span>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-[1320px] mx-auto">
      {/* Hero */}
      <div className="mb-12">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-accent mb-4">No-Code Workshop</p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-5">Grove Sensor Builder</h1>
        <p className="text-base text-[#999] max-w-xl leading-relaxed">
          Select your Grove sensors, define how they interact, and upload directly to your XIAO ESP32S3 — no coding required.
        </p>
      </div>

      {/* Steps */}
      <div className="flex gap-2 mb-10 flex-wrap">
        {[{ n: 1, label: 'Select Sensors' }, { n: 2, label: 'Define Rules' }, { n: 3, label: 'Review & Upload' }].map(s => (
          <button
            key={s.n}
            onClick={() => goToStep(s.n)}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full font-mono text-xs font-medium uppercase tracking-[0.04em] border transition-all ${
              step === s.n
                ? 'border-accent text-[#f0f0f0] bg-accent/15'
                : s.n < step
                ? 'border-[#4ade80] text-[#4ade80] bg-[#4ade80]/10'
                : 'border-[#2a2a2a] text-[#666]'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold ${
              step === s.n ? 'bg-accent text-white' : s.n < step ? 'bg-[#4ade80] text-white' : 'bg-[#2a2a2a]'
            }`}>{s.n}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Step 1 ── */}
      {step === 1 && (
        <>
          <div className="flex gap-3.5 items-start bg-[#60a5fa]/10 border border-[#60a5fa]/20 rounded-lg p-5 mb-8">
            <FileText className="w-5 h-5 text-[#60a5fa] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#999] leading-relaxed"><strong className="text-[#f0f0f0]">Hardware required:</strong> XIAO ESP32S3 + Seeed Studio Grove Base for XIAO. Select the Grove modules you have connected.</p>
          </div>
          {renderSensorGrid()}
          <div className="flex justify-end">
            <button disabled={!hasSensors} onClick={() => goToStep(2)} className="btn-coral disabled:opacity-40 disabled:cursor-not-allowed">Continue to Rules</button>
          </div>
        </>
      )}

      {/* ── Step 2 ── */}
      {step === 2 && (
        <>
          <div className="flex gap-3.5 items-start bg-[#60a5fa]/10 border border-[#60a5fa]/20 rounded-lg p-5 mb-8">
            <Zap className="w-5 h-5 text-[#60a5fa] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#999] leading-relaxed"><strong className="text-[#f0f0f0]">Build your logic:</strong> Each rule has a trigger on the left and an action on the right, with optional timing at the bottom.</p>
          </div>
          {renderRules()}
          {(allTriggers.length > 0 && allActions.length > 0) && (
            <button onClick={addRule} className="w-full py-4 border border-dashed border-[#2a2a2a] rounded-lg font-mono text-xs uppercase tracking-[0.06em] text-[#666] hover:border-accent hover:text-accent hover:bg-accent/10 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add a Rule
            </button>
          )}
          <div className="flex justify-between mt-8 flex-wrap gap-3">
            <button onClick={() => goToStep(1)} className="font-mono text-xs uppercase tracking-[0.06em] px-6 py-3 rounded-md border border-[#2a2a2a] text-[#f0f0f0] hover:bg-[#1e1e1e] transition-colors">Back to Sensors</button>
            <button disabled={!hasRules} onClick={() => goToStep(3)} className="btn-coral disabled:opacity-40 disabled:cursor-not-allowed">Review & Upload</button>
          </div>
        </>
      )}

      {/* ── Step 3 ── */}
      {step === 3 && (
        <>
          {!webSerialSupported && (
            <div className="flex gap-3 items-start bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg p-5 mb-6 text-sm text-[#f59e0b]">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Web Serial is not supported in your browser. Use <a href="https://www.google.com/chrome/" target="_blank" rel="noreferrer" className="underline">Chrome</a> or <a href="https://www.microsoft.com/edge" target="_blank" rel="noreferrer" className="underline">Edge</a> on desktop.</span>
            </div>
          )}

          {/* Review grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6">
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#666] mb-4">Selected Sensors</h3>
              {Object.keys(selectedSensors).map(sid => {
                const s = SENSORS.find(x => x.id === sid)!;
                const Icon = s.icon;
                return (
                  <div key={sid} className="flex items-center gap-3 py-2.5 border-b border-[#2a2a2a] last:border-0 text-sm">
                    <div className="w-7 h-7 rounded-md bg-accent/15 flex items-center justify-center"><Icon className="w-4 h-4 text-accent" /></div>
                    <span>{s.name}</span>
                    <span className="ml-auto font-mono text-[11px] text-[#666] bg-[#141414] px-2 py-0.5 rounded">{selectedSensors[sid].pin}</span>
                  </div>
                );
              })}
            </div>
            <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6">
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#666] mb-4">Interaction Rules</h3>
              {rules.map(rule => {
                const t = allTriggers.find(x => x.id === rule.triggerId);
                const a = allActions.find(x => x.id === rule.actionId);
                const m = TIMING_OPTIONS.find(x => x.id === rule.modifierId);
                return (
                  <div key={rule.id} className="py-3 border-b border-[#2a2a2a] last:border-0 text-sm leading-relaxed">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-accent bg-accent/15 px-2 py-0.5 rounded">WHEN</span> {t?.sensorName}: {t?.label}{rule.triggerValue ? ` "${rule.triggerValue}"${rule.triggerValue2 ? ` to ${rule.triggerValue2}` : ''}${t?.unit ? ` ${t.unit}` : ''}` : ''}<br />
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#4ade80] bg-[#4ade80]/15 px-2 py-0.5 rounded">THEN</span> {a?.sensorName}: {a?.label}{rule.actionValue ? ` "${rule.actionValue}"${a?.unit ? ` ${a.unit}` : ''}` : ''}
                    {m && m.id !== 'none' && (<><br /><span className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#60a5fa] bg-[#60a5fa]/15 px-2 py-0.5 rounded">TIMING</span> {m.label}{rule.modifierValue ? ` ${rule.modifierValue}${m.unit ? ` ${m.unit}` : ''}` : ''}</>)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Config JSON */}
          <div className="relative bg-[#141414] border border-[#2a2a2a] rounded-lg p-5 mb-6">
            <button onClick={copyConfig} className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-[0.06em] px-3 py-1.5 rounded border border-[#2a2a2a] bg-[#1e1e1e] text-[#666] hover:border-accent hover:text-accent transition-colors">Copy JSON</button>
            <pre className="font-mono text-xs text-[#60a5fa] leading-relaxed overflow-x-auto whitespace-pre-wrap">{JSON.stringify(generateConfig(), null, 2)}</pre>
          </div>

          {/* Upload */}
          <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-10 text-center mb-8">
            <div className={`w-14 h-14 mx-auto mb-5 rounded-lg flex items-center justify-center ${
              uploadState === 'done' ? 'bg-[#4ade80]/15' : uploadState === 'sent' ? 'bg-[#f59e0b]/15' : 'bg-[#60a5fa]/15'
            }`}>
              {uploadState === 'done' ? <CheckCircle2 className="w-7 h-7 text-[#4ade80]" /> :
               uploadState === 'sent' ? <CloudUpload className="w-7 h-7 text-[#f59e0b]" /> :
               <Activity className="w-7 h-7 text-[#60a5fa]" />}
            </div>
            <h3 className="font-display text-xl mb-2">
              {uploadState === 'done' ? 'Upload Complete' : uploadState === 'sent' ? 'Configuration Sent' : 'Ready to Upload'}
            </h3>
            <p className="text-sm text-[#999] mb-6 max-w-md mx-auto">
              {uploadState === 'done' ? 'Your board is running. Disconnect USB to run independently.' :
               uploadState === 'sent' ? 'Ensure interpreter firmware is installed.' :
               'Connect your XIAO ESP32S3 via USB, then click below.'}
            </p>
            <button onClick={startUpload} disabled={uploadState === 'connecting'} className="btn-coral disabled:opacity-40">
              {uploadState === 'connecting' ? 'Connecting...' : 'Connect & Upload to Board'}
            </button>
            {progress > 0 && (
              <div className="w-full max-w-sm h-1.5 bg-[#2a2a2a] rounded-full mx-auto mt-5 overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all duration-400" style={{ width: `${progress}%` }} />
              </div>
            )}
            {logs.length > 0 && (
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-md p-4 mt-5 max-w-lg mx-auto text-left max-h-48 overflow-y-auto">
                {logs.map((l, i) => (
                  <p key={i} className={`font-mono text-xs mb-1 ${
                    l.type === 'success' ? 'text-[#4ade80]' : l.type === 'error' ? 'text-accent' : 'text-[#60a5fa]'
                  }`}>&gt; {l.msg}</p>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-start">
            <button onClick={() => goToStep(2)} className="font-mono text-xs uppercase tracking-[0.06em] px-6 py-3 rounded-md border border-[#2a2a2a] text-[#f0f0f0] hover:bg-[#1e1e1e] transition-colors">Back to Rules</button>
          </div>
        </>
      )}
    </div>
  );
}
