import React, { useState, useEffect, useCallback } from 'react'
import { createChart, CrosshairMode } from 'lightweight-charts';
import { useCookies } from 'react-cookie';
import { Table, Button, Row, Col, Space } from 'antd';

const columns = [
  {
    title: 'Coin Name',
    dataIndex: 'coinName'
  },
  {
    title: 'Symbol',
    dataIndex: 'symbol'
  },
  {
    title: 'Market Cap (USD)',
    dataIndex: 'marketCap'
  },
  {
    title: 'Action',
    key: 'action',
    sorter: true,
    render: () => (
      <Button type="primary"> Delete </Button>
    ),
  },
];

const ChildPage = props => {
  const [chartArray, setChartArray] = useState([]);
  const [cookies, setCookie] = useCookies(['keyCookie']);

  var ws = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@kline_1m');
  ws.onmessage  = (jsonString) => {
    for(var i = 0; i < chartArray.length; i++){
      var jsonValue = JSON.parse(jsonString.data);
      var currentBar = {
          open: jsonValue.k.o,
          high: jsonValue.k.h,
          low: jsonValue.k.l,
          close: jsonValue.k.c,
          time: jsonValue.k.t,
      };
      if(chartArray[i].updateFunction != null){
        chartArray[i].updateFunction(currentBar);
      }
    }
  };

  function addCharts(chartId, coinName, coinSymbol) {
    setChartArray(prevState => [...prevState, 
      {
        key: chartArray.length + 1,
        coinName: coinName,
        symbol: coinSymbol,
        marketCap: 0,
        chart: null, 
        candleSeries: null,
        lightWeightChartId: chartId + chartArray.length + 1,
        updateFunction: null
      }]);
    }

  function addNewChart() {
    addCharts("denemeChart", "Bitcoin", "BTC");
  }

  const elemRef = useCallback((node, detail) => {
    if(node != null && detail.chart == null && detail.candleSeries == null) {
      var newChart = createChart(detail.lightWeightChartId, {
        width: 1024,
        height: 768,
        crosshair: {
          mode: CrosshairMode.Normal,
        },
      });

      detail.chart = newChart;
      detail.candleSeries = newChart.addCandlestickSeries();
      detail.updateFunction = (currentBar) =>{
        detail.candleSeries.update(currentBar);
      }
    }
  },[]);

    useEffect(() => {
        fetch("https://api.binance.com/api/v3/klines?symbol=USDTTRY&interval=1m&startTime=1612108487267&endTime=1612108547267")
          .then(response => {
            return response.json()
          })
          .then(data => console.log({ data }))
          .catch(error => console.error({ error }));

        var now = new Date()
        var Param = "timestamp=" + (now.getTime() - 3);
        var crypto = require("crypto");
        var sign = crypto.createHmac('sha256', cookies.apiSecretKeyCookie).update(Param).digest('hex');
        Param = Param + "&signature=" + sign;
        fetch("https://api.binance.com/sapi/v1/capital/config/getall?" + Param, {
            method: 'GET',
            headers: {
                'X-MBX-APIKEY': cookies.apiKeyCookie,
            }
        }).then(response => {
            if (response.ok) {
                return response.json()
            }
            console.log(response.statusText);
          })
          .then(data => console.log({ data }))
          .catch(error => console.error({ error }));
    }, [])



  return (
      <Row>
        <Col span={24}>
          <Table
              pagination={{ position: ['none', 'bottomRight'] }}
              columns={columns}
              dataSource={chartArray}
              bordered={true}
              hasData={true}
              expandable={{
                expandedRowRender: record => 
                <Row>
                  <Col span={3}/>
                  <Col span={18}>
                    <div id={record.lightWeightChartId} className='LightweightChart' ref={el => elemRef(el, record)}/>
                  </Col>
                  <Col span={3}/>
                </Row>
              }}
          />
        </Col>
        <Col span={24}>
          <Button type="primary" onClick={() => addNewChart()}>Ekle</Button>
          <Button type="primary" onClick={() => addNewChart()}>Çıkış Yap</Button>
        </Col>
      </Row>

      
      //<div>
      //    { props && props.containerId && <div id={props.containerId} className={'LightweightChart'} /> }
      //</div>
  );
}

export default ChildPage;