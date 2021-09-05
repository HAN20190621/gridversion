// https://react.school/ui/button
import React, { useCallback } from "react";
import PropTypes from "prop-types";

const Square = ({ idx, value, style, onClick, className, setPositions }) => {
  //const [itemPos, setItemPos] = useState();

  const itemRef = useCallback(
    (ref) => {
      if (ref) {
        let item = ref?.getBoundingClientRect().toJSON();
        //console.log(idx);
        setPositions((prev) => {
          if (Object.keys(prev)["item" + idx] === undefined) {
            return {
              ...prev,
              ["item" + idx]: item
            };
          }
        });
      }
    },
    [setPositions, idx]
  );

  // useEffect(() => {
  //   setPositions((prev) => {
  //     return { ...prev, ["item" + idx]: itemPos };
  //   });
  // }, [itemPos, idx, setPositions]);

  return (
    <button
      ref={itemRef}
      className={className}
      style={style}
      value={value}
      key={`sq${idx}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

Square.propTypes = {
  idx: PropTypes.number,
  value: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  className: PropTypes.string,
  setPositions: PropTypes.func
};

Square.defaultProps = {
  idx: 0,
  style: { color: "red" },
  value: "x",
  onClick: () => {}
};

export default Square;
