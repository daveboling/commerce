/* global describe, it, before, beforeEach */
/* jshint expr:true*/

'use strict';

var expect = require('chai').expect;
var Item   = require('../../app/models/item');
//var connection = require('../../app/lib/mongodb');
var Mongo  = require('mongodb');

var c, couch, i, iphone, p, pony;

describe('Item', function() {
  before(function(done){
    require('../../app/lib/mongodb')('inventory', function(){
      done();
    });
  });

  beforeEach(function(done){
    Item.collection.remove(function(){
     c = {name: 'couch', dimensions: {l: 12, w: 8, h: 4}, weight: 100, color: 'purple', quantity: 5, msrp: 499.99, percentOff: 20};
     i = {name: 'iphone', dimensions: {l:2 , w:2, h:2 }, weight: 5, color: 'black', quantity: 1, msrp: 999.99, percentOff: 50};
     p = {name: 'pony', dimensions: {l: 12, w: 18, h: 7}, weight: 700, color: 'brown', quantity: 1, msrp: 5499.99, percentOff: 10};
     couch = new Item(c);
     iphone = new Item(i);
     pony = new Item(p);

     couch.save(function(){
      iphone.save(function(){
        pony.save(function(){
          done();
        });
      });
     });
    });
  });

  describe('constructor', function() {
    it('should create a new instance of Item', function(){
     
     expect(couch.name).to.equal('couch');
     expect(couch.dimensions.l).to.equal(12);
     expect(couch.dimensions.w).to.equal(8);
     expect(couch.dimensions.h).to.equal(4);
     expect(couch.weight).to.equal(100);
     expect(couch.color).to.equal('purple');
     expect(couch.quantity).to.equal(5);
     expect(couch.msrp).to.equal(499.99);
     expect(couch.percentOff).to.equal(20);
    });
  });
  describe('#cost', function() {
    it('should calculate the actual retail cost minus percent off', function(){
     expect(couch.cost()).to.be.closeTo(400, 0.1);
    });
  });
  describe('#save', function() {
    it('should save an item to the inventory collection', function(done){
      couch.save(function(){
        expect(couch._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });
  describe('.all', function(){
    it('should display all items in the database', function(done) {
      Item.all(function(item){
        expect(item.length).to.equal(3);
        done();
      });
    });
  });
  describe('.findByID', function(){
    it('should find a specific item by its ID', function(done){
      var id = couch._id;

      Item.findByID(id, function(item){
        expect(item._id.toString()).to.equal(couch._id.toString());
        expect(item.name).to.equal(couch.name);
        done();
      });
    });
  });
  describe('.deleteByID', function(){
    it('should delete a specific based on its id', function(done){
      var id = couch._id;

      Item.deleteByID(id, function(){
        Item.all(function(item){
          expect(item.length).to.equal(2);
          done();
        });
      });
    });
  });
  







});
