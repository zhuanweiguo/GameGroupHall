<template>
	<view class="container">
		<!-- #ifndef H5 -->
		<mosowe-swiper :lists="banner" :touchable="false" indicator="dots" imageKey="image" previewImage pyramid
			pyramidMargin="90rpx" @change="bannerChange" />
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<swiper :autoplay="true" :interval="5000" @change="swiperChange" class="swiper" :indicator-dots="true">
			<swiper-item v-for="(item, index) in banner" :key="index" class="swiper-item" @tap="goToWebPage(item.link)">
				<image :src="item.image" mode="aspectFill" class="swiper-img"></image>
			</swiper-item>
		</swiper>
		<!-- #endif -->
		<view class="title">
			<image src="../../static/image/icon.png" class="icon animated fadeIn faster"></image>
			<span class="title-text animated rotateIn faster">热门模式组队排行榜</span>
		</view>
		<!-- 热门游戏列表 -->
		<view class="hotList">
			<view class="tips">点击任意模式，进入组队大厅</view>
			<view class="listItem" v-for="(item, index) in game_rank" :key="index" @tap="goToDetailPage(item)">
				<view class="rank" :style="{ backgroundColor: rankColors[index] }">{{ index + 1 }}</view>
				<image :src="item.path" mode="widthFix" class="itemImage animated fadeIn faster"></image>
				<view class="itemText">{{ item.name }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			// 首页数据
			return {
				banner: [{
						image: 'https://mp-96df090b-a4b7-4c2e-8c34-16c07e9adf3c.cdn.bspapp.com/image/banner/1.jpg',
						link: ''
					},
					{
						image: 'https://mp-96df090b-a4b7-4c2e-8c34-16c07e9adf3c.cdn.bspapp.com/image/banner/2.jpg',
						link: 'https://www.bilibili.com/video/BV1t44y1H7KD/?spm_id_from=333.337.search-card.all.click'
					},
					{
						image: 'https://mp-96df090b-a4b7-4c2e-8c34-16c07e9adf3c.cdn.bspapp.com/image/banner/3.jpg',
						link: 'https://www.bilibili.com/video/BV1cx41187xr/?spm_id_from=333.337.search-card.all.click'
					},
					{
						image: 'https://mp-96df090b-a4b7-4c2e-8c34-16c07e9adf3c.cdn.bspapp.com/image/banner/4.jpg',
						link: ''
					},
					{
						image: 'https://mp-96df090b-a4b7-4c2e-8c34-16c07e9adf3c.cdn.bspapp.com/image/banner/5.jpg',
						link: 'https://www.bilibili.com/video/BV1hR4y1j7Ts/?spm_id_from=333.337.search-card.all.click'
					},
				],
				currentIndex: 0, // 当前分页器索引
				rankColors: ['#ff0000', '#ffaa00', '#ffaaff'],
				game_rank: [],
			};
		},
		onLoad() {
			this.getData()
			this.callApi()
		},
		methods: {
			//更新各游戏的文章数量
			async getData() {
				let gameCollection = await db.collection("game").where({
					type: 0
				}).get();
				//console.log(gameCollection.result.data)
				for (const item of gameCollection.result.data) {
					let teamArticleCollection = await db.collection("team_article").where({
						game: item.name
					}).field(
						"game"
					).count();
					await db.collection("game").where({
						type: 0,
						name: item.name
					}).update({
						count: teamArticleCollection.result.total
					});
					console.log(teamArticleCollection.result.total)
				}
			},
			//调用自建游戏排行api接口
			callApi() {
				uni.request({
					url: 'https://fc-mp-96df090b-a4b7-4c2e-8c34-16c07e9adf3c.next.bspapp.com/game_rank/get',
					method: 'GET',
					success: (res) => {
						console.log(res.data); // 请求成功后的处理逻辑
						res.data.data.forEach((item) => {
							// 提取name和pictures的path属性，并创建新对象加入game_rank数组
							const newItem = {
								name: item.name,
								path: item.pictures.path
							};
							this.game_rank.push(newItem);
						});
						console.log(this.game_rank);
					},
					fail: (err) => {
						console.error(err); // 请求失败后的处理逻辑
					}
				})
			},
			// H5环境下swiper组件切换事件处理
			swiperChange(event) {
				this.currentIndex = event.detail.current;
			},
			// 非H5环境下mosowe-swiper组件切换事件处理
			bannerChange() {
				// 轮播图切换时的逻辑
			},
			// 在新标签页中打开链接
			goToWebPage(link) {
				if (link) {
					window.open(link, '_blank');
				}
			},
			// 跳转到大厅页
			goToDetailPage(item) {
				uni.switchTab({
					url: '/pages/hall/hall',
				});
			},
		},
	};
</script>

<style lang="scss">
	.swiper {
		width: 100%;
		height: 500px;
		background-color: #ccc;
	}

	.swiper-item {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.swiper-img {
		width: 75%;
		height: 100%;
		margin: 0 auto;
	}

	.title {
		margin: 30rpx 0;
		text-align: center;
		color: orangered;
	}

	.container {
		padding: 10rpx;
	}

	.title-text {
		font-size: 60rpx;
	}

	.icon {
		width: 60rpx;
		height: 60rpx;
		margin-right: 10rpx;
	}

	.hotList {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.tips {
		font-size: 40rpx;
		color: #cccccc;
		margin: 20rpx;
	}

	.listItem {
		width: 100%; // 一行只显示一个列表
		margin-bottom: 50rpx;
		border: 1px solid #aaffff;
		box-shadow: 1rpx 1rpx 10rpx #ccc;
		border-radius: 10rpx;
		overflow: hidden;
		display: flex;
		align-items: center; // 垂直居中
	}

	.rank {
		width: 60rpx;
		height: 60rpx;
		background-color: skyblue;
		color: #ffffff;
		text-align: center;
		line-height: 55rpx;
		border-radius: 50%;
		margin-right: 10rpx;
		font-size: 50rpx;
	}

	.itemImage {
		width: 40%;
		border-radius: 15rpx 15rpx 15rpx 15rpx;
	}

	.itemText {
		padding: 10rpx;
		font-size: 50rpx;
		color: #ff5500;
		text-align: center;
		flex: 1; // 剩余空间由文字占据
	}
</style>