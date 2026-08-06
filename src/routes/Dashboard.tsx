import supabase from '../supabase-client'
import { useEffect, useState, useMemo } from 'react';
import {Chart} from 'react-charts'
import type { AxisOptions } from 'react-charts'
import Form from '../components/Form';
import type { Metric } from '../types';

type ChartDatum = {
    primary: string
    secondary: number
}

function y_max(metrics: Metric[]) {
  if (metrics.length > 0) {
    const maxSum = Math.max(...metrics.map((m) => m.sum));
    return maxSum + 2000;
  }
  return 5000; 
}

function Dashboard() {
    const [metrics, setMetrics] = useState<Metric[]>([])

    useEffect(() => {
        async function fetchMetrics() {
            try {
                const {data, error} = await supabase
                    .from('sales_deals')
                    .select(`
                        name,
                        value.sum()`)
                if(error){
                    throw error
                }
                setMetrics(data)
                console.log(data)
            } catch (error) {
                console.error('There was an error: ', error)
            }
        }

        fetchMetrics()
        const channel = supabase
            .channel('deal-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'sales_deals'
                },
                (payload) => {
                    // action
                    console.log(payload)
                    fetchMetrics()
                })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

  const chartData = useMemo(
      () => [
        {
          data: metrics.map((m) => ({
            primary: m.name,
            secondary: m.sum
          }))
        }
    ],
    [metrics]
  )

  const primaryAxis = useMemo<AxisOptions<ChartDatum>>(
    () => ({
      getValue: (d) => d.primary,
      scaleType: 'band',
      outerBandPadding: 0.2,
      position: 'bottom',
    }),
    []
  );

  const secondaryAxes = useMemo<AxisOptions<ChartDatum>[]>(
    () => [
      {
        getValue: (d) => d.secondary,
        scaleType: 'linear',
        elementType: 'bar',
        min: 0,
        max: y_max(metrics),
      },
    ],
    [metrics]
  );

  return (
    <div className="dashboard-wrapper">
      <div className="chart-container">
        <h2>Total Sales This Quarter ($)</h2>
        <div style={{ flex: 1 }}>
          <Chart
            options={{
              data: chartData,
              primaryAxis,
              secondaryAxes,
              defaultColors: ['#58d675'],
              padding: {
                top: 20,
                bottom: 40,
              },
              tooltip: {
                show: false,
              },
            }}
          />
        </div>
      </div>
      <Form metrics={metrics} />
    </div>
  );
}

export default Dashboard;