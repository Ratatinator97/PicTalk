"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionRepository = void 0;
const typeorm_1 = require("typeorm");
const collection_entity_1 = require("./collection.entity");
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../auth/user.entity");
let CollectionRepository = (() => {
    let CollectionRepository = class CollectionRepository extends typeorm_1.Repository {
        constructor() {
            super(...arguments);
            this.logger = new common_1.Logger('PictoRepository');
        }
        async createCollection(createCollectionDto, user, filename) {
            const { name, color } = createCollectionDto;
            const collection = new collection_entity_1.Collection();
            collection.name = name;
            collection.color = color;
            collection.user = user;
            collection.path = filename;
            try {
                await collection.save();
            }
            catch (error) {
                this.logger.error(`Failed to create a collection for user "${user.username}". Data: ${JSON.stringify(createCollectionDto)}`, error.stack);
                throw new common_1.InternalServerErrorException();
            }
            delete collection.user;
            return collection;
        }
    };
    CollectionRepository = __decorate([
        typeorm_1.EntityRepository(collection_entity_1.Collection)
    ], CollectionRepository);
    return CollectionRepository;
})();
exports.CollectionRepository = CollectionRepository;
//# sourceMappingURL=collection.repository.js.map