import { h } from "preact";
import { css } from "emotion";
import { fill } from "../fill";
import { useState } from "preact/hooks";
import { Actions, ElementId } from "../root";

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

export function MovieChild(props: {
  state: { id: ElementId };
  dispatch: (action: Actions) => void;
}) {
  const { state, dispatch } = props;

  const format = "itemId";

  function dragStart(event: DragEvent) {
    const dt = event.dataTransfer;
    if (dt == null) {
      return;
    }

    dt.setData(format, state.id);
  }

  function dragOver(event: DragEvent) {
    event.preventDefault();
    const dt = event.dataTransfer;
    if (dt == null) {
      return;
    }
    dt.dropEffect = "move";
  }

  function drop(event: DragEvent) {
    event.stopPropagation();

    const dt = event.dataTransfer;
    if (dt == null) {
      return;
    }

    const targetId = dt.getData(format);
    dispatch({ type: "move", payload: { target: targetId, to: state.id } });
  }

  /** 埋め込み用のUrlのbase */
  const baseUrl = "https://www.youtube.com/embed/";

  const [url, setUrl] = useState("");

  return (
    <div
      class={child}
      draggable={true}
      onDragStart={dragStart}
      onDragOver={dragOver}
      onDrop={drop}
    >
      <div
        class={css({
          display: "grid",
          gridTemplateColumns: "auto 1fr auto auto",
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
        <button
          onClick={() => dispatch({ type: "del", payload: { id: state.id } })}
        >
          Del
        </button>
      </div>
      <div>
        <iframe class={fill} src={url}></iframe>
      </div>
    </div>
  );
}
