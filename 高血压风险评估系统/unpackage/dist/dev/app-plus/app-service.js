if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const fontData = [
    {
      "font_class": "arrow-down",
      "unicode": ""
    },
    {
      "font_class": "arrow-left",
      "unicode": ""
    },
    {
      "font_class": "arrow-right",
      "unicode": ""
    },
    {
      "font_class": "arrow-up",
      "unicode": ""
    },
    {
      "font_class": "auth",
      "unicode": ""
    },
    {
      "font_class": "auth-filled",
      "unicode": ""
    },
    {
      "font_class": "back",
      "unicode": ""
    },
    {
      "font_class": "bars",
      "unicode": ""
    },
    {
      "font_class": "calendar",
      "unicode": ""
    },
    {
      "font_class": "calendar-filled",
      "unicode": ""
    },
    {
      "font_class": "camera",
      "unicode": ""
    },
    {
      "font_class": "camera-filled",
      "unicode": ""
    },
    {
      "font_class": "cart",
      "unicode": ""
    },
    {
      "font_class": "cart-filled",
      "unicode": ""
    },
    {
      "font_class": "chat",
      "unicode": ""
    },
    {
      "font_class": "chat-filled",
      "unicode": ""
    },
    {
      "font_class": "chatboxes",
      "unicode": ""
    },
    {
      "font_class": "chatboxes-filled",
      "unicode": ""
    },
    {
      "font_class": "chatbubble",
      "unicode": ""
    },
    {
      "font_class": "chatbubble-filled",
      "unicode": ""
    },
    {
      "font_class": "checkbox",
      "unicode": ""
    },
    {
      "font_class": "checkbox-filled",
      "unicode": ""
    },
    {
      "font_class": "checkmarkempty",
      "unicode": ""
    },
    {
      "font_class": "circle",
      "unicode": ""
    },
    {
      "font_class": "circle-filled",
      "unicode": ""
    },
    {
      "font_class": "clear",
      "unicode": ""
    },
    {
      "font_class": "close",
      "unicode": ""
    },
    {
      "font_class": "closeempty",
      "unicode": ""
    },
    {
      "font_class": "cloud-download",
      "unicode": ""
    },
    {
      "font_class": "cloud-download-filled",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload-filled",
      "unicode": ""
    },
    {
      "font_class": "color",
      "unicode": ""
    },
    {
      "font_class": "color-filled",
      "unicode": ""
    },
    {
      "font_class": "compose",
      "unicode": ""
    },
    {
      "font_class": "contact",
      "unicode": ""
    },
    {
      "font_class": "contact-filled",
      "unicode": ""
    },
    {
      "font_class": "down",
      "unicode": ""
    },
    {
      "font_class": "bottom",
      "unicode": ""
    },
    {
      "font_class": "download",
      "unicode": ""
    },
    {
      "font_class": "download-filled",
      "unicode": ""
    },
    {
      "font_class": "email",
      "unicode": ""
    },
    {
      "font_class": "email-filled",
      "unicode": ""
    },
    {
      "font_class": "eye",
      "unicode": ""
    },
    {
      "font_class": "eye-filled",
      "unicode": ""
    },
    {
      "font_class": "eye-slash",
      "unicode": ""
    },
    {
      "font_class": "eye-slash-filled",
      "unicode": ""
    },
    {
      "font_class": "fire",
      "unicode": ""
    },
    {
      "font_class": "fire-filled",
      "unicode": ""
    },
    {
      "font_class": "flag",
      "unicode": ""
    },
    {
      "font_class": "flag-filled",
      "unicode": ""
    },
    {
      "font_class": "folder-add",
      "unicode": ""
    },
    {
      "font_class": "folder-add-filled",
      "unicode": ""
    },
    {
      "font_class": "font",
      "unicode": ""
    },
    {
      "font_class": "forward",
      "unicode": ""
    },
    {
      "font_class": "gear",
      "unicode": ""
    },
    {
      "font_class": "gear-filled",
      "unicode": ""
    },
    {
      "font_class": "gift",
      "unicode": ""
    },
    {
      "font_class": "gift-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-down",
      "unicode": ""
    },
    {
      "font_class": "hand-down-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-up",
      "unicode": ""
    },
    {
      "font_class": "hand-up-filled",
      "unicode": ""
    },
    {
      "font_class": "headphones",
      "unicode": ""
    },
    {
      "font_class": "heart",
      "unicode": ""
    },
    {
      "font_class": "heart-filled",
      "unicode": ""
    },
    {
      "font_class": "help",
      "unicode": ""
    },
    {
      "font_class": "help-filled",
      "unicode": ""
    },
    {
      "font_class": "home",
      "unicode": ""
    },
    {
      "font_class": "home-filled",
      "unicode": ""
    },
    {
      "font_class": "image",
      "unicode": ""
    },
    {
      "font_class": "image-filled",
      "unicode": ""
    },
    {
      "font_class": "images",
      "unicode": ""
    },
    {
      "font_class": "images-filled",
      "unicode": ""
    },
    {
      "font_class": "info",
      "unicode": ""
    },
    {
      "font_class": "info-filled",
      "unicode": ""
    },
    {
      "font_class": "left",
      "unicode": ""
    },
    {
      "font_class": "link",
      "unicode": ""
    },
    {
      "font_class": "list",
      "unicode": ""
    },
    {
      "font_class": "location",
      "unicode": ""
    },
    {
      "font_class": "location-filled",
      "unicode": ""
    },
    {
      "font_class": "locked",
      "unicode": ""
    },
    {
      "font_class": "locked-filled",
      "unicode": ""
    },
    {
      "font_class": "loop",
      "unicode": ""
    },
    {
      "font_class": "mail-open",
      "unicode": ""
    },
    {
      "font_class": "mail-open-filled",
      "unicode": ""
    },
    {
      "font_class": "map",
      "unicode": ""
    },
    {
      "font_class": "map-filled",
      "unicode": ""
    },
    {
      "font_class": "map-pin",
      "unicode": ""
    },
    {
      "font_class": "map-pin-ellipse",
      "unicode": ""
    },
    {
      "font_class": "medal",
      "unicode": ""
    },
    {
      "font_class": "medal-filled",
      "unicode": ""
    },
    {
      "font_class": "mic",
      "unicode": ""
    },
    {
      "font_class": "mic-filled",
      "unicode": ""
    },
    {
      "font_class": "micoff",
      "unicode": ""
    },
    {
      "font_class": "micoff-filled",
      "unicode": ""
    },
    {
      "font_class": "minus",
      "unicode": ""
    },
    {
      "font_class": "minus-filled",
      "unicode": ""
    },
    {
      "font_class": "more",
      "unicode": ""
    },
    {
      "font_class": "more-filled",
      "unicode": ""
    },
    {
      "font_class": "navigate",
      "unicode": ""
    },
    {
      "font_class": "navigate-filled",
      "unicode": ""
    },
    {
      "font_class": "notification",
      "unicode": ""
    },
    {
      "font_class": "notification-filled",
      "unicode": ""
    },
    {
      "font_class": "paperclip",
      "unicode": ""
    },
    {
      "font_class": "paperplane",
      "unicode": ""
    },
    {
      "font_class": "paperplane-filled",
      "unicode": ""
    },
    {
      "font_class": "person",
      "unicode": ""
    },
    {
      "font_class": "person-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled-copy",
      "unicode": ""
    },
    {
      "font_class": "phone",
      "unicode": ""
    },
    {
      "font_class": "phone-filled",
      "unicode": ""
    },
    {
      "font_class": "plus",
      "unicode": ""
    },
    {
      "font_class": "plus-filled",
      "unicode": ""
    },
    {
      "font_class": "plusempty",
      "unicode": ""
    },
    {
      "font_class": "pulldown",
      "unicode": ""
    },
    {
      "font_class": "pyq",
      "unicode": ""
    },
    {
      "font_class": "qq",
      "unicode": ""
    },
    {
      "font_class": "redo",
      "unicode": ""
    },
    {
      "font_class": "redo-filled",
      "unicode": ""
    },
    {
      "font_class": "refresh",
      "unicode": ""
    },
    {
      "font_class": "refresh-filled",
      "unicode": ""
    },
    {
      "font_class": "refreshempty",
      "unicode": ""
    },
    {
      "font_class": "reload",
      "unicode": ""
    },
    {
      "font_class": "right",
      "unicode": ""
    },
    {
      "font_class": "scan",
      "unicode": ""
    },
    {
      "font_class": "search",
      "unicode": ""
    },
    {
      "font_class": "settings",
      "unicode": ""
    },
    {
      "font_class": "settings-filled",
      "unicode": ""
    },
    {
      "font_class": "shop",
      "unicode": ""
    },
    {
      "font_class": "shop-filled",
      "unicode": ""
    },
    {
      "font_class": "smallcircle",
      "unicode": ""
    },
    {
      "font_class": "smallcircle-filled",
      "unicode": ""
    },
    {
      "font_class": "sound",
      "unicode": ""
    },
    {
      "font_class": "sound-filled",
      "unicode": ""
    },
    {
      "font_class": "spinner-cycle",
      "unicode": ""
    },
    {
      "font_class": "staff",
      "unicode": ""
    },
    {
      "font_class": "staff-filled",
      "unicode": ""
    },
    {
      "font_class": "star",
      "unicode": ""
    },
    {
      "font_class": "star-filled",
      "unicode": ""
    },
    {
      "font_class": "starhalf",
      "unicode": ""
    },
    {
      "font_class": "trash",
      "unicode": ""
    },
    {
      "font_class": "trash-filled",
      "unicode": ""
    },
    {
      "font_class": "tune",
      "unicode": ""
    },
    {
      "font_class": "tune-filled",
      "unicode": ""
    },
    {
      "font_class": "undo",
      "unicode": ""
    },
    {
      "font_class": "undo-filled",
      "unicode": ""
    },
    {
      "font_class": "up",
      "unicode": ""
    },
    {
      "font_class": "top",
      "unicode": ""
    },
    {
      "font_class": "upload",
      "unicode": ""
    },
    {
      "font_class": "upload-filled",
      "unicode": ""
    },
    {
      "font_class": "videocam",
      "unicode": ""
    },
    {
      "font_class": "videocam-filled",
      "unicode": ""
    },
    {
      "font_class": "vip",
      "unicode": ""
    },
    {
      "font_class": "vip-filled",
      "unicode": ""
    },
    {
      "font_class": "wallet",
      "unicode": ""
    },
    {
      "font_class": "wallet-filled",
      "unicode": ""
    },
    {
      "font_class": "weibo",
      "unicode": ""
    },
    {
      "font_class": "weixin",
      "unicode": ""
    }
  ];
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const getVal = (val) => {
    const reg = /^[0-9]*$/g;
    return typeof val === "number" || reg.test(val) ? val + "px" : val;
  };
  const _sfc_main$c = {
    name: "UniIcons",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      color: {
        type: String,
        default: "#333333"
      },
      size: {
        type: [Number, String],
        default: 16
      },
      customPrefix: {
        type: String,
        default: ""
      },
      fontFamily: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        icons: fontData
      };
    },
    computed: {
      unicode() {
        let code = this.icons.find((v) => v.font_class === this.type);
        if (code) {
          return code.unicode;
        }
        return "";
      },
      iconSize() {
        return getVal(this.size);
      },
      styleObj() {
        if (this.fontFamily !== "") {
          return `color: ${this.color}; font-size: ${this.iconSize}; font-family: ${this.fontFamily};`;
        }
        return `color: ${this.color}; font-size: ${this.iconSize};`;
      }
    },
    methods: {
      _onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "text",
      {
        style: vue.normalizeStyle($options.styleObj),
        class: vue.normalizeClass(["uni-icons", ["uniui-" + $props.type, $props.customPrefix, $props.customPrefix ? $props.type : ""]]),
        onClick: _cache[0] || (_cache[0] = (...args) => $options._onClick && $options._onClick(...args))
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-946bce22"], ["__file", "D:/桌面/大三下/云计算/大作业/高血压风险评估系统/node_modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue"]]);
  const _sfc_main$b = {
    data() {
      return {
        // 用于存储登录表单数据
        loginForm: {
          username: "",
          password: ""
        },
        username: ""
        // 定义一个响应式数据
      };
    },
    methods: {
      // 登录表单提交
      onSubmit(event) {
        this.loginForm.username = event.detail.value.username;
        this.loginForm.password = event.detail.value.password;
        uni.request({
          url: "http://localhost:5000/login",
          // 后端登录接口地址
          method: "POST",
          data: this.loginForm,
          success: (res) => {
            if (res.statusCode === 200) {
              uni.showToast({
                title: "登录成功",
                icon: "success"
              });
              uni.setStorageSync("username", this.loginForm.username);
              formatAppLog("log", "at pages/login/login.vue:86", "存储的用户名:", this.loginForm.username);
              formatAppLog("log", "at pages/login/login.vue:88", "从本地存储读取的用户名:", this.loginForm.username);
              uni.navigateTo({
                url: "/pages/index/index"
              });
            } else {
              uni.showToast({
                title: "用户名或密码错误",
                icon: "none"
              });
            }
          },
          fail: () => {
            uni.showToast({
              title: "登录失败",
              icon: "none"
            });
          }
        });
      },
      // 跳转到注册页面
      goToRegister() {
        formatAppLog("log", "at pages/login/login.vue:112", "goToRegister clicked");
        uni.navigateTo({
          url: "/pages/register/register",
          // 确保路径正确
          success: () => {
            formatAppLog("log", "at pages/login/login.vue:116", "跳转成功");
          },
          fail: (err) => {
            formatAppLog("error", "at pages/login/login.vue:119", "跳转失败", err);
            uni.showToast({
              title: "跳转失败",
              icon: "none"
            });
          }
        });
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "login-wrapper" }, [
        vue.createElementVNode("view", { class: "login-header" }, [
          vue.createElementVNode("text", { class: "title" }, "欢迎回来"),
          vue.createElementVNode("text", { class: "subtitle" }, "请登录您的账户")
        ]),
        vue.createElementVNode("view", { class: "login-form" }, [
          vue.createElementVNode(
            "form",
            {
              onSubmit: _cache[1] || (_cache[1] = (...args) => $options.onSubmit && $options.onSubmit(...args))
            },
            [
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("input", {
                  class: "input",
                  name: "username",
                  type: "text",
                  placeholder: "用户名",
                  "placeholder-class": "placeholder-style"
                }),
                vue.createVNode(_component_uni_icons, {
                  class: "input-icon",
                  type: "person",
                  size: "20",
                  color: "#999"
                })
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("input", {
                  class: "input",
                  name: "password",
                  type: "password",
                  placeholder: "密码",
                  "placeholder-class": "placeholder-style"
                }),
                vue.createVNode(_component_uni_icons, {
                  class: "input-icon",
                  type: "locked",
                  size: "20",
                  color: "#999"
                })
              ]),
              vue.createElementVNode("button", {
                "form-type": "submit",
                class: "submit-btn",
                "hover-class": "submit-btn-hover"
              }, " 立即登录 "),
              vue.createElementVNode("view", { class: "action-links" }, [
                vue.createElementVNode("text", { class: "register-text" }, "新用户？"),
                vue.createElementVNode("text", {
                  class: "register-link",
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.goToRegister && $options.goToRegister(...args))
                }, "快速注册"),
                vue.createElementVNode("text", { class: "divider" }, "|"),
                vue.createElementVNode("text", { class: "forgot-link" }, "忘记密码？")
              ])
            ],
            32
            /* NEED_HYDRATION */
          )
        ])
      ])
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__file", "D:/桌面/大三下/云计算/大作业/高血压风险评估系统/pages/login/login.vue"]]);
  const _sfc_main$a = {
    data() {
      return {
        // 用于存储注册表单数据
        registerForm: {
          username: "",
          password: "",
          confirmPassword: ""
        }
      };
    },
    methods: {
      // 注册表单提交
      onSubmit(event) {
        this.registerForm.username = event.detail.value.username;
        this.registerForm.password = event.detail.value.password;
        this.registerForm.confirmPassword = event.detail.value.confirmPassword;
        if (this.registerForm.password !== this.registerForm.confirmPassword) {
          uni.showToast({
            title: "两次输入的密码不一致",
            icon: "none"
          });
          return;
        }
        uni.request({
          url: "http://localhost:5000/register",
          // 后端注册接口地址
          method: "POST",
          data: {
            username: this.registerForm.username,
            password: this.registerForm.password
          },
          success: (res) => {
            if (res.statusCode === 201) {
              uni.showToast({
                title: "注册成功",
                icon: "success"
              });
              this.goToLogin();
            } else {
              uni.showToast({
                title: res.data.message || "注册失败",
                icon: "none"
              });
            }
          },
          fail: () => {
            uni.showToast({
              title: "注册失败",
              icon: "none"
            });
          }
        });
      },
      // 跳转到登录页面
      goToLogin() {
        uni.navigateTo({
          url: "/pages/login/login",
          // 确保路径正确
          success: () => {
            formatAppLog("log", "at pages/register/register.vue:129", "跳转成功");
          },
          fail: (err) => {
            formatAppLog("error", "at pages/register/register.vue:132", "跳转失败", err);
            uni.showToast({
              title: "跳转失败",
              icon: "none"
            });
          }
        });
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "register-wrapper" }, [
        vue.createElementVNode("view", { class: "register-header" }, [
          vue.createElementVNode("text", { class: "title" }, "创建账户"),
          vue.createElementVNode("text", { class: "subtitle" }, "开启您的健康管理之旅")
        ]),
        vue.createElementVNode("view", { class: "register-form" }, [
          vue.createElementVNode(
            "form",
            {
              onSubmit: _cache[1] || (_cache[1] = (...args) => $options.onSubmit && $options.onSubmit(...args))
            },
            [
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("input", {
                  class: "input",
                  name: "username",
                  type: "text",
                  placeholder: "用户名",
                  "placeholder-class": "placeholder-style"
                }),
                vue.createVNode(_component_uni_icons, {
                  class: "input-icon",
                  type: "person",
                  size: "20",
                  color: "#999"
                })
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("input", {
                  class: "input",
                  name: "password",
                  type: "password",
                  placeholder: "密码",
                  "placeholder-class": "placeholder-style"
                }),
                vue.createVNode(_component_uni_icons, {
                  class: "input-icon",
                  type: "locked",
                  size: "20",
                  color: "#999"
                })
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("input", {
                  class: "input",
                  name: "confirmPassword",
                  type: "password",
                  placeholder: "确认密码",
                  "placeholder-class": "placeholder-style"
                }),
                vue.createVNode(_component_uni_icons, {
                  class: "input-icon",
                  type: "refresh",
                  size: "20",
                  color: "#999"
                })
              ]),
              vue.createElementVNode("button", {
                "form-type": "submit",
                class: "submit-btn",
                "hover-class": "submit-btn-hover"
              }, " 立即注册 "),
              vue.createElementVNode("view", { class: "action-links" }, [
                vue.createElementVNode("text", { class: "login-text" }, "已有账户？"),
                vue.createElementVNode("text", {
                  class: "login-link",
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.goToLogin && $options.goToLogin(...args))
                }, "立即登录")
              ])
            ],
            32
            /* NEED_HYDRATION */
          )
        ])
      ])
    ]);
  }
  const PagesRegisterRegister = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__file", "D:/桌面/大三下/云计算/大作业/高血压风险评估系统/pages/register/register.vue"]]);
  const _imports_0$1 = "/static/avatar.png";
  const _imports_1 = "/static/predict.png";
  const _imports_2 = "/static/history.png";
  const _imports_3 = "/static/advice.png";
  const _imports_4 = "/static/analysis.png";
  const _sfc_main$9 = {
    data() {
      return {
        username: "用户"
      };
    },
    onLoad() {
      this.username = uni.getStorageSync("username") || "用户";
    },
    methods: {
      goToPredict() {
        uni.navigateTo({ url: "/pages/predict/predict" });
      },
      goToHistory() {
        uni.navigateTo({ url: "/pages/history/history" });
      },
      goToAdvice() {
        uni.navigateTo({ url: "/pages/advice/advice" });
      },
      goToAnalysis() {
        uni.navigateTo({ url: "/pages/analysis/analysis" });
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 动态背景 "),
      vue.createElementVNode("view", { class: "background-effect" }),
      vue.createCommentVNode(" 顶部导航 "),
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("image", {
          class: "avatar",
          src: _imports_0$1,
          mode: "aspectFill"
        }),
        vue.createElementVNode(
          "text",
          { class: "greeting" },
          "下午好，" + vue.toDisplayString($data.username),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "health-status" }, [
          vue.createElementVNode("text", { class: "status-icon" }, "❤️"),
          vue.createElementVNode("text", { class: "status-text" }, "健康状态良好")
        ])
      ]),
      vue.createCommentVNode(" 数据概览卡片 "),
      vue.createElementVNode("view", { class: "dashboard" }, [
        vue.createElementVNode("view", { class: "card health-score" }, [
          vue.createElementVNode("text", { class: "card-title" }, "健康指数"),
          vue.createElementVNode("text", { class: "score" }, "92"),
          vue.createElementVNode("view", { class: "progress-bar" }, [
            vue.createElementVNode("view", {
              class: "progress",
              style: { width: "92%" }
            })
          ])
        ]),
        vue.createElementVNode("view", {
          class: "card recent-data",
          style: { "width": "300rpx" }
        }, [
          vue.createElementVNode("text", { class: "card-title" }, "最新数据"),
          vue.createElementVNode("view", { class: "data-grid" }, [
            vue.createElementVNode("view", { class: "data-item" }, [
              vue.createElementVNode("text", { class: "value" }, "120/80"),
              vue.createElementVNode("text", { class: "label" }, "血压")
            ]),
            vue.createElementVNode("view", { class: "data-item" }, [
              vue.createElementVNode("text", { class: "value" }, "5.2"),
              vue.createElementVNode("text", { class: "label" }, "血糖")
            ]),
            vue.createElementVNode("view", { class: "data-item" }, [
              vue.createElementVNode("text", { class: "value" }, "75"),
              vue.createElementVNode("text", { class: "label" }, "心率")
            ])
          ])
        ])
      ]),
      vue.createCommentVNode(" 功能入口 "),
      vue.createElementVNode("view", { class: "quick-actions" }, [
        vue.createElementVNode("view", {
          class: "action-card",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goToPredict && $options.goToPredict(...args))
        }, [
          vue.createElementVNode("image", {
            class: "action-icon",
            src: _imports_1
          }),
          vue.createElementVNode("text", { class: "action-text" }, "健康检测"),
          vue.createElementVNode("text", { class: "action-desc" }, "立即进行健康评估")
        ]),
        vue.createElementVNode("view", {
          class: "action-card",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.goToHistory && $options.goToHistory(...args))
        }, [
          vue.createElementVNode("image", {
            class: "action-icon",
            src: _imports_2
          }),
          vue.createElementVNode("text", { class: "action-text" }, "数据追踪"),
          vue.createElementVNode("text", { class: "action-desc" }, "查看历史趋势")
        ]),
        vue.createElementVNode("view", {
          class: "action-card",
          onClick: _cache[2] || (_cache[2] = (...args) => $options.goToAdvice && $options.goToAdvice(...args))
        }, [
          vue.createElementVNode("image", {
            class: "action-icon",
            src: _imports_3
          }),
          vue.createElementVNode("text", { class: "action-text" }, "健康建议"),
          vue.createElementVNode("text", { class: "action-desc" }, "获取专业指导")
        ]),
        vue.createCommentVNode(" 在首页添加导航入口 "),
        vue.createElementVNode("view", {
          class: "action-card",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.goToAnalysis && $options.goToAnalysis(...args))
        }, [
          vue.createElementVNode("image", {
            class: "action-icon",
            src: _imports_4
          }),
          vue.createElementVNode("text", { class: "action-text" }, "数据分析"),
          vue.createElementVNode("text", { class: "action-desc" }, "高血压现状")
        ])
      ])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__file", "D:/桌面/大三下/云计算/大作业/高血压风险评估系统/pages/index/index.vue"]]);
  const _sfc_main$8 = {
    data() {
      return {
        primaryColor: "#1aad19",
        errorColor: "#FF9800",
        // 改为橙色
        borderColor: "#e0e0e0",
        submitting: false,
        errors: {},
        formData: {
          username: "",
          age: null,
          male: null,
          currentSmoker: null,
          cigsPerDay: null,
          BPMeds: null,
          diabetes: null,
          totChol: null,
          sysBP: null,
          diaBP: null,
          BMI: null,
          heartRate: null,
          glucose: null
        },
        options: {
          // 确保所有选项正确定义
          genders: [
            { label: "男性", value: "1" },
            { label: "女性", value: "0" }
          ],
          smokers: [
            { label: "是", value: "1" },
            { label: "否", value: "0" }
          ],
          medsOptions: [
            { label: "是", value: "1" },
            { label: "否", value: "0" }
          ],
          diabetesOptions: [
            // 添加缺失的选项配置
            { label: "是", value: "1" },
            { label: "否", value: "0" }
          ]
        }
      };
    },
    computed: {
      hasErrors() {
        return Object.values(this.formData).some(
          (v) => v === null || v === "" || typeof v === "number" && isNaN(v)
        );
      }
    },
    mounted() {
      this.formData.username = uni.getStorageSync("username") || "default_user";
    },
    methods: {
      handleRadioChange(field, e) {
        this.formData[field] = e.detail.value;
        this.errors[field] = "";
        if (field === "currentSmoker" && e.detail.value === "0") {
          this.formData.cigsPerDay = 0;
        }
      },
      validateField(field, e) {
        const value = e.detail.value;
        this.formData[field] = value ? Number(value) : null;
        this.errors[field] = "";
        if (value === "" || value === null) {
          this.errors[field] = "此项为必填项";
          return;
        }
        const validationRules = {
          age: { min: 18, max: 100, label: "年龄", unit: "岁" },
          cigsPerDay: { min: 0, max: 100, label: "吸烟量", unit: "支/天" },
          totChol: { min: 100, max: 240, label: "总胆固醇", unit: "mg/dL" },
          sysBP: { min: 90, max: 120, label: "收缩压", unit: "mmHg" },
          diaBP: { min: 60, max: 80, label: "舒张压", unit: "mmHg" },
          BMI: { min: 18.5, max: 24.9, label: "BMI", unit: "" },
          heartRate: { min: 60, max: 100, label: "心率", unit: "次/分钟" },
          glucose: { min: 70, max: 100, label: "血糖", unit: "mg/dL" }
        };
        const rule = validationRules[field];
        if (!rule)
          return;
        const numValue = Number(value);
        if (numValue < rule.min) {
          this.errors[field] = `${rule.label}低于建议值（${rule.min}${rule.unit}），建议咨询医生`;
        } else if (numValue > rule.max) {
          this.errors[field] = `${rule.label}高于建议值（${rule.max}${rule.unit}），建议复查确认`;
        }
      },
      async submitForm() {
        if (this.hasErrors) {
          uni.showToast({ title: "请填写所有必填项", icon: "none" });
          return;
        }
        this.submitting = true;
        try {
          const res = await uni.request({
            url: "http://localhost:5000/predict",
            method: "POST",
            data: {
              ...this.formData,
              male: Number(this.formData.male),
              currentSmoker: Number(this.formData.currentSmoker),
              BPMeds: Number(this.formData.BPMeds),
              diabetes: Number(this.formData.diabetes)
            }
          });
          if (res.statusCode === 200) {
            uni.navigateTo({
              url: `/pages/result/result?risk=${res.data.risk}&healthData=${encodeURIComponent(JSON.stringify(this.formData))}`
            });
          } else {
            uni.showToast({ title: res.data.message || "预测失败", icon: "none" });
          }
        } catch (error) {
          uni.showToast({ title: "请求失败，请检查网络", icon: "none" });
        } finally {
          this.submitting = false;
        }
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 头部 "),
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("text", { class: "title" }, "高血压风险预测"),
        vue.createElementVNode("text", { class: "subtitle" }, "请填写您的健康信息")
      ]),
      vue.createCommentVNode(" 表单主体 "),
      vue.createElementVNode("view", { class: "form-card" }, [
        vue.createElementVNode("scroll-view", {
          "scroll-y": "",
          class: "form-scroll"
        }, [
          vue.createElementVNode(
            "form",
            {
              onSubmit: _cache[20] || (_cache[20] = (...args) => $options.submitForm && $options.submitForm(...args))
            },
            [
              vue.createCommentVNode(" 年龄 "),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("view", { class: "label-group" }, [
                  vue.createElementVNode("text", { class: "label" }, "年龄"),
                  vue.createElementVNode("view", { class: "range-hint" }, [
                    vue.createElementVNode("text", { class: "range-text" }, "建议范围: 18-100岁")
                  ])
                ]),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input-box",
                    type: "number",
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.formData.age = $event),
                    placeholder: "请输入年龄",
                    onInput: _cache[1] || (_cache[1] = ($event) => $options.validateField("age", $event)),
                    style: vue.normalizeStyle({ borderColor: $data.errors.age ? $data.errorColor : $data.borderColor })
                  },
                  null,
                  36
                  /* STYLE, NEED_HYDRATION */
                ), [
                  [vue.vModelText, $data.formData.age]
                ]),
                $data.errors.age ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "error-msg"
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "error-text" },
                    vue.toDisplayString($data.errors.age),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createCommentVNode(" 性别 "),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("view", { class: "label-group" }, [
                  vue.createElementVNode("text", { class: "label" }, "性别")
                ]),
                vue.createElementVNode(
                  "radio-group",
                  {
                    class: "radio-group",
                    name: "male",
                    onChange: _cache[2] || (_cache[2] = ($event) => $options.handleRadioChange("male", $event))
                  },
                  [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($data.options.genders, (option, index) => {
                        return vue.openBlock(), vue.createElementBlock("label", {
                          class: "radio-item",
                          key: index
                        }, [
                          vue.createElementVNode("radio", {
                            value: option.value,
                            checked: $data.formData.male === option.value,
                            color: $data.primaryColor
                          }, null, 8, ["value", "checked", "color"]),
                          vue.createElementVNode(
                            "text",
                            { class: "radio-text" },
                            vue.toDisplayString(option.label),
                            1
                            /* TEXT */
                          )
                        ]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ],
                  32
                  /* NEED_HYDRATION */
                )
              ]),
              vue.createCommentVNode(" 是否吸烟 "),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("view", { class: "label-group" }, [
                  vue.createElementVNode("text", { class: "label" }, "是否吸烟")
                ]),
                vue.createElementVNode(
                  "radio-group",
                  {
                    class: "radio-group",
                    name: "currentSmoker",
                    onChange: _cache[3] || (_cache[3] = ($event) => $options.handleRadioChange("currentSmoker", $event))
                  },
                  [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($data.options.smokers, (option, index) => {
                        return vue.openBlock(), vue.createElementBlock("label", {
                          class: "radio-item",
                          key: index
                        }, [
                          vue.createElementVNode("radio", {
                            value: option.value,
                            checked: $data.formData.currentSmoker === option.value,
                            color: $data.primaryColor
                          }, null, 8, ["value", "checked", "color"]),
                          vue.createElementVNode(
                            "text",
                            { class: "radio-text" },
                            vue.toDisplayString(option.label),
                            1
                            /* TEXT */
                          )
                        ]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ],
                  32
                  /* NEED_HYDRATION */
                )
              ]),
              vue.createCommentVNode(" 每日吸烟量（条件显示） "),
              $data.formData.currentSmoker === "1" ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "form-group"
              }, [
                vue.createElementVNode("view", { class: "label-group" }, [
                  vue.createElementVNode("text", { class: "label" }, "每日吸烟量"),
                  vue.createElementVNode("view", { class: "range-hint" }, [
                    vue.createElementVNode("text", { class: "range-text" }, "建议范围: 0-100支/天")
                  ])
                ]),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input-box",
                    type: "number",
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.formData.cigsPerDay = $event),
                    placeholder: "请输入每日吸烟量",
                    onInput: _cache[5] || (_cache[5] = ($event) => $options.validateField("cigsPerDay", $event)),
                    style: vue.normalizeStyle({ borderColor: $data.errors.cigsPerDay ? $data.errorColor : $data.borderColor })
                  },
                  null,
                  36
                  /* STYLE, NEED_HYDRATION */
                ), [
                  [vue.vModelText, $data.formData.cigsPerDay]
                ]),
                $data.errors.cigsPerDay ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "error-msg"
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "error-text" },
                    vue.toDisplayString($data.errors.cigsPerDay),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true)
              ])) : vue.createCommentVNode("v-if", true),
              vue.createCommentVNode(" 是否服用降压药 "),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("view", { class: "label-group" }, [
                  vue.createElementVNode("text", { class: "label" }, "服用降压药")
                ]),
                vue.createElementVNode(
                  "radio-group",
                  {
                    class: "radio-group",
                    name: "BPMeds",
                    onChange: _cache[6] || (_cache[6] = ($event) => $options.handleRadioChange("BPMeds", $event))
                  },
                  [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($data.options.medsOptions, (option, index) => {
                        return vue.openBlock(), vue.createElementBlock("label", {
                          class: "radio-item",
                          key: index
                        }, [
                          vue.createElementVNode("radio", {
                            value: option.value,
                            checked: $data.formData.BPMeds === option.value,
                            color: $data.primaryColor
                          }, null, 8, ["value", "checked", "color"]),
                          vue.createElementVNode(
                            "text",
                            { class: "radio-text" },
                            vue.toDisplayString(option.label),
                            1
                            /* TEXT */
                          )
                        ]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ],
                  32
                  /* NEED_HYDRATION */
                )
              ]),
              vue.createCommentVNode(" 是否患有糖尿病 "),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("view", { class: "label-group" }, [
                  vue.createElementVNode("text", { class: "label" }, "糖尿病")
                ]),
                vue.createElementVNode(
                  "radio-group",
                  {
                    class: "radio-group",
                    name: "diabetes",
                    onChange: _cache[7] || (_cache[7] = ($event) => $options.handleRadioChange("diabetes", $event))
                  },
                  [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($data.options.diabetesOptions, (option, index) => {
                        return vue.openBlock(), vue.createElementBlock("label", {
                          class: "radio-item",
                          key: index
                        }, [
                          vue.createElementVNode("radio", {
                            value: option.value,
                            checked: $data.formData.diabetes === option.value,
                            color: $data.primaryColor
                          }, null, 8, ["value", "checked", "color"]),
                          vue.createElementVNode(
                            "text",
                            { class: "radio-text" },
                            vue.toDisplayString(option.label),
                            1
                            /* TEXT */
                          )
                        ]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ],
                  32
                  /* NEED_HYDRATION */
                )
              ]),
              vue.createCommentVNode(" 总胆固醇 "),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("view", { class: "label-group" }, [
                  vue.createElementVNode("text", { class: "label" }, "胆固醇"),
                  vue.createElementVNode("view", { class: "range-hint" }, [
                    vue.createElementVNode("text", { class: "range-text" }, "建议范围:100-240 mg/dL")
                  ])
                ]),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input-box",
                    type: "number",
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.formData.totChol = $event),
                    placeholder: "请输入总胆固醇值",
                    onInput: _cache[9] || (_cache[9] = ($event) => $options.validateField("totChol", $event)),
                    style: vue.normalizeStyle({ borderColor: $data.errors.totChol ? $data.errorColor : $data.borderColor })
                  },
                  null,
                  36
                  /* STYLE, NEED_HYDRATION */
                ), [
                  [vue.vModelText, $data.formData.totChol]
                ]),
                $data.errors.totChol ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "error-msg"
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "error-text" },
                    vue.toDisplayString($data.errors.totChol),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createCommentVNode(" 收缩压 "),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("view", { class: "label-group" }, [
                  vue.createElementVNode("text", { class: "label" }, "收缩压"),
                  vue.createElementVNode("view", { class: "range-hint" }, [
                    vue.createElementVNode("text", { class: "range-text" }, "建议范围:90-120mmHg")
                  ])
                ]),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input-box",
                    type: "number",
                    "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.formData.sysBP = $event),
                    placeholder: "请输入收缩压值",
                    onInput: _cache[11] || (_cache[11] = ($event) => $options.validateField("sysBP", $event)),
                    style: vue.normalizeStyle({ borderColor: $data.errors.sysBP ? $data.errorColor : $data.borderColor })
                  },
                  null,
                  36
                  /* STYLE, NEED_HYDRATION */
                ), [
                  [vue.vModelText, $data.formData.sysBP]
                ]),
                $data.errors.sysBP ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "error-msg"
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "error-text" },
                    vue.toDisplayString($data.errors.sysBP),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createCommentVNode(" 舒张压 "),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("view", { class: "label-group" }, [
                  vue.createElementVNode("text", { class: "label" }, "舒张压"),
                  vue.createElementVNode("view", { class: "range-hint" }, [
                    vue.createElementVNode("text", { class: "range-text" }, "建议范围: 60-80 mmHg")
                  ])
                ]),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input-box",
                    type: "number",
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.formData.diaBP = $event),
                    placeholder: "请输入舒张压值",
                    onInput: _cache[13] || (_cache[13] = ($event) => $options.validateField("diaBP", $event)),
                    style: vue.normalizeStyle({ borderColor: $data.errors.diaBP ? $data.errorColor : $data.borderColor })
                  },
                  null,
                  36
                  /* STYLE, NEED_HYDRATION */
                ), [
                  [vue.vModelText, $data.formData.diaBP]
                ]),
                $data.errors.diaBP ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "error-msg"
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "error-text" },
                    vue.toDisplayString($data.errors.diaBP),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createCommentVNode(" BMI "),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("view", { class: "label-group" }, [
                  vue.createElementVNode("text", { class: "label" }, "BMI"),
                  vue.createElementVNode("view", { class: "range-hint" }, [
                    vue.createElementVNode("text", { class: "range-text" }, "建议范围: 18.5-24.9")
                  ])
                ]),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input-box",
                    type: "number",
                    "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => $data.formData.BMI = $event),
                    placeholder: "请输入BMI值",
                    onInput: _cache[15] || (_cache[15] = ($event) => $options.validateField("BMI", $event)),
                    style: vue.normalizeStyle({ borderColor: $data.errors.BMI ? $data.errorColor : $data.borderColor })
                  },
                  null,
                  36
                  /* STYLE, NEED_HYDRATION */
                ), [
                  [vue.vModelText, $data.formData.BMI]
                ]),
                $data.errors.BMI ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "error-msg"
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "error-text" },
                    vue.toDisplayString($data.errors.BMI),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createCommentVNode(" 心率 "),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("view", { class: "label-group" }, [
                  vue.createElementVNode("text", { class: "label" }, "心率"),
                  vue.createElementVNode("view", { class: "range-hint" }, [
                    vue.createElementVNode("text", { class: "range-text" }, "建议范围: 60-100 次/分钟")
                  ])
                ]),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input-box",
                    type: "number",
                    "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => $data.formData.heartRate = $event),
                    placeholder: "请输入心率值",
                    onInput: _cache[17] || (_cache[17] = ($event) => $options.validateField("heartRate", $event)),
                    style: vue.normalizeStyle({ borderColor: $data.errors.heartRate ? $data.errorColor : $data.borderColor })
                  },
                  null,
                  36
                  /* STYLE, NEED_HYDRATION */
                ), [
                  [vue.vModelText, $data.formData.heartRate]
                ]),
                $data.errors.heartRate ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "error-msg"
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "error-text" },
                    vue.toDisplayString($data.errors.heartRate),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createCommentVNode(" 血糖 "),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("view", { class: "label-group" }, [
                  vue.createElementVNode("text", { class: "label" }, "血糖"),
                  vue.createElementVNode("view", { class: "range-hint" }, [
                    vue.createElementVNode("text", { class: "range-text" }, "建议范围: 70-100 mg/dL")
                  ])
                ]),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input-box",
                    type: "number",
                    "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => $data.formData.glucose = $event),
                    placeholder: "请输入血糖值",
                    onInput: _cache[19] || (_cache[19] = ($event) => $options.validateField("glucose", $event)),
                    style: vue.normalizeStyle({ borderColor: $data.errors.glucose ? $data.errorColor : $data.borderColor })
                  },
                  null,
                  36
                  /* STYLE, NEED_HYDRATION */
                ), [
                  [vue.vModelText, $data.formData.glucose]
                ]),
                $data.errors.glucose ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "error-msg"
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "error-text" },
                    vue.toDisplayString($data.errors.glucose),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createCommentVNode(" 提交按钮 "),
              vue.createElementVNode("button", {
                class: "submit-btn",
                "form-type": "submit",
                "hover-class": "btn-hover",
                loading: $data.submitting,
                disabled: $options.hasErrors || $data.submitting
              }, [
                !$data.submitting ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "立即评估风险")) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "分析中..."))
              ], 8, ["loading", "disabled"])
            ],
            32
            /* NEED_HYDRATION */
          )
        ])
      ])
    ]);
  }
  const PagesPredictPredict = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__file", "D:/桌面/大三下/云计算/大作业/高血压风险评估系统/pages/predict/predict.vue"]]);
  const DEFAULT_ADVICE = {
    high: [
      "建议每周至少进行150分钟中等强度有氧运动",
      "每日钠摄入量控制在2000mg以下",
      "定期监测晨起静息血压",
      "建议每月进行1次血脂检测",
      "保持BMI指数在18.5-24之间"
    ],
    low: [
      "保持每周3次以上有氧运动",
      "每日蔬菜摄入量不少于500克",
      "每半年进行一次全面体检",
      "控制饱和脂肪酸摄入量",
      "保持规律作息时间"
    ]
  };
  const _sfc_main$7 = {
    data() {
      return {
        riskLevel: "High",
        healthData: {},
        chartWidth: 0,
        chartHeight: 0,
        chartData: {
          labels: ["总胆固醇", "收缩压", "舒张压", "BMI", "心率", "血糖"],
          values: [],
          normalRanges: [
            { min: 100, max: 240, unit: "mg/dL" },
            { min: 90, max: 120, unit: "mmHg" },
            { min: 60, max: 80, unit: "mmHg" },
            { min: 18.5, max: 24.9, unit: "kg/m²" },
            { min: 60, max: 100, unit: "bpm" },
            { min: 70, max: 110, unit: "mg/dL" }
          ]
        }
      };
    },
    computed: {
      resultClass() {
        return this.riskLevel === "High" ? "high-risk" : "low-risk";
      },
      adviceList() {
        return DEFAULT_ADVICE[this.riskLevel.toLowerCase()];
      }
    },
    onLoad(options) {
      this.riskLevel = decodeURIComponent(options.risk || "High");
      try {
        this.healthData = JSON.parse(decodeURIComponent(options.healthData || "{}"));
      } catch {
        this.healthData = {};
      }
      this.initChartData();
    },
    onReady() {
      const sys = uni.getSystemInfoSync();
      this.chartWidth = sys.windowWidth * 0.85;
      this.chartHeight = this.chartData.labels.length * 100 - 100;
      formatAppLog("log", "at pages/result/result.vue:140", "画布尺寸:", this.chartWidth, this.chartHeight);
      setTimeout(() => {
        this.drawChart();
      }, 100);
    },
    methods: {
      initChartData() {
        const d = this.healthData;
        this.chartData.values = [
          d.totChol || 0,
          d.sysBP || 0,
          d.diaBP || 0,
          d.BMI || 0,
          d.heartRate || 0,
          d.glucose || 0
        ];
      },
      drawChart() {
        const ctx = uni.createCanvasContext("chartCanvas", this);
        const w = this.chartWidth;
        const h = this.chartHeight;
        const itemH = 80;
        const startY = 30;
        ctx.clearRect(0, 0, w, h);
        this.chartData.labels.forEach((label, i) => {
          const y = startY + i * itemH;
          const val = this.chartData.values[i];
          const { min, max, unit } = this.chartData.normalRanges[i];
          const range = max - min;
          let valPos = (val - min) / range * (w - 40);
          if (valPos < 0)
            valPos = 0;
          if (valPos > w - 40)
            valPos = w - 40;
          ctx.setStrokeStyle("#eeeeee");
          ctx.beginPath();
          ctx.moveTo(20, y + 25);
          ctx.lineTo(w - 20, y + 25);
          ctx.stroke();
          ctx.setFillStyle("#e8f5e9");
          ctx.fillRect(20, y + 15, w - 40, 20);
          ctx.setFillStyle(val < min || val > max ? "#ff4444" : "#1aad19");
          ctx.beginPath();
          ctx.arc(20 + valPos, y + 25, 8, 0, 2 * Math.PI);
          ctx.fill();
          ctx.setFontSize(14);
          ctx.setFillStyle("#333");
          ctx.setTextAlign("left");
          ctx.fillText(label, 20, y);
          ctx.setTextAlign("right");
          ctx.setFontSize(16);
          ctx.fillText(`${val} ${unit}`, w - 20, y);
          ctx.setTextAlign("left");
          ctx.setFontSize(12);
          ctx.setFillStyle("#999");
          ctx.fillText(`${min}${unit}`, 20, y + 50);
          ctx.setTextAlign("right");
          ctx.fillText(`${max}${unit}`, w - 20, y + 50);
        });
        ctx.draw();
      },
      backToHome() {
        uni.switchTab({ url: "/pages/index/index" });
      },
      goToHistory() {
        uni.navigateTo({
          url: `/pages/history/history?username=${this.healthData.username || ""}`
        });
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "result-container" }, [
      vue.createCommentVNode(" 头部区域 "),
      vue.createElementVNode("view", { class: "result-header" }, [
        vue.createElementVNode("text", { class: "result-title" }, "风险评估报告"),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["risk-indicator", $options.resultClass])
          },
          [
            vue.createVNode(_component_uni_icons, {
              type: $data.riskLevel === "High" ? "warning" : "smile",
              size: "40",
              color: $data.riskLevel === "High" ? "#ff4444" : "#1aad19"
            }, null, 8, ["type", "color"]),
            vue.createElementVNode(
              "text",
              { class: "risk-label" },
              vue.toDisplayString($data.riskLevel === "High" ? "高风险" : "低风险"),
              1
              /* TEXT */
            )
          ],
          2
          /* CLASS */
        )
      ]),
      vue.createCommentVNode(" 数据可视化 "),
      vue.createElementVNode("view", { class: "chart-card" }, [
        vue.createElementVNode("view", { class: "chart-header" }, [
          vue.createElementVNode("text", { class: "chart-title" }, "健康指标对比"),
          vue.createElementVNode("view", { class: "chart-legend" }, [
            vue.createElementVNode("view", { class: "legend-item" }, [
              vue.createElementVNode("view", { class: "legend-normal" }),
              vue.createElementVNode("text", null, "正常范围")
            ]),
            vue.createElementVNode("view", { class: "legend-item" }, [
              vue.createElementVNode("view", { class: "legend-abnormal" }),
              vue.createElementVNode("text", null, "异常指标")
            ])
          ])
        ]),
        vue.createElementVNode("canvas", {
          "canvas-id": "chartCanvas",
          type: "2d",
          width: $data.chartWidth,
          height: $data.chartHeight,
          style: vue.normalizeStyle({ width: $data.chartWidth + "px", height: $data.chartHeight + "px" }),
          class: "chart-canvas"
        }, null, 12, ["width", "height"])
      ]),
      vue.createCommentVNode(" 健康建议 "),
      vue.createElementVNode("view", { class: "advice-card" }, [
        vue.createElementVNode("view", { class: "card-header" }, [
          vue.createVNode(_component_uni_icons, {
            type: "info",
            size: "18",
            color: "#2c3e50"
          }),
          vue.createElementVNode("text", { class: "card-title" }, "专业建议")
        ]),
        vue.createElementVNode("view", { class: "advice-content" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($options.adviceList, (item, index) => {
              return vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: index,
                  class: "advice-item"
                },
                vue.toDisplayString(index + 1) + ". " + vue.toDisplayString(item),
                1
                /* TEXT */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" 操作按钮 "),
      vue.createElementVNode("view", { class: "action-buttons" }, [
        vue.createElementVNode("button", {
          class: "action-btn history-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goToHistory && $options.goToHistory(...args)),
          "hover-class": "btn-hover"
        }, " 查看历史记录 "),
        vue.createElementVNode("button", {
          class: "action-btn back-btn",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.backToHome && $options.backToHome(...args)),
          "hover-class": "btn-hover"
        }, " 返回首页 ")
      ])
    ]);
  }
  const PagesResultResult = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__file", "D:/桌面/大三下/云计算/大作业/高血压风险评估系统/pages/result/result.vue"]]);
  const _sfc_main$6 = {
    data() {
      return {};
    },
    methods: {}
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view");
  }
  const PagesComponentsComponents = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__file", "D:/桌面/大三下/云计算/大作业/高血压风险评估系统/pages/components/components.vue"]]);
  const _imports_0 = "/static/loading.gif";
  const _sfc_main$5 = {
    data() {
      return {
        chartWidth: 300,
        chartHeight: 290,
        chartContentWidth: 800,
        scrollViewHeight: 600,
        username: "",
        loading: false,
        activePoints: [],
        safeAreaBottom: 0,
        // 新增安全边距
        chartData: {
          dates: [],
          datasets: [
            { label: "总胆固醇", unit: "mg/dL", values: [], color: "#4CAF50" },
            { label: "收缩压", unit: "mmHg", values: [], color: "#2196F3" },
            { label: "舒张压", unit: "mmHg", values: [], color: "#FFC107" },
            { label: "BMI", unit: "kg/m²", values: [], color: "#9C27B0" },
            { label: "心率", unit: "bpm", values: [], color: "#FF5722" },
            { label: "血糖", unit: "mmol/L", values: [], color: "#795548" }
          ]
        }
      };
    },
    onLoad() {
      this.initPage();
    },
    methods: {
      async initPage() {
        this.checkLogin();
        this.calcDimensions();
        await this.loadHealthData();
      },
      checkLogin() {
        this.username = uni.getStorageSync("username");
        if (!this.username) {
          uni.showToast({ title: "请先登录", icon: "none" });
          setTimeout(() => uni.reLaunch({ url: "/pages/login/login" }), 1500);
          return false;
        }
        return true;
      },
      calcDimensions() {
        var _a;
        const systemInfo = uni.getSystemInfoSync();
        this.safeAreaBottom = ((_a = systemInfo.safeArea) == null ? void 0 : _a.bottom) ? systemInfo.screenHeight - systemInfo.safeArea.bottom : 0;
        const btnAreaHeight = 120;
        this.scrollViewHeight = systemInfo.windowHeight - btnAreaHeight - this.safeAreaBottom;
        this.chartWidth = systemInfo.windowWidth * 0.95;
        this.chartContentWidth = Math.max(this.chartWidth * 1.5, 800);
      },
      async loadHealthData() {
        var _a;
        if (!this.checkLogin())
          return;
        this.loading = true;
        try {
          const { data } = await uni.request({
            url: "http://localhost:5000/get_history",
            method: "POST",
            data: { username: this.username },
            timeout: 1e4
          });
          if (data.error)
            throw new Error(data.error);
          if (!((_a = data.history) == null ? void 0 : _a.length))
            throw new Error("暂无历史数据");
          this.processData(data.history);
          this.$nextTick(() => {
            this.chartData.datasets.forEach((d, i) => this.drawChart(d, i));
            this.bindTouchEvents();
          });
        } catch (error) {
          uni.showToast({ title: error.message, icon: "none" });
        } finally {
          this.loading = false;
        }
      },
      processData(history) {
        this.chartData.dates = history.map(
          (item) => item.date.split("-").slice(1).join("/")
        );
        const keys = ["totChol", "sysBP", "diaBP", "BMI", "heartRate", "glucose"];
        this.chartData.datasets.forEach((d, i) => {
          d.values = history.map((item) => Number(item[keys[i]]) || 0);
        });
      },
      drawChart(dataset, index) {
        const ctx = uni.createCanvasContext(`chart${index}`, this);
        const { dates } = this.chartData;
        const { values, label, color, unit } = dataset;
        ctx.clearRect(0, 0, this.chartContentWidth, this.chartHeight);
        const margin = { top: 25, right: 15, bottom: 155, left: 40 };
        const plotWidth = this.chartContentWidth - margin.left - margin.right;
        const plotHeight = this.chartHeight - margin.top - margin.bottom;
        const maxVal = Math.max(...values) * 1.05 || 1;
        const minVal = Math.min(...values) * 0.95;
        const range = maxVal - minVal;
        ctx.setStrokeStyle("#666");
        ctx.setLineWidth(1);
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top);
        ctx.lineTo(margin.left, margin.top + plotHeight);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top + plotHeight);
        ctx.lineTo(margin.left + plotWidth, margin.top + plotHeight);
        ctx.stroke();
        ctx.setFontSize(10);
        ctx.setFillStyle("#666");
        ctx.setTextAlign("right");
        [0, 0.25, 0.5, 0.75, 1].forEach((ratio) => {
          const y = margin.top + plotHeight * (1 - ratio);
          const value = (minVal + range * ratio).toFixed(1);
          ctx.beginPath();
          ctx.moveTo(margin.left - 5, y);
          ctx.lineTo(margin.left, y);
          ctx.stroke();
          ctx.fillText(value, margin.left - 8, y + 3);
        });
        ctx.setTextAlign("center");
        dates.forEach((date, i) => {
          if (i % 2 !== 0)
            return;
          const x = margin.left + plotWidth / (dates.length - 1) * i;
          ctx.fillText(date, x, margin.top + plotHeight + 15);
        });
        ctx.beginPath();
        ctx.setStrokeStyle(color);
        ctx.setLineWidth(1.5);
        values.forEach((val, i) => {
          const x = margin.left + plotWidth / (values.length - 1) * i;
          const y = margin.top + plotHeight * (1 - (val - minVal) / range);
          if (i === 0)
            ctx.moveTo(x, y);
          else
            ctx.lineTo(x, y);
        });
        ctx.stroke();
        values.forEach((val, i) => {
          const x = margin.left + plotWidth / (values.length - 1) * i;
          const y = margin.top + plotHeight * (1 - (val - minVal) / range);
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.setFillStyle(color);
          ctx.fill();
          ctx.setFontSize(10);
          ctx.setTextAlign("center");
          ctx.fillText(val.toFixed(1), x, y - 8);
        });
        ctx.setFontSize(12);
        ctx.setTextAlign("left");
        ctx.fillText(`${label} (${unit})`, margin.left + 5, margin.top - 5);
        ctx.draw();
      },
      bindTouchEvents() {
        this.chartData.datasets.forEach((d, index) => {
          const query = uni.createSelectorQuery().in(this);
          query.select(`#chart${index}`).boundingClientRect();
          query.exec((res) => {
            const canvas = res[0];
            if (!canvas)
              return;
            uni.getSystemInfoSync().platform === "android" && -1;
            let touching = false;
            this.$el.addEventListener("touchstart", () => touching = true);
            this.$el.addEventListener("touchend", () => touching = false);
            this.$el.addEventListener("touchmove", (e) => {
              if (!touching)
                return;
              const touchX = e.touches[0].clientX - canvas.left;
              e.touches[0].clientY - canvas.top;
              const point = this.findNearestPoint(touchX, index);
              if (point) {
                this.$set(this.activePoints, index, {
                  x: point.x + 15,
                  y: point.y - 25,
                  value: point.value
                });
              }
            });
          });
        });
      },
      findNearestPoint(x, index) {
        const { chartData, chartContentWidth } = this;
        const dataset = chartData.datasets[index];
        const margin = { left: 40, right: 15 };
        const plotWidth = chartContentWidth - margin.left - margin.right;
        const step = plotWidth / (dataset.values.length - 1);
        const idx = Math.min(dataset.values.length - 1, Math.max(
          0,
          Math.round((x - margin.left) / step)
        ));
        const maxVal = Math.max(...dataset.values) * 1.05;
        const minVal = Math.min(...dataset.values) * 0.95;
        const value = dataset.values[idx];
        return {
          x: margin.left + idx * step,
          y: margin.top + (this.chartHeight - margin.top - 35) * (1 - (value - minVal) / (maxVal - minVal)),
          value: value.toFixed(1)
        };
      },
      backToHome() {
        uni.navigateTo({ url: "/pages/index/index" });
      },
      refreshData() {
        this.loadHealthData();
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 头部 "),
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode(
          "text",
          { class: "title" },
          vue.toDisplayString($data.username) + "的健康数据趋势",
          1
          /* TEXT */
        )
      ]),
      vue.createCommentVNode(" 主滚动容器 "),
      vue.createElementVNode(
        "scroll-view",
        {
          class: "main-scroll",
          "scroll-y": "",
          style: vue.normalizeStyle({ height: $data.scrollViewHeight + "px", paddingBottom: $data.safeAreaBottom + "px" })
        },
        [
          vue.createCommentVNode(" 每个指标图表 "),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.chartData.datasets, (dataset, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: "chart-container"
              }, [
                vue.createElementVNode("scroll-view", {
                  "scroll-x": "",
                  class: "chart-scroll"
                }, [
                  vue.createElementVNode("canvas", {
                    "canvas-id": "chart" + index,
                    id: "chart" + index,
                    class: "chart-canvas",
                    style: vue.normalizeStyle({
                      width: $data.chartContentWidth + "px",
                      height: $data.chartHeight + "px"
                    })
                  }, null, 12, ["canvas-id", "id"])
                ]),
                vue.createCommentVNode(" 数值提示框 "),
                $data.activePoints[index] ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 0,
                    class: "tooltip",
                    style: vue.normalizeStyle({
                      left: $data.activePoints[index].x + "px",
                      top: $data.activePoints[index].y + "px"
                    })
                  },
                  vue.toDisplayString($data.activePoints[index].value + dataset.unit),
                  5
                  /* TEXT, STYLE */
                )) : vue.createCommentVNode("v-if", true)
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ],
        4
        /* STYLE */
      ),
      vue.createCommentVNode(" 底部操作按钮 "),
      vue.createElementVNode(
        "view",
        {
          class: "action-btns",
          style: vue.normalizeStyle({ bottom: $data.safeAreaBottom + "px" })
        },
        [
          vue.createElementVNode("button", {
            class: "btn",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.backToHome && $options.backToHome(...args))
          }, "返回首页"),
          vue.createElementVNode("button", {
            class: "btn",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.refreshData && $options.refreshData(...args))
          }, "刷新数据")
        ],
        4
        /* STYLE */
      ),
      vue.createCommentVNode(" 加载提示 "),
      $data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "loading-mask"
      }, [
        vue.createElementVNode("view", { class: "loading-content" }, [
          vue.createElementVNode("image", {
            class: "loading-icon",
            src: _imports_0
          }),
          vue.createElementVNode("text", { class: "loading-text" }, "数据加载中...")
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesHistoryHistory = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "D:/桌面/大三下/云计算/大作业/高血压风险评估系统/pages/history/history.vue"]]);
  const API_BASE$1 = "http://localhost:5000";
  const _sfc_main$4 = {
    data() {
      return {
        messages: [],
        inputMessage: "",
        loading: false,
        scrollTop: 0,
        autoFocus: true,
        username: ""
      };
    },
    computed: {
      isLoggedIn() {
        return !!this.username;
      }
    },
    mounted() {
      this.loadSession();
      this.loadHistory();
    },
    methods: {
      async loadSession() {
        try {
          this.username = uni.getStorageSync("username");
        } catch (error) {
          formatAppLog("log", "at pages/advice/advice.vue:86", "未找到登录信息");
        }
      },
      async sendMessage() {
        if (!this.validateInput())
          return;
        const userMsg = {
          role: "user",
          content: this.inputMessage,
          time: this.getCurrentTime()
        };
        this.messages.push(userMsg);
        this.inputMessage = "";
        try {
          this.loading = true;
          const res = await uni.request({
            url: `${API_BASE$1}/ask_ai`,
            method: "POST",
            data: {
              username: this.username,
              question: userMsg.content
            }
          });
          if (res.statusCode === 200) {
            this.messages.push({
              role: "assistant",
              content: res.data.answer,
              time: this.getCurrentTime()
            });
          }
        } catch (error) {
          uni.showToast({ title: "请求失败，请重试", icon: "none" });
        } finally {
          this.loading = false;
          this.scrollToBottom();
        }
      },
      validateInput() {
        if (!this.username) {
          uni.showToast({ title: "请先登录", icon: "none" });
          return false;
        }
        return !!this.inputMessage.trim();
      },
      async loadHistory() {
        if (!this.username)
          return;
        try {
          const res = await uni.request({
            url: `${API_BASE$1}/ai_history`,
            method: "POST",
            data: {
              username: this.username
            }
          });
          if (res.statusCode === 200) {
            this.messages = res.data.history.map((item) => ({
              role: "assistant",
              content: item.answer,
              time: item.time
            }));
          }
        } catch (error) {
          formatAppLog("error", "at pages/advice/advice.vue:155", "加载历史失败:", error);
        }
      },
      clearHistory() {
        uni.showModal({
          title: "确认清空",
          content: "确定要清空所有对话记录吗？",
          success: async (res) => {
            if (res.confirm) {
              try {
                await uni.request({
                  url: `${API_BASE$1}/clear_ai_history`,
                  method: "POST",
                  data: {
                    username: this.username
                  }
                });
                this.messages = [];
              } catch (error) {
                formatAppLog("error", "at pages/advice/advice.vue:175", "清空失败:", error);
              }
            }
          }
        });
      },
      getCurrentTime() {
        const now = /* @__PURE__ */ new Date();
        return `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
      },
      goToWordCloud() {
        uni.navigateTo({
          url: "/pages/wordcloud/wordcloud"
          // 根据你项目目录调整路径
        });
      },
      scrollToBottom() {
        this.$nextTick(() => {
          this.scrollTop = this.messages.length * 1e3;
        });
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 顶部标题 "),
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("text", { class: "title" }, "AI健康助手"),
        vue.createElementVNode("view", { style: { "display": "flex", "gap": "20rpx" } }, [
          vue.createElementVNode("button", {
            class: "cloud-btn",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.goToWordCloud && $options.goToWordCloud(...args))
          }, "词云图"),
          vue.createElementVNode("button", {
            class: "clear-btn",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.clearHistory && $options.clearHistory(...args))
          }, "清空记录")
        ])
      ]),
      vue.createCommentVNode(" 对话区域 "),
      vue.createElementVNode("scroll-view", {
        class: "chat-area",
        "scroll-y": "",
        "scroll-top": $data.scrollTop,
        "scroll-with-animation": ""
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.messages, (msg, index) => {
            return vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: index,
                class: vue.normalizeClass(["message-wrap", { "user-message": msg.role === "user" }])
              },
              [
                vue.createElementVNode("view", { class: "message-bubble" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "role-tag" },
                    vue.toDisplayString(msg.role === "user" ? "我" : "AI"),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "message-content" },
                    vue.toDisplayString(msg.content),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "time" },
                    vue.toDisplayString(msg.time),
                    1
                    /* TEXT */
                  )
                ])
              ],
              2
              /* CLASS */
            );
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        $data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "loading-wrap"
        }, [
          vue.createElementVNode("text", { class: "loading-text" }, "AI正在思考中...")
        ])) : vue.createCommentVNode("v-if", true)
      ], 8, ["scroll-top"]),
      vue.createCommentVNode(" 输入区域 "),
      vue.createElementVNode("view", { class: "input-area" }, [
        vue.withDirectives(vue.createElementVNode("input", {
          class: "input",
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.inputMessage = $event),
          placeholder: "输入健康问题...",
          "placeholder-class": "placeholder",
          focus: $data.autoFocus,
          onConfirm: _cache[3] || (_cache[3] = (...args) => $options.sendMessage && $options.sendMessage(...args))
        }, null, 40, ["focus"]), [
          [vue.vModelText, $data.inputMessage]
        ]),
        vue.createElementVNode("button", {
          class: "send-btn",
          disabled: $data.loading || !$options.isLoggedIn,
          onClick: _cache[4] || (_cache[4] = (...args) => $options.sendMessage && $options.sendMessage(...args))
        }, vue.toDisplayString($options.isLoggedIn ? "发送" : "请先登录"), 9, ["disabled"])
      ])
    ]);
  }
  const PagesAdviceAdvice = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "D:/桌面/大三下/云计算/大作业/高血压风险评估系统/pages/advice/advice.vue"]]);
  const _sfc_main$3 = {
    props: {
      values: Array,
      current: {
        type: Number,
        default: 0
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "segmented-control" }, [
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($props.values, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            key: index,
            class: vue.normalizeClass(["segment", { active: $props.current === index }]),
            onClick: ($event) => _ctx.$emit("clickItem", index)
          }, vue.toDisplayString(item), 11, ["onClick"]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const SegmentedControl = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-7f0a604f"], ["__file", "D:/桌面/大三下/云计算/大作业/高血压风险评估系统/pages/components/segmented-control.vue"]]);
  const API_BASE = "http://localhost:5000";
  const _sfc_main$2 = {
    components: { SegmentedControl },
    data() {
      return {
        chartHeight: 300,
        chartContentWidth: 800,
        loading: false,
        currentRiskType: 0,
        summary: {
          total: 0,
          high_risk_ratio: 0,
          avg_age: 0,
          smoker_ratio: 0
        },
        statLabels: {
          total: "总样本数",
          high_risk_ratio: "高风险比例",
          avg_age: "平均年龄",
          smoker_ratio: "吸烟者占比"
        },
        chartData: {
          riskByGender: [],
          riskByAge: [],
          bmi: [],
          bp: { avg_sys_bp: 0, avg_dia_bp: 0 },
          smoke: [],
          smokeVsHypertension: [],
          // 新增：吸烟vs高血压的统计数据
          bmiVsHypertension: [],
          diabetesRisk: { diabetic_total: 0, diabetic_high_risk: 0, risk_ratio: 0 },
          bmiByGender: [],
          hypertensionRisk: { high_bp_total: 0, high_bp_high_risk: 0, risk_ratio: 0 },
          indicatorsByRisk: []
        }
      };
    },
    mounted() {
      this.calcDimensions();
      this.loadData();
    },
    methods: {
      calcDimensions() {
        const sys = uni.getSystemInfoSync();
        this.chartContentWidth = sys.windowWidth * 2;
        this.chartHeight = sys.windowHeight * 0.4;
      },
      formatStatValue(key, value) {
        if (key.endsWith("_ratio"))
          return `${value.toFixed(1)}%`;
        if (key === "avg_age")
          return value.toFixed(1);
        return value;
      },
      async loadData() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.loading = true;
        try {
          const [
            summaryRes,
            riskRes,
            bmiRes,
            bpRes,
            smokeRes,
            diabetesRes,
            bmiGenderRes,
            hyperRiskRes,
            indicatorsRes,
            smokeHyperRes,
            BMIHyperRes
          ] = await Promise.all([
            uni.request({ url: `${API_BASE}/analysis/summary` }),
            uni.request({ url: `${API_BASE}/analysis/risk_distribution` }),
            uni.request({ url: `${API_BASE}/analysis/bmi_distribution` }),
            uni.request({ url: `${API_BASE}/analysis/indicators` }),
            uni.request({ url: `${API_BASE}/analysis/smoking_distribution` }),
            uni.request({ url: `${API_BASE}/analysis/diabetes_risk` }),
            uni.request({ url: `${API_BASE}/analysis/bmi_by_gender` }),
            uni.request({ url: `${API_BASE}/analysis/hypertension_risk` }),
            uni.request({ url: `${API_BASE}/analysis/indicators_by_risk` }),
            uni.request({ url: `${API_BASE}/analysis/smoking_vs_hypertension` }),
            uni.request({ url: `${API_BASE}/analysis/bmi_risk_relation` })
            // 新增请求
          ]);
          formatAppLog("log", "at pages/analysis/analysis.vue:221", smokeRes.data.data);
          this.summary = {
            total: this.safeNumber((_a = summaryRes.data.data) == null ? void 0 : _a.total),
            high_risk_ratio: this.safeNumber((_b = summaryRes.data.data) == null ? void 0 : _b.high_risk_ratio),
            avg_age: this.safeNumber((_c = summaryRes.data.data) == null ? void 0 : _c.avg_age),
            smoker_ratio: this.safeNumber((_d = summaryRes.data.data) == null ? void 0 : _d.smoker_ratio)
          };
          this.chartData = {
            riskByGender: this.processPieData((_e = riskRes.data.data) == null ? void 0 : _e.by_gender, "gender"),
            riskByAge: this.processPieData((_f = riskRes.data.data) == null ? void 0 : _f.by_age, "range"),
            bmi: this.processBarData(bmiRes.data.data, "category"),
            bp: {
              avg_sys_bp: this.safeNumber((_g = bpRes.data.data) == null ? void 0 : _g.avg_sys_bp),
              avg_dia_bp: this.safeNumber((_h = bpRes.data.data) == null ? void 0 : _h.avg_dia_bp)
            },
            diabetesRisk: diabetesRes.data.data,
            bmiByGender: bmiGenderRes.data.data,
            hypertensionRisk: hyperRiskRes.data.data,
            indicatorsByRisk: indicatorsRes.data.data
          };
          this.chartData.smokeVsHypertension = smokeHyperRes.data.data.map((item) => ({
            label: item.smoking_level,
            // label 为 “1-5根” 等
            count: item.hypertension_rate
            // 后端接口返回的 ratio 是高血压比例（%）
          }));
          this.chartData.bmiVsHypertension = BMIHyperRes.data.data.map((item) => ({
            label: item.label,
            // label 为 “1-5根” 等
            count: item.risk_ratio
            // 后端接口返回的 ratio 是高血压比例（%）
          }));
          formatAppLog("log", "at pages/analysis/analysis.vue:252", "BMIVS", this.chartData.bmiVsHypertension);
          this.chartData.smoke = smokeRes.data.data.map((item) => ({
            label: item.label,
            count: item.count
          }));
          await this.$nextTick();
          this.drawAllCharts();
        } catch (err) {
          formatAppLog("error", "at pages/analysis/analysis.vue:262", "加载失败:", err);
          uni.showToast({ title: "数据加载失败", icon: "none" });
        } finally {
          this.loading = false;
        }
      },
      safeNumber(val) {
        const n = typeof val === "string" ? parseFloat(val) : Number(val);
        return isNaN(n) ? 0 : n;
      },
      processPieData(data, key) {
        return (data || []).map((item) => ({
          label: item[key] || "未知",
          count: this.safeNumber(item.count)
        }));
      },
      processBarData(data, key) {
        return (data || []).map((item) => ({
          label: item[key] || "未知",
          count: this.safeNumber(item.count)
        }));
      },
      handleRiskTypeChange(index) {
        this.currentRiskType = index;
        this.$nextTick(() => {
          this.drawPieChart("riskChart", this.getRiskData());
        });
      },
      getRiskData() {
        return this.currentRiskType === 0 ? this.chartData.riskByGender : this.chartData.riskByAge;
      },
      drawAllCharts() {
        this.drawPieChart("riskChart", this.getRiskData());
        this.drawPieChart("bmiChart", this.chartData.bmi);
        this.drawBarChart("bpChart", [
          { label: "收缩压", count: this.chartData.bp.avg_sys_bp },
          { label: "舒张压", count: this.chartData.bp.avg_dia_bp }
        ], "血压 (mmHg)");
        this.drawPieChart("smokeChart", this.chartData.smoke);
        this.drawBarChart("smokeHyperChart", this.chartData.smokeVsHypertension, "高血压率 (%)");
        this.drawBarChart("BMIHyperChart", this.chartData.bmiVsHypertension, "高血压率 (%)");
        this.drawBarChart("indicatorsRiskChart", this.chartData.indicatorsByRisk.flatMap((item) => [
          { label: `${item.risk_level}-BMI`, count: item.avg_bmi },
          { label: `${item.risk_level}-SBP`, count: item.avg_sys_bp },
          { label: `${item.risk_level}-GLU`, count: item.avg_glucose }
        ]), "风险指标对比");
      },
      calcDimensions() {
        const sys = uni.getSystemInfoSync();
        this.chartContentWidth = sys.windowWidth;
        this.chartHeight = sys.windowWidth * 0.6;
      },
      drawPieChart(id, data) {
        const ctx = uni.createCanvasContext(id, this);
        const cx = this.chartContentWidth / 2;
        const cy = this.chartHeight / 2;
        const radius = Math.min(cx, cy) * 0.7;
        let start = 0;
        const total = data.reduce((s, d) => s + d.count, 0);
        data.forEach((d, i) => {
          const angle = d.count / total * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, radius, start, start + angle);
          ctx.closePath();
          ctx.setFillStyle(this.getColor(i));
          ctx.fill();
          start += angle;
        });
        ctx.draw();
      },
      drawBarChart(id, data, yLabel = "") {
        const ctx = uni.createCanvasContext(id, this);
        const margin = 40;
        const axisY = this.chartHeight - margin;
        const max = Math.max(...data.map((d) => d.count)) || 1;
        const barWidth = 30;
        const gap = 30;
        const totalWidth = data.length * barWidth + (data.length - 1) * gap;
        const startX = (this.chartContentWidth - totalWidth) / 2;
        ctx.setStrokeStyle("#ccc");
        ctx.setFontSize(12);
        for (let i = 0; i <= 5; i++) {
          const y = axisY - (this.chartHeight - margin * 2) * i / 5;
          ctx.beginPath();
          ctx.moveTo(margin, y);
          ctx.lineTo(this.chartContentWidth - margin, y);
          ctx.stroke();
          ctx.fillText((max * i / 5).toFixed(0), 15, y + 4);
        }
        data.forEach((d, i) => {
          const barHeight = d.count / max * (this.chartHeight - margin * 2);
          const x = startX + i * (barWidth + gap);
          const y = axisY - barHeight;
          ctx.setFillStyle(this.getColor(i));
          ctx.fillRect(x, y, barWidth, barHeight);
          ctx.setFillStyle("#333");
          ctx.setFontSize(12);
          ctx.setTextAlign("center");
          ctx.fillText(d.label, x + barWidth / 2, axisY + 15);
        });
        if (yLabel) {
          ctx.save();
          ctx.translate(12, this.chartHeight / 2);
          ctx.rotate(-Math.PI / 2);
          ctx.setFillStyle("#999");
          ctx.setFontSize(12);
          ctx.fillText(yLabel, 0, 0);
          ctx.restore();
        }
        ctx.draw();
      },
      getColor(i) {
        const colors = ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272"];
        return colors[i % colors.length];
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_segmented_control = vue.resolveComponent("segmented-control");
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 数据概览 "),
      vue.createElementVNode("view", { class: "stats-grid" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.summary, (item, key) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "stat-card",
              key
            }, [
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                vue.toDisplayString($options.formatStatValue(key, item)),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "stat-label" },
                vue.toDisplayString($data.statLabels[key]),
                1
                /* TEXT */
              )
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createCommentVNode(" 风险分布 "),
      vue.createCommentVNode(" 风险分布 "),
      vue.createElementVNode("view", { class: "chart-card" }, [
        vue.createElementVNode("view", { class: "chart-header" }, [
          vue.createElementVNode("text", { class: "chart-title" }, "统计人群分布"),
          vue.createVNode(_component_segmented_control, {
            values: ["性别分布", "年龄分布"],
            onClickItem: $options.handleRiskTypeChange,
            current: $data.currentRiskType
          }, null, 8, ["onClickItem", "current"])
        ]),
        vue.createElementVNode(
          "canvas",
          {
            "canvas-id": "riskChart",
            class: "chart-canvas",
            style: vue.normalizeStyle({ width: $data.chartContentWidth + "px", height: $data.chartHeight + "px" })
          },
          null,
          4
          /* STYLE */
        ),
        vue.createCommentVNode(" 这里你可以用普通view渲染图例 "),
        vue.createElementVNode("view", { class: "legend" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($options.getRiskData(), (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: "legend-item"
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "legend-color",
                    style: vue.normalizeStyle({ backgroundColor: $options.getColor(index) })
                  },
                  null,
                  4
                  /* STYLE */
                ),
                vue.createElementVNode(
                  "text",
                  null,
                  vue.toDisplayString(item.label) + " (" + vue.toDisplayString(item.count) + ")",
                  1
                  /* TEXT */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" BMI vs 高血压率 柱状图 "),
      vue.createElementVNode("view", { class: "chart-card" }, [
        vue.createElementVNode("text", { class: "chart-title" }, "BMI vs 高血压率 (%)"),
        vue.createElementVNode(
          "canvas",
          {
            "canvas-id": "BMIHyperChart",
            class: "chart-canvas",
            style: vue.normalizeStyle({ width: $data.chartContentWidth + "px", height: $data.chartHeight + "px" })
          },
          null,
          4
          /* STYLE */
        )
      ]),
      vue.createCommentVNode(" BMI "),
      vue.createElementVNode("view", { class: "chart-row" }, [
        vue.createElementVNode("view", { class: "chart-col" }, [
          vue.createElementVNode("view", { class: "chart-card" }, [
            vue.createElementVNode("text", { class: "chart-title" }, "BMI 分布"),
            vue.createElementVNode("scroll-view", {
              "scroll-x": "",
              class: "chart-scroll"
            }, [
              vue.createElementVNode(
                "canvas",
                {
                  "canvas-id": "bmiChart",
                  class: "chart-canvas",
                  style: vue.normalizeStyle({ width: $data.chartContentWidth + "px", height: $data.chartHeight + "px" })
                },
                null,
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "legend" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.chartData.bmi, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: "legend-item"
                  }, [
                    vue.createElementVNode(
                      "view",
                      {
                        class: "legend-color",
                        style: vue.normalizeStyle({ backgroundColor: $options.getColor(index) })
                      },
                      null,
                      4
                      /* STYLE */
                    ),
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item.label) + " (" + vue.toDisplayString(item.count) + ")",
                      1
                      /* TEXT */
                    )
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "chart-col" }, [
          vue.createElementVNode("view", { class: "chart-card" }, [
            vue.createElementVNode("text", { class: "chart-title" }, "血压指标"),
            vue.createElementVNode("scroll-view", {
              "scroll-x": "",
              class: "chart-scroll"
            }, [
              vue.createElementVNode(
                "canvas",
                {
                  "canvas-id": "bpChart",
                  class: "chart-canvas",
                  style: vue.normalizeStyle({ width: $data.chartContentWidth + "px", height: $data.chartHeight + "px" })
                },
                null,
                4
                /* STYLE */
              )
            ])
          ])
        ])
      ]),
      vue.createCommentVNode(" 吸烟分布图（饼图） "),
      vue.createElementVNode("view", { class: "chart-card" }, [
        vue.createElementVNode("text", { class: "chart-title" }, "吸烟者每日吸烟量分布"),
        vue.createElementVNode(
          "canvas",
          {
            "canvas-id": "smokeChart",
            class: "chart-canvas",
            style: vue.normalizeStyle({ width: $data.chartContentWidth + "px", height: $data.chartHeight + "px" })
          },
          null,
          4
          /* STYLE */
        ),
        vue.createElementVNode("view", { class: "legend" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.chartData.smoke, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: "legend-item"
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "legend-color",
                    style: vue.normalizeStyle({ backgroundColor: $options.getColor(index) })
                  },
                  null,
                  4
                  /* STYLE */
                ),
                vue.createElementVNode(
                  "text",
                  null,
                  vue.toDisplayString(item.label) + " (" + vue.toDisplayString(item.count) + ")",
                  1
                  /* TEXT */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" 吸烟量 vs 高血压率 柱状图 "),
      vue.createElementVNode("view", { class: "chart-card" }, [
        vue.createElementVNode("text", { class: "chart-title" }, "吸烟量 vs 高血压率 (%)"),
        vue.createElementVNode(
          "canvas",
          {
            "canvas-id": "smokeHyperChart",
            class: "chart-canvas",
            style: vue.normalizeStyle({ width: $data.chartContentWidth + "px", height: $data.chartHeight + "px" })
          },
          null,
          4
          /* STYLE */
        )
      ]),
      vue.createCommentVNode(" 风险等级指标对比 "),
      vue.createElementVNode("view", { class: "chart-card" }, [
        vue.createElementVNode("text", { class: "chart-title" }, "风险指标对比"),
        vue.createElementVNode("scroll-view", {
          "scroll-x": "",
          class: "chart-scroll"
        }, [
          vue.createElementVNode(
            "canvas",
            {
              "canvas-id": "indicatorsRiskChart",
              class: "chart-canvas",
              style: vue.normalizeStyle({ width: $data.chartContentWidth + "px", height: $data.chartHeight + "px" })
            },
            null,
            4
            /* STYLE */
          )
        ])
      ]),
      vue.createCommentVNode(" 加载中 "),
      $data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "loading-mask"
      }, [
        vue.createElementVNode("view", { class: "loading-content" }, [
          vue.createElementVNode("image", {
            class: "loading-icon",
            src: _imports_0
          }),
          vue.createElementVNode("text", { class: "loading-text" }, "数据加载中...")
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAnalysisAnalysis = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "D:/桌面/大三下/云计算/大作业/高血压风险评估系统/pages/analysis/analysis.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        imgUrl: "",
        analysis: "",
        loading: false
      };
    },
    onLoad() {
      this.fetchWordcloud();
    },
    methods: {
      fetchWordcloud() {
        this.loading = true;
        uni.request({
          url: "http://localhost:5000/wordcloud",
          method: "GET",
          success: (res) => {
            if (res.statusCode === 200 && res.data.image_url) {
              this.imgUrl = "http://localhost:5000" + res.data.image_url;
              this.analysis = res.data.analysis || "暂无分析内容";
            } else {
              uni.showToast({ title: "词云加载失败", icon: "none" });
            }
          },
          fail: () => {
            uni.showToast({ title: "请求失败", icon: "none" });
          },
          complete: () => {
            this.loading = false;
          }
        });
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "cloud-container" }, [
      vue.createElementVNode("view", { class: "card" }, [
        vue.createElementVNode("text", { class: "title" }, "高血压常见问题词云图"),
        $data.imgUrl ? (vue.openBlock(), vue.createElementBlock("image", {
          key: 0,
          src: $data.imgUrl,
          mode: "widthFix",
          class: "cloud-img"
        }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "loading"
        }, "正在加载词云图...")),
        vue.createElementVNode("button", {
          class: "refresh-btn",
          disabled: $data.loading,
          onClick: _cache[0] || (_cache[0] = (...args) => $options.fetchWordcloud && $options.fetchWordcloud(...args))
        }, vue.toDisplayString($data.loading ? "加载中..." : "刷新词云"), 9, ["disabled"]),
        $data.analysis ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "analysis-container"
        }, [
          vue.createElementVNode("text", { class: "analysis-title" }, "词云分析"),
          vue.createElementVNode("scroll-view", {
            class: "analysis-text",
            "scroll-y": ""
          }, [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($data.analysis),
              1
              /* TEXT */
            )
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ])
    ]);
  }
  const PagesWordcloudWordcloud = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-388a9e70"], ["__file", "D:/桌面/大三下/云计算/大作业/高血压风险评估系统/pages/wordcloud/wordcloud.vue"]]);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/register/register", PagesRegisterRegister);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/predict/predict", PagesPredictPredict);
  __definePage("pages/result/result", PagesResultResult);
  __definePage("pages/components/components", PagesComponentsComponents);
  __definePage("pages/history/history", PagesHistoryHistory);
  __definePage("pages/advice/advice", PagesAdviceAdvice);
  __definePage("pages/analysis/analysis", PagesAnalysisAnalysis);
  __definePage("pages/wordcloud/wordcloud", PagesWordcloudWordcloud);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/桌面/大三下/云计算/大作业/高血压风险评估系统/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
