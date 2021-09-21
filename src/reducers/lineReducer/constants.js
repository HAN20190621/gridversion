export function getLineStyle(lineType, startPos, endPos, length, gap, div) {
  const newStyle = {
    position: "absolute",
    backgroundColor: "green",
    height: 5
  };
  const allowance = length * gap;
  switch (lineType) {
    case "H": {
      console.log(div);
      return {
        ...newStyle,
        left: 20,
        top:
          20 +
          (div === 0 ? 0 : div * startPos.height + div * gap) +
          startPos.height / 2 -
          5 / 2,
        width: endPos.right - startPos.left
      };
    }
    case "V":
      const v_left =
        20 +
        (startPos.left < startPos.width
          ? 0
          : div * startPos.width + div * gap) +
        startPos.width / 2 -
        5 / 2;
      return {
        ...newStyle,
        left: v_left,
        width: 5,
        top:
          (startPos.x < startPos.top
            ? 0
            : startPos.top - startPos.height + gap) + 20,
        height: endPos.bottom - startPos.top
      };
    case "D0":
      return {
        ...newStyle,
        right: 20,
        top: 20, // rect.top + rect.height / 2,
        width: Math.sqrt(
          Math.pow(endPos.left - startPos.left, 2) +
            Math.pow(
              endPos.bottom -
                startPos.top +
                (startPos.height / 2 + allowance / 2),
              2
            )
        ),
        transform: "rotate(-45deg)",
        transformOrigin: "bottom right"
      };
    case "D1":
      return {
        ...newStyle,
        left: 20 + gap / 2,
        top: 20, // rect.top + rect.height / 2,
        width: Math.sqrt(
          Math.pow(endPos.right - startPos.left, 2) +
            Math.pow(endPos.bottom - startPos.top - gap, 2)
        ),
        height: 5,
        //Math.sqrt(          rect.width * rect.width + rect.height * rect.height        ),
        transform: "rotate(45deg)",
        transformOrigin: "top left"

        // ...newStyle,
        // left: 4,
        // top: 0, // rect.top + rect.height / 2,
        // width: Math.sqrt(
        //   Math.pow(endPos.right - startPos.left - startPos.left / 2, 2) +
        //     Math.pow(endPos.bottom - startPos.top, 2)
        // ),
        // height: 5,
        // //Math.sqrt(          rect.width * rect.width + rect.height * rect.height        ),
        // transform: "rotate(45deg)",
        // transformOrigin: "top left"
      };
    // do nothing
    default:
      break;
  }
}
