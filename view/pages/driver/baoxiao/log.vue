<template>
	<view class="page">
		<template v-if="lists.length>0">
			<u-cell-group >
				<u-cell v-for="(vo,index) in lists" :key="index" isLink :url="'details?id='+vo.id">
					<view slot="title" class="u-slot-title">
						<text class="u-cell-text">类型：
							<block v-if="vo.type==4">
								{{vo.content}}
							</block>	
							<block v-else>
								{{vo.type_text}}
							</block>							
						</text>
					</view>
					<view slot="label" class="u-slot-label">
						<text class="u-cell-text">报销时间：{{vo.updatetime}}</text>
					</view>
				</u-cell>					
			</u-cell-group>	
		</template>
		<template v-else>
			<view class="empyt">
				<u-empty text="暂无数据" mode="data"></u-empty>
			</view>
		</template>	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lists:[],
				loadStatus: 'more',
				page: 1,
				limit: 10
			};
		},
		onLoad() {
			this.getLst();
		},
		methods: {
			getLst(){
				uni.$u.http.post('/api/baoxiao/lists',{
					page: this.page,
					limit: this.limit
				}).then(res => {
					if (res.code == 1) {
						const _list = res.data.lists;
						this.lists = [...this.lists, ..._list];
						if (res.data.count > this.lists.length) {
							this.loadStatus = 'more';
							this.page++;
						} else {
							// 数据已加载完毕
							this.loadStatus = 'noMore';
						}
					}
				})
			}
		},
		onReachBottom() {
			if (this.loadStatus === 'more') {
				this.getLst();
			}
		}		
	};
</script>

<style lang="scss" scoped>
page {
	background-color: #fff;
}	
	
.empyt {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 100rpx;
}	
</style>