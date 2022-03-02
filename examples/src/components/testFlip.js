import React from "react";
import Flip from "../../../src/components/flip";

const style = {
  padding: "8px 20px",
};

const backStyle = {
  background: "pink",
};

const coverStyle = {
  background: 'orange'
}

/**
 * 使用翻牌UI组件 Example
 */
class TestFlip extends React.Component {
  render() {
    return (
      <Flip
        cover={<p>我是前面</p>}
        back={<p>我是后面</p>}
        style={style}
        backStyle={backStyle}
        coverStyle={coverStyle}
      />
    );
  }
}

export default TestFlip;
