var app = new Vue({
    el: '#app',
    data: {
        h: 0,
        s: 0,
        v: 0
    },
    methods: {
        calibrate: function () {
            let vm = this
            let uri = '/masks'
            fetch(uri).then(function (resp) {
                return resp.json();
            }).then(function (json) {
                vm.h = json[0]
                vm.s = json[1]
                vm.v = json[2]
            });
        }
    }
})
