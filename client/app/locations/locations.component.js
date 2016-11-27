'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './locations.routes';

export class LocationsComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('turiBotApp.locations', [uiRouter])
  .config(routes)
  .component('locations', {
    template: require('./locations.html'),
    controller: LocationsComponent,
    controllerAs: 'locationsCtrl'
  })
  .name;
