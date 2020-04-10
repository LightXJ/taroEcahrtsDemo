import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import * as echarts from '../../components/ec-canvas/echarts';
import './index.less'



function initChart(canvas, width, height, dpr) {
  console.log(dpr);
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    xAxis: {
      type: 'category',
      data: ['M', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line'
    }]
  };
  chart.setOption(option);
  return chart;
}

export default class Index extends Component {

  constructor (props) {
    super(props)
    this.state = {
      ec: {
        onInit: initChart
      }
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '首页',
    usingComponents: {
      'ec-canvas': '../../components/ec-canvas/ec-canvas' // 书写第三方组件的相对路径
    }
  }

  render () {
    return (
      <View>
        Hello world
        <View className="index">
          <ec-canvas canvas-id='mychart-area' ec={this.state.ec}></ec-canvas>
        </View>
      </View>
    )
  }
}
