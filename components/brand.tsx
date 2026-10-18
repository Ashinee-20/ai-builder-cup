export function Brand() {
  return <span className="brand"><span className="brand-mark"><img src="/logo.png" alt="" width="32" height="32" /></span><span>{process.env.NEXT_PUBLIC_PRODUCT_NAME || "ChalkEvo"}</span></span>;
}
