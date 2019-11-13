import { css } from "emotion";
import { h } from "preact";
import { useState } from "preact/hooks";
import { fill } from "./fill";
import { MovieChild } from "./components/movieChild";

export function Root() {
  const [cols, setCols] = useState(1);
  const [movieCount, setMovieCount] = useState(2);

  const moviesParent = css(
    {
      display: "grid",
      gridTemplateColumns: `repeat(${cols},1fr)`,
    },
    fill
  );

  return (
    <div
      class={css(
        {
          display: "grid",
          gridTemplateRows: "auto 1fr",
          backgroundColor: "hsl(0,0%,20%)",
          color: "whitesmoke",
        },
        fill
      )}
    >
      <div>
        表示列数:
        <input
          type="number"
          value={cols}
          min="1"
          onChange={e => {
            const targ = e.target as any;
            if (targ == null || targ.value == null) {
              return;
            }

            setCols(targ.value);
          }}
        ></input>
        表示動画数:
        <input
          type="number"
          min="0"
          value={movieCount}
          onChange={e => {
            const targ = e.target as any;
            if (targ == null || targ.value == null) {
              return;
            }

            setMovieCount(Number(targ.value));
          }}
        ></input>
      </div>
      <div class={moviesParent}>
        {Array.from(Array(movieCount).keys()).map(i => (
          <MovieChild key={`child_${i}`}></MovieChild>
        ))}
      </div>
    </div>
  );
}
