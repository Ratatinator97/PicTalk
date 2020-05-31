import { Test } from '@nestjs/testing';
import { PictoService } from './pictos.service';
import { PictoRepository } from './picto.repository';

const mockUser = { id: 12, username: 'Test user' };
const mockCollection = { id: 1, name: 'TestCollection' };
const mockPictoRepository = () => ({
  getPictos: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  createPicto: jest.fn(),
  deletePicto: jest.fn(),
  editPicto: jest.fn(),
});

describe('PictoService', () => {
  let pictoService;
  let pictoRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PictoService,
        { provide: PictoRepository, useFactory: mockPictoRepository },
      ],
    }).compile();

    pictoService = await module.get<PictoService>(PictoService);
    pictoRepository = await module.get<PictoRepository>(PictoRepository);
  });

  describe('getPictos', () => {
    it('gets all pictos from the repository', async () => {
      pictoRepository.find.mockResolvedValue('someValue');
      expect(pictoRepository.find).not.toHaveBeenCalled();
      const result = await pictoService.getPictos(1, mockUser, mockCollection);
      expect(pictoRepository.find).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('createPicto', () => {
    it('calls pictoRepository.createPicto() and returns the result', async () => {
      pictoRepository.createPicto.mockResolvedValue('somePicto');

      expect(pictoRepository.createPicto).not.toHaveBeenCalled();
      const createPictoDto = {
        speech: 'Test speech',
        meaning: 'Test meaning',
        folder: 0,
        fatherId: 0,
      };
      const result = await pictoService.createPicto(
        createPictoDto,
        mockUser,
        'filename',
        mockCollection,
      );
      expect(pictoRepository.createPicto).toHaveBeenCalledWith(
        createPictoDto,
        mockUser,
        'filename',
        mockCollection,
      );
      expect(result).toEqual('somePicto');
    });
  });
});
