const reservationController = require('../src/controllers/reservationController');
const { Reservation, RestaurantTable, sequelize } = require('../src/models');

jest.mock('../src/models', () => ({
    Reservation: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn()
    },
    RestaurantTable: {
        findOne: jest.fn(),
        update: jest.fn()
    },
    User: {},

    sequelize: {
        transaction: jest.fn(),
        where: jest.fn(),
        fn: jest.fn(),
        col: jest.fn(),
        literal: jest.fn()
    }
}));

describe('BVA Testing: Reservation Controller', () => {

    let req;
    let res;
    let next;
    let transaction;

    beforeEach(() => {

        req = {
            body: {},
            params: {},
            query: {},
            user: {
                id: 1
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        next = jest.fn();

        transaction = {
            commit: jest.fn(),
            rollback: jest.fn()
        };

        sequelize.transaction.mockResolvedValue(transaction);

        jest.clearAllMocks();

        sequelize.transaction.mockResolvedValue(transaction);
    });



    describe('BVA - createReservation: numberOfGuests', () => {

        test('[BVA-RES-01] Min boundary: numberOfGuests = 1', async () => {

            req.body = {
                guestName: 'Trí',
                guestPhone: '0900000001',
                reservationTime: '2026-08-25T18:00:00',
                numberOfGuests: 1
            };

            Reservation.findAll.mockResolvedValue([]);

            const mockTable = {
                id: 1,
                tableNumber: 1,
                capacity: 4
            };

            RestaurantTable.findOne.mockResolvedValue(mockTable);

            const mockReservation = {
                toJSON: () => ({
                    id: 1,
                    ...req.body
                })
            };

            Reservation.create.mockResolvedValue(mockReservation);

            await reservationController.createReservation(req, res, next);

            expect(Reservation.create).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(201);

            expect(transaction.commit).toHaveBeenCalled();
        });


        test('[BVA-RES-02] Below minimum: numberOfGuests = 0', async () => {

            req.body = {
                guestName: 'Trí',
                guestPhone: '0900000001',
                reservationTime: '2026-08-25T18:00:00',
                numberOfGuests: 0
            };

            Reservation.findAll.mockResolvedValue([]);

            RestaurantTable.findOne.mockResolvedValue(null);

            await reservationController.createReservation(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);

            expect(transaction.rollback).toHaveBeenCalled();
        });


        test('[BVA-RES-03] Just above minimum: numberOfGuests = 2', async () => {

            req.body = {
                guestName: 'Trí',
                guestPhone: '0900000001',
                reservationTime: '2026-08-25T18:00:00',
                numberOfGuests: 2
            };

            Reservation.findAll.mockResolvedValue([]);

            const mockTable = {
                id: 2,
                tableNumber: 2,
                capacity: 4
            };

            RestaurantTable.findOne.mockResolvedValue(mockTable);

            Reservation.create.mockResolvedValue({
                toJSON: () => ({
                    id: 2,
                    ...req.body
                })
            });

            await reservationController.createReservation(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);

            expect(transaction.commit).toHaveBeenCalled();
        });

    });


    describe('BVA - Table Capacity', () => {

        test('[BVA-RES-04] Exact boundary: guests = table capacity = 4', async () => {

            req.body = {
                guestName: 'Trí',
                guestPhone: '0900000001',
                reservationTime: '2026-08-25T18:00:00',
                numberOfGuests: 4
            };

            Reservation.findAll.mockResolvedValue([]);

            const mockTable = {
                id: 1,
                tableNumber: 1,
                capacity: 4
            };

            RestaurantTable.findOne.mockResolvedValue(mockTable);

            Reservation.create.mockResolvedValue({
                toJSON: () => ({
                    id: 1,
                    ...req.body
                })
            });

            await reservationController.createReservation(req, res, next);

            expect(RestaurantTable.findOne).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(201);
        });


        test('[BVA-RES-05] Above boundary: guests = 5 but only capacity = 4', async () => {

            req.body = {
                guestName: 'Trí',
                guestPhone: '0900000001',
                reservationTime: '2026-08-25T18:00:00',
                numberOfGuests: 5
            };

            Reservation.findAll.mockResolvedValue([]);

            RestaurantTable.findOne.mockResolvedValue(null);

            await reservationController.createReservation(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);

            expect(transaction.rollback).toHaveBeenCalled();
        });

    });



    describe('BVA - checkIn time boundary ±30 minutes', () => {

        test('[BVA-RES-06] Lower boundary: exactly 30 minutes before', async () => {

            const now = new Date();

            const reservationTime =
                new Date(now.getTime() + 30 * 60 * 1000);

            req.params.id = 1;

            const reservation = {
                id: 1,
                table_id: 1,
                status: 'CONFIRMED',
                reservationTime,
                save: jest.fn()
            };

            Reservation.findByPk.mockResolvedValue(reservation);

            await reservationController.checkIn(req, res, next);

            expect(reservation.save).toHaveBeenCalled();

            expect(transaction.commit).toHaveBeenCalled();
        });


        test('[BVA-RES-07] Below lower boundary: more than 30 minutes early', async () => {

            const now = new Date();

            const reservationTime =
                new Date(now.getTime() + 31 * 60 * 1000);

            req.params.id = 1;

            Reservation.findByPk.mockResolvedValue({
                id: 1,
                table_id: 1,
                status: 'CONFIRMED',
                reservationTime
            });

            await reservationController.checkIn(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);

            expect(transaction.rollback).toHaveBeenCalled();
        });


       test('[BVA-RES-08] Upper boundary: exactly 30 minutes after', async () => {

    const now = new Date();

    jest.useFakeTimers();
    jest.setSystemTime(now);

    const reservationTime =
        new Date(now.getTime() - 30 * 60 * 1000);

    req.params.id = 1;

    const reservation = {
        id: 1,
        table_id: 1,
        status: 'PENDING',
        reservationTime,
        save: jest.fn().mockResolvedValue(true)
    };

    Reservation.findByPk.mockResolvedValue(reservation);

    await reservationController.checkIn(req, res, next);

    expect(reservation.save).toHaveBeenCalled();

    expect(transaction.commit).toHaveBeenCalled();

    jest.useRealTimers();
});

        test('[BVA-RES-09] Above upper boundary: more than 30 minutes late', async () => {

            const now = new Date();

            const reservationTime =
                new Date(now.getTime() - 31 * 60 * 1000);

            req.params.id = 1;

            Reservation.findByPk.mockResolvedValue({
                id: 1,
                table_id: 1,
                status: 'CONFIRMED',
                reservationTime
            });

            await reservationController.checkIn(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);

            expect(transaction.rollback).toHaveBeenCalled();
        });

    });


    describe('BVA - Reservation Status', () => {

        test('[BVA-RES-10] Boundary valid: PENDING -> CONFIRMED', async () => {

            req.params.id = 1;

            const reservation = {
                id: 1,
                status: 'PENDING',
                save: jest.fn()
            };

            Reservation.findByPk.mockResolvedValue(reservation);

            await reservationController.confirmReservation(req, res, next);

            expect(reservation.status).toBe('CONFIRMED');

            expect(reservation.save).toHaveBeenCalled();
        });


        test('[BVA-RES-11] Invalid boundary: CONFIRMED cannot confirm again', async () => {

            req.params.id = 1;

            Reservation.findByPk.mockResolvedValue({
                id: 1,
                status: 'CONFIRMED',
                save: jest.fn()
            });

            await reservationController.confirmReservation(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });


        test('[BVA-RES-12] Valid cancel boundary: PENDING', async () => {

            req.params.id = 1;

            const reservation = {
                id: 1,
                status: 'PENDING',
                save: jest.fn()
            };

            Reservation.findByPk.mockResolvedValue(reservation);

            await reservationController.cancelReservation(req, res, next);

            expect(reservation.status).toBe('CANCELLED');

            expect(reservation.save).toHaveBeenCalled();
        });


        test('[BVA-RES-13] Valid cancel boundary: CONFIRMED', async () => {

            req.params.id = 1;

            const reservation = {
                id: 1,
                status: 'CONFIRMED',
                save: jest.fn()
            };

            Reservation.findByPk.mockResolvedValue(reservation);

            await reservationController.cancelReservation(req, res, next);

            expect(reservation.status).toBe('CANCELLED');

            expect(reservation.save).toHaveBeenCalled();
        });


        test('[BVA-RES-14] Invalid cancel boundary: CHECKED_IN', async () => {

            req.params.id = 1;

            Reservation.findByPk.mockResolvedValue({
                id: 1,
                status: 'CHECKED_IN',
                save: jest.fn()
            });

            await reservationController.cancelReservation(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });

    });

});