import { css } from "emotion";
import { h } from "preact";
import { useState, useReducer } from "preact/hooks";
import { fill } from "./fill";
import { MovieChild } from "./components/movieChild";
import { produce } from "immer";

export function Root() {
  const [cols, setCols] = useState(1);
  const [st, dispatch] = useReducer(reducer, { list: [] });

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
        <button onClick={() => dispatch({ type: "add" })}>Add</button>
      </div>
      <div class={moviesParent}>
        {st.list.map(x => (
          <MovieChild
            state={{ id: x.id }}
            dispatch={dispatch}
            key={`${x.id}`}
          ></MovieChild>
        ))}
      </div>
    </div>
  );
}

interface IState {
  list: {
    id: ElementId;
  }[];
}

const reducer = (st: IState, action: Actions) => {
  switch (action.type) {
    case "add":
      return produce(st, draft => {
        draft.list = [...st.list, { id: getId() }];
      });
    case "del":
      return produce(st, draft => {
        draft.list = st.list.filter(x => x.id !== action.payload.id);
      });
    default:
      return st;
  }
};
export type ElementId = string;
function getId(): ElementId {
  return Math.random()
    .toString(36)
    .substring(2);
}

interface AAdd {
  type: "add";
}
interface ADel {
  type: "del";
  payload: { id: ElementId };
}
export type Actions = AAdd | ADel;
