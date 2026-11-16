"use client";

import { useMemo, useState } from "react";

type Period = "7 days" | "30 days" | "90 days";
type Metric = { label: string; value: string; change: string; detail: string; tone: string; icon: string };

const baseMetrics: Metric[] = [
  { label: "Total revenue", value: "$48,294", change: "+12.8%", detail: "vs. previous period", tone: "violet", icon: "$" },
  { label: "Active customers", value: "2,847", change: "+8.2%", detail: "vs. previous period", tone: "blue", icon: "◉" },
  { label: "Conversion rate", value: "3.62%", change: "+0.6%", detail: "vs. previous period", tone: "green", icon: "↗" },
  { label: "Avg. order value", value: "$169.78", change: "-2.4%", detail: "vs. previous period", tone: "orange", icon: "◈" },
];

const chartSeries: Record<Period, { labels: string[]; revenue: number[]; customers: number[] }> = {
  "7 days": { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], revenue: [36, 48, 41, 61, 55, 76, 68], customers: [24, 30, 28, 42, 36, 49, 43] },
  "30 days": { labels: ["Sep 20", "Sep 25", "Sep 30", "Oct 5", "Oct 10", "Oct 15", "Oct 19"], revenue: [30, 39, 35, 55, 50, 72, 66], customers: [22, 28, 26, 38, 34, 47, 42] },
  "90 days": { labels: ["Jul 22", "Aug 5", "Aug 19", "Sep 2", "Sep 16", "Sep 30", "Oct 19"], revenue: [25, 34, 31, 47, 50, 67, 78], customers: [17, 24, 22, 34, 31, 42, 48] },
};

const channels = [
  { name: "Organic search", value: 38.4, sessions: "12,482", color: "#8169df" },
  { name: "Direct", value: 27.2, sessions: "8,841", color: "#49b89a" },
  { name: "Social media", value: 19.8, sessions: "6,436", color: "#78a4e7" },
  { name: "Referral", value: 14.6, sessions: "4,749", color: "#edb963" },
];

const products = [
  { name: "Studio Headphones", category: "Electronics", sales: "$12,840", units: 186, change: "+18.2%", initials: "SH", tone: "product-purple" },
  { name: "Everyday Backpack", category: "Accessories", sales: "$9,420", units: 142, change: "+12.4%", initials: "EB", tone: "product-blue" },
  { name: "Ceramic Pour-over", category: "Home & Living", sales: "$7,650", units: 128, change: "+8.7%", initials: "CP", tone: "product-orange" },
  { name: "Linen Table Set", category: "Home & Living", sales: "$6,280", units: 94, change: "-1.3%", initials: "LT", tone: "product-green" },
];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    chart: <><path d="M4 19V5m0 14h17" /><path d="m6 15 4-4 3 2 6-7" /><path d="M15 6h4v4" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    box: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 8 9 5 9-5m-18 0v9l9 5 9-5V8m-9 5v9" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1a1.7 1.7 0 1 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.3a1.7 1.7 0 1 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 1 1-2.4-2.4l.1-.1a1.7 1.7 0 0 0-1.2-2.9H4a1.7 1.7 0 1 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 1 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2V4a1.7 1.7 0 1 1 3.4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 1 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a1.7 1.7 0 1 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2.9Z" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 13h4" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3" /></>,
    sparkle: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" /><path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    down: <path d="m7 10 5 5 5-5" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name] ?? paths.grid}</svg>;
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const points = values.map((value, index) => `${index * 30},${35 - value * 0.35}`).join(" ");
  return <svg className="sparkline" viewBox="0 0 180 38" preserveAspectRatio="none" aria-hidden="true"><polyline points={points} fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function TrendChart({ period }: { period: Period }) {
  const series = chartSeries[period];
  const points = (values: number[]) => values.map((value, index) => `${40 + index * 91},${188 - value * 1.55}`).join(" ");
  return <svg className="trend-chart" viewBox="0 0 610 220" role="img" aria-label={`Revenue and customer trend over the last ${period}`}>
    {[34, 72, 110, 148, 186].map((y, index) => <g key={y}><line x1="38" y1={y} x2="598" y2={y} stroke="#f0eff4" strokeDasharray="3 5" /><text x="0" y={y + 4} className="chart-axis">${[8, 6, 4, 2, 0][index]}k</text></g>)}
    <defs><linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8069df" stopOpacity=".18" /><stop offset="1" stopColor="#8069df" stopOpacity="0" /></linearGradient></defs>
    <polygon points={`40,188 ${points(series.revenue)} 586,188`} fill="url(#revenueFill)" />
    <polyline points={points(series.customers)} fill="none" stroke="#49b89a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points={points(series.revenue)} fill="none" stroke="#8069df" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
    {series.labels.map((label, index) => <text key={label} x={40 + index * 91} y="213" textAnchor="middle" className="chart-axis">{label}</text>)}
  </svg>;
}

