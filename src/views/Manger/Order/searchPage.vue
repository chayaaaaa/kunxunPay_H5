<template>
  <div class="searchPage">
    <!-- ==============   会 员 信 息 搜 索 页 面     ============== -->
    <form action="/">
      <div class="search">
        <div class="searchInput">
          <input type="text" placeholder="请输入会员号查询">
          <div class="img">搜索
            <!-- <img src="@/assets/image/Manger/Trade/search.png"> -->
          </div>
          <!-- <div class="cancel">取消</div> -->
        </div>
        <!--  -->
      </div>
    </form>
  </div>
</template>
<script>
export default {
  name: "searchPage",
  data() {
    return {
      value: ""
    };
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
.searchPage {
  width: 100%;
  height: auto;
  position: fixed;
  top: 1.2rem;
  bottom: 0;
  background: #fff;
  z-index: 20;
  .search {
    background: @blue;
    width: 100%;
    height: 0.8rem;
    padding-top: 0.2rem;
    border: 1px solid #fff; /* no */
    .img {
      width: 20%;
      height: 0.55rem;
      line-height: 0.55rem;
      float: left;
      color: #fff;
      border: 1px solid #fff; /* no */
      border-top-right-radius: 0.1rem;
      border-bottom-right-radius: 0.1rem;
      text-align: center;
      font-size: 0.4rem;
      img {
        width: 0.6rem;
      }
    }
    input {
      background: #fff;
      border-top-left-radius: 0.1rem;
      border-bottom-left-radius: 0.1rem;
      color: #000;
      width: 75%;
      margin-left: 2.5%;
      height: 0.6rem;
      float: left;
    }
    .cancel {
      width: 10%;
      height: 0.6rem;
      line-height: 0.6rem;
      float: right;
    }
  }
}
</style>
