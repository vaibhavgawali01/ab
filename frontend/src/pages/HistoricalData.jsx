import React, { useState } from 'react';
import { 
  History, 
  Download, 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function HistoricalData({ trains = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCorridor, setSelectedCorridor] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Realistic historical simulated runs dataset
  const historicalRuns = [
    { run_id: "RUN-9821", date: "2026-09-07", train_number: "12301", name: "Howrah Rajdhani", corridor: "NDLS-HWH", scheduled_dep: "16:55", actual_arr_delay: 14, weather: "Clear", punctuality: "Punctual" },
    { run_id: "RUN-9822", date: "2026-09-07", train_number: "12302", name: "New Delhi Rajdhani", corridor: "NDLS-HWH", scheduled_dep: "16:55", actual_arr_delay: 6, weather: "Clear", punctuality: "Punctual" },
    { run_id: "RUN-9823", date: "2026-09-07", train_number: "22436", name: "Vande Bharat Express", corridor: "NDLS-HWH", scheduled_dep: "06:00", actual_arr_delay: 2, weather: "Clear", punctuality: "Punctual" },
    { run_id: "RUN-9824", date: "2026-09-06", train_number: "12951", name: "Mumbai Tejas Rajdhani", corridor: "NDLS-MMCT", scheduled_dep: "17:00", actual_arr_delay: 9, weather: "Rain", punctuality: "Punctual" },
    { run_id: "RUN-9825", date: "2026-09-06", train_number: "12004", name: "Lucknow Shatabdi", corridor: "NDLS-HWH", scheduled_dep: "06:10", actual_arr_delay: 21, weather: "Clear", punctuality: "Delayed" },
    { run_id: "RUN-9826", date: "2026-09-05", train_number: "12802", name: "Purushottam Express", corridor: "NDLS-HWH", scheduled_dep: "22:40", actual_arr_delay: 48, weather: "Dense Fog", punctuality: "Delayed" },
    { run_id: "RUN-9827", date: "2026-09-05", train_number: "BOXN-50102", name: "Thermal Coal Freight", corridor: "NDLS-HWH", scheduled_dep: "02:30", actual_arr_delay: 94, weather: "Clear", punctuality: "Delayed" },
    { run_id: "RUN-9828", date: "2026-09-04", train_number: "20608", name: "Mysuru-Chennai Vande Bharat", corridor: "MAS-SBC", scheduled_dep: "14:50", actual_arr_delay: 4, weather: "Clear", punctuality: "Punctual" }
  ];

  const filtered = historicalRuns.filter(r => {
    const matchesSearch = r.train_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCorridor = selectedCorridor === 'ALL' || r.corridor === selectedCorridor;
    const matchesStatus = statusFilter === 'ALL' || r.punctuality === statusFilter;
    return matchesSearch && matchesCorridor && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ["Run ID", "Date", "Train Number", "Train Name", "Corridor", "Scheduled Dep", "Arrival Delay (Mins)", "Weather", "Punctuality"];
    const rows = filtered.map(r => [
      r.run_id, r.date, r.train_number, `"${r.name}"`, r.corridor, r.scheduled_dep, r.actual_arr_delay, r.weather, r.punctuality
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `trackpulse_historical_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filtered, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `trackpulse_historical_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Header */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            HISTORICAL TIMETABLE ARCHIVES
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Queryable database of historical train runs, scheduled departures, delay records, and export formats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportJSON}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-900/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by train number, name..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCorridor}
            onChange={(e) => setSelectedCorridor(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Corridors</option>
            <option value="NDLS-HWH">NDLS-HWH</option>
            <option value="NDLS-MMCT">NDLS-MMCT</option>
            <option value="MAS-SBC">MAS-SBC</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Punctuality</option>
            <option value="Punctual">Punctual (&le; 15m)</option>
            <option value="Delayed">Delayed (&gt; 15m)</option>
          </select>
        </div>
      </div>

      {/* Historical Records Table */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left font-mono text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Run ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Train No. & Name</th>
                <th className="p-3">Corridor</th>
                <th className="p-3">Scheduled Dep</th>
                <th className="p-3">Arrival Delay</th>
                <th className="p-3">Weather</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {filtered.map((row) => {
                const isDelayed = row.punctuality === "Delayed";
                return (
                  <tr key={row.run_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 text-cyan-400 font-bold">{row.run_id}</td>
                    <td className="p-3 text-slate-400">{row.date}</td>
                    <td className="p-3 font-bold text-white">
                      <span className="text-cyan-300 mr-2">{row.train_number}</span>
                      <span className="font-normal">{row.name}</span>
                    </td>
                    <td className="p-3 text-slate-300">{row.corridor}</td>
                    <td className="p-3 text-slate-300">{row.scheduled_dep}</td>
                    <td className="p-3">
                      <span className={`font-bold ${isDelayed ? 'text-rose-400' : 'text-emerald-400'}`}>
                        +{row.actual_arr_delay} mins
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{row.weather}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        isDelayed 
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {row.punctuality}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-4 pt-3 border-t border-slate-800">
          <span>Showing {filtered.length} of {historicalRuns.length} recorded runs</span>
          <span>Baseline: Broad Gauge Passenger & Freight Operations</span>
        </div>
      </div>

    </div>
  );
}
