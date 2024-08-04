/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Text } from '@mantine/core'
import { ApexOptions } from 'apexcharts'
import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import IFormaPagamento from 'src/interfaces/formaPagamento'
interface IValorTotalByFormaPagamento {
  valor: number
  formaPagamentoDTO: IFormaPagamento
}
interface DonutChart {
  especialidade: IValorTotalByFormaPagamento[]
  title: string
}

const DonutChart: React.FC<DonutChart> = ({ especialidade, title }) => {
  const [values, setValues] = useState<number[]>([])
  const [name, setNames] = useState<string[]>([])
  useEffect(() => {
    const newValues = especialidade.map(obj => obj.valor!)
    const newNames = especialidade.map(obj =>
      obj.formaPagamentoDTO! == null
        ? 'não definido'
        : obj.formaPagamentoDTO.nome!.toLowerCase()
    )
    setNames(newNames)
    setValues(newValues)
    window.dispatchEvent(new Event('resize'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [especialidade])
  const options: ApexOptions = {
    labels: name,
    stroke: {
      colors: ['#fff'],
    },
    fill: {
      opacity: 0.8,
    },
    yaxis: {
      show: true,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })
        },
      },
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: true,
      },
    },
    legend: {
      show: true,
      position: 'bottom',
    },

    responsive: [
      {
        options: {
          chart: {
            width: '100%',
          },
          legend: {
            enabled: true,
            position: 'bottom',
          },
        },
      },
    ],
  }
  const series = values
  return (
    <Card
      w={'100%'}
      shadow="sm"
      padding="lg"
      m={'0.5rem'}
      radius="md"
      withBorder
    >
      <Text fw={'bold'} align="center">
        {title}
      </Text>
      <Chart
        height={'100%'}
        options={options}
        series={series}
        type="polarArea"
      />
    </Card>
  )
}

export default DonutChart
