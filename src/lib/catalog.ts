/* ==========================================================================
   Check Pink — brand + catalogue data
   The single source of truth for the storefront and the API. Swap in the real
   brand details, products, prices and photos here. When a database is added,
   this file becomes the seed data and `server/catalog` reads from the DB.
   Photos in public/img are stock placeholders (Unsplash).
   ========================================================================== */

export type Category = { id: string; name: string; img: string; blurb: string };
export type Plan = { id: string; name: string; line: string; img: string };

export type Product = {
  id: string;
  name: string;
  /** Category ids; the first one is the primary category. */
  cats: string[];
  price: number;
  /** Compare-at price when the piece is on sale. */
  was: number | null;
  colour: string;
  /** [name, hex] pairs. */
  swatches: [string, string][];
  sizes: string[];
  /** Sizes that have sold out. */
  out: string[];
  /** Occasion ids ("plans"). */
  plans: string[];
  /** Part of the current drop. */
  isNew: boolean;
  soldOut: boolean;
  /** [made, left] for this batch. */
  batch: [number, number];
  /** Paths under /public/img. */
  img: string[];
  alt: string;
  desc: string;
  fabric: string;
  fit: string;
  care: string;
};

type ProductInput = Omit<Product, "sizes" | "out" | "plans" | "isNew" | "soldOut" | "was" | "care"> &
  Partial<Pick<Product, "sizes" | "out" | "plans" | "isNew" | "soldOut" | "was" | "care">>;

export const brand = {
  name: "Check Pink",
  tagline: "Straight off the cutting table.",
  email: "hello@checkpink.example", // placeholder
  phone: "+91 00000 00000", // placeholder
  instagram: "@checkpink", // placeholder
  // The two words in the name, as a tailor would define them (footer + story page).
  lexicon: [
    { word: "check", kind: "noun", text: "A pattern of crossed stripes. Also what we do to every seam, twice, before it leaves." },
    { word: "pink", kind: "verb", text: "To cut cloth with a zigzag edge so it never frays. Also, obviously, the colour." },
  ],
  freeShippingOver: 1999,
  shippingFee: 99, // charged on orders under the free-shipping threshold
  drop: { number: 47, weekday: 5, hour: 19 }, // new drop every Friday, 7 PM
};

export const categories: Category[] = [
  { id: "dresses", name: "Dresses", img: "products/colaba-polka.webp", blurb: "Slips, sundresses and the one you keep for good news." },
  { id: "coords", name: "Co-ords", img: "products/hauzkhas-coord.webp", blurb: "Two pieces, one decision. Wear them together or split them up." },
  { id: "tops", name: "Tops", img: "products/koregaon-ruffle-top.webp", blurb: "Shirts, corsets and ruffles that do the talking." },
  { id: "bottoms", name: "Bottoms", img: "products/banjara-satin-skirt.webp", blurb: "Skirts and trousers cut to move." },
  { id: "denim", name: "Denim", img: "products/versova-paperbag-jeans.webp", blurb: "Washed in small lots, so no two pairs fade quite the same." },
  { id: "festive", name: "Festive", img: "products/shantiniketan-saree.webp", blurb: "Kurta sets, drapes and sarees for shaadi season and after." },
];

// "Plans" are occasions — the second way to browse the shop.
export const plans: Plan[] = [
  { id: "date-night", name: "Date night", line: "Dinner at eight, home whenever.", img: "editorial/plan-date.webp" },
  { id: "office", name: "Desk to dinner", line: "Looks sharp at ten, still does at ten.", img: "editorial/plan-office.webp" },
  { id: "festive", name: "Shaadi season", line: "Three functions, zero repeats.", img: "editorial/plan-festive.webp" },
  { id: "vacation", name: "Out of office", line: "Packs flat. Photographs well.", img: "editorial/plan-vacation.webp" },
  { id: "casual", name: "Sunday slow", line: "Chai, errands, nowhere to be.", img: "editorial/plan-casual.webp" },
  { id: "party", name: "After dark", line: "For the plans that start at eleven.", img: "editorial/plan-party.webp" },
];

