import {
  DEFAULT_MAGNIFICATION_CONFIG,
  DEFAULT_SCALEBAR_STATE,
} from "@/constant/config";
import { LoadedImage, Magnification, Scalebar } from "@/type/imageState";
import { atom } from "jotai";

export const imageAtom = atom<LoadedImage[]>([]);
export const imageUpdaterAtom = atom(
  null,
  (get, set, index: number, newImageItems: Partial<LoadedImage>) => {
    if (!get(imageAtom)[index]) return;
    set(imageAtom, (prev) =>
      prev.toSpliced(index, 1, { ...prev[index], ...newImageItems })
    );
  }
);
export const imageAdderAtom = atom(null, (_, set, image: LoadedImage) => {
  set(imageAtom, (prev) => [...prev, image]);
});
export const imageDeleterAtom = atom(null, (get, set, index: number) => {
  if (!get(imageAtom)[index]) return;
  set(imageAtom, (prev) => prev.toSpliced(index, 1));
});

export const workbenchIndexAtom = atom<number | undefined>(undefined);

const getFromLocalStorage = (): Scalebar | null => {
  const value: string | null = localStorage.getItem("scalebar");
  if (!value) return null;
  return JSON.parse(value);
};

export const getScalebarInitialState = () => {
  return { ...DEFAULT_SCALEBAR_STATE, ...getFromLocalStorage() };
};
export const scalebarAtom = atom<Scalebar>({ ...getScalebarInitialState() });

export const scalebarUpdaterAtom = atom(
  null,
  (_, set, newConfigItems: Partial<Scalebar>) => {
    set(scalebarAtom, (prev) => ({ ...prev, ...newConfigItems }));
  }
);

export const magnificationConfigAtom = atom<Magnification>({
  ...DEFAULT_MAGNIFICATION_CONFIG,
});
