import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui';
import 'taro-ui/dist/style/index.scss' // 全局引入一次即可
import * as echarts from '../../components/ec-canvas/echarts';
import './index.less'


const initChart = ((type) => {
  const option = {
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
  switch (type) {
    case 'h5':
      return (_this) => {
        let chart = echarts.init(_this.chartRef.vnode.dom)
        chart.setOption(option);
      }
    case 'weapp':
      return (canvas, width, height, dpr)=> {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
        });
        canvas.setChart(chart);
        chart.setOption(option);
        return chart;
      };
  }
})(process.env.TARO_ENV)



export default class Index extends Component {

  constructor (props) {
    super(props)
  }

  componentDidMount () { 
    if( process.env.TARO_ENV=='h5' ){
      initChart(this);
    }
  }

  jump(){
    Taro.redirectTo({
      url: '/pages/lazyload/index'
    })
  }



  config = {
    navigationBarTitleText: '首页',
    usingComponents: {
      'ec-canvas': '../../components/ec-canvas/ec-canvas' // 书写第三方组件的相对路径
    }
  }

  render () {
    return (
      <View>
        <View className='index'>
          {
            {
              'h5': <View ref={node => this.chartRef = node} style={{width:'100%', height:'400px'}} />,
              'weapp': <ec-canvas canvas-id='mychart-area' ec={{ lazyload: false, onInit: initChart }}></ec-canvas>
            }[process.env.TARO_ENV]
          } 
        </View>
        <AtButton type='primary' size='small' onClick={this.jump}>懒加载图表</AtButton>
      </View>
    )
  }
}
