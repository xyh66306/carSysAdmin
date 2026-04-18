<template>
	<view class="content">
		<u--form labelPosition="top" :model="signForm" :rules="rules" ref="signForm">
			<u-form-item labelWidth='80' label="卸货照片" borderBottom>
				<u-upload :fileList="fileListxiehuo" @afterRead="afterRead" @delete="deletePic" name="xiehuo" multiple
					:maxCount="10"></u-upload>
			</u-form-item>
			<u-form-item labelWidth='80' label="回单照片" borderBottom>
				<u-upload :fileList="fileListhuidan" @afterRead="afterRead" @delete="deletePic" name="huidan" multiple
					:maxCount="10"></u-upload>
			</u-form-item>
			<view class="fahuodi_tit flex">
				<view class="title2 currAdress">始发地</view>
				<view class="title2">目的地</view>
			</view>
			<view class="fahuodi flex">
				<view class="startCity currAdress">
					<u--input
						placeholder="请输入始发地"
						v-model="start_city"
						border="bottom"
					 ></u--input>
				</view>
				<view>
					<u--input
					  placeholder="请输入目的地"
					  v-model="end_city"
					  border="bottom"
					></u--input>
				</view>
			</view>
			<u-form-item labelWidth='80' label="业务经理" borderBottom>
				<u--input
					v-model="signForm.yewu"
					disabled
					disabledColor="#ffffff"
					placeholder="请选择业务经理"
					border="none"
				></u--input>
			</u-form-item>
			<u-form-item labelWidth='80' label="毛运费" borderBottom>
				<u--input
						v-model="signForm.money"
						placeholder="请输入毛运费"
						border="none"
				></u--input>
			</u-form-item>			
		</u--form>
		<view class="button">
			<u-button type="warning" @click="submit" shape="circle">确认提交</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fileListxiehuo: [],
				fileListhuidan: [],
				start_city:'',
				end_city:'',
				signForm: {
					yewu: '',
					xiehuo_images: '',
					money:''
				},
				rules: {
					"money":{
						
					}
				},
			};
		},
		onLoad() {

		},
		methods: {
			submit(){
				this.$refs.signForm.validate().then(res => {
					uni.$u.http.post('/api/user/login', this.loginForm).then(res => {
						if (res.code == 1) {
							uni.$u.toast(res.msg);
							uni.navigateBack()
						} else {
							uni.$u.toast(res.msg);
						}
					})
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


	.fahuodi_tit {
		width: 100%;
		text-align: center;
	}

	.title2 {
		width: 50%;
		padding: 20rpx 0;
		border-bottom: 1px solid rgb(214, 215, 217);
		position: relative;
	}

	.fahuodi_box {
		padding: 20rpx 0;
		position: relative;
		font-size: 24rpx !important;
	}
	.startCity {
		position: relative;
	}
	.currAdress::after {
	  position: absolute;
	  right:0rpx;
	  top:50%;
	  width:2rpx;
	  height:50rpx;
	  background-color: rgb(214, 215, 217);
	  content: "";
	  transform: translateY(-50%);
	}	
	
	.button {
		margin-top: 60rpx;
	}
</style>