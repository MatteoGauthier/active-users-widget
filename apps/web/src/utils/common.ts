export const statNumberFormatter = Intl.NumberFormat("en", { notation: "compact",  });

export const formatStatNumber = (n: number) => statNumberFormatter.format(n);
