import React from 'react';

import classNames from 'classnames';


import style from './index.css';


export type DataCropAreaProps = {
  className?: string,
  x?: number;
  y?: number;
  lat?: number;
  lon?: number;


};

const DataCropArea: React.FC<DataCropAreaProps> = (props) => {
  const {
    className,
    x,
    y,
    lat,
    lon,
  } = props;


  return(
    <div
      style={{
        width: 50,
        height: 50,
        left: x,
        top: y
      }}
      data-testid='cropper'
      className={classNames(className, style.DataCropView_CropArea,
        style.DataCropView_CropAreaGrid,
      )}
    />
  )

};

export default DataCropArea;
