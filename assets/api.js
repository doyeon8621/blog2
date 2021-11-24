// const socket = io.connect("/");

// socket.on("BUY_GOODS", function (data) {
//   const { nickname, goodsId, goodsName, date } = data;
//   makeBuyNotification(nickname, goodsName, goodsId, date);
// });

function initAuthenticatePage() {
  // socket.emit("CHANGED_PAGE", `${location.pathname}${location.search}`);
}

function bindSamePageViewerCountEvent(callback) {
  // socket.on("SAME_PAGE_VIEWER_COUNT", callback);
}

function postOrder(user, order) {
  if (!order.length) {
    return;
  }

  // socket.emit("BUY", {
  //   nickname: user.nickname,
  //   goodsId: order[0].goods.goodsId,
  //   goodsName:
  //     order.length > 1
  //       ? `${order[0].goods.name} 외 ${order.length - 1}개의 상품`
  //       : order[0].goods.name,
  // });
}
//로그인했는지 검증
function getSelf(callback) {
  $.ajax({
    type: "GET",
    url: "/api/users/me",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (response) {
      callback(response.user);
    },
    error: function (xhr, status, error) {
      if (status == 401) {
        alert("로그인이 필요합니다.");
      } else {
        localStorage.clear();
        alert("알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.");
      }
      window.location.href = "/";
    },
  });
}
//로그아웃
function signOut() {
  localStorage.clear();
  window.location.href = "/";
}
