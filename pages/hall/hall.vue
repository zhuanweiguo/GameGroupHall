<template>
	<view class="home">
		<view class="topnav">
			
			<!-- 选择器 -->
			<view class="uni-px-5 uni-pb-5">
				<uni-data-picker :placeholder="placeholder" popup-title="请选择游戏和模式" :localdata="classDataTree"
					v-model="classValue" @change="clickNav" @nodeclick="onnodeclick" @popupopened="onpopupopened"
					@popupclosed="onpopupclosed" @inputclick="inputclick"></uni-data-picker>
			</view>
			
			<!-- 搜索框 -->
			<view>
				<uni-search-bar @confirm="search" :focus="true" v-model="searchValue" @blur="blur" @focus="focus"
					@input="input" @cancel="cancel" @clear="clear" clearButton="auto" cancelButton="none">
				</uni-search-bar>
			</view>
		</view>
		
		<!-- 数据加载状态 -->
		<view class="loadingState" v-show="loadState">
			<u-skeleton rows="4" title loading></u-skeleton>
		</view>
		
        <!-- 数据列表 -->
		<view class="content">
			<view class="item" v-for="item in dataList">
				<hall-item @delEvent="P_delEvent" :item="item"></hall-item>
			</view>
		</view>
		
		<!-- 编辑按钮 -->
		<view class="edit animated bounceIn fast" @click="goEdit">
			<u-icon name='plus-circle-fill' size='140rpx' color="#00aaff"></u-icon>
		</view>
	</view>
</template>

