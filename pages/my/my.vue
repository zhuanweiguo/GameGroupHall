<template>
	<view class="page">
		<!-- 顶部区域 -->
		<view class="top">
			<view class="background"></view>
		</view>

		<!-- 用户卡片区域 -->
		<view class="user-card">
			<view class="card">
				<!-- 顶部用户信息 -->
				<view class="top">
					<view class="userImage">
						<image v-if="hasLogin&&userInfo.avatar_file&&userInfo.avatar_file.url"
							:src="userInfo.avatar_file.url" mode="aspectFill" style="width: 150rpx; height: 150rpx;">
						</image>
						<image v-else src="../../static/myIcon/user.png" mode="aspectFill"
							style="width: 150rpx; height: 150rpx;"></image>
					</view>
				</view>

				<!-- 底部用户信息 -->
				<view class="bottom" @click="gomydetail">
					<view class="left">
						<view class="user-text" v-if="hasLogin">
							{{userInfo.username}}
						</view>
						<view class="user-text" v-else>
							未登录
						</view>
					</view>
					<view class="right flex-center">
						<image src="https://mp-96df090b-a4b7-4c2e-8c34-16c07e9adf3c.cdn.bspapp.com/image/myIcon/right.png" style="width: 50rpx; height: 50rpx;"></image>
					</view>
				</view>
			</view>
		</view>

		<!-- 列表卡片区域 -->
		<view class="list-card">
			<!-- 发布的组队 -->
			<view class="card" @click="gopostTeam">
				<view class="item item-bottom-solid">
					<view class="left flex-center">
						<image src="https://mp-96df090b-a4b7-4c2e-8c34-16c07e9adf3c.cdn.bspapp.com/image/myIcon/1.png" mode="aspectFit"></image>
					</view>
					<view class="center">
						<text>发布的组队</text>
					</view>
					<view class="right flex-center">
						<image src="https://mp-96df090b-a4b7-4c2e-8c34-16c07e9adf3c.cdn.bspapp.com/image/myIcon/right.png" style="width: 50rpx; height: 50rpx;"></image>
					</view>
				</view>
			</view>

			<!-- 加入的组队 -->
			<view class="card" @click="gojoinTeam">
				<view class="item">
					<view class="left flex-center">
						<image src="https://mp-96df090b-a4b7-4c2e-8c34-16c07e9adf3c.cdn.bspapp.com/image/myIcon/2.png" mode="aspectFit"></image>
					</view>
					<view class="center">
						<text>加入的组队</text>
					</view>
					<view class="right flex-center">
						<image src="https://mp-96df090b-a4b7-4c2e-8c34-16c07e9adf3c.cdn.bspapp.com/image/myIcon/right.png" style="width: 50rpx; height: 50rpx;"></image>
					</view>
				</view>
			</view>
		</view>

		<!-- 退出登录按钮 -->
		<view class="quit flex-center">
			<view class="btn flex-center" v-if="hasLogin" @click="quit">
				退出登录
			</view>
			<view class="btn flex-center" v-else @click="gologin">
				点击登录
			</view>
		</view>
	</view>
</template>

<script>
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	const db = uniCloud.database()
	export default {
		data() {
			return {};
		},
		computed: {
			userInfo() {
				return store.userInfo
			},
			hasLogin() {
				return store.hasLogin
			}

		},
		onLoad() {

		},

		methods: {
			// 跳转至登录页
			gologin() {
				uni.navigateTo({
					url: "/pages/login/login"
				})
			},
			// 跳转至个人详情页
			gomydetail() {
				if (this.goLoginPage()) return;
				uni.navigateTo({
					url: "/pages/mydetail/mydetail"
				})
			},
			// 跳转至发布的组队列表页
			gopostTeam() {
				if (this.goLoginPage()) return;
				uni.navigateTo({
					url: "/pages/team_article/list"
				})
			},
			// 跳转至加入的组队列表页
			gojoinTeam() {
				if (this.goLoginPage()) return;
				uni.navigateTo({
					url: "/pages/team_join/list"
				})
			},
			// 退出登录
			quit() {
				if (this.goLoginPage()) return;
				uni.showModal({
					title: "确认退出登录",
					success: res => {
						console.log(res);
						if (res.confirm) {
							mutations.logout()
						}
					}
				});
			},
			// 判断是否登录，未登录弹出提示
			goLoginPage() {
				if (!this.hasLogin) {
					uni.showToast({
						title: "未登录",
						icon: "none"
					})
					return true;
				}
				return false
			}
		},
	};
</script>

<style lang="scss" scoped>
	.top {
		height: 250rpx;
		position: relative;

		.background {
			background-color: #5199ff;
			border-bottom-left-radius: 22px;
			border-bottom-right-radius: 22px;
			position: absolute;
			height: 180rpx;
			width: 100%;
		}
	}

	.icon {
		color: #96a1ae;
		font-size: 40rpx;
	}

	.user-card {
		height: 170rpx;
		padding: 0 15px;

		.card {
			position: relative;
			bottom: 62px;
			height: 250rpx;
			background-color: white;
			border-radius: 5px;

			.top {
				height: 30%;
				position: relative;

				.userImage {
					position: absolute;
					bottom: 24%;
					left: 50%;
					transform: translateX(-50%);
					width: 150rpx;
					height: 150rpx;
					overflow: hidden;
					border-radius: 50%;
					border: 2px solid white;
				}
			}

			.bottom {
				display: flex;
				height: 70%;

				.left {
					width: 80%;
					height: 100%;
					position: relative;

					.user-text {
						width: 100%;
						font-size: 1.6em;
						padding-left: 80rpx;
						height: 50%;
					}

					.user-phone {
						color: #96a1ae;
						padding-left: 80rpx;
						height: 50%;
						width: 100%;
						font-size: 0.9em;
					}
				}

				.right {
					width: 20%;
					height: 50%;
				}
			}
		}
	}

	.list-card {
		padding: 0 15px;

		.card {
			border-radius: 5px;
			position: relative;
			background-color: white;
			border-radius: 5px;
			padding: 5px 30px;

			.item {
				display: flex;
				height: 120rpx;

				.left {
					width: 15%;

					image {
						width: 70rpx;
						height: 70rpx;
					}
				}

				.center {
					width: 65%;
					display: flex;
					justify-content: start;
					align-items: center;
					font-size: 1.1em;
				}

				.right {
					width: 20%;
					justify-content: flex-end;
				}
			}
		}
	}

	.item-bottom-solid {
		border-bottom: 1px solid #d4d6da;
	}

	.quit {
		height: 100rpx;
		margin-top: 50px;

		.btn {
			background-color: #4f99ff;
			border-radius: 30px;
			width: 80%;
			color: white;
			font-size: 1.2em;
			height: 100%;
		}
	}

	.flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>