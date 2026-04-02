const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export const fmt = (n) => currencyFormatter.format(n);

export const fmtShort = (n) =>
  `\u20B9${n.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
