import produce, { original } from "immer";
import React, { useState, useEffect, useReducer, useCallback } from "react";
import { getRandom, uuidv4 } from "./funcs";

enum Directions {
  left = "left",
  right = "right",
  top = "top",
  bottom = "bottom",
}
type DirectionsType = Directions;
type BlockType = {
  id: number;
  value: number;
};
type MainStore = {
  count: number;
  list: Record<number, BlockType[]>;
};

type ActionPayload = {
  type: "add" | "genereate" | "clear" | "move";
  payload?: BlockType & {
    direction?: DirectionsType;
  };
};

const moveHorizontal = (list: any[]) => {
  const items = list;
  items.forEach((item, index) => {
    if (
      Number(items[index - 1]?.value) === Number(item?.value) ||
      items[index - 1]?.value === 0
    ) {
      items[index - 1] = {
        ...items[index - 1],
        value: Number(items[index - 1]?.value) + Number(item?.value),
      };
      items[index] = {
        ...item,
        value: 0,
      };
    }
  });
  return items;
};
const MainReducer = (state: MainStore, action: ActionPayload): MainStore => {
  switch (action.type) {
    case "genereate":
      state.list = [];
      for (let index = 0; index < 4; index++) {
        const arr = [];
        const weights = [0.3, 0.1, 0.8];
        const results = [2, 4, 0];
        for (let iindex = 0; iindex < state.count; iindex++) {
          arr.push({
            id: uuidv4(),
            value: getRandom(weights, results),
          });
        }
        state.list[index] = arr;
      }
      return state;
    case "move":
      const columns = Object.keys(state.list);

      if (action.payload?.direction === "left") {
        columns.forEach((key: any) => {
          state.list[key] = moveHorizontal(state.list[key]);
        });
      } else if (action.payload?.direction === "right") {
        columns.forEach((key: any) => {
          state.list[key] = moveHorizontal(state.list[key].reverse()).reverse();
        });
      } else if (action.payload?.direction === "top") {
        columns.forEach((key: string, i, arr) => {
          const prevItemKey = Number(arr[i - 1]);
          const topItem = state.list[prevItemKey] && state.list[prevItemKey][i];
          const currentItem =
            state.list[Number(key)] && state.list[Number(key)][i];
          if (
            Number(topItem?.value) === Number(currentItem?.value) ||
            Number(topItem?.value) === 0
          ) {
            state.list[prevItemKey][i] = {
              id: topItem?.id,
              value: Number(topItem?.value) + Number(currentItem?.value),
            };
            state.list[Number(key)][i] = {
              id: state.list[Number(key)][i]?.id,
              value: 0,
            };
          }
        });
      } else if (action.payload?.direction === "bottom") {
        columns.forEach((key: string, i, arr) => {
          const nextItemKey = Number(arr[i + 1]);
          const currentItem =
            state.list[Number(key)] && state.list[Number(key)][i];
          const nextItem =
            state.list[nextItemKey] && state.list[nextItemKey][i];
          // console.log(original(arr));
          if (
            Number(nextItem?.value) === Number(currentItem?.value) ||
            nextItem?.value === 0
          ) {
            state.list[nextItemKey][i] = {
              id: nextItem?.id,
              value: Number(nextItem?.value) + Number(currentItem?.value),
            };
            state.list[Number(key)][i] = {
              id: state.list[Number(key)][i]?.id,
              value: 0,
            };
          }
        });
      }
      return state;
    default:
      throw new Error();
  }
};

const RowBlocks = ({ items }: { items: BlockType[] }) => {
  return (
    <div
      style={{
        backgroundColor: "blue",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {items.map((block) => (
        <div
          style={{
            backgroundColor: "lightblue",
            margin: "10px",
            height: "150px",
            width: "150px",
          }}
          key={block.id}
        >
          {!!block.value ? (
            <div
              style={{
                fontSize: "50px",
                textAlign: "center",
                margin: "40px 0",
                userSelect: "none",
              }}
            >
              {block.value}
            </div>
          ) : (
            <>{block.value}</>
          )}
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [store, dispatch] = useReducer<typeof MainReducer>(
    produce(MainReducer),
    {
      count: 4,
      list: [],
    }
  );

  const dispatchMovement = useCallback((direction: DirectionsType) => {
    return dispatch({
      type: "move",
      payload: {
        direction: direction,
        id: 0,
        value: 0,
      },
    });
  }, []);
  useEffect(() => {
    const listener = (key: KeyboardEvent) => {
      if (key.code === "ArrowLeft") {
        dispatchMovement(Directions.left);
      } else if (key.code === "ArrowUp") {
        dispatchMovement(Directions.top);
      } else if (key.code === "ArrowRight") {
        dispatchMovement(Directions.right);
      } else if (key.code === "ArrowDown") {
        dispatchMovement(Directions.bottom);
      }
    };
    document.addEventListener("keydown", listener, false);
    return () => document.removeEventListener("keydown", listener);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          dispatch({
            payload: {
              id: 0,
              value: 0,
            },
            type: "genereate",
          });
        }}
      >
        ASDSADSAD
      </button>
      {Object.values(store.list).map((i, index) => (
        <RowBlocks items={i} key={index} />
      ))}
    </>
  );
};

export default App;
