angular.module('dweAdminApp')
  .controller('DownloadCtrl', function ($scope) {
    
    var vm = this;
    vm.apps=[{
            name: 'Tech House (iOS)',
            link: 'http://app.ericsson.dweuser'
        }, 
        {
            name: 'Second App',
            link: 'https://www.ericsson.com'
        },
        {
            name: 'Third App',
            link: 'https://www.ericsson.com'
        }
    ];
});