function downloadFile(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function Home() {
  const [period, setPeriod] = useState<Period>("30 days");
  const [report, setReport] = useState<{ text: string; period: Period } | null>(null);
  const [reportError, setReportError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState("");
  const multiplier = period === "7 days" ? 0.25 : period === "90 days" ? 3 : 1;
  const metrics = useMemo(() => baseMetrics.map((metric, index) => index === 0
    ? { ...metric, value: period === "7 days" ? "$12,073" : period === "90 days" ? "$144,882" : metric.value }
    : metric), [period]);

  async function generateReport() {
    setIsGenerating(true);
    setReportError("");
    setReport(null);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period, metrics: metrics.map(({ label, value, change }) => ({ label, value, change })) }),
      });
      const result: { report?: string; error?: string } = await response.json();
      if (!response.ok) throw new Error(result.error ?? `Report generation failed (${response.status}).`);
      if (!result.report) throw new Error("The AI provider returned an empty report. Please try again.");
      setReport({ text: result.report, period });
    } catch (error) {
      setReportError(error instanceof Error ? error.message : "Could not generate the report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  function exportCsv() {
    const rows = [["Metric", "Value", "Change"], ...metrics.map(({ label, value, change }) => [label, value, change])];
    downloadFile(`insightly-${period.replace(" ", "-")}.csv`, rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n"), "text/csv;charset=utf-8");
    setToast("CSV export downloaded");
    window.setTimeout(() => setToast(""), 2500);
  }

  const periodDescription = period === "7 days" ? "Oct 13 – Oct 19, 2025" : period === "90 days" ? "Jul 22 – Oct 19, 2025" : "Sep 20 – Oct 19, 2025";

  return <main className="analytics-app">
    <aside className="analytics-sidebar">
      <a className="brand" href="#" aria-label="Insightly home"><span className="brand-mark"><Icon name="chart" size={20} /></span><span>insightly<span className="brand-dot">.</span></span></a>
      <div className="workspace-label">WORKSPACE</div>
      <div className="account-switch"><span className="company-avatar">N</span><span><strong>Northstar Studio</strong><small>Pro workspace</small></span></div>
      <div className="nav-label">ANALYTICS</div>
      <nav aria-label="Analytics navigation"><span className="analytics-nav analytics-nav-active" aria-current="page"><Icon name="grid" size={17} />Overview</span></nav>
          </aside>

    <section className="analytics-main">
      <header className="analytics-topbar"><div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>Overview</strong></div></header>
      <div className="analytics-content">
        <div className="page-heading"><div><div className="eyebrow">SAMPLE DATA · OCTOBER 2025</div><h1>Business overview</h1><p>Explore performance metrics for the selected period.</p></div><div className="heading-actions"><label className="date-picker"><Icon name="calendar" size={15} /><span>{periodDescription}</span><select value={period} onChange={(event) => setPeriod(event.target.value as Period)} aria-label="Select date range"><option>7 days</option><option>30 days</option><option>90 days</option></select><Icon name="down" size={14} /></label><button className="export-button" onClick={exportCsv}><Icon name="download" size={15} /><span>Export</span></button></div></div>

        <section className="metric-grid" aria-label="Key performance indicators">{metrics.map((metric) => <article className="metric-card" key={metric.label}><div className="metric-top"><span>{metric.label}</span><span className={`metric-icon ${metric.tone}`}>{metric.icon}</span></div><div className="metric-value">{metric.value}</div><div className="metric-bottom"><span className={`change-badge ${metric.change.startsWith("-") ? "negative-change" : ""}`}><Icon name={metric.change.startsWith("-") ? "down" : "arrow"} size={12} />{metric.change}</span><span>{metric.detail}</span></div><Sparkline values={chartSeries[period].revenue.map((value, index) => Math.round(value * (1 + index * 0.015 * multiplier)))} color={metric.tone === "violet" ? "#8169df" : metric.tone === "blue" ? "#75a4e5" : metric.tone === "green" ? "#4eb99b" : "#e6a75b"} /></article>)}</section>

        <section className="chart-card"><div className="card-heading"><div><h2>Revenue &amp; customers</h2><p>Track your business performance over time</p></div><div className="chart-legend"><span><i className="legend-revenue" /> Revenue</span><span><i className="legend-customers" /> Customers</span><button className="chart-menu" aria-label="Chart options" onClick={exportCsv}><Icon name="download" size={16} /></button></div></div><div className="chart-total"><strong>{period === "7 days" ? "$12,073" : period === "90 days" ? "$144,882" : "$48,294"}</strong><span className="change-badge"><Icon name="arrow" size={11} />12.8%</span><small>revenue this period</small></div><TrendChart period={period} /></section>

        <div className="lower-grid">
          <section className="channels-card"><div className="card-heading"><div><h2>Traffic sources</h2><p>Where your visitors come from</p></div></div><div className="donut-layout"><div className="donut-chart" role="img" aria-label="Traffic sources: organic search 38.4%, direct 27.2%, social media 19.8%, referral 14.6%"><div><strong>32.5k</strong><small>Sessions</small></div></div><div className="channel-legend">{channels.map((channel) => <div className="channel-row" key={channel.name}><span className="channel-name"><i style={{ backgroundColor: channel.color }} />{channel.name}</span><span className="channel-value">{channel.value}%</span></div>)}</div></div></section>
          <section className="products-card"><div className="card-heading"><div><h2>Top products</h2><p>Your best performers this period</p></div></div><div className="product-table"><div className="product-row product-head"><span>PRODUCT</span><span>SALES</span><span>UNITS</span></div>{products.map((product) => <div className="product-row" key={product.name}><div className="product-info"><span className={`product-icon ${product.tone}`}>{product.initials}</span><span><strong>{product.name}</strong><small>{product.category}</small></span></div><strong className="product-sales">{product.sales}</strong><span className="product-units">{product.units}</span></div>)}</div></section>
        </div>

        <section className="ai-card"><div className="ai-icon"><Icon name="sparkle" size={18} /></div><div className="ai-intro"><span className="ai-kicker">INSIGHTLY AI</span><h2>Your next big insight is one click away.</h2><p>Get a clear, data-backed summary of your business and discover what to do next.</p></div><div className="ai-action"><button onClick={generateReport} disabled={isGenerating}><Icon name="sparkle" size={15} />{isGenerating ? "Generating..." : "Generate AI report"}</button><span>Powered by OpenAI</span></div></section>
        {reportError && <div className="report-error" role="alert"><strong>Report not generated</strong><span>{reportError}</span></div>}
        {report && <section className="report-result"><div className="report-heading"><div><span className="ai-kicker">AI-GENERATED REPORT · {report.period.toUpperCase()}</span><h2>Business performance brief</h2></div><div><button className="report-download" onClick={() => downloadFile("insightly-performance-report.txt", report.text, "text/plain;charset=utf-8")}><Icon name="download" size={14} /> Download</button><button className="report-close" aria-label="Close report" onClick={() => setReport(null)}><Icon name="close" size={16} /></button></div></div><p>{report.text}</p></section>}
        <footer className="footer-note"><span>Showing demo data for Northstar Studio</span></footer>
      </div>
    </section>
    {toast && <div className="analytics-toast" role="status">{toast}<button aria-label="Dismiss notification" onClick={() => setToast("")}><Icon name="close" size={14} /></button></div>}
  </main>;
}
