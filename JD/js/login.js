class Login {
    constructor() {
        //给登录按钮绑定点击事件
        this.$('.login-w .over').addEventListener('click', this.clickFn.bind(this))  //默认是指向.over的button按钮,改变this指向当前实例化对象
    }

    clickFn() {

        //获取页面form表单
        let forms = document.forms[0].elements;
        // console.log(forms);  //得到form 里的password和uname

        let username = forms.uname.value;
        let password = forms.password.value;

        //判断是否为空 
        if (!username.trim() || !password.trim()) throw new Error('不能为空...');


        //登录请求 找接口文档的接口方式和参数
        //根据值
        // console.log(username,password);

        //注意要发送post请求   地址,{传入两个参数}
        //必须设置内容的类型,默认时json格式
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        //原生ajax 写post请求传递参数 xhr.setRequestHeader
        //对参数进行编码
        //数据必须拼接好,以原生的方式拼接
        let data = `username=${username}&password=${password}`;
        axios.post('http://localhost:8888/users/login', data).then(res => {
            let { status, data } = res;
            console.log(data);
            if (status == 200) {   //请求成功的
                //判断是否登录成功,根据里面的code码

                if (data.code == 1) {   //登录成功
                    //token 是登录的标识符
                    //设置    数据,存到token和data.user.id
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user_id', data.user.id);

                    //获取?后面的 用search
                    //以 = 为分隔符
                    // console.log(location.search.split('=')[1]);

                    //跳转页面  从哪里来跳转到哪里去  跳转到list.html
                    location.assign(location.search.split('=')[1]);

                } else { //登录失败,就提示输入错误
                    layer.open({
                        title: '登录提示'
                        , content: '用户名或密码输入错误'
                    });
                }






            }
        });

    }
    //都要获取节点,封装一个函数
    $(tag) {
        let res = document.querySelectorAll(tag);
        return res.length == 1 ? res[0] : res;
    }
}

new Login