<script>
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	const db = uniCloud.database();
	const dbCmd = db.command;
	export default {
		data() {
			return {
				game: "",
				category: "",
				noMore: false,
				dataList: [],
				navAction: 0,
				loadState: true,
				searchValue: '',
				placeholder: "请选择游戏和模式",
				classValue: '',
				classDataTree: [{
						text: '如果没有你想组队的游戏或模式选项，可以尝试在搜索栏输入游戏或模式',
						value: '0-0',
						disable: true
					}, {
						text: 'CS2',
						value: '1-0',
						children: [{
								text: '竞技模式',
								value: '1-1'
							},
							{
								text: '休闲模式',
								value: '1-2'
							},
							{
								text: '死斗模式',
								value: '1-3'
							}
						]
					},
					{
						text: '英雄联盟',
						value: '2-0',
						children: [{
								text: '排位模式',
								value: '2-1'
							},
							{
								text: '匹配模式',
								value: '2-2'
							},
							{
								text: '极地大乱斗',
								value: '2-3'
							},
							{
								text: '云顶之弈',
								value: '2-4'
							},
						]
					},
					{
						text: '无畏契约',
						value: '3-0',
						children: [{
								text: '竞技模式',
								value: '3-1'
							},
							{
								text: '匹配模式',
								value: '3-2'
							},
							{
								text: '极速模式',
								value: '3-3'
							},
						]
					},
					{
						text: '王者荣耀',
						value: '4-0',
						children: [{
								text: '排位赛',
								value: '4-1'
							},
							{
								text: '匹配5V5',
								value: '4-2'
							},
							{
								text: '无限乱斗',
								value: '4-3'
							}, {
								text: '克隆大作战',
								value: '4-4'
							}, {
								text: '匹配3V3',
								value: '4-5'
							}
						]
					},
					{
						text: '堡垒之夜',
						value: '5-0',
						children: [{
								text: '战斗皇后模式',
								value: '5-1'
							},
							{
								text: '创意模式',
								value: '5-2'
							},
							{
								text: '拯救世界模式',
								value: '5-3'
							}
						]
					},
					{
						text: '绝地求生',
						value: '6-0',
						children: [{
								text: '经典模式',
								value: '6-1',
							},
							{
								text: '我要活下去模式',
								value: '6-2'
							},
							{
								text: '四人小队模式',
								value: '6-3'
							}
						]
					},
					{
						text: '使命召唤：战区',
						value: '7-0',
						children: [{
								text: '战地大逃杀模式',
								value: '7-1'
							},
							{
								text: 'Plunder模式',
								value: '7-2'
							},
							{
								text: '疯狂行动模式',
								value: '7-3 '
							}
						]
					},
					{
						text: 'Apex Legends',
						value: '8-0',
						children: [{
								text: '大逃杀模式',
								value: '8-1'
							},
							{
								text: '团队死斗模式',
								value: '8-2'
							},
							{
								text: '控制模式',
								value: '8-3'
							},
							{
								text: '子弹时间模式',
								value: '8-4'
							}
						]
					}
				]
			}
		},
		onLoad() {
			this.getData();
		},
		methods: {
			search(res) {
				// 处理搜索事件
			},
			input(res) {
				// 处理输入事件
				console.log('----input:', res)
				this.loadState = true;
				this.dataList = [];
				this.uniLoad = "more"
				this.noMore = false
				this.getData();
			},
			clear(res) {
			},
			blur(res) {
			},
			focus(e) {
			},
			cancel(res) {
			},

			//获取组队列表
			async getData() {
				let artTemp = db.collection("team_article").where(`delState != true`).field(
						"title,user_id,description,picurls,comment_count,join_count,view_count,publish_date,category,game"
					)
					.getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp();

				let query = db.collection(artTemp, userTemp);
				query = query.where({
					title: this.searchValue ? {
						$regex: this.searchValue,
						$options: 'i'
					} : undefined,
					game: this.game ? this.game : undefined,
					category: this.category ? this.category : undefined
				});

                // 发起数据库查询请求
				query.orderBy("publish_date", "desc").skip(this.dataList.length).limit().get()
					.then(async res => {
						console.log(res)
						let idArr = []
						let oldArr = this.dataList;
						if (res.result.data.length == 0) {
							this.noMore = true
						}

						let resDataArr = [...this.dataList, ...res.result.data]

                        // 更新数据列表和加载状态
						this.dataList = resDataArr
						this.loadState = false
					})

			},
            
			// 处理选择器选择切换事件
			clickNav(e) {
				console.log(e.detail.value);
				this.game = e.detail.value.length ? e.detail.value[0].text : "";
				this.category = e.detail.value.length ? e.detail.value[1].text : "";
				console.log(this.game)
				console.log(this.category)
				this.loadState = true;
				this.dataList = [];
				this.uniLoad = "more"
				this.navAction = e.index;
				this.noMore = false
				this.getData();
			},
			// 处理选择器节点点击事件
			onnodeclick(e) {
				console.log('nodeclick', e);
				if (!e.parent_value) {
					this.game = e.text;
					this.category = "";
					this.placeholder = this.game;
					console.log(this.game)
					console.log(this.category)
					this.loadState = true;
					this.dataList = [];
					this.uniLoad = "more"
					this.navAction = e.index;
					this.noMore = false
					this.getData();
				} else {
					this.placeholder = "请选择游戏和模式";
				}
			},
			onpopupopened(e) {
				// 处理选择器弹窗打开事件
				console.log('onpopupopened');
			},
			onpopupclosed(e) {
				// 处理选择器弹窗关闭事件
				console.log('onpopupclosed');
			},
			inputclick(e) {
				// 处理输入框点击事件
				console.log('inputclick');
			},
			//跳转至编辑页面
			goEdit() {
				uni.navigateTo({
					url: "/pages/edit/edit"
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.input-border {
		border: 1px solid #b3e5fc;
		border-radius: 5px;
		padding: 2px 4px;
	}

	.input-selected {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		line-height: 2;
	}

	.home {
		.topnav {
			margin-bottom: 5rpx;
		}

		.picker {
			font-size: 28rpx;
			color: #333;
			padding: 20rpx;
			border: 1rpx solid #ddd;
			border-radius: 4rpx;
			background-color: #f5f5f5;
			display: inline-block;
			cursor: pointer;
		}

		.loadingState {
			padding: 30rpx;
		}

		.content {
			.item {
				padding: 30rpx;
				border-bottom: #F7F7F7 15rpx solid
			}
		}

		.edit {
			width: 120rpx;
			height: 120rpx;
			background: #ffffff;
			border-radius: 50%;
			color: #fff;
			position: fixed;
			z-index: 100;
			bottom: 150rpx;
			right: 50rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			box-shadow: 0 0 20rpx rgba(1, 153, 254, 0.8);

			.iconfont {
				font-size: 50rpx;
			}
		}
	}
</style>