import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import DateRangePick from '../../../../components/DateRangePick';
import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

class FormComponent extends React.Component {
    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.onSubmit();
    }
    
    handleChangeOrderByDirection = () => {
        const { 
            type,
            orderByDirection,
            onChange,
            onSubmit
        } = this.props;
        onChange(type, {
            orderByDirection: {
                name: 'orderByDirection',
                value: orderByDirection.value === 'desc' ? 'asc' : 'desc'
            }
        });
        onSubmit();
    }

	render() {
        const { getFieldDecorator } = this.props.form;
        const { orderByDirection } = this.props;
        
		return (
            <Form 
                className="search-form"
                layout="inline"
                onSubmit={this.handleSubmit}
            >
                <FormItem label="时间选择">
                    {getFieldDecorator('orderByField', {})(
                        <Select style={{ width: 110 }}>
                            <Option value="gmt_modify">修改时间</Option>
                            <Option value="gmt_create">创建时间</Option>
                            <Option value="valid">页面有效期</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('dateRange', {})(
                        <DateRangePick size="default" width={120} />
                    )}
                </FormItem>
                <FormItem className="name" label="标题：">
                    {getFieldDecorator('nameLike')(
                        <Input placeholder="请输入页面名称" size="default" style={{ width: 220 }} />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" size="default" style={{ width: 70 }}>查 询</Button>
                </FormItem>
                <div className="order-direction" onClick={this.handleChangeOrderByDirection}>
                    {
                        orderByDirection.value === 'desc'
                        ? <span className="desc">从新到旧</span>
                        : <span className="asc">从旧到新</span>
                    }
                </div>
            </Form>
		)
	}
}

export default Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(props.type, changedFields);
    },
    mapPropsToFields(props) {
        return {
            orderByField: {
                ...props.orderByField
            },
            dateRange: {
                ...props.dateRange
            },
            nameLike: {
                ...props.nameLike
            }
        };
    }
})(FormComponent);