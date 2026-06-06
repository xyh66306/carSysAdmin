<template>
	<view class="content">
		<view class="h3">选择师傅</view>
		<u-search inputAlign="left" height="40" placeholder="请输入师傅姓名" :showAction="false" shape="square" bgColor="#fff" borderColor="#f3f3f3" @change="search" v-model="keyword"></u-search>	
		
		<u-list @scrolltolower="scrolltolower">
		  <u-list-item v-for="(item, index) in uList" :key="index">
			<u-cell :title="item.nickname" @click="checked(item)">
			  <u-avatar
				slot="icon"
				shape="square"
				size="35"
				:src="item.avatar"
				customStyle="margin: -3px 5px -3px 0"
			  ></u-avatar>
			</u-cell>
		  </u-list-item>
		</u-list>		
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			page:1,
			limit:10,
			uList: [],
			keyword:'',
			loadStatus:'',
		};
	},
	onLoad() {
		this.loadmore();
	},
	methods: {
		checked(item){
			uni.$u.http.post("/api/user/managerDriver",{
				carer_id:item.id
			}).then(res => {
				if(res.code == 1){
					uni.$u.toast("已添加");
					setTimeout(function() {
					  uni.navigateBack();
					}, 500);
				}
			})
		},
		search(){
			this.uList = [];
			this.page = 1;
			this.loadmore();
		},
		scrolltolower() {
			if(this.loadStatus !=noMore){
				this.loadmore();
			}
		},
		loadmore() {
			uni.$u.http.post('/api/user/getDriverList',{
				page:this.page,
				limit:this.limit,
				keyword:this.keyword
			}).then(res => {
				if (res.code == 1) {
					const _list = res.data.lists;
					this.uList = [...this.uList, ..._list];
					if (res.data.count > this.uList.length) {
						this.loadStatus = 'more';
						this.page++;
					} else {
						// 数据已加载完毕
						this.loadStatus = 'noMore';
					}
				}
			})			
		},		
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #fff;
}
.h3 {
	line-height: 100rpx;
	font-size: 32rpx;
	font-weight: 500;
	padding: 0 20rpx;
}
.content {
	padding:0 20rpx;
}
</style>