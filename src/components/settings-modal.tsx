"use client";

import { useGameStore } from "@/store/game-store";

interface SettingsModalProps {
  onClose: () => void;
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  accent,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  accent?: "blue" | "green";
}) {
  const borderFocus =
    accent === "blue"
      ? "focus:border-blue-500"
      : accent === "green"
      ? "focus:border-green-500"
      : "focus:border-slate-400";
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`px-3 py-2.5 rounded-xl bg-slate-700 text-white border border-slate-600 focus:outline-none placeholder:text-slate-500 ${borderFocus}`}
      />
    </div>
  );
}

function ToggleGroup<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; description?: string }[];
  onChange: (v: T) => void;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-sm transition-colors text-left ${
              value === opt.value
                ? "bg-green-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {opt.label}
            {opt.description && (
              <span
                className={`block text-xs font-normal mt-0.5 ${
                  value === opt.value ? "text-green-200" : "text-slate-500"
                }`}
              >
                {opt.description}
              </span>
            )}
          </button>
        ))}
      </div>
      {hint && <p className="text-xs text-slate-600">{hint}</p>}
    </div>
  );
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const {
    mode,
    setMode,
    scoringMode,
    setScoringMode,
    team1Name,
    team2Name,
    setTeamName,
    playerNames,
    setPlayerName,
    winScore,
    setWinScore,
  } = useGameStore();

  return (
    <div
      className="absolute inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm border border-slate-600 shadow-2xl max-h-[90dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <h2 className="text-lg font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition-colors"
            aria-label="Close"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-5 flex flex-col gap-5">
          <ToggleGroup
            label="Game Mode"
            value={mode}
            options={[
              { value: "singles", label: "Singles" },
              { value: "doubles", label: "Doubles" },
            ]}
            onChange={setMode}
            hint="Switching mode resets the current game."
          />

          <ToggleGroup
            label="Scoring"
            value={scoringMode}
            options={[
              {
                value: "rally",
                label: "Rally",
                description: "Any side scores on any rally",
              },
              {
                value: "service",
                label: "Service",
                description: "Only server scores; others cause side-out",
              },
            ]}
            onChange={setScoringMode}
          />

          {mode === "singles" ? (
            <>
              <TextInput
                label="Team 1 Name"
                value={team1Name}
                onChange={(v) => setTeamName(1, v)}
                placeholder="Team 1"
                accent="blue"
              />
              <TextInput
                label="Team 2 Name"
                value={team2Name}
                onChange={(v) => setTeamName(2, v)}
                placeholder="Team 2"
                accent="green"
              />
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-500">
                  Team 1
                </p>
                <TextInput
                  label="Player 1"
                  value={playerNames[0]}
                  onChange={(v) => setPlayerName(1, v)}
                  placeholder="Player 1"
                  accent="blue"
                />
                <TextInput
                  label="Player 2"
                  value={playerNames[1]}
                  onChange={(v) => setPlayerName(2, v)}
                  placeholder="Player 2"
                  accent="blue"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-green-500">
                  Team 2
                </p>
                <TextInput
                  label="Player 3"
                  value={playerNames[2]}
                  onChange={(v) => setPlayerName(3, v)}
                  placeholder="Player 3"
                  accent="green"
                />
                <TextInput
                  label="Player 4"
                  value={playerNames[3]}
                  onChange={(v) => setPlayerName(4, v)}
                  placeholder="Player 4"
                  accent="green"
                />
              </div>
            </>
          )}

          <ToggleGroup
            label="Win Score"
            value={String(winScore) as "11" | "15" | "21"}
            options={[
              { value: "11", label: "11" },
              { value: "15", label: "15" },
              { value: "21", label: "21" },
            ]}
            onChange={(v) => setWinScore(Number(v) as 11 | 15 | 21)}
          />

          <button
            onClick={onClose}
            className="py-3 rounded-xl bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
