<template>
  <div class="submitImgPage">
    <mt-header title="实 名 认 证" fixed>
      <mt-button icon="back" class="header_left" @click="prev()" slot="left"></mt-button>
    </mt-header>
    <!-- =================      实 名 认 证 页 面        ================= -->
    <!-- 上方进度栏 -->
    <div class="upload">
      <!-- tab -->
      <ul class="tab">
        <li>
          <img slot="icon" src="@/assets/image/Mine/Identification/ic-front.png">
          <br>上传正面
        </li>
        <li></li>
        <li>
          <img slot="icon" src="@/assets/image/Mine/Identification/ic-backface.png">
          <br>上传反面
        </li>
        <li class="twoImgIcon"></li>
        <li class="curr">
          <img slot="icon" src="@/assets/image/Mine/Identification/ic-handheld.png">
          <br>上传手持
        </li>
      </ul>
    </div>
    <div class="front_body">
      <p>手持身份证</p>
      <!-- 手持 -->
      <vue-clip
        :img="option.img3"
        :dataUrlType="option.dataUrlType"
        :accept="option.accept"
        :autoClip="option.autoClip"
        :autoClipWidth="option.autoClipWidth"
        :autoClipHeight="option.autoClipHeight"
        :fixed="option.fixed"
        :outputSize="option.outputSize"
        :theme="option.theme"
        :fixedNumber="option.fixedNumber3"
        @finish="IMGTHREE"
      ></vue-clip>
      <div class="promptMsg">
        <div class="right">
          <li>
            <div class="div">
              <p></p>
            </div>
            <p>免冠、建议未化妆，五官清晰可以见</p>
          </li>
          <li>
            <div class="div">
              <p></p>
            </div>
            <p>身份证信息全部清晰可见且与头像为同一人</p>
          </li>
          <li>
            <div class="div">
              <p></p>
            </div>
            <p>大拇指与食指手持身份证原件上下端，完整露出手臂拍照</p>
          </li>
        </div>
      </div>
      <ul class="next">
        <li @click="again()">重新上传</li>
        <li @click="next()">提交</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import EXIF from "exif-js";
import { VueClip } from "vue-pic-clip";
import { checkToken, addRealNameAuth } from "@/api/api.js";
import qs from "qs";
export default {
  inject: ["reload"],
  name: "submitImgPage",
  data() {
    return {
      current: 0,
      option: {
        img3: require("@/assets/image/Mine/Identification/handheld_ID.png"), // 手持身份证面
        accept: "image/png, image/jpeg, image/jpg, image/gif", // 可上传的图片类型
        outputSize: 0.7, // 压缩质量
        autoClip: true, // 是否开启截图框
        dataUrlType: "base64", // 数据类型
        canMoveBox: true, // 截图框是否可以移动
        fixed: true, // 截图框是否开启固定宽高比
        fixedNumber: [1, 0.6], // 宽高比 w/h
        fixedNumber3: [0.3, 0.5], // 宽高比 w/h
        theme: "rect", // 样式风格，默认rect:方形，circle:圆形
        clipImg: "" // 裁剪后的图片
      },
      status: "",
      idCardNum: JSON.parse(window.localStorage.getItem("one")).id, //身份证号
      realName: JSON.parse(window.localStorage.getItem("one")).name, //真实姓名
      authImgFront: JSON.parse(window.localStorage.getItem("one")).imgface, //身份证正面
      issuer: JSON.parse(window.localStorage.getItem("two")).Authority, //发卡行
      validDate: JSON.parse(window.localStorage.getItem("two")).Validity, //有效期
      authImgBack: JSON.parse(window.localStorage.getItem("two")).imgBack, //身份证背面
      IMGHANDLE: "" // 手持身份证照片
    };
  },

  props: ["model"],
  created() {},
  ready() {},
  methods: {
    if() {},
    prev() {
      this.$router.go(-1);
    },
    getImageData(imageData) {
      console.log(imageData);
    },
    getImageDataUrl(dataUrl) {
      this.src = dataUrl;
    },
    back() {
      this.$router.push("/index");
    },
    again() {
      this.$router.push("/Identification");
      window.localStorage.removeItem("one"); //清除文件
      window.localStorage.removeItem("two"); //清除文件
      window.localStorage.removeItem("three"); //清除文件
    },
    // 手持身份证面
    IMGTHREE(name, url) {
      // 完成上传图片，返回图片名称、数据
      let formData = new FormData();
      this.IMGHANDLE = url.slice(23);
      console.log(this.IMGHANDLE);
      window.localStorage.setItem("three", JSON.stringify(this.IMGHANDLE));
    },

    next() {
      if (!this.IMGHANDLE) {
        Toast("请上传手持身份证照片");
        return;
      }
      // 提交数据
      var params = new URLSearchParams();
      params.append("idCardNum", this.idCardNum); //身份证号
      params.append("realName", this.realName); //真实姓名
      params.append("issuer", this.issuer); //发卡行
      params.append("validDate", this.validDate); //有效期
      params.append("authImgFront", this.authImgFront); //身份证正面
      params.append("authImgBack", this.authImgBack); //身份证背面
      params.append("authImgHold", this.IMGHANDLE); //手持身份证
      params.append("number", Math.random());
      addRealNameAuth(params)
        .then(response => {
          console.log(response.data);
        })
        .catch(function(error) {
          Toast(response.message);
        });
      this.$router.push("/submitSuccessPage");
    }
  },
  created() {
    checkToken();
  },
  /* 注册组件 */
  components: {
    VueClip
  }
};
</script>
<style lang="less" scoped>
.submitImgPage{
 /*  width: 100%; */
/*   height: 100%; */
 /*  overflow: auto; */

}
@blue: #1c8cff;
/* 头部 */
.mint-header {
  height: 1.2rem;
  font-size: 0.5rem;
  font-weight: 100;
  background: @blue;
}
.header_left {
  margin-left: 0.3rem;
}
.picSize {
  height: 50% !important;
  width: 50%;
  margin: 0 auto;
}
.mintui {
  font-size: 0.4rem;
}
/* 进度栏 */
.upload {
  width: 100%;
  position: fixed;
  top: 1.2rem;
  height: 2.5rem;
  background: @blue;
  z-index: 999;
  ul {
    width: 100%;
    height: 1.5rem;
    li {
      width: 20%;
      float: left;
      text-align: center;
      margin-top: 0.5rem;
      color: #176ce1;
      img {
        width: 60%;
      }
    }
    .curr {
      color: #fff !important;
      opacity: 0.7;
    }
    li:nth-child(1) {
      margin-left: 5%;
      color: #fff;
      opacity: 0.8;
    }
    li:nth-child(2) {
      width: 15%;
      height: 3px; /* no */
      border-bottom: 1px solid #1450e6; /* no */
      margin-top: 1.2rem;
    }
    li:nth-child(3) {
      color: #fff;
      opacity: 0.7;
    }
  }
  .twoImgIcon {
    border-bottom: 1px solid #1450e6; /* no */
    width: 15%;
    height: 3px; /* no */
    margin-top: 1.2rem;
    opacity: 0.7;
  }
}
.promptMsg {
  width: 80%;
  height: 3.5rem;
  margin: -0rem auto;
  .right {
    width: 100%;
    height: 3.5rem;

    li {
      .div {
        width: 0.5rem;
        height: 0.55rem;
        float: left;
      }
      p:nth-child(1) {
        width: 6px; /* no */
        height: 6px; /* no */
        border-radius: 6px; /* no */
        background: #1c8cff;
        margin-right: 0.3rem;
        float: left;
        margin-top: 0.15rem;
      }
      p:nth-child(2) {
        font-size: 0.4rem !important;
        color: #020202 !important;
        text-align: left !important;
        margin-top: 0.5rem !important;
        line-height: 0.5rem;
      }
    }
  }
}

