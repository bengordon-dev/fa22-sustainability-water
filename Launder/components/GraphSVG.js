import { View } from "react-native";
import Svg, { Rect, Circle, Line } from "react-native-svg";
import { Text as SVGText } from "react-native-svg";

export default function GraphSVG(props) {
  const hourRange = 24 - props.startHour

  return (
    <View width="100%" height={props.height} style={{alignItems: "center", justifyContent: "center"}}>
      <Svg height="100%" width={props.width} viewBox="0 0 180 140" >
        <SVGText x="90" y="10" fontSize="9.5" fill="black" textAnchor="middle" fontWeight="600">{props.title}</SVGText>
        <Line x1="19" y1="120" x2="170" y2="120" stroke="black" strokeWidth="2" />
        <Line x1="20" y1="20" x2="20" y2="120" stroke="black" strokeWidth="2" />
        {props.points.length > 0 && props.points.map((point, i) => {
          return (<Circle cx={20 + (point[props.timeField] - props.startHour)/hourRange*150} 
                  cy={120-(point[props.valField])/(props.maxVal)*100} 
                  r={.5} key={i} fill="red">
                  </Circle>) 
          }
        )}
        {props.points.length > 1 && [...Array(props.points.length - 1).keys()].map(i => <Line 
          x1={20 + (props.points[i][props.timeField] - props.startHour)/hourRange*150}
          y1={120-(props.points[i][props.valField])/(props.maxVal)*100}
          x2={20 + (props.points[i + 1][props.timeField] - props.startHour)/hourRange*150}
          y2={120-(props.points[i + 1][props.valField])/(props.maxVal)*100}
          stroke="red"
          strokeWidth=".5"
          key={i}
        />)}
        {[...Array(5).keys()].map(e => {
          const hours = props.startHour + e*hourRange/4
          const mins = Math.round((hours - Math.floor(hours))*60)
          return (
            <SVGText key={e} x={20 + e*150/4 } y={130} fill="black" fontSize="5" textAnchor="middle">{`${Math.floor(hours)}:${mins < 10 ? "0" : ""}${mins}`}</SVGText>
        )})}
        <SVGText x={14} y={120} fill="black" fontSize="5">{0}</SVGText>
        <SVGText x={17 - 3*(Math.floor(props.maxVal/2)).toString().length} y={70} fill="black" fontSize="5">{Math.floor(props.maxVal/2)}</SVGText>
        <SVGText x={17 - 3*(Math.floor(props.maxVal)).toString().length} y={25} fill="black" fontSize="5">{Math.floor(props.maxVal)}</SVGText>
        {props.availability.length > 0 && 
          props.availability.filter(e => Math.floor((e[0] + e[1])/30) > props.startHour*2).map((interval, i) => {
            const width = Math.min(interval[1] + interval[0] - props.startHour*60, interval[1])
            return (
            <Rect 
              x={20 + Math.max(0, (interval[0] - props.startHour*60)/(hourRange*60))*150} 
              y={20} height={100} fill="blue" opacity=".1" width={width/1440*150} key={i}/> 
            )
          }

        )}

      </Svg>
    </View>
  )
}


