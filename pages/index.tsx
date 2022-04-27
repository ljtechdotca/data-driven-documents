import styles from "@assets/Home.module.scss";
import { AreaChart } from "@components/AreaChart";
import { BarGraph } from "@components/BarGraph";
import { LineChart } from "@components/LineChart";
import { PieChart } from "@components/PieChart";
import { ScatterPlot } from "@components/ScatterPlot";
import { StackedBarGraph } from "@components/StackedBarGraph";
import { csvParse, schemeDark2 } from "d3";
import { readFileSync } from "fs";
import type { GetStaticProps, NextPage } from "next";
import { resolve } from "path";

interface HomeProps {
  areaChart: any;
  barGraph: any;
  stackedBarGraph: any;
  lineChart: any;
  pieChart: any;
  scatterPlot: any;
}

const Home: NextPage<HomeProps> = ({
  areaChart,
  barGraph,
  stackedBarGraph,
  lineChart,
  pieChart,
  scatterPlot,
}) => {
  return (
    <div className={styles.container}>
      <AreaChart
        color="dodgerblue"
        data={areaChart}
        dimensions={{ width: 800, height: 400, margin: [16, 16, 48, 48] }}
        headers={{ x: "Date", y: "Value" }}
      />
      <LineChart
        color="dodgerblue"
        data={lineChart}
        headers={{
          x: "Time",
          y: "Close",
        }}
        dimensions={{ width: 800, height: 400, margin: [16, 16, 48, 48] }}
      />
      <ScatterPlot
        color={schemeDark2}
        data={scatterPlot}
        headers={{
          x: "Sepal width (cm)",
          y: "Sepal length (cm)",
        }}
        dimensions={{ width: 800, height: 400, margin: [16, 16, 48, 48] }}
      />
      <BarGraph
        color={schemeDark2}
        data={barGraph}
        headers={{
          x: "Three Letter Words",
          y: "Popularity",
        }}
        dimensions={{ width: 800, height: 400, margin: [16, 16, 48, 48] }}
      />
      <StackedBarGraph
        color={schemeDark2}
        data={stackedBarGraph}
        headers={{
          x: "Country",
          y: "Population",
        }}
        dimensions={{ width: 800, height: 400, margin: [16, 16, 48, 48] }}
        keys={["a", "b", "c"]}
      />
      <PieChart
        color={schemeDark2}
        data={pieChart}
        dimensions={{
          innerRadius: 20,
          outerRadius: 100,
          margin: [16, 16, 16, 16],
        }}
      />
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = () => {
  const areaChart = csvParse(
    readFileSync(resolve(".", "data", "area-chart.csv"), "utf-8")
  );
  const barGraph = csvParse(
    readFileSync(resolve(".", "data", "bar-graph.csv"), "utf-8")
  );
  const stackedBarGraph = csvParse(
    readFileSync(resolve(".", "data", "stacked-bar-graph.csv"), "utf-8")
  );
  const lineChart = csvParse(
    readFileSync(resolve(".", "data", "line-chart.csv"), "utf-8")
  );
  const pieChart = csvParse(
    readFileSync(resolve(".", "data", "pie-chart.csv"), "utf-8")
  );
  const scatterPlot = csvParse(
    readFileSync(resolve(".", "data", "scatter-plot.csv"), "utf-8")
  );

  return {
    props: {
      areaChart,
      barGraph,
      stackedBarGraph,
      lineChart,
      pieChart,
      scatterPlot,
    },
  };
};
