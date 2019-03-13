<template>
  <div class="BusinessInformation">
    <!-- =======================      商 户 信 息 页 面     ======================== -->
    <mt-header title="代理信息" fixed v-show="cur === 0" :class="{'curr':cur === 0}">
      <mt-button icon="back" @click="prev()" slot="left"></mt-button>
      <mt-button slot="right" @click="dialogFormVisible = true">筛选</mt-button>
    </mt-header>
    <ul class="listTop" v-show="cur === 0" :class="{'curr':cur === 0}">
      <li>类型</li>
      <li>商户名</li>
      <li>联系人</li>
      <li>联系电话</li>
    </ul>
    <ul class="listTital" v-show="cur === 0" :class="{'curr':cur === 0}">
      <li v-for="item in list" :key="item.c">
        <span>{{ item.type }}</span>
        <span>{{ item.name }}</span>
        <span>{{ item.user }}</span>
        <span>{{ item.phone }}</span>
      </li>
    </ul>
    <!-- ==========     弹 出  代 理 信 息 筛 选 模 态 框    ========== -->
    <el-dialog :visible.sync="dialogFormVisible" width="70%">
      <el-form :model="form">
        <div class="field">
          <mt-field label="联系人" placeholder="请输入联系人" v-model="form.bususer"></mt-field>
          <mt-field label="联系电话" placeholder="请输入联系电话" v-model="form.busphone"></mt-field>
          <mt-field label="商户号" placeholder="请输入商户号" v-model="form.busId"></mt-field>
          <mt-field label="商户名" placeholder="请输入商户名" v-model="form.busname"></mt-field>
        </div>
        <el-form-item label="所属上级">
          <el-select v-model="form.busregion" placeholder="代理机构" class="BusinessInformation_select">
            <el-option
              v-for="item in busregion"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="item">代理状态</div>
        <ul>
          <li>
            <el-button type="primary" plain>正常</el-button>
          </li>
          <li>
            <el-button type="primary" plain>注销</el-button>
          </li>
          <li>
            <el-button type="primary" plain>待激活</el-button>
          </li>
        </ul>
        <div class="item1">商户类型</div>
        <ul class="ul">
          <li>
            <el-button type="primary" plain>经销商</el-button>
          </li>
          <li>
            <el-button type="primary" plain>代办点</el-button>
          </li>
          <li>
            <el-button type="primary" plain>代理商</el-button>
          </li>
          <li>
            <el-button type="primary" plain>直销账户</el-button>
          </li>
        </ul>

        <input type="reset" class="reset">
        <el-button class="ensure" type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "BusinessInformation",
  data() {
    return {
      //初始化无限加载相关参数
      queryLoading: false,
      moreLoading: false,
      allLoaded: false,
      popupVisible: false,
      dialogFormVisible: false, // 筛选栏的表单
      cur: 0,
      value: "",
      active: 0,
      busregion: [
        {
          value: "选项1",
          label: "马化腾"
        },
        {
          value: "选项2",
          label: "李忠"
        },
        {
          value: "选项3",
          label: "白骑士"
        }
      ],
      form: {
        busname: "", // 商户名
        busregion: "", // 代理机构
        bususer: "", // 联系人
        busphone: "", // 联系电话
        busId: "", // 商户号
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      list: [
        {
          type: "icon",
          name: "创鑫机构",
          user: "马化腾",
          phone: "189****5689"
        },
        {
          type: "icon",
          name: "创鑫机构",
          user: "马化腾",
          phone: "189****5689"
        },
        {
          type: "icon",
          name: "创鑫机构",
          user: "马化腾",
          phone: "189****5689"
        },
        {
          type: "icon",
          name: "创鑫机构",
          user: "马化腾",
          phone: "189****5689"
        }
      ],
      /* tabbar */
      icon: {
        normal: require("@/assets/image/Manger/Agents/icon07.png"),
        active: require("@/assets/image/Manger/Agents/icon07_choice.png"),
        normal2: require("@/assets/image/Manger/Agents/icon08.png"),
        active2: require("@/assets/image/Manger/Agents/icon08_choice.png"),
        normal3: require("@/assets/image/Manger/Agents/icon09.png"),
        active3: require("@/assets/image/Manger/Agents/icon09_choice.png"),
        normal4: require("@/assets/image/Manger/Agents/icon10.png"),
        active4: require("@/assets/image/Manger/Agents/icon10_choice.png")
      },
      loadingText: "努力加载中"
    };
  },
  methods: {
    /* 方法 */
    prev() {
      this.$router.go(-1);
    }
  },
  components: {
    /* 组件 */
  }
};
</script>
<style lang="less">
@blue: #1c8cff;
/* 头部 */
.queryAgent {
  background: #f5f5f5;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
}
/* 筛选框 */
form {
  width: 9rem;
  background: #fff;
  position: absolute;
  top: 0;
  bottom: 0;
}
/* 列表头部 */
.listTop {
  width: 100%;
  height: 1.1rem;
  position: fixed;
  top: 1.2rem;
  display: flex;
  flex-direction: row;
  text-align: center;
  line-height: 1.1rem;
  background: #fff;
  color: #1c8cff;
  padding-left: 4.5%;
  padding-right: 4.5%;
  li {
    width: 22.5%;
    border-bottom: 1px solid #1c8cff; /* no */
  }
}
/* 列表 */
.listTital {
  margin-top: 2.3rem;
  padding-left: 4%;
  padding-right: 4%;
  background: #fff;
  li {
    width: 100%;
    height: 1.1rem;
    text-align: center;
    line-height: 1.1rem;
    border-bottom: 1px solid #d9d9d9; /* no */
    span {
      display: inline-block;
      width: 24%;
      height: 1.1rem;
    }
  }
}
/* tabbar */
.tabbar {
  width: 100%;
  height: 1.3rem;
  background: #fff;
  position: fixed;
  bottom: 0;
  .mint-tabbar {
    height: 1.3rem;
    .mint-tab-item-label {
      font-size: 0.35rem;
    }
    .mint-tab-item-icon {
      width: 0.6rem;
      height: 0.6rem;
    }
  }
  li {
    width: 33.3%;
    height: 1.3rem;
    float: left;
    text-align: center;
  }
}
/* ====================        弹 出 框         ======================== */
.el-dialog {
  margin-top: 0 !important;
  position: fixed;
  top: 0rem;
  bottom: -1rem;
  left: 0;
  right: 0;
  font-size: 0.4rem;
}
.el-input__inner {
  width: 100%;
  height: 0.5rem;
  margin-left: -0.2rem;
  border: none;
  font-size: 0.3rem;
}
.el-form-item__label {
  font-size: 0.35rem;
  line-height: 0.7rem;
}
.select_entry {
  border: 1px solid #1c8cff; /* no */
  border-radius: 0.2rem;
  height: 0.7rem;
  margin-left: 0.3rem;
  padding-left: 0.3rem;
  width: 30%;
  line-height: 0.7rem;
  .el-select__caret {
    margin-top: -1.8rem;
  }
}
span {
  font-size: 0.35rem;
}
.el-form {
  .field {
    width: 80%;
    height: 6rem;
    margin-top: 1rem;
    .mint-field {
      width: 90%;
      height: 1rem;
      margin-top: 0.5rem;
      .mint-cell-text {
        font-size: 0.35rem;
      }
      .mint-field-core {
        border: 1px solid #1c8cff; /* no */
        height: 0.8rem;
        margin-left: 0.3rem;
        padding-left: 0.3rem;
        font-size: 0.3rem;
        border-radius: 0.2rem;
      }
    }
  }
  .reset {
    position: fixed;
    left: 15%;
    bottom: 0;
    height: 1.3rem;
    width: 30%;
    border-radius: 0;
    background: #d9d9d9;
    color: #222222;
    border: none;
    font-size: 0.35rem;
  }
  .ensure {
    position: fixed;
    right: 0;
    width: 55%;
    border-radius: 0;
    height: 1.3rem;
    color: #ffffff;
    background: #1c8cff;
    bottom: 0;
    font-size: 0.35rem;
  }
  ul {
    width: 100%;
    height: 2.5rem;
    margin-top: 0.5rem;
    border-bottom: 2px solid #d9d9d9; /* no */
    li {
      width: 24%;
      height: 0.8rem;
      line-height: 0.8rem;
      float: left;
      text-align: center;
      background: #eaeaea;
      border-radius: 0.1rem;
      margin: 0.2rem 0.2rem;
      color: #606060;
      .is-plain {
        background: #eaeaea;
        color: #606060;
        border: none;
      }
      .el-button {
        width: 100%;
        height: 0.8rem;
      }
    }
  }
  .item {
    width: 30%;
    height: 0.5rem;
    border-left: 5px solid #1c8cff; /* no */
    line-height: 0.5rem;
    padding-left: 0.2rem;
    font-size: 0.36rem;
    color: #333333;
  }
  .item1 {
    width: 30%;
    height: 0.5rem;
    border-left: 5px solid #1c8cff; /* no */
    line-height: 0.5rem;
    padding-left: 0.2rem;
    font-size: 0.36rem;
    color: #333333;
    margin-top: 0.5rem;
  }
  .ul {
    border: none;
  }
}
/* ==============       tabbar        ============= */

.footer {
  .van-tabbar {
    height: 1.3rem;
    span {
      font-size: 0.3rem;
    }
    .van-tabbar-item__icon {
      img {
        height: 0.6rem;
      }
    }
  }
}
</style>