export const SIZES: string[] = ["XS", "S", "M", "L", "XL"];

const CARE = {
  default: "Machine wash cold, inside out. Do not bleach. Dry in shade. Warm iron.",
  satin: "Hand wash cold or dry clean. Do not wring. Dry flat in shade. Cool iron on the reverse.",
  denim: "Wash cold, inside out, and not too often. Do not bleach. Line dry. Expect it to soften and fade with wear.",
  festive: "Dry clean only. Store folded in muslin, away from direct sunlight.",
};

// Product helper: fills in the defaults so each entry stays short.
const p = (o: ProductInput): Product => ({
  sizes: SIZES,
  out: [], // sizes that have sold out
  plans: [],
  isNew: false,
  soldOut: false,
  was: null,
  care: CARE.default,
  ...o,
});

export const products: Product[] = [
  /* ---------------------------- Dresses ---------------------------- */
  p({
    id: "bandra-slip",
    name: "Bandra Satin Slip Dress",
    cats: ["dresses"],
    price: 2890,
    colour: "Pearl",
    swatches: [["Pearl", "#e9e2d8"], ["Ink", "#1b1b1b"]],
    plans: ["date-night", "party"],
    isNew: true,
    batch: [60, 22],
    out: ["XL"],
    img: ["products/bandra-slip.webp"],
    alt: "Model in a pearl satin slip dress with black opera gloves",
    desc: "Bias-cut satin that skims rather than clings, with a cowl neck that falls a little differently every time you move.",
    fabric: "Heavy satin, lined through the bodice",
    fit: "Cut on the bias, relaxed through the hip. Model is 5'8\" and wears S.",
    care: CARE.satin,
  }),
  p({
    id: "colaba-polka",
    name: "Colaba Polka Sundress",
    cats: ["dresses"],
    price: 1990,
    colour: "Navy dot",
    swatches: [["Navy dot", "#1c2440"]],
    plans: ["casual", "vacation"],
    batch: [80, 41],
    img: ["products/colaba-polka.webp"],
    alt: "Model in a sleeveless navy polka-dot sundress",
    desc: "A square-neck sundress in breathable cotton with pockets deep enough for a phone and a packet of mints.",
    fabric: "Printed cotton cambric",
    fit: "Fitted bodice, full skirt, side pockets. Model is 5'5\" and wears M.",
  }),
  p({
    id: "lodhi-shirtdress",
    name: "Lodhi Shirt Dress",
    cats: ["dresses"],
    price: 2290,
    colour: "Chalk",
    swatches: [["Chalk", "#f1efe8"], ["Sky", "#b8cde0"]],
    plans: ["vacation", "casual", "office"],
    isNew: true,
    batch: [60, 9],
    out: ["XS", "S"],
    img: ["products/lodhi-shirtdress.webp"],
    alt: "Model in a white long-sleeved shirt dress and sunglasses",
    desc: "Borrowed-from-him proportions with a waist tie to bring it back. Works buttoned up for the office, open over a swimsuit everywhere else.",
    fabric: "Washed cotton poplin",
    fit: "Oversized through the shoulder, hits mid-thigh. Model is 5'9\" and wears S.",
  }),
  p({
    id: "mehrauli-kaftan",
    name: "Mehrauli Paisley Kaftan Dress",
    cats: ["dresses", "festive"],
    price: 2690,
    colour: "Madder paisley",
    swatches: [["Madder paisley", "#a8243a"]],
    plans: ["festive", "vacation"],
    batch: [50, 27],
    img: ["products/mehrauli-kaftan.webp"],
    alt: "Model in a maroon paisley kaftan dress with bell sleeves",
    desc: "A paisley print in madder and gold with bell sleeves that make every gesture look deliberate.",
    fabric: "Printed modal satin",
    fit: "Easy through the body with a notched neckline. Model is 5'7\" and wears M.",
  }),
  p({
    id: "marine-gown",
    name: "Marine Drive Draped Gown",
    cats: ["dresses"],
    price: 3990,
    was: 4690,
    colour: "Sindoor",
    swatches: [["Sindoor", "#c21a24"]],
    plans: ["party", "date-night"],
    soldOut: true,
    batch: [30, 0],
    img: ["products/marine-gown.webp"],
    alt: "Model in a red long-sleeved gown with a draped train",
    desc: "A structured mini with a floor-length drape off one hip. Made thirty, kept none.",
    fabric: "Stretch crepe with satin drape",
    fit: "Fitted. Padded shoulder, concealed back zip. Model is 5'8\" and wears S.",
    care: CARE.satin,
  }),

  /* ---------------------------- Co-ords ---------------------------- */
  p({
    id: "hauzkhas-coord",
    name: "Hauz Khas Printed Co-ord",
    cats: ["coords"],
    price: 3190,
    colour: "Coral ikat",
    swatches: [["Coral ikat", "#e2613f"], ["Indigo ikat", "#27406b"]],
    plans: ["casual", "vacation", "festive"],
    isNew: true,
    batch: [60, 31],
    img: ["products/hauzkhas-coord.webp", "products/hauzkhas-coord-2.webp", "products/hauzkhas-coord-3.webp", "products/hauzkhas-coord-4.webp"],
    alt: "Model in a coral and teal printed shirt and trouser co-ord set",
    desc: "A relaxed shirt and wide-leg trouser in a coral and teal print. Wear the set, or split it and get three outfits out of one parcel.",
    fabric: "Printed cotton mul",
    fit: "Relaxed shirt, elasticated wide-leg trouser. Model is 5'6\" and wears S.",
  }),
  p({
    id: "fortkochi-kurta-set",
    name: "Fort Kochi Floral Kurta Set",
    cats: ["coords", "festive"],
    price: 2790,
    colour: "Midnight floral",
    swatches: [["Midnight floral", "#2b2233"]],
    plans: ["office", "casual", "festive"],
    isNew: true,
    batch: [60, 18],
    img: ["products/fortkochi-kurta-set.webp"],
    alt: "Model in a dark floral short kurta and matching cropped trousers",
    desc: "A short kurta and cropped trouser in a dense midnight floral. Sits somewhere between pyjamas and a suit, in the best way.",
    fabric: "Printed cotton satin",
    fit: "Straight kurta with side slits, mid-rise trouser. Model is 5'7\" and wears S.",
  }),
  p({
    id: "juhu-teal-coord",
    name: "Juhu Skirt Co-ord",
    cats: ["coords"],
    price: 2490,
    colour: "Lagoon",
    swatches: [["Lagoon", "#1fa9a3"], ["Shell", "#f0d9cf"]],
    plans: ["vacation", "date-night"],
    batch: [40, 6],
    out: ["L", "XL"],
    img: ["products/juhu-teal-coord.webp"],
    alt: "Model seen from behind in a teal crop top and matching skirt",
    desc: "A cropped tee and bodycon midi in a rib knit that holds its shape from the first coffee to the last drink.",
    fabric: "Cotton-rich rib knit",
    fit: "Close fit with plenty of stretch. Model is 5'4\" and wears S.",
  }),
  p({
    id: "cubbon-blazer-set",
    name: "Cubbon Blazer & Skort Set",
    cats: ["coords"],
    price: 3690,
    colour: "Chalk",
    swatches: [["Chalk", "#f1efe8"], ["Ink", "#1b1b1b"]],
    plans: ["office", "party"],
    isNew: true,
    batch: [40, 19],
    img: ["products/cubbon-blazer-set.webp"],
    alt: "Model in a white blazer and matching pleated skort on a city street",
    desc: "A single-button blazer with a pleated skort. Looks like a skirt, behaves like shorts, gets you through a full day of meetings.",
    fabric: "Suiting twill with stretch",
    fit: "Relaxed blazer, high-rise skort. Model is 5'6\" and wears M.",
    care: CARE.satin,
  }),

  /* ----------------------------- Tops ------------------------------ */
  p({
    id: "koregaon-ruffle-top",
    name: "Koregaon Ruffle Bardot Top",
    cats: ["tops"],
    price: 1490,
    colour: "Chalk",
    swatches: [["Chalk", "#f1efe8"], ["Rose", "#e7b9b4"]],
    plans: ["date-night", "party"],
    isNew: true,
    batch: [80, 37],
    img: ["products/koregaon-ruffle-top.webp"],
    alt: "Model in a white off-shoulder ruffled top",
    desc: "Two tiers of ruffle on an elasticated neckline that stays exactly where you put it. On the shoulder or off.",
    fabric: "Cotton voile",
    fit: "Cropped, with volume through the sleeve. Model is 5'7\" and wears S.",
  }),
  p({
    id: "indiranagar-organza-shirt",
    name: "Indiranagar Organza Shirt",
    cats: ["tops"],
    price: 1790,
    colour: "Chalk",
    swatches: [["Chalk", "#f1efe8"]],
    plans: ["office", "date-night"],
    batch: [60, 24],
    img: ["products/indiranagar-organza-shirt.webp"],
    alt: "Model in a sheer white organza shirt",
    desc: "A sheer shirt with a full sleeve and a neat collar. Layer it over a slip, a bralette or yesterday's tee.",
    fabric: "Soft organza",
    fit: "Relaxed with a dropped shoulder. Model is 5'8\" and wears S.",
    care: CARE.satin,
  }),
  p({
    id: "parkstreet-shirt",
    name: "Park Street Poplin Shirt",
    cats: ["tops"],
    price: 1590,
    colour: "Chalk",
    swatches: [["Chalk", "#f1efe8"], ["Butter", "#f2e2a4"], ["Ink", "#1b1b1b"]],
    plans: ["office", "casual"],
    batch: [100, 52],
    img: ["products/parkstreet-shirt.webp"],
    alt: "Model in a white poplin shirt and a black buttoned skirt",
    desc: "The white shirt you stop looking for once you have it. Crisp poplin, a proper collar, and cuffs made to be rolled.",
    fabric: "Cotton poplin",
    fit: "Regular fit, slightly longer at the back. Model is 5'6\" and wears S.",
  }),
  p({
    id: "khar-corset-top",
    name: "Khar Lace-up Corset Top",
    cats: ["tops"],
    price: 1390,
    was: 1690,
    colour: "Chalk",
    swatches: [["Chalk", "#f1efe8"]],
    plans: ["party", "date-night"],
    batch: [60, 12],
    out: ["XS"],
    img: ["products/khar-corset-top.webp"],
    alt: "Model in a white lace-up corset top with a grey cargo mini skirt",
    desc: "Pintucked cotton with a lace-up front and a peplum hem. Adjusts to you, not the other way round.",
    fabric: "Pintucked cotton dobby",
    fit: "Fitted through the bodice with a flared hem. Model is 5'9\" and wears S.",
  }),

  /* ---------------------------- Bottoms ---------------------------- */
  p({
    id: "banjara-satin-skirt",
    name: "Banjara Satin Maxi Skirt",
    cats: ["bottoms"],
    price: 1890,
    colour: "Ink",
    swatches: [["Ink", "#1b1b1b"], ["Olive", "#5c6140"]],
    plans: ["office", "date-night", "casual"],
    isNew: true,
    batch: [80, 44],
    img: ["products/banjara-satin-skirt.webp"],
    alt: "Model in a black satin maxi skirt and white tee",
    desc: "A column of washed satin that dresses up a plain tee and dresses down a blazer. Elastic at the back, so it's comfortable through dessert.",
    fabric: "Washed satin",
    fit: "High rise, straight through the hip. Model is 5'7\" and wears S.",
    care: CARE.satin,
  }),
  p({
    id: "anjuna-skirt",
    name: "Anjuna Column Skirt",
    cats: ["bottoms"],
    price: 1690,
    colour: "Gulabi",
    swatches: [["Gulabi", "#f0688c"], ["Ink", "#1b1b1b"]],
    plans: ["vacation", "party"],
    batch: [60, 20],
    img: ["products/anjuna-skirt.webp"],
    alt: "Model in a bright pink column skirt and white bandeau top",
    desc: "A fold-over waist and a long, lean line in the loudest pink we could dye.",
    fabric: "Stretch jersey",
    fit: "Body-skimming, with a fold-over waistband. Model is 5'6\" and wears S.",
  }),
  p({
    id: "mylapore-maxi-skirt",
    name: "Mylapore Tiered Maxi Skirt",
    cats: ["bottoms", "festive"],
    price: 2190,
    colour: "Kalamkari",
    swatches: [["Kalamkari", "#9c2f2a"]],
    plans: ["vacation", "festive"],
    batch: [40, 15],
    img: ["products/mylapore-maxi-skirt.webp"],
    alt: "Model in a colourful tiered maxi skirt and white top by the water",
    desc: "Three tiers of block-printed cotton that take up the whole pavement when you turn around. Fully lined.",
    fabric: "Block-printed cotton, cotton lining",
    fit: "Drawstring waist, full sweep. Model is 5'8\" and wears M.",
  }),
  p({
    id: "churchgate-mini",
    name: "Churchgate Check Mini Skirt",
    cats: ["bottoms"],
    price: 1590,
    colour: "Mono check",
    swatches: [["Mono check", "#8c8c8c"]],
    plans: ["party", "office"],
    soldOut: true,
    batch: [60, 0],
    img: ["products/churchgate-mini.webp"],
    alt: "Model in a black and white check mini skirt and black blazer",
    desc: "A tweedy check mini with a frayed hem. Went in a weekend. Hit notify and we'll message you when the next batch is cut.",
    fabric: "Yarn-dyed check tweed",
    fit: "High rise, A-line. Model is 5'9\" and wears S.",
    care: CARE.satin,
  }),

  /* ----------------------------- Denim ----------------------------- */
  p({
    id: "versova-paperbag-jeans",
    name: "Versova Paperbag Jeans",
    cats: ["denim", "bottoms"],
    price: 2690,
    colour: "Stonewash",
    swatches: [["Stonewash", "#8aa2bb"]],
    plans: ["casual"],
    isNew: true,
    batch: [80, 33],
    img: ["products/versova-paperbag-jeans.webp"],
    alt: "Light stonewash jeans with a paperbag tie waist, worn with white trainers",
    desc: "A paperbag waist with a self-tie belt and a cropped straight leg. Made for trainers and a tucked-in tee.",
    fabric: "Rigid cotton denim, stonewashed",
    fit: "High rise, straight leg, cropped at the ankle. Take your usual size.",
    care: CARE.denim,
  }),
  p({
    id: "besant-straight-jeans",
    name: "Besant Straight Jeans",
    cats: ["denim", "bottoms"],
    price: 2490,
    colour: "Sky wash",
    swatches: [["Sky wash", "#7ea6d0"], ["Deep indigo", "#22314f"]],
    plans: ["casual", "vacation"],
    batch: [100, 61],
    img: ["products/besant-straight-jeans.webp"],
    alt: "Sky blue straight-leg jeans worn with a white shirt",
    desc: "Our everyday pair. A clean mid-rise and a straight leg with just enough stretch to survive a long flight.",
    fabric: "Cotton denim with 2% stretch",
    fit: "Mid rise, straight through the leg. Take your usual size.",
    care: CARE.denim,
  }),
  p({
    id: "jodhpur-flare-jeans",
    name: "Jodhpur Flare Jeans",
    cats: ["denim", "bottoms"],
    price: 2890,
    colour: "Deep indigo",
    swatches: [["Deep indigo", "#22314f"]],
    plans: ["casual", "date-night"],
    batch: [60, 8],
    out: ["XS", "XL"],
    img: ["products/jodhpur-flare-jeans.webp"],
    alt: "Model sitting in dark indigo flared jeans and white boots",
    desc: "A proper seventies flare in dark indigo. Add heels and your legs go on for about a kilometre.",
    fabric: "Cotton denim with 1% stretch",
    fit: "High rise, fitted to the knee, wide flare. Cut long for heels.",
    care: CARE.denim,
  }),
  p({
    id: "shillong-denim-skirt",
    name: "Shillong Denim Midi Skirt",
    cats: ["denim", "bottoms"],
    price: 2190,
    colour: "Mid indigo",
    swatches: [["Mid indigo", "#4b6c9c"]],
    plans: ["casual", "office"],
    batch: [60, 26],
    img: ["products/shillong-denim-skirt.webp"],
    alt: "Model in a mid-blue denim midi skirt, leather jacket and hat",
    desc: "An A-line denim midi with a front split so you can actually walk in it.",
    fabric: "Soft cotton denim",
    fit: "High rise, A-line, hits mid-calf. Model is 5'5\" and wears S.",
    care: CARE.denim,
  }),
  p({
    id: "manali-denim-jacket",
    name: "Manali Cropped Denim Jacket",
    cats: ["denim", "tops"],
    price: 2990,
    colour: "Ice wash",
    swatches: [["Ice wash", "#b9c9d8"]],
    plans: ["casual"],
    isNew: true,
    batch: [50, 21],
    img: ["products/manali-denim-jacket.webp"],
    alt: "Model in a pale cropped denim jacket over a black dress",
    desc: "A shrunken trucker jacket in a pale ice wash. Throw it over a dress when the air-con is set to arctic.",
    fabric: "Rigid cotton denim, ice washed",
    fit: "Cropped at the waist, slightly boxy. Model is 5'6\" and wears S.",
    care: CARE.denim,
  }),

  /* ---------------------------- Festive ---------------------------- */
  p({
    id: "shantiniketan-saree",
    name: "Shantiniketan Handloom Saree",
    cats: ["festive"],
    price: 4490,
    colour: "Ivory & sindoor",
    swatches: [["Ivory & sindoor", "#efe6d2"]],
    sizes: ["Free size"],
    plans: ["festive"],
    batch: [30, 11],
    img: ["products/shantiniketan-saree.webp"],
    alt: "Model in an ivory handloom saree with a deep red blouse and gold jewellery",
    desc: "Ivory handloom cotton with a sindoor-red border, woven a few metres at a time. Comes with an unstitched blouse piece.",
    fabric: "Handloom cotton, 5.5 m with blouse piece",
    fit: "Free size. Blouse piece is 0.8 m, unstitched.",
    care: CARE.festive,
  }),
  p({
    id: "chandni-drape-set",
    name: "Chandni Chowk Drape Set",
    cats: ["festive"],
    price: 5990,
    was: 6990,
    colour: "Wine zari",
    swatches: [["Wine zari", "#6d1730"]],
    plans: ["festive", "party"],
    batch: [24, 5],
    out: ["XS", "L"],
    img: ["products/chandni-drape-set.webp"],
    alt: "Model in a wine embroidered blouse with a pre-draped skirt and dupatta",
    desc: "A zari-worked blouse with a pre-draped skirt and attached dupatta. The look of a saree, on in four minutes.",
    fabric: "Georgette with zari embroidery, satin lining",
    fit: "Fitted blouse with padded cups, pre-stitched drape. Model is 5'7\" and wears S.",
    care: CARE.festive,
  }),
  p({
    id: "lucknow-chikankari",
    name: "Lucknow Chikankari Kurta",
    cats: ["festive", "tops"],
    price: 2390,
    colour: "Mulberry",
    swatches: [["Mulberry", "#6b2148"], ["Chalk", "#f1efe8"]],
    plans: ["festive", "casual", "office"],
    isNew: true,
    batch: [60, 29],
    img: ["products/lucknow-chikankari.webp", "products/lucknow-chikankari-2.webp"],
    alt: "Model sitting on grass in a mulberry kurta with white chikankari embroidery",
    desc: "Sheer mulberry georgette with white chikankari worked by hand around the neck and cuffs. No two are identical, which is the point.",
    fabric: "Georgette with hand embroidery, slip included",
    fit: "Straight, knee length, relaxed through the body. Model is 5'5\" and wears S.",
    care: CARE.festive,
  }),
  p({
    id: "amer-kurta-set",
    name: "Amer Embroidered Kurta Set",
    cats: ["festive", "coords"],
    price: 3490,
    colour: "Sindoor",
    swatches: [["Sindoor", "#c21a24"]],
    plans: ["festive"],
    batch: [40, 13],
    img: ["products/amer-kurta-set.webp"],
    alt: "Model in a red kurta set with tonal embroidery, seated beside dried flowers",
    desc: "A V-neck kurta and straight trouser in sindoor red, with tonal thread embroidery at the hem and cuffs.",
    fabric: "Cotton silk with thread embroidery",
    fit: "Straight kurta, ankle-length trouser. Model is 5'6\" and wears S.",
    care: CARE.festive,
  }),
];

