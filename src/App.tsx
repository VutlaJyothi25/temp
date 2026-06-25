import { useState, useCallback } from 'react';
import { Thermometer, ArrowLeftRight, Sun, Snowflake } from 'lucide-react';

type TempUnit = 'celsius' | 'fahrenheit' | 'kelvin';

interface Temperature {
  celsius: number;
  fahrenheit: number;
  kelvin: number;
}

const unitSymbols: Record<TempUnit, string> = {
  celsius: '°C',
  fahrenheit: '°F',
  kelvin: 'K',
};

const unitLabels: Record<TempUnit, string> = {
  celsius: 'Celsius',
  fahrenheit: 'Fahrenheit',
  kelvin: 'Kelvin',
};

function convertFromCelsius(celsius: number): Temperature {
  return {
    celsius,
    fahrenheit: (celsius * 9) / 5 + 32,
    kelvin: celsius + 273.15,
  };
}

function convertToFahrenheit(fahrenheit: number): Temperature {
  const celsius = ((fahrenheit - 32) * 5) / 9;
  return convertFromCelsius(celsius);
}

function convertFromKelvin(kelvin: number): Temperature {
  const celsius = kelvin - 273.15;
  return convertFromCelsius(celsius);
}

function getTemperatureColor(celsius: number): string {
  if (celsius <= 0) return 'from-cyan-400 to-blue-500';
  if (celsius <= 15) return 'from-blue-400 to-teal-500';
  if (celsius <= 25) return 'from-teal-400 to-green-500';
  if (celsius <= 35) return 'from-green-400 to-yellow-500';
  return 'from-yellow-400 to-orange-500';
}

function getTemperatureIcon(celsius: number) {
  if (celsius <= 0) return <Snowflake className="w-8 h-8 text-blue-200 animate-pulse" />;
  if (celsius >= 30) return <Sun className="w-8 h-8 text-yellow-200 animate-pulse" />;
  return null;
}

function formatTemp(value: number): string {
  return Number.isFinite(value) ? value.toFixed(2) : '—';
}

function App() {
  const [temperatures, setTemperatures] = useState<Temperature>(
    convertFromCelsius(20)
  );
  const [inputUnit, setInputUnit] = useState<TempUnit>('celsius');
  const [inputValue, setInputValue] = useState<string>('20');

  const handleInputChange = useCallback((unit: TempUnit, value: string) => {
    const numValue = parseFloat(value);
    setInputValue(value);
    setInputUnit(unit);

    if (!isNaN(numValue)) {
      let newTemps: Temperature;
      switch (unit) {
        case 'celsius':
          newTemps = convertFromCelsius(numValue);
          break;
        case 'fahrenheit':
          newTemps = convertToFahrenheit(numValue);
          break;
        case 'kelvin':
          newTemps = convertFromKelvin(numValue);
          break;
      }
      setTemperatures(newTemps);
    }
  }, []);

  const handleSwap = useCallback((from: TempUnit, to: TempUnit) => {
    const fromValue = temperatures[from];
    setInputUnit(to);
    setInputValue(formatTemp(fromValue));
  }, [temperatures]);

  const celsius = temperatures.celsius;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getTemperatureColor(celsius)} transition-all duration-700 ease-in-out`}>
      <div className="min-h-screen backdrop-blur-sm bg-black/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Thermometer className="w-10 h-10 text-white drop-shadow-lg" />
              {getTemperatureIcon(celsius)}
            </div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              Temperature Converter
            </h1>
            <p className="text-white/80 mt-2 text-lg">
              Convert between Celsius, Fahrenheit, and Kelvin
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6">
            {/* Input Section */}
            <div className="space-y-4">
              {(['celsius', 'fahrenheit', 'kelvin'] as TempUnit[]).map((unit) => (
                <div
                  key={unit}
                  className={`relative rounded-2xl transition-all duration-300 ${
                    inputUnit === unit
                      ? 'bg-gradient-to-r from-slate-100 to-slate-50 ring-2 ring-slate-300 shadow-inner'
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center p-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-500 mb-1">
                        {unitLabels[unit]}
                      </label>
                      <div className="flex items-baseline gap-2">
                        <input
                          type="number"
                          value={inputUnit === unit ? inputValue : formatTemp(temperatures[unit])}
                          onChange={(e) => handleInputChange(unit, e.target.value)}
                          className={`w-full text-3xl font-semibold bg-transparent outline-none ${
                            inputUnit === unit ? 'text-slate-800' : 'text-slate-600'
                          }`}
                          placeholder="0"
                        />
                        <span className="text-xl font-medium text-slate-400">
                          {unitSymbols[unit]}
                        </span>
                      </div>
                    </div>

                    {/* Quick Swap Buttons */}
                    {inputUnit === unit && (
                      <div className="flex flex-col gap-1 ml-2">
                        {(['celsius', 'fahrenheit', 'kelvin'] as TempUnit[])
                          .filter((u) => u !== unit)
                          .map((toUnit) => (
                            <button
                              key={toUnit}
                              onClick={() => handleSwap(unit, toUnit)}
                              className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-600 transition-all duration-200 hover:scale-105 active:scale-95"
                              title={`Swap to ${unitLabels[toUnit]}`}
                            >
                              <ArrowLeftRight className="w-4 h-4" />
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Display */}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-center text-slate-500 text-sm mb-3">
                Quick Reference
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-xl bg-blue-50">
                  <div className="text-xs text-blue-500 font-medium">Freezing</div>
                  <div className="text-lg font-bold text-blue-700">0°C</div>
                  <div className="text-xs text-blue-400">32°F</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-50">
                  <div className="text-xs text-amber-500 font-medium">Room Temp</div>
                  <div className="text-lg font-bold text-amber-700">20°C</div>
                  <div className="text-xs text-amber-400">68°F</div>
                </div>
                <div className="p-3 rounded-xl bg-red-50">
                  <div className="text-xs text-red-500 font-medium">Boiling</div>
                  <div className="text-lg font-bold text-red-700">100°C</div>
                  <div className="text-xs text-red-400">212°F</div>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {[-40, 0, 20, 37, 100].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleInputChange('celsius', preset.toString())}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                    Math.round(celsius) === preset
                      ? 'bg-slate-800 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {preset}°C
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-white/60 text-sm mt-6">
            Click any field to edit • Use swap buttons to change the input unit
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
