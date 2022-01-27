import React, { createRef } from 'react'
import '../style/index.less'

function debounce(func, delay) {
  let timer
  return function() {
    let context = this
    let args = arguments
    timer && clearTimeout(timer)
    timer = setTimeout(function() {
      func.apply(context, args)
    }, delay)
  }
}


class Bitmap extends React.Component {
  render() {
    const { index } = this.props
    return (
      <img src={`http://placehold.it/400x200?text=${index + 1}`} alt="default bitmap" /> 
    )
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
class Masonry extends React.Component {
  static defaultProps  = {
    colums: 0,
    gap: 10,
    component: Bitmap
  }
  constructor(props) {
    super(props)
    this.state = {
      list: props.data,
      styles: [],
      wrapW: null,
      wrapH: null,
    }
    this.wrapRef = createRef(null)
    this.handleScroll = debounce(this.handleScroll.bind(this), 200)
    this.init = this.init.bind(this)
    this.checkScrollSlide = this.checkScrollSlide.bind(this)
  }

  componentDidMount() {
    setTimeout(() => {
      this.init()
    })

    window.addEventListener('scroll', this.handleScroll, false)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, false)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        list: nextProps.data,
      },
      () => {
        setTimeout(() => {
          this.init()
        })
      }
    )
  }

  init() {
    const wrap = this.wrapRef.current
    if (wrap) {
      const styles = []
      let itemW = null
      const wrapW = wrap.clientWidth
      let columns = this.props.columns
      if(columns) {
        itemW = Math.floor(wrapW / columns)
      } else {
        itemW = wrap.children[0].offsetWidth
        columns = Math.floor(wrapW / itemW)
      }
      const heightArray = []
      for (let i = 0, len = wrap.children.length; i < len; i++) {
        if (i < columns) {
          const itemH = wrap.children[i].offsetHeight
          const left = wrap.children[i].offsetLeft
          styles.push({
            position: 'absolute',
            top: 0,
            left: `${left}px`,
          })
          heightArray.push(itemH)
        } else {
          const minH = Math.min.apply(null, heightArray)
          const minIndex = heightArray.findIndex(item => item === minH)
          const left = wrap.children[minIndex].offsetLeft
          styles.push({
            position: 'absolute',
            top: `${minH}px`,
            left: `${left}px`, 
          })
          heightArray[minIndex] += wrap.children[i].offsetHeight
        }
      }

      const wrapH = Math.max.apply(null, heightArray);
      this.setState(
        {
          wrapW,
          wrapH,
          styles,
        },
        () => {
          this.loading = false
        }
      )
    }
  }

  handleScroll() {
    const flag = this.checkScrollSlide()
    if (flag && !this.loading) {
      const { onScroll } = this.props
      this.loading = true
      onScroll && onScroll()
    }
  }

  checkScrollSlide() {
    const wrap = this.wrapRef.current
    const items = wrap.children
    const lastBox = items[items.length - 1]
    const lastBoxHeigth = lastBox.offsetTop + lastBox.offsetHeight
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const winHeigth = document.documentElement.clientHeight || document.body.clientHeight
    return lastBoxHeigth < (scrollTop + winHeigth + 100)
  }

  render() {
    const { list, wrapW, wrapH, styles } = this.state
    const { component: Component, key, gap } = this.props
    const style = {
      width: wrapW, 
      height: wrapH, 
      marginLeft: `-${gap}px`,
      marginTop: `-${gap}px`,
    }
    return (
      <div className='image-auto-flow-wrap' style={style} ref={this.wrapRef}>
        {list.map((item, index) => {
          const padding = `${gap}px 0 0 ${gap}px`
          return (
            <div className="image-auto-flow-item" style={{...styles[index], padding }} key={item[key] || item.id || index}>
              <Component item={item} index={index} />
            </div>
          )
        })}
      </div>
    )
  }
}

export default Masonry
