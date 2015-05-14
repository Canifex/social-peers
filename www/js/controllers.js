angular.module('starter.controllers', [])

.controller('ChatsCtrl', function($scope, $ionicModal, pouchDB) {
  var settings = pouchDB('settings');
  settings.get('my-own-id').then(function(doc){
    $scope.own_id = doc.value;
    var my_database = pouchDB(doc.value);
    my_database.allDocs({
      include_docs: true
    }).then(function (result) {
      data = result.rows.map(function(val){return val.doc});
      $scope.entries = data;
    });


    $scope.addEntry = function(){
      val = document.getElementById('new-entry').value;
      my_database.put({_id: 'entry-'+Date.now(), content: val, date: Date.now()}).then(function(){
        $scope.new_entry = "";
        window.location.reload();
      });
    };
  });

  $ionicModal.fromTemplateUrl('add-entry-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
})

.controller('FriendPinboardCtrl', function($scope, $stateParams, pouchDB) {
  friendDB = pouchDB($stateParams.friendId);
  friendDB.allDocs({
    include_docs: true
  }).then(function (result) {
    data = result.rows.map(function(val){return val.doc});
    $scope.entries = data;
  });
})

.controller('FriendCtrl', function($scope, $ionicModal, pouchDB) {
  $scope.new_friend = {id: '', name: ''};

  var settings = pouchDB('settings');
  var friends_ref = "";
  settings.get('my-own-id').then(function(doc){
    $scope.own_id = doc.value;
    settings.get('friends').then(function(doc) {
      $scope.friends = doc.value;
      friends_ref = doc._rev;
    });
  });

  // Adds a new friend
  $scope.addFriend = function(){
    $scope.friends.push($scope.new_friend);
    settings.put({_id: 'friends', value: $scope.friends, _rev: friends_ref}).then(function(resp){
      console.log(resp);
      friends_ref = resp._rev;
      $scope.new_friend = {name: '', id: ''};
    }).catch(function(e){console.log(e)});
  };




  $ionicModal.fromTemplateUrl('add-friend-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
});
