<template>
	<view class="detail">
		<view class="container">

			<!-- Skeleton 加载状态 -->
			<view v-if="loadState">
				<u-skeleton rows="5" title loading></u-skeleton>
			</view>
			<!-- 组队详情内容 -->
			<view v-else>
				<view class="title">{{detailObj.title}}</view>
				<view class="category">
					组队游戏：{{detailObj.game ? detailObj.game : "未填写"}} —
					组队模式：{{detailObj.category ? detailObj.category : "未填写"}}
				</view>
				<view class="userinfo">
					<view class="avatar">
						<image :src="giveAvatar(detailObj)" mode="aspectFill"></image>
					</view>
					<view class="text">
						<view class="name">
							{{giveName(detailObj)}}
						</view>
						<view class="small">
							<uni-dateformat :date="detailObj.publish_date"
								format="yyyy年MM月dd日 hh:mm:ss"></uni-dateformat> 发布 {{detailObj.province}}
						</view>
					</view>

				</view>
				<view class="content">
					<u-parse :content="detailObj.content" :tagStyle="tagStyle"></u-parse>
				</view>

				<!-- 加入部分 -->
				<view class="join" v-if="showContent">
					<view class="btn animated bounceIn fast" :class="detailObj.isjoin ? 'active' : ''"
						@click="clickjoin">
						<view v-if="detailObj.isjoin">退出组队</view>
						<view v-else>加入组队</view>
					</view>
					<view class="users">
						<template v-for="item in joinUserArr">
							<image :src="giveAvatar(item)" mode="aspectFill"></image>
						</template>
					</view>
					<view>加入人数：{{detailObj.join_count}}</view>
				</view>
			</view>
		</view>

		<!-- 评论部分 -->
		<view class="comment">
			<view style="padding-bottom:50rpx" v-if="!commentList.length && noComment">
				<u-empty mode="comment" icon="https://cdn.uviewui.com/uview/empty/comment.png">
				</u-empty>
			</view>
			<view class="content" v-if="commentList.length">
				<view class="item" v-for="item in commentList">
					<comment-item :item="item" @removeEnv="PremoveEnv"></comment-item>
				</view>
			</view>
		</view>

		<comment-frame :commentObj="commentObj" @commentEnv="PcommentEnv"></comment-frame>
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
	const db = uniCloud.database();
	const utilsObj = uniCloud.importObject("utilsObj", {
		customUI: true
	});
	export default {
		data() {
			return {
				showContent: true,
				artid: "",
				loadState: true,
				tagStyle: {
					p: "line-height:1.7em;font-size:16px;padding-bottom:10rpx",
					img: "margin:10rpx 0"
				},
				detailObj: null,
				joinUserArr: [],
				commentObj: {
					article_id: "",
					comment_type: 0
				},
				commentList: [],
				noComment: false
			};
		},

		onLoad(e) {
			if (!e.id) {
				this.errFun();
				return;
			}
			this.artid = e.id;
			this.commentObj.article_id = e.id
			this.getData();
			this.getjoinUser();
			this.getComment();

		},
		methods: {
			giveName,
			giveAvatar,
			//评论成功后的回调
			PcommentEnv(e) {
				console.log(e);

				this.commentList.unshift({
					...this.commentObj,
					...e,
					user_id: [store.userInfo]
				})
			},

			//删除评论的回调
			PremoveEnv(e) {
				console.log(e);
				let index = this.commentList.findIndex(item => {
					return item._id == e.id
				})
				this.commentList.splice(index, 1)
			},

			//获取评论列表
			async getComment() {
				let commentTemp = db.collection("team_comment")
					.where(`article_id == "${this.artid}" && comment_type==0`).orderBy("comment_date desc")
					.limit(20).getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp()

				let res = await db.collection(commentTemp, userTemp).get()

				let idArr = res.result.data.map(item => {
					return item._id
				})

				let replyArr = await db.collection("team_comment").where({
						reply_comment_id: db.command.in(idArr)
					}).groupBy('reply_comment_id')
					.groupField('count(*) as totalReply').get();


				res.result.data.forEach(item => {
					let index = replyArr.result.data.findIndex(find => {
						return find.reply_comment_id == item._id
					})
					if (index > -1) item.totalReply = replyArr.result.data[index].totalReply
				})

				if (res.result.data == 0) this.noComment = true
				this.commentList = res.result.data

			},

			//获取加入的用户
			getjoinUser() {
				let joinTemp = db.collection("team_join").where(`article_id == "${this.artid}"`).getTemp()
				let userTemp = db.collection("uni-id-users").field("_id,avatar_file").getTemp()
				db.collection(joinTemp, userTemp).orderBy("publish_date desc").get().then(res => {
					console.log(res);
					res.result.data = res.result.data.reverse()
					this.joinUserArr = res.result.data
				})
			},

			//加入操作
			async clickjoin() {
				this.getData();
				if (!store.hasLogin) {
					uni.showModal({
						title: "登录后才可进行后续操作",
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: "/" + pageJson.uniIdRouter.loginPage
								})
							}
						}
					})
					return;
				}
				//判断登录用户和文章用户
				if (store.userInfo._id === this.detailObj.user_id[0]._id) {
					uni.showToast({
						title: "不能加入自己的队伍哦",
						icon: "none"
					})
					return;
				}
				let time = Date.now();
				this.detailObj.isjoin ? this.detailObj.join_count-- : this.detailObj.join_count++;
				this.detailObj.isjoin = !this.detailObj.isjoin
				this.joinTime = time;
				//调用加入方法
				joinFun(this.artid);
				uni.showToast({
					title: "加载中",
					icon: "none"
				})
				this.showContent = false;
				setTimeout(() => {
					uni.redirectTo({
						url: "/pages/detail/detail?id=" + this.artid
					});
					this.showContent = true;
				}, 2000);
			},

			//错误的处理
			errFun() {
				uni.showToast({
					title: "参数有误",
					icon: "none"
				})
				setTimeout(() => {
					uni.reLaunch({
						url: "/pages/index/index"
					})
				}, 1000)
			},

			//获取数据库数据
			getData() {
				let artTemp = db.collection("team_article").where(`_id=="${this.artid}"`).getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp();
				let joinTemp = db.collection("team_join").where(`article_id=="${this.artid}" && user_id==$cloudEnv_uid`)
					.getTemp();

				let tempArr = [artTemp, userTemp];
				if (store.hasLogin) tempArr.push(joinTemp)


				db.collection(...tempArr).get({
					getOne: true
				}).then(res => {
					//console.log(res);
					if (!res.result.data) {
						this.errFun();
						return;
					}
					this.loadState = false;
					let isjoin = false;
					if (store.hasLogin) isjoin = res.result.data._id.team_join.length ? true : false;
					res.result.data.isjoin = isjoin;
					this.detailObj = res.result.data
				}).catch(err => {
					this.errFun();
				})
			}
		}
	}
