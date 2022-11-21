import CustomError from "./CustomError";

describe("Given the class CustomError", () => {
  describe("When instantiated with message 'General error', status 400 and public message'Something has error'", () => {
    test("Then it should create an object with message 'General error', status 400 and public message'Something has error'", () => {
      const expectedError = {
        message: "General error",
        statusCode: 400,
        publicMessage: "Something has error",
      };

      const expectedMessage = expectedError.message;
      const expectedCode = expectedError.statusCode;
      const expectedPublicMessage = expectedError.publicMessage;

      const newCustomError = new CustomError(
        expectedMessage,
        expectedCode,
        expectedPublicMessage
      );

      expect(newCustomError).toHaveProperty("message", expectedMessage);
      expect(newCustomError).toHaveProperty("statusCode", expectedCode);
      expect(newCustomError).toHaveProperty(
        "publicMessage",
        expectedPublicMessage
      );
    });
  });
});
