export default function PickleballIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path
        d="M12 1 Q7 6 12 12 Q17 18 12 23"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M1 12 Q6 7 12 12 Q18 17 23 12"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
