"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const collection_repository_1 = require("./collection.repository");
const fs_1 = require("fs");
let CollectionService = (() => {
    let CollectionService = class CollectionService {
        constructor(collectionRepository) {
            this.collectionRepository = collectionRepository;
            this.logger = new common_1.Logger('TasksController');
        }
        async getUserCollections(user) {
            const collections = await this.collectionRepository.find({
                where: { userId: user.id },
            });
            if (collections.length !== 0) {
                collections.map(collection => {
                    delete collection.pictos;
                    return collection;
                });
            }
            return collections;
        }
        async createCollection(createCollectionDto, user, filename) {
            return this.collectionRepository.createCollection(createCollectionDto, user, filename);
        }
        async deleteCollection(id, user) {
            const collection = await this.collectionRepository.findOne({
                id: id,
                userId: user.id,
            });
            if (!collection) {
                throw new common_1.NotFoundException();
            }
            fs_1.unlink('./files/' + collection.path, () => {
                this.logger.verbose(`Collection of path "${collection.path}" successfully deleted`);
            });
            const result = await this.collectionRepository.delete({
                id: id,
                userId: user.id,
            });
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Collection with id "${id}" not found`);
            }
            return;
        }
        async getCollection(id, user) {
            const collection = await this.collectionRepository.findOne({
                where: { userId: user.id, id },
            });
            if (collection) {
                return collection;
            }
            else {
                throw new common_1.NotFoundException(`Collection with id: "${id} not found"`);
            }
        }
        async isCollection(id, user) {
            const found = await this.collectionRepository.findOne({
                where: { id, userId: user.id },
            });
            if (!found) {
                return false;
            }
            return true;
        }
    };
    CollectionService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(collection_repository_1.CollectionRepository)),
        __metadata("design:paramtypes", [collection_repository_1.CollectionRepository])
    ], CollectionService);
    return CollectionService;
})();
exports.CollectionService = CollectionService;
//# sourceMappingURL=collection.service.js.map