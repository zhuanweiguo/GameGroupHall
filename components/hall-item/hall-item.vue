<template>
	<view class="hallitem">
		<view class="head">
			<view class="userinfo">
				<view class="avatar">
					<image :src="giveAvatar(item)" mode="aspectFill"></image>
				</view>
				<view class="name">
					{{giveName(item)}}
				</view>
				<view class="time">
					<uni-dateformat :date="item.publish_date" format="MM月dd日 hh:mm"
						:threshold="[60000,3600000*24*30]"></uni-dateformat>
				</view>
				<view class="category">

					<view v-if="item.game&&item.category">{{ item.game }} — {{ item.category }}</view>
					<view v-else-if="item.game&&!item.category">{{ item.game }}</view>
				</view>
			</view>
		</view>

		<view class="body">
			<view class="title" @click="goDetail">{{item.title}}</view>
			<view class="text" @click="goDetail" v-if="item.description">
				<view class="t">{{item.description}}</view>
			</view>
		</view>


		<view class="info">
			<view class="box" @click="goDetail">
				<text>查看详情</text>
			</view>
		</view>
	</view>
</template>

<script>
	import pageJson from "@/pages.json"
	import {
		giveName,
		giveAvatar,
		joinFun
	} from "../../utils/tools.js"
	import {
		store
	} from '@/uni_modules/uni-id-pages/common/store.js'
	const db = uniCloud.database()
	export default {
		name: "hall-item",
		props: {
			item: {
				type: Object,
				default () {
					return {

					}
				}
			},
			isjoin: Boolean,
			join_count: Number
		},
		data() {
			return {
				sheetShow: false,
			};
		},
		methods: {
			giveName,
			giveAvatar,
			//点击跳转到详情
			goDetail() {
				uni.navigateTo({
					url: "/pages/detail/detail?id=" + this.item._id
				})
			},
		}
	}
</script>

<style lang="scss">
	.hallitem {
		border: 1px solid #5199ff;
		padding: 20rpx;

		.head {
			display: flex;
			font-size: 32rpx;
			align-items: center;
			justify-content: space-between;

			.userinfo {
				display: flex;
				align-items: center;

				.avatar {
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					border-radius: 50%;
					overflow: hidden;

					image {
						width: 100%;
						height: 100%;
						display: block;
					}
				}

				.name {
					color: #222;
					padding-left: 10rpx;
				}

				.time {
					color: #888;
					font-size: 22rpx;
					padding-left: 20rpx;
				}

				.category {
					color: #ff0000;
					font-size: 22rpx;
					padding-left: 50rpx;
				}
			}

			.more {
				padding: 5rpx;

				.iconfont {
					font-size: 50rpx;
					color: #888;
				}
			}
		}

		.body {
			padding: 15rpx 0 30rpx;

			.title {
				font-size: 44rpx;
				color: #000;
				font-weight: 600;
				text-align: justify;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.text {
				padding-top: 10rpx;
				padding-bottom: 10rpx;
				font-size: 30rpx;
				text-align: justify;
				color: #888;

				.t {
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}

			.piclist {
				display: flex;
				padding-top: 20rpx;

				.pic {
					width: 225rpx;
					height: 225rpx;
					margin-right: 6rpx;
					overflow: hidden;

					image {
						width: 100%;
						height: 100%;
					}

					&:first-child {
						border-radius: 20rpx 0 0 20rpx;
					}

					&:last-child {
						border-radius: 0 20rpx 20rpx 0;
					}

					&.only {
						border-radius: 20rpx;
					}
				}
			}
		}

		.info {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 80rpx 50rpx 50rpx;


			.box {
				width: 200rpx;
				height: 60rpx;
				background: #00aaff;
				border-radius: 100rpx;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				font-size: 28rpx;

				.iconfont {
					font-size: 40rpx;
					padding-right: 10rpx;
				}
			}
		}

	}
</style>