// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj

const {
	isNull
} = require("util");

// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database()
module.exports = {
	_before: function() {
		// 通用预处理器

	},
	async get() {

		let game = await db.collection("game").where({
				type: 0
			}).field({
				name: true,
				pictures: true,
				count: true
			})
			.orderBy("count", "desc")
			.get();

		let result = {
			errMsg: "查询成功",
			data: game.data
		}
		return result;
	}
}