import { Test } from '@nestjs/testing';
import { CollectionService } from './collection.service';
import { CollectionRepository } from './collection.repository';

const mockUser = { id: 12, username: 'Test user' };
const mockCollectionRepository = () => ({
  getCollection: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  createCollection: jest.fn(),
  deleteCollection: jest.fn(),
  editCollection: jest.fn(),
  map: jest.fn(),
});

describe('CollectionService', () => {
  let collectionService;
  let collectionRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CollectionService,
        { provide: CollectionRepository, useFactory: mockCollectionRepository },
      ],
    }).compile();

    collectionService = await module.get<CollectionService>(CollectionService);
    collectionRepository = await module.get<CollectionRepository>(
      CollectionRepository,
    );
  });

  describe('createCollection', () => {
    it('calls collectionRepository.createCollection() and returns the result', async () => {
      collectionRepository.createCollection.mockResolvedValue('someCollection');

      expect(collectionRepository.createCollection).not.toHaveBeenCalled();
      const createCollectionDto = {
        name: 'Test speech',
        color: 'Test meaning',
      };
      const result = await collectionService.createCollection(
        createCollectionDto,
        mockUser,
        'TestFileName',
      );
      expect(collectionRepository.createCollection).toHaveBeenCalledWith(
        createCollectionDto,
        mockUser,
        'TestFileName',
      );
      expect(result).toEqual('someCollection');
    });
  });
});
