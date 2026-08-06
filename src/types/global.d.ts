interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
  download_count: number;
}

interface ReleaseData {
  tag_name: string;
  name: string;
  published_at: string;
  body: string;
  assets: ReleaseAsset[];
}

type FetchState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; release: ReleaseData; apkAsset: ReleaseAsset };