.front_body {
  width: 100%;
  position: absolute;
  top: 3.7rem;
  bottom: 0;
  input {
    width: 5rem;
    height: 3rem;
  }
  p {
    font-size: 0.4rem;
    text-align: center;
    margin-top: 1rem;
    color: #176ce1;
  }
}

.mainblock {
  border: 1px solid gainsboro; /* no */
  border-radius: 2px;
}
.img {
  margin-top: 10px;
  margin-left: 20px;
}
.clip {
  width: 60%;
  height: 40%;
  border: none;
  margin: 0 auto;
  margin-top: 0.5rem;
}
.mint-field {
  width: 60%;
  height: 1rem;
  margin: 0 auto;
}
.next {
  width: 100%;
  margin: 0rem auto;
  li {
    width: 35%;
    height: 1rem;
    line-height: 1rem;
    background: @blue;
    float: left;
    text-align: center;
    color: #fff;
    border-radius: 5px; /* no */
    margin-top: 1rem;
  }
  li:nth-child(1) {
    margin-right: 10%;
    margin-left: 10%;
    background: none;
    border: 1px solid @blue; /* no */
    color: @blue;
  }
}
.submitSuccessPage {
  width: 100%;
  height: 8rem;
  background: url("~@/assets/image/Mine/Identification/bj.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  text-align: center;
  color: #fff;
  display: none;
  .sucImg {
    width: 60%;
  }
  img {
    display: block;
    width: 3rem;
    height: 3rem;
    margin: 2rem auto;
  }
  .mint-header {
    background: none;
  }
  p {
    width: 100%;
    height: 0.5rem;
  }
  .p1 {
    margin-top: -1.5rem;
    font-size: 0.6rem;
    margin-bottom: 0.3rem;
  }
  li {
    width: 95%;
    height: 1.2rem;
    line-height: 1.2rem;
    background: #1c8cff;
    border-radius: 5px; /* no */
    color: #fff;
    position: absolute;
    bottom: -4rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    font-size: 0.4rem;
    span {
      display: block;
      float: right;
    }
  }
  .li2 {
    width: 95%;
    height: 1.2rem;
    position: absolute;
    bottom: -1.3rem;
    background: #fff;
    border-radius: 0;
    border-bottom: 1px solid #d9d9d9; /* no */
    color: #000;
    text-align: left;
  }
  .li3 {
    width: 95%;
    height: 1.2rem;
    position: absolute;
    bottom: -2.6rem;
    background: #fff;
    border-radius: 0;
    color: #000;
    text-align: left;
    border-bottom: 1px solid #d9d9d9; /* no */
  }
}
</style>
<style lang="less">
.mint-cell-title {
  width: 2rem !important;
}
.picture {
  img {
    width: 60%;
  }
}

.clip {
  .picture {
    width: 70%;
  }
  input {
    width: 100%;
    height: 100%;
  }
}
.clip .icon[data-v-29874490] {
  border: none;
}
</style>

