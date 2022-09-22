import { getLineStyle } from "../lineReducer/constants";

export default function lineReducer(state, action) {
  const { winners, rect } = action.payload;

  switch (action.type) {
    case "recalculate style": {
      if (winners.length === 0) return state;
      if (rect[Object.keys(rect)[0]] === undefined) return state;
      const winners_ = winners.sort();
      const grid_length = winners_.length - 1;
      const gap = 10;
      const min_ = winners_[0];
      const max_ = winners_[grid_length];
      // min
      const min_y = Number(min_.substr(0, 1), 2);
      const min_x = Number(min_.substr(1, 1), 2);
      // max
      const max_y = Number(max_.substr(0, 1), 2);
      const max_x = Number(max_.substr(1, 1), 2);
      //
      const min_index = min_y + min_x + min_y * grid_length;
      const max_index = max_y + max_x + max_y * grid_length;
      // horizontal - check if min row === max row
      // vertical   - check if min col === max col
      // diagonal L   - check if min col === max col
      // diagonal R   - check if min col === max col
      let type =
        min_y === max_y
          ? "H"
          : min_x === max_x
            ? "V"
            : min_ === "00" && max_ === `${grid_length}${grid_length}`
              ? "D1"
              : "D0";
      //console.log(rect);
      // console.log(type, min_index, max_index);
      // console.log(rect[`item${min_index}`]);
      // console.log(rect[`item${max_index}`]);
      let lineType = getLineStyle(
        type,
        rect[`item${min_index}`],
        rect[`item${max_index}`],
        grid_length,
        gap,
        type === "H" ? min_y : type === "V" ? min_x : 0
      );
      // console.log(lineType);
      return { style: lineType };
    }
    default:
      return state;
  }
}

//https://rangle.github.io/react-training/redux-action-reducer/
//https://react-cn.github.io/react/tips/style-props-value-px.html
//When specifying a pixel value for your inline style prop,
//React automatically appends the string "px" for you after your number value, so this works:
//var divStyle = {height: 10}; // rendered as "height:10px"
//ReactDOM.render(<div style={divStyle}>Hello World!</div>, mountNode);
