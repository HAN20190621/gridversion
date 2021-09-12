const LINE_TYPE = {
  HORIZONTAL: {
    H0: [0, 1, 2],
    H1: [3, 4, 5],
    H2: [6, 7, 8]
  },
  VERTICAL: {
    V0: [0, 3, 6],
    V1: [1, 4, 7],
    V2: [2, 5, 8]
  },
  DIAGONAL: {
    D0: [0, 4, 8],
    D1: [2, 4, 6]
  }
};

//
function getLineType(items) {
  let same;
  let lineType;
  const temp = items;
  //console.log(items);
  temp.sort();
  for (const key1 in LINE_TYPE) {
    for (const [j, val2] of Object.entries(LINE_TYPE[key1])) {
      same =
        val2.length === temp.length &&
        val2.every(function (item, idx) {
          return item === temp[idx];
        });
      if (same) {
        lineType = j;
        break;
      }
    }
  }
  return lineType;
}

export function getLineStyle(items, rect) {
  const newStyle = {
    position: "absolute",
    backgroundColor: "green",
    height: 5
  };
  let lineType = getLineType(items);
  let startPos;
  let endPos;
  switch (lineType) {
    case "H0": {
      startPos = rect["item0"]; //Object.assign({}, rect.item0);
      endPos = rect["item2"];
      // console.log(startPos);
      // console.log(endPos);
      //console.log(rect["item0"]);
      //console.log(rect["item1"]);
      //console.log(rect["item2"]);
      return {
        ...newStyle,
        left: startPos.left,
        top: startPos.top + startPos.height / 2,
        width: endPos.left + endPos.width - startPos.left
      };
    }
    case "H1": {
      startPos = rect["item3"];
      endPos = rect["item5"];
      // console.log(endPos);
      console.log(rect["item2"]);
      console.log(rect["item5"]);
      //console.log(endPos.left + endPos.width - startPos.left);
      return {
        ...newStyle,
        left: startPos.left,
        top: startPos.top + startPos.height / 2,
        width: endPos.left + endPos.width - startPos.left
      };
    }
    case "H2":
      startPos = rect["item6"];
      endPos = rect["item8"];
      return {
        ...newStyle,
        left: startPos.left,
        top: startPos.top + startPos.height / 2,
        width: endPos.left + endPos.width - startPos.left
      };
    case "V0":
      startPos = rect["item0"];
      return {
        ...newStyle,
        left: startPos.left + startPos.width * 0.17,
        top: startPos.top,
        width: "10px",
        height: startPos.height
      };
    case "V1":
      startPos = rect["item1"];
      return {
        ...newStyle,
        left: startPos.left + startPos.width * 0.5,
        top: startPos.top,
        width: "10px",
        height: startPos.height
      };
    case "V2":
      startPos = rect["item2"];
      return {
        ...newStyle,
        left: startPos.left + startPos.width * 0.825,
        top: startPos.top,
        width: "10px",
        height: startPos.height
      };
    case "D0":
      startPos = rect["item0"];
      return {
        ...newStyle,
        left: startPos.left,
        top: startPos.top, // rect.top + rect.height / 2,
        height: startPos.height,
        width: Math.sqrt(
          startPos.width * startPos.width + startPos.height * startPos.height
        ),
        transform: "rotate(48deg)",
        transformOrigin: "top left"
      };
    case "D1":
      startPos = rect["item6"];
      return {
        ...newStyle,
        // left: rect.left + rect.width,
        top: startPos.top + startPos.height, // rect.top + rect.height / 2,
        width: startPos.width,
        height: startPos.height,
        //Math.sqrt(          rect.width * rect.width + rect.height * rect.height        ),
        transform: "rotate(-48deg)",
        transformOrigin: "top left"
      };
    // do nothing
    default:
      break;
  }
}

//https://react-cn.github.io/react/tips/style-props-value-px.html
//When specifying a pixel value for your inline style prop,
//React automatically appends the string "px" for you after your number value, so this works:
//var divStyle = {height: 10}; // rendered as "height:10px"
//ReactDOM.render(<div style={divStyle}>Hello World!</div>, mountNode);
