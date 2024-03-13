<template>
	<view class="box">
		<image src="../../static/image/register.png" mode='aspectFit' class="logo animated flipInY fast"></image>
		<view class="title">游戏组队大厅</view>
		<view class="form">
			<input class="input" v-model="username" placeholder="请输入用户名" />
			<input class="input" v-model="password" type="password" placeholder="请输入密码" />
			<input class="input" v-model="confirmPassword" type="password" placeholder="请再输入一次密码" />
			<button class="btn" @click="register">立即注册</button>
			<navigator url="../login/login" open-type='navigateBack' hover-class="none" class="label">已有账号，点此去登录.
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			// 注册页数据
			return {
				username: '',
				password: '',
				confirmPassword: '', // 确认密码字段
			};
		},
		methods: {
			// 注册方法
			register() {
				// 检查用户名是否为空
				if (!this.username.trim()) {
					uni.showModal({
						showCancel: false,
						content: '用户名不能为空'
					});
					return;
				}
				// 检查密码是否为空
				if (!this.password.trim()) {
					uni.showModal({
						showCancel: false,
						content: '密码不能为空'
					});
					return;
				}
				// 检查密码是否一致
				if (this.password !== this.confirmPassword) {
					uni.showModal({
						showCancel: false,
						content: '两次输入的密码不一致',
					});
					return;
				}
				// 调用uniCloud云函数进行注册
				uniCloud.callFunction({
					name: 'login',
					data: {
						action: 'register',
						params: {
							username: this.username,
							password: this.password
						}
					},
					success(res) {
						// 注册成功处理
						console.log(res.result);
						if (res.result && res.result.code === 20102) {
							// 用户名已存在
							uni.showModal({
								showCancel: false,
								content: '用户名已存在'
							});
						} else {
							// 注册成功提示
							uni.showModal({
								showCancel: false,
								content: '注册成功'
							})
						}
					},
					fail(e) {
						// 调用云函数失败处理
						console.error(e)
						uni.showModal({
							showCancel: false,
							content: '注册失败，请稍后再试'
						})
					}
				})
			},
		},
	};
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
		background: #ff65a3;
		color: #fff;
		border: 0;
		border-radius: 100upx;
		font-size: 36upx;
		margin-top: 60upx;
	}

	.btn:after {
		border: 0;
	}

	/*按钮点击效果*/
	.btn.button-hover {
		transform: translate(1upx, 1upx);
	}
</style>