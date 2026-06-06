<template>
	<view class="content">
		<!-- 顶部导航 -->
		<u-navbar :autoBack="true" title="受理开单" :titleStyle="titleStyle" bgColor="#1b3568" @rightClick="saveOrder">
			<view slot="right" class="nav-right">
				<text class="save-btn">保存</text>
			</view>
		</u-navbar>

		<scroll-view scroll-y class="page-scroll">
			<u-form :model="form" ref="uForm" label-width="55" labelAlign="center" >
				<!-- 1. 基础信息 -->
				<u-cell-group>
					<view class="form-row linebg1">
						<u-form-item label="运单号"  prop="waybillNo" class="form-col-half">
							<u-input v-model="form.waybillNo" placeholder="系统生成" disabled border="none"></u-input>
						</u-form-item>
						<u-form-item label="货号" prop="cargoNo" class="form-col-half">
							<u-input v-model="form.cargoNo" placeholder="选填" border="none"></u-input>
						</u-form-item>
					</view>
					<view class="form-row linebg2">
						<u-form-item label="发货站" prop="sendStation" @click="showStationPicker('send')">
							<u-input v-model="form.sendStationName" placeholder="请选择" disabled border="none"></u-input>
						</u-form-item>
						<u-form-item label="到达站" prop="arriveStation" @click="showStationPicker('arrive')">
							<u-input v-model="form.arriveStationName" placeholder="请选择" disabled border="none"></u-input>
						</u-form-item>
						<u-form-item label="中转站" prop="transferStation">
							<u-input v-model="form.transferStation" placeholder="无" border="none"></u-input>
						</u-form-item>
					</view>
					<view class="form-row linebg1">
						<u-form-item label="收货方" prop="sendStation">
							<u-input v-model="form.receiptReq" placeholder="请选择" disabled border="none"></u-input>
						</u-form-item>
						<u-form-item label="手机" prop="arriveStation">
							<u-input v-model="form.receiptMobile" placeholder="请选择" disabled border="none"></u-input>
						</u-form-item>
					</view>					
					<u-form-item label="运输方式" prop="transportType">
						<u-input v-model="form.transportType" value="普通汽运" disabled border="none"></u-input>
					</u-form-item>
				</u-cell-group>

				<!-- 2. 收发人信息 -->
				<view class="section-title">收发信息</view>
				<u-cell-group>
					<u-form-item label="发货方" prop="senderName">
						<u-input v-model="form.senderName" placeholder="姓名/公司" border="none"></u-input>
					</u-form-item>
					<u-form-item label="手机" prop="senderPhone">
						<u-input v-model="form.senderPhone" type="number" placeholder="手机号" border="none"></u-input>
					</u-form-item>
					
					<u-divider></u-divider>
					
					<u-form-item label="收货方" prop="receiverName">
						<u-input v-model="form.receiverName" placeholder="姓名/公司" border="none"></u-input>
					</u-form-item>
					<u-form-item label="手机" prop="receiverPhone">
						<u-input v-model="form.receiverPhone" type="number" placeholder="手机号" border="none"></u-input>
					</u-form-item>
					<u-form-item label="收货地址" prop="receiverAddress" label-position="top">
						<u-input v-model="form.receiverAddress" type="textarea" placeholder="详细地址" border="none"></u-input>
					</u-form-item>
				</u-cell-group>

				<!-- 3. 货物明细 -->
				<view class="section-title flex-between">
					<text>货物明细</text>
					<u-button type="primary" size="mini" @click="openGoodsModal">添加货物</u-button>
				</view>
				
				<view class="goods-list">
					<view v-if="form.goodsList.length === 0" class="empty-tip">暂无货物，请点击添加</view>
					<view v-for="(item, index) in form.goodsList" :key="index" class="goods-card">
						<view class="goods-header">
							<text class="goods-name">{{ item.name || '未命名' }}</text>
							<text class="delete-btn" @click="removeGoods(index)">删除</text>
						</view>
						<view class="goods-info">
							<text>{{ item.quantity }}件 / {{ item.weight }}kg / {{ item.volume }}m³</text>
							<text class="price">运费: ¥{{ item.freight }}</text>
						</view>
					</view>
				</view>

				<!-- 4. 费用与控制 -->
				<view class="section-title">费用与控制</view>
				<u-cell-group>
					<u-form-item label="运费合计" prop="totalFreight">
						<u-input v-model="form.totalFreight" disabled color="#f56c6c" bold border="none"></u-input>
					</u-form-item>
					<u-form-item label="付款方式" prop="paymentMethod" @click="showPicker('payment')">
						<u-input v-model="form.paymentMethodName" placeholder="请选择" disabled border="none"></u-input>
					</u-form-item>
					<u-form-item label="交接方式" prop="handoverMethod" @click="showPicker('handover')">
						<u-input v-model="form.handoverMethodName" placeholder="请选择" disabled border="none"></u-input>
					</u-form-item>
					<u-form-item label="回单要求" prop="receiptReq">
						<u-input v-model="form.receiptReq" placeholder="无/随货" border="none"></u-input>
					</u-form-item>
					<u-form-item label="备注" prop="remarks">
						<u-input v-model="form.remarks" placeholder="备注信息" border="none"></u-input>
					</u-form-item>
					
					<view class="switch-group">
						<u-switch v-model="form.isControlCargo" label="控货"></u-switch>
						<u-switch v-model="form.isOnlinePay" label="在线收款"></u-switch>
					</view>
				</u-cell-group>
				
				<!-- 占位，防止底部按钮遮挡 -->
				<view style="height: 100px;"></view>
			</u-form>
		</scroll-view>

		<!-- 底部固定操作栏 -->
		<view class="footer-bar">
			<view class="print-settings">
				<u-input v-model="form.startPage" type="number" placeholder="页" width="60"></u-input>
				<text class="mx-2">+</text>
				<u-input v-model="form.labelCount" type="number" placeholder="标签数" width="60"></u-input>
			</view>
			<view class="action-btns">
				<u-button type="warning" size="small" @click="printLabel">打标签</u-button>
				<u-button type="success" size="small" @click="printWaybill">打运单</u-button>
			</view>
		</view>

		<!-- 添加货物弹窗 -->
		<u-popup v-model="showGoodsModal" mode="bottom" height="80%">
			<view class="modal-content">
				<view class="modal-header">
					<text>添加货物</text>
					<u-icon name="close" @click="showGoodsModal = false"></u-icon>
				</view>
				<scroll-view scroll-y class="modal-body">
					<u-form :model="currentGoods" label-width="90">
						<u-form-item label="品名"><u-input v-model="currentGoods.name" /></u-form-item>
						<u-form-item label="件数"><u-input v-model="currentGoods.quantity" type="number" /></u-form-item>
						<u-form-item label="包装"><u-input v-model="currentGoods.packageType" placeholder="纸箱/木架" /></u-form-item>
						<u-form-item label="重量(kg)"><u-input v-model="currentGoods.weight" type="digit" /></u-form-item>
						<u-form-item label="体积(m³)"><u-input v-model="currentGoods.volume" type="digit" /></u-form-item>
						<u-form-item label="运费"><u-input v-model="currentGoods.freight" type="digit" /></u-form-item>
						<u-form-item label="代收货款"><u-input v-model="currentGoods.codAmount" type="digit" /></u-form-item>
						<u-form-item label="送货费"><u-input v-model="currentGoods.deliveryFee" type="digit" /></u-form-item>
						<u-form-item label="声明价值"><u-input v-model="currentGoods.declaredValue" type="digit" /></u-form-item>
						<u-form-item label="保费"><u-input v-model="currentGoods.insuranceFee" type="digit" /></u-form-item>
						<u-form-item label="其他费用类型">
							<u-select v-model="showOtherFeeType" :list="otherFeeTypes" @confirm="confirmOtherFeeType"></u-select>
							<u-input v-model="currentGoods.otherFeeTypeName" disabled />
						</u-form-item>
					</u-form>
				</scroll-view>
				<view class="modal-footer">
					<u-button type="primary" @click="confirmAddGoods">确定添加</u-button>
				</view>
			</view>
		</u-popup>

		<!-- 通用选择器 (站点、付款方式等) -->
		<u-picker v-model="showPickerView" :columns="pickerColumns" @confirm="onPickerConfirm"></u-picker>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				titleStyle:"color:#fff;",
				form: {
					waybillNo: '',
					cargoNo: '',
					sendStationName: '',
					arriveStationName: '',
					transferStation: '',
					transportType: '普通汽运',
					senderName: '',
					senderPhone: '',
					receiverName: '',
					receiverPhone: '',
					receiverAddress: '',
					goodsList: [],
					totalFreight: 0,
					paymentMethodName: '提付',
					handoverMethodName: '自提',
					receiptReq: '',
					remarks: '',
					isControlCargo: false,
					isOnlinePay: false,
					startPage: 1,
					labelCount: 1,
					// 内部存储ID用于提交
					sendStationId: '',
					arriveStationId: '',
					paymentMethod: 'present', // present:提付, arrive:到付
					handoverMethod: 'self' // self:自提, door:上门
				},
				// 当前编辑的货物
				currentGoods: {
					name: '', quantity: 1, packageType: '', weight: 0, volume: 0,
					freight: 0, codAmount: 0, deliveryFee: 0, declaredValue: 0, insuranceFee: 0,
					otherFeeType: '', otherFeeTypeName: ''
				},
				showGoodsModal: false,
				showPickerView: false,
				showOtherFeeType: false,
				pickerType: '', // 当前打开的选择器类型
				pickerColumns: [],
				// 模拟数据
				stations: [['北京站', '上海站', '广州站'], ['深圳站', '杭州站', '成都站']],
				paymentMethods: [['提付', '到付', '月结']],
				handoverMethods: [['自提', '上门送货']],
				otherFeeTypes: [
					{ text: '无', value: 'none' },
					{ text: '回收先付', value: 'recover_prepaid' },
					{ text: '回扣欠付', value: 'kickback_arrears' },
					{ text: '垫付返现', value: 'advance_cash' },
					{ text: '垫付欠付', value: 'advance_arrears' }
				]
			};
		},
		onLoad() {
			this.generateWaybillNo();
			// 初始化默认站点
			this.form.sendStationName = '北京站';
			this.form.arriveStationName = '广州站';
		},
		methods: {
			// 生成运单号
			generateWaybillNo() {
				this.form.waybillNo = 'LQ' + new Date().getTime().toString().substr(-8);
			},
			
			// 打开货物添加弹窗
			openGoodsModal() {
				this.resetCurrentGoods();
				this.showGoodsModal = true;
			},
			
			resetCurrentGoods() {
				this.currentGoods = {
					name: '', quantity: 1, packageType: '', weight: 0, volume: 0,
					freight: 0, codAmount: 0, deliveryFee: 0, declaredValue: 0, insuranceFee: 0,
					otherFeeType: '', otherFeeTypeName: '无'
				};
			},
			
			// 确认添加货物
			confirmAddGoods() {
				if (!this.currentGoods.name) {
					this.$u.toast('请输入品名');
					return;
				}
				this.form.goodsList.push({ ...this.currentGoods });
				this.calcTotalFreight();
				this.showGoodsModal = false;
			},
			
			// 删除货物
			removeGoods(index) {
				this.form.goodsList.splice(index, 1);
				this.calcTotalFreight();
			},
			
			// 计算总运费
			calcTotalFreight() {
				let total = 0;
				this.form.goodsList.forEach(item => {
					total += parseFloat(item.freight || 0);
				});
				this.form.totalFreight = total.toFixed(2);
			},
			
			// 显示选择器
			showStationPicker(type) {
				this.pickerType = type;
				this.pickerColumns = this.stations;
				this.showPickerView = true;
			},
			
			showPicker(type) {
				this.pickerType = type;
				if (type === 'payment') this.pickerColumns = this.paymentMethods;
				if (type === 'handover') this.pickerColumns = this.handoverMethods;
				this.showPickerView = true;
			},
			
			// 选择器确认
			onPickerConfirm(e) {
				const val = e.value[0];
				if (this.pickerType === 'send') {
					this.form.sendStationName = val;
				} else if (this.pickerType === 'arrive') {
					this.form.arriveStationName = val;
				} else if (this.pickerType === 'payment') {
					this.form.paymentMethodName = val;
					// 简单映射
					if(val === '提付') this.form.paymentMethod = 'present';
					if(val === '到付') this.form.paymentMethod = 'arrive';
				} else if (this.pickerType === 'handover') {
					this.form.handoverMethodName = val;
					if(val === '自提') this.form.handoverMethod = 'self';
					if(val === '上门送货') this.form.handoverMethod = 'door';
				}
			},
			
			confirmOtherFeeType(e) {
				this.currentGoods.otherFeeTypeName = e[0].text;
				this.currentGoods.otherFeeType = e[0].value;
			},

			// 保存订单
			saveOrder() {
				console.log('提交数据:', this.form);
				this.$u.toast('保存成功');
				// TODO: 调用后端 API
			},
			
			printWaybill() {
				this.$u.toast('正在打印运单...');
			},
			
			printLabel() {
				this.$u.toast(`打印标签: 起始页${this.form.startPage}, 数量${this.form.labelCount}`);
			},
			
			rightClick() {
				this.saveOrder();
			}
		}
	};
