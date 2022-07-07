import React, { useMemo } from "react";
import "../style/index.less";

/**
 * 翻牌UI组件
 * @param {Element | String} cover
 * @param {Element | String} back
 * @param {Number | String} flipDuration
 * @param {Object} style
 * @param {Object} coverStyle
 * @param {Object} backStyle
 * @returns
 */
const Flip = ({
  cover,
  back,
  flipDuration = "1s",
  style = {},
  coverStyle = {},
  backStyle = {},
}) => {
  const duration = useMemo(() => {
    return flipDuration instanceof Number ? `${flipDuration}s` : flipDuration;
  }, [flipDuration]);

  const coverStyl = useMemo(() => {
    return { ...style, ...coverStyle, transitionDuration: duration };
  }, [style, coverStyle, duration]);

  const backStyl = useMemo(() => {
    return { ...style, ...backStyle, transitionDuration: duration };
  }, [style, backStyle, duration]);

  return (
    <div className="flip-card" style={style}>
      <div className="flip-cover" style={coverStyl}>
        {cover}
      </div>
      <div className="flip-back" style={backStyl}>
        {back}
      </div>
    </div>
  );
};

export default Flip;
