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
exports.PictoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const picto_repository_1 = require("./picto.repository");
const user_entity_1 = require("../auth/user.entity");
const fs_1 = require("fs");
let PictoService = (() => {
    let PictoService = class PictoService {
        constructor(pictoRepository) {
            this.pictoRepository = pictoRepository;
            this.logger = new common_1.Logger('PictoController');
        }
        async getPictos(id, user, collection) {
            const found = await this.pictoRepository.find({
                where: { fatherId: id, userId: user.id, collection: collection },
            });
            return found;
        }
        async createPicto(createPictoDto, user, filename, collection) {
            return this.pictoRepository.createPicto(createPictoDto, user, filename, collection);
        }
        async deletePicto(id, user) {
            const picto = await this.pictoRepository.findOne({
                where: { id: id, userId: user.id },
            });
            if (picto) {
                await this.deletePictoRecursive(picto, user);
            }
            else {
                throw new common_1.NotFoundException();
            }
        }
        async deletePictoRecursive(picto, user) {
            fs_1.unlink('./files/' + picto.path, () => {
                this.logger.verbose(`Picto of path "${picto.path}" successfully deleted`);
            });
            const pictos = await this.pictoRepository.find({
                where: { fatherId: picto.id, userId: user.id },
            });
            const result = await this.pictoRepository.delete({
                id: picto.id,
                userId: user.id,
            });
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Picto with id "${picto.id}" not found`);
            }
            if (pictos.length == 0) {
                return;
            }
            else {
                return pictos.map(picto => this.deletePictoRecursive(picto, user));
            }
        }
        async deletePictoOfCollection(collection, user) {
            const pictos = await this.pictoRepository.find({
                where: { collection: collection, userId: user.id },
            });
            this.deleteMultiple(pictos);
            try {
                await this.pictoRepository.delete({
                    userId: user.id,
                    collection: collection,
                });
            }
            catch (error) {
                throw new common_1.InternalServerErrorException();
            }
        }
        async isFolder(id, user) {
            const found = await this.pictoRepository.findOne({
                where: { id, userId: user.id },
            });
            if (!found) {
                return 0;
            }
            return found.folder;
        }
        async getCollection(id, user) {
            const picto = await this.pictoRepository.findOne({
                where: { id, userId: user.id },
            });
            try {
                const collection = picto.collection;
                return collection;
            }
            catch (error) {
                throw new common_1.NotFoundException();
            }
        }
        async deleteMultiple(pictos) {
            pictos.map(picto => {
                fs_1.unlink('./files/' + picto.path, () => {
                    this.logger.verbose(`Picto of path "${picto.path}" successfully deleted`);
                });
            });
        }
    };
    PictoService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(picto_repository_1.PictoRepository)),
        __metadata("design:paramtypes", [picto_repository_1.PictoRepository])
    ], PictoService);
    return PictoService;
})();
exports.PictoService = PictoService;
//# sourceMappingURL=pictos.service.js.map