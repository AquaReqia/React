import React, { useState,useEffect } from 'react'
import { createChart, CrosshairMode } from 'lightweight-charts';

const ChildPage = props => {
    const [webSocket, setWebSocket] = useState(null);
    const [chart, setChart] = useState(null);
    const [candleSeries, setCandleSeries] = useState(null);
    const apiKey = "tSB2NlHJ9YcQ7rXbzcKTSXZqWmc4y25Ta2rqgXaBoxwOj2uug0DzpZjJju3n4Qi6";
    const apiSecretKey = "z7HFiZAQFFElGVEGEVpCGOQX31YWkfwdoI43RpunW9JMvY2yvyZXOh4P8XnRlNGl";


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
        var sign = crypto.createHmac('sha256', apiSecretKey).update(Param).digest('hex');
        Param = Param + "&signature=" + sign;
        fetch("https://api.binance.com/sapi/v1/capital/config/getall?" + Param, {
            method: 'GET',
            headers: {
                'X-MBX-APIKEY': apiKey,
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
   

    var ws = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@kline_1m');
    ws.onmessage  = (jsonString) => {
        var jsonValue = JSON.parse(jsonString.data);
        var currentBar = {
            open: jsonValue.k.o,
            high: jsonValue.k.h,
            low: jsonValue.k.l,
            close: jsonValue.k.c,
            time: jsonValue.k.t,
        };
        if(candleSeries != null){
            candleSeries.update(currentBar);
        }
    };

    useEffect(() => {
        var newChart = createChart(props.containerId, {
            width: 1024,
            height: 768,
            crosshair: {
                mode: CrosshairMode.Normal,
            },
        });

        setWebSocket(ws);
        setCandleSeries(newChart.addCandlestickSeries());
        setChart(newChart);
    }, [props]);

    return (
        <div>
            { props && props.containerId && <div id={props.containerId} className={'LightweightChart'} /> }
        </div>
    );
}

export default ChildPage;