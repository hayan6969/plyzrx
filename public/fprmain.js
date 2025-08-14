(function (w) {
  w.fpr =
    w.fpr ||
    function () {
      w.fpr.q = w.fpr.q || [];
      w.fpr.q[arguments[0] == "set" ? "unshift" : "push"](arguments);
    };
})(window);
fpr("init", { cid: "m7mhz1bs" });
fpr("click");
