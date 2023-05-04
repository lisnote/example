// https://www.namesilo.com/domain/search-domains?query=lisnote
import { readFileSync } from "fs";

const list = JSON.parse(readFileSync(`domain/${"lisnote"}.json`).toString())
  .filter(
    (item) =>
      // item.domain.replace(/.*\./, "").length < 3 &&
      // item.renewalPrice < 30 &&
      item.currentPrice >50 &&
      (item.available || item.addedToCart)
  )
  .map((item) => ({
    domain: item.domain,
    currentPrice: +item.currentPrice.toFixed(2),
    renewalPrice: +item.renewalPrice.toFixed(2),
  }))
  .sort((x, y) => {
    return x.domain.length - y.domain.length;
  });

list.forEach((item) => console.log(item));
