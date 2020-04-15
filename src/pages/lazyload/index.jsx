import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui';
import 'taro-ui/dist/style/index.scss' // 全局引入一次即可
import * as echarts from '../../components/ec-canvas/echarts';
import './index.less'


let Taro_ = Taro
if (process.env.TARO_ENV === 'h5') {
  Taro_ = require('@tarojs/taro-h5').default
}

function setOption(chart) {
  const option = {
    title: {
        text: '一天用电量分布',
        subtext: '纯属虚构'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    toolbox: {
        show: true,
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45']
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: '{value} W'
        },
        axisPointer: {
            snap: true
        }
    },
    visualMap: {
        show: false,
        dimension: 0,
        pieces: [{
            lte: 6,
            color: 'green'
        }, {
            gt: 6,
            lte: 8,
            color: 'red'
        }, {
            gt: 8,
            lte: 14,
            color: 'green'
        }, {
            gt: 14,
            lte: 17,
            color: 'red'
        }, {
            gt: 17,
            color: 'green'
        }]
    },
    series: [
        {
            name: '用电量',
            type: 'line',
            smooth: true,
            data: [300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 390, 400, 500, 600, 750, 800, 700, 600, 400],
            markArea: {
                data: [ [{
                    name: '早高峰',
                    xAxis: '07:30'
                }, {
                    xAxis: '10:00'
                }], [{
                    name: '晚高峰',
                    xAxis: '17:30'
                }, {
                    xAxis: '21:15'
                }] ]
            }
        }
    ]
  };
  chart.setOption(option);
}

export default class Index extends Component {

  componentDidMount () { 
  }

  init=()=>{
    console.log('init');
    if(process.env.TARO_ENV==='weapp'){
      this.chartRef.init((canvas, width, height, dpr) => {
        // 获取组件的 canvas、width、height 后的回调函数
        // 在这里初始化图表
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
        });
        setOption(chart);
  
        // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
        this._chart = chart;
  
        // 注意这里一定要返回 chart 实例，否则会影响事件处理等
        return chart;
      });
    }else{
      let chart = echarts.init(this.chartRef.vnode.dom)
      setOption(chart);
      this._chart = chart;
    }
  }

  jump(){
    Taro.redirectTo({
      url: '/pages/index/index'
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
         <AtButton onClick={this.init} >加载图表</AtButton>
        <View className='index'>
          {
            {
              'h5': <View ref={node => this.chartRef = node} style={{width:'100%', height:'400px'}} />,
              'weapp': <ec-canvas ref={node => this.chartRef = node} canvas-id='mychart-area' ec={{ lazyload: true }}></ec-canvas>
            }[process.env.TARO_ENV]
          } 
        </View>
        <AtButton type='primary' size='small' onClick={this.jump}>正常图表</AtButton>
      </View>
    )
  }
}
