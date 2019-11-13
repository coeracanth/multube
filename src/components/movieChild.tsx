import { h } from "preact";
import { css } from "emotion";
import { fill } from "../fill";
import { useState } from "preact/hooks";

const child = css(
  {
    display: "grid",
    gridTemplateRows: `auto 1fr`,
  },
  fill
);

function getURLParams(path: string) {
  if (path == null) return [];

  const paramsStr = path.match(/\?([^?]*)$/);

  if (paramsStr == null || paramsStr[1] === "") return [];

  const params = paramsStr[1].split("&");

  return params.map(x => {
    const newLocal = x.split("=");
    return {
      key: newLocal[0],
      value: newLocal[1],
    };
  });
}

export function MovieChild() {
  /** 埋め込み用のUrlのbase */
  const baseUrl = "https://www.youtube.com/embed/";
  const [url, setUrl] = useState("");

  return (
    <div class={child}>
      <div
        class={css({
          display: "grid",
          gridTemplateColumns: "auto 1fr",
        })}
      >
        <span>URL : </span>
        <input
          value={url}
          onChange={e => {
            const targ = e.target as any;
            if (targ == null || targ.value == null) {
              return;
            }

            const val = targ.value as string;
            // 埋め込み用のUrlはそのまま
            if (val.includes(baseUrl)) {
              setUrl(val);
              return;
            }

            if (val.startsWith("https://www.youtube.com/")) {
              const params = getURLParams(val);
              const videoId = params.find(x => x.key === "v");
              // youtubeのUrl形式そのままなら、id部分だけ切り取って埋め込み用に変換する。
              if (videoId != null) {
                setUrl(baseUrl + videoId.value);
                return;
              }
            }

            if (val.startsWith("https://youtu.be/")) {
              setUrl(val.replace("https://youtu.be/", baseUrl));
              return;
            }

            // niconicoのUrlなら埋め込み用に変換する。
            if (val.startsWith("https://www.nicovideo.jp/watch/")) {
              setUrl(
                val.replace(
                  "https://www.nicovideo.jp/",
                  "https://embed.nicovideo.jp/"
                )
              );
              return;
            }

            // その他のサイトはそのまま
            if (val.startsWith("http")) {
              setUrl(val);
              return;
            }

            // id部分だけ貼られた場合を想定してるけどわざわざそんなことするかは疑問
            setUrl(baseUrl + val);
          }}
        ></input>
      </div>
      <div>
        <iframe class={fill} src={url}></iframe>
      </div>
    </div>
  );
}
