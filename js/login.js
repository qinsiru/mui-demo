(function($, doc) {
				$.init();
				console.log(md5);
				$.plusReady(function() {
					plus.navigator.setStatusBarBackground('#f7f7f7');
					plus.navigator.setStatusBarStyle('dark');
					doc.getElementById('username').value = plus.storage.getItem('username');
					doc.getElementById('pwd').value = plus.storage.getItem('password');

					// 开关改变状态的时候
					doc.getElementById('auto-login').addEventListener('toggle', function(e) {
						if(e.detail.isActive) {
							doc.getElementById('rempwd').checked = true;
						}
					})

					// 记住密码改变状态时
					doc.getElementById('rempwd').onchange = function() {
						if(!this.checked) {
							var isActive = doc.getElementById("auto-login").classList.contains("mui-active");
							if(isActive) {
								$('#auto-login').switch().toggle();
							}
						}
					}

					doc.getElementById('loginBtn').addEventListener('tap', function() {
						//1. 检测用户填写表单的信息
						var usr = doc.getElementById('username').value,
							pwd = doc.getElementById('pwd').value;

						if(!usr.length) {
							$.alert('用户名不能为空', 'Error!', 'OK!');
							return;
						}

						if(pwd.length < 3 || pwd.length > 12) {
							$.alert('密码长度为3-12位', 'Error!', 'OK!');
							return;
						}

						$.ajax('http://plrabbit.com/face/login.php', {
							data: {
								username: usr,
								password: md5(pwd)
							},
							type: 'post',
							dataType: 'json',
							success: function(data) {
								if(data.login == 'yes') {
									saveInStorage(usr);
									autoLogin();
									plus.webview.getWebviewById('my').reload();
									plus.webview.close('login', 'slide-out-bottom');
								} else {
									plus.nativeUI.toast('用户名或密码错误！');
								}
							},
							timeout: 5000,
							error: function(xhr, type) {
								plus.nativeUI.toast('诶呀！网络开小差了！');
							}
						})
					})
				});

				// 2. 把用户名信息存在离线存储内
				function saveInStorage(usr) {
					plus.storage.setItem('username', usr);
					var isRem = doc.getElementById('rempwd').checked;
					if(isRem) {
						// 记住密码
						var pwd = doc.getElementById('pwd').value;
						plus.storage.setItem('password', pwd);
					} else {
						plus.storage.removeItem('password');
					}
				}

				// 3. 自动登录功能实现
				function autoLogin() {
					var isActive = doc.getElementById('auto-login').classList.contains('mui-active');
					if(isActive) {
						plus.storage.setItem('login', 'yes');
					} else {
						plus.storage.removeItem('login');
					}
				}

			})(mui, document);