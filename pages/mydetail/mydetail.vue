<template>
	<view class="content">
		<view style="font-weight: bolder;">头像上传</view>
		<!-- 图片上传区 -->
		<form action="" @submit="formSubmit">
			<view @tap="chooseFile" style="width: 400upx;height: 400upx;background-color: #C0C0C0;">
				<image :src="useravatar.imgSrc" style="width: 100%;height: 100%;" mode=""></image>
			</view>
		</form>
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
			return {
				useravatar: {
					imgSrc: '',
				}
			}
		},
		computed: {
			userInfo() {
				return store.userInfo
			},
			avatar_file() {
				return store.userInfo.avatar_file
			}
		},
		onLoad() {

		},
		methods: {
			// 更新用户头像信息
			setAvatarFile(avatar_file) {
				// 使用 clientDB 提交数据
				mutations.updateUserInfo({
					avatar_file
				})
			},
			chooseFile() {
				uni.chooseImage({ //选择图片
					count: 1,
					success: async (res) => {
						this.useravatar.imgSrc = res.tempFilePaths[0]
						let tempFile = res.tempFiles[0],
							avatar_file = {
								// // #ifdef H5
								extname: tempFile.name.split('.')[tempFile.name.split('.').length - 1],
								// // #endif
								// // #ifndef H5
								// extname: tempFile.path.split('.')[tempFile.path.split('.').length - 1]
								// // #endif
							},
							filePath = res.tempFilePaths[0]
						let cloudPath = this.userInfo._id + '' + Date.now()
						avatar_file.name = cloudPath
						uni.showLoading({
							title: "更新中",
							mask: true
						});
						let {
							fileID
						} = await uniCloud.uploadFile({
							filePath,
							cloudPath,
							fileType: "image"
						});
						avatar_file.url = fileID
						uni.hideLoading()
						this.setAvatarFile(avatar_file)
					}
				})
			},
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>