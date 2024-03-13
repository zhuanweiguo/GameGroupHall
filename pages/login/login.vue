<template>
	<view class="box">
		<image src="../../static/image/login.png" mode='aspectFit' class="logo animated flipInY fast"></image>
		<view class="title">游戏组队大厅</view>
		<view class="form">
			<input class="input" type="text" v-model="username" placeholder="请输入用户名" />
			<input class="input" type="password" v-model="password" password placeholder="请输入密码" />
			<button class="btn" @tap="login1">立即登录</button>
			<navigator url="../register/register" hover-class="none" class="label">还没有账号？点此注册.</navigator>
		</view>
	</view>
</template>

<script>
	// 引入uni-id相关模块
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	export default {
		data() {
			return {
				// 登录页数据
				username: '',
				password: '',

			}
		},
		onLoad() {
			// 页面加载时执行的生命周期函数
		},
		methods: {
			// 登录方法
			login1() {
				// 调用uniCloud云函数进行登录
				uniCloud.callFunction({
					name: 'login',
					data: {
						action: 'login',
						params: {
							username: this.username,
							password: this.password
						}
					},
					success(res) {
						// 登录成功处理
						console.log(res.result);
						mutations.setUserInfo(res.result.userInfo);
						uni.setStorageSync('uni_id_token', res.result.token)
						uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired)
						if (res.result && res.result.code === 0) {
							// 登录成功，跳转到个人中心页
							uni.switchTab({
								url: '/pages/my/my',
							});
						} else {
							// 登录失败提示
							uni.showModal({
								showCancel: false,
								content: '登录失败，请检查用户名和密码'
							});
						}
					},
					fail(e) {
						// 调用云函数失败处理
						console.error(e)
						uni.showModal({
							showCancel: false,
							content: '登录失败，请稍后再试'
						})
					}
				})
			},
			register() {
				// 跳转到注册页面
				uni.navigateTo({
					url: '/pages/Register/Register', // 注册页面路径
				});
			},

		}
	}
</script>

<style>
	.box {
		padding: 0 100upx;
		position: relative;
	}

	.logo {
		width: 100%;
		height: 290upx;
	}

	.title {
		position: absolute;
		top: 0;
		line-height: 340upx;
		font-size: 68upx;
		color: #fff;
		text-align: center;
		width: 100%;
		margin-left: -100upx;
	}

	.form {
		margin-top: 300upx;
	}

	.input {
		background: #e2f5fc;
		margin-top: 30upx;
		border-radius: 100upx;
		padding: 20upx 40upx;
		font-size: 36upx;
	}

	.input-placeholder,
	.input {
		color: #94afce;
	}

	.label {
		padding: 60upx 0;
		text-align: center;
		font-size: 30upx;
		color: #a7b6d0;
	}

	.btn {
		margin-top: 50upx;
		background: #ff65a3;
		color: #fff;
		border: 0;
		border-radius: 100upx;
		font-size: 36upx;
	}

	.btn:after {
		border: 0;
	}

	/*按钮点击效果*/
	.btn.button-hover {
		transform: translate(1upx, 1upx);
	}

	.btn2 {
		margin-top: 30upx;
		background: #55ff7f;
		color: #fff;
		border: 0;
		border-radius: 100upx;
		font-size: 36upx;
	}

	.btn2:after {
		border: 0;
	}

	/*按钮点击效果*/
	.btn2.button-hover {
		transform: translate(1upx, 1upx);
	}
</style>