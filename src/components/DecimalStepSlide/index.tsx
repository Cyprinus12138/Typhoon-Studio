import React from 'react';
import { Slider, InputNumber, Row, Col, Button } from 'antd';
import {FormattedMessage} from 'react-intl'

export type DecimalStepSlideProps = {
  onChange: (value: number | string | undefined | null) => void | undefined,
  min?: number,
  max?: number,
  default?: number
  tipFormatter?: null | ((value?: number) => React.ReactNode)
}

class DecimalStepSlide extends React.Component<DecimalStepSlideProps> {
  state = {
    inputValue: this.props.default,
  };

  onChange = (value: number | string | undefined | null) => {
    if (Number.isNaN(value)) {
      return;
    }
    this.props.onChange(value);
    this.setState({
      inputValue: value,
    });
  };

  render() {
    const { inputValue } = this.state;
    return (
      <Row>
        <Col span={12}>
          <Slider
            min={this.props.min}
            max={this.props.max}
            onChange={this.onChange}
            tipFormatter={this.props.tipFormatter}
            value={typeof inputValue === 'number' ? inputValue : this.props.default}
            step={0.5}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={this.props.min}
            max={this.props.max}
            style={{ margin: '0 16px' }}
            step={0.5}
            value={inputValue}
            onChange={this.onChange}
          />
        </Col>
        <Col span={1}>
          <Button onClick={() => {
            this.setState({ inputValue: this.props.default });
            this.onChange(this.props.default);
          }}><FormattedMessage id="component.slide.default" defaultMessage="Default" /></Button>
        </Col>
      </Row>
    );
  }
}

export default DecimalStepSlide;