/* ------------------------------ Lookups ------------------------------ */
export const imgSrc = (path: string) => "/img/" + path;
export const byId = (id: string | null | undefined) => products.find((p) => p.id === id);
export const inCat = (id: string) => products.filter((p) => p.cats.includes(id));
export const inPlan = (id: string) => products.filter((p) => p.plans.includes(id));
export const isLow = (p: Product) => !p.soldOut && p.batch[1] / p.batch[0] <= 0.2;

export type ProductLabel = { text: string; tone: "sold" | "low" | "new" | "sale" };
export function labelFor(p: Product): ProductLabel | null {
  if (p.soldOut) return { text: "Sold out", tone: "sold" };
  if (isLow(p)) return { text: "Last few", tone: "low" };
  if (p.isNew) return { text: "New", tone: "new" };
  if (p.was) return { text: "Sale", tone: "sale" };
  return null;
}

export function searchProducts(query: string): Product[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return products.filter((p) => {
    const hay = [
      p.name,
      p.colour,
      p.fabric,
      ...p.cats.map((c) => categories.find((x) => x.id === c)?.name ?? ""),
      ...p.plans.map((id) => plans.find((x) => x.id === id)?.name ?? ""),
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}

export type ProductFilters = {
  cat?: string;
  plan?: string;
  size?: string;
  stock?: boolean;
  q?: string;
  drop?: boolean;
  sort?: string;
};

/** Filtering + sorting shared by the shop page and GET /api/products. */
export function filterProducts(f: ProductFilters, pool: Product[] = products): Product[] {
  let list = f.q ? searchProducts(f.q).filter((p) => pool.includes(p)) : pool.slice();
  if (f.drop) list = list.filter((p) => p.isNew);
  if (f.cat) list = list.filter((p) => p.cats.includes(f.cat!));
  if (f.plan) list = list.filter((p) => p.plans.includes(f.plan!));
  if (f.size) list = list.filter((p) => !p.soldOut && p.sizes.includes(f.size!) && !p.out.includes(f.size!));
  if (f.stock) list = list.filter((p) => !p.soldOut);

  const order = (p: Product) => products.indexOf(p);
  const sorters: Record<string, (a: Product, b: Product) => number> = {
    featured: (a, b) => Number(a.soldOut) - Number(b.soldOut) || Number(b.isNew) - Number(a.isNew) || order(a) - order(b),
    low: (a, b) => a.price - b.price,
    high: (a, b) => b.price - a.price,
    scarce: (a, b) => Number(a.soldOut) - Number(b.soldOut) || a.batch[1] - b.batch[1],
  };
  return list.sort(sorters[f.sort ?? "featured"] ?? sorters.featured);
}
