const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    n,
  );
const fmtShort = (n) =>
  `\u20B9${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
export { fmt, fmtShort };
