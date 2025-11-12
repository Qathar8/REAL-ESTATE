import { useMemo } from "react";
import View360, {
  EquirectProjection,
  Projection
} from "@egjs/react-view360";
import "@egjs/react-view360/css/view360.min.css";

type VirtualTourViewerProps = {
  title?: string;
  tourUrl?: string | null;
  assetUrl?: string | null;
  height?: number;
};

const imageExtensions = ["jpg", "jpeg", "png", "webp"];
const videoExtensions = ["mp4", "webm", "mov"];

const getExtension = (url?: string | null) => {
  if (!url) return null;
  const parts = url.split(".");
  return parts.pop()?.toLowerCase() ?? null;
};

export const VirtualTourViewer = ({
  title = "Virtual Tour",
  tourUrl,
  assetUrl,
  height = 420
}: VirtualTourViewerProps) => {
  const assetExt = getExtension(assetUrl);

  const projection = useMemo<Projection | null>(() => {
    if (assetUrl && assetExt && imageExtensions.includes(assetExt)) {
      return new EquirectProjection({
        src: assetUrl,
        widthSegments: 64,
        heightSegments: 32
      });
    }
    return null;
  }, [assetExt, assetUrl]);

  if (projection) {
    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <View360
          projection={projection}
          className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm"
          style={{ height }}
        />
      </div>
    );
  }

  if (assetUrl && assetExt && videoExtensions.includes(assetExt)) {
    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <video
          controls
          src={assetUrl}
          className="w-full rounded-3xl border border-slate-200 shadow-sm"
          style={{ height }}
        />
      </div>
    );
  }

  if (tourUrl) {
    return (
      <div className="flex flex-col gap-3" id="virtual-tour">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
          <iframe
            title={title}
            src={tourUrl}
            className="h-[420px] w-full"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
      No virtual tour available for this property yet.
    </div>
  );
};

