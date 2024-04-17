import { ScrollArea } from "@/components/ui/scroll-area";
import {
  imageAdderAtom,
  imageAtom,
  workbenchIndexAtom,
} from "@/state/imageState";

import { useAtom } from "jotai";

import { useRef } from "react";
import LoadedImageItem from "@/components/LoadedImageItem";
import { Button } from "@/components/ui/button";
import { ExecDownloadRef } from "@/type/execDownloadRef";

import { readFiles } from "@/util/readFile";

const LoadedImages = () => {
  const [loadedImages] = useAtom(imageAtom);
  const [workbenchIndex] = useAtom(workbenchIndexAtom);
  const [, addLoadedImage] = useAtom(imageAdderAtom);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<Map<Symbol, ExecDownloadRef>>();

  const getMap = () => {
    if (!imagesRef.current) {
      imagesRef.current = new Map();
    }
    return imagesRef.current;
  };

  // 画像を読み込んだときのハンドラ
  const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      readFiles(addLoadedImage)(fileArray);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-72 p-6 h-screen">
      <input
        type="file"
        onChange={handleInputFile}
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        multiple
      />
      <Button
        className="w-full"
        variant="outline"
        onClick={() => {
          fileInputRef.current?.click();
        }}
      >
        ファイルを選択
      </Button>
      <ScrollArea className="h-[calc(100vh-8rem)] w-full">
        {loadedImages.map((loadedImage, index) => (
          <LoadedImageItem
            {...{ loadedImage, index }}
            key={index}
            active={index === workbenchIndex}
            ref={(node) => {
              const map = getMap();
              if (node) {
                map.set(loadedImage.id, node);
              } else {
                map.delete(loadedImage.id);
              }
            }}
          />
        ))}
      </ScrollArea>
      <Button
        onClick={() => {
          imagesRef.current?.forEach((ref) => {
            ref.execDownload();
          });
        }}
        className="h-10 w-full box-border"
        disabled={!loadedImages.length}
      >
        すべて保存
      </Button>
    </div>
  );
};

export default LoadedImages;
