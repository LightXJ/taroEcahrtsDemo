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
    color: ['#6efcd5', '#41c2fa'],
    grid: {
        show: true,
        left: '3%',
        right: '3%',
        top: '30%',
        bottom: '5%',
        borderWidth: 0,
        containLabel: true
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
            shadowStyle: {
                color: 'transparent'
            }
        },
        textStyle: {
            fontSize: 14
        },
        backgroundColor: 'rgba(0,0,0,0.5)',
        formatter: function(params) {
          console.log('ssss');
            let text = ''
            for (let val of params) {
                text += `
                    <div style="z-index:999;">
                        <span style="color:#b3bdcb;">${val.seriesName}：</span>
                        <span style="color:white;">${val.data.value}${val.data.unit}</span>
                    </div>
                `
            }
            return text
        }
    },
    xAxis: {
        type: 'category',
        data: ['2018-08'],
        axisTick: {
            show: false
        },
        axisLabel: {
            color: '#b3bdcb',
            fontSize: 14,
            interval: 0,
            rotate: 20,
            align: 'center',
            margin: 20
        },
        axisLine: {
            show: false
        }
    },
    yAxis: [{
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#b3bdcb',
                fontSize: 14
            },
            axisLine: {
                show: false
            },
            // // 设置网格的线条颜色
            splitLine: {
                show: false
            }
        },
        {
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#b3bdcb',
                fontSize: 14
            },
            axisLine: {
                show: false
            },
            // // 设置网格的线条颜色
            splitLine: {
                show: false
            }
        }
    ],
    series: [{
            name: '笔数',
            type: 'line',
            data: [{
                value: 1,
                unit: ''
            }],
            yAxisIndex: 1,
            lineStyle: {
                type: 'dotted'
            }
        },
        {
            name: '金额',
            type: 'bar',
            data: [{
                value: 200,
                unit: '万'
            }],
            yAxisIndex: 0,
            barWidth: '20%'
        }
    ]
  };
  chart.setOption(option);
}

export default class Index extends Component {

  constructor (props) {
    super(props)
    this.state = {
      isLoaded: false,
      isDisposed: false
    }
  }

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
  
        this.setState({
          isLoaded: true,
          isDisposed: false
        });
  
        // 注意这里一定要返回 chart 实例，否则会影响事件处理等
        return chart;
      });
    }else{
      let chart = echarts.init(this.chartRef.vnode.dom)
      setOption(chart);
      this._chart = chart;
      this.setState({
        isLoaded: true,
        isDisposed: false
      });
    }
  }

  dispose=()=>{
    if (this._chart) {
      this._chart.dispose();
    }

    this.setState({
      isDisposed: true
    });
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
    const { isLoaded, isDisposed } = this.state;
    return (
      <View>
         <AtButton onClick={this.init} >加载图表</AtButton>
        {isLoaded && !isDisposed && <AtButton onClick={this.dispose} >释放图表</AtButton>}
        <View className='index'>
          {
            {
              'h5': <View ref={node => this.chartRef = node} style={{width:'100%', height:'400px'}} />,
              'weapp': <ec-canvas ref={node => this.chartRef = node} canvas-id='mychart-area' ec={{ lazyload: true }}></ec-canvas>
            }[process.env.TARO_ENV]
          } 
        </View>
        {/* <AtButton type='primary' size='small' onClick={this.jump}>正常图表</AtButton> */}
      </View>
    )
  }
}
