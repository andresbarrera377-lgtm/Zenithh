import type { ArtSpec } from "@/lib/library/types";
import { CrystalArt } from "./CrystalArt";
import { FossilArt } from "./FossilArt";
import { RockArt } from "./RockArt";
import { TimeArt } from "./TimeArt";

/** Renders the procedural illustration for any library entry. */
export function SpecimenArt({ seed, art, className, title }: { seed: string; art: ArtSpec; className?: string; title?: string }) {
  switch (art.kind) {
    case "rock":
      return <RockArt seed={seed} texture={art.texture} palette={art.palette} className={className} title={title} />;
    case "fossil":
      return <FossilArt seed={seed} form={art.form} matrix={art.matrix} fossil={art.fossil} className={className} title={title} />;
    case "crystal":
      return <CrystalArt seed={seed} habit={art.habit} palette={art.palette} className={className} title={title} />;
    case "time":
      return <TimeArt unitId={art.unitId} className={className} title={title} />;
  }
}
