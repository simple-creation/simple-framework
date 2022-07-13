import React, { useRef, useState, useEffect, useMemo } from "react";
import { unstable_batchedUpdates } from "react-dom";
// import "../style/index.less";

let _heightArray = [];

function debounce(func, delay) {
  let timer;
  return function () {
    let context = this;
    let args = arguments;
    timer && clearTimeout(timer);
    timer = setTimeout(function () {
      func.apply(context, args);
    }, delay);
  };
}

class Bitmap extends React.Component {
  render() {
    let { index, item } = this.props;
    return <img src={item} alt="default bitmap" />;
  }
}

/**
 * required data：列表的数据
 * required component：渲染的单元组件
 * colums: 列数。 如不传自动根据容器宽度自动计算
 * gap: 每个单元间隔
 * key：列表的key
 * onScroll：滚动到底部更新数据
 */
const Masonry = ({
  key,
  data,
  gap,
  onScroll,
  columns: col,
  component: Component = Bitmap,
}) => {
  const [columns, setColumns] = useState(col);
  const [styles, setStyles] = useState([]);
  const [wrapW, setWrapW] = useState(null);
  const [wrapH, setWrapH] = useState(null);
  const wrapRef = useRef(null);
  const padding = useMemo(() => {
    return `${gap}px 0 0 ${gap}px`;
  }, [gap]);
  const style = useMemo(() => {
    return {
      width: wrapW,
      height: wrapH,
      marginLeft: `-${gap}px`,
      marginTop: `-${gap}px`,
    };
  }, [gap]);

  useEffect(() => {
    console.log(styles.length, "001");
    window.onload = () => {
      console.log(styles.length, "002");
      init();
    };
    if (styles.length) {
      add();
    }
    window.addEventListener("scroll", handleScroll, false);
    return () => {
      window.addEventListener("scroll", handleScroll, false);
    };
  }, [data]);

  const init = () => {
    const wrap = wrapRef.current;
    if (wrap) {
      const styles = [];
      let itemW = null;
      const wrapW = wrap.clientWidth;
      const children = wrap.children;
      let col = null;
      if (columns) {
        itemW = Math.floor(wrapW / columns);
        col = columns;
      } else {
        itemW = children[0].offsetWidth;
        col = Math.floor(wrapW / itemW);
      }
      for (let i = 0, len = children.length; i < len; i++) {
        if (i < col) {
          const itemH = children[i].offsetHeight;
          const left = children[i].offsetLeft;
          styles.push({
            position: "absolute",
            top: 0,
            left: `${left}px`,
          });
          _heightArray.push(itemH);
        } else {
          const minH = Math.min.apply(null, _heightArray);
          const minIndex = _heightArray.findIndex((item) => item === minH);
          const left = children[minIndex].offsetLeft;
          styles.push({
            position: "absolute",
            top: `${minH}px`,
            left: `${left}px`,
          });
          _heightArray[minIndex] += children[i].offsetHeight;
        }
      }

      const wrapH = Math.max.apply(null, _heightArray);

      unstable_batchedUpdates(() => {
        setColumns(col);
        setWrapH(wrapH);
        setWrapW(wrapW);
        setStyles(styles);
      });
    }
  };

  const add = () => {
    const wrap = wrapRef.current;
    if (wrap) {
      const children = wrap.children;
      for (let i = styles.length, len = children.length; i < len; i++) {
        const minH = Math.min.apply(null, _heightArray);
        const minIndex = _heightArray.findIndex((item) => item === minH);
        const left = children[minIndex].offsetLeft;
        styles.push({
          position: "absolute",
          top: `${minH}px`,
          left: `${left}px`,
        });
        _heightArray[minIndex] += children[i].offsetHeight;
      }

      const wrapH = Math.max.apply(null, _heightArray);
      unstable_batchedUpdates(() => {
        setWrapH(wrapH);
        setWrapW(wrapW);
        setStyles(styles);
      });
    }
  };

  const handleScroll = debounce(() => {
    const checked = checkScrollSlide();
    if (checked) {
      onScroll && onScroll();
    }
  }, 200);

  const checkScrollSlide = () => {
    const wrap = wrapRef.current;
    const items = wrap.children;
    const lastBox = items[items.length - 1];
    const lastBoxHeigth = lastBox.offsetTop + lastBox.offsetHeight;
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const winHeigth =
      document.documentElement.clientHeight || document.body.clientHeight;
    return lastBoxHeigth < scrollTop + winHeigth + 100;
  };

  if (!data || !Array.isArray(data) || !data.length) {
    return null;
  }
  return (
    <div className="image-auto-flow-wrap" style={style} ref={wrapRef}>
      {data.map((item, index) => {
        return (
          <div
            className="image-auto-flow-item"
            style={{ ...styles[index], padding }}
            key={item[key] || item.id || index}
          >
            <Component item={item} index={index} />
          </div>
        );
      })}
    </div>
  );
};

export default Masonry;
