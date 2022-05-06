class List {
    constructor() {
        //  给属性赋值,调用其他方法
        this.getData();

        //将加入购物车,使用事件委托
        this.$('.sk_bd ul').addEventListener('click', this.addCartFn.bind(this))//默认是指向ul,改变this指向当前实例化对象

        this.getCateList();
    }

    // 获取数据的方法  
    //获取大量的数据,渲染到页面中去,需要async await
    // async await 使该方法变成同步的了   等待promise对象解析完成
    async getData() {
        // 等待promise对象解包完成
        let { data, status } = await axios.get('http://localhost:8888/goods/list?current=4')  //返回的是一个promise对象
        // console.log(data,status);

        //判断返回值的状态,追加数据
        if (status == 200) {
            // console.log(data);

            let html = '';
            //遍历list数据
            data.list.forEach(goods => {
                // console.log(goods);  //遍历出每一条商品信息
                html += ` <li class="sk_goods" data-id="${goods.goods_id}">  
                <a href="detail.html"><img src="
                ${goods.img_big_logo}" alt=""></a>
                <h5 class="sk_goods_title">${goods.title}</h5>
                <p class="sk_goods_price"><em>${goods.current_price}</em> <del>￥${goods.price}</del></p>
                <div class="sk_goods_progress">
                    已售<i>${goods.sale_type}</i>
                    <div class="bar">
                        <div class="bar_in"></div>
                    </div>
                    剩余<em>${goods.goods_number}</em>件
                </div>
               
                <a href="#none"  class="sk_goods_buy">立即抢购</a>
            </li>`;
            });
            // <a href="detail.html" class="sk_goods_buy">立即抢购</a> 
            this.$('.sk_bd ul').innerHTML = html;

        }


    }

    //加入购物车的方法  
    async addCartFn(eve) {
        // console.log(this);//获取当前的实例化
        //根据eve 获取事件源
        // console.log( eve.target); //点击 立即抢购 获取到a标签
        //给每条li标签的商品  添加商品id   goods_id

        //用户登录才有id  所以需要  判断是否用户登录   登录之后就会存到local storage    如果能够获取到token,则表示登录,获取不到表示未登录
        //获取值(getItem)
        let token = localStorage.getItem('token')
        //跳转  如果没获取值 就跳转到登录页面
        if (!token) location.assign('./login.html?Return=./list.html');

        //如果用户登录,则将数据信息添加到购物车中-->购物车端口
        //判断是否点击的是a标签 
        //商品id的获取
        if (eve.target.classList.contains('sk_goods_buy')) {
            let lisObj = eve.target.parentNode;//获取到父级li标签
            // console.log(lisObj);
            let goodsId = lisObj.dataset.id;
            // console.log(goodsId);
            let userId = localStorage.getItem('user_id');

            //两个id必须都具备,才能发送请求
            if (!userId || !goodsId) throw new Error('两个id存在问题,请打印...');

            //authorization   字段头
            axios.defaults.headers.common['authorization'] = token;
            //Content-Type
            axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            let param = `id=${userId}&goodsId=${goodsId}`
            //如果用户登录,则将数据信息添加到购物车
            //解构
            let { data, status } = await axios.post('http://localhost:8888/cart/add', param)
            // console.log(data, status);

            // 接收完之后,判断data和status值
            if(status==200){
                console.log(data);  //为了获取到code值
                if(data.code==1){ //购买成功
                    layer.open({
                        content:'加入购物车成功...',
                        btn:['去购物车结算','留在当前页面']
                        ,yes: function(index, layero){
                            //按钮【按钮一】的回调
                            //实现跳转
                            location.assign('./cart.html')
                          }
                          ,btn2: function(index, layero){
                            //按钮【按钮二】的回调
                            //return false 开启该代码可禁止点击该按钮关闭
                            
                          }
                    })
                }
            }
        }
        //商品id或用户id获取
        // console.log(eve.target);




    }

    // async getCateList(){
    //     let res=await axios.get('http://localhost:8888/goods/category');
    //     console.log(res);
    // }

    //都要获取节点,封装一个函数
    $(tag) {
        let res = document.querySelectorAll(tag);
        return res.length == 1 ? res[0] : res;
    }
}
new List  