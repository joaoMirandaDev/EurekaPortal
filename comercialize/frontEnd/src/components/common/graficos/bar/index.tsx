/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Text } from '@mantine/core'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { useEffect, useState } from 'react'

interface BarChart {
  names: any[]
  value: any[]
  title: string
}

const BarChart: React.FC<BarChart> = ({ names, value, title }) => {
  const [values, setValues] = useState<number[]>([])
  const [name, setNames] = useState<string[]>([])
  useEffect(() => {
    const newValues = value.map(obj => (obj !== null ? obj : 0))
    const newNames = names.map(obj =>
      obj == null || obj == undefined ? '-' : obj.toString()
    )

    setNames(newNames.reverse())
    setValues(newValues.reverse())
    window.dispatchEvent(new Event('resize'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names, value])
  const options: ApexOptions = {
    xaxis: {
      categories: name,
      position: 'top',
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
    },
    stroke: {
      width: 1,
      colors: ['#000000'],
    },
    yaxis: {
      title: {
        text: 'valores',
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val: number) {
          return val.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        distributed: false,
        horizontal: false,
        barHeight: '100%',
        isFunnel: false,
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
      },
      dropShadow: {
        enabled: true,
      },
    },
    legend: {
      show: false,
    },
  }
  const series = [
    {
      name: '',
      data: values,
    },
  ]
  return (
    <Card
      shadow="sm"
      style={{ width: '100%' }}
      padding="lg"
      m={'0.5rem'}
      radius="md"
      withBorder
    >
      <Text align="center" fw={'bold'}>
        {title}
      </Text>
      <Chart options={options} series={series} type="bar" height={'300px'} />
    </Card>
  )
}
export default BarChart
