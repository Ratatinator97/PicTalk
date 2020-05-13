"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PictoRepository = void 0;
const typeorm_1 = require("typeorm");
const picto_entity_1 = require("./picto.entity");
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../auth/user.entity");
let PictoRepository = (() => {
    let PictoRepository = class PictoRepository extends typeorm_1.Repository {
        constructor() {
            super(...arguments);
            this.logger = new common_1.Logger('PictoRepository');
        }
        async createPicto(createPictoDto, user, filename, collection) {
            const { speech, meaning, folder, fatherId } = createPictoDto;
            const picto = new picto_entity_1.Picto();
            if (fatherId != 0) {
                const found = await this.findOne({
                    where: { id: fatherId, userId: user.id },
                });
                if (!found) {
                    throw new common_1.NotFoundException();
                }
            }
            picto.speech = speech;
            picto.meaning = meaning;
            picto.folder = folder;
            picto.fatherId = fatherId;
            picto.path = filename;
            picto.user = user;
            picto.collection = collection;
            try {
                await picto.save();
            }
            catch (error) {
                this.logger.error(`Failed to create a picto for user "${user.username}". Data: ${JSON.stringify(createPictoDto)}`, error.stack);
                throw new common_1.InternalServerErrorException();
            }
            delete picto.user;
            delete picto.collection;
            return picto;
        }
    };
    PictoRepository = __decorate([
        typeorm_1.EntityRepository(picto_entity_1.Picto)
    ], PictoRepository);
    return PictoRepository;
})();
exports.PictoRepository = PictoRepository;
//# sourceMappingURL=picto.repository.js.map