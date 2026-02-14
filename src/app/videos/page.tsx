import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { ScaleToFit } from "@/components/productos/scale-to-fit";
import { TVVideosBoard } from "@/components/videos/TVVideosBoard";
import type { Video } from "@/lib/types/database";

const CACHE_TAG = "videos-tv";
const REVALIDATE_SECONDS = 86400; // 24 horas: reduce peticiones a BD

async function fetchVideos(): Promise<Video[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("videos")
    .select("id, name, file_url, order_index")
    .order("order_index", { ascending: true })
    .order("name", { ascending: true });
  return (data ?? []) as Video[];
}

export default async function VideosPage() {
  const getCached = unstable_cache(fetchVideos, [CACHE_TAG], {
    revalidate: REVALIDATE_SECONDS,
    tags: [CACHE_TAG],
  });

  const videos = await getCached();

  return (
    <ScaleToFit>
      <div className="h-full w-full">
        <TVVideosBoard initialVideos={videos} />
      </div>
    </ScaleToFit>
  );
}