</script>

<style lang="scss">
	.detail {
		background: #f8f8f8;
		min-height: calc(100vh - var(--window-top));

		.container {
			padding: 30rpx;
			background: #fff;

			.title {
				font-size: 46rpx;
				color: #333;
				line-height: 1.4em;
				font-weight: 600;
			}

			.category {
				color: #00aaff;
				font-size: 30rpx;
				margin-top: 20rpx;
			}

			.userinfo {
				padding: 20rpx 0 50rpx;
				display: flex;
				align-items: center;

				.avatar {
					width: 60rpx;
					height: 60rpx;
					padding-right: 15rpx;

					image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}


				.text {
					font-size: 28rpx;
					color: #555;

					.small {
						font-size: 20rpx;
						color: #999;
					}
				}
			}

			.content {}

			.join {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 80rpx 50rpx 50rpx;

				.btn {
					width: 260rpx;
					height: 120rpx;
					background: #5199ff;
					border-radius: 100rpx;
					color: #fff;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					font-size: 28rpx;

					.iconfont {
						font-size: 50rpx;
					}

					&.active {
						background: #aa0000;
					}
				}

				.text {
					font-size: 26rpx;
					color: #666;

					.num {
						color: #0199FE
					}

					.spot {
						padding: 0 10rpx;
					}
				}

				.users {
					display: flex;
					justify-content: center;
					padding: 30rpx 0;

					image {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
						border: 3px solid #fff;
						margin-left: -20rpx;
					}
				}
			}

		}

		.comment {
			padding: 30rpx;
			padding-bottom: 120rpx;

			.item {
				padding: 10rpx 0;
			}
		}
	}
</style>