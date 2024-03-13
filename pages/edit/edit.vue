<template>
	<view class="edit">
		<view class="title">
			<!-- 类别选择器 -->
			<view class="uni-px-5 uni-pb-5">
				<uni-data-picker :placeholder="placeholder" popup-title="请选择游戏和模式" :localdata="classDataTree"
					v-model="classValue" @change="onchange" @nodeclick="onnodeclick" @popupopened="onpopupopened"
					@popupclosed="onpopupclosed" @inputclick="inputclick"></uni-data-picker>
			</view>
			<!-- 标题输入框 -->
			<input type="text" v-model="artObj.title" placeholder="请输入标题" placeholder-class="placeholderClass">
		</view>
		<view class="content">
			<!-- 富文本编辑器 -->
			<editor class="myEdit" placeholder="请输入您的账号信息或联系方式" @ready="onEditReady"></editor>
		</view>
		<view class="btnGroup">
			<!-- 提交按钮 -->
			<u-button @click="onSubmit" type="primary" text="确认发表" :disabled="!artObj.title.length"></u-button>
		</view>
	</view>
</template>

<script>
	import {
		getProvince
	} from "@/utils/tools.js"
	const db = uniCloud.database()
	export default {
		data() {
			return {
				artObj: {
					title: "",
					content: "",
					description: "",
					province: "",
					game: "",
					category: "",
				},
				placeholder: "请选择游戏和模式",
				classValue: '',
				classDataTree: [{
						text: '如果没有你想组队的游戏或模式选项，可以将游戏或模式写在标题上',
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
								value: '6_3'
							}
						]
					},
					{
						text: '使命召唤：战区',
						value: '7_0',
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
						value: '8_0',
						children: [{
								text: '大逃杀模式',
								value: '8_1'
							},
							{
								text: '团队死斗模式',
								value: '8_2'
							},
							{
								text: '控制模式',
								value: '8_3'
							},
							{
								text: '子弹时间模式',
								value: '8_4'
							}
						]
					}
				]
			};
		},

		onLoad() {
			getProvince().then(res => {
				this.artObj.province = res
			})
		},

		methods: {
			// 类别选择器变化时触发
			onnodeclick(e) {
				console.log('nodeclick', e);
				if (!e.parent_value) {
					this.artObj.game = e.text;
					this.artObj.category = "";
					this.placeholder = this.artObj.game;
				} else {
					this.placeholder = "请选择游戏和模式";
				}
				console.log(this.artObj.game)
				console.log(this.artObj.category)
			},
			onpopupopened(e) {
				console.log('onpopupopened');
			},
			onpopupclosed(e) {
				console.log('onpopupclosed');
			},
			inputclick(e) {
				console.log('inputclick');
			},
			onchange(e) {
				console.log("onchange", e.detail.value);
				this.artObj.game = e.detail.value.length ? e.detail.value[0].text : "";
				this.artObj.category = e.detail.value.length ? e.detail.value[1].text : "";
				console.log(this.artObj.game)
				console.log(this.artObj.category)
			},

			// 提交按钮点击事件
			onSubmit() {
				this.editorCtx.getContents({
					success: res => {
						//console.log(this.artObj.category)
						this.artObj.description = res.text.slice(0, 80);
						this.artObj.content = res.html;
						console.log(this.artObj)
						uni.showLoading({
							title: "发布中..."
						})
						this.addData();
					}
				})
			},

			// 将数据添加到数据库
			addData() {
				db.collection("team_article").add({
					...this.artObj
				}).then(res => {
					uni.hideLoading();
					uni.showToast({
						title: "发布成功"
					})
					setTimeout(() => {
						uni.reLaunch({
							url: "/pages/hall/hall"
						})
					}, 800)
				})
			},

			// 富文本编辑器初始化完成
			onEditReady() {
				uni.createSelectorQuery().in(this).select('.myEdit').fields({
					size: true,
					context: true
				}, res => {
					this.editorCtx = res.context
				}).exec()
			},
		}
	}
</script>

<style lang="scss">
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

	.picker {
		font-size: 25rpx;
		color: #333;
		padding: 30rpx;
		border: 1rpx solid #ddd;
		border-radius: 4rpx;
	}

	/deep/ .ql-blank::before {
		font-style: normal;
		color: #e0e0e0;
	}

	.edit {
		padding: 30rpx;

		.title {
			input {
				height: 120rpx;
				font-size: 46rpx;
				border-bottom: 1px solid #e4e4e4;
				margin-bottom: 30rpx;
				color: #000;
			}

			.placeholderClass {
				color: #e0e0e0;
			}
		}

		.content {
			.myEdit {
				height: calc(100vh - 500rpx);
				margin-bottom: 30rpx;
			}
		}

		.tools {
			width: 100%;
			height: 80rpx;
			background: #fff;
			border-top: 1rpx solid #f4f4f4;
			position: fixed;
			left: 0;
			bottom: 0;
			display: flex;
			justify-content: space-around;
			align-items: center;

			.iconfont {
				font-size: 36rpx;
				color: #333;

				&.active {
					color: #0199FE
				}
			}
		}
	}
</style>