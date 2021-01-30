import React, { useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import DecimalStepSlide from '@/components/DecimalStepSlide';

import style from './index.css';

export type DataCropViewProps = {
  className?: string,
  image?: string;
  lat?: number;
  lon?: number;
  cropSize?: number;
  resolution?: number;

};


const DataCropView: React.FC<DataCropViewProps> = (props) => {
  const defaultProps = {
    cropSize: 240,
    lon: 124.22,
    lat: 26.07,
    className: '',
    resolution: 4000,
  };

  // let cropAreaRef: HTMLDivElement | null = null;

  const {
    cropSize,
    className,
    image,
    lat,
    lon,
    resolution,
  } = { ...props, ...defaultProps };

  const COFF = 1373.5 * (4000 / resolution);
  const CFAC = 10233137 * (4000 / resolution);
  const LOFF = 1373.5 * (4000 / resolution);
  const LFAC = 10233137 * (4000 / resolution);

  const cropAreaRef = useRef<HTMLDivElement | null>(null);
  const magnifierRef = useRef<HTMLImageElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [factor, setFactor] = useState(1);
  const [currentCropSize, setCurrentCropSize] = useState(cropSize);
  const [currentTop, setCurrentTop] = useState(LOFF);
  const [currentLeft, setCurrentLeft] = useState(COFF);
  const [magnifyFactor, setMagnifyFactor] = useState(1);

  const convertCoordinate = () => {
    const EA = 6378.137;
    const EB = 6356.7523;
    const h = 42164;
    const lambda_D = 104.7 * Math.PI / 180;
    const rad_lon = lon * Math.PI / 180;
    const rad_lat = lat * Math.PI / 180;
    const lambda_e = rad_lon;
    const psi_e = Math.atan((EB ** 2 / EA ** 2) * Math.tan(rad_lat));
    const r_e = EB / Math.sqrt(1 - ((EA ** 2 - EB ** 2) * (Math.cos(psi_e)) ** 2 / EA ** 2));
    const r_1 = h - r_e * Math.cos(psi_e) * Math.cos(lambda_e - lambda_D);
    const r_2 = -r_e * Math.cos(psi_e) * Math.sin(lambda_e - lambda_D);
    const r_3 = r_e * Math.sin(psi_e);
    const r_n = Math.sqrt(r_1 ** 2 + r_2 ** 2 + r_3 ** 2);
    const x = Math.atan(-r_2 / r_1) * 180 / Math.PI;
    const y = Math.atan(-r_3 / r_n) * 180 / Math.PI;
    // alert((COFF + CFAC * x * (2 ** (-16))));
    return { x, y };

  };

  const { x, y } = convertCoordinate();

  const onResize: (() => void) = () => {
    if (imgRef.current?.height)
      setFactor(imgRef.current.height / imgRef.current.naturalHeight);
    if (magnifierRef.current?.width)
      setMagnifyFactor(magnifierRef.current.width / currentCropSize);
  };

  const onDataLoad: (() => void) = () => {
    if (imgRef.current?.height)
      setFactor(imgRef.current.height / imgRef.current.naturalHeight);
    else return;
    const currentFactor = imgRef.current.height / imgRef.current.naturalHeight;
    if (cropAreaRef.current) {
      cropAreaRef.current.style.left = `${String((currentLeft + CFAC * x * (2 ** (-16))) * currentFactor)}px`;
      cropAreaRef.current.style.top = `${String((currentTop + LFAC * y * (2 ** (-16))) * currentFactor)}px`;
      setCurrentCropSize(cropSize);
      cropAreaRef.current.style.height = String(cropSize * currentFactor);
      cropAreaRef.current.style.width = String(cropSize * currentFactor);
      if (magnifierRef.current && imgRef.current) {
        magnifierRef.current.style.backgroundImage = `url(${image})`;
        if (magnifierRef.current.width) {
          setMagnifyFactor(magnifierRef.current.width / currentCropSize);
          const currentMagnifyFactor = magnifierRef.current.width / currentCropSize;
          const realSize = imgRef.current.naturalWidth * currentMagnifyFactor;
          magnifierRef.current.style.backgroundSize = `${realSize}px ${realSize}px`;
          magnifierRef.current.style.backgroundPositionX = `${String(realSize - (currentLeft - cropSize / 2 + CFAC * x * (2 ** (-16))) * currentMagnifyFactor)}px`;
          magnifierRef.current.style.backgroundPositionY = `${String(realSize - (currentTop - cropSize / 2 + LFAC * y * (2 ** (-16))) * currentMagnifyFactor)}px`;
        }
      }
    }

  };

  // TODO drag

  const onTopChange: ((value: number | string | undefined | null) => void) = (value: number | string | undefined | null) => {
    const newValue = typeof value === 'number' ? value : 0;
    if (Number.isNaN(value)) {
      return;
    }
    setCurrentTop(newValue);
    if (cropAreaRef.current)
      cropAreaRef.current.style.top = `${String((newValue + LFAC * y * 2 ** (-16)) * factor)}px`;
    if (magnifierRef.current && imgRef.current) {
      const realSize = imgRef.current.naturalWidth * magnifyFactor;
      magnifierRef.current.style.backgroundPositionY = `${String(realSize - (newValue - currentCropSize / 2 + LFAC * y * (2 ** (-16))) * magnifyFactor)}px`;
    }
  };

  const onLeftChange: ((value: number | string | undefined | null) => void) = (value: number | string | undefined | null) => {
    const newValue = typeof value === 'number' ? value : 0;
    if (Number.isNaN(value)) {
      return;
    }
    setCurrentLeft(newValue);
    if (cropAreaRef.current)
      cropAreaRef.current.style.left = `${String((newValue + CFAC * x * 2 ** (-16)) * factor)}px`;
    if (magnifierRef.current && imgRef.current) {
      const realSize = imgRef.current.naturalWidth * magnifyFactor;
      magnifierRef.current.style.backgroundPositionX = `${String(realSize - (newValue - currentCropSize / 2 + CFAC * x * (2 ** (-16))) * magnifyFactor)}px`;

    }
  };

  const onSizeChange: ((value: number | string | undefined | null) => void) = (value: number | string | undefined | null) => {
    const newValue = typeof value === 'number' ? value : 0;
    if (Number.isNaN(value)) {
      return;
    }
    setCurrentCropSize(newValue);
    if (magnifierRef.current)
      setMagnifyFactor(magnifierRef.current.width / newValue);
  };

  const refreshCropArea: (() => void) = () => {

    if (cropAreaRef.current) {
      cropAreaRef.current.style.left = `${String((currentLeft + CFAC * x * (2 ** (-16))) * factor)}px`;
      cropAreaRef.current.style.top = `${String((currentTop + LFAC * y * (2 ** (-16))) * factor)}px`;
    }
  };

  const refreshMagnifier: (() => void) = () => {
    if (imgRef.current && magnifierRef.current) {
      const realSize = imgRef.current.naturalWidth * magnifyFactor;
      magnifierRef.current.style.backgroundSize = `${realSize}px ${realSize}px`;
      magnifierRef.current.style.backgroundPositionX = `${String(realSize - (currentLeft - currentCropSize / 2 + CFAC * x * (2 ** (-16))) * magnifyFactor)}px`;
      magnifierRef.current.style.backgroundPositionY = `${String(realSize - (currentTop - currentCropSize / 2 + LFAC * y * (2 ** (-16))) * magnifyFactor)}px`;
    }
    if (cropAreaRef.current) {
      cropAreaRef.current.style.width = `${String(currentCropSize * factor)}px`;
      cropAreaRef.current.style.height = `${String(currentCropSize * factor)}px`;
    }
  };

  window.addEventListener('resize', onResize);

  useEffect(refreshCropArea, [factor]);
  useEffect(refreshMagnifier, [magnifyFactor]);

  return (
    <div
      className={classNames(className, style.DataCropView_Container)}>
      <div
        className={classNames(style.DataCropView_Container, style.horizontal)}>
        <img
          alt={image}
          src={image}
          ref={imgRef}
          onLoad={() => {
            onDataLoad();
          }}
          className={classNames(style.DataCropView_Image)}
        />
        <div
          style={{
            width: cropSize * factor,
            height: cropSize * factor,
          }}
          ref={cropAreaRef}
          data-testid='cropper'
          className={classNames(style.DataCropView_CropArea,
            style.DataCropView_CropAreaGrid,
          )}
        />
      </div>
      <div
        className={classNames(style.horizontal)}
      >
        <img
          // alt={image}
          // src={image}
          // style={`background:url(${image})`}
          ref={magnifierRef}
          className={classNames(style.DataCropView_Magnifier)}
        />
      </div>

      <div
        className={classNames(style.clear)}
      >
        <DecimalStepSlide onChange={(value) => {
          onTopChange(value);
        }} min={LOFF - 1000} max={LOFF + 1000} default={LOFF} tipFormatter={() => 'LOFF'} />
        <DecimalStepSlide onChange={(value) => {
          onLeftChange(value);
        }} min={COFF - 1000} max={COFF + 1000} default={COFF} tipFormatter={() => 'COFF'} />
        <DecimalStepSlide onChange={(value) => {
          onSizeChange(value);
        }} max={1024} default={cropSize} tipFormatter={() => 'SIZE'} />
      </div>

    </div>

  );
};

export default DataCropView;
