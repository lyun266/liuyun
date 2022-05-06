var mySwiper = new Swiper('.swiper', {
    // direction: 'vertical', // 垂直切换选项
    loop: true, // 循环模式选项
    //初始展示那一张图片
    initialslide: 1,
    autoplay: true,
    //速度
    speed: 1000,
    //鼠标样式
    grabCursor: true,
    // effect: 'fade',
    //3d效果
    // effect: 'cube',
    //翻牌子



    // 如果需要分页器
    pagination: {
        el: '.swiper-pagination',
    },

    // 如果需要前进后退按钮
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // 如果需要滚动条
    scrollbar: {
        el: '.swiper-scrollbar',
    },
})