<template>
  <div class="back">
    <mt-header title="实 名 认 证" fixed>
      <mt-button icon="back" @click="prev()" class="header_left" slot="left"></mt-button>
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
        <li>
          <img slot="icon" src="@/assets/image/Mine/Identification/ic-handle_un.png">
          <br>上传手持
        </li>
      </ul>
    </div>
    <div class="front_body">
      <p>身份证国徽面</p>
      <!-- 背面 -->
      <vue-clip
        :img="option.img2"
        :dataUrlType="option.dataUrlType"
        :accept="option.accept"
        :autoClip="option.autoClip"
        :autoClipWidth="option.autoClipWidth"
        :autoClipHeight="option.autoClipHeight"
        :fixed="option.fixed"
        :outputSize="option.outputSize"
        :theme="option.theme"
        :fixedNumber="option.fixedNumber"
        @finish="IMGTWO"
      ></vue-clip>
      <mt-field label="签发机关" placeholder="请输入签发机关" v-model="Authority"></mt-field>
      <mt-field label="有效期" placeholder="请输入有效期" v-model="Validity"></mt-field>
      <ul class="next">
        <li @click="again()">重新上传</li>
        <li @click="next()">下一步</li>
      </ul>
    </div>
  </div>
</template>
<script>
let IMGTWO = "";
let IMGTHREE = "";
import { Toast } from "mint-ui";
import EXIF from "exif-js";
import { VueClip } from "vue-pic-clip";
import { checkToken } from "@/api/api.js";
import qs from "qs";
export default {
  inject: ["reload"],
  name: "back",
  data() {
    return {
      current: 0,
      option: {
        img2: require("@/assets/image/Mine/Identification/ID_back.png"), // 身份证背面图
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
      /* 证件有效期 */
      Validity: "",
      /* 签发机关 */
      Authority: "",
      IMGBACK: "" // 身份证国徽面
    };
  },

  props: ["model"],
  created() {},
  ready() {},
  methods: {
    getImageData(imageData) {
      console.log(imageData);
    },
    getImageDataUrl(dataUrl) {
      this.src = dataUrl;
    },
    prev() {
      history.go(-1);
    },
    again() {
      this.$router.push("/Identification");
      window.localStorage.removeItem("one"); //清除文件
      window.localStorage.removeItem("two"); //清除文件
      window.localStorage.removeItem("three"); //清除文件
    },
    // 身份证反面
    IMGTWO(name, url) {
      // 完成上传图片，返回图片名称、数据
      let formData = new FormData();
      this.IMGBACK = url.slice(23);
      console.log(this.IMGBACK);
    },
    next() {
      /* 正面 */
      if (!this.IMGBACK) {
        Toast("请上传身份证人像照");
        return;
      }
      if (!this.Authority) {
        Toast("请输入签发机关");
        return;
      }
      if (!this.Validity) {
        Toast("请输入有效期");
        return;
      }
      let two = {
        imgBack: this.IMGBACK, // 身份证国徽面
        Validity: this.Validity, // 身份证有效期
        Authority: this.Authority //签发机关
      };
      window.localStorage.setItem("two", JSON.stringify(two));
      this.$router.push("/submitImgPage");
    }
  },

  /* 注册组件 */
  components: {
    VueClip
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
.clip > input {
  background: #000;
}
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
  position: absolute;
  top: 1.2rem;
  height: 2.5rem;
  background: @blue;
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
    li:nth-child(4) {
      width: 15%;
      height: 3px; /* no */
      margin-top: 1.2rem;
    }
  }
  .twoImgIcon {
    border-bottom: 1px solid #1450e6; /* no */
    width: 15%;
    height: 3px; /* no */
    margin-top: 1.2rem;
  }
}
.promptMsg {
  width: 80%;
  height: 3.5rem;
  margin: -1rem auto;
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
  position: fixed;
  top: 3.7rem;
  bottom: 0;
  input {
    width: 5rem;
    height: 3rem;
    background-size: 100% 100%;
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
  height: 40%;
  border: none;
}
.mint-field {
  width: 60%;
  height: 1rem;
  margin: 0 auto;
}
.next {
  width: 100%;
  margin: 0.5rem auto;
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
  width: 77%;
  height: 32%;
  margin: 0 auto;
  input {
    width: 100%;
    height: 100%;
  }
}
.clip .icon[data-v-29874490] {
  border: none;
}
.mint-cell-text {
  font-size: 0.4rem;
}
.mint-field-core {
  font-size: 0.35rem;
  border-bottom: 1px solid #9b9b9b; /* no */
  text-align: left;
}
</style>