export function formatMoney(value){return `${new Intl.NumberFormat('sr-RS',{maximumFractionDigits:0}).format(Number(value)||0)} RSD`;}
export function lineTotal(qty,price){return Number(qty||0)*Number(price||0);}
