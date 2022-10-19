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
  value?: number | null;
};
type MainStore = {
  count: number;
  list: BlockType[][];
};

type ActionPayload = {
  type: "add" | "genereate" | "clear" | "move";
  payload?: BlockType & {
    direction?: DirectionsType;
  };
};

const getHorizontalCornerItem = (arr: number = 0, position: string): number => {
  if (position === Directions.left){
    return 0
  } else {
    return arr - 1
  }
}

const MainReducer = (state: MainStore, action: ActionPayload): MainStore => {
  switch (action.type) {
    case "genereate":
      state.list = [];
      for (let index = 0; index < state.count; index++) {
        const arr = [];
        const weights = [0.3, 0.1, 0.8];
        const results = [2, 4, 0];
        for (let iindex = 0; iindex < state.count; iindex++) {
          arr.push({
            id: uuidv4(),
            value: getRandom(weights, results),
          });
        }
        state.list.push(arr);
      }
      return state;
    case "move":
      for (let index = 0; index < state.list.length; index++) {
        const item = state.list[index];
        let newValue = 0;
        item.forEach((i, index) => newValue += Number(i.value));
        state.list[index] = state.list[index].map((i, index) => ({
          id: i.id,
          value: 0
        }));
        const corner = getHorizontalCornerItem(item.length, String(action.payload?.direction))
        state.list[index][corner].value = newValue
        console.log(original(state.list))
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
            <></>
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
      {store.list.map((i, index) => (
        <RowBlocks items={i} key={index} />
      ))}
    </>
  );
};

export default App;
