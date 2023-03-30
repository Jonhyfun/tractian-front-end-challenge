import { Asset, GetAssets } from '@/api/fakeapi';
import { ContentLayout } from '@/components/ContentLayout';
import { AssetGraphMap, AssetNameToLabel } from '@/utils/assets/display';
import { AssetsOrganizer } from '@/utils/assets/sorting';
import { getKeyByValue } from '@/utils/query';
import { Select } from 'antd';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { GetServerSideProps } from 'next';
import Link from 'next/link';

import { useRef, useMemo, useState, useEffect } from 'react';

import { BsFillGrid3X3GapFill } from 'react-icons/bs'

type ServerSideReturn = {
  assets: Asset[]
}

export const getServerSideProps: GetServerSideProps<ServerSideReturn> = async (context) => {
  const assets = await GetAssets();

  return {
    props: {
      assets,
    }
  }
}

export default function ChartView({ assets }: ServerSideReturn) {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  const { dates, series, assetsNames } = useMemo(() => AssetsOrganizer(assets), [assets]);

  const options = useMemo(() => {
    const _options: Highcharts.Options = {
      chart: {
        type: 'spline'
      },
      title: {
        text: 'Assets Uptime Chart'
      },
      xAxis: {
        categories: dates,
        labels: {
          formatter: function () {
            return new Date(this.value).toLocaleString(); // Formats the label to 2 decimal places
          },
        }
      },
      yAxis: {
        categories: Object.values(AssetNameToLabel)
      },
      plotOptions: {
        spline: {
          marker: {
            radius: 4,
            lineColor: '#666666',
            lineWidth: 1
          }
        }
      },
      series,
      tooltip: {
        formatter: function () {
          return AssetNameToLabel[getKeyByValue(AssetGraphMap, this.y) as keyof typeof AssetNameToLabel]
        }
      }
    };

    return _options;
  }, [dates, series])

  return (
    <ContentLayout title="Assets Chart" description="Click any legend to hide/show an asset from the graph." previousPage="/" >
      {({ Header, Body }) => (
        <>
          <Header>
            <Link href="/assets" className="p-3 flex-1 md:flex-none md:mr-[35%] flex-shrink-0 h-[inherit] flex items-center justify-center flex-col gap-2 bg-[#00000060] backdrop-blur rounded-lg border-white border-solid border-2">
              <BsFillGrid3X3GapFill className='w-5 h-5 md:w-7 md:h-7' />
              <span className='text-lg md:text-2xl'>Grid Mode</span>
            </Link>
          </Header>
          <Body>
            <div className='p-3'>
              <HighchartsReact
                highcharts={Highcharts}
                options={options}
                ref={chartComponentRef}
              />
            </div>
          </Body>
        </>
      )}
    </ContentLayout>
  )
}