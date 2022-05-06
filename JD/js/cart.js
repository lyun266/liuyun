class Cart {
    constructor() {
        this.checkLogin();
        this.getCartGoods();
        this.bindEve();
    }

    //绑定事件的方法  给cart-list绑定
    bindEve() {
        this.$('.cart-list').addEventListener('click', this.distributeEve.bind(this))//改变this指向,指向当前实例化对象

        //给全选按钮绑定事件
        this.$('.cart-th input').addEventListener('click', this.clickAllChecked.bind(this))
    }

    //操作购物车页面,用户必须登录
    async checkLogin() {
        //获取token值进行判断
        const TOKEN = localStorage.getItem('token');
        //判断是否登录过期
        axios.defaults.headers.common['authorization'] = TOKEN;
        let userId = localStorage.getItem('user_id');
        let { data, status } = await axios.get('http://localhost:8888/users/info/' + userId);
        // console.log(data);

        //如果没有token,肯定没有登录  
        if (!TOKEN || data.code == 401) {
            location.assign('./login.html?ReturnUrl=./cart.html')
        }

    }

    //获取购物车中的数据
    async getCartGoods() {
        const TOKEN = localStorage.getItem('token');
        let userId = localStorage.getItem('user_id');
        axios.defaults.headers.common['authorization'] = TOKEN;
        let { data, status } = await axios.get('http://localhost:8888/cart/list?id=' + userId);
        // console.log(res);
        if (status == 200) {
            //判断是否超过有效期,过期则跳转到登录页面
            if (data.code == 401) location.assign('./login.html?ReturnUrl=./cart.html')
            //判断接口状态
            if (data.code == 1) {
                // console.log(data.cart); //获取到商品数据
                //渲染到页面中去
                let html = '';
                data.cart.forEach(goods => {
                    html += `<ul data-id="${goods.goods_id}" class="goods-list yui3-g">
                    <li class="yui3-u-3-8 pr">
                        <input type="checkbox" class="good-checkbox">
                        <div class="good-item">
                            <div class="item-img">
                                <img src="${goods.img_small_logo}">
                            </div>
                            <div class="item-msg">${goods.title}</div>
                        </div>
                    </li>
                    <li class="yui3-u-1-8">
                        <span>颜色: 银色</span>
                        <br>
                        <span>处理器: Core I5</span>
                        <br>
                        <span>内存: 8GB</span>
                        <br>
                        <span>尺寸: 13.3英寸</span>
                        <br>
                    </li>
                    <li class="yui3-u-1-8">
                        <span class="price">${goods.price}</span>
                    </li>
                    <li class="yui3-u-1-8">
                        <div class="clearfix">
                            <a href="javascript:;" class="increment mins">-</a>
                            <input autocomplete="off" type="text" value="${goods.cart_number}" minnum="1" class="itxt">
                            <a href="javascript:;" class="increment plus">+</a>
                        </div>
                        <div class="youhuo">有货</div>
                    </li>
                    <li class="yui3-u-1-8">
                        <span class="sum">${goods.price * goods.cart_number}</span>
                    </li>
                    <li class="yui3-u-1-8">
                        <div class="del1">
                            <a href="javascript:;">删除</a>
                        </div>
                        <div>移到我的关注</div>
                    </li>
                </ul>`;
                })
                this.$('.cart-list').innerHTML = html;
            }
        }

    }

    //事件委托  将单个商品的操作都委托给cart-list操作
    //使用分发的目的在于,页面中有多个地方都会触发div.cart-list上的点击事件,所以需要加以分别
    //(eve)   
    // 直接解构赋值,获取事件源,只要target
    distributeEve({ target }) {
        // console.log(target);
        //判断是否有del1的class.是则点击的为删除按钮
        if (target.parentNode.classList.contains('del1')) {
            this.delGoods(target);

            
        }
        //判断点击的是否为单个商品的选中按钮
        if (target.classList.contains('good-checkbox')) {
            // console.log(target);
            this.getOneGoodsCheck(target);

            //统计商品数量和价格的方法
            this.getNumPriceGoods()
        }
    }

    //删除按钮方法
    delGoods(target) {
        let that=this;
        //确认是否删除 弹框
        let layerIndex = layer.confirm('确定删除吗?', {
            title: '删除提示'
        }, function () {
            // console.log('确定了...');
            //获取商品id
            let ulObj = target.parentNode.parentNode.parentNode;
            // console.log(ulObj);//获取到ul的事件

            let id = ulObj.dataset.id;
            // console.log(id);  //获取到id

            //获取用户id
            let userId = localStorage.getItem('user_id') - 0;
            //发送ajax删除商品数据
            // console.log(goodsId);
            console.log(id, userId);
            axios.get('http://localhost:8888/cart/remove?id=' + userId + '&goodsId=' + id)
                .then(res => {

                    let { data, status } = res;
                    console.log(data, status);
                    if (data.code == 1) { //删除成功,则关闭弹出框,删除页面中的商品对应的ul
                        //关闭确认删除框
                        layer.close(layerIndex);
                        //提示删除成功
                        layer.msg('商品删除成功');
                        //在页面中删除节点
                        ulObj.remove();
                        
                        //删除成功之后
                        //统计商品数量和价格的方法
                        //this的指向改变了,声明一个that=this
                        that.getNumPriceGoods();
                    }
                })
        })

    }

    //单个商品的选中按钮的回调
    getOneGoodsCheck(target) {
        //获取所有单个按钮的选中状态
        //如果是取消,则让全选按钮取消
        // console.log(target.checked);
        if (!target.checked) {   //未选择 为true
            this.$('.cart-th input').checked = false;   //则让全选按钮选中状态为false
            return;
        }
        // console.log(target.checked);//选中为true 
        //如果点击的是选中,则返回true
        if (target.checked) {
            //使用断言函数,找到则结束
            //寻找页面中,没有被选中的商品
            let res = Array.from(this.$('.good-checkbox')).find(checkbox => {
                //没有被选中状态为false
                // console.log(checkbox.checked);//获取到true和false
                //只要找到一个为false,则页面中就不会全选按钮选中
                return !checkbox.checked;//返回undefined,表示都被选中了
            });
            // console.log(res);
            //如果返回undefined,表示都被选中了
            //undefined取反为true
            if (!res) this.$('.cart-th input').checked = true;
        }
    }

    //获取页面中,所有选中商品的价格和数量
    getNumPriceGoods(target) {
        let goods = document.querySelectorAll('.goods-list');
        // console.log(goods);
        //迭代器,可以一个接一个的
        // let res=goods[Symbol.iterator]();
        // console.log(res.next());

        //保存数量和价格
        let totalNum = 0;
        let totalPrice = 0;
        //forEach 没有返回值
        goods.forEach(one => {
            // console.log(one.firstElementChild.firstElementChild);//获取到input节点
            //只统计被选中的商品价格和数量
            if (one.firstElementChild.firstElementChild.checked) {
                // console.log(one);
                //ul下的第4个节点 是数量  类itxt
                //数量的获取 
                // console.log(one.querySelector('.itxt').value);
                // -0 是由字符型类型转化为数组类型
                totalNum = one.querySelector('.itxt').value - 0 + totalNum;

                //价格的获取
                //span标签  类sum  因为是span框用innerHTML
                // console.log(one.querySelector('.sum').innerHTML);
                totalPrice = one.querySelector('.sum').innerHTML - 0 + totalPrice;

            }

        })
        // console.log(totalNum,totalPrice);//数量和价格
        //设置到总计上
        this.$('.sumprice-top strong').innerHTML = totalNum;
        this.$('.sumprice-top .summoney').innerHTML = totalPrice;

    }

    //全选的实现
    clickAllChecked(eve) {
        // console.log(eve.target);//获取到当前事件源
        //获取全选按钮的状态
        let checked = eve.target.checked;
        // console.log(checked);
        //让当个商品的选中状态跟随全选按钮
        this.oneGoodsCheck(checked);  //调用函数,将checked的值传进去
        //统计数量和价格的方法
        this.getNumPriceGoods();
    }
    //设置单个商品的选中状态
    oneGoodsCheck(checkStatus) {
        let goodsList = this.$('.goods-list'); //每条商品 ul
        // console.log(goodsList,checkStatus); 
        goodsList.forEach(ul => {
            // console.log(ul);//获取到ul  我们要找的事ul下的第一个li标签下的第一个input
            //找到单个商品的复选框
            ul.firstElementChild.firstElementChild.checked = checkStatus;
        })
    }

    //都要获取节点,封装一个函数
    $(tag) {
        let res = document.querySelectorAll(tag);
        return res.length == 1 ? res[0] : res;
    }
}

new Cart