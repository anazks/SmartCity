//for closing alerts
function myAlertTop() {
    setTimeout(function () {
        $(".myAlert-top").hide();
    }, 2000);
}
window.onload = myAlertTop();