// var regPwd = /^(?![a-z]+$)(?![A-Z]+$)(?![(`~!@#$%^&*()-_=+|[{}\];:'",<.>/?)]+$)(?![0-9]+$)[a-zA-Z0-9(`~!@#$%^&*()-_=+|[{}\];:'",<.>/?)]{10,128}$/;
var regPwd = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~ ]+$)(?![a-z0-9]+$)(?![a-z\W_!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~ ]+$)(?![0-9\W_!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~ ]+$)[a-zA-Z0-9\W_!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~ ]{10,32}$/
var regMoreTwo = /.*(.)\1{2}.*/
var str = ''
var localUrl = '/'

//查询
function getListInfo() {
  $.ajax({
    type: "GET",
    url: localUrl + "/firstlogin/users",
    success: function (res) {
      if (res.resultCode === 'PUB-000000') {
        for (let i = 0; i < res.datas.length; i++) {
          str += '<tr><td class="is-leaf"><div class="cell"><input type="text" userid="' + res.datas[i].userId + '" readonly class="uname" value="' + res.datas[i].username + '"/></div></td>' +
          '<td class="is-leaf"><div class="cell"><input type="password" placeholder="密码" autocomplete="off" class="pwd_txt" /><div class="errMsg">123</div></div></td>' +
          '<td class="is-leaf"><div class="cell"><input type="password" placeholder="确认密码" autocomplete="off" class="surePwd_txt" /><div class="errSureMsg"></div></div></td></tr>' 
        }
        $("#subject").append(str);      
      } else if (res.resultCode === 'FIRST-400000') {
        $('.msg').text('不再是初次登录状态').show(300).delay(3000).hide(300)
      } else {
        $('.msg').text('初始化失败').show(300).delay(3000).hide(300)
      }
    },
    error: function (res) {
      $('.msg').text('初始化失败').show(300).delay(3000).hide(300)
    },
  });
}

 // 点击确定按钮 修改密码
function ajaxSure(password, userId) {
  var arr = []
  $('.uname').each(function(index,element){
    arr.push({
      userId: $(element).attr('userid')
    })
  });
  $('.pwd_txt').each(function(index,element){
    arr[index].password = $(element).val()
  });
  $.ajax({
    type: "PUT",
    contentType: "application/json;charset=UTF-8",
    url: localUrl + "/firstlogin/userpasswords",
    data: JSON.stringify({userpasswords: arr}),
    success: function (res) {
      if (res.resultCode === 'PUB-000000') {
        $('.msgSuccess').text('初始化成功').show(300).delay(3000).hide(300)
        window.location.href = localUrl
      } else if (res.resultCode === 'FIRST-400000') {
        $('.msg').text('不再是初次登录状态').show(300).delay(3000).hide(300)
      } else {
        $('.msg').text('初始化失败').show(300).delay(3000).hide(300)
      }
    },
    error: function (res) {
      $('.msg').text('初始化失败').show(300).delay(3000).hide(300)
    },
  });
}

$(function () {
  getListInfo()

  // 重置
  $(".reset").on("click", function () {
    $(".pwd_txt").val("");
    $(".surePwd_txt").val("")
  });

  // 确定
  $(".confirm").on("click", function () {
    var uname = $('.uname').val()
    var pwd = $(".pwd_txt").val();
    var surePwd = $(".surePwd_txt").val();
  //密码为空 密码不符合要求
  if (!pwd) {
    $('.msg').text('初始化失败').show(300).delay(3000).hide(300)
    return false
  } else if (!(regPwd.test(pwd))) {
    $('.msg').text('密码不满足要求!').show(300).delay(3000).hide(300)
    return false
  } else if (regMoreTwo.test(pwd)) {
    $('.msg').text('密码不满足要求!').show(300).delay(3000).hide(300)
    return false
  } else if (pwd === uname || pwd.split('').reverse().join('') === uname) {
    $('.msg').text('密码不能与账户一致或者是账户逆序!').show(300).delay(3000).hide(300)
    return false
  } else if (!surePwd) {
    $('.msg').text('请确认密码!').show(300).delay(3000).hide(300)
    return false
  } else if (surePwd !== pwd) {
    $('.msg').text('两次输入密码不一致!').show(300).delay(3000).hide(300)
    return false
  } else {
    ajaxSure();
  }
  });
});
