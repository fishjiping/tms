import React from 'react';
import { DatePicker } from 'antd';

export default class DateRangePick extends React.PureComponent {
    static defaultProps = {
        format: 'YYYY-MM-DD',
        endOpen: false,
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期'
    }

    constructor(props) {
        super(props);

        const { startValue, endValue } = props.value || {};
        this.state = {
            startValue: startValue,
            endValue: endValue,
            endOpen: props.endOpen,
            format: props.format,
            startPlaceholder: props.startPlaceholder,
            endPlaceholder: props.endPlaceholder
        };
    }

    componentWillReceiveProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState(value);
        }
    }

    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        } else if (this.props.rangeLimit) {
            return startValue.valueOf() > endValue.valueOf() || Math.floor((endValue.valueOf() - startValue.valueOf()) / (3600 * 24 * 1000)) > this.props.rangeLimit;
        } else {
            return startValue.valueOf() > endValue.valueOf();
        }
    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        } else if (this.props.rangeLimit) {
            return endValue.valueOf() <= startValue.valueOf() || Math.floor((endValue.valueOf() - startValue.valueOf()) / (3600 * 24 * 1000)) > this.props.rangeLimit;
        } else {
            return endValue.valueOf() <= startValue.valueOf();
        }
    }

    triggerChange = (changedValue) => {
        const props = this.props;

        if (!('value' in props)) {
            this.setState(changedValue);
        }

        // Should provide an event to pass value to Form.
        const onChange = props.onChange;
        if (onChange) {
            const { startValue, endValue } = Object.assign({}, this.state, changedValue);
            onChange({ startValue, endValue });
        }
    }

    handleStartChange = (value) => {
        this.triggerChange({ 'startValue': value });
    }

    handleEndChange = (value) => {
        this.triggerChange({ 'endValue': value });
    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ 'endOpen': true });
        }
    }

    handleEndOpenChange = (open) => {
        this.setState({ 'endOpen': open });
    }

    render() {
        const { 
            startValue, 
            endValue, 
            endOpen, 
            format, 
            startPlaceholder, 
            endPlaceholder 
        } = this.state;
        const { size, width } = this.props;

        return (
            <div>
                <DatePicker
                    size={size || 'default'}
                    format={format}
                    value={startValue}
                    placeholder={startPlaceholder}
                    disabledDate={this.disabledStartDate}
                    style={{ width: width }}
                    onChange={this.handleStartChange}
                    onOpenChange={this.handleStartOpenChange}
                />
                <span style={{ margin: '0 10px' }} >至</span>
                <DatePicker
                    size={size || 'default'}
                    format={format}
                    value={endValue}
                    placeholder={endPlaceholder}
                    open={endOpen}
                    disabledDate={this.disabledEndDate}
                    style={{ width: width }}
                    onChange={this.handleEndChange}
                    onOpenChange={this.handleEndOpenChange}
                />
            </div>
        );
    }
}