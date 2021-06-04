import React, { useState } from 'react';
import { request } from 'umi';

import { Modal, Spin } from 'antd';
import ProCard from '@ant-design/pro-card';
import DataCropView from '@/components/DataCropView';
import type { TableListItem } from '@/pages/TableList/data';

export type PredictionViewProps = {
  className?: string,
  image?: string;
  lat?: number;
  lon?: number;
  cropSize?: number;
  visible?: boolean;
  typhoon?: TableListItem;
  onClose: () => void;
};


async function getPrediction(path: string) {
  return request(`/api/dataset/predict`, {
    params: { path },
  });
}

const PredictionView: React.FC<PredictionViewProps> = (props) => {
    const defaultProps = {
      cropSize: 240,
      lon: 124.22,
      lat: 26.07,
      className: '',
      resolution: 4000,
      visible: true,
    };

    // let cropAreaRef: HTMLDivElement | null = null;

    const {
      visible,
      typhoon,
      onClose,
    } = { ...defaultProps, ...props };

    const [resultState, setResultState] = useState(null);

    if (typhoon && !resultState && visible) {
      getPrediction(`/mnt/e/project/DHUCSTLab/data/tf/${typhoon.key}.mat`).then((res) => {
        setResultState(res);
      });

    }


    const dataView = (
      <table>
        <tr>
          <td>台风编号</td>
          <td>{typhoon?.code}</td>
        </tr>
        <tr>
          <td>经度</td>
          <td>{`${typhoon?.lon}°E`}</td>
        </tr>
        <tr>
          <td>纬度</td>
          <td>{`${typhoon?.lat}°N`}</td>
        </tr>
        <tr>
          <td>拍摄时间</td>
          <td>{typhoon?.createdAt}</td>
        </tr>
        <tr>
          <td>最大中心风速（中国气象局数据）</td>
          <td>{`${typhoon?.intensity} m/s`}</td>
        </tr>
        <tr>
          <td>级别（中国气象局数据）</td>
          <td>{`${typhoon?.grade} 级`}</td>
        </tr>
        <tr>
          <td>最大中心风速（RTN预测数据）</td>
          <td>{resultState ? (`${resultState.predicted_speed} m/s`) : (<Spin />)}</td>
        </tr>
        <tr>
          <td>级别（RTN预测数据）</td>
          <td>{resultState ? (resultState.predicted_class + ' 级 ') : (<Spin />)}</td>
        </tr>
        <tr>
          <td>置信水平（RTN预测数据）</td>
          <td>{resultState ? (resultState.predicted_raw + '% ') : (<Spin />)}</td>
        </tr>
        <tr>
          <td>误差（MAE）</td>
          <td>{resultState ? ((((resultState.predicted_speed - typhoon?.intensity) ** 2)**(0.5)).toFixed(2) + ' m/s ') : (<Spin />)}</td>
        </tr>
        <tr>
          <td>预测耗时</td>
          <td>{resultState ? (resultState.time + ' ms ') : (<Spin />)}</td>
        </tr>
      </table>
    );


    return (
      <>
        {typhoon ?
          (<Modal
            title='Pediction Result'
            visible={visible}
            onOk={() => {
              onClose();
            }}
            onCancel={() => {
              onClose();
            }}
            okText='确认'
            cancelText='取消'
            width='48%'
          >

            <ProCard split='vertical'>
              <DataCropView image={typhoon.img} lat={typhoon.lat} lon={typhoon.lon} popTitle={`${typhoon.code}号台风`}
                            popDom={dataView} />
            </ProCard>

          </Modal>) : (
            <Modal
              title='Pediction Result'
              visible={visible}
              onOk={() => {
                setResultState(null);
                onClose();
              }}
              onCancel={() => {
                setResultState(null);
                onClose();
              }}
              okText='确认'
              cancelText='取消'
              width='48%'
            >

              <ProCard split='vertical'>
                <DataCropView image='/a.png' />
              </ProCard>

            </Modal>
          )
        }
      </>

    );
  }
;

export default PredictionView;
