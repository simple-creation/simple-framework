import React from "react";
import Masonry from "../../src/components/masonry";

const defaultList = Array(20)
  .fill(null)
  .map((_, index) => index);
class TestMasonry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: defaultList,
    };
  }

  handleScroll = () => {
    this.setState({
      list: this.state.list.concat(defaultList)
    });
  };

  render() {
    const { list } = this.state;
    return <Masonry data={list} columns={4} gap={20} onScroll={this.handleScroll} />;
  }
}

export default TestMasonry;
