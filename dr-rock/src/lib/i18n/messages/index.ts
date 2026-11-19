import type { Locale } from "../config";
import { analysis } from "./analysis";
import { app } from "./app";
import { capture } from "./capture";
import { collection } from "./collection";
import { common } from "./common";
import { history } from "./history";
import { landing } from "./landing";
import { library } from "./library";
import { pages } from "./pages";
import { pwa } from "./pwa";
import { report } from "./report";
import { scan } from "./scan";

/** Every UI namespace, in both languages. Add new namespaces here. */
const NAMESPACES = { analysis, app, capture, collection, common, history, landing, library, pages, pwa, report, scan };

export type Messages = { [K in keyof typeof NAMESPACES]: (typeof NAMESPACES)[K]["es"] };

function build(locale: Locale): Messages {
  return Object.fromEntries(Object.entries(NAMESPACES).map(([k, v]) => [k, v[locale]])) as Messages;
}

export const MESSAGES: Record<Locale, Messages> = { es: build("es"), en: build("en") };
