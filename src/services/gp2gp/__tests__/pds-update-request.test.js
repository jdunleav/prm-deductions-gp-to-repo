import axios from 'axios';
import config from '../../../config';
import { sendUpdateRequest } from '../pds-update-request';

jest.mock('../../../config/logging');
jest.mock('../../../middleware/logging');
jest.mock('axios');

const mockNhsNumber = '01234567890';
const serialChangeNumber = '13';
const pdsId = 'hello';

const axiosHeaders = {
  headers: {
    Authorization: config.gp2gpAuthKeys
  }
};

const axiosBody = {
  serialChangeNumber,
  pdsId
};

describe('sendUpdateRequest', () => {
  it('should call axios with nhs number by default and return 204', () => {
    axios.patch.mockResolvedValue({ status: 204 });

    return sendUpdateRequest(serialChangeNumber, pdsId, mockNhsNumber).then(response => {
      expect(response.status).toBe(204);
      expect(axios.patch).toBeCalledWith(
        `${config.gp2gpUrl}/patient-demographics/${mockNhsNumber}`,
        axiosBody,
        axiosHeaders
      );
    });
  });

  it('should call updateLogEventWithError if there is an error with axios.patch request', () => {
    axios.patch.mockRejectedValue(new Error());

    return expect(sendUpdateRequest(serialChangeNumber, pdsId, mockNhsNumber)).rejects.toThrowError(
      `PATCH ${config.gp2gpUrl}/patient-demographics/${mockNhsNumber} - Request failed`
    );
  });
});
