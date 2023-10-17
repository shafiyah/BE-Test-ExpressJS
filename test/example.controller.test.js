const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const expect = chai.expect;

const io = require('socket.io-client');
const express = require("express");
const app = express();

const axios = require('axios');

const exampleController = require('../app/controllers/exampleController');
const authorService = require('../app/services/authorService');
const cyberattackService = require('../app/services/cyberattackService');
const { Error } = require('sequelize');


chai.use(chaiHttp);

describe('example Controller', () => {
  describe('login', () => {
    it('should return a JWT token on successful login', async () => {
      
      const fakeUser = [{ id: 1, username: 'budi', password:'budi123' }];
      const fakeToken = 'fake-token';

      // Stub authorService.authenticateUser to return fakeData
      sinon.stub(authorService, 'authenticateUser').resolves(fakeToken);

      const req = { body : fakeUser };
      const res = { json: sinon.spy() };

      await exampleController.login(req, res);

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWithExactly({ token: fakeToken })).to.be.true;

      // Restore the original function
      authorService.authenticateUser.restore();
    });
  });


  describe('callmeWebSocket',  function () {
    const socketURL = 'http://localhost:5000';
    beforeEach(() => {
        server = require('http').createServer();
        const ioServer = require('socket.io')(server);

        exampleController.callmeWebSocket(ioServer);
        server.listen(5000);
    });

    afterEach(() => {
        server.close();
    });

    it('should emit "message" event on connection', (done) => {
        const client = io.connect(socketURL);
        client.on('connection')
          client.on('message', (data) => {
            expect(message).to.equal('Data from server');
          });
        client.disconnect();
        done();
    });

    it('should clear interval on disconnect', (done) => {

        const client = io.connect(socketURL);
        client.on('connection');
        client.disconnect();
          setTimeout(() => {
            expect(client.connected).to.equal(false);
            done();
          },100);
    });

  });

  

  describe('getData', () => {
    
    const fakeData = [{ id: 1, sourceCountry : 'AS',destinationCountry : 'id', type : 'scanners', millisecond : 847 , weight : 0 , attackTime : '2023-10-15T02:02:10.843' }];
    const req = {};
    const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
    };

    it('should get data and set as return ', async () => {
        const expectedResults = fakeData;
        //cyberattackService.getTotalAttack.resolves(expectedResults);

        sinon.stub(cyberattackService, 'getTotalAttack').resolves(fakeData);
    
        await exampleController.getData(req, res);
    
        sinon.assert.calledWith(res.status.firstCall, 200);
        sinon.assert.calledWith(res.send.firstCall, {
          statusCode: 200,
          success: true,
          data: expectedResults,
        });
        cyberattackService.getTotalAttack.restore();
      });

      it('should handle error and return 500 Unauthorized with failed get data', async () => {
        const errorMessage = 'faild get total cyberattack';

        sinon.stub(cyberattackService, 'getTotalAttack').rejects(new Error(errorMessage));
        await exampleController.getData(req, res);
        
        console.log(res);
        sinon.assert.calledWith(res.status.lastCall, 500); 
        sinon.assert.calledWith(res.send.lastCall, {
          statusCode: 500,
          message: errorMessage,
          success: false,
        });
        cyberattackService.getTotalAttack.restore();
      });


  });


});