import type { JSX } from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";


interface Props {
  data: Record<number, number>
}


ChartJS.register(...registerables);


export function SolutionDistributionGraph(props: Props): JSX.Element {
  return (
      <Bar
        data={{
          labels: Object.keys(props.data),
          datasets: [{
            data: Object.values(props.data),
            backgroundColor: [ getComputedStyle(document.documentElement).getPropertyValue("--distribution-graph-bar-colour") ]
          }]
        }}
        options={{
          indexAxis: "y",
          scales: {
            x: {
              ticks: {
                stepSize: 1
              }
            }
          },
          plugins: {
            title: {
              display: false
            },
            legend: {
              display: false
            }
          }
        }}
      />
  );
}
