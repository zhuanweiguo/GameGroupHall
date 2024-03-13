## mosowe-swiper：适用于uni-app的轮播图插件

轮播组件，本插件兼容H5、APP、微信小程序、支付宝小程序

### 组件功能

1. 普通轮播（文本、图片，图文轮播，支持上下、左右轮播）
2. 堆叠轮播（图片）
3. 图片预览（图片）
4. 数字角标

### 使用方式

若`page.json`中配置了`"easycom": true`，则无需`script`引入就可以使用，没有则需要引入。

### 属性

| 名称                 | 类型    | 默认值                   | 说明                                                         |
| :------------------- | :------ | :----------------------- | :----------------------------------------------------------- |
| lists                | Array   | []                       | 轮播列表                                                     |
| current              | Number  | 0                        | 初始化展示的索引                                             |
| autoplay             | Boolean | true                     | 是否自动切换                                                 |
| interval             | Number  | 3000                     | 自动切换时间间隔                                             |
| duration             | Number  | 500                      | 切换动画时长                                                 |
| vertical             | Boolean | false                    | 滑动方向是否为纵向                                           |
| indicator            | String  |                          | 指示点样式，可选：dots（点），number（数字右下角），空则不会显示 |
| indicatorColor       | String  | rgba(255, 255, 255, 0.5) | dot点样式：默认颜色                                          |
| indicatorActiveColor | String  | #ffffff                  | dot点选中样式：高亮颜色                                      |
| scene                | String  |                          | 场景值                                                       |
| touchable            | Boolean | false                    | 是否禁用手动滑动                                             |
| swiperType           | String  | image                    | 轮播类型，可选：image（图片轮播），imageTextLine（图文一行轮播），text（文本轮播） |
| previewImage         | Boolean | false                    | 点击时开启图片预览，支付宝无预览                             |
| imageKey             | String  |                          | 图片的key值，重复使用的组件可能遇到不同的key，此处传图片的key，若lists为字符串数组，不写即可 |
| textKey              | String  |                          | 文本的key值，重复使用的组件可能遇到不同的key，此处传文本的key，若lists为字符串数组，不写即可 |
| height               | Number  | 300                      | 轮播区的高度，单位rpx                                        |
| pyramid              | Boolean | false                    | 堆叠式，横向且纯图模式有效，开启金字塔模式时，active初始化最少为1，最大为this.lists.length -2，支付宝小程序不堆叠 |
| pyramidMargin        | String  |                          | 堆叠式轮播，前后露出的距离，单位rpx，px                      |
| itemNums             | String  |                          | 同时展示个数,开启堆叠式轮播模式时, itemNums = 1              |

### 事件

| 名称   | 参数                                     | 说明   |
| ------ | ---------------------------------------- | ------ |
| change | index：当前索引                          | 轮播时 |
| bclick | {item，index}：item当前项，index当前索引 | 点击时 |

### 示例

1. 图片轮播

```javascript
banner: [
    {
        image: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3892521478,1695688217&fm=26&gp=0.jpg',
    },
    {
        image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595526004030&di=4be554bfcbc76570e275724fd10cb11c&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F36%2F48%2F19300001357258133412489354717.jpg',
    },
    {
        image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595526004029&di=2feebadbbdcf7db486a58ce72d5a263b&imgtype=0&src=http%3A%2F%2Fp2.so.qhimgs1.com%2Ft01dfcbc38578dac4c2.jpg'
    }
],
```

```html
<mosowe-swiper
    :lists="banner"
    :touchable="false"
    indicator="dots"
    imageKey="image"
    previewImage
    pyramid
    pyramidMargin="90rpx"
    @change="bannerChange"
    />
```

​	2. 文字轮播

```javascript

text: [
    {
        title: '车静安寺客户嘎哈放框架傲胜'
    },
    {
        title: '任务的确认吧是发是对方是个地方个三四个'
    },
    {
        title: '接口环境看是否度萨芬，吧撒打发看了会焦点时发卡机撒打发'
    },
],
```

```html
<view class='swiper'>
    <mosowe-swiper
        :lists="text"
        :touchable="true"
        vertical
        swiperType="text"
        textKey="title"
        :height="80"
        />
</view>
```

文本文字的大小、颜色等可在调用的父级直接更改：

```scss
.swiper{
    height: 80rpx;
    font-size: 28rpx;
    line-height: 80rpx;
    padding: 0 30rpx;
    box-sizing: border-box;
    background-color: #fe8252;
    color: #fff;
    }
```



3. 不带key的文字

```javascript
text2: [
    '车静安寺客户嘎哈放框架傲胜',
    '任务的确认吧是发是对方是个地方个三四个',
    '接口环境看是否度萨芬，吧撒打发看了会焦点时发卡机撒打发'
],
```

```html
<mosowe-swiper
    :lists="text2"
    :touchable="false"
    vertical
    swiperType="text"
    :height="80"
    />
```

### 版本修复
 1.0.2
	1. 金字塔模式下一张图片，会导致主屏不显示



















