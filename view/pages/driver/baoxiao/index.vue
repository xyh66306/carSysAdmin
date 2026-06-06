<template>
	<view class="content">
		<u--form labelPosition="top" :model="baoxiaoForm" :rules="rules" ref="baoxiaoForm">
			<u-form-item labelWidth='80' label="报销类型" borderBottom @click="bxTypeShow()">
				<u--input v-model="typename" placeholder="请选择报销类型" border="none"></u--input>
			</u-form-item>
			<u-form-item labelWidth='80' borderBottom v-if="showDiyContent">
				<u--input v-model="content" placeholder="请输入报销内容" border="none"></u--input>
			</u-form-item>
			<u-form-item labelWidth='80' label="报销金额" borderBottom>
				<u--input v-model="baoxiaoForm.money" placeholder="请输入报销金额" border="none"></u--input>
			</u-form-item>
			<u-form-item labelWidth='80' label="报销凭证" borderBottom>
				<u-upload :fileList="fileListbaoxiao" @afterRead="afterRead" @delete="deletePic" name="baoxiao" multiple
					:maxCount="9"></u-upload>
			</u-form-item>
			<u-form-item labelWidth='80' label="付款截图" borderBottom>
				<u-upload :fileList="fileListpay" @afterRead="afterRead" @delete="deletePic" name="pay" multiple
					:maxCount="10"></u-upload>
			</u-form-item>
		</u--form>
		<view class="button">
			<u-button type="warning" @click="submit" shape="circle">确认提交</u-button>
		</view>

		<u-picker :show="typeShow" :columns="typeLst" @confirm="confirm" @cancel="close" keyName="name"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				typeLst: [
					[{
							value: 1,
							name: '充电费'
						},
						{
							value: 2,
							name: '过路费'
						},
						{
							value: 3,
							name: '加油费'
						},
						{
							value: 4,
							name: '其他'
						}
					]
				],
				typename: "",
				typeShow: false,
				fileListbaoxiao: [],
				fileListpay: [],
				start_city: '',
				end_city: '',
				baoxiaoForm: {
					type: '',
					money: ''
				},
				rules: {},
				content: '', //自定义报销内容
				showDiyContent: false
			};
		},
		onLoad() {

		},
		methods: {
			confirm(e) {
				this.typename = e.value[0].name
				this.baoxiaoForm.type = e.value[0].value
				this.bxTypeShow()
				if (e.value[0].value == 4) {
					this.showDiyContent = true
				} else {
					this.showDiyContent = false
				}
			},
			close() {
				this.typeShow = false
			},
			bxTypeShow() {
				this.typeShow = !this.typeShow
			},
			submit() {

				if (this.baoxiaoForm.type == '') {
					uni.$u.toast('请选择报销类型');
					return
				}
				if (this.baoxiaoForm.money == '') {
					uni.$u.toast('请输入报销金额');
					return
				}
				if (this.baoxiaoForm.money <= 0) {
					uni.$u.toast('报销金额必须大于0');
					return
				}
				if (this.baoxiaoForm.type==4 &&this.showDiyContent) {
					if (this.content == '') {
						uni.$u.toast('请输入报销内容');
						return
					}
				}
				if (this.fileListbaoxiao.length == 0) {
					uni.$u.toast('请上传报销凭证');
					return
				}
				if (this.fileListpay.length == 0) {
					uni.$u.toast('请上传付款截图');
					return
				}
				this.baoxiaoForm.bx_images = this.fileListbaoxiao.map(item => item.url).join(',')
				this.baoxiaoForm.pay_images = this.fileListpay.map(item => item.url).join(',')
				this.baoxiaoForm.content = this.content	

				uni.$u.http.post('/api/baoxiao/add', this.baoxiaoForm).then(res => {
					if (res.code == 1) {
						uni.$u.toast(res.msg);
						uni.navigateBack()
					} else {
						uni.$u.toast(res.msg);
					}
				})
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1);
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file);
				let fileListLen = this[`fileList${event.name}`].length;
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: "uploading",
						message: "上传中",
					});
				});
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url);

					console.log(result)

					let item = this[`fileList${event.name}`][fileListLen];
					this[`fileList${event.name}`].splice(
						fileListLen,
						1,
						Object.assign(item, {
							status: "success",
							message: "",
							url: result,
						})
					);
					fileListLen++;
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {

					uni.$u.http.upload('/api/common/upload', {
						filePath: url,
						name: 'file',
					}).then(res => {
						setTimeout(() => {
							resolve(res.data.fullurl);
						}, 1000);
					}).catch(res => {
						this[event.name] = [];
						this.loginForm[event.name] = '';
					});
				});
			},
		}
	};
</script>

<style lang="scss" scoped>
	page {
		background: #fff;
	}

	.content {
		padding: 0 32rpx;
	}

	.bxType {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.diyContent {
		border-top: 1rpx solid #e6e6e6;
		line-height: 90rpx;
		height: 90rpx;
	}

	.button {
		margin-top: 60rpx;
	}
</style>