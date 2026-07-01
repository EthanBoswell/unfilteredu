const rows = [
  {
    grade: "Housing: A−",
    quote: "\"Nobody tells you the housing lottery is a hunger games situation. Applied with 4 people, we all got different buildings.\"",
  },
  {
    grade: "Dining: B+",
    quote: "\"The dining hall actually slaps — but avoid peak hours unless you enjoy standing in a crowd for 20 minutes.\"",
  },
  {
    grade: "Student life: A",
    quote: "\"Join something in week 1. The campus is huge and it's easy to feel invisible if you don't.\"",
  },
  {
    grade: "Campus: A+",
    quote: "\"I walk to class through Janss Steps every day and it still doesn't get old. That part is genuinely true.\"",
  },
];

export default function HomepageContrast() {
  return (
    <section style={{ background: "#F5F4EF" }}>
      <div className="mx-auto max-w-[720px] px-8 pt-[72px]">
        <div className="overflow-hidden rounded-lg" style={{ border: "1px solid #e0ddd6" }}>
          {/* Header row */}
          <div className="grid grid-cols-2" style={{ background: "#0F0F0F" }}>
            <div className="px-5 py-3.5" style={{ borderRight: "1px solid #1a1a1a" }}>
              <span
                className="text-[12px] font-bold uppercase tracking-widest"
                style={{ fontFamily: "Inter, sans-serif", color: "#555" }}
              >
                A rating site
              </span>
            </div>
            <div className="px-5 py-3.5">
              <span
                className="text-[12px] font-bold uppercase tracking-widest"
                style={{ fontFamily: "Inter, sans-serif", color: "#F5F4EF" }}
              >
                UnfilteredU<sup style={{ fontSize: "0.65em" }}>™</sup>
              </span>
            </div>
          </div>

          {/* Data rows */}
          {rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-2"
              style={{
                background: "#ffffff",
                borderTop: "1px solid #e0ddd6",
              }}
            >
              <div
                className="px-5 py-4 flex items-start"
                style={{ borderRight: "1px solid #e0ddd6" }}
              >
                <span
                  className="text-[13px] italic"
                  style={{ fontFamily: "Inter, sans-serif", color: "#999" }}
                >
                  {row.grade}
                </span>
              </div>
              <div className="px-5 py-4 flex items-start">
                <span
                  className="text-[13px] leading-relaxed"
                  style={{ fontFamily: "Inter, sans-serif", color: "#111" }}
                >
                  {row.quote}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Attribution */}
        <p
          className="mt-3 text-right text-[12px]"
          style={{ fontFamily: "Inter, sans-serif", color: "#aaa" }}
        >
          Quotes from real student posts
        </p>
      </div>
    </section>
  );
}
