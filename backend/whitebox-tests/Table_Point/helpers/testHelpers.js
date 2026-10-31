function createMockResponse() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
}

function createMockNext() {
    return jest.fn();
}

module.exports = {
    createMockResponse,
    createMockNext
};