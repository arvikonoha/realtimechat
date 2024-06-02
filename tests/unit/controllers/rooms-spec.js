'use strict';

const orm = require('../../../orm')
const roomsController = require('../../../controllers').rooms
const sinon = require('sinon')

describe('Rooms controller tests', function () {
    describe('create', function () {
        let ormListStub = null;
        let ormCreateStub = null;
        beforeEach(function () {
            ormListStub = sinon.stub(orm.rooms, 'list')
            ormCreateStub = sinon.stub(orm.rooms, 'create')
        });

        afterEach(function (){
            sinon.restore();
        });

        it ('Should fail with a 400, if room name is not passed', async function() {
            const mReq = {
                body: {
                    project: 'chat',
                    room: ''
                },
                user: {_id: 12}
            };

            const mRes = {
                status: sinon.stub(),
                json: sinon.stub(),
            }

            mRes.status.returns(mRes)

            await roomsController.create(mReq, mRes);

            expect(mRes.status.calledWith(400)).to.be.true
            expect(mRes.json.calledWith({message: 'Room name not sent'})).to.be.true
        })

        it ('Should fail with a 400, if room already exists for the project', async function() {
            const mReq = {
                body: {
                    project: 'chat',
                    name: 'test'
                },
                user: {_id: 12}
            };

            const mRes = {
                status: sinon.stub(),
                json: sinon.stub(),
            }

            mRes.status.returns(mRes)

            ormListStub.resolves([{name: 'chat'}])

            await roomsController.create(mReq, mRes);

            expect(ormListStub.calledOnce).to.be.true
            expect(mRes.status.calledWith(400)).to.be.true
            expect(mRes.json.calledWith({message: 'Room already exists with this name'})).to.be.true
        })

        it ('Should succeed with 200 if room is created successfully', async function() {
            const mReq = {
                body: {
                    project: 'chat',
                    name: 'test'
                },
                user: {_id: 12}
            };

            const mRes = {
                status: sinon.stub(),
                json: sinon.stub(),
            }

            mRes.status.returns(mRes)

            const roomDocument = {_id: '67ABC87E888E991', admin: mReq.user, ...mReq.body};

            ormListStub.resolves([])
            ormCreateStub.resolves(roomDocument)

            await roomsController.create(mReq, mRes);

            expect(ormListStub.calledOnce).to.be.true
            expect(ormCreateStub.calledOnce).to.be.true
            expect(mRes.json.calledWith(roomDocument)).to.be.true
        })
    });

    describe('getOrCreateDiscussion', function () {
        let ormListStub = null;
        let ormCreateStub = null;
        beforeEach(function () {
            ormListStub = sinon.stub(orm.rooms, 'list')
            ormCreateStub = sinon.stub(orm.rooms, 'create')
        })

        afterEach(function (){
            sinon.restore();
        })

        it ('Should return the room if it already exists', async function() {
            
        })
    })
})