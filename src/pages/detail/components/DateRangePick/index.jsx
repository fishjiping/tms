import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import './index.less';

export default class DateRange extends React.PureComponent {
  static defaultProps = {
    format: 'YYYY-MM-DD HH:mm:ss',
    startPlaceholder: '选择开始时间',
    endPlaceholder: '选择结束时间'
  }

  handleStartChange = (value) => {
    this.props.onChange({ startDate: value ? value.format('YYYY-MM-DD HH:mm:ss') : '' });
  }

  handleEndChange = (value) => {
    this.props.onChange({ endDate: value ? value.format('YYYY-MM-DD HH:mm:ss') : '' });
  }

  render() {
    const { startDate, endDate, format, startPlaceholder, endPlaceholder } = this.props;
    return (
        <div>
            <div className="date-block">
                <span className="date-label">开始时间</span>
                <DatePicker
                    allowClear={false}
                    format={format}
                    value={startDate}
                    placeholder={startPlaceholder}
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    onChange={this.handleStartChange}
                />
            </div>
            <div className="date-block">
                <span className="date-label">结束时间</span>
                <DatePicker
                    allowClear={false}
                    format={format}
                    value={endDate}
                    placeholder={endPlaceholder}
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    onChange={this.handleEndChange}
                />
            </div>
      </div>
    );
  }
}