</script>

<style lang="scss" scoped>
	.content {
		background-color: #f5f5f5;
		min-height: 100vh;
	}
	::v-deep .u-navbar__content__right {
		background-color: #f56c6c;
		color:#fff;
	}
	::v-deep .nav-right {
		padding:0 10rpx;
		.save-btn {
			color: #fff;
		}
	}
	
	.page-scroll {
		padding-top:88rpx;
		height: calc(100vh - 88rpx);
		width: 740rpx;
		margin: 10rpx auto 0;
	}
	
	.section-title {
		padding: 15px 15px 5px;
		font-weight: bold;
		color: #333;
		font-size: 16px;
		background-color: #f5f5f5;
		
		&.flex-between {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}

	.form-row {
		display: flex;
		width: 100%;
		::v-deep .u-form-item {
			flex: 1;
			&__body{
				padding:0rpx;
				&__left {
					color:#fff;
					text-align: center;
					&__content {
						&__label{
							font-size:24rpx;
						}
					}
				}
			}			
		}
	}
	
	.form-col-half {
		flex: 1;
		width: 50%; 
	}	

	.linebg1 {
		::v-deep {
			.u-form-item {
				&__body{
					padding:0rpx;
					&__left {
						background: #5e6b74;
						padding:10rpx 0rpx;
						color:#fff;
						text-align: center;
						&__content {
							&__label{
								color:#fff;
							}
						}
					}
				}
			}
		}
	}
	
	.linebg2 {
		::v-deep {
			.u-form-item {
				&__body{
					padding:0rpx;
					&__left {
						background: #36475b;
						padding:10rpx 0rpx;
						color:#fff;
						text-align: center;
						&__content {
							&__label{
								color:#fff;
							}
						}
					}
				}
			}
		}
	}	
	
	.goods-list {
		padding: 10px;
		.empty-tip {
			text-align: center;
			color: #999;
			padding: 20px;
		}
		.goods-card {
			background: #fff;
			border-radius: 8px;
			padding: 10px;
			margin-bottom: 10px;
			box-shadow: 0 2px 4px rgba(0,0,0,0.05);
			.goods-header {
				display: flex;
				justify-content: space-between;
				margin-bottom: 5px;
				.goods-name { font-weight: bold; }
				.delete-btn { color: #fa3534; font-size: 12px; }
			}
			.goods-info {
				display: flex;
				justify-content: space-between;
				font-size: 12px;
				color: #666;
				.price { color: #f56c6c; }
			}
		}
	}
	
	.switch-group {
		padding: 10px 15px;
		display: flex;
		justify-content: space-around;
		background: #fff;
	}
	
	.footer-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #fff;
		padding: 10px 15px;
		box-shadow: 0 -2px 5px rgba(0,0,0,0.05);
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 99;
		
		.print-settings {
			display: flex;
			align-items: center;
			.mx-2 { margin: 0 8px; }
		}
		.action-btns {
			display: flex;
			gap: 10px;
		}
	}
	
	.modal-content {
		height: 100%;
		display: flex;
		flex-direction: column;
		.modal-header {
			padding: 15px;
			border-bottom: 1px solid #eee;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-weight: bold;
		}
		.modal-body {
			flex: 1;
			padding: 15px;
		}
		.modal-footer {
			padding: 15px;
			border-top: 1px solid #eee;
		}
	}
</style>