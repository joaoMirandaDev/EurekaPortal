import { Card, Flex, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import IEspecialidadeVendidas from 'src/interfaces/especialidadeTop'
import { ApexOptions } from 'apexcharts'
interface PiramideChart {
  especialidade: IEspecialidadeVendidas[]
  title: string
}

const PiramideChart: React.FC<PiramideChart> = ({ especialidade, title }) => {
  const [values, setValues] = useState<number[]>([])
  const [name, setNames] = useState<string[]>([])
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newValues = especialidade.map(obj => obj.quantidade!)
      const newNames = especialidade.map(obj => obj.especialidade!.nome!)
      setNames(newNames)
      setValues(newValues)
      window.dispatchEvent(new Event('resize'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [especialidade])
  const options: ApexOptions = {
    xaxis: {
      categories: name,
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
    colors: ['#F44F5E', '#E55A89', '#8D95EB', '#62ACEA', '#4BC3E6'],
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val: number) {
          return val.toLocaleString('pt-br', { minimumFractionDigits: 2 })
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        distributed: true,
        horizontal: true,
        barHeight: '100%',
        isFunnel: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toLocaleString('pt-br', { minimumFractionDigits: 2 })
      },
      dropShadow: {
        enabled: true,
      },
    },
    legend: {
      show: true,
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
      padding="lg"
      style={{ width: '100%' }}
      m={'0.5rem'}
      radius="md"
      withBorder
    >
      <Flex direction={'column'} align={'center'}>
        <Text fw={'bold'}>{title}</Text>
        <Chart
          options={options}
          series={series}
          type="bar"
          height={'650px'}
          width="100%"
        />
      </Flex>
    </Card>
  )
}

export default PiramideChart
