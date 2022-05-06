class Detail {
    constructor() {
      this.$('.small').addEventListener('mouseenter', this.mouseEnter.bind(this));
      this.$('.small').addEventListener('mouseleave', this.mouseLeave.bind(this));
      this.$('.small').addEventListener('mousemove', this.mouseMove.bind(this));
    }

    mouseEnter() {
        this.$('.mask').style.display = 'block';
        this.$('.big').style.display = 'block';
    }
    mouseLeave() {
        this.$('.mask').style.display = 'none';
        this.$('.big').style.display = 'none';
    }

    mouseMove(eve) {
        let cX = eve.pageX;
        let cY = eve.pageY;

        let maskW = this.$('.mask').offsetWidth;
        let maskH = this.$('.mask').offsetHeight;

        let maskL = cX - this.$('.preview_img').offsetTop - maskW / 2;
        let maskT = cY - this.$('.preview_img').offsetLeft - maskH / 2;

        //4-3 计算mask的边框
        //判断是否超出上和左边界
        if (maskL < 0) maskL = 0;
        if (maskT < 0) maskT = 0;

        //计算最大值,不能从右和下边出去
        let maxMaskL = this.$('.small').offsetWidth - maskW;
        let maxMaskT = this.$('.small').offsetHeight - maskH;
        // console.log(smallObj.offsetWidth);
        if (maskL > maxMaskL) maskL = maxMaskL;
        if (maskT > maxMaskT) maskT = maxMaskT;

        //将值设置给mask
        this.$('.mask').style.left = maskL + 'px';
        this.$('.mask').style.top = maskT + 'px';

        //小黄快与大图的比例关系
        //5 计算大图能够移动的left和top值
        let bigMaxLeft = this.$('.bigImg').offsetWidth - this.$('.big').offsetWidth;
        let bigMaxTop = this.$('.bigImg').offsetHeight - this.$('.big').offsetHeight;

        //5-1 计算大图的实时位置
        let tmpBigImgLeft = maskL / maxMaskL * bigMaxLeft;
        let tmpBigImgTop = maskT / maxMaskT * bigMaxTop;

        //5-2 设置大图的位置
        this.$('.bigImg').style.left = -tmpBigImgLeft + 'px';
        this.$('.bigImg').style.top = -tmpBigImgTop + 'px';
    }

    $(tag) {
        let res = document.querySelectorAll(tag)
        return res.length == 1 ? res[0] : res;
    }
}
new Detail()
