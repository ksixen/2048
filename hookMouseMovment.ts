// useEffect(() => {
//     let downFlag = false;
//     const position = {
//       X: 0,
//       Y: 0,
//     };
//     let direction = "";
//     const listener = (down: MouseEvent) => {
//       downFlag = true;
//       // Record click position
//       position.X = down.pageX;
//       position.Y = down.pageY;
//     };
//     const mouseUp = (up: MouseEvent) => {
//       downFlag = false;
//     };

//     const onMouseMove = (move: MouseEvent) => {
//       if (downFlag) {
//         if (position.X !== move.pageX || position.Y !== move.pageY) {
//           // Do stuff here

//           const toLeft = move.pageX < position.X;
//           const toRight = move.pageX > position.X;

//           if (toLeft) {
//             direction = "left";
//           } else if (toRight) {
//             direction = "right";
//           }
//           console.log(direction);
//         }
//       }
//     };
//     window.addEventListener("mousedown", listener, false);
//     window.addEventListener("mouseup", mouseUp, false);
//     window.addEventListener("mousemove", onMouseMove, false);
//     return () => {
//       window.removeEventListener("dragend", listener);
//       window.removeEventListener("mouseup", mouseUp);
//       window.removeEventListener("mousemove", onMouseMove);
//     };
//   }, []);
