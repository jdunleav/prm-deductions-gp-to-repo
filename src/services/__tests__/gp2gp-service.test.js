import axios from 'axios';
import config from '../../config';
import { sendRequest } from '../../services/gp2gp-service';

jest.mock('../../config/logging');
jest.mock('../../middleware/logging');

jest.mock('axios');

const axiosHeaders = {
    headers: {
        Authorization: config.gp2gpAuthKeys
    }
};

describe('gp2gp-adaptor', () => {
    it('should call axios with nhs number by default and return 200', () => {
        axios.get.mockResolvedValue({ status: 200 });
        const nhsNumber = '0123456789';

        return sendRequest(nhsNumber).then(response => {
            expect(response.status).toBe(200);
            expect(axios.get).toBeCalledWith(
                `${config.gp2gpUrl}/pds-retrieval/${nhsNumber}`,
                axiosHeaders
            );
        });
    });

    it('should call updateLogEventWithError if there is an error with axios.post request', () => {
        axios.get.mockRejectedValue(new Error());
        const nhsNumber = '0123456789';

        return expect(sendRequest(nhsNumber)).rejects.toThrowError(
            `POST ${config.gp2gpUrl}/pds-retrieval/${nhsNumber} - Request failed`
        );
    });
});