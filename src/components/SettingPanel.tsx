import { DEFAULT_MAGNIFICATION_CONFIG } from "@/constant/config";
import {
  SCALEBAR_COLOR_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  FontWeightOption,
  ScalebarColorOption,
  OBJLENS_OPTIONS,
  ObjlensOption,
} from "@/type/options";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAtom } from "jotai";
import {
  scalebarAtom,
  imageAtom,
  magnificationConfigAtom,
  scalebarUpdaterAtom,
  selectedIdAtom,
  imageUpdaterAtom,
} from "@/state/imageState";
import { useCallback, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import NumericInput from "@/components/NumericInput";
import { updateObject } from "@/util/updateObject";

const SettingPanel = () => {
  const [scalebarConfig] = useAtom(scalebarAtom);
  const [loadedImages, setLoadedImages] = useAtom(imageAtom);
  const [magConf, setMagConf] = useAtom(magnificationConfigAtom);
  const [, updateScalebarConfig] = useAtom(scalebarUpdaterAtom);
  const [selectedId] = useAtom(selectedIdAtom);
  const [, updateLoadedImage] = useAtom(imageUpdaterAtom);
  const { objLens = "x200", color = "white" } = useMemo(() => {
    const image = loadedImages.find((element) => element.id === selectedId);
    if (selectedId === undefined || !image)
      return {
        image: undefined,
        name: undefined,
        objLens: undefined,
        color: undefined,
      };
    return image;
  }, [loadedImages, selectedId]);

  // 対物レンズの倍率の型であることのテスト
  const isObjLensOption = useCallback(
    (str: string): str is ObjlensOption => {
      return OBJLENS_OPTIONS.some((item) => item === str);
    },
    [OBJLENS_OPTIONS]
  );

  // 倍率の切り替え
  const handleObjLensChange = (v: string) => {
    isObjLensOption(v) &&
      setLoadedImages((prev) => {
        if (selectedId === undefined) return prev;
        return prev.map((item) => {
          if (item.id !== selectedId) return item;
          return {
            ...item,
            objLens: v,
          };
        });
      });
  };

  // スケールバーの色の型であるかのテスト
  const isScalebarColor = useCallback(
    (str: string): str is ScalebarColorOption => {
      return SCALEBAR_COLOR_OPTIONS.some((item) => item === str);
    },
    [SCALEBAR_COLOR_OPTIONS]
  );

  // スケールバーの色の切り替え
  const handleScalebarColorChange = (v: string) => {
    isScalebarColor(v) &&
      selectedId !== undefined &&
      updateLoadedImage(selectedId, { color: v });
  };

  // 文字の太さの型であるかのテスト
  const isFontWeight = useCallback(
    (str: string): str is FontWeightOption => {
      return FONT_WEIGHT_OPTIONS.some((item) => item === str);
    },
    [FONT_WEIGHT_OPTIONS]
  );

  // 文字の太さの切り替え
  const handleFontWeightChange = (v: string) => {
    if (isFontWeight(v)) {
      localStorage.setItem(
        "scalebar",
        JSON.stringify(updateObject(scalebarConfig, { fontWeight: v }))
      );
      updateScalebarConfig({ fontWeight: v });
    }
  };

  return (
    <div className="w-72 p-6 h-full flex-grow-0 flex-shrink-0">
      <ScrollArea className="h-full">
        <div className="mx-1">
          <div>倍率</div>
          <Select
            value={objLens ?? "x200"}
            onValueChange={handleObjLensChange}
            disabled={selectedId === undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="倍率" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(DEFAULT_MAGNIFICATION_CONFIG).map((item) => {
                return (
                  <SelectItem value={`${item}`} key={item}>
                    {item}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Separator className="my-4" />

          <div>色</div>
          <Select
            value={color}
            onValueChange={handleScalebarColorChange}
            disabled={selectedId === undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="スケールバーの色" />
            </SelectTrigger>
            <SelectContent>
              {SCALEBAR_COLOR_OPTIONS.map((item) => {
                return (
                  <SelectItem value={`${item}`} key={item}>
                    {item}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Separator className="my-4" />

          <div>スケールバーの長さ</div>
          <div className="flex gap-3">
            <NumericInput
              outerState={magConf[objLens].length}
              setState={(value: number) => {
                setMagConf((prev) => {
                  return {
                    ...prev,
                    [objLens]: {
                      ...prev[objLens],
                      length: value,
                    },
                  };
                });
              }}
              disabled={selectedId === undefined}
            />
            <div className="flex items-center">um</div>
          </div>

          <Separator className="my-4" />

          <div>スケールバーの太さ</div>
          <div className="flex gap-3">
            <NumericInput
              setState={(value) => {
                localStorage.setItem(
                  "scalebar",
                  JSON.stringify(
                    updateObject(scalebarConfig, { lineWidth: value })
                  )
                );
                updateScalebarConfig({
                  lineWidth: value,
                });
              }}
              outerState={scalebarConfig.lineWidth}
              disabled={selectedId === undefined}
            />
            <div className="flex items-center">px</div>
          </div>

          <Separator className="my-4" />

          <div>文字の大きさ</div>
          <div className="flex gap-3">
            <NumericInput
              setState={(value) => {
                localStorage.setItem(
                  "scalebar",
                  JSON.stringify(
                    updateObject(scalebarConfig, { fontSize: value })
                  )
                );
                updateScalebarConfig({ fontSize: value });
              }}
              outerState={scalebarConfig.fontSize}
              disabled={selectedId === undefined}
            />
            <div className="flex items-center">px</div>
          </div>

          <Separator className="my-4" />

          <div>文字の太さ</div>
          <Select
            value={scalebarConfig.fontWeight}
            onValueChange={handleFontWeightChange}
            disabled={selectedId === undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="文字の太さ" />
            </SelectTrigger>
            <SelectContent>
              {FONT_WEIGHT_OPTIONS.map((item) => {
                return (
                  <SelectItem value={`${item}`} key={item}>
                    {item}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SettingPanel;
