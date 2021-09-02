import { getLineStyle } from "../lineReducer/constants";

export default function lineReducer(state, action) {
  const { winners, rect } = action.payload;
  switch (action.type) {
    case "recalculate style": {
      // check if object is defined
      if (rect[Object.keys(rect)[0]] === undefined) return state;
      //console.log(Object.keys(rect).length);
      let lineType = getLineStyle(winners, rect);
      // console.log(lineType);
      return { style: lineType };
    }
    default:
      return state;
  }
}

//https://rangle.github.io/react-training/redux-action-reducer/
// horizontal = adjust left
// if index = 0 then adjust top -
// if index = 1 then do nothing
// if index = 3 then adjust top +
// rotate 0 degree

// vertical = adjust left
// if index = 0 then adjust top -
// if index = 1 then do nothing
// if index = 3 then adjust top +
// rotate 90 degree

// diagonal = adjust left
// if index = 0 then adjust top -
// if index = 1 then do nothing
// if index = 3 then adjust top +
// rotate 45 degree
//
// https://stackoverflow.com/questions/60881446/receive-dimensions-of-element-via-getboundingclientrect-in-react

// useEffect(() => {
//   const winners = game.winners;
//   if (winners.winners === undefined) return;
//   if (winners.winners.length !== 3) return;
//   const temp = [...winners.winners];
//   temp.sort();
//   const x = {
//     horizontal: [
//       [0, 1, 2],
//       [3, 4, 5],
//       [6, 7, 8]
//     ],
//     vertical: [
//       [0, 3, 6],
//       [1, 4, 7],
//       [2, 5, 8]
//     ],
//     diagonal: [
//       [0, 4, 8],
//       [2, 4, 6]
//     ]
//   };

//   if (target === null) return;
//   // horizontal = adjust left
//   // if index = 0 then adjust top -
//   // if index = 1 then do nothing
//   // if index = 3 then adjust top +
//   // rotate 0 degree

//   // vertical = adjust left
//   // if index = 0 then adjust top -
//   // if index = 1 then do nothing
//   // if index = 3 then adjust top +
//   // rotate 90 degree

//   // diagonal = adjust left
//   // if index = 0 then adjust top -
//   // if index = 1 then do nothing
//   // if index = 3 then adjust top +
//   // rotate 45 degree
//   let typ = "";
//   let pos = 0;
//   let same = false;
//   const rect = target;
//   // https://stackoverflow.com/questions/60881446/receive-dimensions-of-element-via-getboundingclientrect-in-react
//   // console.log(`${rect.left} ${rect.top}`);
//   // console.log(`TYP=${typ}`);
//   for (const [k, val] of Object.entries(x)) {
//     typ = k;
//     for (let i = 0; i < val.length; i++) {
//       same = val[i].every((j, idx) => j === temp[idx]);
//       if (same) {
//         pos = i;
//         break;
//       }
//     }
//     if (same) break;
//   }
//   //
//   switch (typ) {
//     case "horizontal":
//       switch (pos) {
//         case 0:
//           setLineStyle({
//             position: "absolute",
//             left: rect.left,
//             top: rect.top + rect.height * 0.16,
//             width: rect.width
//           });
//           break;
//         case 1:
//           setLineStyle({
//             position: "absolute",
//             left: rect.left,
//             top: rect.top + rect.height * 0.5,
//             width: rect.width
//           });
//           break;
//         case 2:
//           setLineStyle({
//             position: "absolute",
//             left: rect.left,
//             top: rect.top + rect.height * 0.85,
//             width: rect.width
//           });
//           break;
//         default:
//         // do nothing
//       }
//       break;
//     case "vertical":
//       switch (pos) {
//         case 0:
//           setLineStyle({
//             position: "absolute",
//             left: rect.left + rect.width * 0.17,
//             top: rect.top,
//             width: "10px",
//             height: rect.height
//           });
//           break;
//         case 1:
//           setLineStyle({
//             position: "absolute",
//             left: rect.left + rect.width * 0.5,
//             top: rect.top,
//             width: "10px",
//             height: rect.height
//           });
//           break;
//         case 2:
//           setLineStyle({
//             position: "absolute",
//             left: rect.left + rect.width * 0.825,
//             top: rect.top,
//             width: "10px",
//             height: rect.height
//           });
//           break;
//         default:
//         // do nothing
//       }
//       break;
//     case "diagonal":
//       switch (pos) {
//         case 0:
//           setLineStyle({
//             position: "absolute",
//             left: rect.left,
//             top: rect.top, // rect.top + rect.height / 2,
//             width: Math.sqrt(
//               rect.width * rect.width + rect.height * rect.height
//             ),
//             transform: "rotate(48deg)",
//             transformOrigin: "top left"
//           });
//           break;
//         case 1:
//           setLineStyle({
//             position: "absolute",
//             // left: rect.left + rect.width,
//             top: rect.top + rect.height, // rect.top + rect.height / 2,
//             width: Math.sqrt(
//               rect.width * rect.width + rect.height * rect.height
//             ),
//             transform: "rotate(-48deg)",
//             transformOrigin: "top left"
//           });
//           break;
//         default:
//         // do nothing
//       }
//       break;
//     default:
//     // do nothing
//   }
// }, [game.winners, target]);
