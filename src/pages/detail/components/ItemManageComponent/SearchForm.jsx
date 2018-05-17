import React from 'react';
import { Input, Form, Button, message } from 'antd';

const FormItem = Form.Item;

class SearchForm extends React.Component {
	handleSubmit = (e) => {
		e && e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.props.onSubmit({
					shopId: values.shopId || '', //店铺id
					barcode: values.barcode || '', // 商品条码
				})
			} else {
				message.error(err.message);
			}
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<div className="search-box">
                <Form 
                    layout="inline"
					onSubmit={this.handleSubmit}
                >
					<FormItem label="商品条码">
						{getFieldDecorator('barcode')(
							<Input size="default" placeholder="请输入商品条码" style={{ width: 200, height: 24 }} />
						)}
					</FormItem>
					<FormItem label="店铺 ID">
						{getFieldDecorator('shopId')(
							<Input size="default" placeholder="请输入店铺ID" style={{ width: 200, height: 24 }} />
						)}
					</FormItem>
					<FormItem>
						<Button 
							type="primary" 
							htmlType="submit"
							style={{ height: 24, fontSize: 12 }}
						>查询</Button>
					</FormItem>
				</Form>
			</div>
		)
	}
}

export default Form.create()(SearchForm);